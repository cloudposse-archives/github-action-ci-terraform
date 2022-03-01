#!/bin/bash

# Initialize the terratest go project
make -C test/src clean init
rm -rf examples/*/.terraform examples/*/.terraform.lock.hcl

# Test `examples/complete` with terratest
make -C test/src
