#!/bin/bash

# Script to package the Figma plugin for distribution
# Creates a ZIP file with only the essential plugin files

PLUGIN_NAME="trellis-checker-plugin"
DIST_DIR="dist"
ZIP_NAME="trellis-checker-plugin.zip"

echo "📦 Packaging Trellis Checker plugin..."

# Create dist directory
mkdir -p "$DIST_DIR/$PLUGIN_NAME"

# Copy essential plugin files
echo "Copying plugin files..."
cp manifest.json "$DIST_DIR/$PLUGIN_NAME/"
cp code.js "$DIST_DIR/$PLUGIN_NAME/"
cp ui.html "$DIST_DIR/$PLUGIN_NAME/"

# Copy install/use instructions
cp README-INSTALL.md "$DIST_DIR/$PLUGIN_NAME/README.md"

# Create ZIP file
echo "Creating ZIP archive..."
cd "$DIST_DIR"
zip -r "$ZIP_NAME" "$PLUGIN_NAME" -q
cd ..

# Clean up temp directory
rm -rf "$DIST_DIR/$PLUGIN_NAME"

echo "✅ Plugin packaged successfully!"
echo "📁 Distribution file: $DIST_DIR/$ZIP_NAME"
echo ""
echo "Share this ZIP file with your team. They can:"
echo "1. Extract the ZIP"
echo "2. Open Figma Desktop App"
echo "3. Go to Plugins → Development → Import plugin from manifest..."
echo "4. Select the manifest.json file from the extracted folder"

