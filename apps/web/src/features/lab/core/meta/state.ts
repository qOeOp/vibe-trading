/* Copyright 2026 Marimo. All rights reserved. */

import { atom } from 'jotai';
import { Logger } from '@/features/lab/utils/Logger';

function getVersionFromMountConfig(): string | null {
  try {
    const mountConfig = window.__MARIMO_MOUNT_CONFIG__ as
      | { version: string }
      | undefined;
    return mountConfig?.version ?? null;
  } catch {
    return null;
  }
}

const BUILD_VERSION: string = getVersionFromMountConfig() || 'unknown';

export const marimoVersionAtom = atom<string>(BUILD_VERSION);

export const showCodeInRunModeAtom = atom<boolean>(true);

export const serverTokenAtom = atom<string | null>(null);
