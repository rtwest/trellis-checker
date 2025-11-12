# How to Use

A Figma plugin that automatically scans your designs to ensure you're using components from your design system libraries rather than creating custom or local components.

## What It Does

The Trellis Checker analyzes selected frames and components in your Figma file and:

✅ **Identifies library components** - Shows which components are properly sourced from linked libraries
❌ **Flags local components** - Finds custom components created in your file instead of using library components
⚠️ **Detects custom shapes & text** - Alerts you to raw shapes and text elements that should be wrapped in components
📊 **Calculates compliance score** - Gives you a percentage showing how well your design follows the system

## Installation

1. In Figma, go to **Plugins → Manage plugins**
2. Click **+ Create a new plugin**
3. Select **Import plugin from manifest...**
4. Navigate to this folder and select `manifest.json`
5. The plugin will appear in your Plugins menu

## Setup Requirements

Before using the plugin, you need to link your design system libraries:

1. Open your design file in Figma
2. Go to **Assets panel** (right sidebar)
3. Click the **library icon** (+ symbol)
4. Search for your design system files (e.g., "Foundations - Design Tokens System")
5. Click to link them to your file

**Note:** The plugin can only check components from libraries that are linked to your current file.

## How to Use

### Basic Scan

1. **Select a frame or component** in your design file
2. Open the Trellis Checker plugin (**Plugins → Trellis Checker**)
3. Click **"Scan Selection"**
4. The plugin will analyze all elements in your selection

### Understanding Results

The plugin shows:

- **Compliance Score (%)** - How many elements are from libraries vs. custom
- **Components Found** - Summary of which libraries and how many components from each
- **Tabbed Results:**
  - **📊 All** - All elements scanned (37 total in example)
  - **✓ Libraries** - Components properly from libraries (31 in example)
  - **⚠ Issues** - Problems to fix (6 issues in example)

### Issue Types

**✗ Local Components (Error)**
- Custom components created in your file
- **Fix:** Replace with a library component

**⚠ Custom Shapes (Warning)**
- Raw rectangles, ellipses, polygons not wrapped in components
- **Fix:** Create or use a component

**⚠ Custom Text (Warning)**
- Raw text elements not in a component
- **Fix:** Use a text component from your library

### Navigate to Issues

1. Click on any item in the results
2. The element will be **selected and highlighted** in your design file
3. Figma will **zoom and pan** to show it
4. You can immediately fix or replace it

## Understanding Compliance

**100% Compliant** means:
- All components are from linked libraries
- No custom shapes on the canvas
- No raw text elements

**Lower Scores** indicate:
- Local components that should be replaced
- Custom shapes that should be componentized
- Text elements that belong in text components

## Best Practices

1. **Link all libraries first** - The plugin can only detect components from linked libraries
2. **Scan regularly** - Run before design reviews or handoff to developers
3. **Fix issues promptly** - Replace local components with library versions
4. **Check custom shapes** - Consider whether raw shapes should be components in your system

## Troubleshooting

**"No library components found"**
- Make sure you've linked your design system library as an asset in your file
- Check that the library file is published and accessible

**Plugin is slow**
- Scanning large frames with many elements can take time
- Try scanning smaller frames first

**Can't navigate to an element**
- The element may be on a different page
- Try closing and reopening the plugin

## Component Detection

The plugin identifies library components by checking if they have a component key, which is automatically assigned by Figma when a component is published to a library.

- **Library component** - Has a key (from a published library file)
- **Local component** - No key (created in your current file)

## Tips

- Use the **Libraries tab** to see all components you're using - great for auditing!
- Use the **Issues tab** to focus only on what needs fixing
- Click items to quickly navigate - faster than manually hunting through layers
- Run scans on key pages before design handoff to developers

## Support

For issues or feature requests, contact your design system team.
