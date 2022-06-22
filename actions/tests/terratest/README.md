## Sub-action: github-action-ci-terraform-terratest

### Description

This action sets up the environment, including the environment variables, needed to run the `terratest` functionality on the target repo. It is called by the `ci-terraform-handle-tests` sub-action, which itself is called by the top-level `cloudposse/github-action-ci-terraform` action, and it calls the `ci-terraform-determine-terraform-version` and `ci-terraform-execute-terratest` sub-actions.

