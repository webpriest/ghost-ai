import { auth } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";

export type AuthenticatedUserId =
  | { ok: true; userId: string }
  | { ok: false; response: NextResponse };

/** Returns `401` JSON when Clerk session is absent; API routes rely on middleware leaving `/api` unprotected so this stays JSON. */
export async function requireUserId(): Promise<AuthenticatedUserId> {
  const { userId } = await auth();

  if (!userId) {
    return {
      ok: false,
      response: NextResponse.json({ error: "Unauthorized" }, { status: 401 }),
    };
  }

  return { ok: true, userId };
}
