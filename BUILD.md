# PageNexus - Build Instructions

This document provides step-by-step instructions for building the PageNexus Firefox extension from source.

## System Requirements

- **Operating System**: Any (macOS, Linux, Windows)
- **Required Tools**: `zip` command-line tool (or any ZIP archiver)
  - macOS/Linux: Pre-installed
  - Windows: Use PowerShell `Compress-Archive` or 7-Zip

## Build Dependencies

**None required.** PageNexus is a pure JavaScript extension with no transpilation, bundling, or build tools needed. The source code is the final code.

## Source Files

The extension consists of the following files:

| File | Description |
|------|-------------|
| `manifest.json` | Extension manifest (Manifest V2) |
| `background.js` | Background script for browser action |
| `content_script.js` | Main content script with pagination logic |
| `Readability.js` | Mozilla's Readability library for article extraction |
| `text_limiter.js` | Text truncation utility for AI integration |
| `options.html` | Settings page UI |
| `options.js` | Settings page logic |
| `options.css` | Settings page styles |
| `reader.css` | Reader mode styles |
| `icons/` | Extension icons (16px, 48px, 128px) |

## Build Steps

### Option 1: Using the Build Script (Recommended)

```bash
# Make the script executable (first time only)
chmod +x build.sh

# Run the build script
./build.sh
```

The script will create `pagenexus-<version>.zip` in the current directory.

### Option 2: Manual Build

1. Open a terminal in the `PageNexus-Firefox` directory

2. Run the following command:

```bash
zip -r pagenexus-0.2.0.zip \
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
```

3. The ZIP file is ready for submission

### Option 3: Using GUI (Windows/macOS)

1. Select all required files (see "Source Files" table above)
2. Right-click and choose "Compress" or "Send to > Compressed Folder"
3. Rename the archive to `pagenexus-0.2.0.zip`

## Verification

To verify the build:

1. Open Firefox and navigate to `about:debugging#/runtime/this-firefox`
2. Click "Load Temporary Add-on..."
3. Select the generated ZIP file
4. The extension should load without errors

## Files Excluded from Build

The following files/directories are intentionally excluded from the package:

- `*.old` - Backup files
- `build-docs/` - Build documentation
- `*.zip` - Previous builds
- `BUILD.md` - This file
- `build.sh` - Build script

## Notes for Mozilla Add-ons Reviewers

- **No build process required**: This extension uses plain JavaScript with no transpilation or bundling
- **External library**: `Readability.js` is Mozilla's own library from [mozilla/readability](https://github.com/nicolevanderhoeven/readability)
- **To reproduce the build**: Simply ZIP the source files listed above, or run `./build.sh`
