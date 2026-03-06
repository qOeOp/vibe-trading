#!/usr/bin/env bash
# Design System Drift Detection
# Scans for violations of component-design-system.md §1 prohibitions
# and Pencil<->Code cross-checks.
# Run: bash apps/web/scripts/check-design-drift.sh
# Exit code: 0 = clean, 1 = violations found

set -euo pipefail

ROOT="apps/web/src"
PEN_FILE="apps/web/design/tokens.pen"
CSS_FILE="apps/web/src/app/globals.css"
REGISTRY_FILE="apps/web/src/components/REGISTRY.md"

VIOLATIONS=0
YELLOW='\033[0;33m'
RED='\033[0;31m'
GREEN='\033[0;32m'
CYAN='\033[0;36m'
BOLD='\033[1m'
NC='\033[0m'

# Per-section violation counters stored as "key=count" lines in a temp file
SUMMARY_FILE=$(mktemp)
trap 'rm -f "$SUMMARY_FILE"' EXIT

report() {
  local rule="$1" file="$2" line="$3" detail="$4"
  echo -e "${RED}[${rule}]${NC} ${file}:${line} -- ${detail}"
  VIOLATIONS=$((VIOLATIONS + 1))
  # Increment section counter
  local current
  current=$(grep "^${rule}=" "$SUMMARY_FILE" 2>/dev/null | cut -d= -f2 || echo 0)
  current=${current:-0}
  # Remove old entry and write new one
  grep -v "^${rule}=" "$SUMMARY_FILE" > "${SUMMARY_FILE}.tmp" 2>/dev/null || true
  mv "${SUMMARY_FILE}.tmp" "$SUMMARY_FILE"
  echo "${rule}=$((current + 1))" >> "$SUMMARY_FILE"
}

section() {
  echo -e "\n${YELLOW}-- $1 --${NC}"
}

# Common exclusion patterns (test files, mock data, chart libraries)
EXCLUDE_COMMON=(
  --exclude-dir="__tests__"
  --exclude="*.test.*"
  --exclude="*.stories.*"
)

is_excluded_common() {
  local file="$1"
  [[ "$file" == *".test."* ]] && return 0
  [[ "$file" == *"__tests__"* ]] && return 0
  [[ "$file" == *".stories."* ]] && return 0
  [[ "$file" == *"mock-factory"* ]] && return 0
  return 1
}

is_chart_lib() {
  local file="$1"
  [[ "$file" == *"lib/ngx-charts"* ]] && return 0
  [[ "$file" == *"lib/xycharts"* ]] && return 0
  return 1
}

# ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
# CODE-SIDE CHECKS
# ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

# ── §1.1 Raw hex colors ──────────────────────────────────
section "§1.1 Raw Hex Colors"

RAW_HEX=$(grep -rn --include="*.tsx" --include="*.ts" \
  -E '(text-\[#|bg-\[#|border-\[#|fill-\[#|stroke-\[#|shadow-\[#)' \
  "$ROOT" \
  "${EXCLUDE_COMMON[@]}" \
  --exclude="types.ts" \
  | grep -v "globals.css" \
  | grep -v "mock-factory" \
  | grep -v "lib/ngx-charts" \
  | grep -v "lib/xycharts" \
  || true)

if [ -n "$RAW_HEX" ]; then
  while IFS= read -r line; do
    file=$(echo "$line" | cut -d: -f1)
    lineno=$(echo "$line" | cut -d: -f2)
    content=$(echo "$line" | cut -d: -f3-)
    report "§1.1" "$file" "$lineno" "Raw hex in Tailwind class: $(echo "$content" | sed 's/^[[:space:]]*//' | head -c 80)"
  done <<< "$RAW_HEX"
else
  echo -e "${GREEN}No raw hex violations found${NC}"
fi

# ── §1.2 Duplicate Tailwind patterns ─────────────────────
section "§1.2 Duplicate Tailwind Patterns"

