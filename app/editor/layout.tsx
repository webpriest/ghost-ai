import { auth, currentUser } from "@clerk/nextjs/server";
import type { ReactNode } from "react";

import { ProjectDialogs } from "@/components/editor/project-dialogs";
import { EditorLayout } from "@/components/editor/editor-layout";
import { ProjectWorkspaceProvider } from "@/components/editor/project-workspace-context";
import { getEditorProjectLists } from "@/lib/project-data";

export default async function EditorAreaLayout({
  children,
}: {
  children: ReactNode;
}) {
  const { userId } = await auth();
  if (!userId) {
    return null;
  }

  const user = await currentUser();
  const email =
    user?.primaryEmailAddress?.emailAddress ??
    user?.emailAddresses?.[0]?.emailAddress ??
    "";

  const { ownedProjects, sharedProjects } = await getEditorProjectLists(
    userId,
    email
  );

  return (
    <ProjectWorkspaceProvider
      initialOwned={ownedProjects}
      initialShared={sharedProjects}
    >
      <EditorLayout>{children}</EditorLayout>
      <ProjectDialogs />
    </ProjectWorkspaceProvider>
  );
}
