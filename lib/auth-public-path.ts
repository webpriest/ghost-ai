/**
 * Resolves Clerk sign-in/up URL env values to pathname prefixes for proxy protection.
 */

export function normalizeAuthPath(raw: string | undefined, fallback: string): string {
  const trimmed = raw?.trim()
  if (!trimmed) {
    return fallback
  }

  try {
    if (trimmed.startsWith("http://") || trimmed.startsWith("https://")) {
      const pathname = new URL(trimmed).pathname.replace(/\/+$/, "") || "/"
      return pathname
    }
  } catch {
    // fall through: treat as path string
  }

  const prefixed = trimmed.startsWith("/") ? trimmed : `/${trimmed}`
  const noTrailing = prefixed.replace(/\/+$/, "")
  return noTrailing || fallback
}

export function isUnderAuthPath(pathname: string, base: string): boolean {
  if (pathname === base) {
    return true
  }
  return pathname.startsWith(`${base}/`)
}
