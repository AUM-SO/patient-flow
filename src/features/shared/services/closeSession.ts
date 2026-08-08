import { createClient } from "@/lib/supabase/client";
import { SessionStatus } from "@/config/constants";

export async function closeSession(sessionId: string) {
  const supabase = createClient();

  // Routed through a SECURITY DEFINER RPC instead of a direct table update —
  // see submitPatient.ts for why (RLS was silently denying anon UPDATEs on
  // sessions despite a correctly configured permissive policy).
  const { error } = await supabase.rpc("set_session_status", {
    p_session_id: sessionId,
    p_status: SessionStatus.CLOSED,
  });

  if (error) throw error;
}
