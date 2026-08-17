#!/usr/bin/env bash
# Reconnect an existing website_v2 clone after the repository history was rewritten
# to permanently remove image binaries. This script never force-pushes.
set -euo pipefail

if ! git rev-parse --is-inside-work-tree >/dev/null 2>&1; then
  echo 'Run this script from inside an existing website_v2 Git clone.' >&2
  exit 1
fi

if ! git remote get-url origin >/dev/null 2>&1; then
  echo 'The origin remote is missing. Add the repository remote before continuing.' >&2
  exit 1
fi

stamp="$(date -u +%Y%m%dT%H%M%SZ)"
backup_branch="recovery/before-image-history-cleanup-${stamp}"

# Preserve the local HEAD before moving main to the rewritten remote history.
git branch "${backup_branch}" HEAD

# Preserve all working-tree and index changes, including untracked non-ignored files.
if ! git diff --quiet || ! git diff --cached --quiet || [[ -n "$(git ls-files --others --exclude-standard)" ]]; then
  git stash push --include-untracked --message "recovery-before-image-history-cleanup-${stamp}"
  stashed=true
else
  stashed=false
fi

git fetch origin --prune
git switch main
git reset --hard origin/main

echo "Updated main to $(git rev-parse --short HEAD)."
echo "Your pre-update HEAD is preserved at ${backup_branch}."
if [[ "${stashed}" == true ]]; then
  echo 'Uncommitted changes were preserved in git stash. Review and apply them deliberately with: git stash list'
fi

echo 'The clone is now aligned to origin/main. New commits can be created and pushed normally.'
