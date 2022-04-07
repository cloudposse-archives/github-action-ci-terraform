## Sub-action: github-action-terraform-ci-handle-commands

### Description

This action calls any commands (not tests) that have been triggered. It is called by the top-level `cloudposse/github-action-terraform-ci` action and calls the `terraform-ci-rebuild-readme` and `terraform-ci-terraform-fmt` sub-actions.

