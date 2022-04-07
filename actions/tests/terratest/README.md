## Sub-action: github-action-terraform-ci-terratest

### Description

This action sets up the environment, including the environment variables, needed to run the `terratest` functionality on the target repo. It is called by the `terraform-ci-handle-tests` sub-action, which itself is called by the top-level `cloudposse/github-action-terraform-ci` action, and it calls the `terraform-ci-determine-terraform-version` and `terraform-ci-execute-terratest` sub-actions.

