## Sub-action: github-action-terraform-ci-handle-tests

### Description

This action calls any tests (not commands) that have been triggered. It is called by the top-level `cloudposse/github-action-terraform-ci` action and calls the `terraform-ci-bats`, `terraform-ci-ping`, `terraform-ci-readme`, and `terraform-ci-terratest` sub-actions.

