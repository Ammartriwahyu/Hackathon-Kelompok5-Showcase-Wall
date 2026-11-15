"use client";

import { AlertTriangle } from "lucide-react";
import { Button } from "@/shared/components/ui/Button";
import { Modal } from "@/shared/components/ui/Modal";
import { useDeleteWorkMutation } from "../hooks/useWorkMutations";
import { useDashboardStore } from "../stores/useDashboardStore";

export function DeleteConfirmModal() {
  const deleteTargetWork = useDashboardStore((s) => s.deleteTargetWork);
  const setDeleteTargetWork = useDashboardStore((s) => s.setDeleteTargetWork);
  const deleteMutation = useDeleteWorkMutation();

  const handleConfirm = () => {
    if (!deleteTargetWork) return;
    deleteMutation.mutate(deleteTargetWork.id);
  };

  return (
    <Modal
      isOpen={Boolean(deleteTargetWork)}
      onClose={() => {
        if (!deleteMutation.isPending) setDeleteTargetWork(null);
      }}
      title="Hapus Karya"
    >
      <div className="space-y-4">
        <div className="flex items-start gap-3 rounded-xl border border-red-200 bg-red-50 p-3.5 text-sm text-red-800">
          <AlertTriangle className="mt-0.5 size-5 shrink-0 text-red-600" aria-hidden />
          <div>
            <p className="font-semibold">Tindakan ini tidak dapat dibatalkan.</p>
            <p className="mt-1 text-xs text-red-700">
              Karya{" "}
              <strong className="font-semibold">
                &ldquo;{deleteTargetWork?.title}&rdquo;
              </strong>{" "}
              beserta gambar cover-nya akan dihapus permanen dari sistem dan galeri publik.
            </p>
          </div>
        </div>

        <div className="flex items-center justify-end gap-2.5 pt-2">
          <Button
            variant="outline"
            disabled={deleteMutation.isPending}
            onClick={() => setDeleteTargetWork(null)}
            className="h-10 px-4 text-sm"
          >
            Batal
          </Button>
          <Button
            onClick={handleConfirm}
            loading={deleteMutation.isPending}
            loadingText="Menghapus..."
            className="h-10 bg-red-600 px-4 text-sm text-white hover:bg-red-700"
          >
            Hapus Karya
          </Button>
        </div>
      </div>
    </Modal>
  );
}
