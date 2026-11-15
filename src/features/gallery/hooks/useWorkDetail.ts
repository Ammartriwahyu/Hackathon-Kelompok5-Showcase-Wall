"use client";

import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import { getPublicWorkDetail } from "../services/gallery.service";

export function useWorkDetail(workId: string) {
  return useQuery({
    queryKey: ["works", "detail", workId],
    queryFn: () => getPublicWorkDetail(workId),
    enabled: Boolean(workId),
    retry: (failureCount, error) => {
      if (axios.isAxiosError(error) && error.response?.status === 404) {
        return false;
      }
      return failureCount < 1;
    },
  });
}
