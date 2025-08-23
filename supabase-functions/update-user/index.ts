import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  try {
    // Create a Supabase client with the Auth context of the logged in user.
    const supabaseClient = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? '',
      {
        auth: {
          autoRefreshToken: false,
          persistSession: false
        }
      }
    )

    const { userId, userData } = await req.json()
    const { name, username, email, password, role, category } = userData

    // Validate required fields
    if (!userId) {
      return new Response(
        JSON.stringify({ error: 'Missing userId' }),
        { 
          status: 400, 
          headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
        }
      )
    }

    // Update auth user if email or password changed
    if (email || password) {
      const authUpdates: any = {}
      if (email) authUpdates.email = email
      if (password) authUpdates.password = password

      const { error: authError } = await supabaseClient.auth.admin.updateUserById(
        userId,
        authUpdates
      )

      if (authError) {
        console.error('Auth update error:', authError)
        return new Response(
          JSON.stringify({ error: authError.message }),
          { 
            status: 400, 
            headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
          }
        )
      }
    }

    // Prepare profile updates
    const profileUpdates: any = {}
    if (name) profileUpdates.name = name
    if (username) profileUpdates.username = username
    if (role) profileUpdates.role = role
    if (category !== undefined) profileUpdates.category = category // Allow setting to null/empty

    // Update profile
    const { data: profile, error: profileError } = await supabaseClient
      .from('profiles')
      .update(profileUpdates)
      .eq('id', userId)
      .select()
      .single()

    if (profileError) {
      console.error('Profile update error:', profileError)
      return new Response(
        JSON.stringify({ error: profileError.message }),
        { 
          status: 400, 
          headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
        }
      )
    }

    return new Response(
      JSON.stringify({ 
        message: 'User updated successfully',
        user: profile
      }),
      { 
        status: 200, 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
      }
    )

  } catch (error) {
    console.error('Unexpected error:', error)
    return new Response(
      JSON.stringify({ error: 'Internal server error' }),
      { 
        status: 500, 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
      }
    )
  }
})