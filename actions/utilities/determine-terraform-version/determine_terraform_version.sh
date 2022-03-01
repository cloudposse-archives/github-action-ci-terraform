#!/bin/bash

# Some legacy support is on 0.11 branches and we determine the Terraform version based on the target branch name
VERSION=$(cut -d/ -f1 <<<${BASE_REF})
if [[ ${VERSION} != '0.11' ]]; then
  TF012=0.12.31
  TF013=$(terraform-0.13 version --json | jq -r .terraform_version)
  TF014=$(terraform-0.14 version --json | jq -r .terraform_version)
  TF015=$(terraform-0.15 version --json | jq -r .terraform_version)
  TF1=$(terraform-1 version --json | jq -r .terraform_version)
  # vert exits non-zero if any of the versions are not acceptable, so `|| [[ -n "$VERSION" ]]` for a real error check
  FULL_VERSION=$(vert -s "$(terraform-config-inspect --json . | jq -r '.required_core[]')" "$TF012" "$TF013" "$TF014" "$TF015" "$TF1" | head -1) || [[ -n "$VERSION" ]]
  VERSION=${FULL_VERSION:0:4}
  echo Full version to use is ${FULL_VERSION}, setting VERSION to ${VERSION}
fi

# Match lables like `terraform/0.12` or nothing (to prevent non-zero exit code).
# Use [0-9] because \d is not standard part of egrep
OVERRIDE_VERSION=$(grep -Eo '(terraform/[0-9]+\.[x0-9]+|)' <<<${LABELS} | cut -d/ -f2)
if [ -n "${OVERRIDE_VERSION}" ]; then
  VERSION=${OVERRIDE_VERSION}
  echo "Terraform ${VERSION} is required based on labels..."
else
  echo "Terraform ${VERSION} is required for ${BASE_REF}..."
fi

[[ $VERSION =~ ^1\. ]] && VERSION=1

# Last ditch effort, set a default
if [ -z "${VERSION}" ]; then
  VERSION=1
fi

# Set final path to Terraform binary and confirm its existence
PATH_TO_TERRAFORM="/usr/local/terraform/${VERSION}/bin"
if [ -x "${PATH_TO_TERRAFORM}/terraform" ]; then
  echo "${PATH_TO_TERRAFORM}" >> "$GITHUB_PATH"
else
  echo "Unable to locate executable for terraform ${VERSION}" >&2
  exit 1
fi

# Output VERSION for use in later steps
printf "%s=%s\n"  VERSION   "$VERSION"   >> "$GITHUB_ENV"
