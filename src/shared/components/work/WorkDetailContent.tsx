import { resolveMediaUrl } from "@/lib/utils";
import {
  BookOpen,
  Code2,
  ExternalLink,
  ImageOff,
  Lightbulb,
  Star,
  Users,
} from "lucide-react";
import { Badge } from "@/shared/components/ui/Badge";

export type WorkDetailData = {
  title: string;
  summary: string;
  description: string;
  benefits: string;
  category: string;
  tech_stack: string[];
  team_members: string[];
  cover_url: string;
  demo_url?: string | null;
  repo_url?: string | null;
  is_featured?: boolean;
};

type WorkDetailContentProps = {
  work: WorkDetailData;
};

export function WorkDetailContent({ work }: WorkDetailContentProps) {
  const hasLinks = Boolean(work.demo_url || work.repo_url);

  return (
    <div className="space-y-8">
      {/* Header */}
      <div>
        <div className="mb-3 flex flex-wrap items-center gap-2.5">
          <Badge variant="primary">{work.category || "Kategori"}</Badge>
          {work.is_featured && (
            <Badge variant="warning">
              <Star className="size-3.5 fill-amber-500 text-amber-500" aria-hidden />
              Unggulan
            </Badge>
          )}
        </div>

        <h1 className="max-w-4xl text-2xl font-bold leading-tight tracking-tight text-foreground sm:text-3xl lg:text-4xl">
          {work.title || "Judul Karya"}
        </h1>
        <p className="mt-3 max-w-3xl text-sm leading-relaxed text-muted sm:text-base">
          {work.summary || "Ringkasan karya akan tampil di sini."}
        </p>
      </div>

      {/* 16:9 Primary Cover */}
      <div className="aspect-[16/9] w-full overflow-hidden rounded-2xl border border-border bg-brand-100/60 shadow-sm">
        {work.cover_url ? (
          <img
            src={resolveMediaUrl(work.cover_url)}
            alt={work.title || "Cover karya"}
            className="h-full w-full object-cover"
          />
        ) : (
          <div className="flex h-full w-full flex-col items-center justify-center gap-2 text-brand-400">
            <ImageOff className="size-8" aria-hidden />
            <span className="text-sm">Preview gambar cover akan tampil di sini</span>
          </div>
        )}
      </div>

      {/* Two-Column Content */}
      <div className="grid grid-cols-1 items-start gap-6 lg:grid-cols-12">
        {/* Left: Cerita & Manfaat */}
        <div className="flex flex-col gap-6 lg:col-span-8">
          <article className="rounded-xl border border-border bg-white p-6 shadow-xs">
            <div className="mb-4 flex items-center gap-2 border-b border-brand-100 pb-3">
              <BookOpen className="size-5 text-primary" aria-hidden />
              <h2 className="text-base font-bold tracking-tight text-foreground">
                Tentang Karya
              </h2>
            </div>
            <p className="whitespace-pre-line text-sm leading-relaxed text-muted">
              {work.description || "Deskripsi lengkap karya akan tampil di sini."}
            </p>
          </article>

          <section className="rounded-xl border border-brand-100 border-l-4 border-l-indigo-600 bg-primary-soft/60 p-6 shadow-xs">
            <div className="mb-3 flex items-center gap-2">
              <Lightbulb className="size-5 text-primary" aria-hidden />
              <h2 className="text-base font-bold tracking-tight text-foreground">
                Masalah &amp; Manfaat Karya
              </h2>
            </div>
            <p className="whitespace-pre-line text-sm leading-relaxed text-brand-700">
              {work.benefits || "Manfaat karya untuk pengguna akan tampil di sini."}
            </p>
          </section>
        </div>

        {/* Right: Sidebar Info */}
        <aside className="flex flex-col gap-5 lg:sticky lg:top-20 lg:col-span-4">
          {hasLinks && (
            <div className="rounded-xl border border-border bg-white p-5 shadow-xs">
              <h3 className="mb-3 text-xs font-semibold uppercase tracking-wider text-brand-500">
                Tautan Akses
              </h3>
              <div className="flex flex-col gap-2.5">
                {work.demo_url && (
                  <a
                    href={work.demo_url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex h-11 items-center justify-center gap-2 rounded-xl bg-primary px-4 text-sm font-semibold text-white transition-colors hover:bg-primary-hover"
                  >
                    <span>Buka Live Demo</span>
                    <ExternalLink className="size-4" aria-hidden />
                  </a>
                )}
                {work.repo_url && (
                  <a
                    href={work.repo_url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex h-11 items-center justify-center gap-2 rounded-xl border border-border bg-white px-4 text-sm font-semibold text-brand-800 transition-colors hover:bg-brand-100/40"
                  >
                    <Code2 className="size-4 text-muted" aria-hidden />
                    <span>Lihat Repository</span>
                  </a>
                )}
              </div>
            </div>
          )}

          <div className="rounded-xl border border-border bg-white p-5 shadow-xs">
            <h3 className="mb-3 text-xs font-semibold uppercase tracking-wider text-brand-500">
              Tech Stack
            </h3>
            {work.tech_stack.length > 0 ? (
              <div className="flex flex-wrap gap-1.5">
                {work.tech_stack.map((tech) => (
                  <span
                    key={tech}
                    className="rounded-md border border-border/80 bg-brand-100/60 px-2.5 py-1 font-mono text-xs font-medium text-brand-700"
                  >
                    {tech}
                  </span>
                ))}
              </div>
            ) : (
              <p className="text-xs text-brand-400">Belum ada tech stack</p>
            )}
          </div>

          <div className="rounded-xl border border-border bg-white p-5 shadow-xs">
            <h3 className="mb-3 flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wider text-brand-500">
              <Users className="size-3.5" aria-hidden />
              <span>Anggota Tim</span>
            </h3>
            {work.team_members.length > 0 ? (
              <ul className="space-y-1.5 text-sm font-medium text-brand-700">
                {work.team_members.map((member) => (
                  <li key={member}>{member}</li>
                ))}
              </ul>
            ) : (
              <p className="text-xs text-brand-400">Belum ada anggota tim</p>
            )}
          </div>
        </aside>
      </div>
    </div>
  );
}
