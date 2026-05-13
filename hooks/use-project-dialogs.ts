"use client";

import { useCallback, useMemo, useState } from "react";

import { MOCK_PROJECTS } from "@/lib/mock-projects";
import {
  slugFromNameOrNull,
  slugPreviewFromName,
} from "@/lib/slug-preview";
import type { Project } from "@/types/project";

export type ProjectDialogMode = "create" | "rename" | "delete";

function mockDelay(ms: number) {
  return new Promise<void>((resolve) => {
    setTimeout(resolve, ms);
  });
}

function newProjectId() {
  if (typeof crypto !== "undefined" && "randomUUID" in crypto) {
    return crypto.randomUUID();
  }
  return `mock-${Date.now()}-${Math.random().toString(36).slice(2, 9)}`;
}

export function useProjectDialogs() {
  const [projects, setProjects] = useState<Project[]>(() => [...MOCK_PROJECTS]);
  const [activeDialog, setActiveDialog] = useState<ProjectDialogMode | null>(
    null
  );
  const [targetProject, setTargetProject] = useState<Project | null>(null);
  const [createName, setCreateName] = useState("");
  const [renameName, setRenameName] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const createSlugPreview = useMemo(
    () => slugPreviewFromName(createName),
    [createName]
  );

  const canSubmitCreate = useMemo(
    () => slugFromNameOrNull(createName) !== null,
    [createName]
  );

  const closeDialog = useCallback(() => {
    setActiveDialog(null);
    setTargetProject(null);
    setCreateName("");
    setRenameName("");
  }, []);

  const safeClose = useCallback(() => {
    if (isLoading) return;
    closeDialog();
  }, [closeDialog, isLoading]);

  const openCreate = useCallback(() => {
    setTargetProject(null);
    setCreateName("");
    setRenameName("");
    setActiveDialog("create");
  }, []);

  const openRename = useCallback((project: Project) => {
    setTargetProject(project);
    setRenameName(project.name);
    setActiveDialog("rename");
  }, []);

  const openDelete = useCallback((project: Project) => {
    setTargetProject(project);
    setActiveDialog("delete");
  }, []);

  const submitCreate = useCallback(async () => {
    const name = createName.trim();
    const slug = slugFromNameOrNull(createName);
    if (!name || slug === null) return;
    setIsLoading(true);
    await mockDelay(320);
    setProjects((prev) => [
      ...prev,
      { id: newProjectId(), name, slug, role: "owner" },
    ]);
    setIsLoading(false);
    closeDialog();
  }, [closeDialog, createName]);

  const submitRename = useCallback(async () => {
    if (!targetProject) return;
    const name = renameName.trim();
    if (!name) return;
    setIsLoading(true);
    await mockDelay(280);
    const slug = slugPreviewFromName(name);
    setProjects((prev) =>
      prev.map((p) =>
        p.id === targetProject.id ? { ...p, name, slug } : p
      )
    );
    setIsLoading(false);
    closeDialog();
  }, [closeDialog, renameName, targetProject]);

  const submitDelete = useCallback(async () => {
    if (!targetProject) return;
    setIsLoading(true);
    await mockDelay(280);
    setProjects((prev) => prev.filter((p) => p.id !== targetProject.id));
    setIsLoading(false);
    closeDialog();
  }, [closeDialog, targetProject]);

  const ownedProjects = useMemo(
    () => projects.filter((p) => p.role === "owner"),
    [projects]
  );
  const sharedProjects = useMemo(
    () => projects.filter((p) => p.role === "collaborator"),
    [projects]
  );

  return {
    projects,
    ownedProjects,
    sharedProjects,
    activeDialog,
    targetProject,
    createName,
    setCreateName,
    createSlugPreview,
    canSubmitCreate,
    renameName,
    setRenameName,
    isLoading,
    openCreate,
    openRename,
    openDelete,
    closeDialog: safeClose,
    submitCreate,
    submitRename,
    submitDelete,
  };
}

export type ProjectWorkspaceValue = ReturnType<typeof useProjectDialogs>;
