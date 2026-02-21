/**
 * Stub: codemirror/rtc/extension — RTC CodeMirror extensions not used in VT.
 */

import { atom } from 'jotai';
import type { Extension } from '@codemirror/state';

export const connectedDocAtom = atom<unknown>(null);

export function realTimeCollaboration(
  _cellId?: unknown,
  _onUpdate?: (code: string) => void,
  code?: string,
): { extension: Extension; code: string } {
  return { extension: [], code: code ?? '' };
}
