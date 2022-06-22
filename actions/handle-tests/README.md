## Sub-action: github-action-ci-terraform-handle-tests

### Description

This action calls any tests (not commands) that have been triggered. It is called by the top-level `cloudposse/github-action-ci-terraform` action and calls the `ci-terraform-bats`, `ci-terraform-ping`, `ci-terraform-readme`, and `ci-terraform-terratest` sub-actions.

