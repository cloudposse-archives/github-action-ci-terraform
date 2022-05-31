## Sub-action: github-action-ci-terraform-rebuild-readme

### Description

This action rebuilds the `README.md` of the target repo. It is called by the `ci-terraform-handle-commands` sub-action, which is itself called by the top-level `cloudposse/github-action-ci-terraform` action, and it calls the `cloudposse/github-action-atuo-format` action with an input of `script-names: readme`.

