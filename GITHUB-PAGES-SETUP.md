# GitHub Pages Setup Guide

## Quick Setup (5 minutes)

### Step 1: Commit and Push Your Changes

```bash
# Add all files
git add .

# Commit
git commit -m "Add Supabase analytics dashboard"

# Push to GitHub
git push origin master
```

### Step 2: Enable GitHub Pages

1. Go to your GitHub repository on GitHub.com
2. Click **Settings** (top right)
3. Scroll down to **Pages** (left sidebar)
4. Under **Source**, select:
   - **Branch**: `master` (or `main` if that's your default branch)
   - **Folder**: `/docs`
5. Click **Save**

### Step 3: Access Your Dashboard

GitHub will provide you with a URL like:
```
https://[your-username].github.io/[repo-name]/
```

**Note:** It may take 1-2 minutes for the site to be available after enabling.

### Step 4: Configure Dashboard (If Needed)

The dashboard is already pre-configured with your Supabase credentials. If you need to update them:

1. Edit `docs/index.html`
2. Update the default values in the configuration inputs
3. Commit and push:
   ```bash
   git add docs/index.html
   git commit -m "Update dashboard config"
   git push
   ```

## Custom Domain (Optional)

If you want to use a custom domain:

1. In GitHub Pages settings, enter your custom domain
2. Add a `CNAME` file to the `docs` folder:
   ```
   your-domain.com
   ```
3. Configure DNS with your domain provider

## Troubleshooting

**Dashboard not loading?**
- Wait 1-2 minutes after enabling Pages
- Check Settings → Pages to see if there are any build errors
- Verify the URL is correct

**Changes not showing?**
- GitHub Pages can take a few minutes to update
- Make sure you pushed to the correct branch
- Check that files are in the `docs` folder

**404 Error?**
- Make sure the file is named `index.html` (lowercase)
- Verify the branch and folder settings in Pages settings

## Updating the Dashboard

1. Edit `docs/index.html`
2. Commit and push:
   ```bash
   git add docs/index.html
   git commit -m "Update dashboard"
   git push
   ```
3. Changes will be live in 1-2 minutes

## File Structure

```
trellis-checker/
├── docs/
│   └── index.html    ← Dashboard (served by GitHub Pages)
├── supabase/
│   └── dashboard/    ← Source files (for reference)
└── ...
```

The `docs/index.html` is what GitHub Pages serves. The `supabase/dashboard/` folder contains the source files.

