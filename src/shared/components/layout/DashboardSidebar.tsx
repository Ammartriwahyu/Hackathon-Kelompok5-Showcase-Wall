"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { AnimatePresence, motion } from "framer-motion";
import {
  ExternalLink,
  LayoutDashboard,
  Loader2,
  LogOut,
  Menu,
  MonitorPlay,
  ShieldCheck,
  UserRound,
  X,
} from "lucide-react";
import logo from "@/assets/logo.png";
import { cn } from "@/lib/utils";
import { useAuthStore } from "@/shared/stores/useAuthStore";

const MANAGE_ITEMS = [
  { href: "/dashboard", label: "Daftar Karya", icon: LayoutDashboard, exact: false },
] as const;

const PUBLIC_ITEMS = [
  { href: "/", label: "Lihat Galeri", icon: ExternalLink },
  { href: "/exhibition", label: "Mode Pameran", icon: MonitorPlay },
] as const;

const focusRing =
  "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-300 focus-visible:ring-offset-2 focus-visible:ring-offset-brand-800";

type DashboardSidebarProps = {
  onLogout: () => void;
  isLoggingOut: boolean;
};

type SidebarContentProps = DashboardSidebarProps & {
  layoutKey: string;
  onNavigate?: () => void;
};

function SidebarContent({ layoutKey, onNavigate, onLogout, isLoggingOut }: SidebarContentProps) {
  const pathname = usePathname();
  const user = useAuthStore((s) => s.user);
  const isAdmin = user?.role === "Admin";

  return (
    <div className="flex min-h-0 flex-1 flex-col">
      <nav aria-label="Menu dashboard" className="space-y-1">
        <p className="px-3 pb-2 text-xs font-semibold uppercase tracking-wider text-brand-300">Kelola</p>
        {MANAGE_ITEMS.map((item) => {
          const active = item.exact ? pathname === item.href : pathname.startsWith(item.href);
          const Icon = item.icon;
          return (
            <Link
              key={item.href}
              href={item.href}
              onClick={onNavigate}
              aria-current={active ? "page" : undefined}
              className={cn(
                "relative flex min-h-11 items-center gap-3 rounded-xl px-3 text-sm font-semibold transition-colors",
                focusRing,
                active ? "text-brand-50" : "text-brand-200 hover:bg-brand-700/50 hover:text-brand-50",
              )}
            >
              {active && (
                <motion.span
                  layoutId={`${layoutKey}-dashboard-active`}
                  className="absolute inset-0 rounded-xl bg-brand-700"
                  transition={{ type: "spring", stiffness: 420, damping: 34 }}
                />
              )}
              <Icon className="relative size-5" aria-hidden />
              <span className="relative">{item.label}</span>
            </Link>
          );
        })}

        <p className="px-3 pb-2 pt-6 text-xs font-semibold uppercase tracking-wider text-brand-300">Publik</p>
        {PUBLIC_ITEMS.map((item) => {
          const Icon = item.icon;
          return (
            <Link
              key={item.href}
              href={item.href}
              onClick={onNavigate}
              className={cn(
                "flex min-h-11 items-center gap-3 rounded-xl px-3 text-sm font-semibold text-brand-200 transition-colors hover:bg-brand-700/50 hover:text-brand-50",
                focusRing,
              )}
            >
              <Icon className="size-5" aria-hidden />
              <span>{item.label}</span>
            </Link>
          );
        })}
      </nav>

      <div className="mt-auto space-y-3 pt-6">
        <div className="rounded-xl border border-brand-700 bg-brand-900/40 p-3">
          <p className="truncate text-sm font-semibold text-brand-50">{user?.display_name}</p>
          <p className="truncate text-xs text-brand-300">{user?.email}</p>
          <span className="mt-2 inline-flex items-center gap-1 rounded-full bg-brand-700 px-2 py-0.5 text-xs font-medium text-brand-100">
            {isAdmin ? <ShieldCheck className="size-3.5" aria-hidden /> : <UserRound className="size-3.5" aria-hidden />}
            {isAdmin ? "Admin" : "Kontributor"}
          </span>
        </div>
        <button
          type="button"
          onClick={onLogout}
          disabled={isLoggingOut}
          className={cn(
            "flex min-h-11 w-full items-center justify-center gap-2 rounded-xl border border-brand-700 text-sm font-semibold text-brand-100 transition-colors hover:bg-brand-700 disabled:cursor-not-allowed disabled:opacity-60",
            focusRing,
          )}
        >
          {isLoggingOut ? <Loader2 className="size-4 animate-spin" aria-hidden /> : <LogOut className="size-4" aria-hidden />}
          {isLoggingOut ? "Keluar..." : "Keluar"}
        </button>
      </div>
    </div>
  );
}

