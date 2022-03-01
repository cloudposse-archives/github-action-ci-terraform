#!/bin/bash

make init
make readme/deps
make readme

set -x
output=$(git diff --name-only)
if [ -n "$output" ]; then
  echo "Changes detected. Pushing to the PR branch"
  git config --global user.name 'actions-bot'
  git config --global user.email '58130806+actions-bot@users.noreply.github.com'
  git add -A
  git commit -m "Updated README.md"
  git push
else
  echo "No changes detected"
fi
