export interface SearchProfile {
  id: number;
  name: string;
  keywords: string;
  min_score: number;
  created_at?: string;
}

export interface SearchProfileRequest {
  name: string;
  keywords: string;
  minScore: number;
}

