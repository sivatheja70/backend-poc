#!/bin/bash

# Function to get all directories in the current working directory that contain a package.json
getDirectoriesWithPackageJson() {
    for dir in */; do
        if [[ -f "$dir/package.json" ]]; then
            echo "$dir"
        fi
    done
}

# Iterate over each directory and run npm install
runNpmInstallInDirectories() {
    directories=$(getDirectoriesWithPackageJson)
    for dir in $directories; do
        echo "Running npm install in $dir"
        (cd "$dir" && npm install)
        if [ $? -eq 0 ]; then
            echo "npm install completed in $dir"
        else
            echo "Failed to run npm install in $dir"
        fi
    done
}

runNpmInstallInDirectories