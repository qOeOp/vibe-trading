'use client';

import { useEffect, useState } from 'react';

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

  return { snippetData, isLoading, error };
}

export { useSnippetPreview };
export type { SnippetData };
