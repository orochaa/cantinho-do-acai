#!/bin/bash

# Function to convert a string to kebab-case
to_kebab_case() {
    local input="$1"
    local kebab_string

    # Convert to lowercase
    kebab_string=$(echo "$input" | tr '[:upper:]' '[:lower:]')
    # Replace spaces and underscores with hyphens
    kebab_string=$(echo "$kebab_string" | sed -E 's/[_ ]+/-/g')
    # Remove any non-alphanumeric characters except hyphens
    kebab_string=$(echo "$kebab_string" | sed -E 's/[^a-z0-9-]+//g')
    # Remove duplicate hyphens
    kebab_string=$(echo "$kebab_string" | sed -E 's/--+/-/g')
    # Remove leading/trailing hyphens
    kebab_string=$(echo "$kebab_string" | sed -E 's/^-//g' | sed -E 's/-$//g')
    
    echo "$kebab_string"
}

# Directory to process
PUBLIC_DIR="public"

echo "Processing directory: $PUBLIC_DIR"

# Find all files recursively
find "$PUBLIC_DIR" -type f | while read -r filepath; do
    # Get directory, base name without extension, and extension
    dir=$(dirname "$filepath")
    filename=$(basename "$filepath")
    
    # Extract extension (if any)
    extension=""
    base_name="$filename"
    if [[ "$filename" == *.* ]]; then
        extension=".${filename##*.}"
        base_name="${filename%.*}"
    fi

    kebab_base_name=$(to_kebab_case "$base_name")

    if [[ "$base_name" != "$kebab_base_name" ]]; then
        new_filename="${kebab_base_name}${extension}"
        new_filepath="${dir}/${new_filename}"

        if [[ -e "$new_filepath" && "$filepath" != "$new_filepath" ]]; then
            echo "Warning: Cannot rename '$filepath' to '$new_filepath' because '$new_filepath' already exists."
        else
            echo "Renaming '$filepath' to '$new_filepath'"
            mv -n "$filepath" "$new_filepath" # -n prevents overwriting existing files
        fi
    fi
done

echo "Kebab-case renaming complete."
