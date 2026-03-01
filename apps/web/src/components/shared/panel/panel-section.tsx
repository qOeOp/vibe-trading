'use client';

import * as React from 'react';
import { ChevronRight } from 'lucide-react';
import { AnimatePresence, motion } from 'motion/react';

import { cn } from '@/lib/utils';

type PanelSectionProps = {
  title?: string;
  suffix?: React.ReactNode;
  titleRight?: React.ReactNode;
  badge?: React.ReactNode;
  collapsible?: boolean;
  defaultOpen?: boolean;
  noBorder?: boolean;
  className?: string;
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
            <span className="font-medium text-mine-muted uppercase tracking-wider text-[10px]">
              {title}
            </span>
            {badge}
          </div>

          <div className="flex items-center gap-2">
            {suffix && (
              <span className="text-[10px] text-mine-muted">{suffix}</span>
            )}
            {titleRight}
          </div>
        </div>
      )}

      <AnimatePresence initial={false}>
        {isOpen && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.2, ease: 'easeOut' }}
            style={{ overflow: 'hidden' }}
          >
            {children}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

export { PanelSection };
export type { PanelSectionProps };
