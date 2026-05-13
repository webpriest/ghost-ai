"use client";

import { useRouter, usePathname } from "next/navigation";
import { useCallback, useEffect, useMemo, useState } from "react";

import { slugFromNameOrNull } from "@/lib/slug-preview";
import type { Project } from "@/types/project";

export type ProjectDialogMode = "create" | "rename" | "delete";

function shortUniqueSuffix(length = 4): string {
  const chars = "abcdefghijklmnopqrstuvwxyz0123456789";
  if (typeof crypto !== "undefined" && crypto.getRandomValues) {
    const bytes = new Uint8Array(length);
    crypto.getRandomValues(bytes);
    return Array.from(bytes, (b) => chars[b % chars.length]).join("");
  }
  return Array.from({ length }, () => chars[Math.floor(Math.random() * chars.length)]).join(
    ""
  );
}

export interface UseProjectDialogsOptions {
  initialOwned: Project[];
  initialShared: Project[];
}

export function useProjectDialogs({
  initialOwned,
  initialShared,
}: UseProjectDialogsOptions) {
  const router = useRouter();
  const pathname = usePathname();

  const [ownedProjects, setOwnedProjects] = useState<Project[]>(initialOwned);
  const [sharedProjects, setSharedProjects] = useState<Project[]>(initialShared);
  const [activeDialog, setActiveDialog] = useState<ProjectDialogMode | null>(
    null
  );
  const [targetProject, setTargetProject] = useState<Project | null>(null);
  const [createName, setCreateName] = useState("");
  const [createRoomSuffix, setCreateRoomSuffix] = useState(() =>
    shortUniqueSuffix()
  );
  const [renameName, setRenameName] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    setOwnedProjects(initialOwned);
    setSharedProjects(initialShared);
  }, [initialOwned, initialShared]);

  const createRoomIdPreview = useMemo(() => {
    const slug = slugFromNameOrNull(createName);
    if (slug === null) return "";
    return `${slug}-${createRoomSuffix}`;
  }, [createName, createRoomSuffix]);

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
    setCreateRoomSuffix(shortUniqueSuffix());
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
    if (slugFromNameOrNull(createName) === null) return;
    setIsLoading(true);
    try {
      const res = await fetch("/api/projects", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name }),
      });
      if (!res.ok) {
        setIsLoading(false);
        return;
      }
      const created = (await res.json()) as { id: string };
      closeDialog();
      router.push(`/editor/${created.id}`);
      router.refresh();
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
        return;
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
        return;
      }
      const segment = `/editor/${targetProject.id}`;
      if (pathname === segment) {
        router.push("/editor");
      }
      closeDialog();
      router.refresh();
    } finally {
      setIsLoading(false);
    }
  }, [closeDialog, pathname, router, targetProject]);

  const projects = useMemo(
    () => [...ownedProjects, ...sharedProjects],
    [ownedProjects, sharedProjects]
  );

  return {
    projects,
    ownedProjects,
    sharedProjects,
    activeDialog,
    targetProject,
    createName,
    setCreateName,
    createRoomIdPreview,
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
