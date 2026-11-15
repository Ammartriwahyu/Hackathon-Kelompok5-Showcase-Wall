"use client";

import { LayoutDashboard, LogIn, MonitorPlay } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import { useAuthStore } from "@/shared/stores/useAuthStore";
import Image from "next/image";
import logo from "@/assets/logo.png";

export function PublicNavbar() {
  const pathname = usePathname();
  const user = useAuthStore((s) => s.user);
  const isBootstrapped = useAuthStore((s) => s.isBootstrapped);

  return (
    <header className="sticky top-0 z-30 h-16 w-full border-b border-slate-200 bg-white/95 backdrop-blur-md">
      <div className="mx-auto flex h-full max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
        <Link href="/" className="flex items-center gap-2.5">
          <Image
            src={logo}
            alt=""
            aria-hidden
            priority
            className="size-11 rounded-xl object-contain sm:size-12.5"
          />
          <span className="font-bold tracking-tight text-slate-900">
            BCC Showcase Wall
          </span>
        </Link>

        <div className="flex items-center gap-3 sm:gap-6">
          <nav
            aria-label="Navigasi Publik"
            className="flex items-center gap-2 sm:gap-5"
          >
            <Link
              href="/"
              className={cn(
                "hidden text-sm font-semibold transition-colors sm:inline-block",
                pathname === "/"
                  ? "text-indigo-600"
                  : "text-slate-600 hover:text-indigo-600",
              )}
            >
              Galeri
            </Link>
            <Link
              href="/exhibition"
              className={cn(
                "inline-flex items-center gap-1.5 rounded-lg px-2.5 py-1.5 text-xs font-semibold transition-colors sm:px-0 sm:py-0 sm:text-sm",
                pathname === "/exhibition"
                  ? "text-indigo-600"
                  : "text-slate-600 hover:text-indigo-600",
              )}
            >
              <MonitorPlay className="size-4 sm:hidden" aria-hidden />
              <span>Mode Pameran</span>
            </Link>
          </nav>

          <div className="hidden h-4 w-px bg-slate-200 sm:block" />

          {isBootstrapped && user ? (
            <Link
              href="/dashboard"
              className="inline-flex h-9 items-center gap-1.5 rounded-lg bg-indigo-600 px-3.5 text-xs font-semibold text-white transition-colors hover:bg-indigo-700"
            >
              <LayoutDashboard className="size-3.5" aria-hidden />
              <span>Dashboard</span>
            </Link>
          ) : (
            <Link
              href="/login"
              className="inline-flex h-9 items-center gap-1.5 rounded-lg bg-indigo-600 px-3.5 text-xs font-semibold text-white transition-colors hover:bg-indigo-700"
            >
              <LogIn className="size-3.5" aria-hidden />
              <span>Masuk</span>
            </Link>
          )}
        </div>
      </div>
    </header>
  );
}
