"use client";

import {
  createContext,
  useContext,
  type ReactNode,
} from "react";

import type { Project } from "@/types/project";
import {
  useProjectDialogs,
  type ProjectWorkspaceValue,
} from "@/hooks/use-project-dialogs";

const ProjectWorkspaceContext =
  createContext<ProjectWorkspaceValue | null>(null);

export function ProjectWorkspaceProvider({
  children,
  initialOwned,
  initialShared,
}: {
  children: ReactNode;
  initialOwned: Project[];
  initialShared: Project[];
}) {
  const value = useProjectDialogs({
    initialOwned,
    initialShared,
  });
  return (
    <ProjectWorkspaceContext.Provider value={value}>
      {children}
    </ProjectWorkspaceContext.Provider>
  );
}

export function useProjectWorkspace(): ProjectWorkspaceValue {
  const ctx = useContext(ProjectWorkspaceContext);
  if (!ctx) {
    throw new Error(
      "useProjectWorkspace must be used within ProjectWorkspaceProvider"
    );
  }
  return ctx;
}
