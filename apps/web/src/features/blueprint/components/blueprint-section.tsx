"use client";

import { Suspense } from "react";
import { ArrowLeftRight, ArrowRight, Info } from "lucide-react";

import { MineCard } from "./mine-card";
import { Markdown } from "./markdown";
import { PlaceholderVisual } from "./placeholder-visual";
import { resolveIcon } from "../lib/icon-map";
import { COMPONENT_REGISTRY } from "../lib/component-registry";
import type { BlueprintDoc, CardMeta, CardContent } from "../lib/parse-blueprint-doc";

/* ================================================================ */
/*  Badge                                                           */
/* ================================================================ */

const BADGE_COLORS: Record<string, string> = {
  teal: "bg-mine-accent-teal/10 text-mine-accent-teal",
  green: "bg-[#4caf50]/10 text-[#4caf50]",
  blue: "bg-[#3b82f6]/10 text-[#3b82f6]",
  purple: "bg-[#8b5cf6]/10 text-[#8b5cf6]",
  yellow: "bg-[#f5a623]/10 text-[#f5a623]",
  red: "bg-[#e74c3c]/10 text-[#e74c3c]",
  gray: "bg-mine-muted/10 text-mine-muted",
};

function Badge({ badge }: { badge: CardMeta["badge"] }) {
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
  cardContent: CardContent;
}) {
  const renderMode = cardMeta.render ?? "markdown";

  switch (renderMode) {
    case "placeholder":
      return (
        <PlaceholderVisual
          type={cardMeta.placeholderType}
          label={cardMeta.placeholderLabel}
        />
      );

    case "component": {
      const Component = COMPONENT_REGISTRY[cardMeta.component ?? ""];
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

    case "markdown":
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
  cardContent: CardContent,
  links?: BlueprintDoc["meta"]["links"],
) {
  const renderMode = cardMeta.render ?? "markdown";
  const hasExpand = Boolean(cardContent.expand);
  const hasLinks = links && links.length > 0;

  // For markdown mode, expand shows the expand section
  // For placeholder/component modes, expand shows the full markdown as documentation
  const expandMarkdown =
    renderMode === "markdown"
      ? cardContent.expand
      : cardContent.body + (cardContent.expand ? "\n\n" + cardContent.expand : "");

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
                <span className="px-1.5 py-0.5 rounded bg-[#8b5cf6]/10 text-[#8b5cf6] font-medium shrink-0">
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
 * Renders: page title → rows of MineCards → footer.
 * Each card supports three render modes (markdown/placeholder/component).
 */
export function BlueprintSection({ doc }: BlueprintSectionProps) {
  const { meta, cards } = doc;
  const PageIcon = resolveIcon(meta.icon);

  // Group cards by row number
  const rowGroups = new Map<number, { cardMeta: CardMeta; cardContent: CardContent }[]>();
  for (const cardMeta of meta.cards) {
    const row = cardMeta.row ?? 1;
    if (!rowGroups.has(row)) rowGroups.set(row, []);
    const content = cards.find((c) => c.id === cardMeta.id) ?? {
      id: cardMeta.id,
      body: "",
      expand: "",
    };
    rowGroups.get(row)!.push({ cardMeta, cardContent: content });
  }

  // Sort rows by number
  const sortedRows = [...rowGroups.entries()].sort(([a], [b]) => a - b);

  // Determine which cards get the cross-module links in their expand modal
  // Convention: links go into the LAST card's expand content
  const lastCardId = meta.cards[meta.cards.length - 1]?.id;

  return (
    <div className="p-4 space-y-3">
      {/* Page title */}
      <div className="flex items-center gap-2 px-1 mb-1">
        <PageIcon className="w-4 h-4 text-mine-accent-teal" />
        <h2 className="font-semibold text-[15px] text-mine-text">
          {meta.title}
        </h2>
        <span className="text-[11px] text-mine-muted">{meta.subtitle}</span>
      </div>

      {/* Card rows */}
      {sortedRows.map(([rowNum, rowCards], rowIdx) => {
        const rowStyle = meta.rows?.[rowIdx];
        const height = rowStyle?.height ?? "520px";

        return (
          <div
            key={rowNum}
            className="flex gap-3 items-stretch"
            style={{ height }}
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
                  <MineCard
                    title={cardMeta.title}
                    subtitle={cardMeta.subtitle}
                    expandable={
                      Boolean(cardContent.expand) ||
                      Boolean(linksForCard?.length) ||
                      cardMeta.render === "placeholder" ||
                      cardMeta.render === "component"
                    }
                    expandTitle={cardMeta.expandTitle}
                    expandSubtitle={cardMeta.expandSubtitle}
                    expandContent={buildExpandContent(
                      cardMeta,
                      cardContent,
                      linksForCard,
                    )}
                    className="h-full"
                    actions={<Badge badge={cardMeta.badge} />}
                  >
                    <CardBody
                      cardMeta={cardMeta}
                      cardContent={cardContent}
                    />
                  </MineCard>
                </div>
              );
            })}
          </div>
        );
      })}

      {/* Footer */}
      {meta.footer && (
        <div className="flex items-center gap-2 px-1 text-[10px] text-mine-muted">
          <Info className="w-3 h-3 shrink-0" />
          <span>{meta.footer}</span>
        </div>
      )}
    </div>
  );
}
