import { supabase } from '@/integrations/supabase/client';

const db = supabase as any;

export const DEMO_WEDDING_TITLE = 'Mariage Exemple — Chloé & Antoine';

const itemId = () => `item_${Date.now()}_${Math.random().toString(36).slice(2, 11)}`;

/** Crée un mariage exemple complet (Jour J, prestataires, plan de table, budget) pour un compte Pro. */
export async function createDemoWedding(userId: string): Promise<string> {
  console.log('🚀 createDemoWedding started');
  const weddingDate = new Date();
  weddingDate.setMonth(weddingDate.getMonth() + 4);
  const dateStr = weddingDate.toISOString().slice(0, 10);

  const { data: wedding, error } = await db.from('weddings').insert({
    owner_id: userId, title: DEMO_WEDDING_TITLE, wedding_date: dateStr,
    wedding_location: 'Château de Vaux, Seine-et-Marne', guest_count: 24, prestation_type: 'organisation',
  }).select().single();
  if (error) throw error;
  const weddingId = wedding.id as string;

  try {
    const { data: coordination, error: coordError } = await db.from('wedding_coordination').insert({
      user_id: userId, wedding_id: weddingId, title: 'Chloé & Antoine — Jour J', wedding_date: dateStr, wedding_location: 'Château de Vaux',
    }).select('id').single();
    if (coordError) throw coordError;

    const steps: [string, number, string][] = [
      ['09:00', 120, 'Préparatifs de la mariée (coiffure & maquillage)'],
      ['11:00', 60, 'Photos de couple — first look'],
      ['14:30', 45, 'Cérémonie laïque dans le jardin'],
      ['15:30', 120, "Vin d'honneur & animations"],
      ['18:00', 30, 'Photos de groupe'],
      ['19:30', 180, 'Dîner & discours des témoins'],
      ['22:30', 15, 'Ouverture de bal'],
      ['23:00', 240, 'Soirée dansante avec le DJ'],
    ];
    await db.from('coordination_planning').insert(steps.map(([start, duration, title], index) => ({
      coordination_id: coordination.id, title, start_time: start, duration, category: 'jour-m', position: index,
    })));

    await db.from('vendors_tracking_preprod').insert([
      { vendor_name: 'Château de Vaux', category: 'Lieu de réception', status: 'validé', budget: '9500', location: 'Seine-et-Marne', email: 'contact@exemple.fr', phone: '01 23 45 67 89', feeling: 'Coup de cœur', points_forts: 'Parc magnifique, hébergement sur place', source: 'personal' },
      { vendor_name: 'Maison Lumière Traiteur', category: 'Traiteur', status: 'à valider', budget: '7200', location: 'Paris', email: 'devis@exemple.fr', feeling: 'Très bon', points_forts: 'Menu de saison, options végétariennes', points_faibles: 'Acompte élevé', source: 'personal' },
      { vendor_name: 'Studio Mathis Photo', category: 'Photographe', status: 'contactés', budget: '2400', location: 'Paris', email: 'hello@exemple.fr', feeling: 'À rencontrer', source: 'personal' },
    ].map((vendor) => ({ ...vendor, user_id: userId, wedding_id: weddingId })));

    const budgetLines: [string, string, number, number][] = [
      ['Lieu de réception', 'Château privatisé', 9500, 3000],
      ['Traiteur & Boissons', 'Dîner & vin d\'honneur', 7200, 2000],
      ['Photographe', 'Reportage journée', 2400, 600],
      ['Décoration & Fleurs', 'Arche et centres de table', 1800, 0],
      ['Animation', 'DJ soirée', 1200, 300],
    ];
    await db.from('budgets_detail').insert(budgetLines.map(([category_name, item_name, estimated, deposit]) => ({
      user_id: userId, wedding_id: weddingId, category_name, item_id: itemId(), item_name, estimated, actual: estimated, deposit, remaining: estimated - deposit,
    })));

    const guests = ['Léa Martin', 'Hugo Bernard', 'Emma Petit', 'Lucas Durand', 'Inès Moreau', 'Paul Laurent', 'Jade Simon', 'Arthur Michel', 'Camille Roux', 'Louis Fournier', 'Manon Girard', 'Nathan Bonnet'];
    await db.from('wedding_guest_list').insert(guests.map((name) => {
      const [first, last] = name.split(' ');
      return { user_id: userId, wedding_id: weddingId, guest_first_name: first, guest_last_name: last, rsvp_status: 'confirmed' };
    }));

    const { data: plan, error: planError } = await db.from('seating_plans').insert({ user_id: userId, wedding_id: weddingId, name: 'Plan de table — dîner', event_date: dateStr, venue_name: 'Château de Vaux' }).select('id').single();
    if (planError) throw planError;
    const { data: tables } = await db.from('seating_tables').insert([
      { seating_plan_id: plan.id, table_name: 'Table des mariés', table_number: 1, capacity: 8, position_x: 120, position_y: 80 },
      { seating_plan_id: plan.id, table_name: 'Table Amis', table_number: 2, capacity: 8, position_x: 360, position_y: 80 },
    ]).select('id, table_number');
    const tableIds = (tables ?? []).sort((a: any, b: any) => a.table_number - b.table_number).map((table: any) => table.id);
    await db.from('seating_assignments').insert(guests.slice(0, 10).map((name, index) => ({
      seating_plan_id: plan.id, guest_name: name, table_id: tableIds[index < 5 ? 0 : 1] ?? null,
      dietary_restrictions: index === 2 ? 'Végétarien' : index === 6 ? 'Sans gluten' : null,
    })));
  } catch (seedError) {
    console.error('❌ createDemoWedding partial seed failed:', seedError);
  }

  console.log('✅ createDemoWedding completed');
  return weddingId;
}
