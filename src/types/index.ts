
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
  description: string;
  prestations: string[];
  style: string[];
  budget: number;
  image: string;
  contact: string;
  lien: string;
}

export interface VendorRecommendation {
  vendor: Vendor;
  reason: string;
}

export interface ChatResponse {
  message: string;
  recommendations?: VendorRecommendation[];
}
