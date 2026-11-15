export function resolveMediaUrl(url: string | null | undefined) {
  if (!url) return "";
  if (/^(https?:|blob:|data:)/.test(url)) return url;
  const base = process.env.NEXT_PUBLIC_API_URL ?? "";
  if (!/^https?:/.test(base)) return url;
  return new URL(url, base.endsWith("/") ? base : `${base}/`).toString();
}
