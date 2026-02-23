'use client';

import useResizeObserver from 'use-resize-observer';
import { TreeDndProvider } from '../editor/file-tree/dnd-wrapper';
import { FileExplorer } from '../editor/file-tree/file-explorer';
import { useFileExplorerUpload } from '../editor/file-tree/upload';

/**
 * Inner content for connected file tree — requires marimo kernel context.
 * Lazy-loaded so that its dependencies (useRequestClient, treeAtom, etc.)
 * are not evaluated until the kernel is connected.
 */
function ConnectedFileTreeInner() {
  const { ref, height = 400 } = useResizeObserver<HTMLDivElement>();
  const { getRootProps, getInputProps, isDragActive } = useFileExplorerUpload({
    noClick: true,
    noKeyboard: true,
  });

  return (
    <TreeDndProvider>
      <div
        {...getRootProps()}
        className="relative flex-1 flex flex-col overflow-hidden"
      >
        <input {...getInputProps()} />
        {isDragActive && (
          <div className="absolute inset-0 flex items-center uppercase justify-center text-sm font-bold text-mine-accent-teal bg-mine-accent-teal/10 z-10 border-2 border-dashed border-mine-accent-teal/50 rounded-lg pointer-events-none">
            Drop files here
          </div>
        )}
        <div ref={ref} className="flex-1 flex flex-col overflow-hidden">
          <FileExplorer height={height} />
        </div>
      </div>
    </TreeDndProvider>
  );
}

export default ConnectedFileTreeInner;
