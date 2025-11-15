-- Supabase Database Schema for Trellis Checker Analytics
-- Run this in your Supabase SQL Editor

-- Create analytics events table
CREATE TABLE IF NOT EXISTS analytics_events (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  event_type TEXT NOT NULL,
  event_name TEXT NOT NULL,
  user_id TEXT,
  figma_version TEXT,
  plugin_version TEXT,
  elements_scanned INTEGER DEFAULT 0,
  compliance_score INTEGER DEFAULT 0,
  library_components INTEGER DEFAULT 0,
  local_components INTEGER DEFAULT 0,
  custom_shapes INTEGER DEFAULT 0,
  custom_text INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  metadata JSONB
);

-- Create index for faster queries
CREATE INDEX IF NOT EXISTS idx_analytics_events_type ON analytics_events(event_type);
CREATE INDEX IF NOT EXISTS idx_analytics_events_created_at ON analytics_events(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_analytics_events_user_id ON analytics_events(user_id);

-- Enable Row Level Security (RLS)
ALTER TABLE analytics_events ENABLE ROW LEVEL SECURITY;

-- Create policy to allow anonymous inserts (for plugin to send events)
CREATE POLICY "Allow anonymous inserts" ON analytics_events
  FOR INSERT
  TO anon
  WITH CHECK (true);

-- Create policy to allow authenticated reads (for dashboard)
CREATE POLICY "Allow authenticated reads" ON analytics_events
  FOR SELECT
  TO authenticated
  USING (true);

-- Optional: Create a view for scan events summary
CREATE OR REPLACE VIEW scan_events_summary AS
SELECT
  DATE(created_at) as scan_date,
  COUNT(*) as total_scans,
  AVG(compliance_score) as avg_compliance,
  SUM(elements_scanned) as total_elements,
  SUM(library_components) as total_library_components,
  SUM(local_components) as total_local_components,
  SUM(custom_shapes) as total_custom_shapes,
  SUM(custom_text) as total_custom_text
FROM analytics_events
WHERE event_type = 'scan_executed'
GROUP BY DATE(created_at)
ORDER BY scan_date DESC;

-- Grant access to the view
GRANT SELECT ON scan_events_summary TO authenticated;
GRANT SELECT ON scan_events_summary TO anon;

