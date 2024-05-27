#!/bin/bash

# List of directories where npm install should be run
directories=("login" "property" "layers/nodejs" "dependencies/nodejs")

# Iterate over each directory and run npm install
for dir in "${directories[@]}"; do
    echo "Running npm install in $dir"
    if [ -d "$dir" ]; then
        (npm i && cd "$dir" && npm install)
        if [ $? -ne 0 ]; then
            echo "npm install failed in $dir"
            exit 1
        fi
    else
        echo "Directory $dir does not exist"
    fi
done