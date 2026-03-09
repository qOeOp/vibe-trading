'use client';

import { Suspense } from 'react';
import { ArrowLeftRight, ArrowRight, Info } from 'lucide-react';

import { Card, CardHeader, CardContent } from '@/components/ui/card';
import { Markdown } from './markdown';
import { PlaceholderVisual } from './placeholder-visual';
import { resolveIcon } from '../lib/icon-map';
import { COMPONENT_REGISTRY } from '../lib/component-registry';
import type {
  BlueprintDoc,
  CardMeta,
  CardContent as CardContentData,
} from '../lib/parse-blueprint-doc';

/* ================================================================ */
/*  Badge                                                           */
/* ================================================================ */

const BADGE_COLORS: Record<string, string> = {
  teal: 'bg-mine-accent-teal/10 text-mine-accent-teal',
  green: 'bg-mine-accent-green/10 text-mine-accent-green',
  blue: 'bg-blue-500/10 text-blue-500',
  purple: 'bg-violet-500/10 text-violet-500',
  yellow: 'bg-mine-accent-yellow/10 text-mine-accent-yellow',
  red: 'bg-mine-accent-red/10 text-mine-accent-red',
  gray: 'bg-mine-muted/10 text-mine-muted',
};

function Badge({ badge }: { badge: CardMeta['badge'] }) {
  if (!badge) return null;
  const Icon = resolveIcon(badge.icon);
  const color = BADGE_COLORS[badge.color] ?? BADGE_COLORS.gray;

  return (
    <span
      className={`flex items-center gap-1 px-1.5 py-0.5 rounded text-[9px] font-medium ${color}`}
    >
      <Icon className="w-3 h-3" />
      {badge.label}
    </span>
  );
}

/* ================================================================ */
/*  Card Renderer (3 modes: markdown / placeholder / component)     */
/* ================================================================ */

function CardBody({
  cardMeta,
  cardContent,
}: {
  cardMeta: CardMeta;
  cardContent: CardContentData;
}) {
  const renderMode = cardMeta.render ?? 'markdown';

  switch (renderMode) {
    case 'placeholder':
      return (
        <PlaceholderVisual
          type={cardMeta.placeholderType}
          label={cardMeta.placeholderLabel}
        />
      );

    case 'component': {
      const Component = COMPONENT_REGISTRY[cardMeta.component ?? ''];
      if (!Component) {
        return (
          <PlaceholderVisual
            type="generic"
            label={`Missing: ${cardMeta.component}`}
          />
        );
      }
      return (
        <Suspense
          fallback={
            <div className="h-full flex items-center justify-center text-xs text-mine-muted">
              Loading...
            </div>
          }
        >
          <Component />
        </Suspense>
      );
    }

    case 'markdown':
    default:
      return (
        <div className="px-3 pb-3">
          <Markdown content={cardContent.body} />
        </div>
      );
  }
}

