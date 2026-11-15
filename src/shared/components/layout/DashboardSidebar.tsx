"use client";

import {
  ExternalLink,
  LayoutDashboard,
  LogOut,
  PlusCircle,
} from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useLogoutMutation } from "@/features/auth";
import { cn } from "@/lib/utils";
import { Badge } from "@/shared/components/ui/Badge";
import { Button } from "@/shared/components/ui/Button";
import { useAuthStore } from "@/shared/stores/useAuthStore";
import Image from "next/image";
import logo from "@/assets/logo.png";

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
      <header className="sticky top-0 z-30 flex h-16 items-center justify-between border-b border-border bg-background/90 px-4 backdrop-blur-md lg:hidden">
        <Link href="/dashboard" className="flex items-center gap-2">
          <Image src={logo} alt="" priority className="h-8 w-auto" />
          <span className="font-bold text-foreground">Dashboard</span>
        </Link>

        <div className="flex items-center gap-2">
          <Link
            href="/dashboard/works/new"
            className="inline-flex h-9 items-center gap-1.5 rounded-lg bg-primary px-3 text-xs font-semibold text-primary-foreground transition-colors hover:bg-primary-hover focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
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
      <aside className="hidden w-64 shrink-0 flex-col justify-between border-r border-border bg-background p-5 lg:flex">
        <div className="space-y-6">
          <Link href="/" className="flex items-center gap-2.5">
            <Image src={logo} alt="" className="h-9 w-auto" />
            <div>
              <span className="block text-sm font-bold leading-tight text-foreground">
                Showcase Wall
              </span>
              <span className="text-[11px] text-muted">
                Panel Pengelolaan
              </span>
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
                    "flex items-center gap-2.5 rounded-xl px-3 py-2.5 text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring",
                    isActive
                      ? "bg-primary-soft text-primary"
                      : "text-muted hover:bg-primary-soft/50 hover:text-foreground",
                  )}
                >
                  <Icon className="size-4 shrink-0" aria-hidden />
                  <span>{label}</span>
                </Link>
              );
            })}

            <Link
              href="/"
              className="flex items-center gap-2.5 rounded-xl px-3 py-2.5 text-sm font-medium text-muted transition-colors hover:bg-primary-soft/50 hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
            >
              <ExternalLink className="size-4 shrink-0" aria-hidden />
              <span>Lihat Galeri Publik</span>
            </Link>
          </nav>
        </div>

        <div className="space-y-3 border-t border-border pt-4">
          {user && (
            <div className="rounded-xl bg-primary-soft/40 p-3">
              <div className="flex items-center justify-between gap-2">
                <p className="truncate text-sm font-semibold text-foreground">
                  {user.display_name}
                </p>
                <Badge variant={user.role === "Admin" ? "primary" : "neutral"}>
                  {user.role}
                </Badge>
              </div>
              <p className="mt-0.5 truncate text-xs text-muted">
                {user.email}
              </p>
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
