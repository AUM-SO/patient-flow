import { createClient } from "@/lib/supabase/client";
import type { PresenceStatus } from "@/config/constants";
import type {
  PatientFieldUpdate,
  PatientFormValues,
} from "@/features/shared/validation/patient-schema";

export const REALTIME_EVENTS = {
  FIELD_UPDATE: "field_update",
  SUBMITTED: "submitted",
  /** Staff retired the session — the patient tab must stop accepting input. */
  SESSION_CLOSED: "session_closed",
} as const;

export type FieldUpdateBroadcast = {
  fields: PatientFieldUpdate;
};

/** Tracked by the patient tab, read by every staff tab watching the session. */
export type SessionPresence = {
  status: PresenceStatus;
  /** Field the patient is typing into right now, when status is `typing`. */
  field?: keyof PatientFormValues;
};

export function getSessionChannel(sessionId: string) {
  const supabase = createClient();
  return supabase.channel(`session:${sessionId}`);
}
