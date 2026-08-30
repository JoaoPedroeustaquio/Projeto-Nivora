import { createClient } from "@supabase/supabase-js";

console.log("ENV:", import.meta.env);
console.log("SUPABASE URL:", import.meta.env.VITE_SUPABASE_URL);
console.log(
  "SUPABASE KEY:",
  Boolean(import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY),
);

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabasePublishableKey =
  import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY;

if (!supabaseUrl || !supabasePublishableKey) {
  throw new Error(
    "VITE_SUPABASE_URL e VITE_SUPABASE_PUBLISHABLE_KEY não foram configuradas.",
  );
}

export const supabase = createClient(
  supabaseUrl,
  supabasePublishableKey,
);