"use client";

import { useState, type ReactNode } from "react";

import { EditorNavbar } from "@/components/editor/editor-navbar";
import { ProjectDialogs } from "@/components/editor/project-dialogs";
import { ProjectSidebar } from "@/components/editor/project-sidebar";
import { ProjectWorkspaceProvider } from "@/components/editor/project-workspace-context";

export function EditorLayout({ children }: { children: ReactNode }) {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <ProjectWorkspaceProvider>
      <div className="relative flex min-h-screen flex-col bg-background">
        <EditorNavbar
          isSidebarOpen={sidebarOpen}
          onToggleSidebar={() => setSidebarOpen((open) => !open)}
        />
        <main className="relative z-0 flex min-h-0 flex-1 flex-col pt-14">
          {children}
        </main>
        <ProjectSidebar
          isOpen={sidebarOpen}
          onClose={() => setSidebarOpen(false)}
        />
        <ProjectDialogs />
      </div>
    </ProjectWorkspaceProvider>
  );
}
