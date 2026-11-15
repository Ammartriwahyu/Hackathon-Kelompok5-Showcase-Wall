import { WorkFormContainer } from "@/features/works";

export default async function EditWorkPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight text-slate-900">
          Edit Karya
        </h1>
        <p className="mt-1 text-sm text-slate-600">
          Perbarui informasi proyek atau ganti gambar cover karya.
        </p>
      </div>
      <WorkFormContainer workId={id} />
    </div>
  );
}
