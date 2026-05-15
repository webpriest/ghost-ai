import { NextResponse } from "next/server";

import { requireProjectCollaboratorAccess } from "@/lib/api/project-collaborator-access";
import { prisma } from "@/lib/prisma";
import { getClerkEditorIdentity } from "@/lib/project-access";

type Params = Promise<{ projectId: string; collaboratorId: string }>;

export async function DELETE(_request: Request, ctx: { params: Params }) {
  const { projectId, collaboratorId } = await ctx.params;
  const identity = await getClerkEditorIdentity();
  const gate = await requireProjectCollaboratorAccess(projectId, identity);
  if (!gate.ok) {
    return gate.response;
  }

  if (gate.role !== "owner") {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  const deleted = await prisma.projectCollaborator.deleteMany({
    where: {
      id: collaboratorId,
      projectId,
    },
  });

  if (deleted.count === 0) {
    return NextResponse.json({ error: "Not found" }, { status: 404 });
  }

  return NextResponse.json({ ok: true });
}
