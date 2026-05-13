import { NextResponse } from "next/server";

import { parseRenamePayload, serializeProject } from "@/lib/api/project-http";
import { requireUserId } from "@/lib/api/require-user";
import { prisma } from "@/lib/prisma";

type RouteCtx = { params: Promise<{ projectId: string }> };

export async function PATCH(request: Request, context: RouteCtx) {
  const auth = await requireUserId();
  if (!auth.ok) {
    return auth.response;
  }

  const { projectId } = await context.params;

  const payload = await parseRenamePayload(request);
  if (!payload.ok) {
    return payload.response;
  }

  const existing = await prisma.project.findUnique({
    where: { id: projectId },
  });

  if (!existing) {
    return NextResponse.json({ error: "Not found" }, { status: 404 });
  }

  if (existing.ownerId !== auth.userId) {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  const updated = await prisma.project.update({
    where: { id: projectId },
    data: { name: payload.name },
  });

  return NextResponse.json(serializeProject(updated));
}

export async function DELETE(_request: Request, context: RouteCtx) {
  const auth = await requireUserId();
  if (!auth.ok) {
    return auth.response;
  }

  const { projectId } = await context.params;

  const existing = await prisma.project.findUnique({
    where: { id: projectId },
  });

  if (!existing) {
    return NextResponse.json({ error: "Not found" }, { status: 404 });
  }

  if (existing.ownerId !== auth.userId) {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  await prisma.project.delete({
    where: { id: projectId },
  });

  return new NextResponse(null, { status: 204 });
}
