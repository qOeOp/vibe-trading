#!/usr/bin/env node
// Tailwind CSS → Pencil Property Converter
// Usage: node tailwind-to-pencil.mjs "flex items-center h-14 gap-4 pr-4"
// Output: JSON object with Pencil properties + notes

const input = process.argv[2];

if (input === '--help' || input === '-h') {
  console.log(`
Tailwind CSS → Pencil Property Converter

Usage:
  node tailwind-to-pencil.mjs "className string"
  node tailwind-to-pencil.mjs --help

Examples:
  node tailwind-to-pencil.mjs "flex items-center gap-4 p-6 rounded-xl bg-white shadow-sm border border-mine-border"
  node tailwind-to-pencil.mjs "text-sm font-medium text-mine-text"
  node tailwind-to-pencil.mjs "w-[52px] h-[240px] flex-col justify-between"

Output:
  JSON with "properties" (Pencil-compatible) and "notes" (warnings/unsupported).

Supported conversions:
  Spacing    p-{n}, px-{n}, py-{n}, pt/pr/pb/pl-{n}, gap-{n}, space-x/y-{n}
  Sizing     w-{n}, h-{n}, w-full, h-full, w-fit, h-fit, w-[Npx], h-[Npx]
  Layout     flex, flex-col, flex-row, items-*, justify-*, flex-wrap, overflow-hidden
  Radius     rounded-{none,sm,md,lg,xl,2xl,3xl,full}, rounded (bare)
  Colors     bg-white, bg-mine-*, text-mine-*, border-mine-*
  Typography text-{xs,sm,base,lg,xl,2xl}, font-{normal,medium,semibold,bold,mono}
             leading-{none,tight,normal}, tracking-tight, truncate
  Effects    shadow-{sm,md}, shadow (bare), border, border-{n}, opacity-{n}
  Margin     m-{n} (noted as unsupported in Pencil)
`);
  process.exit(0);
}

if (!input) {
  console.error('Usage: node tailwind-to-pencil.mjs "className string"');
  console.error('       node tailwind-to-pencil.mjs --help');
  process.exit(1);
}

// --- Spacing scale: Tailwind unit → px ---
function spacingToPx(value) {
  if (value === undefined || value === null) return undefined;
  const n = parseFloat(value);
  if (isNaN(n)) return undefined;
  return n * 4;
}

// --- Arbitrary value parser: `[52px]` → 52 ---
function parseArbitrary(raw) {
  const m = raw.match(/^\[(\d+(?:\.\d+)?)px\]$/);
  if (m) return parseFloat(m[1]);
  return undefined;
}

// --- Radius map ---
const RADIUS_MAP = {
  none: 0,
  sm: 2,
  '': 4, // bare `rounded`
  md: 6,
  lg: 8,
  xl: 12,
  '2xl': 16,
  '3xl': 24,
  full: 999,
};

// --- Shadow map ---
const SHADOW_MAP = {
  sm: { type: 'shadow', shadowType: 'outer', blur: 2, color: '#0000000D' },
  '': { type: 'shadow', shadowType: 'outer', blur: 4, color: '#0000001A' },
  md: { type: 'shadow', shadowType: 'outer', blur: 6, color: '#0000001A' },
};

// --- Font size map ---
const FONT_SIZE_MAP = {
  xs: 12,
  sm: 14,
  base: 16,
  lg: 18,
  xl: 20,
  '2xl': 24,
};

// --- Font weight map ---
const FONT_WEIGHT_MAP = {
  normal: 400,
  medium: 500,
  semibold: 600,
  bold: 700,
};

// --- Line height map ---
const LINE_HEIGHT_MAP = {
  none: 1,
  tight: 1.25,
  normal: 1.5,
};

// --- Opacity hex suffix for bg-white/{n} ---
const OPACITY_HEX = {
  5: '0D',
  10: '1A',
  20: '33',
  25: '40',
  30: '4D',
  40: '66',
  50: '80',
  60: '99',
  70: 'B3',
  75: 'BF',
  80: 'CC',
  90: 'E6',
  95: 'F2',
};

