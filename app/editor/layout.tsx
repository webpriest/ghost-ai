import type { ReactNode } from "react";

import { auth, currentUser } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";

import { EditorLayout } from "@/components/editor/editor-layout";
import { fetchEditorProjectsData } from "@/lib/editor-projects-data";

export default async function EditorAreaLayout({
  children,
}: {
  children: ReactNode;
}) {
  const { userId } = await auth();
  if (!userId) {
    redirect("/sign-in");
  }

  const user = await currentUser();
  const primaryEmailNormalized =
    user?.primaryEmailAddress?.emailAddress?.trim().toLowerCase() ?? null;

  const { owned, shared } = await fetchEditorProjectsData({
    ownerId: userId,
    primaryEmailNormalized,
  });

  return (
    <EditorLayout ownedProjects={owned} sharedProjects={shared}>
      {children}
    </EditorLayout>
  );
}
