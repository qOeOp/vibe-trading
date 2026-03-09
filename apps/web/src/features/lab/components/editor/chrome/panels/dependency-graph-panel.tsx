/* Copyright 2026 Marimo. All rights reserved. */

import type React from 'react';
import { useId } from 'react';
import { useAtom } from 'jotai';
import { SettingsIcon } from 'lucide-react';
import { Tabs, TabsList, TabsTrigger } from '@/features/lab/components/ui/tabs';
import { useCellDataAtoms, useCellIds } from '@/features/lab/core/cells/cells';
import { useVariables } from '@/features/lab/core/variables/state';
import { cn } from '@/features/lab/utils/cn';
import {
  DependencyGraph,
  graphViewSettings,
} from '@/features/lab/components/dependency-graph/dependency-graph';
import { MinimapContent } from '@/features/lab/components/dependency-graph/minimap-content';
import '@/features/lab/components/dependency-graph/dependency-graph.css';
import { Button } from '@/features/lab/components/ui/button';
import { Checkbox } from '@/features/lab/components/ui/checkbox';
import { Label } from '@/features/lab/components/ui/label';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/features/lab/components/ui/popover';
import { useDependencyPanelTab } from '../wrapper/useDependencyPanelTab';
import { usePanelSection } from './panel-context';

export const DependencyGraphPanel: React.FC = () => {
  const { dependencyPanelTab, setDependencyPanelTab } = useDependencyPanelTab();
  const variables = useVariables();
  const cellIds = useCellIds();
  const [cells] = useCellDataAtoms();
  const panelSection = usePanelSection();

  const showInlineToggle =
    panelSection === 'developer-panel' || panelSection === 'sidebar';

  return (
    <div
      className={cn(
        'marimo-dep-scope w-full h-full flex-1 mx-auto -mb-4 flex flex-col',
      )}
    >
      {showInlineToggle && (
        <div className="flex items-center px-2 py-1.5 shrink-0">
          <Tabs
            value={dependencyPanelTab}
            onValueChange={(value) => {
              if (value === 'minimap' || value === 'graph') {
                setDependencyPanelTab(value);
              }
            }}
          >
            <TabsList>
              <TabsTrigger
                value="minimap"
                className="py-0.5 text-xs uppercase tracking-wide font-bold"
              >
                Minimap
              </TabsTrigger>
              <TabsTrigger
                value="graph"
                className="py-0.5 text-xs uppercase tracking-wide font-bold"
              >
                Graph
              </TabsTrigger>
            </TabsList>
          </Tabs>
          <div className="flex-1" />
          {dependencyPanelTab === 'graph' && <GraphSettingsPopover />}
        </div>
      )}
      <div className="flex-1 min-h-0 relative">
        {dependencyPanelTab === 'minimap' ? (
          <MinimapContent />
        ) : (
          <DependencyGraph
            cellAtoms={cells}
            variables={variables}
            cellIds={cellIds.inOrderIds}
          />
        )}
      </div>
    </div>
  );
};

function GraphSettingsPopover() {
  const [settings, setSettings] = useAtom(graphViewSettings);
  const markdownId = useId();
  const functionsId = useId();

  const handleChange = <K extends keyof typeof settings>(
    key: K,
    value: (typeof settings)[K],
  ) => {
    setSettings({ ...settings, [key]: value });
  };

  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button variant="text" size="xs" className="text-mine-muted">
          <SettingsIcon className="w-3.5 h-3.5" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-auto p-3 text-mine-muted" align="end">
        <div className="flex flex-col gap-2.5">
          <div className="flex items-center gap-2">
            <Checkbox
              id={markdownId}
              checked={settings.hidePureMarkdown}
              onCheckedChange={(checked) =>
                handleChange('hidePureMarkdown', Boolean(checked))
              }
            />
            <Label htmlFor={markdownId} className="text-xs">
              Hide pure markdown
            </Label>
          </div>
          <div className="flex items-center gap-2">
            <Checkbox
              id={functionsId}
              checked={settings.hideReusableFunctions}
              onCheckedChange={(checked) =>
                handleChange('hideReusableFunctions', Boolean(checked))
              }
            />
            <Label htmlFor={functionsId} className="text-xs">
              Hide reusable functions
            </Label>
          </div>
        </div>
      </PopoverContent>
    </Popover>
  );
}
