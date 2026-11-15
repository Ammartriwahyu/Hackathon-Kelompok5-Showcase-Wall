"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import logo from "@/assets/logo.png";
import { ArrowLeft } from "lucide-react";
import { cn } from "@/lib/utils";

export function AuthNavbar() {
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <header
      className={cn(
        "sticky top-0 z-40 border-b transition-[background-color,border-color,box-shadow] duration-200",
        scrolled
          ? "border-slate-200 bg-white/85 shadow-sm backdrop-blur-md"
          : "border-transparent bg-white",
      )}
    >
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
          <Image
            src={logo}
            alt=""
            aria-hidden
            priority
            className="size-11 rounded-xl object-contain sm:size-12.5"
          />
          <span className="text-base font-semibold tracking-tight sm:text-xl">
            BCC Showcase Wall
          </span>
          <span className="hidden rounded-full border border-indigo-200 bg-indigo-50 px-4 py-1 font-mono text-base text-indigo-700 md:inline">
            Autentikasi
          </span>
        </div>
      </div>
    </header>
  );
}
