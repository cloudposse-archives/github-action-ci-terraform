## Sub-action: github-action-terraform-ci-metadata

### Description

This action extracts data from the triggering event, whether `pull_request` or `chatops`, which allows the top-level `cloudposse/terraform-ci` action to determine which commands and tests to execute. It is called by the top-level `cloudposse/github-action-terraform-ci` action.

