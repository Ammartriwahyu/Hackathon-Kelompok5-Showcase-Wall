import { BookOpen, Code2, ExternalLink, ImageOff, Lightbulb, Star, Users } from "lucide-react";
import { resolveMediaUrl } from "@/lib/utils";
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

const focusRing = "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2";

function InfoCard({ title, icon, children }: { title: string; icon?: React.ReactNode; children: React.ReactNode }) {
  return (
    <div className="min-w-0 rounded-xl border border-border bg-white p-5">
      <h3 className="mb-3 flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wider text-brand-500">
        {icon}
        {title}
      </h3>
      {children}
    </div>
  );
}

export function WorkDetailContent({ work }: WorkDetailContentProps) {
  const hasLinks = Boolean(work.demo_url || work.repo_url);

  return (
    <div className="@container">
      <div className="space-y-6 @3xl:space-y-8">
        <header>
          <div className="mb-3 flex flex-wrap items-center gap-x-3 gap-y-2">
            <span className="text-xs font-semibold uppercase tracking-wider text-brand-500">
              {work.category || "Kategori"}
            </span>
            {work.is_featured && (
              <Badge variant="warning">
                <Star className="size-3.5 fill-current" aria-hidden />
                Unggulan
              </Badge>
            )}
          </div>
          <h1 className="text-2xl font-bold leading-tight tracking-tight text-balance text-foreground @xl:text-3xl @3xl:text-4xl">
            {work.title || "Judul Karya"}
          </h1>
          <p className="mt-3 max-w-3xl text-sm leading-relaxed text-muted @xl:text-base">
            {work.summary || "Ringkasan karya akan tampil di sini."}
          </p>
        </header>

        <div className="aspect-video w-full overflow-hidden rounded-2xl border border-border bg-brand-100/60">
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

        <div className="grid grid-cols-1 items-start gap-5 @3xl:grid-cols-12 @3xl:gap-6">
          <div className="flex min-w-0 flex-col gap-5 @3xl:col-span-8">
            <article className="rounded-xl border border-border bg-white p-5 @xl:p-6">
              <div className="mb-3 flex items-center gap-2">
                <BookOpen className="size-5 shrink-0 text-primary" aria-hidden />
                <h2 className="text-base font-bold tracking-tight text-foreground">Tentang Karya</h2>
              </div>
              <p className="whitespace-pre-line break-words text-sm leading-relaxed text-muted">
                {work.description || "Deskripsi lengkap karya akan tampil di sini."}
              </p>
            </article>

            <section className="rounded-xl border border-l-4 border-brand-100 border-l-primary bg-primary-soft/50 p-5 @xl:p-6">
              <div className="mb-3 flex items-center gap-2">
                <Lightbulb className="size-5 shrink-0 text-primary" aria-hidden />
                <h2 className="text-base font-bold tracking-tight text-foreground">Masalah &amp; Manfaat Karya</h2>
              </div>
              <p className="whitespace-pre-line break-words text-sm leading-relaxed text-brand-700">
                {work.benefits || "Manfaat karya untuk pengguna akan tampil di sini."}
              </p>
            </section>
          </div>

          <aside className="grid min-w-0 grid-cols-1 gap-5 @md:grid-cols-2 @3xl:sticky @3xl:top-20 @3xl:col-span-4 @3xl:grid-cols-1">
            {hasLinks && (
              <div className="@md:col-span-2 @3xl:col-span-1">
                <InfoCard title="Tautan Akses">
                  <div className="flex flex-col gap-2.5 @md:flex-row @3xl:flex-col">
                    {work.demo_url && (
                      <a
                        href={work.demo_url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className={`inline-flex h-11 flex-1 items-center justify-center gap-2 whitespace-nowrap rounded-xl bg-primary px-4 text-sm font-semibold text-primary-foreground transition-colors hover:bg-primary-hover ${focusRing}`}
                      >
                        Buka Live Demo
                        <ExternalLink className="size-4 shrink-0" aria-hidden />
                      </a>
                    )}
                    {work.repo_url && (
                      <a
                        href={work.repo_url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className={`inline-flex h-11 flex-1 items-center justify-center gap-2 whitespace-nowrap rounded-xl border border-border bg-white px-4 text-sm font-semibold text-brand-800 transition-colors hover:bg-brand-100/40 ${focusRing}`}
                      >
                        <Code2 className="size-4 shrink-0 text-muted" aria-hidden />
                        Lihat Repository
                      </a>
                    )}
                  </div>
                </InfoCard>
              </div>
            )}

            <InfoCard title="Tech Stack">
              {work.tech_stack.length > 0 ? (
                <ul className="flex flex-wrap gap-1.5">
                  {work.tech_stack.map((tech) => (
                    <li
                      key={tech}
                      className="max-w-full truncate rounded-md bg-brand-100/60 px-2.5 py-1 text-xs font-medium text-brand-700"
                    >
                      {tech}
                    </li>
                  ))}
                </ul>
              ) : (
                <p className="text-xs text-brand-400">Belum ada tech stack</p>
              )}
            </InfoCard>

            <InfoCard title="Anggota Tim" icon={<Users className="size-3.5" aria-hidden />}>
              {work.team_members.length > 0 ? (
                <ul className="space-y-1.5 text-sm font-medium text-brand-700">
                  {work.team_members.map((member) => (
                    <li key={member} className="break-words">
                      {member}
                    </li>
                  ))}
                </ul>
              ) : (
                <p className="text-xs text-brand-400">Belum ada anggota tim</p>
              )}
            </InfoCard>
          </aside>
        </div>
      </div>
    </div>
  );
}