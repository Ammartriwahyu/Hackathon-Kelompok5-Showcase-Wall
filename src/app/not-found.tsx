import { ArrowLeft, Compass } from "lucide-react";
import Link from "next/link";

export default function NotFoundPage() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center bg-slate-50 px-4 text-center">
      <div className="flex size-16 items-center justify-center rounded-2xl bg-indigo-50 text-indigo-600">
        <Compass className="size-8" aria-hidden />
      </div>
      <h1 className="mt-5 text-2xl font-bold tracking-tight text-slate-900">
        Halaman Tidak Ditemukan
      </h1>
      <p className="mt-2 max-w-md text-sm text-slate-600">
        Maaf, halaman yang kamu cari tidak tersedia atau alamatnya sudah berubah.
      </p>
      <Link
        href="/"
        className="mt-6 inline-flex h-11 items-center gap-2 rounded-xl bg-indigo-600 px-5 text-sm font-semibold text-white transition-colors hover:bg-indigo-700"
      >
        <ArrowLeft className="size-4" aria-hidden />
        <span>Kembali ke Galeri Publik</span>
      </Link>
    </main>
  );
}
