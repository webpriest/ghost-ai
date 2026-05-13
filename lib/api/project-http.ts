import { NextResponse } from "next/server";

import type { Project } from "@/app/generated/prisma/client";

export const DEFAULT_PROJECT_NAME = "Untitled Project";

/** Placeholder until canvas persistence writes a blob reference. */
export const DEFAULT_CANVAS_JSON_PATH = "";

export interface ProjectPayload {
  id: string;
  ownerId: string;
  name: string;
  description: string | null;
  status: Project["status"];
  canvasJsonPath: string;
  createdAt: string;
  updatedAt: string;
}

export function serializeProject(project: Project): ProjectPayload {
  return {
    id: project.id,
    ownerId: project.ownerId,
    name: project.name,
    description: project.description,
    status: project.status,
    canvasJsonPath: project.canvasJsonPath,
    createdAt: project.createdAt.toISOString(),
    updatedAt: project.updatedAt.toISOString(),
  };
}

async function parseJsonBody(request: Request): Promise<unknown | null> {
  const contentLength = request.headers.get("content-length");
  if (contentLength === "0" || contentLength === "0 ") {
    return {};
  }

  try {
    const text = await request.text();
    if (!text.trim()) {
      return {};
    }
    return JSON.parse(text) as unknown;
  } catch {
    return null;
  }
}

export type CreatePayloadResult =
  | { ok: true; name: string; description?: string | null }
  | { ok: false; response: NextResponse };

export async function parseCreatePayload(request: Request): Promise<CreatePayloadResult> {
  const parsed = await parseJsonBody(request);
  if (parsed === null) {
    return {
      ok: false,
      response: NextResponse.json({ error: "Invalid JSON" }, { status: 400 }),
    };
  }

  if (typeof parsed !== "object" || parsed === null || Array.isArray(parsed)) {
    return {
      ok: false,
      response: NextResponse.json({ error: "Invalid body" }, { status: 400 }),
    };
  }

  const body = parsed as Record<string, unknown>;

  if ("name" in body && body.name !== undefined && typeof body.name !== "string") {
    return {
      ok: false,
      response: NextResponse.json({ error: "`name` must be a string" }, { status: 400 }),
    };
  }

  if (
    "description" in body &&
    body.description !== undefined &&
    body.description !== null &&
    typeof body.description !== "string"
  ) {
    return {
      ok: false,
      response: NextResponse.json(
        { error: "`description` must be a string or null" },
        { status: 400 },
      ),
    };
  }

  let name = DEFAULT_PROJECT_NAME;
  if (typeof body.name === "string") {
    const trimmed = body.name.trim();
    if (trimmed.length > 0) {
      name = trimmed;
    }
  }

  let description: string | null | undefined;
  if ("description" in body) {
    if (body.description === null) {
      description = null;
    } else if (typeof body.description === "string") {
      const trimmed = body.description.trim();
      description = trimmed.length > 0 ? trimmed : null;
    }
  }

  const result: { ok: true; name: string; description?: string | null } = { ok: true, name };
  if (description !== undefined) {
    result.description = description;
  }
  return result;
}

export type PatchPayloadResult =
  | { ok: true; name: string }
  | { ok: false; response: NextResponse };

export async function parseRenamePayload(request: Request): Promise<PatchPayloadResult> {
  const parsed = await parseJsonBody(request);
  if (parsed === null) {
    return {
      ok: false,
      response: NextResponse.json({ error: "Invalid JSON" }, { status: 400 }),
    };
  }

  if (typeof parsed !== "object" || parsed === null || Array.isArray(parsed)) {
    return {
      ok: false,
      response: NextResponse.json({ error: "Invalid body" }, { status: 400 }),
    };
  }

  const body = parsed as Record<string, unknown>;
  if (typeof body.name !== "string" || body.name.trim().length === 0) {
    return {
      ok: false,
      response: NextResponse.json(
        { error: "`name` is required and must be a non-empty string" },
        { status: 400 },
      ),
    };
  }

  return { ok: true, name: body.name.trim() };
}
