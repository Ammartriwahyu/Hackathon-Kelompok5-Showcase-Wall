import Link from "next/link";

export function SiteFooter() {
  const year = new Date().getFullYear();

  return (
    <footer className="border-t border-slate-200 bg-white">
      <div className="flex flex-col items-center justify-between gap-4 px-4 py-8 text-base text-slate-500 sm:flex-row sm:px-12 sm:text-lg">
        <p>© {year} BCC Showcase Wall. Technical Editorial Gallery.</p>
        <nav aria-label="Tautan footer" className="flex flex-wrap justify-center gap-x-10 gap-y-2">
          <Link href="/" className="rounded hover:text-slate-900 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500">
            Galeri
          </Link>
          <Link href="/exhibition" className="rounded hover:text-slate-900 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500">
            Mode Pameran
          </Link>
          <span>Panduan Kurasi</span>
          <span>Kebijakan Privasi</span>
        </nav>
      </div>
    </footer>
  );
}