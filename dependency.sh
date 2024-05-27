#!/bin/bash

# Find directories containing a package.json file but exclude the root directory
directories=$(find . -mindepth 2 -name "package.json" -exec dirname {} \;)

# Iterate over each directory and run npm install
for dir in $directories; do
    echo "Running npm install in $dir"
    (cd "$dir" && npm install)
    if [ $? -ne 0 ]; then
        echo "npm install failed in $dir"
        exit 1
    fi
done
