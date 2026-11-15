"use client";

import { ExternalLink, LayoutDashboard, LogOut, PlusCircle } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useLogoutMutation } from "@/features/auth";
import { cn } from "@/lib/utils";
import { Badge } from "@/shared/components/ui/Badge";
import { Button } from "@/shared/components/ui/Button";
import { useAuthStore } from "@/shared/stores/useAuthStore";

const NAV_ITEMS = [
  { href: "/dashboard", label: "Daftar Karya", icon: LayoutDashboard },
  { href: "/dashboard/works/new", label: "Tambah Karya", icon: PlusCircle },
];

export function DashboardSidebar() {
  const pathname = usePathname();
  const user = useAuthStore((s) => s.user);
  const logout = useLogoutMutation();

  return (
    <>
      {/* Mobile Topbar */}
      <header className="sticky top-0 z-30 flex h-16 items-center justify-between border-b border-slate-200 bg-white px-4 lg:hidden">
        <Link href="/dashboard" className="flex items-center gap-2">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-indigo-600 text-xs font-bold text-white">
            BCC
          </div>
          <span className="font-bold text-slate-900">Dashboard</span>
        </Link>

        <div className="flex items-center gap-2">
          <Link
            href="/dashboard/works/new"
            className="inline-flex h-9 items-center gap-1.5 rounded-lg bg-indigo-600 px-3 text-xs font-semibold text-white hover:bg-indigo-700"
          >
            <PlusCircle className="size-4" aria-hidden />
            <span>Buat</span>
          </Link>
          <Button
            variant="ghost"
            onClick={() => logout.mutate()}
            loading={logout.isPending}
            aria-label="Keluar"
            className="h-9 px-2.5 text-xs"
          >
            <LogOut className="size-4" aria-hidden />
          </Button>
        </div>
      </header>

      {/* Desktop Sidebar */}
      <aside className="hidden w-64 shrink-0 flex-col justify-between border-r border-slate-200 bg-white p-5 lg:flex">
        <div className="space-y-6">
          <Link href="/" className="flex items-center gap-2.5">
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-indigo-600 text-xs font-bold tracking-wider text-white shadow-xs">
              BCC
            </div>
            <div>
              <span className="block text-sm font-bold leading-tight text-slate-900">
                Showcase Wall
              </span>
              <span className="text-[11px] text-slate-500">Panel Pengelolaan</span>
            </div>
          </Link>

          <nav aria-label="Navigasi Dashboard" className="space-y-1">
            {NAV_ITEMS.map(({ href, label, icon: Icon }) => {
              const isActive = pathname === href;
              return (
                <Link
                  key={href}
                  href={href}
                  className={cn(
                    "flex items-center gap-2.5 rounded-xl px-3 py-2.5 text-sm font-medium transition-colors",
                    isActive
                      ? "bg-indigo-50 text-indigo-700"
                      : "text-slate-600 hover:bg-slate-100 hover:text-slate-900",
                  )}
                >
                  <Icon className="size-4 shrink-0" aria-hidden />
                  <span>{label}</span>
                </Link>
              );
            })}

            <Link
              href="/"
              className="flex items-center gap-2.5 rounded-xl px-3 py-2.5 text-sm font-medium text-slate-600 transition-colors hover:bg-slate-100 hover:text-slate-900"
            >
              <ExternalLink className="size-4 shrink-0" aria-hidden />
              <span>Lihat Galeri Publik</span>
            </Link>
          </nav>
        </div>

        <div className="space-y-3 border-t border-slate-100 pt-4">
          {user && (
            <div className="rounded-xl bg-slate-50 p-3">
              <div className="flex items-center justify-between gap-2">
                <p className="truncate text-sm font-semibold text-slate-900">
                  {user.display_name}
                </p>
                <Badge variant={user.role === "Admin" ? "primary" : "neutral"}>
                  {user.role}
                </Badge>
              </div>
              <p className="mt-0.5 truncate text-xs text-slate-500">{user.email}</p>
            </div>
          )}

          <Button
            variant="outline"
            onClick={() => logout.mutate()}
            loading={logout.isPending}
            loadingText="Keluar..."
            className="h-10 w-full text-sm"
          >
            <LogOut className="size-4" aria-hidden />
            <span>Keluar</span>
          </Button>
        </div>
      </aside>
    </>
  );
}
