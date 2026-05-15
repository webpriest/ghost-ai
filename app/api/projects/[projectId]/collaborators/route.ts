import { clerkClient } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";

import {
  enrichCollaboratorEmailsWithClerk,
  type ClerkCollaboratorPreview,
} from "@/lib/api/enrich-collaborators-clerk";
import {
  requireProjectCollaboratorAccess,
} from "@/lib/api/project-collaborator-access";
import { prisma } from "@/lib/prisma";
import {
  getClerkEditorIdentity,
} from "@/lib/project-access";

type Params = Promise<{ projectId: string }>;

export type SerializedCollaborator = {
  id: string;
  email: string;
  createdAt: string;
  clerk: ClerkCollaboratorPreview | null;
};

function serializeRow(
  row: { id: string; email: string; createdAt: Date },
  clerkMap: Record<string, ClerkCollaboratorPreview>
): SerializedCollaborator {
  const clerk = clerkMap[row.email] ?? null;
  return {
    id: row.id,
    email: row.email,
    createdAt: row.createdAt.toISOString(),
    clerk,
  };
}

async function parseInviteBody(request: Request): Promise<
  | { ok: true; email: string }
  | { ok: false; response: NextResponse }
> {
  try {
    const raw = await request.json();
    const body = typeof raw === "object" && raw !== null ? raw : {};
    const addr = (body as { email?: unknown }).email;
    if (typeof addr !== "string") {
      return {
        ok: false,
        response: NextResponse.json({ error: "email is required" }, { status: 400 }),
      };
    }

    const normalized = addr.trim().toLowerCase();
    if (
      normalized.length === 0 ||
      !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(normalized)
    ) {
      return {
        ok: false,
        response: NextResponse.json(
          { error: "invalid email address" },
          { status: 400 }
        ),
      };
    }

    return { ok: true, email: normalized };
  } catch {
    return {
      ok: false,
      response: NextResponse.json({ error: "Invalid JSON body" }, { status: 400 }),
    };
  }
}

export async function GET(
  _request: Request,
  ctx: { params: Params }
) {
  const { projectId } = await ctx.params;
  const identity = await getClerkEditorIdentity();
  const gate = await requireProjectCollaboratorAccess(projectId, identity);
  if (!gate.ok) {
    return gate.response;
  }

  const rows = await prisma.projectCollaborator.findMany({
    where: { projectId },
    orderBy: { createdAt: "asc" },
    select: { id: true, email: true, createdAt: true },
  });

  let clerkMap: Record<string, ClerkCollaboratorPreview> = {};
  try {
    const cc = await clerkClient();
    clerkMap = await enrichCollaboratorEmailsWithClerk(
      cc,
      rows.map((r) => r.email)
    );
  } catch {
    clerkMap = {};
  }

  return NextResponse.json({
    collaborators: rows.map((r) => serializeRow(r, clerkMap)),
    viewerRole: gate.role,
  });
}

export async function POST(request: Request, ctx: { params: Params }) {
  const { projectId } = await ctx.params;
  const identity = await getClerkEditorIdentity();
  const gate = await requireProjectCollaboratorAccess(projectId, identity);
  if (!gate.ok) {
    return gate.response;
  }

  if (gate.role !== "owner") {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  const parsed = await parseInviteBody(request);
  if (!parsed.ok) {
    return parsed.response;
  }

  if (
    identity?.primaryEmail &&
    parsed.email === identity.primaryEmail
  ) {
    return NextResponse.json(
      { error: "Cannot invite yourself" },
      { status: 400 }
    );
  }

  let row: { id: string; email: string; createdAt: Date };

  try {
    row = await prisma.projectCollaborator.create({
      data: {
        projectId,
        email: parsed.email,
      },
      select: { id: true, email: true, createdAt: true },
    });
  } catch (e: unknown) {
    const code =
      typeof e === "object" &&
      e !== null &&
      "code" in e &&
      (e as { code?: string }).code === "P2002";
    if (code) {
      return NextResponse.json(
        { error: "That collaborator is already on this project" },
        { status: 409 }
      );
    }
    throw e;
  }

  let clerkPreview: ClerkCollaboratorPreview | null = null;
  try {
    const cc = await clerkClient();
    const map = await enrichCollaboratorEmailsWithClerk(cc, [row.email]);
    clerkPreview = map[row.email] ?? null;
  } catch {
    clerkPreview = null;
  }

  return NextResponse.json(serializeRow(row, clerkPreview ? { [row.email]: clerkPreview } : {}));
}
