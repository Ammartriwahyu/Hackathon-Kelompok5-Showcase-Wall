import { WorkFormContainer } from "@/features/works";

export default function NewWorkPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight text-foreground">
          Tambah Karya Baru
        </h1>
        <p className="mt-1 text-sm text-muted">
          Karya baru akan tersimpan sebagai Draft untuk ditinjau Admin sebelum ditayangkan.
        </p>
      </div>
      <WorkFormContainer />
    </div>
  );
}
