import Link from "next/link";

const linkClass =
  "inline-flex min-h-11 items-center rounded text-brand-200 transition-colors hover:text-brand-50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-300 focus-visible:ring-offset-2 focus-visible:ring-offset-brand-800";

export function SiteFooter() {
  const year = new Date().getFullYear();

  return (
    <footer className="border-t border-brand-700 bg-brand-800">
      <div className="flex w-full flex-col items-center justify-between gap-2 px-4 py-6 text-sm sm:flex-row sm:px-6 lg:px-10">
        <p className="text-brand-200">
          © {year} <span className="font-semibold text-brand-50">BCC Showcase Wall</span> · Galeri Karya Anggota BCC
        </p>
        <nav aria-label="Tautan footer" className="flex gap-6">
          <Link href="/" className={linkClass}>
            Galeri
          </Link>
          <Link href="/exhibition" className={linkClass}>
            Mode Pameran
          </Link>
        </nav>
      </div>
    </footer>
  );
}