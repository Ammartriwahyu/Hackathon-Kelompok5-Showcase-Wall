import type { ReactNode } from "react";
import Image from "next/image";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import authBackground from "@/assets/auth/background.jpg";
import logo from "@/assets/logo.png";

export default function AuthLayout({ children }: { children: ReactNode }) {
  return (
    <div className="grid min-h-dvh bg-white text-slate-900 lg:grid-cols-2">
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
          <div aria-hidden className="absolute inset-0 bg-linear-to-b from-slate-950/40 via-transparent to-slate-950/70" />
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

      <main className="flex flex-col px-6 py-6 sm:px-12">
        <div className="flex items-center justify-between">
          <Link
            href="/"
            className="inline-flex min-h-11 items-center gap-2 rounded-lg text-sm text-slate-600 hover:text-slate-900 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500"
          >
            <ArrowLeft className="size-4" aria-hidden />
            Kembali ke Galeri
          </Link>
          <Image src={logo} alt="BCC" className="h-9 w-auto lg:hidden" />
        </div>
        <div className="flex flex-1 items-center justify-center py-10">
          <div className="w-full max-w-md">{children}</div>
        </div>
      </main>
    </div>
  );
}