import { createClient, SupabaseClient } from "@supabase/supabase-js";

const supabaseUrl = process.env.SUPABASE_URL || process.env.NEXT_PUBLIC_SUPABASE_URL || "";
const publishableKey = process.env.SUPABASE_PUBLISHABLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || "";
const rawSecretKey = process.env.SUPABASE_SECRET_KEY || "";

// Check if secret key is real or masked with bullets
const isSecretKeyValid = rawSecretKey && !rawSecretKey.includes("••") && !rawSecretKey.includes("••••");

// Server client: Uses secret role key if valid, or falls back to publishable key
export function getSupabaseServerClient(): SupabaseClient | null {
  if (!supabaseUrl || (!publishableKey && !isSecretKeyValid)) {
    return null;
  }

  const apiKey = isSecretKeyValid ? rawSecretKey : publishableKey;
  const dummySocket = class DummyWebSocket {};

  return createClient(supabaseUrl, apiKey, {
    auth: {
      persistSession: false,
      autoRefreshToken: false,
    },
    realtime: {
      transport: (typeof globalThis !== "undefined" && "WebSocket" in globalThis
        ? globalThis.WebSocket
        : dummySocket) as unknown as typeof WebSocket,
    },
  });
}

export function getSupabaseConfigStatus() {
  return {
    hasUrl: Boolean(supabaseUrl),
    url: supabaseUrl,
    hasPublishableKey: Boolean(publishableKey),
    hasSecretKey: Boolean(isSecretKeyValid),
    isMaskedSecretKey: rawSecretKey.includes("••"),
    jwksUrl: process.env.SUPABASE_JWKS_URL || "",
  };
}
