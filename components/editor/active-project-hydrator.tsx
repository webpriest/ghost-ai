"use client";

import { useLayoutEffect } from "react";

import { useEditorChrome } from "@/components/editor/editor-chrome-context";

/** Syncs `/editor/[roomId]` workspace project into editor chrome for the navbar. */
export function ActiveProjectHydrator({
  project,
}: {
  project: { id: string; name: string; role: "owner" | "collaborator" };
}) {
  const { registerActiveProject, clearActiveProject } = useEditorChrome();

  useLayoutEffect(() => {
    registerActiveProject(project);
    return clearActiveProject;
  }, [
    clearActiveProject,
    project.id,
    project.name,
    project.role,
    registerActiveProject,
  ]);

  return null;
}
