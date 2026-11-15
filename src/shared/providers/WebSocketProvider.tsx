"use client";

import { useEffect, useRef } from "react";
import { type InfiniteData, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import type {
  ApiResponse,
  PublicWork,
  WsWorkEvent,
} from "@/shared/types/api";

const BASE_RECONNECT_DELAY_MS = 1000;
const MAX_RECONNECT_DELAY_MS = 30000;
const RECONNECT_JITTER_MS = 500;

function resolveWsUrl(): string | null {
  const explicit = process.env.NEXT_PUBLIC_WS_URL?.trim();
  if (explicit) {
    return explicit;
  }

  const apiUrl = process.env.NEXT_PUBLIC_API_URL?.trim();
  if (!apiUrl) {
    return null;
  }

  try {
    const parsed = new URL(apiUrl);
    const protocol = parsed.protocol === "https:" ? "wss:" : "ws:";
    return `${protocol}//${parsed.host}/ws/wall`;
  } catch {
    return null;
  }
}

function resolveCoverUrl(coverUrl: string): string {
  if (!coverUrl.startsWith("/")) {
    return coverUrl;
  }

  const apiUrl = process.env.NEXT_PUBLIC_API_URL?.trim();
  if (!apiUrl) {
    return coverUrl;
  }

  try {
    return new URL(coverUrl, apiUrl).toString();
  } catch {
    return coverUrl;
  }
}

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null;
}

function isWsWorkEvent(value: unknown): value is WsWorkEvent {
  if (!isRecord(value)) {
    return false;
  }

  if (typeof value.type !== "string" || typeof value.seq !== "number") {
    return false;
  }

  if (!isRecord(value.payload) || typeof value.payload.id !== "string") {
    return false;
  }

  if (value.type === "work.published") {
    return (
      typeof value.payload.title === "string" &&
      typeof value.payload.summary === "string" &&
      typeof value.payload.category === "string" &&
      typeof value.payload.cover_url === "string" &&
      Array.isArray(value.payload.tech_stack) &&
      Array.isArray(value.payload.team_members)
    );
  }

  return value.type === "work.unpublished" || value.type === "work.deleted";
}

function upsertExhibitionWork(
  works: PublicWork[] | undefined,
  payload: Omit<PublicWork, "is_featured">,
): PublicWork[] | undefined {
  if (!works) {
    return undefined;
  }

  const existing = works.find((work) => work.id === payload.id);
  const nextWork: PublicWork = {
    ...payload,
    cover_url: resolveCoverUrl(payload.cover_url),
    is_featured: existing?.is_featured ?? false,
  };

  return [...works.filter((work) => work.id !== payload.id), nextWork].sort(
    (a, b) => a.title.localeCompare(b.title),
  );
}

function removeWorkFromPublicPages(
  old: InfiniteData<ApiResponse<PublicWork[]>> | undefined,
  workId: string,
): InfiniteData<ApiResponse<PublicWork[]>> | undefined {
  if (!old) {
    return undefined;
  }

  return {
    ...old,
    pages: old.pages.map((page) => ({
      ...page,
      data: page.data.filter((work) => work.id !== workId),
    })),
  };
}

/**
 * Menyediakan sinkronisasi cache TanStack Query secara realtime melalui koneksi
 * WebSocket read-only ke `/ws/wall` dengan auto-reconnect dan deteksi selisih `seq`.
 */
