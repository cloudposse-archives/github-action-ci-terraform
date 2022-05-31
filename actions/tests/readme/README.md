## Sub-action: github-action-ci-terraform-readme

### Description

This action tests the `README.md` file in the target repo was built from the `README.yaml` file using the Cloud Posse standard `make readme` function. It is called by the `ci-terraform-handle-tests` sub-action, which itself is called by the top-level `cloudposse/github-action-ci-terraform` action.

