"use client";

import { Plus } from "lucide-react";

import { Button } from "@/components/ui/button";

import { useProjectWorkspace } from "@/components/editor/project-workspace-context";

export function EditorHome() {
  const { openCreate } = useProjectWorkspace();

  return (
    <div className="flex flex-1 flex-col items-center justify-center gap-6 px-6 text-center">
      <div className="max-w-md space-y-2">
        <h1 className="font-heading text-balance text-xl font-medium tracking-tight text-foreground sm:text-2xl">
          Create a project or open an existing one
        </h1>
        <p className="text-pretty text-sm text-muted-foreground">
          Start a new architecture workspace, or choose a project from the
          sidebar.
        </p>
      </div>
      <Button type="button" className="gap-2" onClick={openCreate}>
        <Plus className="size-4" aria-hidden />
        New Project
      </Button>
    </div>
  );
}
