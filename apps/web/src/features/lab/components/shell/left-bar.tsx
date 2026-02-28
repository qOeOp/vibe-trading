'use client';

import { cn } from '@/lib/utils';
import { useLabModeStore } from '@/features/lab/store/use-lab-mode-store';
import { getPanelsBySlot } from './panels';
import { PanelButton } from './panel-button';

// ─── Left Bar ────────────────────────────────────────────
//
// Thin icon bar on the left edge of the IDE frame.
// Top: left-slot panels (files). Bottom: bottom-slot panels (terminal).
// All buttons rendered via shared PanelButton.

function LeftBar({ className }: { className?: string }) {
  const leftPanel = useLabModeStore((s) => s.leftPanel);
  const bottomPanel = useLabModeStore((s) => s.bottomPanel);
  const isConnected = useLabModeStore((s) => s.mode) === 'active';
  const togglePanel = useLabModeStore((s) => s.togglePanel);

  const leftPanels = getPanelsBySlot('left');
  const bottomPanels = getPanelsBySlot('bottom');

  return (
    <div
      data-slot="left-bar"
      className={cn(
        'shrink-0 flex flex-col items-center pt-0 pb-0 gap-2',
        className,
      )}
    >
      {/* Top: left-slot panels */}
      {leftPanels.map((item) => (
        <PanelButton
          key={item.id}
          icon={item.icon}
          label={item.label}
          isActive={leftPanel === item.id}
          onClick={() => togglePanel(item.id)}
        />
      ))}

      <div className="flex-1" />

      {/* Bottom: bottom-slot panels */}
      {bottomPanels.map((item) => (
        <PanelButton
          key={item.id}
          icon={item.icon}
          label={item.label}
          isActive={bottomPanel === item.id}
          round
          disabled={item.connectedOnly && !isConnected}
          onClick={() => togglePanel(item.id)}
        />
      ))}
    </div>
  );
}

export { LeftBar };
