'use client';

import { EditorView } from '@codemirror/view';
import { Suspense, useCallback, useEffect, useRef, useState } from 'react';
import { useRequestClient } from '../../core/network/requests';
import { useAsyncData } from '../../hooks/useAsyncData';
import { LazyAnyLanguageCodeMirror } from '../../plugins/impl/code/LazyAnyLanguageCodeMirror';
import { useLabFileTabStore } from '../../store/use-lab-file-tab-store';

// ─── File Editor ─────────────────────────────────────────
//
// Single-file CodeMirror editor with auto-save.
// Used for non-notebook files opened via the file tree.

const AUTO_SAVE_DELAY = 1500;

const EXT_TO_LANGUAGE: Record<string, string> = {
  py: 'python',
  js: 'javascript',
  ts: 'javascript',
  jsx: 'javascript',
  tsx: 'javascript',
  json: 'json',
  md: 'markdown',
  html: 'html',
  css: 'css',
  yaml: 'yaml',
  yml: 'yaml',
  toml: 'markdown',
  csv: 'markdown',
  txt: 'markdown',
  sql: 'sql',
};

function getLanguage(path: string): string {
  const ext = path.split('.').pop()?.toLowerCase() ?? '';
  return EXT_TO_LANGUAGE[ext] ?? 'markdown';
}

type FileEditorProps = {
  path: string;
};

function FileEditor({ path }: FileEditorProps) {
  const { sendFileDetails, sendUpdateFile } = useRequestClient();
  const setDirty = useLabFileTabStore((s) => s.setDirty);

  const [value, setValue] = useState('');
  const savedRef = useRef('');
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const { data, error, isPending } = useAsyncData(async () => {
    const details = await sendFileDetails({ path });
    const contents = details.contents ?? '';
    setValue(contents);
    savedRef.current = contents;
    setDirty(path, false);
    return details;
  }, [path]);

  // Auto-save with debounce
  const doSave = useCallback(
    async (contents: string) => {
      const res = await sendUpdateFile({ path, contents });
      if (res.success) {
        savedRef.current = contents;
        setDirty(path, false);
      }
    },
    [path, sendUpdateFile, setDirty],
  );

  const handleChange = useCallback(
    (newValue: string) => {
      setValue(newValue);
      const isDirty = newValue !== savedRef.current;
      setDirty(path, isDirty);

      if (timerRef.current) clearTimeout(timerRef.current);
      if (isDirty) {
        timerRef.current = setTimeout(() => doSave(newValue), AUTO_SAVE_DELAY);
      }
    },
    [path, setDirty, doSave],
  );

  // Flush pending save on unmount or path change
  useEffect(() => {
    return () => {
      if (timerRef.current) {
        clearTimeout(timerRef.current);
        timerRef.current = null;
      }
    };
  }, [path]);

  if (error) {
    return (
      <div
        data-slot="file-editor-error"
        className="flex-1 flex items-center justify-center text-sm text-mine-muted"
      >
        Failed to load file: {String(error)}
      </div>
    );
  }

  if (isPending || !data) {
    return (
      <div
        data-slot="file-editor-loading"
        className="flex-1 flex items-center justify-center"
      >
        <div className="w-4 h-4 rounded-full border-2 border-mine-border border-t-mine-muted animate-spin" />
      </div>
    );
  }

  return (
    <div data-slot="file-editor" className="flex-1 min-h-0 overflow-auto">
      <Suspense
        fallback={
          <div className="flex-1 flex items-center justify-center p-4">
            <div className="w-4 h-4 rounded-full border-2 border-mine-border border-t-mine-muted animate-spin" />
          </div>
        }
      >
        <LazyAnyLanguageCodeMirror
          theme="light"
          language={getLanguage(path)}
          className="h-full"
          extensions={[EditorView.lineWrapping]}
          value={value}
          onChange={handleChange}
        />
      </Suspense>
    </div>
  );
}

export { FileEditor };
