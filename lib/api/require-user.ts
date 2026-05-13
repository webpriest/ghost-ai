import { auth } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";

export type RequireUserOk = { ok: true; userId: string };

export type RequireUserFail = {
  ok: false;
  response: NextResponse;
};

export type RequireUserResult = RequireUserOk | RequireUserFail;

export async function requireUserId(): Promise<RequireUserResult> {
  const { userId } = await auth();
  if (!userId) {
    return {
      ok: false,
      response: NextResponse.json({ error: "Unauthorized" }, { status: 401 }),
    };
  }

  return { ok: true, userId };
}
