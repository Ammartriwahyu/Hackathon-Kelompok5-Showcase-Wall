import { FeaturedWorkHero, GalleryFilterBar, PublicWorkGrid } from "@/features/gallery";
import { Mascot } from "@/shared/components/ui/Mascot";

export default function PublicGalleryPage() {
  return (
    <div>
      <div className="mb-8 flex items-end justify-between gap-6">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-foreground sm:text-3xl">Galeri Karya BCC</h1>
          <p className="mt-1 text-sm text-muted">
            Jelajahi proyek inovatif, aplikasi, dan karya terbaik dari anggota BCC.
          </p>
        </div>
        <Mascot variant="halo" priority className="w-20 shrink-0 sm:w-28" />
      </div>

      <FeaturedWorkHero />
      <GalleryFilterBar />
      <PublicWorkGrid />
    </div>
  );
}