# Extract className="..." values with 4+ classes, find duplicates across 3+ files
DUPE_COUNT=0
if command -v node &>/dev/null; then
  DUPE_OUTPUT=$(node -e "
const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

// Find all tsx files (excluding tests, mocks, chart libs)
const files = execSync(
  'find $ROOT -name \"*.tsx\" -not -path \"*__tests__*\" -not -path \"*mock-factory*\" -not -name \"*.test.*\" -not -name \"*.stories.*\"',
  { encoding: 'utf8' }
).trim().split('\n').filter(Boolean);

const classMap = new Map(); // className string -> Set of files

for (const file of files) {
  try {
    const content = fs.readFileSync(file, 'utf8');
    // Match className=\"...\" and className={cn(\"...\"
    const re = /className=[\"']([^\"']+)[\"']/g;
    let m;
    while ((m = re.exec(content)) !== null) {
      const classes = m[1].trim();
      const classCount = classes.split(/\s+/).length;
      if (classCount < 4) continue;
      // Normalize: sort classes for comparison
      const normalized = classes.split(/\s+/).sort().join(' ');
      if (!classMap.has(normalized)) classMap.set(normalized, new Set());
      classMap.get(normalized).add(file);
    }
  } catch(e) { /* skip unreadable */ }
}

// Report patterns appearing in 3+ files
let found = false;
for (const [pattern, fileSet] of classMap) {
  if (fileSet.size >= 3) {
    const fileList = [...fileSet].slice(0, 3).join(', ');
    const extra = fileSet.size > 3 ? ' +' + (fileSet.size - 3) + ' more' : '';
    console.log(pattern + '|||' + fileSet.size + '|||' + fileList + extra);
    found = true;
  }
}
if (!found) console.log('__CLEAN__');
" 2>/dev/null || echo "__CLEAN__")

  if [ "$DUPE_OUTPUT" != "__CLEAN__" ]; then
    while IFS= read -r line; do
      [ -z "$line" ] && continue
      [ "$line" = "__CLEAN__" ] && continue
      pattern=$(echo "$line" | cut -d'|' -f1-1)
      count=$(echo "$line" | cut -d'|' -f4)
      files_info=$(echo "$line" | cut -d'|' -f7-)
      report "§1.2" "(multiple)" "0" "Tailwind pattern in ${count} files: \"$(echo "$pattern" | head -c 60)\" -> ${files_info}"
      DUPE_COUNT=$((DUPE_COUNT + 1))
    done <<< "$DUPE_OUTPUT"
  fi
else
  echo -e "${CYAN}Skipped: node not available for className analysis${NC}"
fi

if [ "$DUPE_COUNT" -eq 0 ]; then
  echo -e "${GREEN}No duplicate Tailwind pattern violations found${NC}"
fi

# ── §1.3 Missing data-slot ───────────────────────────────
section "§1.3 Missing data-slot"

COMPONENTS=$(grep -rl --include="*.tsx" \
  -E '(function [A-Z]|const [A-Z]\w+ =)' \
  "$ROOT/components" "$ROOT/features" 2>/dev/null \
  | grep -v "\.test\." \
  | grep -v "__tests__" \
  | grep -v "\.stories\." \
  || true)

MISSING_SLOT=0
for file in $COMPONENTS; do
  if grep -q 'data-slot' "$file" 2>/dev/null; then
    continue
  fi
  if grep -qE '(return \(|return <)' "$file" 2>/dev/null; then
    report "§1.3" "$file" "0" "Component missing data-slot attribute"
    MISSING_SLOT=$((MISSING_SLOT + 1))
  fi
done

if [ "$MISSING_SLOT" -eq 0 ]; then
  echo -e "${GREEN}No missing data-slot violations found${NC}"
fi

# ── §1.3 Components missing className prop ───────────────
section "§1.3 Missing className Prop"

MISSING_CN=0
for file in $COMPONENTS; do
  # Skip pure logic files (no JSX)
  if ! grep -qE '(return \(|return <)' "$file" 2>/dev/null; then
    continue
  fi
  # Skip index/barrel files
  basename_f=$(basename "$file")
  if [ "$basename_f" = "index.tsx" ] || [ "$basename_f" = "index.ts" ]; then
    continue
  fi
  # Check if file accepts className in props
  if ! grep -qE '(className|\.\.\.props)' "$file" 2>/dev/null; then
    report "§1.3" "$file" "0" "Component does not accept className prop"
    MISSING_CN=$((MISSING_CN + 1))
  fi
done

if [ "$MISSING_CN" -eq 0 ]; then
  echo -e "${GREEN}No missing className prop violations found${NC}"
fi

# ── §1.4 Backdrop blur in wrong places ───────────────────
section "§1.4 Backdrop Blur"

BLUR=$(grep -rn --include="*.tsx" --include="*.ts" \
  'backdrop-blur' \
  "$ROOT" \
  "${EXCLUDE_COMMON[@]}" \
  | grep -v "layout/" \
  | grep -v "globals.css" \
  | grep -v "glowing-effect" \
  || true)

if [ -n "$BLUR" ]; then
  while IFS= read -r line; do
    file=$(echo "$line" | cut -d: -f1)
    lineno=$(echo "$line" | cut -d: -f2)
    report "§1.4" "$file" "$lineno" "backdrop-blur outside layout/ (only sidebar/nav/ticker allowed)"
  done <<< "$BLUR"
else
  echo -e "${GREEN}No backdrop-blur violations found${NC}"
fi

# ── §1.4 Numbers without font-mono ───────────────────────
section "§1.4 Numbers without font-mono"

NUMERIC_FILES=$(grep -rl --include="*.tsx" \
  -E '(\.toFixed|\.toLocaleString|tabular-nums|font-mono)' \
  "$ROOT/features" "$ROOT/components" 2>/dev/null \
  | grep -v "\.test\." \
  | grep -v "__tests__" \
  || true)

MISSING_MONO=0
for file in $NUMERIC_FILES; do
  HAS_NUMERIC=$(grep -c -E '\.toFixed|\.toLocaleString' "$file" 2>/dev/null || true)
  HAS_MONO=$(grep -c -E 'font-mono|tabular-nums' "$file" 2>/dev/null || true)
  HAS_NUMERIC=${HAS_NUMERIC:-0}
  HAS_MONO=${HAS_MONO:-0}
  if [ "$HAS_NUMERIC" -gt 0 ] 2>/dev/null && [ "$HAS_MONO" -eq 0 ] 2>/dev/null; then
    report "§1.4" "$file" "0" "File uses numeric formatting but lacks font-mono tabular-nums"
    MISSING_MONO=$((MISSING_MONO + 1))
  fi
done

if [ "$MISSING_MONO" -eq 0 ]; then
  echo -e "${GREEN}No font-mono violations detected${NC}"
fi

# ── §1.4 Clickable elements without hover ────────────────
section "§1.4 Clickable Without Hover"

MISSING_HOVER=0
# Find TSX files with onClick or <button or <a that lack hover: classes
CLICKABLE_FILES=$(grep -rl --include="*.tsx" \
  -E '(onClick|<button|<a )' \
  "$ROOT/components" "$ROOT/features" 2>/dev/null \
  | grep -v "\.test\." \
  | grep -v "__tests__" \
  | grep -v "\.stories\." \
  | grep -v "mock-factory" \
  || true)

for file in $CLICKABLE_FILES; do
  HAS_HOVER=$(grep -c 'hover:' "$file" 2>/dev/null || true)
  HAS_HOVER=${HAS_HOVER:-0}
  # Check if it uses wrapper components that provide hover (Button, cn(), variants)
  USES_WRAPPER=$(grep -cE '(from.*button|from.*toggle|<Button|<Toggle|<DropdownMenu|<Popover|<Dialog|<Sheet|<Tooltip|<Collapsible|variant)' "$file" 2>/dev/null || true)
  USES_WRAPPER=${USES_WRAPPER:-0}
  if [ "$HAS_HOVER" -eq 0 ] && [ "$USES_WRAPPER" -eq 0 ]; then
    report "§1.4" "$file" "0" "Clickable elements (onClick/button/a) without hover: state"
    MISSING_HOVER=$((MISSING_HOVER + 1))
  fi
done

if [ "$MISSING_HOVER" -eq 0 ]; then
  echo -e "${GREEN}No missing hover violations found${NC}"
fi

# ── §1.4 Spinner usage ───────────────────────────────────
section "§1.4 Spinner Usage"

SPINNERS=$(grep -rn --include="*.tsx" --include="*.ts" \
  'animate-spin' \
  "$ROOT" \
  "${EXCLUDE_COMMON[@]}" \
  | grep -v "mock-factory" \
  | grep -v "skeleton" \
  | grep -v "Skeleton" \
  | grep -v "globals.css" \
  || true)

if [ -n "$SPINNERS" ]; then
  while IFS= read -r line; do
    file=$(echo "$line" | cut -d: -f1)
    lineno=$(echo "$line" | cut -d: -f2)
    report "§1.4" "$file" "$lineno" "animate-spin detected (use Skeleton + animate-pulse instead)"
  done <<< "$SPINNERS"
else
  echo -e "${GREEN}No spinner violations found${NC}"
fi

# ── §1.4 Arbitrary spacing values ────────────────────────
section "§1.4 Arbitrary Spacing"

ARBITRARY_SPACING=$(grep -rn --include="*.tsx" --include="*.ts" \
  -E '(^|[" ])([pm][trblxy]?-\[|gap-\[|space-[xy]-\[)' \
  "$ROOT" \
  "${EXCLUDE_COMMON[@]}" \
  | grep -v "mock-factory" \
  | grep -v "lib/ngx-charts" \
  | grep -v "lib/xycharts" \
  | grep -v "globals.css" \
  | grep -v 'var(' \
  || true)

if [ -n "$ARBITRARY_SPACING" ]; then
  while IFS= read -r line; do
    file=$(echo "$line" | cut -d: -f1)
    lineno=$(echo "$line" | cut -d: -f2)
    content=$(echo "$line" | cut -d: -f3-)
    report "§1.4" "$file" "$lineno" "Arbitrary spacing value: $(echo "$content" | sed 's/^[[:space:]]*//' | head -c 80)"
  done <<< "$ARBITRARY_SPACING"
else
  echo -e "${GREEN}No arbitrary spacing violations found${NC}"
fi

# ── §1.4 Dark theme color patterns ──────────────────────
section "§1.4 Dark Theme Colors"

DARK_COLORS=$(grep -rn --include="*.tsx" --include="*.ts" \
  -E 'text-white/' \
  "$ROOT" \
  "${EXCLUDE_COMMON[@]}" \
  | grep -v "mock-factory" \
  | grep -v "layout/" \
  | grep -v "globals.css" \
  | grep -v "lib/ngx-charts" \
  | grep -v "lib/xycharts" \
  | grep -v "treemap" \
  || true)

if [ -n "$DARK_COLORS" ]; then
  while IFS= read -r line; do
    file=$(echo "$line" | cut -d: -f1)
    lineno=$(echo "$line" | cut -d: -f2)
    content=$(echo "$line" | cut -d: -f3-)
    report "§1.4" "$file" "$lineno" "Dark theme pattern (text-white/) in light theme: $(echo "$content" | sed 's/^[[:space:]]*//' | head -c 60)"
  done <<< "$DARK_COLORS"
else
  echo -e "${GREEN}No dark theme color violations found${NC}"
fi

# ── §1.5 Forbidden animation patterns ───────────────────
section "§1.5 Forbidden Animations"

FORBIDDEN_ANIM=0

# Check for bounce/elastic/spring in animation contexts
BOUNCE=$(grep -rn --include="*.tsx" --include="*.ts" \
  -E '(animate-bounce|type:\s*["\x27]bounce["\x27]|type:\s*["\x27]elastic["\x27]|type:\s*["\x27]spring["\x27])' \
  "$ROOT" \
  "${EXCLUDE_COMMON[@]}" \
  | grep -v "mock-factory" \
  | grep -v "globals.css" \
  || true)

if [ -n "$BOUNCE" ]; then
  while IFS= read -r line; do
    file=$(echo "$line" | cut -d: -f1)
    lineno=$(echo "$line" | cut -d: -f2)
    content=$(echo "$line" | cut -d: -f3-)
    report "§1.5" "$file" "$lineno" "Forbidden animation (bounce/elastic/spring): $(echo "$content" | sed 's/^[[:space:]]*//' | head -c 60)"
    FORBIDDEN_ANIM=$((FORBIDDEN_ANIM + 1))
  done <<< "$BOUNCE"
fi

# Check for duration values > 1000ms
LONG_DURATION=$(grep -rn --include="*.tsx" --include="*.ts" \
  -E 'duration-\[[0-9]+' \
  "$ROOT" \
  "${EXCLUDE_COMMON[@]}" \
  | grep -v "mock-factory" \
  || true)

if [ -n "$LONG_DURATION" ]; then
  while IFS= read -r line; do
    # Extract the duration value
    dur=$(echo "$line" | grep -oE 'duration-\[[0-9]+' | grep -oE '[0-9]+' | head -1)
    if [ -n "$dur" ] && [ "$dur" -gt 1000 ] 2>/dev/null; then
      file=$(echo "$line" | cut -d: -f1)
      lineno=$(echo "$line" | cut -d: -f2)
      report "§1.5" "$file" "$lineno" "Animation duration > 1s: duration-[${dur}ms]"
      FORBIDDEN_ANIM=$((FORBIDDEN_ANIM + 1))
    fi
  done <<< "$LONG_DURATION"
fi

# Also check Framer Motion duration props > 1s
# Framer Motion uses seconds. Flag values 2-10 (clearly seconds, not ms).
# Values >= 100 are almost certainly milliseconds from other contexts, skip them.
LONG_FM_DURATION=$(grep -rn --include="*.tsx" --include="*.ts" \
  -E 'duration:\s*[0-9]+\.?[0-9]*' \
  "$ROOT" \
  "${EXCLUDE_COMMON[@]}" \
  | grep -v "mock-factory" \
  | grep -v "globals.css" \
  || true)

if [ -n "$LONG_FM_DURATION" ]; then
  while IFS= read -r line; do
    dur=$(echo "$line" | grep -oE 'duration:\s*[0-9]+\.?[0-9]*' | grep -oE '[0-9]+\.?[0-9]*' | head -1)
    if [ -n "$dur" ]; then
      int_part=$(echo "$dur" | cut -d. -f1)
      # Only flag values 2-99 (clearly seconds). >=100 are milliseconds from other libs.
      if [ -n "$int_part" ] && [ "$int_part" -gt 1 ] && [ "$int_part" -lt 100 ] 2>/dev/null; then
        file=$(echo "$line" | cut -d: -f1)
        lineno=$(echo "$line" | cut -d: -f2)
        report "§1.5" "$file" "$lineno" "Framer Motion duration > 1s: duration: ${dur}"
        FORBIDDEN_ANIM=$((FORBIDDEN_ANIM + 1))
      fi
    fi
  done <<< "$LONG_FM_DURATION"
fi

if [ "$FORBIDDEN_ANIM" -eq 0 ]; then
  echo -e "${GREEN}No forbidden animation violations found${NC}"
fi

# ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
# PENCIL <-> CODE CROSS-CHECKS
# ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

# ── Token Parity: tokens.pen vs globals.css ──────────────
section "Pencil Token Parity (pen vs globals.css)"

TOKEN_PARITY_COUNT=0

if [ -f "$PEN_FILE" ] && [ -f "$CSS_FILE" ]; then
  if command -v node &>/dev/null; then
    TOKEN_OUTPUT=$(node -e "
const fs = require('fs');

// Parse pen file variables
const pen = JSON.parse(fs.readFileSync('$PEN_FILE', 'utf8'));
const penVars = new Set(Object.keys(pen.variables || {}));

// Parse globals.css @theme block for --color-mine-* and --color-market-* tokens
const css = fs.readFileSync('$CSS_FILE', 'utf8');
const cssVars = new Set();

// Extract variable names from @theme block: --color-mine-xxx, --color-market-xxx
const colorRe = /--color-(mine-[a-z0-9-]+|market-[a-z0-9-]+)/g;
let m;
while ((m = colorRe.exec(css)) !== null) {
  cssVars.add(m[1]);
}

// Also extract non-color tokens from @theme: --radius-*, --font-*, --shadow-*
const otherRe = /--(?:radius|font|shadow)-([\w-]+)/g;
while ((m = otherRe.exec(css)) !== null) {
  // We track these but pen uses different naming, skip font/shadow for now
}

// Compare: pen color variables vs CSS color tokens
// Pen uses dot-notation (mine.text), CSS uses hyphens (mine-text)
const dotToHyphen = (s) => s.replace(/\\./g, '-');
const penColors = [...penVars].filter(v =>
  v.startsWith('mine.') || v.startsWith('mine-') ||
  v.startsWith('market.') || v.startsWith('market-')
);
const cssColors = [...cssVars];

// In pen but not in CSS (convert dots to hyphens for comparison)
for (const v of penColors) {
  const cssName = dotToHyphen(v);
  if (!cssVars.has(cssName) && !cssVars.has(v)) {
    console.log('PEN_ONLY|' + v);
  }
}

// In CSS but not in pen (check both dot and hyphen forms)
const hyphenToDot = (s) => s.replace(/-/g, '.');
for (const v of cssColors) {
  if (!penVars.has(v) && !penVars.has(hyphenToDot(v))) {
    console.log('CSS_ONLY|' + v);
  }
}

// Check non-color pen variables for spacing/radius/panel tokens
const penNonColor = [...penVars].filter(v =>
  !v.match(/^(mine|market)[.-]/)
);
// These are design tokens in pen; CSS equivalents use different naming
// We just report them for awareness without flagging violations

const penOk = penColors.every(v => {
  const cssName = dotToHyphen(v);
  return cssVars.has(cssName) || cssVars.has(v);
});
const cssOk = cssColors.every(v => penVars.has(v) || penVars.has(hyphenToDot(v)));
if (penOk && cssOk) {
  console.log('__CLEAN__');
}
" 2>/dev/null || echo "__ERROR__")

    if [ "$TOKEN_OUTPUT" = "__ERROR__" ]; then
      echo -e "${CYAN}Warning: Could not parse token files${NC}"
    elif echo "$TOKEN_OUTPUT" | grep -q "__CLEAN__"; then
      echo -e "${GREEN}All color tokens in sync between pen and globals.css${NC}"
    else
      while IFS= read -r line; do
        [ -z "$line" ] && continue
        [ "$line" = "__CLEAN__" ] && continue
        direction=$(echo "$line" | cut -d'|' -f1)
        varname=$(echo "$line" | cut -d'|' -f2)
        if [ "$direction" = "PEN_ONLY" ]; then
          report "Pencil" "$PEN_FILE" "0" "Token '$varname' in pen but missing from globals.css @theme"
          TOKEN_PARITY_COUNT=$((TOKEN_PARITY_COUNT + 1))
        elif [ "$direction" = "CSS_ONLY" ]; then
          report "Pencil" "$CSS_FILE" "0" "Token '$varname' in globals.css @theme but missing from pen"
          TOKEN_PARITY_COUNT=$((TOKEN_PARITY_COUNT + 1))
        fi
      done <<< "$TOKEN_OUTPUT"
    fi
  elif command -v jq &>/dev/null; then
    # Fallback to jq — pen uses dot-notation (mine.text), CSS uses hyphens (mine-text)
    PEN_COLORS=$(jq -r '.variables // {} | keys[] | select(startswith("mine") or startswith("market"))' "$PEN_FILE" 2>/dev/null | sort || true)
    CSS_COLORS=$(grep -oE '\-\-color\-(mine|market)-[a-z0-9-]+' "$CSS_FILE" 2>/dev/null | sed 's/--color-//' | sort -u || true)

    # Pen-only (convert dots to hyphens for comparison)
    while IFS= read -r var; do
      [ -z "$var" ] && continue
      css_name=$(echo "$var" | tr '.' '-')
      if ! echo "$CSS_COLORS" | grep -qx "$css_name" && ! echo "$CSS_COLORS" | grep -qx "$var"; then
        report "Pencil" "$PEN_FILE" "0" "Token '$var' in pen but missing from globals.css @theme"
        TOKEN_PARITY_COUNT=$((TOKEN_PARITY_COUNT + 1))
      fi
    done <<< "$PEN_COLORS"

    # CSS-only (convert hyphens to dots for comparison)
    while IFS= read -r var; do
      [ -z "$var" ] && continue
      dot_name=$(echo "$var" | tr '-' '.')
      if ! echo "$PEN_COLORS" | grep -qx "$var" && ! echo "$PEN_COLORS" | grep -qx "$dot_name"; then
        report "Pencil" "$CSS_FILE" "0" "Token '$var' in globals.css @theme but missing from pen"
        TOKEN_PARITY_COUNT=$((TOKEN_PARITY_COUNT + 1))
      fi
    done <<< "$CSS_COLORS"

    if [ "$TOKEN_PARITY_COUNT" -eq 0 ]; then
      echo -e "${GREEN}All color tokens in sync between pen and globals.css${NC}"
    fi
  else
    echo -e "${CYAN}Skipped: neither node nor jq available for JSON parsing${NC}"
  fi
else
  echo -e "${CYAN}Skipped: pen file ($PEN_FILE) or CSS file ($CSS_FILE) not found${NC}"
fi

# ── Component Registry Completeness ──────────────────────
section "Pencil Component Registry Completeness"

REGISTRY_MISSING=0

if [ -f "$PEN_FILE" ] && [ -f "$REGISTRY_FILE" ]; then
  if command -v node &>/dev/null; then
    REGISTRY_OUTPUT=$(node -e "
const fs = require('fs');

// Parse pen file for reusable components
const pen = JSON.parse(fs.readFileSync('$PEN_FILE', 'utf8'));
const reusableNames = new Set();

function findReusable(node) {
  if (node.reusable && node.name) {
    const name = node.name.replace(/^Component\//, '');
    reusableNames.add(name);
  }
  if (node.children) {
    for (const child of node.children) {
      findReusable(child);
    }
  }
}

if (pen.children) {
  for (const child of pen.children) {
    findReusable(child);
  }
}

// Parse REGISTRY.md — collect all Pencil column values AND Component names
const registry = fs.readFileSync('$REGISTRY_FILE', 'utf8');
const pencilRefs = new Set();  // Pencil column values
const componentNames = new Set();  // Component column values

const lines = registry.split('\n');
let pencilColIdx = -1;
let componentColIdx = -1;

for (const line of lines) {
  if (!line.startsWith('|')) continue;
  const cols = line.split('|').map(c => c.trim()).filter(Boolean);

  // Detect header row to find column indices
  if (cols.some(c => c === 'Pencil')) {
    pencilColIdx = cols.indexOf('Pencil');
    componentColIdx = cols.indexOf('Component');
    continue;
  }
  if (line.includes('---')) continue;
  if (cols.length < 3) continue;

  // Use detected indices, fallback to defaults
  const pIdx = pencilColIdx >= 0 ? pencilColIdx : 2;
  const cIdx = componentColIdx >= 0 ? componentColIdx : 0;

  const pencilCol = cols[pIdx] || '';
  const componentCol = cols[cIdx] || '';

  if (pencilCol && pencilCol !== '--' && pencilCol !== 'Pencil') {
    const cleaned = pencilCol.replace(/\\\\\*/g, '*').replace(/\\\\/g, '');
    pencilRefs.add(cleaned);
  }
  if (componentCol && componentCol !== 'Component') {
    componentNames.add(componentCol);
  }
}

// Also parse L3/feature components line (not in L1/L2 tables but acknowledged)
const l3Line = registry.match(/Pencil L3.*?:(.*)/);
const l3Names = new Set();
if (l3Line) {
  l3Line[1].split(',').forEach(s => {
    const name = s.trim().replace(/\\\\\*/g, '*').replace(/\\\\/g, '').replace(/ 等$/, '');
    if (name) l3Names.add(name);
  });
}

// Check: reusable pen components not referenced in registry
// A pen component matches if its name (or base name) appears in
// either the Pencil column, Component column, or L3 acknowledged list
let allFound = true;
for (const name of reusableNames) {
  const baseName = name.split('/')[0];
  const fullMatch = pencilRefs.has(name);
  const wildcardMatch = pencilRefs.has(baseName + '/*');
  const baseMatch = pencilRefs.has(baseName);
  const inPencilCol = [...pencilRefs].some(r => r.includes(baseName));
  const inComponentCol = componentNames.has(baseName) || componentNames.has(name);
  // Also check '(in X)' pattern like '(in PanelFrame)'
  const inParenRef = [...pencilRefs].some(r => r.includes('(in ' + baseName + ')'));
  // Check L3 acknowledged list
  const inL3 = l3Names.has(name) || [...l3Names].some(n => n === baseName + '/*' || n === baseName);

  if (!fullMatch && !wildcardMatch && !baseMatch && !inPencilCol && !inComponentCol && !inParenRef && !inL3) {
    console.log('MISSING|' + name);
    allFound = false;
  }
}

if (allFound) console.log('__CLEAN__');
" 2>/dev/null || echo "__ERROR__")

    if [ "$REGISTRY_OUTPUT" = "__ERROR__" ]; then
      echo -e "${CYAN}Warning: Could not parse registry files${NC}"
    elif echo "$REGISTRY_OUTPUT" | grep -q "__CLEAN__"; then
      echo -e "${GREEN}All reusable pen components are registered in REGISTRY.md${NC}"
    else
      while IFS= read -r line; do
        [ -z "$line" ] && continue
        [ "$line" = "__CLEAN__" ] && continue
        compname=$(echo "$line" | cut -d'|' -f2)
        report "Pencil" "$REGISTRY_FILE" "0" "Reusable pen component '$compname' not found in REGISTRY.md"
        REGISTRY_MISSING=$((REGISTRY_MISSING + 1))
      done <<< "$REGISTRY_OUTPUT"
    fi
  else
    echo -e "${CYAN}Skipped: node not available for registry analysis${NC}"
  fi
else
  echo -e "${CYAN}Skipped: pen file ($PEN_FILE) or registry ($REGISTRY_FILE) not found${NC}"
fi

# ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
# SUMMARY
# ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
echo ""
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"

if [ -s "$SUMMARY_FILE" ]; then
  echo -e "${BOLD}Violations by category:${NC}"
  sort "$SUMMARY_FILE" | while IFS='=' read -r key count; do
    echo -e "  ${RED}${key}${NC}: ${count}"
  done
  echo ""
fi

if [ "$VIOLATIONS" -gt 0 ]; then
  echo -e "${RED}Found $VIOLATIONS design system violation(s)${NC}"
  exit 1
else
  echo -e "${GREEN}No design system violations detected${NC}"
  exit 0
fi
