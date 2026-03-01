'use client';

import { useCallback, useEffect, useRef, useState } from 'react';
import { CellId } from '@/features/lab/core/cells/ids';
import { useCellActions } from '@/features/lab/core/cells/cells';
import { getRequestClient } from '@/features/lab/core/network/requests';

const MARIMO_KERNEL_BASE = 'http://localhost:2728';

interface SnippetData {
  code: string;
  defs: string[];
  refs: string[];
  name: string;
  path: string;
}

function useSnippetPreview(snippetPath: string | null) {
  const [snippetData, setSnippetData] = useState<SnippetData | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [tempCellId, setTempCellId] = useState<CellId | null>(null);
  const insertedRef = useRef(false);
  const cellActions = useCellActions();

  // ── 1) Fetch snippet data ──
  useEffect(() => {
    if (!snippetPath) {
      setSnippetData(null);
      return;
    }

    let cancelled = false;
    setIsLoading(true);
    setError(null);

    fetch(`${MARIMO_KERNEL_BASE}/api/snippets/${snippetPath}`)
      .then((res) => {
        if (!res.ok) throw new Error('Not found');
        return res.json() as Promise<SnippetData>;
      })
      .then((data) => {
        if (!cancelled) {
          setSnippetData(data);
          setIsLoading(false);
        }
      })
      .catch((err: Error) => {
        if (!cancelled) {
          setError(err.message);
          setIsLoading(false);
        }
      });

    return () => {
      cancelled = true;
    };
  }, [snippetPath]);

  // ── 2) Create temp cell + execute when snippet data arrives ──
  useEffect(() => {
    if (!snippetData) return;

    insertedRef.current = false;
    const newCellId = CellId.create();

    cellActions.createNewCell({
      cellId: '__end__',
      before: false,
      code: snippetData.code,
      newCellId,
      autoFocus: false,
      hideCode: true,
    });

    setTempCellId(newCellId);

    // Execute the cell
    try {
      const client = getRequestClient();
      cellActions.prepareForRun({ cellId: newCellId });
      void client.sendRun({
        cellIds: [newCellId],
        codes: [snippetData.code],
      });
    } catch {
      // Kernel not available — cell stays unexecuted
    }

    // Cleanup: delete temp cell when this effect re-runs or component unmounts
    return () => {
      if (!insertedRef.current) {
        cellActions.deleteCell({ cellId: newCellId });
      }
    };
  }, [snippetData, cellActions]);

  // ── 3) Insert = keep cell permanently ──
  const insertToNotebook = useCallback(() => {
    if (!tempCellId) return;
    insertedRef.current = true;
    // Unhide the cell so it's visible in the notebook
    cellActions.updateCellConfig({
      cellId: tempCellId,
      config: { hide_code: false },
    });
    setTempCellId(null);
  }, [tempCellId, cellActions]);

  return { snippetData, isLoading, error, tempCellId, insertToNotebook };
}

export { useSnippetPreview };
export type { SnippetData };
