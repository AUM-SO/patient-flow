import { createClient } from "@/lib/supabase/client";
import type { SessionRecord } from "@/features/staff/store/useSessionsStore";
import type { PatientFieldUpdate } from "@/features/shared/validation/patient-schema";

export async function fetchSessionDetail(sessionId: string): Promise<SessionRecord | null> {
  const supabase = createClient();

  const [{ data: session, error: sessionError }, { data: patient, error: patientError }] =
    await Promise.all([
      supabase
        .from("sessions")
        .select("id, status, created_at, updated_at")
        .eq("id", sessionId)
        .maybeSingle(),
      supabase.from("patients").select("*").eq("session_id", sessionId).maybeSingle(),
    ]);

  if (sessionError) throw sessionError;
  if (!session) return null;
  if (patientError) throw patientError;

  const fields: PatientFieldUpdate | undefined = patient
    ? {
        firstName: patient.first_name ?? undefined,
        middleName: patient.middle_name ?? undefined,
        lastName: patient.last_name ?? undefined,
        dateOfBirth: patient.date_of_birth ?? undefined,
        gender: (patient.gender as PatientFieldUpdate["gender"]) ?? undefined,
        phoneNumber: patient.phone_number ?? undefined,
        email: patient.email ?? undefined,
        address: patient.address ?? undefined,
        preferredLanguage: patient.preferred_language ?? undefined,
        nationality: patient.nationality ?? undefined,
        emergencyContactName: patient.emergency_contact_name ?? undefined,
        emergencyContactRelationship: patient.emergency_contact_relationship ?? undefined,
        religion: patient.religion ?? undefined,
      }
    : undefined;

  return {
    id: session.id,
    status: session.status,
    createdAt: session.created_at,
    updatedAt: session.updated_at,
    fields,
  };
}
