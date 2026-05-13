"use client";

import {
  createContext,
  useContext,
  type ReactNode,
} from "react";

import {
  useProjectDialogs,
  type ProjectWorkspaceValue,
} from "@/hooks/use-project-dialogs";

const ProjectWorkspaceContext =
  createContext<ProjectWorkspaceValue | null>(null);

export function ProjectWorkspaceProvider({ children }: { children: ReactNode }) {
  const value = useProjectDialogs();
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
