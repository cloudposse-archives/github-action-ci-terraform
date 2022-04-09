## Sub-action: github-action-terraform-ci-terraform-fmt

### Description

This action ensures that all Terraform files in the target repo are properly formatted. It is called by the `terraform-ci-handle-commands` sub-action, which is itself called by the top-level `cloudposse/github-action-terraform-ci` action, and it calls the `cloudposse/github-action-auto-format` action with an input value of `script-names: terraform_format`.

