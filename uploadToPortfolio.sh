#!/bin/bash

# Use strict mode: exit on error, undefined variable, and error in pipes
set -xueo pipefail

# Check for required tools: sips, jq, wrangler
for cmd in sips jq wrangler; do
    if ! command -v $cmd &> /dev/null; then
        echo "Error: $cmd is not installed. Please install $cmd."
        exit 1
    fi
done

# Constants
BUCKET="sylvester-stapfer-pics"
INDEX_FILE="index.json"
TEMP_DIR=$(mktemp -d)

# Ensure the temp directory is removed on exit
trap "rm -rf $TEMP_DIR" EXIT

# Check if correct number of arguments are passed
if [ "$#" -ne 2 ]; then
    echo "Usage: $0 <file> <title>"
    exit 1
fi

# Input variables
file="$1"
title="$2"

# Check if file exists
if [ ! -f "$file" ]; then
    echo "Error: File not found!"
    exit 1
fi

# Generate UUID for filename
uuid=$(uuidgen)

# Define file names for resized images
image_large="${TEMP_DIR}/${uuid}_large.jpg"
image_thumbnail="${TEMP_DIR}/${uuid}_thumbnail.jpg"

# Resize images using sips
echo "Resizing images..."
sips -Z 2500 "$file" --out "$image_large"
sips -Z 530 "$file" --out "$image_thumbnail"

# Upload images to R2 using wrangler
echo "Uploading images to Cloudflare R2..."
wrangler r2 object put "$BUCKET/${uuid}_large.jpg" --file "$image_large"
wrangler r2 object put "$BUCKET/${uuid}_thumbnail.jpg" --file "$image_thumbnail"

# Fetch the current index.json from R2
echo "Fetching current index.json from R2..."
temp_index="$TEMP_DIR/index.json"
wrangler r2 object get "$BUCKET/$INDEX_FILE" --file "$temp_index" 2> /dev/null || echo "[]" > "$temp_index"

# Append new entry to index.json
new_entry=$(jq -n --arg filename "$uuid" --arg title "$title" '{filename: $filename, title: $title}')
updated_index=$(jq ". += [$new_entry]" "$temp_index")

# Upload the updated index.json back to R2
echo "$updated_index" > "$temp_index"
echo "Updating index.json on Cloudflare R2..."
wrangler r2 object put "$BUCKET/$INDEX_FILE" --file "$temp_index"

echo "Done! Files uploaded and index.json updated."
