"use client";

import { UserButton } from "@clerk/nextjs";
import {
  PanelLeftClose,
  PanelLeftOpen,
  Sparkles,
} from "lucide-react";

import { useEditorChrome } from "@/components/editor/editor-chrome-context";
import { ShareProjectTriggerButton } from "@/components/editor/share-project-dialog";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

export interface EditorNavbarProps {
  className?: string;
  isSidebarOpen: boolean;
  onToggleSidebar: () => void;
}

export function EditorNavbar({
  className,
  isSidebarOpen,
  onToggleSidebar,
}: EditorNavbarProps) {
  const {
    activeProject,
    aiPanelOpen,
    toggleAiPanel,
  } = useEditorChrome();

  return (
    <header
      className={cn(
        "fixed inset-x-0 top-0 z-100 flex h-14 shrink-0 items-center border-b border-border bg-card",
        className
      )}
    >
      <div className="grid h-full w-full grid-cols-[auto_minmax(0,1fr)_auto] items-center gap-3 px-3">
        <div className="flex items-center justify-start">
          <Button
            variant="ghost"
            size="icon-sm"
            type="button"
            aria-expanded={isSidebarOpen}
            aria-label={
              isSidebarOpen
                ? "Close projects sidebar"
                : "Open projects sidebar"
            }
            onClick={onToggleSidebar}
          >
            {isSidebarOpen ? (
              <PanelLeftClose className="size-5" aria-hidden />
            ) : (
              <PanelLeftOpen className="size-5" aria-hidden />
            )}
          </Button>
        </div>

        <div className="min-w-0 justify-self-center truncate px-2 text-center font-heading text-sm font-medium text-foreground tabular-nums">
          {activeProject?.name ?? ""}
        </div>

        <div className="flex min-w-0 items-center justify-end gap-1 sm:gap-2">
          {activeProject ? (
            <>
              <ShareProjectTriggerButton activeProject={activeProject} />
              <Button
                type="button"
                variant={aiPanelOpen ? "secondary" : "ghost"}
                size="icon-sm"
                aria-expanded={aiPanelOpen}
                aria-label={
                  aiPanelOpen ? "Close AI sidebar" : "Open AI sidebar"
                }
                onClick={toggleAiPanel}
              >
                <Sparkles className="size-5 text-chart-1" aria-hidden />
              </Button>
            </>
          ) : null}
          <UserButton />
        </div>
      </div>
    </header>
  );
}
