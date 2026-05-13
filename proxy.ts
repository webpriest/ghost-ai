import { clerkMiddleware } from "@clerk/nextjs/server";

import { isUnderAuthPath, normalizeAuthPath } from "@/lib/auth-public-path";

const clerkProxy = clerkMiddleware(async (auth, req) => {
  const pathname = req.nextUrl.pathname;

  const signInBase = normalizeAuthPath(process.env.NEXT_PUBLIC_CLERK_SIGN_IN_URL, "/sign-in");
  const signUpBase = normalizeAuthPath(process.env.NEXT_PUBLIC_CLERK_SIGN_UP_URL, "/sign-up");

  const isPublicAuthRoute =
    isUnderAuthPath(pathname, signInBase) || isUnderAuthPath(pathname, signUpBase);

  if (!isPublicAuthRoute) {
    await auth.protect();
  }
});

export default clerkProxy;

export const config = {
  matcher: [
    "/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)",
    "/(api|trpc)(.*)",
  ],
};
