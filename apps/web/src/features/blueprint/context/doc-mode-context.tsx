"use client";

import { createContext, useContext, useState, useCallback } from "react";
import type { ReactNode } from "react";

interface DocModeState {
  docMode: boolean;
  activeModule: string;
  activeTab: number;
  aiOpen: boolean;
}

interface DocModeActions {
  toggleDocMode: () => void;
  setActiveModule: (id: string) => void;
  setActiveTab: (index: number) => void;
  toggleAI: () => void;
}

const DocModeStateCtx = createContext<DocModeState>({
  docMode: false,
  activeModule: "dashboard",
  activeTab: 0,
  aiOpen: false,
});

const DocModeActionsCtx = createContext<DocModeActions>({
  toggleDocMode: () => {},
  setActiveModule: () => {},
  setActiveTab: () => {},
  toggleAI: () => {},
});

export function DocModeProvider({ children }: { children: ReactNode }) {
  const [docMode, setDocMode] = useState(false);
  const [activeModule, setActiveModuleRaw] = useState("dashboard");
  const [activeTab, setActiveTab] = useState(0);
  const [aiOpen, setAiOpen] = useState(false);

  const toggleDocMode = useCallback(() => setDocMode((prev) => !prev), []);
  const setActiveModule = useCallback((id: string) => {
    setActiveModuleRaw(id);
    setActiveTab(0);
  }, []);
  const toggleAI = useCallback(() => setAiOpen((prev) => !prev), []);

  return (
    <DocModeStateCtx.Provider value={{ docMode, activeModule, activeTab, aiOpen }}>
      <DocModeActionsCtx.Provider
        value={{ toggleDocMode, setActiveModule, setActiveTab, toggleAI }}
      >
        {children}
      </DocModeActionsCtx.Provider>
    </DocModeStateCtx.Provider>
  );
}

export const useDocModeState = () => useContext(DocModeStateCtx);
export const useDocModeActions = () => useContext(DocModeActionsCtx);
