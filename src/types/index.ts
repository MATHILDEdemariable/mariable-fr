
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
  vendor: Vendor;
  reason: string;
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
