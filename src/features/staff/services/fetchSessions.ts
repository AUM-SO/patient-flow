import { createClient } from "@/lib/supabase/client";
import type { SessionRecord } from "@/features/staff/store/useSessionsStore";

export async function fetchSessions(): Promise<SessionRecord[]> {
  const supabase = createClient();
  const { data, error } = await supabase
    .from("sessions")
    .select("id, status, created_at, updated_at")
    .order("updated_at", { ascending: false });

  if (error) throw error;

  return (data ?? []).map((row) => ({
    id: row.id,
    status: row.status,
    createdAt: row.created_at,
    updatedAt: row.updated_at,
  }));
}
