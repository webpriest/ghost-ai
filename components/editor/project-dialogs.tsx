"use client";

import { useEffect, useId } from "react";

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

import { useProjectWorkspace } from "@/components/editor/project-workspace-context";

export function ProjectDialogs() {
  const createNameId = useId();
  const renameNameId = useId();
  const {
    activeDialog,
    closeDialog,
    createName,
    setCreateName,
    createSlugPreview,
    canSubmitCreate,
    renameName,
    setRenameName,
    targetProject,
    isLoading,
    submitCreate,
    submitRename,
    submitDelete,
  } = useProjectWorkspace();

  useEffect(() => {
    if (activeDialog === "rename") {
      const id = requestAnimationFrame(() => {
        const el = document.getElementById(renameNameId);
        if (el instanceof HTMLInputElement) {
          el.focus();
          el.select();
        }
      });
      return () => cancelAnimationFrame(id);
    }
    return undefined;
  }, [activeDialog, renameNameId]);

  return (
    <>
      <Dialog
        open={activeDialog === "create"}
        onOpenChange={(open) => {
          if (!open) closeDialog();
        }}
      >
        <DialogContent className="gap-4 rounded-3xl sm:max-w-md">
          <DialogHeader>
            <DialogTitle>New project</DialogTitle>
            <DialogDescription>
              Name your workspace. You can change it later.
            </DialogDescription>
          </DialogHeader>
          <form
            className="grid gap-4"
            onSubmit={(e) => {
              e.preventDefault();
              void submitCreate();
            }}
          >
            <div className="grid gap-2">
              <label
                htmlFor={createNameId}
                className="text-sm font-medium text-foreground"
              >
                Project name
              </label>
              <Input
                id={createNameId}
                value={createName}
                onChange={(e) => setCreateName(e.target.value)}
                placeholder="e.g. Payments redesign"
                autoComplete="off"
                disabled={isLoading}
              />
            </div>
            <div className="rounded-xl border border-border bg-muted/40 px-3 py-2">
              <p className="text-xs font-medium text-muted-foreground">
                Slug preview
              </p>
              <p className="font-mono text-sm text-foreground">
                /{createSlugPreview}
              </p>
            </div>
            <DialogFooter className="gap-2 border-0 bg-transparent p-0 sm:justify-end">
              <Button
                type="button"
                variant="outline"
                disabled={isLoading}
                onClick={closeDialog}
              >
                Cancel
              </Button>
              <Button
                type="submit"
                disabled={isLoading || !canSubmitCreate}
              >
                {isLoading ? "Creating…" : "Create"}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      <Dialog
        open={activeDialog === "rename"}
        onOpenChange={(open) => {
          if (!open) closeDialog();
        }}
      >
        <DialogContent className="gap-4 rounded-3xl sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Rename project</DialogTitle>
            <DialogDescription>
              Current name:{" "}
              <span className="font-medium text-foreground">
                {targetProject?.name ?? "—"}
              </span>
            </DialogDescription>
          </DialogHeader>
          <form
            className="grid gap-4"
            onSubmit={(e) => {
              e.preventDefault();
              void submitRename();
            }}
          >
            <div className="grid gap-2">
              <label
                htmlFor={renameNameId}
                className="text-sm font-medium text-foreground"
              >
                Project name
              </label>
              <Input
                id={renameNameId}
                value={renameName}
                onChange={(e) => setRenameName(e.target.value)}
                autoComplete="off"
                disabled={isLoading}
              />
            </div>
            <DialogFooter className="gap-2 border-0 bg-transparent p-0 sm:justify-end">
              <Button
                type="button"
                variant="outline"
                disabled={isLoading}
                onClick={closeDialog}
              >
                Cancel
              </Button>
              <Button
                type="submit"
                disabled={isLoading || !renameName.trim()}
              >
                {isLoading ? "Saving…" : "Save"}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      <Dialog
        open={activeDialog === "delete"}
        onOpenChange={(open) => {
          if (!open) closeDialog();
        }}
      >
        <DialogContent className="gap-4 rounded-3xl sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Delete project</DialogTitle>
            <DialogDescription>
              This will remove{" "}
              <span className="font-medium text-foreground">
                {targetProject?.name ?? "this project"}
              </span>{" "}
              from your list. This action cannot be undone.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter className="gap-2 border-0 bg-transparent p-0 sm:justify-end">
            <Button
              type="button"
              variant="outline"
              disabled={isLoading}
              onClick={closeDialog}
            >
              Cancel
            </Button>
            <Button
              type="button"
              variant="destructive"
              disabled={isLoading}
              onClick={() => void submitDelete()}
            >
              {isLoading ? "Deleting…" : "Delete project"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}
