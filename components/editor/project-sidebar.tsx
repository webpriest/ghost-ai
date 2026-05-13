"use client";

import { Pencil, Plus, Trash2, XIcon } from "lucide-react";

import { useProjectWorkspace } from "@/components/editor/project-workspace-context";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { cn } from "@/lib/utils";

export interface ProjectSidebarProps {
  className?: string;
  isOpen: boolean;
  onClose: () => void;
}

export function ProjectSidebar({
  className,
  isOpen,
  onClose,
}: ProjectSidebarProps) {
  const { ownedProjects, sharedProjects, openCreate, openRename, openDelete } =
    useProjectWorkspace();

  return (
    <>
      <button
        type="button"
        aria-hidden={!isOpen}
        tabIndex={isOpen ? 0 : -1}
        className={cn(
          "fixed inset-0 z-90 bg-black/45 transition-opacity supports-backdrop-filter:backdrop-blur-xs",
          isOpen
            ? "pointer-events-auto opacity-100"
            : "pointer-events-none opacity-0"
        )}
        onClick={onClose}
      />
      <aside
        className={cn(
          "fixed top-14 bottom-0 left-0 z-95 flex w-80 max-w-[100vw] flex-col border-r border-border bg-card shadow-xl transition-transform duration-300 ease-out",
          isOpen ? "translate-x-0" : "-translate-x-full",
          className
        )}
        aria-hidden={!isOpen}
      >
        <div className="flex items-center justify-between gap-2 border-b border-border px-4 py-3">
          <h2 className="font-heading text-base font-medium text-foreground">
            Projects
          </h2>
          <Button
            variant="ghost"
            size="icon-sm"
            type="button"
            aria-label="Close projects sidebar"
            onClick={onClose}
          >
            <XIcon className="size-4" aria-hidden />
          </Button>
        </div>

        <Tabs
          defaultValue="my-projects"
          className="flex min-h-0 flex-1 flex-col gap-0"
        >
          <div className="border-b border-border px-4 pt-3 pb-2">
            <TabsList className="w-full">
              <TabsTrigger value="my-projects" className="flex-1">
                My Projects
              </TabsTrigger>
              <TabsTrigger value="shared" className="flex-1">
                Shared
              </TabsTrigger>
            </TabsList>
          </div>

          <TabsContent
            value="my-projects"
            className="min-h-0 flex-1 overflow-y-auto px-2 py-3 data-hidden:hidden"
          >
            {ownedProjects.length === 0 ? (
              <p className="px-2 py-6 text-center text-sm text-muted-foreground">
                No projects yet.
              </p>
            ) : (
              <ul className="flex flex-col gap-0.5">
                {ownedProjects.map((project) => (
                  <li key={project.id}>
                    <div
                      className={cn(
                        "flex items-center gap-0.5 rounded-xl py-1 pl-2",
                        "hover:bg-muted/60"
                      )}
                    >
                      <span className="min-w-0 flex-1 truncate text-sm text-foreground">
                        {project.name}
                      </span>
                      <Button
                        type="button"
                        variant="ghost"
                        size="icon-sm"
                        className="size-8 shrink-0 text-muted-foreground"
                        aria-label={`Rename ${project.name}`}
                        onClick={() => {
                          openRename(project);
                        }}
                      >
                        <Pencil className="size-4" aria-hidden />
                      </Button>
                      <Button
                        type="button"
                        variant="ghost"
                        size="icon-sm"
                        className="size-8 shrink-0 text-muted-foreground"
                        aria-label={`Delete ${project.name}`}
                        onClick={() => {
                          openDelete(project);
                        }}
                      >
                        <Trash2 className="size-4" aria-hidden />
                      </Button>
                    </div>
                  </li>
                ))}
              </ul>
            )}
          </TabsContent>
          <TabsContent
            value="shared"
            className="min-h-0 flex-1 overflow-y-auto px-2 py-3 data-hidden:hidden"
          >
            {sharedProjects.length === 0 ? (
              <p className="px-2 py-6 text-center text-sm text-muted-foreground">
                Nothing shared with you yet.
              </p>
            ) : (
              <ul className="flex flex-col gap-0.5">
                {sharedProjects.map((project) => (
                  <li key={project.id}>
                    <div className="rounded-xl py-2 pr-2 pl-2 hover:bg-muted/60">
                      <span className="block truncate text-sm text-foreground">
                        {project.name}
                      </span>
                    </div>
                  </li>
                ))}
              </ul>
            )}
          </TabsContent>
        </Tabs>

        <div className="border-t border-border p-4">
          <Button
            type="button"
            className="w-full gap-2"
            onClick={openCreate}
          >
            <Plus className="size-4" aria-hidden />
            New Project
          </Button>
        </div>
      </aside>
    </>
  );
}
