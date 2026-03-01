'use client';

import { useAtomValue } from 'jotai';
import { CodeIcon, FileIcon, FileOutputIcon, FileTextIcon } from 'lucide-react';
import type { LucideIcon } from 'lucide-react';
import { useCallback } from 'react';
import { filenameAtom } from '@/features/lab/core/saving/file-state';
import { store } from '@/features/lab/core/state/jotai';
import { useRequestClient } from '@/features/lab/core/network/requests';
import { useLabModeStore } from '@/features/lab/store/use-lab-mode-store';
import { downloadBlob } from '@/features/lab/utils/download';
import { Filenames } from '@/features/lab/utils/filenames';
import { Paths } from '@/features/lab/utils/paths';
import { toast } from '@/features/lab/components/ui/use-toast';

// ─── Export Actions ──────────────────────────────────────
//
// Provides notebook export actions for the Activity Bar dropdown.
// Each action calls the backend export API and triggers a browser download.

type ExportAction = {
  label: string;
  icon: LucideIcon;
  handle: () => void;
  disabled: boolean;
};

function getNotebookBasename(): string {
  const filename = store.get(filenameAtom);
  if (!filename) return 'notebook';
  return Paths.basename(filename);
}

function useExportActions(): ExportAction[] {
  const isConnected = useLabModeStore((s) => s.mode) === 'active';
  const { exportAsHTML, exportAsMarkdown, exportAsPDF, exportAsScript } =
    useRequestClient();

  const handleExportScript = useCallback(async () => {
    try {
      const content = await exportAsScript({ download: false });
      const blob = new Blob([content], { type: 'text/x-python' });
      downloadBlob(blob, Filenames.toPY(getNotebookBasename()));
    } catch {
      toast({
        title: 'Export failed',
        description: 'Failed to export as Python script.',
        variant: 'danger',
      });
    }
  }, [exportAsScript]);

  const handleExportHTML = useCallback(async () => {
    try {
      const content = await exportAsHTML({
        download: false,
        includeCode: true,
        files: [],
      });
      const blob = new Blob([content], { type: 'text/html' });
      downloadBlob(blob, Filenames.toHTML(getNotebookBasename()));
    } catch {
      toast({
        title: 'Export failed',
        description: 'Failed to export as HTML.',
        variant: 'danger',
      });
    }
  }, [exportAsHTML]);

  const handleExportMarkdown = useCallback(async () => {
    try {
      const content = await exportAsMarkdown({ download: false });
      const blob = new Blob([content], { type: 'text/markdown' });
      downloadBlob(blob, Filenames.toMarkdown(getNotebookBasename()));
    } catch {
      toast({
        title: 'Export failed',
        description: 'Failed to export as Markdown.',
        variant: 'danger',
      });
    }
  }, [exportAsMarkdown]);

  const handleExportPDF = useCallback(async () => {
    try {
      const blob = await exportAsPDF({ webpdf: true });
      downloadBlob(blob, Filenames.toPDF(getNotebookBasename()));
    } catch {
      toast({
        title: 'Export failed',
        description: 'Failed to export as PDF.',
        variant: 'danger',
      });
    }
  }, [exportAsPDF]);

  return [
    {
      label: 'Python script (.py)',
      icon: CodeIcon,
      handle: handleExportScript,
      disabled: !isConnected,
    },
    {
      label: 'HTML (.html)',
      icon: FileTextIcon,
      handle: handleExportHTML,
      disabled: !isConnected,
    },
    {
      label: 'Markdown (.md)',
      icon: FileIcon,
      handle: handleExportMarkdown,
      disabled: !isConnected,
    },
    {
      label: 'PDF (.pdf)',
      icon: FileOutputIcon,
      handle: handleExportPDF,
      disabled: !isConnected,
    },
  ];
}

export { useExportActions };
export type { ExportAction };
