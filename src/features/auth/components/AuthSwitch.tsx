"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";

const ITEMS = [
  { href: "/login", label: "Masuk" },
  { href: "/register", label: "Daftar" },
] as const;

export function AuthSwitch() {
  const pathname = usePathname();

  return (
    <nav aria-label="Pilih halaman autentikasi" className="inline-flex rounded-xl border border-slate-200 bg-white p-1 shadow-sm">
      {ITEMS.map((item) => {
        const active = pathname === item.href;
        return (
          <Link
            key={item.href}
            href={item.href}
            aria-current={active ? "page" : undefined}
            className={cn(
              "relative inline-flex min-h-9 items-center rounded-lg px-4 text-sm font-medium transition-colors",
              "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500",
              active ? "text-white" : "text-slate-600 hover:text-slate-900",
            )}
          >
            {active && (
              <motion.span
                layoutId="auth-switch"
                className="absolute inset-0 rounded-lg bg-indigo-600"
                transition={{ type: "spring", stiffness: 420, damping: 34 }}
              />
            )}
            <span className="relative">{item.label}</span>
          </Link>
        );
      })}
    </nav>
  );
}