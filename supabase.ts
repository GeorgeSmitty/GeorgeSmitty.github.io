import { createClient } from "@supabase/supabase-js";

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL as string;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY as string;

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error("Missing Supabase environment variables");
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

export interface SurveyResponse {
  id?: string;
  created_at?: string;
  grade_level: string;
  gender: string;
  sports_followed: string[];
  passion_level: string;
  event_attendance: string;
}

export interface ResultsData {
  total_responses: number;
  grade_level: Record<string, number>;
  gender: Record<string, number>;
  sports_followed: Record<string, number>;
  passion_level: Record<string, number>;
  event_attendance: Record<string, number>;
}
