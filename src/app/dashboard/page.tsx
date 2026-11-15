import { PlusCircle } from "lucide-react";
import Link from "next/link";
import {
  DashboardSummaryCards,
  DashboardWorkTable,
  DeleteConfirmModal,
  WorkPreviewModal,
} from "@/features/works";

export default function DashboardPage() {
  return (
    <div className="space-y-6">
      <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-slate-900">
            Dashboard Karya
          </h1>
          <p className="mt-1 text-sm text-slate-600">
            Kelola karya proyek, pantau status publikasi, dan pratinjau tampilan publik.
          </p>
        </div>

        <Link
          href="/dashboard/works/new"
          className="inline-flex h-11 items-center justify-center gap-2 rounded-xl bg-indigo-600 px-4 text-sm font-semibold text-white shadow-xs transition-colors hover:bg-indigo-700"
        >
          <PlusCircle className="size-4" aria-hidden />
          <span>Tambah Karya</span>
        </Link>
      </div>

      <DashboardSummaryCards />
      <DashboardWorkTable />
      <WorkPreviewModal />
      <DeleteConfirmModal />
    </div>
  );
}
