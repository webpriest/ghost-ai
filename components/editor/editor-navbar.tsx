"use client";

import { PanelLeftClose, PanelLeftOpen } from "lucide-react";

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
  return (
    <header
      className={cn(
        "fixed inset-x-0 top-0 z-100 flex h-14 shrink-0 items-center border-b border-border bg-card",
        className
      )}
    >
      <div className="grid h-full w-full grid-cols-[auto_1fr_auto] items-center gap-3 px-3">
        <div className="flex items-center justify-start">
          <Button
            variant="ghost"
            size="icon-sm"
            type="button"
            aria-expanded={isSidebarOpen}
            aria-label={isSidebarOpen ? "Close projects sidebar" : "Open projects sidebar"}
            onClick={onToggleSidebar}
          >
            {isSidebarOpen ? (
              <PanelLeftClose className="size-5" aria-hidden />
            ) : (
              <PanelLeftOpen className="size-5" aria-hidden />
            )}
          </Button>
        </div>
        <div className="min-w-0" />
        <div className="flex items-center justify-end" />
      </div>
    </header>
  );
}
