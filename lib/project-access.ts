import { auth, currentUser } from "@clerk/nextjs/server";

import { serializeProject, serializeSharedProject } from "@/lib/api/project-http";
import { prisma } from "@/lib/prisma";
import type { Project } from "@/types/project";

export type ClerkEditorIdentity = {
  userId: string;
  /** Primary email from Clerk, trimmed and lowercased for collaborator lookup */
  primaryEmail: string | null;
};

/**
 * Clerk session identity for editor access checks. Returns null when unauthenticated.
 */
export async function getClerkEditorIdentity(): Promise<
  ClerkEditorIdentity | null
> {
  const { userId } = await auth();
  if (!userId) return null;

  const user = await currentUser();
  const raw =
    user?.primaryEmailAddress?.emailAddress?.trim().toLowerCase() ?? null;
  const primaryEmail = raw?.length ? raw : null;

  return { userId, primaryEmail };
}

/**
 * Resolves project by id when the user is the owner or a listed collaborator.
 * Returns null if the row is missing or the user lacks access.
 */
export async function findAccessibleProjectForUser(
  projectId: string,
  identity: ClerkEditorIdentity
): Promise<Project | null> {
  const row = await prisma.project.findUnique({
    where: { id: projectId },
  });

  if (!row) return null;

  if (row.ownerId === identity.userId) {
    return serializeProject(row);
  }

  if (!identity.primaryEmail) return null;

  const membership = await prisma.projectCollaborator.findUnique({
    where: {
      projectId_email: {
        projectId: row.id,
        email: identity.primaryEmail,
      },
    },
  });

  if (!membership) return null;

  return serializeSharedProject(row);
}
