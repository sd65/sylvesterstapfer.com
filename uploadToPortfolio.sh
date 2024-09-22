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
PICS_DIR="p"

# Ensure the temp directory is removed on exit
trap "rm -rf $TEMP_DIR" EXIT

# Function to remove leading numbers from filenames
strip_leading_numbers() {
    local filename="$1"
    echo "$filename" | sed 's/^[0-9]*_//'
}

# Upload subcommand
upload() {
    # Ensure at least one file is passed
    if [ "$#" -lt 1 ]; then
        echo "Usage: $0 upload <file1> [file2] [file3] ..."
        exit 1
    fi

    # Natural sort the files (version sort, which handles human-like sorting)
    sorted_files=$(printf '%s\n' "$@" | sort -V)
    echo "Sorted files: ${sorted_files[@]}"

    # Initialize an array to store new entries
    new_entries=()

    # Process each file
    while IFS= read -r file; do
        # Check if file exists
        if [ ! -f "$file" ]; then
            echo "Error: File '$file' not found!"
            exit 1
        fi

        # Generate UUID for filename and get base filename for title
        uuid=$(uuidgen)
        base_filename=$(basename "$file")
        title="${base_filename%.*}"

        # Remove leading numbers from the filename to create the title
        title=$(strip_leading_numbers "$title")

        # Define file names for images
        image_large="${TEMP_DIR}/${uuid}_large.jpg"
        image_thumbnail="${TEMP_DIR}/${uuid}_thumbnail.jpg"

        # No resize for the large image
        echo "Copying the large image..."
        cp "$file" "$image_large"

        # Resize the thumbnail image using sips
        echo "Resizing the thumbnail image..."
        sips -Z 530 "$file" --out "$image_thumbnail"

        # Upload images to R2 using wrangler
        echo "Uploading images to Cloudflare R2..."
        wrangler r2 object put "$BUCKET/$PICS_DIR/${uuid}.jpg" --file "$image_large"
        wrangler r2 object put "$BUCKET/$PICS_DIR/${uuid}_thumbnail.jpg" --file "$image_thumbnail"

        # Append new entry to the list of new entries
        new_entry=$(jq -n --arg filename "$uuid" --arg title "$title" '{filename: $filename, title: $title}')
        new_entries+=("$new_entry")
    done <<< "$sorted_files"

    # Fetch the current index.json from R2
    echo "Fetching current index.json from R2..."
    temp_index="$TEMP_DIR/index.json"
    wrangler r2 object get "$BUCKET/$INDEX_FILE" --file "$temp_index" 2> /dev/null || echo "[]" > "$temp_index"


    # Update the index.json only once
    if [ "${#new_entries[@]}" -gt 0 ]; then
        echo "Updating index.json..."

        # Merge new entries into the index
        updated_index=$(jq ". += [${new_entries[*]}]" "$temp_index")

        # Save the updated index to the temp file
        echo "$updated_index" > "$temp_index"

        # Upload the updated index.json back to R2
        wrangler r2 object put "$BUCKET/$INDEX_FILE" --file "$temp_index"
    fi

    echo "Done! Files uploaded and index.json updated."
}

# Clear subcommand: clear all files in the bucket without removing the bucket itself
clear() {
    echo "Clearing all files from the bucket..."
    
    # Get the list of all objects in the bucket and delete them
    wrangler r2 object get "$BUCKET/p/" -p | jq -r '.result[].key' | while read -r object; do
        wrangler r2 object delete "$BUCKET/$object"
    done
    wrangler r2 object delete "$BUCKET/$INDEX_FILE"
    
    echo "All files cleared from the bucket."
}

# Upload index subcommand: upload the index.json file from /tmp
editIndex() {
    echo "Downloading index.json to /tmp..."
    wrangler r2 object get "$BUCKET/$INDEX_FILE" --file "/tmp/$INDEX_FILE" 2> /dev/null || echo "[]" > "/tmp/$INDEX_FILE"
    echo "Index file saved to /tmp/$INDEX_FILE"
    vi "/tmp/$INDEX_FILE"
    echo "Uploading index.json from /tmp..."
    wrangler r2 object put "$BUCKET/$INDEX_FILE" --file "/tmp/$INDEX_FILE"
    echo "Index file uploaded to Cloudflare R2."
}

# Check if at least one subcommand is provided
if [ "$#" -lt 1 ]; then
    echo "Usage: $0 <subcommand> [arguments]"
    echo "Subcommands:"
    echo "  upload <file1> [file2] [...] - Uploads images and updates index"
    echo "  clear - Clears the bucket's pics and index.json"
    echo "  editIndex - Edits the index.json from /tmp"
    exit 1
fi

# Parse subcommand
case "$1" in
    upload)
        shift
        upload "$@"
        ;;
    clear)
        clear
        ;;
    editIndex)
        editIndex
        ;;
    *)
        echo "Unknown subcommand: $1"
        exit 1
        ;;
esac