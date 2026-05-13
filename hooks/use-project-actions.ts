"use client";

import { useRouter, usePathname } from "next/navigation";
import { useCallback, useMemo, useState } from "react";

import { slugFromNameOrNull } from "@/lib/slug-preview";
import type { Project } from "@/types/project";

export type ProjectDialogMode = "create" | "rename" | "delete";

function shortSuffixSegment() {
  if (typeof crypto !== "undefined" && "randomUUID" in crypto) {
    return crypto.randomUUID().replace(/-/g, "").slice(-7);
  }
  return `${Date.now().toString(36)}`.slice(-7);
}

export function useProjectActions({
  ownedProjects: ownedProjectsProp,
  sharedProjects: sharedProjectsProp,
}: {
  ownedProjects: Project[];
  sharedProjects: Project[];
}) {
  const router = useRouter();
  const pathname = usePathname();

  const [activeDialog, setActiveDialog] = useState<ProjectDialogMode | null>(
    null
  );
  const [targetProject, setTargetProject] = useState<Project | null>(null);
  const [createName, setCreateName] = useState("");
  const [createRoomSuffix, setCreateRoomSuffix] = useState(() =>
    shortSuffixSegment()
  );
  const [renameName, setRenameName] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const createSlugPreview = useMemo(() => {
    const slugPart = slugFromNameOrNull(createName) ?? "untitled";
    return `/editor/${slugPart}-${createRoomSuffix}`;
  }, [createName, createRoomSuffix]);

  const closeDialog = useCallback(() => {
    setActiveDialog(null);
    setTargetProject(null);
    setCreateName("");
    setRenameName("");
    setCreateRoomSuffix(shortSuffixSegment());
  }, []);

  const safeClose = useCallback(() => {
    if (isLoading) return;
    closeDialog();
  }, [closeDialog, isLoading]);

  const openCreate = useCallback(() => {
    setTargetProject(null);
    setCreateName("");
    setRenameName("");
    setCreateRoomSuffix(shortSuffixSegment());
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
    setIsLoading(true);
    try {
      const res = await fetch("/api/projects", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...(name.length > 0 ? { name } : {}),
        }),
      });
      if (!res.ok) {
        throw new Error(`Create failed (${res.status})`);
      }
      const data = (await res.json()) as Project;
      closeDialog();
      router.refresh();
      router.push(`/editor/${data.id}`);
    } finally {
      setIsLoading(false);
    }
  }, [closeDialog, createName, router]);

  const submitRename = useCallback(async () => {
    if (!targetProject) return;
    const name = renameName.trim();
    if (!name) return;
    setIsLoading(true);
    try {
      const res = await fetch(`/api/projects/${targetProject.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name }),
      });
      if (!res.ok) {
        throw new Error(`Rename failed (${res.status})`);
      }
      closeDialog();
      router.refresh();
    } finally {
      setIsLoading(false);
    }
  }, [closeDialog, renameName, router, targetProject]);

  const submitDelete = useCallback(async () => {
    if (!targetProject) return;
    setIsLoading(true);
    try {
      const res = await fetch(`/api/projects/${targetProject.id}`, {
        method: "DELETE",
      });
      if (!res.ok) {
        throw new Error(`Delete failed (${res.status})`);
      }
      closeDialog();

      const match = pathname.match(/^\/editor\/([^/]+)/);
      const activeId = match?.[1];
      if (activeId === targetProject.id) {
        router.replace("/editor");
      }
      router.refresh();
    } finally {
      setIsLoading(false);
    }
  }, [closeDialog, pathname, router, targetProject]);

  const ownedProjects = useMemo(
    () => ownedProjectsProp,
    [ownedProjectsProp]
  );
  const sharedProjects = useMemo(
    () => sharedProjectsProp,
    [sharedProjectsProp]
  );

  const projectsCombined = useMemo(
    () => [...ownedProjects, ...sharedProjects],
    [ownedProjects, sharedProjects]
  );

  return {
    projects: projectsCombined,
    ownedProjects,
    sharedProjects,
    activeDialog,
    targetProject,
    createName,
    setCreateName,
    createSlugPreview,
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

export type ProjectWorkspaceValue = ReturnType<typeof useProjectActions>;
