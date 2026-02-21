import { createContext, useContext } from 'react';

interface LabFullscreenState {
  isFullscreen: boolean;
  onExit: (() => void) | null;
}

export const LabFullscreenContext = createContext<LabFullscreenState>({
  isFullscreen: false,
  onExit: null,
});

export function useLabFullscreen() {
  return useContext(LabFullscreenContext);
}
