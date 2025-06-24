
export interface WeddingCoordination {
  id: string;
  user_id: string;
  title: string;
  wedding_date: string | null;
  wedding_location: string | null;
  description: string | null;
  created_at: string;
  updated_at: string;
}

export interface CoordinationTeamMember {
  id: string;
  coordination_id: string;
  name: string;
  role: string;
  type: 'person' | 'vendor';
  email: string | null;
  phone: string | null;
  prestataire_id: string | null;
  notes: string | null;
  created_at: string;
  updated_at: string;
}

export interface CoordinationPlanning {
  id: string;
  coordination_id: string;
  title: string;
  description: string | null;
  category: string;
  start_time: string | null;
  end_time: string | null;
  duration: number;
  assigned_to: string | null;
  status: 'todo' | 'in_progress' | 'completed';
  priority: 'low' | 'medium' | 'high';
  is_ai_generated: boolean;
  position: number;
  created_at: string;
  updated_at: string;
}

export interface CoordinationDocument {
  id: string;
  coordination_id: string;
  title: string;
  file_url: string;
  file_type: string | null;
  file_size: number | null;
  category: string;
  assigned_to: string | null;
  description: string | null;
  created_at: string;
  updated_at: string;
}
