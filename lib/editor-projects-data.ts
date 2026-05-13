import { prisma } from "@/lib/prisma";
import { serializeProject, serializeSharedProject } from "@/lib/api/project-http";
import type { Project } from "@/types/project";

export async function fetchEditorProjectsData(params: {
  ownerId: string;
  /** Primary email normalized for collaborator lookup (optional) */
  primaryEmailNormalized: string | null;
}): Promise<{ owned: Project[]; shared: Project[] }> {
  const { ownerId, primaryEmailNormalized } = params;

  const ownedRows = await prisma.project.findMany({
    where: { ownerId },
    orderBy: { createdAt: "desc" },
  });

  const owned = ownedRows.map(serializeProject);

  if (!primaryEmailNormalized) {
    return { owned, shared: [] };
  }

  const sharedRows = await prisma.project.findMany({
    where: {
      ownerId: { not: ownerId },
      collaborators: {
        some: { email: primaryEmailNormalized },
      },
    },
    orderBy: { updatedAt: "desc" },
  });

  return {
    owned,
    shared: sharedRows.map(serializeSharedProject),
  };
}
