#!/bin/bash
# doc-first-track.sh — PostToolUse hook for Edit|Write
# Records when a blueprint doc is modified, so doc-first-guard.sh
# knows to allow subsequent code edits for that feature.

set -euo pipefail

INPUT=$(cat)
FILE_PATH=$(echo "$INPUT" | jq -r '.tool_input.file_path // empty')

if [[ -z "$FILE_PATH" ]]; then
  exit 0
fi

# Normalize to relative path
REL_PATH="${FILE_PATH#$CLAUDE_PROJECT_DIR/}"

# Only track blueprint doc edits
if [[ "$REL_PATH" != apps/web/src/features/blueprint/docs/* ]]; then
  exit 0
fi

# Extract the module name from blueprint path
# Pattern: apps/web/src/features/blueprint/docs/<module>/<tab>.md
MODULE=$(echo "$REL_PATH" | sed -n 's|apps/web/src/features/blueprint/docs/\([^/]*\)/.*|\1|p')
if [[ -z "$MODULE" ]]; then
  exit 0
fi

SESSION_FILE="/tmp/claude-docfirst-${CLAUDE_SESSION_ID:-unknown}"

# Record the module and also map to feature names
echo "$MODULE" >> "$SESSION_FILE"

# Map blueprint module → feature directory names
# factor/ blueprint covers: factor/, lab/, library/
case "$MODULE" in
  factor)
    # Check which specific doc was edited to unlock the right feature
    DOC_NAME=$(basename "$REL_PATH" .md)
    case "$DOC_NAME" in
      lab)      echo "lab" >> "$SESSION_FILE" ;;
      library)  echo "library" >> "$SESSION_FILE" ;;
      *)        echo "factor" >> "$SESSION_FILE" ;;
    esac
    ;;
esac

# Deduplicate
if [[ -f "$SESSION_FILE" ]]; then
  sort -u "$SESSION_FILE" -o "$SESSION_FILE"
fi

exit 0
