import { createClient } from 'npm:@supabase/supabase-js@2';
import { corsHeaders } from 'npm:@supabase/supabase-js@2/cors';

// Rappel quotidien des acomptes arrivant à échéance (J-3 et jour J), envoyé au propriétaire et aux collaborateurs du mariage.
Deno.serve(async (req) => {
  if (req.method === 'OPTIONS') return new Response('ok', { headers: corsHeaders });
  try {
    const supabase = createClient(Deno.env.get('SUPABASE_URL')!, Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!);
    const resendKey = Deno.env.get('RESEND');
    const today = new Date();
    const inThreeDays = new Date(today.getTime() + 3 * 86400000).toISOString().slice(0, 10);

    const { data: rows, error } = await supabase
      .from('budgets_detail')
      .select('id, user_id, wedding_id, item_name, category_name, estimated, actual, payment_schedule')
      .not('payment_schedule', 'eq', '{}');
    if (error) throw error;

    const byRecipientGroup = new Map<string, { emails: Set<string>; lines: string[] }>();
    const updates: { id: string; schedule: any }[] = [];

    for (const row of rows || []) {
      const schedule = row.payment_schedule || {};
      const installments: any[] = Array.isArray(schedule.installments) ? schedule.installments : [];
      let changed = false;
      const total = Math.max(Number(row.estimated) || 0, Number(row.actual) || 0);
      const paid = installments.filter((i) => i.paid).reduce((s, i) => s + (Number(i.amount) || 0), 0);
      installments.forEach((inst, index) => {
        if (!inst.reminder || inst.paid || inst.reminder_sent || !inst.due_date) return;
        if (inst.due_date > inThreeDays) return;
        const key = row.wedding_id || row.user_id;
        if (!byRecipientGroup.has(key)) byRecipientGroup.set(key, { emails: new Set(), lines: [] });
        byRecipientGroup.get(key)!.lines.push(
          `<li><strong>${row.item_name || row.category_name}</strong> — acompte n°${index + 1} : ${Number(inst.amount || 0).toFixed(2)} € à régler le ${inst.due_date} (reste à payer : ${(total - paid).toFixed(2)} €)</li>`,
        );
        inst.reminder_sent = true;
        changed = true;
      });
      if (changed) updates.push({ id: row.id, schedule: { ...schedule, installments } });
    }

    let sent = 0;
    for (const [key, group] of byRecipientGroup) {
      const { data: wedding } = await supabase.from('weddings').select('owner_id, title').eq('id', key).maybeSingle();
      const ownerId = wedding?.owner_id || key;
      const { data: owner } = await supabase.auth.admin.getUserById(ownerId);
      if (owner?.user?.email) group.emails.add(owner.user.email);
      const { data: collaborators } = await supabase.from('wedding_collaborators').select('invited_email').eq('wedding_id', key).eq('status', 'accepted');
      (collaborators || []).forEach((c: any) => c.invited_email && group.emails.add(c.invited_email));
      if (!resendKey || group.emails.size === 0) continue;
      const html = `<div style="font-family:Georgia,serif;background:#F8F5EF;padding:24px;color:#1a1a1a">
        <h2 style="color:#63745A">Acompte à régler · Payment due</h2>
        <p>${wedding?.title || 'Votre mariage'} — rappel des échéances à venir :</p><ul>${group.lines.join('')}</ul>
        <p style="color:#666;font-size:13px">Upcoming wedding payments are listed above. — Mariable</p></div>`;
      const response = await fetch('https://api.resend.com/emails', {
        method: 'POST',
        headers: { Authorization: `Bearer ${resendKey}`, 'Content-Type': 'application/json' },
        body: JSON.stringify({ from: 'Mariable <noreply@mariable.fr>', to: [...group.emails], subject: 'Rappel acompte · Payment reminder', html }),
      });
      if (response.ok) sent++;
      else console.error('❌ resend failed', await response.text());
    }

    for (const update of updates) {
      await supabase.from('budgets_detail').update({ payment_schedule: update.schedule }).eq('id', update.id);
    }
    return new Response(JSON.stringify({ sent, updated: updates.length }), { headers: { ...corsHeaders, 'Content-Type': 'application/json' } });
  } catch (error) {
    console.error('❌ budget-deposit-reminders failed:', error);
    return new Response(JSON.stringify({ error: String(error) }), { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } });
  }
});
