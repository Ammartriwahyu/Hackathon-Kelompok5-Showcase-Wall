import {
  FeaturedWorkHero,
  GalleryFilterBar,
  PublicWorkGrid,
} from "@/features/gallery";

export default function PublicGalleryPage() {
  return (
    <div>
      <div className="mb-8">
        <h1 className="text-2xl font-bold tracking-tight text-slate-900 sm:text-3xl">
          Galeri Karya BCC
        </h1>
        <p className="mt-1 text-sm text-slate-600">
          Jelajahi proyek inovatif, aplikasi, dan karya terbaik dari anggota BCC.
        </p>
      </div>

      <FeaturedWorkHero />
      <GalleryFilterBar />
      <PublicWorkGrid />
    </div>
  );
}
