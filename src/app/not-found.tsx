import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { Mascot } from "@/shared/components/ui/Mascot";

export default function NotFoundPage() {
  return (
    <main className="flex min-h-dvh flex-col items-center justify-center bg-brand-100/30 px-4 text-center">
      <Mascot variant="halo" priority className="w-40 sm:w-48" />
      <h1 className="mt-6 text-2xl font-bold tracking-tight text-foreground">Halaman tidak ditemukan</h1>
      <p className="mt-2 max-w-md text-sm text-muted">
        Alamat yang kamu buka tidak tersedia atau sudah dipindahkan.
      </p>
      <Link
        href="/"
        className="mt-6 inline-flex h-11 items-center gap-2 rounded-xl bg-primary px-5 text-sm font-semibold text-primary-foreground transition-colors hover:bg-primary-hover focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
      >
        <ArrowLeft className="size-4" aria-hidden />
        Kembali ke galeri
      </Link>
    </main>
  );
}