#!/bin/bash
#
# PageNexus Build Script
# Creates a ZIP package for Mozilla Add-ons submission
#

set -e

# Get version from manifest.json
VERSION=$(grep '"version"' manifest.json | sed 's/.*"version": *"\([^"]*\)".*/\1/')

if [ -z "$VERSION" ]; then
    echo "Error: Could not extract version from manifest.json"
    exit 1
fi

OUTPUT_FILE="pagenexus-${VERSION}.zip"

echo "Building PageNexus v${VERSION}..."

# Remove existing build if present
if [ -f "$OUTPUT_FILE" ]; then
    echo "Removing existing ${OUTPUT_FILE}..."
    rm "$OUTPUT_FILE"
fi

# Create ZIP with required files only
zip -r "$OUTPUT_FILE" \
    manifest.json \
    background.js \
    content_script.js \
    Readability.js \
    text_limiter.js \
    options.html \
    options.js \
    options.css \
    reader.css \
    icons/

echo ""
echo "✅ Build complete: ${OUTPUT_FILE}"
echo ""
echo "Contents:"
unzip -l "$OUTPUT_FILE"
