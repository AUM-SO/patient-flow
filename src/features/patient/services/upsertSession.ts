import { createClient } from "@/lib/supabase/client";

export async function upsertSession(sessionId: string) {
  const supabase = createClient();

  // Routed through a SECURITY DEFINER RPC instead of a direct table insert —
  // see submitPatient.ts for why (RLS was intermittently denying anon writes
  // on sessions despite a correctly configured permissive policy). The RPC
  // does its own ON CONFLICT DO NOTHING, so a re-created session is a no-op.
  const { error } = await supabase.rpc("create_session", {
    p_session_id: sessionId,
  });

  if (error) throw error;
}