export function DashboardSidebar({ onLogout, isLoggingOut }: DashboardSidebarProps) {
  const [open, setOpen] = useState(false);

  useEffect(() => {
    if (!open) return;
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") setOpen(false);
    };
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    window.addEventListener("keydown", onKeyDown);
    return () => {
      document.body.style.overflow = previousOverflow;
      window.removeEventListener("keydown", onKeyDown);
    };
  }, [open]);

  return (
    <>
      <header className="sticky top-0 z-30 flex h-16 items-center justify-between border-b border-brand-700 bg-brand-800/95 px-4 backdrop-blur lg:hidden">
        <Link href="/dashboard" className={cn("flex min-h-11 items-center gap-2.5 rounded-lg", focusRing)}>
          <Image src={logo} alt="" priority className="h-9 w-auto" />
          <span className="font-bold text-brand-50">Dashboard</span>
        </Link>
        <button
          type="button"
          onClick={() => setOpen(true)}
          aria-label="Buka menu"
          aria-expanded={open}
          aria-controls="dashboard-drawer"
          className={cn("grid size-11 place-items-center rounded-lg text-brand-100 hover:bg-brand-700", focusRing)}
        >
          <Menu className="size-6" aria-hidden />
        </button>
      </header>

      <AnimatePresence>
        {open && (
          <div className="fixed inset-0 z-50 lg:hidden">
            <motion.div
              className="absolute inset-0 bg-brand-900/60 backdrop-blur-xs"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setOpen(false)}
            />
            <motion.aside
              id="dashboard-drawer"
              role="dialog"
              aria-modal="true"
              aria-label="Menu dashboard"
              initial={{ x: "-100%" }}
              animate={{ x: 0 }}
              exit={{ x: "-100%" }}
              transition={{ type: "spring", stiffness: 380, damping: 38 }}
              className="absolute inset-y-0 left-0 flex w-72 max-w-[85vw] flex-col overflow-y-auto border-r border-brand-700 bg-brand-800/95 p-5 shadow-xl backdrop-blur"
            >
              <div className="mb-6 flex items-center justify-between">
                <Image src={logo} alt="" className="h-9 w-auto" />
                <button
                  type="button"
                  autoFocus
                  onClick={() => setOpen(false)}
                  aria-label="Tutup menu"
                  className={cn("grid size-11 place-items-center rounded-lg text-brand-100 hover:bg-brand-700", focusRing)}
                >
                  <X className="size-6" aria-hidden />
                </button>
              </div>
              <SidebarContent
                layoutKey="mobile"
                onNavigate={() => setOpen(false)}
                onLogout={onLogout}
                isLoggingOut={isLoggingOut}
              />
            </motion.aside>
          </div>
        )}
      </AnimatePresence>

      <aside className="hidden w-64 shrink-0 flex-col border-r border-brand-700 bg-brand-800/95 p-5 backdrop-blur lg:sticky lg:top-0 lg:flex lg:h-dvh lg:overflow-y-auto">
        <Link href="/" className={cn("flex min-h-11 items-center gap-2.5 rounded-lg", focusRing)}>
          <Image src={logo} alt="" priority className="h-10 w-auto" />
          <div>
            <span className="block text-sm font-bold leading-tight text-brand-50">Showcase Wall</span>
            <span className="text-xs text-brand-300">Panel Pengelolaan</span>
          </div>
        </Link>
        <div className="mt-8 flex min-h-0 flex-1 flex-col">
          <SidebarContent layoutKey="desktop" onLogout={onLogout} isLoggingOut={isLoggingOut} />
        </div>
      </aside>
    </>
  );
}