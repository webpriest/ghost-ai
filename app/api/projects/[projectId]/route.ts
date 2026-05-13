import { NextResponse } from "next/server";

import {
  parseRenamePayload,
  serializeProject,
} from "@/lib/api/project-http";
import { requireUserId } from "@/lib/api/require-user";
import { prisma } from "@/lib/prisma";

type Params = Promise<{ projectId: string }>;

async function authorizeOwner(projectId: string, userId: string) {
  return prisma.project.findFirst({
    where: { id: projectId, ownerId: userId },
  });
}

export async function PATCH(request: Request, ctx: { params: Params }) {
  const auth = await requireUserId();
  if (!auth.ok) {
    return auth.response;
  }

  const { projectId } = await ctx.params;

  const existing = await authorizeOwner(projectId, auth.userId);
  if (!existing) {
    const any = await prisma.project.findUnique({
      where: { id: projectId },
      select: { id: true },
    });
    if (!any) {
      return NextResponse.json({ error: "Not found" }, { status: 404 });
    }
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  const payload = await parseRenamePayload(request);
  if (!payload.ok) {
    return payload.response;
  }

  const updated = await prisma.project.update({
    where: { id: projectId },
    data: {
      name: payload.name,
    },
  });

  return NextResponse.json(serializeProject(updated));
}

export async function DELETE(_request: Request, ctx: { params: Params }) {
  const auth = await requireUserId();
  if (!auth.ok) {
    return auth.response;
  }

  const { projectId } = await ctx.params;

  const existing = await authorizeOwner(projectId, auth.userId);
  if (!existing) {
    const any = await prisma.project.findUnique({
      where: { id: projectId },
      select: { id: true },
    });
    if (!any) {
      return NextResponse.json({ error: "Not found" }, { status: 404 });
    }
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  await prisma.project.delete({
    where: { id: projectId },
  });

  return NextResponse.json({ ok: true });
}
