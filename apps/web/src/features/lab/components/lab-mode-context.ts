import { createContext, useContext } from 'react';

interface LabModeState {
  isLabMode: boolean;
  onExit: (() => void) | null;
}

export const LabModeContext = createContext<LabModeState>({
  isLabMode: false,
  onExit: null,
});

export function useLabMode() {
  return useContext(LabModeContext);
}
