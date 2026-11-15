"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { ImagePlus } from "lucide-react";
import Link from "next/link";
import { useEffect, useState, type ChangeEvent } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { getErrorMessage, getFieldErrors } from "@/lib/axios";
import { Button } from "@/shared/components/ui/Button";
import { Input } from "@/shared/components/ui/Input";
import type { ManagedWork } from "@/shared/types/api";
import {
  useCreateWorkMutation,
  useUpdateWorkMutation,
} from "../hooks/useWorkMutations";
import {
  buildWorkFormData,
  parseCommaList,
  validateCoverFile,
  WORK_CATEGORIES,
  workFormSchema,
  type WorkFormInput,
} from "../schemas/work.schema";
import { WorkLivePreview } from "./WorkLivePreview";

type WorkFormProps = {
  initialData?: ManagedWork;
};

export function WorkForm({ initialData }: WorkFormProps) {
  const isEdit = Boolean(initialData);
  const [coverFile, setCoverFile] = useState<File | null>(null);
  const [coverError, setCoverError] = useState<string | null>(null);
  const [localPreviewUrl, setLocalPreviewUrl] = useState<string | null>(null);

  const createMutation = useCreateWorkMutation();
  const updateMutation = useUpdateWorkMutation(initialData?.id ?? "");
  const isSubmitting = createMutation.isPending || updateMutation.isPending;

  const {
    register,
    handleSubmit,
    watch,
    setError,
    formState: { errors },
  } = useForm<WorkFormInput>({
    resolver: zodResolver(workFormSchema),
    defaultValues: {
      title: initialData?.title ?? "",
      summary: initialData?.summary ?? "",
      description: initialData?.description ?? "",
      benefits: initialData?.benefits ?? "",
      category: initialData?.category ?? WORK_CATEGORIES[0],
      tech_stack_text: initialData?.tech_stack.join(", ") ?? "",
      team_members_text: initialData?.team_members.join(", ") ?? "",
      demo_url: initialData?.demo_url ?? "",
      repo_url: initialData?.repo_url ?? "",
    },
  });

  useEffect(() => {
    return () => {
      if (localPreviewUrl) URL.revokeObjectURL(localPreviewUrl);
    };
  }, [localPreviewUrl]);

  const handleCoverChange = (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const err = validateCoverFile(file, isEdit);
    if (err) {
      e.target.value = "";
      setCoverError(err);
      setCoverFile(null);
      setLocalPreviewUrl(null);
      return;
    }
    setCoverError(null);
    setCoverFile(file);
    setLocalPreviewUrl(URL.createObjectURL(file));
  };

  const handleApiError = (err: unknown) => {
    const fields = getFieldErrors(err);
    if (fields) {
      for (const [key, message] of Object.entries(fields)) {
        if (key === "cover") {
          setCoverError(message);
        } else if (
          key === "title" ||
          key === "summary" ||
          key === "description" ||
          key === "benefits" ||
          key === "category" ||
          key === "demo_url" ||
          key === "repo_url"
        ) {
          setError(key, { message });
        } else if (key === "tech_stack") {
          setError("tech_stack_text", { message });
        } else if (key === "team_members") {
          setError("team_members_text", { message });
        }
      }
    }
    toast.error(getErrorMessage(err, "Gagal menyimpan karya. Periksa kembali isian."));
  };

  const onSubmit = (values: WorkFormInput) => {
    const fileErr = validateCoverFile(coverFile, isEdit);
    if (fileErr) {
      setCoverError(fileErr);
      return;
    }

    const formData = buildWorkFormData(values, coverFile);
    if (isEdit) {
      updateMutation.mutate(formData, { onError: handleApiError });
    } else {
      createMutation.mutate(formData, { onError: handleApiError });
    }
  };

  const onInvalid = () => {
    const fileErr = validateCoverFile(coverFile, isEdit);
    if (fileErr) setCoverError(fileErr);
  };

  const initialCategory = initialData?.category?.trim();
  const categoryOptions: readonly string[] =
    initialCategory &&
    !WORK_CATEGORIES.includes(initialCategory as (typeof WORK_CATEGORIES)[number])
      ? [initialCategory, ...WORK_CATEGORIES]
      : WORK_CATEGORIES;

  const watched = watch();
  const previewData = {
    title: watched.title,
    summary: watched.summary,
    description: watched.description,
    benefits: watched.benefits,
    category: watched.category,
    tech_stack: parseCommaList(watched.tech_stack_text ?? ""),
    team_members: parseCommaList(watched.team_members_text ?? ""),
    cover_url: localPreviewUrl ?? initialData?.cover_url ?? "",
    demo_url: watched.demo_url || null,
    repo_url: watched.repo_url || null,
    is_featured: initialData?.is_featured ?? false,
  };

  return (
    <div className="grid grid-cols-1 items-start gap-6 xl:grid-cols-12">
      <form
        noValidate
        onSubmit={handleSubmit(onSubmit, onInvalid)}
        className="space-y-5 rounded-2xl border border-border bg-white p-6 shadow-xs xl:col-span-7"
      >
        <Input
          id="work-title"
          label="Judul Karya"
          placeholder="Contoh: BCC Event Hub"
          error={errors.title?.message}
          {...register("title")}
        />

        <Input
          id="work-summary"
          label="Ringkasan Singkat"
          hint={`${(watched.summary ?? "").length}/160`}
          placeholder="Jelaskan karya dalam 1-2 kalimat singkat"
          error={errors.summary?.message}
          {...register("summary")}
        />

        <div>
          <label
            htmlFor="work-category"
            className="mb-1.5 block text-sm font-medium text-brand-800"
          >
            Kategori
          </label>
          <select
            id="work-category"
            {...register("category")}
            className="h-12 w-full rounded-xl border border-border bg-white px-4 text-sm text-foreground outline-none focus:border-brand-400 focus:ring-2 focus:ring-brand-100"
          >
            {categoryOptions.map((cat) => (
              <option key={cat} value={cat}>
                {cat}
              </option>
            ))}
          </select>
          {errors.category && (
            <p className="mt-1.5 text-sm text-red-600">{errors.category.message}</p>
          )}
        </div>

        <div>
          <label
            htmlFor="work-cover"
            className="mb-1.5 block text-sm font-medium text-brand-800"
          >
            Gambar Cover {isEdit ? "(Opsional saat edit)" : "(Wajib)"}
          </label>
          <label
            htmlFor="work-cover"
            className="flex cursor-pointer items-center gap-3 rounded-xl border border-dashed border-brand-200 bg-brand-100/30 px-4 py-3 text-sm text-muted transition-colors hover:border-brand-300 hover:bg-primary-soft/40"
          >
            <ImagePlus className="size-5 text-primary" aria-hidden />
            <span className="truncate">
              {coverFile
                ? coverFile.name
                : "Pilih file gambar (.jpg, .png, .webp, maks. 5MB)"}
            </span>
          </label>
          <input
            id="work-cover"
            type="file"
            accept="image/jpeg,image/png,image/webp"
            onChange={handleCoverChange}
            className="sr-only"
          />
          {coverError && <p className="mt-1.5 text-sm text-red-600">{coverError}</p>}
        </div>

        <div>
          <label
            htmlFor="work-description"
            className="mb-1.5 block text-sm font-medium text-brand-800"
          >
            Deskripsi Lengkap
          </label>
          <textarea
            id="work-description"
            rows={4}
            placeholder="Ceritakan latar belakang, fitur utama, dan cara kerja proyek..."
            {...register("description")}
            className="w-full rounded-xl border border-border bg-white p-3.5 text-sm text-foreground outline-none focus:border-brand-400 focus:ring-2 focus:ring-brand-100"
          />
          {errors.description && (
            <p className="mt-1 text-sm text-red-600">{errors.description.message}</p>
          )}
        </div>

        <div>
          <label
            htmlFor="work-benefits"
            className="mb-1.5 block text-sm font-medium text-brand-800"
          >
            Masalah &amp; Manfaat Karya
          </label>
          <textarea
            id="work-benefits"
            rows={3}
            placeholder="Masalah apa yang diselesaikan dan manfaatnya bagi pengguna?"
            {...register("benefits")}
            className="w-full rounded-xl border border-border bg-white p-3.5 text-sm text-foreground outline-none focus:border-brand-400 focus:ring-2 focus:ring-brand-100"
          />
          {errors.benefits && (
            <p className="mt-1 text-sm text-red-600">{errors.benefits.message}</p>
          )}
        </div>

        <Input
          id="work-tech"
          label="Tech Stack"
          hint="Pisahkan dengan koma"
          placeholder="Next.js, TypeScript, Go, PostgreSQL"
          error={errors.tech_stack_text?.message}
          {...register("tech_stack_text")}
        />

        <Input
          id="work-team"
          label="Anggota Tim"
          hint="Pisahkan dengan koma"
          placeholder="Bagas, Nadia, Faza"
          error={errors.team_members_text?.message}
          {...register("team_members_text")}
        />

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <Input
            id="work-demo"
            label="URL Live Demo (Opsional)"
            type="url"
            placeholder="https://demo.bccdev.id"
            error={errors.demo_url?.message}
            {...register("demo_url")}
          />
          <Input
            id="work-repo"
            label="URL Repository (Opsional)"
            type="url"
            placeholder="https://github.com/..."
            error={errors.repo_url?.message}
            {...register("repo_url")}
          />
        </div>

        <div className="flex items-center justify-end gap-3 border-t border-brand-100 pt-4">
          <Link
            href="/dashboard"
            className="inline-flex h-11 items-center rounded-xl border border-border bg-white px-5 text-sm font-semibold text-brand-700 hover:bg-brand-100/40"
          >
            Batal
          </Link>
          <Button
            type="submit"
            loading={isSubmitting}
            loadingText="Menyimpan..."
            className="h-11 px-6 text-sm"
          >
            {isEdit ? "Simpan Perubahan" : "Simpan sebagai Draft"}
          </Button>
        </div>
      </form>

      <div className="xl:sticky xl:top-6 xl:col-span-5">
        <WorkLivePreview data={previewData} />
      </div>
    </div>
  );
}
