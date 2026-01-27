import { createClient } from "@supabase/supabase-js";

const supabase = createClient(
  "https://tervmddstmtzvopqcogf.supabase.co",
  "sb_publishable_IPWly06BhS1jqozXlyjb1g_b3zAwH2U",
);

export { supabase };
