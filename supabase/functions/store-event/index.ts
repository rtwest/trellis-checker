// Supabase Edge Function to store analytics events directly from the plugin
// This allows the plugin to send events directly to Supabase instead of just Sentry

import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

serve(async (req) => {
  // Handle CORS preflight
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  try {
    const eventData = await req.json()

    // Validate required fields
    if (!eventData.event_type) {
      return new Response(
        JSON.stringify({ error: 'Missing required field: event_type' }),
        {
          status: 400,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        }
      )
    }

    // Initialize Supabase client
    const supabaseUrl = Deno.env.get('SUPABASE_URL') || ''
    const supabaseKey = Deno.env.get('SUPABASE_ANON_KEY') || ''
    const supabase = createClient(supabaseUrl, supabaseKey)

    // Insert event into database
    const { data, error } = await supabase
      .from('analytics_events')
      .insert([
        {
          event_type: eventData.event_type,
          user_id: eventData.user_id || null,
          figma_version: eventData.figma_version || null,
          plugin_version: eventData.plugin_version || null,
          elements_scanned: eventData.elements_scanned || 0,
          compliance_score: eventData.compliance_score || 0,
          library_components: eventData.library_components || 0,
          local_components: eventData.local_components || 0,
          custom_shapes: eventData.custom_shapes || 0,
          custom_text: eventData.custom_text || 0,
          metadata: eventData.metadata || {},
        },
      ])
      .select()

    if (error) {
      throw error
    }

    return new Response(
      JSON.stringify({ success: true, data }),
      {
        status: 200,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      }
    )
  } catch (error) {
    return new Response(
      JSON.stringify({ error: error.message }),
      {
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      }
    )
  }
})

