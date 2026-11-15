import Link from "next/link";
import type { ReactNode } from "react";
import { ArrowLeft } from "lucide-react";

export default function AuthLayout({ children }: { children: ReactNode }) {
  return (
    <div className="flex min-h-dvh flex-col bg-slate-50 text-slate-900">
      <header className="border-b border-slate-200 bg-white">
        <div className="mx-auto flex max-w-6xl items-center justify-between gap-4 px-4 py-3 sm:px-6">
          <Link
            href="/"
            className="inline-flex min-h-11 items-center gap-2 rounded-lg text-sm font-medium text-slate-600 hover:text-slate-900 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500"
          >
            <ArrowLeft className="size-4" aria-hidden />
            <span className="hidden sm:inline">Kembali ke Galeri Publik</span>
            <span className="sm:hidden">Galeri</span>
          </Link>
          <div className="flex items-center gap-2">
            <span className="grid size-9 place-items-center rounded-lg bg-indigo-600 text-xs font-bold text-white" aria-hidden>
              BCC
            </span>
            <span className="text-sm font-semibold sm:text-base">BCC Showcase Wall</span>
            <span className="hidden rounded-full border border-indigo-200 bg-indigo-50 px-2.5 py-0.5 font-mono text-xs text-indigo-700 sm:inline">
              Autentikasi
            </span>
          </div>
        </div>
      </header>

      <main className="flex flex-1 items-center justify-center px-4 py-10">
        <div className="w-full max-w-md overflow-hidden rounded-2xl border border-slate-200 bg-white p-6 shadow-sm sm:p-8">
          {children}
        </div>
      </main>

      <footer className="border-t border-slate-200 bg-white">
        <div className="mx-auto flex max-w-6xl flex-col items-center justify-between gap-3 px-4 py-5 text-sm text-slate-500 sm:flex-row sm:px-6">
          <p>© 2026 BCC Showcase Wall.</p>
          <nav aria-label="Tautan footer" className="flex gap-6">
            <Link href="/" className="hover:text-slate-900">Galeri</Link>
            <Link href="/exhibition" className="hover:text-slate-900">Mode Pameran</Link>
          </nav>
        </div>
      </footer>
    </div>
  );
}