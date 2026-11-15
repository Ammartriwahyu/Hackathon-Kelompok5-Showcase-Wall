import { z } from "zod";

export const WORK_CATEGORIES = [
  "Web Development",
  "Mobile App",
  "Machine Learning",
  "IoT & Hardware",
  "Game Dev",
  "UI/UX & Design",
] as const;

export const MAX_COVER_SIZE = 5 * 1024 * 1024; // 5MB
export const ACCEPTED_IMAGE_TYPES = ["image/jpeg", "image/png", "image/webp"];
export const MAX_LIST_ITEMS = 10;
export const MAX_LIST_ITEM_LENGTH = 80;
export const MAX_URL_LENGTH = 500;

/** Memecah input dipisahkan koma, memangkas spasi, dan menghapus duplikat secara case-insensitive. */
export function parseCommaList(raw: string): string[] {
  const out: string[] = [];
  const seen = new Set<string>();

  for (const part of raw.split(",")) {
    const item = part.trim();
    if (!item) continue;
    const key = item.toLowerCase();
    if (seen.has(key)) continue;
    seen.add(key);
    out.push(item);
  }

  return out;
}

const optionalUrlSchema = z
  .string()
  .trim()
  .max(MAX_URL_LENGTH, `URL maksimal ${MAX_URL_LENGTH} karakter`)
  .refine(
    (val) => {
      if (!val) return true;
      try {
        const parsed = new URL(val);
        return parsed.protocol === "http:" || parsed.protocol === "https:";
      } catch {
        return false;
      }
    },
    { message: "Format URL tidak valid (sertakan https://)" },
  );

function commaListSchema(noun: string, minMessage: string) {
  return z
    .string()
    .trim()
    .superRefine((val, ctx) => {
      const items = parseCommaList(val);
      if (items.length < 1) {
        ctx.addIssue({ code: "custom", message: minMessage });
        return;
      }
      if (items.length > MAX_LIST_ITEMS) {
        ctx.addIssue({
          code: "custom",
          message: `${noun} maksimal ${MAX_LIST_ITEMS} item`,
        });
        return;
      }
      if (items.some((item) => item.length > MAX_LIST_ITEM_LENGTH)) {
        ctx.addIssue({
          code: "custom",
          message: `Setiap item ${noun.toLowerCase()} maksimal ${MAX_LIST_ITEM_LENGTH} karakter`,
        });
      }
    });
}

export const workFormSchema = z.object({
  title: z
    .string()
    .trim()
    .min(3, "Judul minimal 3 karakter")
    .max(150, "Judul maksimal 150 karakter"),
  summary: z
    .string()
    .trim()
    .min(1, "Ringkasan wajib diisi")
    .max(160, "Ringkasan maksimal 160 karakter"),
  description: z
    .string()
    .trim()
    .min(10, "Deskripsi minimal 10 karakter")
    .max(10000, "Deskripsi maksimal 10000 karakter"),
  benefits: z
    .string()
    .trim()
    .min(10, "Masalah & manfaat minimal 10 karakter")
    .max(5000, "Masalah & manfaat maksimal 5000 karakter"),
  category: z
    .string()
    .trim()
    .min(1, "Kategori wajib dipilih")
    .max(50, "Kategori maksimal 50 karakter"),
  tech_stack_text: commaListSchema(
    "Tech stack",
    "Masukkan minimal 1 tech stack (pisahkan dengan koma)",
  ),
  team_members_text: commaListSchema(
    "Anggota tim",
    "Masukkan minimal 1 nama anggota tim (pisahkan dengan koma)",
  ),
  demo_url: optionalUrlSchema,
  repo_url: optionalUrlSchema,
});

export type WorkFormInput = z.infer<typeof workFormSchema>;

export function validateCoverFile(file: File | null, isEdit: boolean): string | null {
  if (!file) {
    return isEdit ? null : "Gambar cover wajib diunggah";
  }
  if (!ACCEPTED_IMAGE_TYPES.includes(file.type)) {
    return "Format gambar harus JPG, PNG, atau WEBP";
  }
  if (file.size > MAX_COVER_SIZE) {
    return "Ukuran gambar maksimal 5MB";
  }
  return null;
}

export function buildWorkFormData(values: WorkFormInput, coverFile: File | null): FormData {
  const formData = new FormData();
  formData.append("title", values.title.trim());
  formData.append("summary", values.summary.trim());
  formData.append("description", values.description.trim());
  formData.append("benefits", values.benefits.trim());
  formData.append("category", values.category.trim());
  formData.append("demo_url", values.demo_url.trim());
  formData.append("repo_url", values.repo_url.trim());

  for (const tech of parseCommaList(values.tech_stack_text)) {
    formData.append("tech_stack", tech);
  }
  for (const member of parseCommaList(values.team_members_text)) {
    formData.append("team_members", member);
  }
  if (coverFile) {
    formData.append("cover", coverFile);
  }
  return formData;
}
