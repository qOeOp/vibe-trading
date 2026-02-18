#!/bin/bash
# doc-first-guard.sh — PreToolUse hook for Edit|Write
# Blocks edits to features/ code unless the corresponding blueprint doc
# has been touched in this session.
#
# Session tracking: uses a temp file keyed by CLAUDE_SESSION_ID.
# Blueprint doc edits are recorded by the companion post-hook (doc-first-track.sh).

set -euo pipefail

INPUT=$(cat)
FILE_PATH=$(echo "$INPUT" | jq -r '.tool_input.file_path // empty')

# Only guard features/ code files (not blueprint docs themselves)
if [[ -z "$FILE_PATH" ]]; then
  exit 0
fi

# Normalize to relative path
REL_PATH="${FILE_PATH#$CLAUDE_PROJECT_DIR/}"

# Only care about features/ code (not blueprint docs, not other dirs)
if [[ "$REL_PATH" != apps/web/src/features/* ]]; then
  exit 0
fi

# Don't block edits to blueprint docs themselves — that's what we WANT
if [[ "$REL_PATH" == apps/web/src/features/blueprint/* ]]; then
  exit 0
fi

# Extract feature name: apps/web/src/features/<name>/...
FEATURE=$(echo "$REL_PATH" | sed -n 's|apps/web/src/features/\([^/]*\)/.*|\1|p')
if [[ -z "$FEATURE" ]]; then
  exit 0
fi

# Session tracking file
SESSION_FILE="/tmp/claude-docfirst-${CLAUDE_SESSION_ID:-unknown}"

# Check if this feature's blueprint doc has been touched in this session
if [[ -f "$SESSION_FILE" ]] && grep -q "^${FEATURE}$" "$SESSION_FILE" 2>/dev/null; then
  # Blueprint doc already touched for this feature — allow
  exit 0
fi

# Check if blueprint doc exists for this feature
# Map feature names to blueprint doc paths
BLUEPRINT_DIR="apps/web/src/features/blueprint/docs"
case "$FEATURE" in
  lab|library)
    DOC_PATH="${BLUEPRINT_DIR}/factor/${FEATURE}.md"
    ;;
  *)
    DOC_PATH="${BLUEPRINT_DIR}/${FEATURE}"
    ;;
esac

# Build the deny message
if [[ -d "$CLAUDE_PROJECT_DIR/$DOC_PATH" ]] || [[ -f "$CLAUDE_PROJECT_DIR/$DOC_PATH" ]]; then
  REASON="Doc-First 违规：你正在修改 features/${FEATURE}/ 的代码，但本次会话还没有更新对应的 blueprint 文档（${DOC_PATH}）。请先更新 blueprint doc，描述你要做的改动，然后再修改代码。"
else
  REASON="Doc-First 违规：你正在修改 features/${FEATURE}/ 的代码，但该 feature 还没有 blueprint 文档。请先在 ${BLUEPRINT_DIR}/${FEATURE}/ 下创建对应的 .md 文档，描述该功能的设计，然后再写代码。"
fi

# Output structured deny
cat <<EOF
{
  "hookSpecificOutput": {
    "hookEventName": "PreToolUse",
    "permissionDecision": "deny",
    "permissionDecisionReason": "$REASON"
  }
}
EOF
exit 0
