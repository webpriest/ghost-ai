import { prisma } from "@/lib/prisma";
import { slugPreviewFromName } from "@/lib/slug-preview";
import type { Project } from "@/types/project";

function rowToProject(
  row: { id: string; name: string },
  role: Project["role"]
): Project {
  const slug = slugPreviewFromName(row.name);
  return {
    id: row.id,
    name: row.name,
    slug: slug.length > 0 ? slug : row.id.slice(0, 8),
    role,
  };
}

/**
 * Loads projects for the editor shell: owned by the user and shared via collaborator email.
 */
export async function getEditorProjectLists(
  userId: string,
  userEmail: string
): Promise<{ ownedProjects: Project[]; sharedProjects: Project[] }> {
  const [ownedRows, sharedRows] = await Promise.all([
    prisma.project.findMany({
      where: { ownerId: userId },
      orderBy: { createdAt: "desc" },
      select: { id: true, name: true },
    }),
    userEmail.length > 0
      ? prisma.project.findMany({
          where: {
            ownerId: { not: userId },
            collaborators: { some: { email: userEmail } },
          },
          orderBy: { createdAt: "desc" },
          select: { id: true, name: true },
        })
      : Promise.resolve([]),
  ]);

  return {
    ownedProjects: ownedRows.map((r) => rowToProject(r, "owner")),
    sharedProjects: sharedRows.map((r) => rowToProject(r, "collaborator")),
  };
}
