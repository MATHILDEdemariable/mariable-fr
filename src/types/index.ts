
export interface Message {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: Date;
}

export interface Vendor {
  nom: string;
  type: string;
  lieu: string;
  style: string[];
  budget: number;
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
