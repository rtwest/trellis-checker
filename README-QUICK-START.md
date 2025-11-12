# Quick Start

A Figma plugin that automatically scans your designs to ensure you're using components from your design system libraries.

## Installation

1. **Open Figma Desktop App** (plugins require the desktop app, not the browser version)

2. **Import the Plugin**
   - Go to **Plugins** in the top menu
   - Select **Development** → **Import plugin from manifest...**
   - Navigate to this folder and select `manifest.json`
   - Click **Open**

3. **Plugin is Ready!**
   - Access it via **Plugins** → **Development** → **Trellis Design System Checker**
   - After first use, it will appear in **Plugins** → **Trellis Design System Checker**

## How to Use

### Step 1: Link Your Design System Library

Before scanning, make sure your design system library is linked:

1. Open your Figma design file
2. In the **right sidebar**, click **Assets** (or press **Shift+A**)
3. Click the **library icon** (+ symbol at the top)
4. Search for your design system file (e.g., "Foundations - Design Tokens System")
5. Click it to link it to your file

### Step 2: Scan Your Design

1. **Select a frame or component** in your design
2. Open the Trellis Checker plugin (**Plugins → Trellis Design System Checker**)
3. Click **"Scan Selection"**
4. Wait for the scan to complete

### Step 3: Review Results

The plugin shows:

- **Compliance Score (%)** - How many elements are from libraries vs. custom
- **Components Found** - Summary of which libraries and how many components
- **Three Tabs:**
  - **📊 All** - All elements scanned
  - **✓ Libraries** - Components properly from libraries
  - **⚠ Issues** - Problems to fix

### Step 4: Fix Issues

1. Click on any **issue item** to jump to it in Figma
2. Replace **local components** with library versions
3. Remove or wrap **custom shapes** in components
4. Convert **custom text** into text components

## Understanding the Results

**✓ Library Components** - Components properly sourced from linked libraries (good!)

**✗ Local Components** - Custom components created in your file (should be replaced)

**⚠ Custom Shapes** - Raw rectangles, ellipses, polygons not wrapped in components

**⚠ Custom Text** - Raw text elements not in a component

## Tips

- **Link all libraries first** - The plugin can only detect components from linked libraries
- **Scan regularly** - Run before design reviews or handoff to developers
- **Click to navigate** - Click any item in the results to jump directly to it in Figma
- **Use the Issues tab** - Focus only on what needs fixing

## Troubleshooting

**"No library components found"**
- Make sure you've linked your design system library in Assets
- Check that the library file is published and accessible

**"Please select a frame or component to scan"**
- Select a frame or component in your design before clicking Scan

**Plugin not showing up?**
- Make sure you're using Figma Desktop App (not browser)
- Restart Figma after importing
- Check that all files (manifest.json, code.js, ui.html) are in the same folder

## Need Help?

Contact your design system team for support.

