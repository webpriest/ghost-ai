"use client";

import { Sparkles } from "lucide-react";

import { useEditorChrome } from "@/components/editor/editor-chrome-context";

/** Full-viewport workspace body: canvas placeholder + optional AI rail (navbar toggles AI). */
export function EditorWorkspaceShell() {
  const { aiPanelOpen } = useEditorChrome();

  return (
    <div className="flex min-h-0 flex-1 flex-row">
      <div className="flex min-h-0 min-w-0 flex-1 flex-col overflow-hidden rounded-none border-border bg-muted lg:m-4 lg:rounded-2xl lg:border lg:ring-1 lg:ring-border/60">
        <div className="flex min-h-0 flex-1 flex-col items-center justify-center px-6">
          <p className="text-center text-sm text-muted-foreground">
            Canvas workspace — wiring comes next.
          </p>
        </div>
      </div>

      {aiPanelOpen ? (
        <aside
          className="flex w-full max-w-80 shrink-0 flex-col border-border border-l bg-card lg:rounded-l-none"
          aria-label="AI assistant (placeholder)"
        >
          <div className="flex min-h-0 flex-1 flex-col items-center justify-center gap-2 px-4 py-6">
            <Sparkles
              className="size-8 text-muted-foreground opacity-70"
              aria-hidden
              strokeWidth={1.25}
            />
            <p className="text-center text-sm text-muted-foreground">
              AI chat will live here.
            </p>
          </div>
        </aside>
      ) : null}
    </div>
  );
}
