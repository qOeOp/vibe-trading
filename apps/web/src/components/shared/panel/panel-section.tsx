'use client';

import * as React from 'react';
import { ChevronRight } from 'lucide-react';
import { AnimatePresence, motion } from 'motion/react';

import { cn } from '@/lib/utils';
import { PANEL_TYPOGRAPHY } from './panel-typography';

type PanelSectionProps = React.ComponentProps<'div'> & {
  title?: string;
  suffix?: React.ReactNode;
  titleRight?: React.ReactNode;
  badge?: React.ReactNode;
  collapsible?: boolean;
  defaultOpen?: boolean;
  noBorder?: boolean;
  children?: React.ReactNode;
};

function PanelSection({
  title,
  suffix,
  titleRight,
  badge,
  collapsible = false,
  defaultOpen = true,
  noBorder = false,
  className,
  children,
  ...props
}: PanelSectionProps) {
  const [open, setOpen] = React.useState(defaultOpen);

  const isOpen = collapsible ? open : true;

  return (
    <div
      data-slot="panel-section"
      className={cn(
        'px-4 py-3',
        !noBorder && 'border-b border-mine-border/50 last:border-b-0',
        className,
      )}
      {...props}
    >
      {title && (
        <div className="flex items-center justify-between mb-2">
          <div className="flex items-center gap-1.5">
            {collapsible && (
              <button
                type="button"
                onClick={() => setOpen((v) => !v)}
                className="p-0.5 -ml-1 text-mine-muted transition-transform"
                aria-label={isOpen ? 'Collapse section' : 'Expand section'}
              >
                <motion.div
                  animate={{ rotate: isOpen ? 90 : 0 }}
                  transition={{ duration: 0.15 }}
                >
                  <ChevronRight className="w-3 h-3" />
                </motion.div>
              </button>
            )}
            <span className={PANEL_TYPOGRAPHY.label}>{title}</span>
            {badge && (
              <span className={PANEL_TYPOGRAPHY.sm.value}>{badge}</span>
            )}
          </div>

          <div className="flex items-center gap-2">
            {suffix && <span className={PANEL_TYPOGRAPHY.hint}>{suffix}</span>}
            {titleRight}
          </div>
        </div>
      )}

      {collapsible ? (
        <AnimatePresence initial={false}>
          {isOpen && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: 'auto', opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ duration: 0.2, ease: [0.25, 0.1, 0.25, 1] }}
              style={{ overflow: 'hidden' }}
            >
              {children}
            </motion.div>
          )}
        </AnimatePresence>
      ) : (
        children
      )}
    </div>
  );
}

export { PanelSection };
export type { PanelSectionProps };
