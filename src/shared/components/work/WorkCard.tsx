import { resolveMediaUrl } from "@/lib/utils";
import { ImageOff, Star } from "lucide-react";
import Link from "next/link";
import type { ReactNode } from "react";
import { cn } from "@/lib/utils";

export type WorkCardData = {
  id?: string;
  title: string;
  summary: string;
  category: string;
  tech_stack: string[];
  team_members: string[];
  cover_url: string;
  is_featured?: boolean;
};

type WorkCardProps = {
  work: WorkCardData;
  href?: string;
  actionSlot?: ReactNode;
  className?: string;
};

export function WorkCard({ work, href, actionSlot, className }: WorkCardProps) {
  const visibleTech = work.tech_stack.slice(0, 3);
  const extraTechCount = work.tech_stack.length - visibleTech.length;

  const cardBody = (
    <>
      <div>
        {/* 16:9 Cover */}
        <div className="relative aspect-video w-full overflow-hidden border-b border-brand-100 bg-brand-100/60">
          {work.cover_url ? (
            <img
              src={resolveMediaUrl(work.cover_url)}
              alt={work.title || "Cover karya"}
              className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
            />
          ) : (
            <div className="flex h-full w-full flex-col items-center justify-center gap-1.5 text-brand-400">
              <ImageOff className="size-6" aria-hidden />
              <span className="text-xs">Belum ada cover</span>
            </div>
          )}

          <div className="absolute top-3 left-3 flex items-center gap-1.5">
            <span className="rounded-md border border-border bg-white/95 px-2 py-0.5 text-[11px] font-semibold text-brand-800 shadow-xs backdrop-blur-xs">
              {work.category || "Kategori"}
            </span>
            {work.is_featured && (
              <span className="inline-flex items-center gap-1 rounded-md border border-amber-200 bg-amber-50/95 px-2 py-0.5 text-[11px] font-semibold text-amber-700 shadow-xs">
                <Star
                  className="size-3 fill-amber-500 text-amber-500"
                  aria-hidden
                />
                Unggulan
              </span>
            )}
          </div>

          {actionSlot && (
            <div className="absolute top-3 right-3 z-10">{actionSlot}</div>
          )}
        </div>

        {/* Content Body */}
        <div className="p-5">
          <h3 className="line-clamp-2 text-base font-bold leading-snug text-foreground transition-colors group-hover:text-primary">
            {work.title || "Judul Karya"}
          </h3>
          <p className="mt-2 line-clamp-2 text-xs leading-relaxed text-muted">
            {work.summary || "Ringkasan singkat karya akan tampil di sini."}
          </p>

          {work.tech_stack.length > 0 && (
            <div className="mt-4 flex flex-wrap items-center gap-1.5">
              {visibleTech.map((tech) => (
                <span
                  key={tech}
                  className="rounded bg-brand-100/60 px-2 py-0.5 font-mono text-[11px] font-medium text-brand-700"
                >
                  {tech}
                </span>
              ))}
              {extraTechCount > 0 && (
                <span className="rounded border border-border bg-brand-100/30 px-1.5 py-0.5 font-mono text-[11px] text-brand-500">
                  +{extraTechCount}
                </span>
              )}
            </div>
          )}
        </div>
      </div>

      {/* Footer */}
      <div className="flex items-center justify-between border-t border-brand-100 bg-brand-100/20 px-5 py-3 text-xs text-brand-500">
        <span className="truncate">
          Tim:{" "}
          <strong className="font-medium text-brand-700">
            {work.team_members.length > 0 ? work.team_members.join(", ") : "-"}
          </strong>
        </span>
      </div>
    </>
  );

  const containerClass = cn(
    "group flex flex-col justify-between overflow-hidden rounded-xl border border-border bg-white transition-all duration-200 hover:border-brand-300 hover:shadow-md",
    className,
  );

  if (href) {
    return (
      <article className={containerClass}>
        <Link
          href={href}
          className="flex h-full flex-col justify-between focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
        >
          {cardBody}
        </Link>
      </article>
    );
  }

  return <article className={containerClass}>{cardBody}</article>;
}
