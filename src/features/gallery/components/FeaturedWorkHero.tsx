"use client";

import { ArrowRight, ImageOff, Star } from "lucide-react";
import Link from "next/link";
import { Badge } from "@/shared/components/ui/Badge";
import { Skeleton } from "@/shared/components/ui/Skeleton";
import { useFeaturedWork } from "../hooks/usePublicWorks";

export function FeaturedWorkHero() {
  const { data: work, isLoading, isError } = useFeaturedWork();

  if (isLoading) {
    return (
      <section className="mb-8">
        <Skeleton className="h-72 w-full rounded-2xl" />
      </section>
    );
  }

  if (isError || !work) {
    return null;
  }

  return (
    <section aria-label="Karya Unggulan" className="mb-8">
      <article className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-xs">
        <div className="grid grid-cols-1 lg:grid-cols-12">
          <div className="relative aspect-[16/9] w-full overflow-hidden bg-slate-100 lg:col-span-6 lg:aspect-auto lg:min-h-[300px]">
            {work.cover_url ? (
              <img
                src={work.cover_url}
                alt={work.title}
                className="h-full w-full object-cover"
              />
            ) : (
              <div className="flex h-full w-full items-center justify-center text-slate-400">
                <ImageOff className="size-8" aria-hidden />
              </div>
            )}
          </div>

          <div className="flex flex-col justify-between p-6 sm:p-8 lg:col-span-6">
            <div>
              <div className="mb-3 flex flex-wrap items-center gap-2">
                <Badge variant="warning">
                  <Star className="size-3.5 fill-amber-500 text-amber-500" aria-hidden />
                  Karya Unggulan
                </Badge>
                <Badge variant="primary">{work.category}</Badge>
              </div>

              <h2 className="text-2xl font-bold leading-snug tracking-tight text-slate-900 sm:text-3xl">
                {work.title}
              </h2>
              <p className="mt-3 line-clamp-3 text-sm leading-relaxed text-slate-600">
                {work.summary}
              </p>

              {work.tech_stack.length > 0 && (
                <div className="mt-5">
                  <span className="mb-2 block font-mono text-[11px] font-semibold uppercase tracking-wider text-slate-400">
                    Tech Stack
                  </span>
                  <div className="flex flex-wrap gap-1.5">
                    {work.tech_stack.map((tech) => (
                      <span
                        key={tech}
                        className="rounded-md border border-slate-200/80 bg-slate-100 px-2.5 py-1 font-mono text-xs font-medium text-slate-700"
                      >
                        {tech}
                      </span>
                    ))}
                  </div>
                </div>
              )}
            </div>

            <div className="mt-6 flex flex-wrap items-center justify-between gap-4 border-t border-slate-100 pt-5">
              <p className="text-xs font-medium text-slate-500 sm:text-sm">
                Tim:{" "}
                <span className="font-semibold text-slate-700">
                  {work.team_members.join(", ")}
                </span>
              </p>

              <Link
                href={`/works/${work.id}`}
                className="inline-flex h-10 items-center gap-2 rounded-xl bg-indigo-600 px-4 text-sm font-semibold text-white shadow-xs transition-colors hover:bg-indigo-700"
              >
                <span>Lihat Detail</span>
                <ArrowRight className="size-4" aria-hidden />
              </Link>
            </div>
          </div>
        </div>
      </article>
    </section>
  );
}
