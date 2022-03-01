#!/bin/bash

# Debugging

/usr/bin/make BUILD_HARNESS_PATH=/build-harness PACKAGES_PREFER_HOST=true -f /build-harness/templates/Makefile.build-harness terraform/fmt

set -x
output=$(git diff --name-only)
if [ -n "$output" ]; then
  echo "Changes detected. Pushing to the PR branch"
  git config --global user.name 'actions-bot'
  git config --global user.email '58130806+actions-bot@users.noreply.github.com'
  git add -A
  git commit -m "Executed 'terraform fmt'"
  git push
else
  echo "No changes detected"
fi
