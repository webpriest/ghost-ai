function slugify(raw: string): string {
  return raw
    .trim()
    .toLowerCase()
    .replace(/\s+/g, "-")
    .replace(/[^a-z0-9-]/g, "")
    .replace(/-+/g, "-")
    .replace(/^-+|-+$/g, "");
}

/** URL-safe slug for display while typing; may be empty. */
export function slugPreviewFromName(name: string): string {
  return slugify(name);
}

/** Valid slug or null if the name cannot produce a non-empty slug. */
export function slugFromNameOrNull(name: string): string | null {
  const slug = slugify(name);
  return slug.length > 0 ? slug : null;
}
