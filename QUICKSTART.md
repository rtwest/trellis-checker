# Quick Start: Trellis Design System Checker

Get up and running with the Trellis Checker in 2 minutes.

## Step 1: Link Your Design System Library

Before scanning, make sure your design system library is linked:

1. Open your Figma design file
2. In the **right sidebar**, click **Assets** (or press **Shift+A**)
3. Click the **library icon** (+ symbol at the top)
4. Search for **"Foundations - Design Tokens System"** (or your library name)
5. Click it to link it to your file

✅ Now you're ready to scan!

## Step 2: Select What to Scan

1. **Click on a frame** in your design
2. Or **select multiple frames** by holding Shift and clicking

## Step 3: Open the Plugin

1. Go to **Plugins → Trellis Checker**
2. Click **"Scan Selection"**
3. Wait for the scan to complete (a few seconds for most designs)

## Step 4: Review Results

You'll see:

```
Compliance Score: 84%
Components Found: External Library (unverified): 31 components
```

### Three Tabs to Explore:

📊 **All** - Everything that was scanned
✓ **Libraries** - Only the good stuff (library components)
⚠️ **Issues** - Only problems you need to fix

## Step 5: Fix Issues

1. Click on any **issue item** to jump to it in Figma
2. Replace **local components** with library versions
3. Remove or wrap **custom shapes** in components
4. Convert **custom text** into text components

## That's It!

Scan → Review → Fix → Done!

### Quick Tips

- **Quick audit**: Use the **Libraries tab** to see what components you're using
- **Focus on problems**: Use the **Issues tab** to see only what needs fixing
- **Navigate fast**: Click items to jump directly to them - no more hunting through layers
- **Run before handoff**: Scan before handing designs to developers

## Common Questions

**Q: "No library components found"**
A: Make sure you've linked the library in Assets (Step 1)

**Q: Can I scan the whole page?**
A: Yes! Select a top-level frame and scan - it will check everything inside

**Q: What if I have multiple design system libraries?**
A: Link all of them in Assets, then scan - the plugin will detect all of them

---

Need more details? Check the [full README](./README.md)
