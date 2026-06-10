import { createClient } from "@supabase/supabase-js";

const supabaseUrl = "https://mnzagprlkxqhewsclsnd.supabase.co";
const supabaseAnonKey = "sb_publishable_wOHo-RuKBrq49eIDlo5a2w_N-F5_7XQ";

export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    autoRefreshToken: true,
    persistSession: true,
    detectSessionInUrl: true,
  },
});
