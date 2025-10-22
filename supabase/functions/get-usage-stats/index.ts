import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.49.4'
import { corsHeaders } from '../_shared/cors.ts'

Deno.serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  try {
    const supabaseAdmin = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? '',
      {
        auth: {
          autoRefreshToken: false,
          persistSession: false
        }
      }
    )

    // Get ALL users with pagination
    let allUsers = []
    let page = 1
    let hasMore = true

    while (hasMore) {
      const { data, error } = await supabaseAdmin.auth.admin.listUsers({
        page: page,
        perPage: 1000
      })
      
      if (error) throw error
      
      console.log(`📋 Page ${page}: ${data.users.length} utilisateurs récupérés`)
      allUsers.push(...data.users)
      hasMore = data.users.length === 1000
      page++
    }

    console.log(`✅ Total: ${allUsers.length} utilisateurs`)

    // Get active users (last 30 days)
    const thirtyDaysAgo = new Date()
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30)

    const activeUsers = allUsers.filter(user => {
      const lastSignIn = user.last_sign_in_at ? new Date(user.last_sign_in_at) : null
      return lastSignIn && lastSignIn >= thirtyDaysAgo
    })

    // Count users with data in each module
    const [
      budgetsCount,
      rsvpEventsCount,
      checklistCount,
      coordinationCount,
      documentsCount,
      wishlistCount,
      vendorTrackingCount,
      accommodationsCount,
      profilesComplete
    ] = await Promise.all([
      // Budget
      supabaseAdmin
        .from('budgets_dashboard')
        .select('user_id', { count: 'exact', head: true }),
      
      // RSVP Events
      supabaseAdmin
        .from('wedding_rsvp_events')
        .select('user_id', { count: 'exact', head: true }),
      
      // Checklist
      supabaseAdmin
        .from('checklist_mariage_manuel')
        .select('user_id', { count: 'exact', head: true }),
      
      // Coordination
      supabaseAdmin
        .from('wedding_coordination')
        .select('user_id', { count: 'exact', head: true }),
      
      // Documents de coordination
      supabaseAdmin
        .from('coordination_documents')
        .select('coordination_id', { count: 'exact', head: true }),
      
      // Wishlist
      supabaseAdmin
        .from('vendor_wishlist')
        .select('user_id', { count: 'exact', head: true }),
      
      // Vendor Tracking
      supabaseAdmin
        .from('vendor_tracking')
        .select('user_id', { count: 'exact', head: true }),
      
      // Accommodations
      supabaseAdmin
        .from('wedding_accommodations')
        .select('user_id', { count: 'exact', head: true }),
      
      // Profiles complete (with wedding_date and guest_count)
      supabaseAdmin
        .from('profiles')
        .select('id', { count: 'exact', head: true })
        .not('wedding_date', 'is', null)
        .not('guest_count', 'is', null)
    ])

    // Get unique user counts for each module
    const [
      budgetUsers,
      rsvpUsers,
      checklistUsers,
      coordinationUsers,
      documentsUsers,
      wishlistUsers,
      vendorUsers,
      accommodationsUsers
    ] = await Promise.all([
      supabaseAdmin
        .from('budgets_dashboard')
        .select('user_id')
        .then(({ data }) => new Set(data?.map(d => d.user_id)).size),
      
      supabaseAdmin
        .from('wedding_rsvp_events')
        .select('user_id')
        .then(({ data }) => new Set(data?.map(d => d.user_id)).size),
      
      supabaseAdmin
        .from('checklist_mariage_manuel')
        .select('user_id')
        .then(({ data }) => new Set(data?.map(d => d.user_id)).size),
      
      supabaseAdmin
        .from('wedding_coordination')
        .select('user_id')
        .then(({ data }) => new Set(data?.map(d => d.user_id)).size),
      
      // Documents: compter les user_id distincts via coordination
      supabaseAdmin
        .from('coordination_documents')
        .select('coordination_id')
        .then(async ({ data: docs }) => {
          if (!docs?.length) return 0
          const coordIds = [...new Set(docs.map(d => d.coordination_id))]
          const { data: coords } = await supabaseAdmin
            .from('wedding_coordination')
            .select('user_id')
            .in('id', coordIds)
          return new Set(coords?.map(c => c.user_id)).size
        }),
      
      supabaseAdmin
        .from('vendor_wishlist')
        .select('user_id')
        .then(({ data }) => new Set(data?.map(d => d.user_id)).size),
      
      supabaseAdmin
        .from('vendor_tracking')
        .select('user_id')
        .then(({ data }) => new Set(data?.map(d => d.user_id)).size),
      
      supabaseAdmin
        .from('wedding_accommodations')
        .select('user_id')
        .then(({ data }) => new Set(data?.map(d => d.user_id)).size)
    ])

    const stats = {
      totalUsers: allUsers.length,
      activeUsers: activeUsers.length,
      modules: {
        budget: {
          usersCount: budgetUsers,
          entriesCount: budgetsCount.count || 0
        },
        rsvp: {
          usersCount: rsvpUsers,
          entriesCount: rsvpEventsCount.count || 0
        },
        checklist: {
          usersCount: checklistUsers,
          entriesCount: checklistCount.count || 0
        },
        coordination: {
          usersCount: coordinationUsers,
          entriesCount: coordinationCount.count || 0
        },
        documents: {
          usersCount: documentsUsers,
          entriesCount: documentsCount.count || 0
        },
        wishlist: {
          usersCount: wishlistUsers,
          entriesCount: wishlistCount.count || 0
        },
        vendorTracking: {
          usersCount: vendorUsers,
          entriesCount: vendorTrackingCount.count || 0
        },
        accommodations: {
          usersCount: accommodationsUsers,
          entriesCount: accommodationsCount.count || 0
        },
        profileComplete: {
          usersCount: profilesComplete.count || 0
        }
      }
    }

    return new Response(
      JSON.stringify({ success: true, stats }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    )
  } catch (error) {
    console.error('Error fetching usage stats:', error)
    return new Response(
      JSON.stringify({ success: false, error: error.message }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    )
  }
})
