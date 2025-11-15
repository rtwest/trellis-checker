# Supabase Setup Guide for Trellis Checker Analytics

This guide will help you set up Supabase as your backend and hosting solution for the Trellis Checker analytics dashboard.

## Overview

Supabase provides:
- ✅ **PostgreSQL Database** - Store analytics events
- ✅ **Edge Functions** - Serverless functions for API calls
- ✅ **Hosting** - Free static hosting for your dashboard
- ✅ **Real-time** - Optional real-time subscriptions
- ✅ **Authentication** - Optional user authentication

## Step 1: Create Supabase Project

1. Go to [supabase.com](https://supabase.com) and sign up/login
2. Click **"New Project"**
3. Fill in:
   - **Name**: `trellis-checker-analytics` (or your choice)
   - **Database Password**: Create a strong password (save it!)
   - **Region**: Choose closest to you
4. Click **"Create new project"**
5. Wait 2-3 minutes for setup to complete

## Step 2: Set Up Database Schema

1. In your Supabase dashboard, go to **SQL Editor**
2. Click **"New query"**
3. Copy and paste the contents of `supabase/schema.sql`
4. Click **"Run"** (or press Cmd/Ctrl + Enter)
5. Verify tables were created:
   - Go to **Table Editor**
   - You should see `analytics_events` table

## Step 3: Get Your API Credentials

1. Go to **Settings** → **API**
2. Copy these values:
   - **Project URL** (e.g., `https://xxxxx.supabase.co`)
   - **anon/public key** (starts with `eyJhbGc...`)

You'll need these for:
- Plugin configuration (to send events)
- Dashboard configuration (to view analytics)

## Step 4: Deploy Edge Functions (Optional)

Edge Functions are useful if you want to:
- Process events server-side
- Add authentication
- Custom API endpoints

### Deploy Functions:

1. **Install Supabase CLI:**
   ```bash
   npm install -g supabase
   ```

2. **Login to Supabase:**
   ```bash
   supabase login
   ```

3. **Link your project:**
   ```bash
   supabase link --project-ref your-project-ref
   ```
   (Find project ref in Settings → General)

4. **Deploy functions:**
   ```bash
   cd supabase/functions
   supabase functions deploy store-event
   supabase functions deploy get-analytics
   ```

**Note:** Edge Functions are optional. You can use Supabase client directly from the plugin and dashboard.

## Step 5: Configure Plugin to Send Events to Supabase

### Option A: Send to Supabase Only (Recommended)

Update your plugin to send events directly to Supabase.

1. Add Supabase URL to `manifest.json`:
   ```json
   "networkAccess": {
     "allowedDomains": [
       "https://*.supabase.co",
       ...
     ]
   }
   ```

2. Update `ui.html` to include Supabase client and send events:
   - Add Supabase JS client script
   - Modify the `track-event` handler to send to Supabase

See `SUPABASE-PLUGIN-INTEGRATION.md` for detailed code changes.

### Option B: Use Edge Functions (More Secure)

If you want to keep credentials server-side, use the `store-event` Edge Function instead of direct client inserts.

## Step 6: Deploy Dashboard

### Option A: Supabase Hosting (Recommended)

1. In Supabase dashboard, go to **Storage**
2. Create a new bucket called `dashboard` (make it public)
3. Upload `supabase/dashboard/index.html` to the bucket
4. Access your dashboard at: `https://[project-ref].supabase.co/storage/v1/object/public/dashboard/index.html`

### Option B: Static Hosting

You can also host the dashboard on:
- **Vercel**: `vercel deploy supabase/dashboard`
- **Netlify**: Drag & drop `supabase/dashboard` folder
- **GitHub Pages**: Push to repo and enable Pages

## Step 7: Configure Dashboard

1. Open your deployed dashboard
2. Enter your Supabase credentials:
   - **Supabase URL**: From Step 3
   - **Supabase Anon Key**: From Step 3
3. Click **"Load Analytics Data"**
4. Your analytics should appear!

## Database Schema

### `analytics_events` Table

Stores all analytics events from the plugin:

- `id` - UUID (primary key)
- `event_type` - 'scan_executed' or 'plugin_installed'
- `event_name` - Event name
- `user_id` - Optional user identifier
- `elements_scanned` - Number of elements scanned
- `compliance_score` - Compliance percentage (0-100)
- `library_components` - Count of library components
- `local_components` - Count of local components
- `custom_shapes` - Count of custom shapes
- `custom_text` - Count of custom text
- `created_at` - Timestamp
- `metadata` - JSONB for additional data

### `scan_events_summary` View

Pre-aggregated daily summary of scan events for faster queries.

## Row Level Security (RLS)

The schema includes RLS policies:
- **Anonymous inserts**: Plugin can send events without authentication
- **Authenticated reads**: Dashboard users can read events (if you add auth)

To modify RLS:
1. Go to **Authentication** → **Policies**
2. Edit policies for `analytics_events` table

## Testing

1. **Test database insert:**
   - Run a scan in your plugin
   - Check Supabase **Table Editor** → `analytics_events`
   - You should see a new row

2. **Test dashboard:**
   - Open dashboard
   - Enter credentials
   - Data should load

## Troubleshooting

**"No events found"**
- Check that plugin is sending events to Supabase
- Verify RLS policies allow inserts
- Check browser console for errors

**"Failed to load data"**
- Verify Supabase URL and key are correct
- Check that RLS allows reads
- Verify table exists in database

**CORS errors**
- Make sure Supabase URL is in `manifest.json` allowedDomains
- Check that you're using the correct Supabase project

**Edge Functions not working**
- Verify functions are deployed: `supabase functions list`
- Check function logs in Supabase dashboard
- Verify environment variables are set

## Next Steps

- Add authentication to dashboard
- Set up real-time subscriptions for live updates
- Add more analytics queries
- Export data to CSV
- Set up alerts for low compliance scores

## Cost

Supabase free tier includes:
- 500 MB database
- 2 GB bandwidth
- 2 million Edge Function invocations/month
- Unlimited API requests

This should be more than enough for analytics! Upgrade if you need more.

