'use client';

import { create } from 'zustand';

export type LabMode = 'idle' | 'connecting' | 'active';

interface LabModeState {
  mode: LabMode;
  setMode: (mode: LabMode) => void;
}

export const useLabModeStore = create<LabModeState>((set) => ({
  mode: 'idle',
  setMode: (mode) => set({ mode }),
}));
