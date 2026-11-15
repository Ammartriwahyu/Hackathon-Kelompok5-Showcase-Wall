import type { ReactNode } from "react";
import Image from "next/image";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import authBackground from "@/assets/auth/background.jpg";
import logo from "@/assets/logo.png";
import { AuthSwitch } from "@/features/auth";

export default function AuthLayout({ children }: { children: ReactNode }) {
  const year = new Date().getFullYear();

  return (
    <div className="grid min-h-dvh bg-white text-foreground lg:grid-cols-2">
      <aside className="hidden lg:sticky lg:top-0 lg:block lg:h-dvh">
        <div className="absolute inset-0">
          <Image
            src={authBackground}
            alt=""
            fill
            priority
            placeholder="blur"
            sizes="50vw"
            className="object-cover"
          />
          <div aria-hidden className="absolute inset-0 bg-linear-to-b from-brand-900/40 via-transparent to-brand-900/70" />
        </div>
        <div className="relative flex h-full flex-col justify-between p-12 xl:p-16">
          <Link
            href="/"
            aria-label="Kembali ke Galeri BCC Showcase Wall"
            className="w-fit rounded-lg focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white"
          >
            <Image src={logo} alt="" priority className="h-14 w-auto" />
          </Link>
          <div className="text-white">
            <p className="text-lg font-medium text-white/80">Galeri Karya Anggota BCC</p>
            <p className="mt-2 text-4xl font-bold tracking-tight xl:text-5xl">BCC Showcase Wall</p>
          </div>
        </div>
      </aside>

      <main className="relative isolate flex flex-col overflow-hidden bg-brand-100/30 px-6 py-6 sm:px-12">
        <div
          aria-hidden
          className="pointer-events-none absolute inset-0 -z-10 bg-[radial-gradient(circle_at_top_right,var(--color-brand-100),transparent_45%),radial-gradient(circle_at_bottom_left,var(--color-brand-200),transparent_40%)]"
        />
        <div
          aria-hidden
          className="pointer-events-none absolute inset-0 -z-10 bg-[radial-gradient(var(--color-brand-200)_1px,transparent_1px)] opacity-50 [background-size:22px_22px] [mask-image:linear-gradient(to_bottom,black,transparent_60%)]"
        />

        <div className="flex items-center justify-between gap-4">
          <Link
            href="/"
            className="inline-flex min-h-11 items-center gap-2 rounded-lg text-sm text-muted hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
          >
            <ArrowLeft className="size-4" aria-hidden />
            <span className="hidden sm:inline">Kembali ke Galeri</span>
            <span className="sm:hidden">Galeri</span>
          </Link>
          <AuthSwitch />
        </div>

        <div className="flex flex-1 items-center justify-center py-10">
          <div className="w-full max-w-md">
            <Image src={logo} alt="BCC" className="mx-auto mb-8 h-10 w-auto lg:hidden" />
            {children}
          </div>
        </div>

        <footer className="flex flex-col items-center justify-between gap-2 text-xs text-brand-500 sm:flex-row">
          <p>© {year} BCC Showcase Wall</p>
          <nav aria-label="Tautan footer" className="flex gap-5">
            <Link href="/" className="rounded hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring">
              Galeri
            </Link>
            <Link href="/exhibition" className="rounded hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring">
              Mode Pameran
            </Link>
          </nav>
        </footer>
      </main>
    </div>
  );
}