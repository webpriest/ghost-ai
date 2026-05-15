import { redirect } from "next/navigation";

import { ActiveProjectHydrator } from "@/components/editor/active-project-hydrator";
import { AccessDenied } from "@/components/editor/access-denied";
import { EditorWorkspaceShell } from "@/components/editor/editor-workspace-shell";
import {
  findAccessibleProjectForUser,
  getClerkEditorIdentity,
} from "@/lib/project-access";

export default async function EditorRoomPage(props: {
  params: Promise<{ roomId: string }>;
}) {
  const { roomId } = await props.params;

  const identity = await getClerkEditorIdentity();
  if (!identity) {
    redirect("/sign-in");
  }

  const project = await findAccessibleProjectForUser(roomId, identity);
  if (!project) {
    return <AccessDenied />;
  }

  return (
    <>
      <ActiveProjectHydrator
        project={{ id: project.id, name: project.name, role: project.role }}
      />
      <EditorWorkspaceShell />
    </>
  );
}
