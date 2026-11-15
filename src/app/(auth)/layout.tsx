import Link from "next/link";
import type { ReactNode } from "react";
import { ArrowLeft } from "lucide-react";

export default function AuthLayout({ children }: { children: ReactNode }) {
  const year = new Date().getFullYear();

  return (
    <div className="flex min-h-dvh flex-col bg-slate-50 text-slate-900">
      <header className="bg-white">
        <div className="flex h-20 items-center justify-between gap-4 px-4 sm:h-25 sm:px-12">
          <Link
            href="/"
            className="inline-flex min-h-11 items-center gap-3 rounded-lg text-base text-slate-700 hover:text-slate-900 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500 sm:text-xl"
          >
            <ArrowLeft className="size-5 sm:size-6" aria-hidden />
            <span className="hidden sm:inline">Kembali ke Galeri Publik</span>
            <span className="sm:hidden">Galeri</span>
          </Link>
          <div className="flex items-center gap-3">
            <span
              aria-hidden
              className="grid size-11 place-items-center rounded-xl bg-indigo-600 text-sm font-bold text-white sm:size-12.5 sm:text-lg"
            >
              BCC
            </span>
            <span className="text-base font-semibold tracking-tight sm:text-xl">BCC Showcase Wall</span>
            <span className="hidden rounded-full border border-indigo-200 bg-indigo-50 px-4 py-1 font-mono text-base text-indigo-700 md:inline">
              Autentikasi
            </span>
          </div>
        </div>
      </header>

      <main className="flex-1">{children}</main>

      <footer className="border-t border-slate-200 bg-white">
        <div className="flex flex-col items-center justify-between gap-4 px-4 py-8 text-base text-slate-500 sm:flex-row sm:px-12 sm:text-lg">
          <p>© {year} BCC Showcase Wall. Technical Editorial Gallery.</p>
          <nav aria-label="Tautan footer" className="flex flex-wrap justify-center gap-x-10 gap-y-2">
            <Link href="/" className="hover:text-slate-900">Galeri</Link>
            <Link href="/exhibition" className="hover:text-slate-900">Mode Pameran</Link>
            <span>Panduan Kurasi</span>
            <span>Kebijakan Privasi</span>
          </nav>
        </div>
      </footer>
    </div>
  );
}