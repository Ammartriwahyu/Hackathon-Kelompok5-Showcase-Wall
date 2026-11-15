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

export function parseCommaList(raw: string): string[] {
  return raw
    .split(",")
    .map((item) => item.trim())
    .filter(Boolean);
}

const optionalUrlSchema = z
  .string()
  .trim()
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

export const workFormSchema = z.object({
  title: z.string().trim().min(3, "Judul minimal 3 karakter"),
  summary: z
    .string()
    .trim()
    .min(1, "Ringkasan wajib diisi")
    .max(160, "Ringkasan maksimal 160 karakter"),
  description: z.string().trim().min(10, "Deskripsi minimal 10 karakter"),
  benefits: z.string().trim().min(10, "Masalah & manfaat minimal 10 karakter"),
  category: z.string().trim().min(1, "Kategori wajib dipilih"),
  tech_stack_text: z
    .string()
    .trim()
    .refine((val) => parseCommaList(val).length >= 1, {
      message: "Masukkan minimal 1 tech stack (pisahkan dengan koma)",
    }),
  team_members_text: z
    .string()
    .trim()
    .refine((val) => parseCommaList(val).length >= 1, {
      message: "Masukkan minimal 1 nama anggota tim (pisahkan dengan koma)",
    }),
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
