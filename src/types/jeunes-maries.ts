export interface JeuneMarie {
  id: string;
  nom_complet: string;
  email: string;
  telephone?: string;
  lieu_mariage: string;
  region?: string;
  date_mariage: string;
  nombre_invites?: number;
  budget_approximatif?: string;
  photo_principale_url?: string;
  photos_mariage: any;
  experience_partagee?: string;
  conseils_couples?: string;
  prestataires_recommandes: any;
  note_experience?: number;
  slug: string;
  visible: boolean;
  status_moderation: 'en_attente' | 'approuve' | 'rejete';
  date_soumission: string;
  date_approbation?: string;
  admin_notes?: string;
  accept_email_contact?: boolean;
  created_at: string;
  updated_at: string;
}

export interface JeuneMariesFilters {
  search: string;
  region: string;
  budget: string;
  note: number;
}