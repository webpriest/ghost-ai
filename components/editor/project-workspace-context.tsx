"use client";

import {
  createContext,
  useContext,
  type ReactNode,
} from "react";

import {
  useProjectActions,
  type ProjectWorkspaceValue,
} from "@/hooks/use-project-actions";

import type { Project } from "@/types/project";

const ProjectWorkspaceContext =
  createContext<ProjectWorkspaceValue | null>(null);

export function ProjectWorkspaceProvider({
  ownedProjects,
  sharedProjects,
  children,
}: {
  ownedProjects: Project[];
  sharedProjects: Project[];
  children: ReactNode;
}) {
  const value = useProjectActions({ ownedProjects, sharedProjects });
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
