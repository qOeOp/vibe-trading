#!/bin/bash
# UI Component Layer Audit
# Checks: layer violations, zombie components, oversized components, duplicate semantics
#
# Usage: bash apps/web/scripts/audit-layers.sh

set -e
cd "$(dirname "$0")/.."
SRC="src"
ERRORS=0
WARNINGS=0

echo "═══════════════════════════════════════════"
echo "  UI Component Layer Audit"
echo "═══════════════════════════════════════════"
echo ""

# ── 1. Layer Violations ──────────────────────────

echo "▸ Checking layer violations..."

# L1 must not import L2 or L3
L1_VIOLATIONS=$(grep -rn "from '@/components/shared\|from '@/components/layout\|from '@/features/" "$SRC/components/ui/" --include='*.tsx' --include='*.ts' 2>/dev/null | grep -v "CLAUDE.md" || true)
if [ -n "$L1_VIOLATIONS" ]; then
  echo "  ✗ L1 imports L2/L3:"
  echo "$L1_VIOLATIONS" | sed 's/^/    /'
  ERRORS=$((ERRORS + 1))
else
  echo "  ✓ L1 → no L2/L3 imports"
fi

# L2 must not import L3
L2_DIRS="$SRC/components/shared $SRC/components/layout $SRC/components/animation"
L2_VIOLATIONS=""
for dir in $L2_DIRS; do
  if [ -d "$dir" ]; then
    FOUND=$(grep -rn "from '@/features/" "$dir" --include='*.tsx' --include='*.ts' 2>/dev/null | grep -v "CLAUDE.md" || true)
    L2_VIOLATIONS="$L2_VIOLATIONS$FOUND"
  fi
done
if [ -n "$L2_VIOLATIONS" ]; then
  echo "  ✗ L2 imports L3:"
  echo "$L2_VIOLATIONS" | sed 's/^/    /'
  ERRORS=$((ERRORS + 1))
else
  echo "  ✓ L2 → no L3 imports"
fi

# Cross-feature imports (L3 → L3)
CROSS_FEATURES=""
for feature_dir in "$SRC"/features/*/; do
  feature=$(basename "$feature_dir")
  FOUND=$(grep -rn "from '@/features/" "$feature_dir" --include='*.tsx' --include='*.ts' 2>/dev/null | grep -v "from '@/features/$feature/" | grep -v "CLAUDE.md" || true)
  if [ -n "$FOUND" ]; then
    CROSS_FEATURES="$CROSS_FEATURES$FOUND
"
  fi
done
if [ -n "$(echo "$CROSS_FEATURES" | tr -d '[:space:]')" ]; then
  echo "  ⚠ Cross-feature L3 imports (potential coupling):"
  echo "$CROSS_FEATURES" | head -10 | sed 's/^/    /'
  CROSS_COUNT=$(echo "$CROSS_FEATURES" | grep -c "." || true)
  if [ "$CROSS_COUNT" -gt 10 ]; then
    echo "    ... ($CROSS_COUNT total)"
  fi
  WARNINGS=$((WARNINGS + 1))
else
  echo "  ✓ No cross-feature L3 imports"
fi

echo ""

# ── 2. Zombie Components (0 imports) ─────────────

echo "▸ Checking for zombie components..."

ZOMBIE_COUNT=0
for f in "$SRC"/components/ui/*.tsx; do
  [ -f "$f" ] || continue
  name=$(basename "$f" .tsx)
  # Skip index files
  [ "$name" = "index" ] && continue
  IMPORT_COUNT=$(grep -rn "from ['\"]@/components/ui/$name['\"]" "$SRC" --include='*.tsx' --include='*.ts' 2>/dev/null | grep -v "registry.ts" | grep -v "CLAUDE.md" | wc -l | tr -d ' ')
  if [ "$IMPORT_COUNT" = "0" ]; then
    echo "  ⚠ Zombie L1: components/ui/$name.tsx (0 imports)"
    ZOMBIE_COUNT=$((ZOMBIE_COUNT + 1))
  fi
done

if [ "$ZOMBIE_COUNT" -eq 0 ]; then
  echo "  ✓ No zombie L1 components"
else
  WARNINGS=$((WARNINGS + ZOMBIE_COUNT))
fi

echo ""

# ── 3. Oversized Components (>300 lines) ─────────

echo "▸ Checking for oversized components..."

OVERSIZE_COUNT=0
for f in $(find "$SRC/components" "$SRC/features" -name '*.tsx' -not -path '*/node_modules/*' 2>/dev/null); do
  LINES=$(wc -l < "$f")
  if [ "$LINES" -gt 300 ]; then
    REL=$(echo "$f" | sed "s|$SRC/||")
    echo "  ⚠ $REL ($LINES lines) — consider splitting"
    OVERSIZE_COUNT=$((OVERSIZE_COUNT + 1))
  fi
done

if [ "$OVERSIZE_COUNT" -eq 0 ]; then
  echo "  ✓ No oversized components"
else
  WARNINGS=$((WARNINGS + OVERSIZE_COUNT))
fi

echo ""

# ── 4. Hex Color Violations ─────────────────────

echo "▸ Checking for hex color violations..."

HEX_VIOLATIONS=$(grep -rn 'bg-\[#\|text-\[#\|border-\[#\|color: .#[0-9a-fA-F]' "$SRC/components" "$SRC/features" --include='*.tsx' 2>/dev/null | grep -v "node_modules\|CLAUDE.md\|\.test\." | head -10 || true)
if [ -n "$HEX_VIOLATIONS" ]; then
  HEX_COUNT=$(grep -rn 'bg-\[#\|text-\[#\|border-\[#\|color: .#[0-9a-fA-F]' "$SRC/components" "$SRC/features" --include='*.tsx' 2>/dev/null | grep -v "node_modules\|CLAUDE.md\|\.test\." | wc -l | tr -d ' ')
  echo "  ⚠ $HEX_COUNT hex color violations:"
  echo "$HEX_VIOLATIONS" | sed 's/^/    /'
  [ "$HEX_COUNT" -gt 10 ] && echo "    ... ($HEX_COUNT total)"
  WARNINGS=$((WARNINGS + 1))
else
  echo "  ✓ No hex color violations"
fi

echo ""

# ── 5. Lab Deprecated Component Usage ────────────

echo "▸ Checking deprecated lab component usage..."

DEPRECATED_USAGE=0
for comp in tabs sheet scroll-area select label checkbox form card skeleton kbd table popover; do
  COUNT=$(grep -rc "from.*lab/components/ui/$comp'" "$SRC/features/lab/" --include='*.tsx' --include='*.ts' 2>/dev/null | grep -v ":0" | wc -l | tr -d ' ')
  if [ "$COUNT" -gt 0 ]; then
    echo "  → lab/$comp: $COUNT consumers remaining"
    DEPRECATED_USAGE=$((DEPRECATED_USAGE + COUNT))
  fi
done

if [ "$DEPRECATED_USAGE" -eq 0 ]; then
  echo "  ✓ All deprecated lab components fully migrated"
else
  echo "  ⚠ $DEPRECATED_USAGE deprecated lab component imports remain"
  WARNINGS=$((WARNINGS + 1))
fi

echo ""

# ── Summary ──────────────────────────────────────

echo "═══════════════════════════════════════════"
echo "  Results: $ERRORS errors, $WARNINGS warnings"
echo "═══════════════════════════════════════════"

exit $ERRORS
