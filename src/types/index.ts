
export interface Message {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: Date;
}

export interface Vendor {
  id: number;
  nom: string;
  type: string;
  lieu: string;
  ville?: string;
  description: string;
  prestations?: string[];
  style: string[];
  budget?: number;
  budget_estime?: string;
  image?: string;
  contact?: string;
  lien: string;
}

export interface VendorRecommendation {
  id?: string;
  nom?: string;
  categorie?: string;
  description?: string | null;
  ville?: string | null;
  region?: string | null;
  prix_minimum?: number | null;
  prix_a_partir_de?: number | null;
  capacite_invites?: number | null;
  site_web?: string | null;
  email?: string | null;
  telephone?: string | null;
  slug?: string | null;
  name?: string;
  imageUrl?: string;
  link?: string;
}

export interface ChatResponse {
  message: string;
  recommendations?: VendorRecommendation[];
  noRecommendationsFound?: boolean;
  actionButtons?: {
    text: string;
    action: string;
    link?: string;
    newTab?: boolean;
  }[];
}
