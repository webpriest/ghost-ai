import { NextResponse } from "next/server";

import {
  DEFAULT_CANVAS_JSON_PATH,
  parseCreatePayload,
  serializeProject,
} from "@/lib/api/project-http";
import { requireUserId } from "@/lib/api/require-user";
import { prisma } from "@/lib/prisma";

export async function GET() {
  const auth = await requireUserId();
  if (!auth.ok) {
    return auth.response;
  }

  const projects = await prisma.project.findMany({
    where: { ownerId: auth.userId },
    orderBy: { createdAt: "desc" },
  });

  return NextResponse.json({ projects: projects.map(serializeProject) });
}

export async function POST(request: Request) {
  const auth = await requireUserId();
  if (!auth.ok) {
    return auth.response;
  }

  const payload = await parseCreatePayload(request);
  if (!payload.ok) {
    return payload.response;
  }

  const project = await prisma.project.create({
    data: {
      ownerId: auth.userId,
      name: payload.name,
      ...(payload.description !== undefined ? { description: payload.description } : {}),
      canvasJsonPath: DEFAULT_CANVAS_JSON_PATH,
    },
  });

  return NextResponse.json(serializeProject(project), { status: 201 });
}
