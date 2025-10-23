export interface SeatingPlan {
  id: string;
  user_id: string;
  name: string;
  event_date: string | null;
  venue_name: string | null;
  notes: string | null;
  created_at: string;
  updated_at: string;
}

export interface SeatingTable {
  id: string;
  seating_plan_id: string;
  table_name: string;
  table_number: number;
  capacity: number;
  shape: 'round' | 'rectangle' | 'oval';
  position_x: number;
  position_y: number;
  color: string;
  created_at: string;
}

export interface SeatingAssignment {
  id: string;
  table_id: string | null;
  guest_name: string;
  rsvp_response_id: string | null;
  guest_type: 'adult' | 'child' | 'vip';
  dietary_restrictions: string | null;
  seat_number: number | null;
  notes: string | null;
  created_at: string;
}
