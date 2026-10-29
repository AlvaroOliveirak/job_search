export interface Job {
  id: number;
  job_hash: string;
  title: string;
  company: string;
  location?: string | null;
  url: string;
  description?: string | null;
  source: string;
  posted_at?: string | null;
  created_at: string;
}

export type MatchStatus = "new" | "viewed" | "applied" | "interview" | "rejected" | "discarded";

export interface UserJobMatch {
  id: number;
  user_id: number;
  job_id: number;
  score: number;
  is_notified_telegram: boolean;
  is_favorite: boolean;
  status: MatchStatus;
  matched_at: string;
  job: Job;
}

