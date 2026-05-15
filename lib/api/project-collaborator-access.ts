import { NextResponse } from "next/server";

import type { ClerkEditorIdentity } from "@/lib/project-access";
import { prisma } from "@/lib/prisma";

export type ProjectCollaboratorAccess =
  | { ok: false; response: NextResponse }
  | { ok: true; projectId: string; role: "owner" | "collaborator" };

export async function requireProjectCollaboratorAccess(
  projectId: string,
  identity: ClerkEditorIdentity | null
): Promise<ProjectCollaboratorAccess> {
  if (!identity) {
    return {
      ok: false,
      response: NextResponse.json({ error: "Unauthorized" }, { status: 401 }),
    };
  }

  const project = await prisma.project.findUnique({
    where: { id: projectId },
    select: { id: true, ownerId: true },
  });

  if (!project) {
    return {
      ok: false,
      response: NextResponse.json({ error: "Not found" }, { status: 404 }),
    };
  }

  if (project.ownerId === identity.userId) {
    return { ok: true, projectId: project.id, role: "owner" };
  }

  if (!identity.primaryEmail) {
    return {
      ok: false,
      response: NextResponse.json({ error: "Forbidden" }, { status: 403 }),
    };
  }

  const membership = await prisma.projectCollaborator.findUnique({
    where: {
      projectId_email: {
        projectId: project.id,
        email: identity.primaryEmail,
      },
    },
    select: { id: true },
  });

  if (!membership) {
    return {
      ok: false,
      response: NextResponse.json({ error: "Forbidden" }, { status: 403 }),
    };
  }

  return { ok: true, projectId: project.id, role: "collaborator" };
}