export function WebSocketProvider({ children }: { children: React.ReactNode }) {
  const queryClient = useQueryClient();
  const lastSeqRef = useRef<number | null>(null);

  useEffect(() => {
    const wsUrl = resolveWsUrl();
    if (!wsUrl) {
      return;
    }

    let isUnmounted = false;
    let hasDisconnected = false;
    let reconnectAttempt = 0;
    let reconnectTimer: ReturnType<typeof setTimeout> | null = null;
    let socket: WebSocket | null = null;

    const handleEvent = (event: WsWorkEvent) => {
      if (lastSeqRef.current !== null && event.seq === lastSeqRef.current) {
        return;
      }

      const hasSeqReset =
        lastSeqRef.current !== null && event.seq < lastSeqRef.current;
      const hasSeqGap =
        lastSeqRef.current !== null && event.seq > lastSeqRef.current + 1;
      lastSeqRef.current = event.seq;

      if (hasSeqGap || hasSeqReset) {
        void queryClient.invalidateQueries({ queryKey: ["works"] });
      }

      if (event.type === "work.published") {
        queryClient.setQueryData<PublicWork[]>(["works", "exhibition"], (old) =>
          upsertExhibitionWork(old, event.payload),
        );
        void queryClient.invalidateQueries({ queryKey: ["works", "public"] });
        void queryClient.invalidateQueries({ queryKey: ["works", "facets"] });
        void queryClient.invalidateQueries({
          queryKey: ["works", "detail", event.payload.id],
        });
        toast.info(`Karya baru dipublikasikan: ${event.payload.title}`);
      } else {
        const targetId = event.payload.id;

        queryClient.setQueriesData<InfiniteData<ApiResponse<PublicWork[]>>>(
          { queryKey: ["works", "public"] },
          (old) => removeWorkFromPublicPages(old, targetId),
        );
        queryClient.setQueryData<PublicWork | null>(
          ["works", "featured"],
          (old) => (old?.id === targetId ? null : old),
        );
        queryClient.setQueryData<PublicWork[]>(
          ["works", "exhibition"],
          (old) => (old ? old.filter((work) => work.id !== targetId) : undefined),
        );
        queryClient.setQueryData(["works", "detail", targetId], null);
        void queryClient.invalidateQueries({ queryKey: ["works", "facets"] });
      }

      void queryClient.invalidateQueries({ queryKey: ["dashboard"] });
    };

    const scheduleReconnect = () => {
      if (isUnmounted || reconnectTimer !== null) {
        return;
      }

      const expDelay = Math.min(
        MAX_RECONNECT_DELAY_MS,
        BASE_RECONNECT_DELAY_MS * 2 ** reconnectAttempt,
      );
      const jitter = Math.floor(Math.random() * RECONNECT_JITTER_MS);
      reconnectAttempt += 1;

      reconnectTimer = setTimeout(() => {
        reconnectTimer = null;
        connect();
      }, expDelay + jitter);
    };

    const connect = () => {
      if (isUnmounted) {
        return;
      }

      const ws = new WebSocket(wsUrl);
      socket = ws;

      ws.onopen = () => {
        reconnectAttempt = 0;

        if (hasDisconnected) {
          hasDisconnected = false;
          void queryClient.invalidateQueries({ queryKey: ["works"] });
          void queryClient.invalidateQueries({ queryKey: ["dashboard"] });
        }
      };

      ws.onmessage = (messageEvent) => {
        let parsed: unknown;
        try {
          parsed = JSON.parse(String(messageEvent.data));
        } catch {
          return;
        }

        if (isWsWorkEvent(parsed)) {
          handleEvent(parsed);
        }
      };

      ws.onerror = () => {
        if (
          ws.readyState === WebSocket.OPEN ||
          ws.readyState === WebSocket.CONNECTING
        ) {
          ws.close();
        }
      };

      ws.onclose = () => {
        if (socket === ws) {
          socket = null;
        }
        if (isUnmounted) {
          return;
        }
        hasDisconnected = true;
        scheduleReconnect();
      };
    };

    connect();

    return () => {
      isUnmounted = true;
      if (reconnectTimer !== null) {
        clearTimeout(reconnectTimer);
        reconnectTimer = null;
      }
      if (socket) {
        socket.onopen = null;
        socket.onmessage = null;
        socket.onerror = null;
        socket.onclose = null;
        socket.close();
        socket = null;
      }
    };
  }, [queryClient]);

  return <>{children}</>;
}
