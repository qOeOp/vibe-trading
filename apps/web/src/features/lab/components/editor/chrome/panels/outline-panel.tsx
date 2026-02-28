/* Copyright 2026 Marimo. All rights reserved. */

import { useAtomValue } from 'jotai';
import { ScrollTextIcon } from 'lucide-react';
import React, { useMemo } from 'react';
import { notebookOutline } from '@/features/lab/core/cells/cells';
import { PanelEmptyState } from './empty-state';

import './outline-panel.css';
import { OutlineList } from './outline/floating-outline';
import {
  findOutlineElements,
  useActiveOutline,
} from './outline/useActiveOutline';
import {
  PanelBar,
  PanelBody,
  PanelEmpty,
  PanelText,
  usePanelV2,
} from '../../../panel-primitives';

// ─── V2 (primitives) ────────────────────────────────────

function OutlinePanelV2() {
  const { items } = useAtomValue(notebookOutline);
  const headerElements = useMemo(() => findOutlineElements(items), [items]);
  const { activeHeaderId, activeOccurrences } =
    useActiveOutline(headerElements);
  const [isV2, toggleV2] = usePanelV2('outline-panel');

  return (
    <div data-slot="outline-panel" className="h-full flex flex-col">
      <PanelBar
        title="大纲"
        icon={<ScrollTextIcon />}
        badge={
          items.length > 0 ? (
            <PanelText variant="tiny">({items.length})</PanelText>
          ) : undefined
        }
        v2={{ active: isV2, onToggle: toggleV2 }}
      />
      <PanelBody>
        {items.length === 0 ? (
          <PanelEmpty
            title="暂无大纲"
            description="在 notebook 中添加 markdown 标题以创建大纲"
            icon={<ScrollTextIcon />}
          />
        ) : (
          <OutlineList
            items={items}
            activeHeaderId={activeHeaderId}
            activeOccurrences={activeOccurrences}
          />
        )}
      </PanelBody>
    </div>
  );
}

// ─── V1 (original) ──────────────────────────────────────

function OutlinePanelV1() {
  const { items } = useAtomValue(notebookOutline);
  const headerElements = useMemo(() => findOutlineElements(items), [items]);
  const { activeHeaderId, activeOccurrences } =
    useActiveOutline(headerElements);
  const [, toggleV2] = usePanelV2('outline-panel');

  if (items.length === 0) {
    return (
      <div className="h-full flex flex-col">
        <div className="px-3 py-1.5 border-b border-mine-border/50 shrink-0 flex items-center justify-between">
          <span className="text-[10px] font-medium text-mine-muted uppercase tracking-wider">
            大纲
          </span>
          <button
            type="button"
            onClick={toggleV2}
            className="text-mine-muted/40 hover:text-mine-muted p-0.5 rounded transition-colors"
            title="Switch to v2"
          >
            <span className="text-[8px] font-mono">v2</span>
          </button>
        </div>
        <PanelEmptyState
          title="No outline found"
          description="Add markdown headings to your notebook to create an outline."
          icon={<ScrollTextIcon />}
        />
      </div>
    );
  }

  return (
    <div className="h-full flex flex-col">
      <div className="px-3 py-1.5 border-b border-mine-border/50 shrink-0 flex items-center justify-between">
        <span className="text-[10px] font-medium text-mine-muted uppercase tracking-wider">
          大纲
        </span>
        <button
          type="button"
          onClick={toggleV2}
          className="text-mine-muted/40 hover:text-mine-muted p-0.5 rounded transition-colors"
          title="Switch to v2"
        >
          <span className="text-[8px] font-mono">v2</span>
        </button>
      </div>
      <div className="flex-1 overflow-y-auto">
        <OutlineList
          items={items}
          activeHeaderId={activeHeaderId}
          activeOccurrences={activeOccurrences}
        />
      </div>
    </div>
  );
}

// ─── Switch ─────────────────────────────────────────────

const OutlinePanel: React.FC = () => {
  const [isV2] = usePanelV2('outline-panel');
  return isV2 ? <OutlinePanelV2 /> : <OutlinePanelV1 />;
};

export default OutlinePanel;
