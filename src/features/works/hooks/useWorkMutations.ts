"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { getErrorMessage } from "@/lib/axios";
import {
  deleteWork,
  publishWork,
  toggleFeaturedWork,
  unpublishWork,
} from "../services/work.service";
import { useDashboardStore } from "../stores/useDashboardStore";

export function useDeleteWorkMutation() {
  const queryClient = useQueryClient();
  const setDeleteTargetWork = useDashboardStore((s) => s.setDeleteTargetWork);

  return useMutation({
    mutationFn: deleteWork,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["dashboard"] });
      queryClient.invalidateQueries({ queryKey: ["works"] });
      setDeleteTargetWork(null);
      toast.success("Karya berhasil dihapus.");
    },
    onError: (err) => {
      toast.error(getErrorMessage(err, "Gagal menghapus karya."));
    },
  });
}

export function usePublishWorkMutation() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: publishWork,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["dashboard"] });
      queryClient.invalidateQueries({ queryKey: ["works"] });
      toast.success("Karya berhasil diterbitkan ke galeri publik.");
    },
    onError: (err) => {
      toast.error(getErrorMessage(err, "Gagal menerbitkan karya."));
    },
  });
}

export function useUnpublishWorkMutation() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: unpublishWork,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["dashboard"] });
      queryClient.invalidateQueries({ queryKey: ["works"] });
      toast.success("Karya disembunyikan dari galeri publik.");
    },
    onError: (err) => {
      toast.error(getErrorMessage(err, "Gagal menyembunyikan karya."));
    },
  });
}

export function useToggleFeaturedMutation() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, isFeatured }: { id: string; isFeatured: boolean }) =>
      toggleFeaturedWork(id, isFeatured),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ["dashboard"] });
      queryClient.invalidateQueries({ queryKey: ["works"] });
      toast.success(
        variables.isFeatured
          ? "Karya dipilih sebagai Unggulan."
          : "Penanda Unggulan dilepas.",
      );
    },
    onError: (err) => {
      toast.error(getErrorMessage(err, "Gagal memperbarui status unggulan."));
    },
  });
}
