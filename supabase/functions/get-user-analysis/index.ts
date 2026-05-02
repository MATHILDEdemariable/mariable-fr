import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.49.4'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

Deno.serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders });
  }

  try {
    const supabaseAdmin = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? '',
      { auth: { autoRefreshToken: false, persistSession: false } }
    );

    const { email, user_id } = await req.json();

    if (!email && !user_id) {
      return new Response(JSON.stringify({ error: 'email ou user_id requis' }), {
        status: 400,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    // Trouver l'utilisateur
    let targetUser: any = null;
    if (user_id) {
      const { data } = await supabaseAdmin.auth.admin.getUserById(user_id);
      targetUser = data?.user;
    } else {
      // Recherche par email — paginate pour trouver
      let page = 1;
      while (page <= 10) {
        const { data } = await supabaseAdmin.auth.admin.listUsers({ page, perPage: 1000 });
        const found = data.users.find(u => u.email?.toLowerCase() === email.toLowerCase());
        if (found) { targetUser = found; break; }
        if (data.users.length < 1000) break;
        page++;
      }
    }

    if (!targetUser) {
      return new Response(JSON.stringify({ error: 'Utilisateur introuvable' }), {
        status: 404,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    const uid = targetUser.id;

    // Profil
    const { data: profile } = await supabaseAdmin
      .from('profiles').select('*').eq('id', uid).maybeSingle();

    // Comptages parallèles par module
    const countFor = async (table: string, column: string = 'user_id') => {
      const { count } = await supabaseAdmin
        .from(table).select('*', { count: 'exact', head: true }).eq(column, uid);
      return count ?? 0;
    };

    const [
      budgetEntries,
      checklistEntries,
      rsvpEvents,
      wishlistCount,
      vendorTrackingCount,
      accommodationsCount,
      seatingPlansCount,
      avantJourJCount,
      apresJourJCount,
      penseBeteCount,
    ] = await Promise.all([
      countFor('budgets_dashboard'),
      countFor('checklist_mariage_manuel'),
      countFor('wedding_rsvp_events'),
      countFor('vendor_wishlist'),
      countFor('vendors_tracking_preprod'),
      countFor('wedding_accommodations'),
      countFor('seating_plans'),
      countFor('planning_avant_jour_j'),
      countFor('planning_apres_jour_j'),
      countFor('pense_bete'),
    ]);

    // Coordination + documents (via wedding_coordination)
    const { data: coordinations } = await supabaseAdmin
      .from('wedding_coordination').select('id').eq('user_id', uid);
    const coordIds = (coordinations ?? []).map(c => c.id);
    let coordPlanningCount = 0;
    let coordDocumentsCount = 0;
    if (coordIds.length > 0) {
      const { count: pc } = await supabaseAdmin
        .from('coordination_planning').select('*', { count: 'exact', head: true }).in('coordination_id', coordIds);
      coordPlanningCount = pc ?? 0;
      const { count: dc } = await supabaseAdmin
        .from('coordination_documents').select('*', { count: 'exact', head: true }).in('coordination_id', coordIds);
      coordDocumentsCount = dc ?? 0;
    }

    // RSVP responses
    let rsvpResponsesCount = 0;
    if (rsvpEvents > 0) {
      const { data: events } = await supabaseAdmin
        .from('wedding_rsvp_events').select('id').eq('user_id', uid);
      const eventIds = (events ?? []).map(e => e.id);
      if (eventIds.length > 0) {
        const { count } = await supabaseAdmin
          .from('wedding_rsvp_responses').select('*', { count: 'exact', head: true }).in('event_id', eventIds);
        rsvpResponsesCount = count ?? 0;
      }
    }

    // Budget total
    const { data: budgetRows } = await supabaseAdmin
      .from('budgets_dashboard').select('amount, montant').eq('user_id', uid);
    const budgetTotal = (budgetRows ?? []).reduce((sum: number, r: any) =>
      sum + (Number(r.amount ?? r.montant ?? 0) || 0), 0);

    // Modules avec statut
    const modules = [
      { key: 'profile', name: 'Profil', value: profile ? 1 : 0, total: 1, unit: 'profil' },
      { key: 'budget', name: 'Budget', value: budgetEntries, unit: 'lignes', extra: `Total : ${budgetTotal.toFixed(0)}€` },
      { key: 'checklist', name: 'Checklist', value: checklistEntries, unit: 'tâches' },
      { key: 'coordination', name: 'Coordination Jour-J', value: coordIds.length, unit: 'plannings', extra: `${coordPlanningCount} événements` },
      { key: 'documents', name: 'Documents', value: coordDocumentsCount, unit: 'documents' },
      { key: 'rsvp', name: 'RSVP', value: rsvpEvents, unit: 'événements', extra: `${rsvpResponsesCount} réponses` },
      { key: 'wishlist', name: 'Wishlist prestataires', value: wishlistCount, unit: 'favoris' },
      { key: 'vendorTracking', name: 'Suivi prestataires', value: vendorTrackingCount, unit: 'prestataires' },
      { key: 'accommodations', name: 'Hébergements', value: accommodationsCount, unit: 'logements' },
      { key: 'seatingPlan', name: 'Plan de table', value: seatingPlansCount, unit: 'plans' },
      { key: 'avantJourJ', name: 'Avant Jour-J', value: avantJourJCount, unit: 'tâches' },
      { key: 'apresJourJ', name: 'Après Jour-J', value: apresJourJCount, unit: 'tâches' },
      { key: 'penseBete', name: 'Pense-bête', value: penseBeteCount, unit: 'notes' },
    ];

    const usedModules = modules.filter(m => m.value > 0).length;
    const completionScore = Math.round((usedModules / modules.length) * 100);

    return new Response(
      JSON.stringify({
        success: true,
        user: {
          id: targetUser.id,
          email: targetUser.email,
          created_at: targetUser.created_at,
          last_sign_in_at: targetUser.last_sign_in_at,
          metadata: targetUser.user_metadata,
        },
        profile,
        modules,
        completionScore,
        usedModules,
        totalModules: modules.length,
      }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  } catch (error: any) {
    console.error('❌ get-user-analysis:', error);
    return new Response(JSON.stringify({ success: false, error: error.message }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});
