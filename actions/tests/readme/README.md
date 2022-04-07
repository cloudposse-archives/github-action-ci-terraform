## Sub-action: github-action-terraform-ci-readme

### Description

This action tests the `README.md` file in the target repo was built from the `README.yaml` file using the Cloud Posse standard `make readme` function. It is called by the `terraform-ci-handle-tests` sub-action, which itself is called by the top-level `cloudposse/github-action-terraform-ci` action.

