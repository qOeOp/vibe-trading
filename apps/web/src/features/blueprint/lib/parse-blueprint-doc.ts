import matter from "gray-matter";

/* ================================================================ */
/*  Types                                                           */
/* ================================================================ */

export interface BlueprintMeta {
  title: string;
  subtitle: string;
  icon: string;
  layout: "two-column" | "rows" | "custom";
  cards: CardMeta[];
  rows?: { height: string }[];
  links?: { from: string; to: string; desc: string }[];
  footer?: string;
}

export interface CardMeta {
  id: string;
  title: string;
  subtitle?: string;
  flex?: number;
  row?: number;
  render?: "markdown" | "placeholder" | "component";
  placeholderType?: string;
  placeholderLabel?: string;
  component?: string;
  badge?: { icon: string; label: string; color: string };
  expandTitle?: string;
  expandSubtitle?: string;
}

export interface CardContent {
  id: string;
  /** Content from `<!-- card: ID -->` section */
  body: string;
  /** Content from `<!-- card: ID:expand -->` section (may be empty) */
  expand: string;
}

export interface BlueprintDoc {
  meta: BlueprintMeta;
  cards: CardContent[];
}

/* ================================================================ */
/*  Parser                                                          */
/* ================================================================ */

/**
 * Parses a raw markdown string with YAML frontmatter and
 * `<!-- card: ID -->` / `<!-- card: ID:expand -->` delimiters
 * into a structured BlueprintDoc.
 */
export function parseBlueprintDoc(raw: string): BlueprintDoc {
  const { data, content } = matter(raw);
  const meta = data as BlueprintMeta;

  // Collect all card delimiter positions
  const delimiterRegex = /<!--\s*card:\s*([^: ]+)(?::expand)?\s*-->/g;
  const segments: { id: string; isExpand: boolean; start: number; end: number }[] = [];

  let match;
  while ((match = delimiterRegex.exec(content)) !== null) {
    const id = match[1];
    const isExpand = match[0].includes(":expand");
    // Content starts right after the delimiter
    const contentStart = match.index + match[0].length;
    segments.push({ id, isExpand, start: contentStart, end: content.length });
  }

  // Set each segment's end to the start of the next delimiter
  for (let i = 0; i < segments.length - 1; i++) {
    // Find the position of the next delimiter comment opening
    const nextDelimiterStart = content.lastIndexOf(
      "<!--",
      segments[i + 1].start,
    );
    segments[i].end = nextDelimiterStart !== -1 ? nextDelimiterStart : segments[i + 1].start;
  }

  // Build card map: id → { body, expand }
  const cardMap = new Map<string, { body: string; expand: string }>();

  for (const seg of segments) {
    const text = content.slice(seg.start, seg.end).trim();

    if (!cardMap.has(seg.id)) {
      cardMap.set(seg.id, { body: "", expand: "" });
    }
    const entry = cardMap.get(seg.id)!;
    if (seg.isExpand) {
      entry.expand = text;
    } else {
      entry.body = text;
    }
  }

  // Convert to array preserving frontmatter card order
  const cards: CardContent[] = [];
  for (const cardMeta of meta.cards) {
    const entry = cardMap.get(cardMeta.id);
    cards.push({
      id: cardMeta.id,
      body: entry?.body ?? "",
      expand: entry?.expand ?? "",
    });
  }

  return { meta, cards };
}
