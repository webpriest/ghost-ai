/** Normalized slug segment from `name` before fallback preview. */
function slugCore(name: string): string {
  return name
    .trim()
    .toLowerCase()
    .replace(/[^\w\s-]/g, "")
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-")
    .replace(/^-+|-+$/g, "");
}

/** Slug derived from `name`, or `null` when nothing sluggable remains (no submission). */
export function slugFromNameOrNull(name: string): string | null {
  const raw = slugCore(name);
  return raw.length > 0 ? raw : null;
}

/** Live URL-style slug from a display name (mock preview only). */
export function slugPreviewFromName(name: string): string {
  return slugFromNameOrNull(name) ?? "your-project";
}
