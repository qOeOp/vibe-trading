// Re-export marimo file tree utilities for use by connected-file-tree.tsx
// Keeps the connected tree's imports clean.

export {
  FILE_TYPE_ICONS,
  guessFileType,
  type FileType,
} from '../editor/file-tree/types';

export {
  filterHiddenTree,
  isDirectoryOrFileHidden,
} from '../editor/file-tree/file-explorer';
