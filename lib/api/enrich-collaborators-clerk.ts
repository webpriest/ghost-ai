import type { ClerkClient } from "@clerk/backend";

/** Display info from Clerk Backend when a matching user exists; omit entry when unknown. */
export type ClerkCollaboratorPreview = {
  displayName: string | null;
  imageUrl: string | null;
};

function displayNameForUser(user: {
  firstName: string | null;
  lastName: string | null;
  username: string | null;
}): string | null {
  const parts = [user.firstName, user.lastName].filter(
    (p): p is string => typeof p === "string" && p.trim().length > 0
  );
  if (parts.length > 0) {
    return parts.join(" ").trim();
  }
  const u = user.username?.trim();
  return u?.length ? u : null;
}

/**
 * Loads Clerk previews for collaborator emails (lowercased addresses from DB).
 * Missing or errored lookups are omitted — callers fall back to email-only.
 */
export async function enrichCollaboratorEmailsWithClerk(
  clerkClient: ClerkClient,
  emails: string[]
): Promise<Record<string, ClerkCollaboratorPreview>> {
  const unique = [...new Set(emails)];
  const out: Record<string, ClerkCollaboratorPreview> = {};

  await Promise.all(
    unique.map(async (email) => {
      try {
        const { data } = await clerkClient.users.getUserList({
          emailAddress: [email],
          limit: 5,
        });
        const user = data[0];
        if (!user) return;

        out[email] = {
          displayName: displayNameForUser(user),
          imageUrl: user.imageUrl.length > 0 ? user.imageUrl : null,
        };
      } catch {
        /* ignore Clerk failures — UI shows email only */
      }
    })
  );

  return out;
}
