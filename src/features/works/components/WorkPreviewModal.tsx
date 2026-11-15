"use client";

import { Modal } from "@/shared/components/ui/Modal";
import { WorkDetailContent } from "@/shared/components/work/WorkDetailContent";
import { useDashboardStore } from "../stores/useDashboardStore";

export function WorkPreviewModal() {
  const previewWork = useDashboardStore((s) => s.previewWork);
  const setPreviewWork = useDashboardStore((s) => s.setPreviewWork);

  return (
    <Modal
      isOpen={Boolean(previewWork)}
      onClose={() => setPreviewWork(null)}
      title={previewWork ? `Preview: ${previewWork.title}` : "Preview Karya"}
      className="max-w-4xl"
    >
      {previewWork && (
        <div className="max-h-[75vh] overflow-y-auto pr-1">
          <WorkDetailContent work={previewWork} />
        </div>
      )}
    </Modal>
  );
}
