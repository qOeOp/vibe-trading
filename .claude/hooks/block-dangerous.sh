#!/bin/bash
# block-dangerous.sh — PreToolUse hook for Bash
# Blocks destructive commands that could cause data loss.

set -euo pipefail

INPUT=$(cat)
COMMAND=$(echo "$INPUT" | jq -r '.tool_input.command // empty')

if [[ -z "$COMMAND" ]]; then
  exit 0
fi

# Patterns to block
BLOCKED=""

if echo "$COMMAND" | grep -qiE 'rm\s+-rf\s+(/|~|\$HOME|\.\.)'; then
  BLOCKED="rm -rf on dangerous paths (/, ~, ..)"
fi

if echo "$COMMAND" | grep -qiE 'git\s+push\s+.*--force'; then
  BLOCKED="git push --force (use --force-with-lease instead)"
fi

if echo "$COMMAND" | grep -qiE 'git\s+reset\s+--hard\s+origin'; then
  BLOCKED="git reset --hard origin (will discard all local commits)"
fi

if echo "$COMMAND" | grep -qiE 'DROP\s+(TABLE|DATABASE)'; then
  BLOCKED="DROP TABLE/DATABASE"
fi

if echo "$COMMAND" | grep -qiE 'git\s+clean\s+-fd'; then
  BLOCKED="git clean -fd (will permanently delete untracked files)"
fi

if [[ -n "$BLOCKED" ]]; then
  echo "Blocked dangerous command: $BLOCKED" >&2
  exit 2
fi

exit 0
