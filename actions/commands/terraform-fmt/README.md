## Sub-action: github-action-ci-terraform-terraform-fmt

### Description

This action ensures that all Terraform files in the target repo are properly formatted. It is called by the `ci-terraform-handle-commands` sub-action, which is itself called by the top-level `cloudposse/github-action-ci-terraform` action, and it calls the `cloudposse/github-action-auto-format` action with an input value of `script-names: terraform_format`.

