import { WorkDetailView } from "@/features/gallery";

export default async function PublicWorkDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;

  return <WorkDetailView workId={id} />;
}
