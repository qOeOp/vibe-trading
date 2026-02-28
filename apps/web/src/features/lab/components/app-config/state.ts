/**
 * Stub: app-config/state — Settings panel navigation not used in VT.
 */

import { atom } from 'jotai';

/** Sub-tab navigation for the AI settings panel */
export const aiSettingsSubTabAtom = atom<string>('model');

export function useOpenSettingsToTab() {
  const handleClick = (_tab: string, _subTab?: string) => {
    // no-op in VT
  };
  return { handleClick };
}
