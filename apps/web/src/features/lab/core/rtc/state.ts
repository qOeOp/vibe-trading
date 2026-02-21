/**
 * Stub: rtc/state — Real-time collaboration not used in VT.
 */

import { atom } from "jotai";

export function isRtcEnabled(): boolean {
  return false;
}

export const usernameAtom = atom<string>("");