// ============================================================
// Main conversion
// ============================================================
function convert(className) {
  const classes = className.trim().split(/\s+/);
  const props = {};
  const notes = [];

  // Track individual padding values for compound merge
  let padTop, padRight, padBottom, padLeft;
  let hasPadAll = false;

  for (const cls of classes) {
    let matched = false;

    // --- Layout ---
    if (cls === 'flex') {
      props.layout = props.layout || 'horizontal';
      matched = true;
    } else if (cls === 'flex-col') {
      props.layout = 'vertical';
      matched = true;
    } else if (cls === 'flex-row') {
      props.layout = 'horizontal';
      matched = true;
    } else if (cls === 'flex-wrap') {
      props.flexWrap = 'wrap';
      matched = true;
    } else if (cls === 'flex-1') {
      // Depends on parent layout; default to width
      props.width = 'fill_container';
      notes.push(
        'flex-1: set width to fill_container. If parent is vertical layout, change to height.',
      );
      matched = true;
    } else if (cls === 'shrink-0') {
      notes.push('shrink-0: use explicit dimensions in Pencil instead.');
      matched = true;
    } else if (cls === 'grow') {
      notes.push('grow: use fill_container in Pencil instead.');
      matched = true;
    } else if (cls === 'overflow-hidden') {
      props.overflow = 'hidden';
      matched = true;
    } else if (cls === 'truncate') {
      props.overflow = 'hidden';
      notes.push(
        'truncate: text ellipsis not supported in Pencil; overflow set to hidden.',
      );
      matched = true;
    }

    // --- Alignment ---
    else if (cls.startsWith('items-')) {
      const val = cls.slice(6);
      const map = {
        center: 'center',
        start: 'start',
        end: 'end',
        stretch: 'stretch',
      };
      if (map[val]) {
        props.alignItems = map[val];
        matched = true;
      }
    } else if (cls.startsWith('justify-')) {
      const val = cls.slice(8);
      const map = {
        center: 'center',
        between: 'space_between',
        start: 'start',
        end: 'end',
      };
      if (map[val]) {
        props.justifyContent = map[val];
        matched = true;
      }
    }

    // --- Gap / space ---
    else if (cls.startsWith('gap-')) {
      const px = spacingToPx(cls.slice(4));
      if (px !== undefined) {
        props.gap = px;
        matched = true;
      }
    } else if (cls.startsWith('space-x-')) {
      const px = spacingToPx(cls.slice(8));
      if (px !== undefined) {
        props.gap = px;
        if (!props.layout) props.layout = 'horizontal';
        matched = true;
      }
    } else if (cls.startsWith('space-y-')) {
      const px = spacingToPx(cls.slice(8));
      if (px !== undefined) {
        props.gap = px;
        if (!props.layout) props.layout = 'vertical';
        matched = true;
      }
    }

    // --- Padding ---
    else if (/^p-(\d+(?:\.\d+)?)$/.test(cls)) {
      const px = spacingToPx(cls.slice(2));
      if (px !== undefined) {
        props.padding = px;
        hasPadAll = true;
        matched = true;
      }
    } else if (/^px-(\d+(?:\.\d+)?)$/.test(cls)) {
      const px = spacingToPx(cls.slice(3));
      if (px !== undefined) {
        padRight = px;
        padLeft = px;
        matched = true;
      }
    } else if (/^py-(\d+(?:\.\d+)?)$/.test(cls)) {
      const px = spacingToPx(cls.slice(3));
      if (px !== undefined) {
        padTop = px;
        padBottom = px;
        matched = true;
      }
    } else if (/^pt-(\d+(?:\.\d+)?)$/.test(cls)) {
      const px = spacingToPx(cls.slice(3));
      if (px !== undefined) {
        padTop = px;
        matched = true;
      }
    } else if (/^pr-(\d+(?:\.\d+)?)$/.test(cls)) {
      const px = spacingToPx(cls.slice(3));
      if (px !== undefined) {
        padRight = px;
        matched = true;
      }
    } else if (/^pb-(\d+(?:\.\d+)?)$/.test(cls)) {
      const px = spacingToPx(cls.slice(3));
      if (px !== undefined) {
        padBottom = px;
        matched = true;
      }
    } else if (/^pl-(\d+(?:\.\d+)?)$/.test(cls)) {
      const px = spacingToPx(cls.slice(3));
      if (px !== undefined) {
        padLeft = px;
        matched = true;
      }
    }

    // --- Margin (unsupported) ---
    else if (/^m[xytblr]?-\d/.test(cls)) {
      notes.push(
        `${cls}: margin has no Pencil equivalent. Use padding on parent or gap instead.`,
      );
      matched = true;
    }

    // --- Width ---
    else if (cls === 'w-full') {
      props.width = 'fill_container';
      matched = true;
    } else if (cls === 'w-fit') {
      props.width = 'fit_content';
      matched = true;
    } else if (cls.startsWith('w-[')) {
      const arb = parseArbitrary(cls.slice(2));
      if (arb !== undefined) {
        props.width = arb;
        matched = true;
      }
    } else if (/^w-(\d+(?:\.\d+)?)$/.test(cls)) {
      const px = spacingToPx(cls.slice(2));
      if (px !== undefined) {
        props.width = px;
        matched = true;
      }
    } else if (/^min-w-(\d+(?:\.\d+)?)$/.test(cls)) {
      const px = spacingToPx(cls.match(/^min-w-(.+)$/)[1]);
      if (px !== undefined) {
        props.minWidth = px;
        matched = true;
      }
    } else if (cls.startsWith('max-w-')) {
      notes.push(`${cls}: max-width has no direct Pencil equivalent.`);
      matched = true;
    }

    // --- Height ---
    else if (cls === 'h-full') {
      props.height = 'fill_container';
      matched = true;
    } else if (cls === 'h-fit') {
      props.height = 'fit_content';
      matched = true;
    } else if (cls.startsWith('h-[')) {
      const arb = parseArbitrary(cls.slice(2));
      if (arb !== undefined) {
        props.height = arb;
        matched = true;
      }
    } else if (/^h-(\d+(?:\.\d+)?)$/.test(cls)) {
      const px = spacingToPx(cls.slice(2));
      if (px !== undefined) {
        props.height = px;
        matched = true;
      }
    }

    // --- Border radius ---
    else if (cls === 'rounded') {
      props.cornerRadius = RADIUS_MAP[''];
      matched = true;
    } else if (cls.startsWith('rounded-')) {
      const key = cls.slice(8);
      if (key in RADIUS_MAP) {
        props.cornerRadius = RADIUS_MAP[key];
        matched = true;
      }
    }

    // --- Colors: bg ---
    else if (cls === 'bg-white') {
      props.fill = '#FFFFFF';
      matched = true;
    } else if (cls.startsWith('bg-white/')) {
      const opVal = cls.slice(9);
      const hex = OPACITY_HEX[opVal];
      if (hex) {
        props.fill = '#FFFFFF' + hex;
        matched = true;
      } else {
        props.fill = '#FFFFFF';
        notes.push(`${cls}: opacity ${opVal} approximated.`);
        matched = true;
      }
    } else if (cls === 'bg-mine-page-bg') {
      props.fill = '$mine.page.bg';
      matched = true;
    } else if (cls === 'bg-mine-card') {
      props.fill = '$mine.card';
      matched = true;
    } else if (cls.startsWith('bg-mine-')) {
      props.fill = '$mine.' + cls.slice(8).replace(/-/g, '.');
      matched = true;
    }

    // --- Colors: text (for text nodes) ---
    else if (cls === 'text-mine-text') {
      props.fill = '$mine.text';
      matched = true;
    } else if (cls === 'text-mine-muted') {
      props.fill = '$mine.muted';
      matched = true;
    } else if (cls.startsWith('text-mine-')) {
      props.fill = '$mine.' + cls.slice(10).replace(/-/g, '.');
      matched = true;
    }

    // --- Colors: border ---
    else if (cls === 'border-mine-border') {
      if (!props.stroke) props.stroke = {};
      props.stroke.fill = '$mine.border';
      matched = true;
    } else if (cls.startsWith('border-mine-')) {
      if (!props.stroke) props.stroke = {};
      props.stroke.fill = '$mine.' + cls.slice(12).replace(/-/g, '.');
      matched = true;
    }

    // --- Typography: font size (must not conflict with text-mine-*) ---
    else if (/^text-(xs|sm|base|lg|xl|2xl)$/.test(cls)) {
      const key = cls.slice(5);
      if (key in FONT_SIZE_MAP) {
        props.fontSize = FONT_SIZE_MAP[key];
        matched = true;
      }
    }

    // --- Typography: font weight ---
    else if (cls.startsWith('font-') && cls !== 'font-mono') {
      const key = cls.slice(5);
      if (key in FONT_WEIGHT_MAP) {
        props.fontWeight = FONT_WEIGHT_MAP[key];
        matched = true;
      }
    } else if (cls === 'font-mono') {
      props.fontFamily = 'JetBrains Mono';
      matched = true;
    }

    // --- Typography: line height ---
    else if (cls.startsWith('leading-')) {
      const key = cls.slice(8);
      if (key in LINE_HEIGHT_MAP) {
        props.lineHeight = LINE_HEIGHT_MAP[key];
        matched = true;
      }
    }

    // --- Typography: letter spacing ---
    else if (cls === 'tracking-tight') {
      props.letterSpacing = -0.025;
      notes.push(
        'tracking-tight: -0.025em. Pencil may need px value depending on fontSize.',
      );
      matched = true;
    }

    // --- Effects: shadow ---
    else if (cls === 'shadow') {
      props.effect = { ...SHADOW_MAP[''] };
      matched = true;
    } else if (cls === 'shadow-sm') {
      props.effect = { ...SHADOW_MAP['sm'] };
      matched = true;
    } else if (cls === 'shadow-md') {
      props.effect = { ...SHADOW_MAP['md'] };
      matched = true;
    }

    // --- Effects: border ---
    else if (cls === 'border') {
      if (!props.stroke) props.stroke = { fill: '$mine.border', thickness: 1 };
      else props.stroke.thickness = 1;
      matched = true;
    } else if (/^border-(\d+)$/.test(cls)) {
      const n = parseInt(cls.slice(7));
      if (!props.stroke) props.stroke = { thickness: n };
      else props.stroke.thickness = n;
      matched = true;
    }

    // --- Effects: opacity ---
    else if (/^opacity-(\d+)$/.test(cls)) {
      const n = parseInt(cls.slice(8));
      props.opacity = n / 100;
      matched = true;
    }

    // --- Tabular nums (data-slot note) ---
    else if (cls === 'tabular-nums') {
      notes.push(
        'tabular-nums: no Pencil equivalent; ensure font supports tabular figures.',
      );
      matched = true;
    }

    // --- Unrecognized ---
    if (!matched) {
      notes.push(`${cls}: not recognized or no Pencil mapping.`);
    }
  }

  // --- Merge compound padding ---
  if (
    !hasPadAll &&
    (padTop !== undefined ||
      padRight !== undefined ||
      padBottom !== undefined ||
      padLeft !== undefined)
  ) {
    const t = padTop ?? 0;
    const r = padRight ?? 0;
    const b = padBottom ?? 0;
    const l = padLeft ?? 0;

    // If all four are the same, use single value
    if (t === r && r === b && b === l) {
      props.padding = t;
    }
    // If top/bottom match and left/right match, use [vertical, horizontal]
    else if (t === b && l === r) {
      props.padding = [t, r];
    } else {
      props.padding = [t, r, b, l];
    }
  } else if (hasPadAll) {
    // If we had p-{n} plus directional overrides, directional wins
    const base = props.padding;
    if (
      padTop !== undefined ||
      padRight !== undefined ||
      padBottom !== undefined ||
      padLeft !== undefined
    ) {
      const pt = padTop ?? base;
      const pr = padRight ?? base;
      const pb = padBottom ?? base;
      const pl = padLeft ?? base;
      if (pt === pr && pr === pb && pb === pl) {
        props.padding = pt;
      } else if (pt === pb && pr === pl) {
        props.padding = [pt, pr];
      } else {
        props.padding = [pt, pr, pb, pl];
      }
    }
  }

  return { properties: props, ...(notes.length > 0 ? { notes } : {}) };
}

const result = convert(input);
console.log(JSON.stringify(result, null, 2));
