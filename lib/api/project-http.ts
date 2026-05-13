import { NextResponse } from "next/server";

import type { Project } from "@/types/project";
import type { Project as DbProject } from "../../generated/prisma/client";

export const DEFAULT_CANVAS_JSON_PATH = "";

const UNTITLED = "Untitled Project";

export function serializeProject(row: DbProject): Project {
  return {
    id: row.id,
    name: row.name,
    slug: row.id,
    role: "owner",
  };
}

export function serializeSharedProject(row: DbProject): Project {
  return {
    id: row.id,
    name: row.name,
    slug: row.id,
    role: "collaborator",
  };
}

export async function parseCreatePayload(request: Request): Promise<
  | { ok: true; name: string; description?: string | null }
  | { ok: false; response: NextResponse }
> {
  try {
    const raw = await request.json();
    const body = typeof raw === "object" && raw !== null ? raw : {};
    const requestedName =
      typeof (body as { name?: unknown }).name === "string"
        ? (body as { name: string }).name.trim()
        : "";
    const name = requestedName.length > 0 ? requestedName : UNTITLED;

    let description: string | undefined | null = undefined;

    if ("description" in body) {
      const d = (body as { description?: unknown }).description;
      if (d === null) {
        description = null;
      } else if (typeof d === "string") {
        description = d;
      } else {
        return {
          ok: false,
          response: NextResponse.json(
            { error: "description must be string or null" },
            { status: 400 }
          ),
        };
      }
    }

    if (description !== undefined) {
      return { ok: true, name, description };
    }

    return { ok: true, name };
  } catch {
    return {
      ok: false,
      response: NextResponse.json({ error: "Invalid JSON body" }, { status: 400 }),
    };
  }
}

export async function parseRenamePayload(request: Request): Promise<
  | { ok: true; name: string }
  | { ok: false; response: NextResponse }
> {
  try {
    const raw = await request.json();
    const body = typeof raw === "object" && raw !== null ? raw : {};
    const nameRaw = (body as { name?: unknown }).name;

    if (typeof nameRaw !== "string") {
      return {
        ok: false,
        response: NextResponse.json({ error: "name is required" }, { status: 400 }),
      };
    }

    const name = nameRaw.trim();

    if (name.length === 0) {
      return {
        ok: false,
        response: NextResponse.json({ error: "name cannot be empty" }, { status: 400 }),
      };
    }

    return { ok: true, name };
  } catch {
    return {
      ok: false,
      response: NextResponse.json({ error: "Invalid JSON body" }, { status: 400 }),
    };
  }
}
