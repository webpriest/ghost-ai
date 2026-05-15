"use client";

import {
  createContext,
  useCallback,
  useContext,
  useMemo,
  useState,
  type ReactNode,
} from "react";

export type EditorActiveProject = {
  id: string;
  name: string;
  role: "owner" | "collaborator";
} | null;

type EditorChromeContextValue = {
  activeProject: EditorActiveProject;
  registerActiveProject: (project: {
    id: string;
    name: string;
    role: "owner" | "collaborator";
  }) => void;
  clearActiveProject: () => void;
  aiPanelOpen: boolean;
  toggleAiPanel: () => void;
};

const EditorChromeContext = createContext<EditorChromeContextValue | null>(
  null
);

export function EditorChromeProvider({ children }: { children: ReactNode }) {
  const [activeProject, setActiveProject] = useState<EditorActiveProject>(null);
  const [aiPanelOpen, setAiPanelOpen] = useState(false);

  const registerActiveProject = useCallback(
    (project: {
      id: string;
      name: string;
      role: "owner" | "collaborator";
    }) => {
      setActiveProject(project);
    },
    []
  );

  const clearActiveProject = useCallback(() => {
    setActiveProject(null);
  }, []);

  const toggleAiPanel = useCallback(() => {
    setAiPanelOpen((open) => !open);
  }, []);

  const value = useMemo(
    (): EditorChromeContextValue => ({
      activeProject,
      registerActiveProject,
      clearActiveProject,
      aiPanelOpen,
      toggleAiPanel,
    }),
    [
      activeProject,
      registerActiveProject,
      clearActiveProject,
      aiPanelOpen,
      toggleAiPanel,
    ]
  );

  return (
    <EditorChromeContext.Provider value={value}>
      {children}
    </EditorChromeContext.Provider>
  );
}

export function useEditorChrome() {
  const ctx = useContext(EditorChromeContext);
  if (!ctx) {
    throw new Error(
      "useEditorChrome must be used within EditorChromeProvider"
    );
  }
  return ctx;
}
