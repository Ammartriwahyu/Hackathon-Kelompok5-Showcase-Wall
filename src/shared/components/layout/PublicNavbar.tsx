"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { motion } from "framer-motion";
import { Images, LayoutDashboard, LogIn, MonitorPlay } from "lucide-react";
import logo from "@/assets/logo.png";
import { cn } from "@/lib/utils";
import { useAuthStore } from "@/shared/stores/useAuthStore";

const NAV_ITEMS = [
  { href: "/", label: "Galeri", icon: Images },
  { href: "/exhibition", label: "Mode Pameran", icon: MonitorPlay },
] as const;

const focusRing =
  "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2";

export function PublicNavbar() {
  const pathname = usePathname();
  const user = useAuthStore((s) => s.user);
  const isBootstrapped = useAuthStore((s) => s.isBootstrapped);
  const isLoggedIn = isBootstrapped && !!user;

  return (
    <header className="sticky top-0 z-30 w-full border-b border-border bg-background/90 backdrop-blur-md">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between gap-3 px-4 sm:px-6 lg:px-8">
        <Link href="/" className={cn("flex min-h-11 items-center gap-2.5 rounded-lg", focusRing)}>
          <Image src={logo} alt="" priority className="h-8 w-auto" />
          <span className="hidden font-bold tracking-tight text-foreground sm:inline">BCC Showcase Wall</span>
        </Link>

        <div className="flex items-center gap-2 sm:gap-4">
          <nav aria-label="Navigasi publik" className="flex items-center gap-1">
            {NAV_ITEMS.map((item) => {
              const active = item.href === "/" ? pathname === "/" : pathname.startsWith(item.href);
              const Icon = item.icon;
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  aria-current={active ? "page" : undefined}
                  aria-label={item.label}
                  className={cn(
                    "relative inline-flex min-h-11 items-center gap-1.5 rounded-lg px-3 text-sm font-semibold transition-colors",
                    focusRing,
                    active ? "text-primary" : "text-muted hover:text-foreground",
                  )}
                >
                  {active && (
                    <motion.span
                      layoutId="public-nav-active"
                      className="absolute inset-0 rounded-lg bg-primary-soft"
                      transition={{ type: "spring", stiffness: 420, damping: 34 }}
                    />
                  )}
                  <Icon className="relative size-4" aria-hidden />
                  <span className="relative hidden sm:inline">{item.label}</span>
                </Link>
              );
            })}
          </nav>

          <span aria-hidden className="hidden h-5 w-px bg-border sm:block" />

          <Link
            href={isLoggedIn ? "/dashboard" : "/login"}
            className={cn(
              "inline-flex min-h-11 items-center gap-1.5 rounded-lg bg-primary px-4 text-sm font-semibold text-primary-foreground transition-colors hover:bg-primary-hover",
              focusRing,
            )}
          >
            {isLoggedIn ? (
              <LayoutDashboard className="size-4" aria-hidden />
            ) : (
              <LogIn className="size-4" aria-hidden />
            )}
            <span>{isLoggedIn ? "Dashboard" : "Masuk"}</span>
          </Link>
        </div>
      </div>
    </header>
  );
}