function buildExpandContent(
  cardMeta: CardMeta,
  cardContent: CardContentData,
  links?: BlueprintDoc['meta']['links'],
) {
  const renderMode = cardMeta.render ?? 'markdown';
  const hasExpand = Boolean(cardContent.expand);
  const hasLinks = links && links.length > 0;

  // For markdown mode, expand shows the expand section
  // For placeholder/component modes, expand shows the full markdown as documentation
  const expandMarkdown =
    renderMode === 'markdown'
      ? cardContent.expand
      : cardContent.body +
        (cardContent.expand ? '\n\n' + cardContent.expand : '');

  if (!expandMarkdown && !hasLinks) return undefined;

  return (
    <div className="space-y-4">
      {expandMarkdown && <Markdown content={expandMarkdown} />}
      {hasLinks && (
        <div className="border-t border-mine-border/30 pt-4">
          <div className="flex items-center gap-1.5 mb-3">
            <ArrowLeftRight className="w-3.5 h-3.5 text-mine-accent-teal" />
            <span className="font-semibold text-[13px] text-mine-text">
              跨模块联动 ({links!.length} 条)
            </span>
          </div>
          <div className="space-y-2">
            {links!.map((link) => (
              <div
                key={link.from}
                className="flex items-center gap-2 text-[11px]"
              >
                <span className="px-1.5 py-0.5 rounded bg-mine-accent-teal/10 text-mine-accent-teal font-medium shrink-0">
                  {link.from}
                </span>
                <ArrowRight className="w-2.5 h-2.5 text-mine-muted shrink-0" />
                <span className="px-1.5 py-0.5 rounded bg-violet-500/10 text-violet-500 font-medium shrink-0">
                  {link.to}
                </span>
                <span className="text-mine-muted truncate">{link.desc}</span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

/* ================================================================ */
/*  Main Section Component                                          */
/* ================================================================ */

interface BlueprintSectionProps {
  doc: BlueprintDoc;
}

/**
 * Generic renderer for a BlueprintDoc parsed from a .md file.
 *
 * Renders: page title → rows of Cards → footer.
 * Each card supports three render modes (markdown/placeholder/component).
 */
export function BlueprintSection({ doc }: BlueprintSectionProps) {
  const { meta, cards } = doc;
  const PageIcon = resolveIcon(meta.icon);

  // Group cards by row number
  const rowGroups = new Map<
    number,
    { cardMeta: CardMeta; cardContent: CardContentData }[]
  >();
  for (const cardMeta of meta.cards) {
    const row = cardMeta.row ?? 1;
    if (!rowGroups.has(row)) rowGroups.set(row, []);
    const content = cards.find((c) => c.id === cardMeta.id) ?? {
      id: cardMeta.id,
      body: '',
      expand: '',
    };
    rowGroups.get(row)!.push({ cardMeta, cardContent: content });
  }

  // Sort rows by number
  const sortedRows = [...rowGroups.entries()].sort(([a], [b]) => a - b);

  // Determine which cards get the cross-module links in their expand modal
  // Convention: links go into the LAST card's expand content
  const lastCardId = meta.cards[meta.cards.length - 1]?.id;

  return (
    <div className="h-full flex flex-col p-4">
      {/* Page title */}
      <div className="flex items-center gap-2 px-1 mb-3 shrink-0">
        <PageIcon className="w-4 h-4 text-mine-accent-teal" />
        <h2 className="font-semibold text-[15px] text-mine-text">
          {meta.title}
        </h2>
        <span className="text-[11px] text-mine-muted">{meta.subtitle}</span>
      </div>

      {/* Card rows container */}
      <div className="flex-1 flex flex-col gap-3 min-h-0">
        {sortedRows.map(([rowNum, rowCards], rowIdx) => {
          const rowStyle = meta.rows?.[rowIdx];
          const heightConfig = rowStyle?.height ?? '520px';
          const isFullHeight = heightConfig === 'h-full';

          return (
            <div
              key={rowNum}
              className={`flex gap-3 items-stretch min-h-0 ${isFullHeight ? 'flex-1' : ''}`}
              style={isFullHeight ? undefined : { height: heightConfig }}
            >
              {rowCards.map(({ cardMeta, cardContent }) => {
                const isLastCard = cardMeta.id === lastCardId;
                const linksForCard = isLastCard ? meta.links : undefined;

                return (
                  <div
                    key={cardMeta.id}
                    className="min-w-0"
                    style={{ flex: cardMeta.flex ?? 1 }}
                  >
                    <Card
                      expandable={
                        Boolean(cardContent.expand) ||
                        Boolean(linksForCard?.length) ||
                        cardMeta.render === 'placeholder' ||
                        cardMeta.render === 'component'
                      }
                      expandTitle={cardMeta.expandTitle}
                      expandSubtitle={cardMeta.expandSubtitle}
                      expandContent={buildExpandContent(
                        cardMeta,
                        cardContent,
                        linksForCard,
                      )}
                      className="h-full"
                    >
                      <CardHeader
                        title={cardMeta.title}
                        subtitle={cardMeta.subtitle}
                        actions={<Badge badge={cardMeta.badge} />}
                      />
                      <CardContent>
                        <CardBody
                          cardMeta={cardMeta}
                          cardContent={cardContent}
                        />
                      </CardContent>
                    </Card>
                  </div>
                );
              })}
            </div>
          );
        })}
      </div>

      {/* Footer */}
      {meta.footer && (
        <div className="flex items-center gap-2 px-1 pt-3 text-[10px] text-mine-muted shrink-0">
          <Info className="w-3 h-3 shrink-0" />
          <span>{meta.footer}</span>
        </div>
      )}
    </div>
  );
}
