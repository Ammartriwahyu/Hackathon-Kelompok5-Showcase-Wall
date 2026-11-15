"use client";

import { Eye, EyeOff, Star } from "lucide-react";
import type { ManagedWork } from "@/shared/types/api";
import {
  usePublishWorkMutation,
  useToggleFeaturedMutation,
  useUnpublishWorkMutation,
} from "../hooks/useWorkMutations";

type AdminWorkActionsProps = {
  work: ManagedWork;
};

export function AdminWorkActions({ work }: AdminWorkActionsProps) {
  const publish = usePublishWorkMutation();
  const unpublish = useUnpublishWorkMutation();
  const toggleFeatured = useToggleFeaturedMutation();

  const isPublished = work.status === "Published";
  const isPending =
    publish.isPending || unpublish.isPending || toggleFeatured.isPending;

  return (
    <>
      {isPublished ? (
        <button
          type="button"
          disabled={isPending}
          onClick={() => unpublish.mutate(work.id)}
          title="Sembunyikan dari galeri publik"
          className="inline-flex h-8 items-center gap-1 rounded-lg border border-amber-200 bg-amber-50 px-2.5 text-xs font-medium text-amber-800 transition-colors hover:bg-amber-100 disabled:opacity-50"
        >
          <EyeOff className="size-3.5" aria-hidden />
          <span>Unpublish</span>
        </button>
      ) : (
        <button
          type="button"
          disabled={isPending}
          onClick={() => publish.mutate(work.id)}
          title="Terbitkan ke galeri publik"
          className="inline-flex h-8 items-center gap-1 rounded-lg border border-emerald-200 bg-emerald-50 px-2.5 text-xs font-medium text-emerald-700 transition-colors hover:bg-emerald-100 disabled:opacity-50"
        >
          <Eye className="size-3.5" aria-hidden />
          <span>Publish</span>
        </button>
      )}

      {isPublished && (
        <button
          type="button"
          disabled={isPending}
          onClick={() =>
            toggleFeatured.mutate({
              id: work.id,
              isFeatured: !work.is_featured,
            })
          }
          title={
            work.is_featured
              ? "Lepas dari karya unggulan"
              : "Jadikan karya unggulan"
          }
          className={
            work.is_featured
              ? "inline-flex h-8 items-center gap-1 rounded-lg border border-indigo-200 bg-indigo-50 px-2.5 text-xs font-medium text-indigo-700 transition-colors hover:bg-indigo-100 disabled:opacity-50"
              : "inline-flex h-8 items-center gap-1 rounded-lg border border-slate-200 bg-white px-2.5 text-xs font-medium text-slate-700 transition-colors hover:bg-slate-50 disabled:opacity-50"
          }
        >
          <Star
            className={`size-3.5 ${work.is_featured ? "fill-indigo-600 text-indigo-600" : ""}`}
            aria-hidden
          />
          <span>{work.is_featured ? "Lepas Unggulan" : "Unggulkan"}</span>
        </button>
      )}
    </>
  );
}
