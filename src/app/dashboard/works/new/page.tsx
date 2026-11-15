import { WorkFormContainer } from "@/features/works";

export default function NewWorkPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight text-slate-900">
          Tambah Karya Baru
        </h1>
        <p className="mt-1 text-sm text-slate-600">
          Karya baru akan tersimpan sebagai Draft untuk ditinjau Admin sebelum ditayangkan.
        </p>
      </div>
      <WorkFormContainer />
    </div>
  );
}
