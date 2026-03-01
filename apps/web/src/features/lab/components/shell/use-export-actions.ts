'use client';

import { CodeIcon, FileIcon, FileOutputIcon, FileTextIcon } from 'lucide-react';
import type { LucideIcon } from 'lucide-react';
import { filenameAtom } from '@/features/lab/core/saving/file-state';
import { store } from '@/features/lab/core/state/jotai';
import { getRequestClient } from '@/features/lab/core/network/requests';
import { useLabModeStore } from '@/features/lab/store/use-lab-mode-store';
import { downloadBlob } from '@/features/lab/utils/download';
import { Filenames } from '@/features/lab/utils/filenames';
import { Paths } from '@/features/lab/utils/paths';
import { toast } from '@/features/lab/components/ui/use-toast';

// ─── Export Actions ──────────────────────────────────────
//
// Provides notebook export actions for the Activity Bar dropdown.
// Uses getRequestClient() (imperative) instead of useRequestClient() (hook)
// because ActivityBar renders outside the jotai Provider scope.

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

  const handleExportScript = async () => {
    try {
      const client = getRequestClient();
      const content = await client.exportAsScript({ download: false });
      const blob = new Blob([content], { type: 'text/x-python' });
      downloadBlob(blob, Filenames.toPY(getNotebookBasename()));
    } catch {
      toast({
        title: 'Export failed',
        description: 'Failed to export as Python script.',
        variant: 'danger',
      });
    }
  };

  const handleExportHTML = async () => {
    try {
      const client = getRequestClient();
      const content = await client.exportAsHTML({
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
  };

  const handleExportMarkdown = async () => {
    try {
      const client = getRequestClient();
      const content = await client.exportAsMarkdown({ download: false });
      const blob = new Blob([content], { type: 'text/markdown' });
      downloadBlob(blob, Filenames.toMarkdown(getNotebookBasename()));
    } catch {
      toast({
        title: 'Export failed',
        description: 'Failed to export as Markdown.',
        variant: 'danger',
      });
    }
  };

  const handleExportPDF = async () => {
    try {
      const client = getRequestClient();
      const blob = await client.exportAsPDF({ webpdf: true });
      downloadBlob(blob, Filenames.toPDF(getNotebookBasename()));
    } catch {
      toast({
        title: 'Export failed',
        description: 'Failed to export as PDF.',
        variant: 'danger',
      });
    }
  };

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
