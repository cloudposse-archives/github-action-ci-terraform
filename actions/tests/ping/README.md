## Sub-action: github-action-terraform-ci-ping

### Description

This action runs a positive control test against the target repo, just to prove that the CI infrastructure is functioning properly. No files are changed, only the status of the test on the current commit. It is called by the `terraform-ci-handle-tests` sub-action, which itself is called by the top-level `cloudposse/github-action-terraform-ci` action.

