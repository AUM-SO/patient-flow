import { createClient } from "@/lib/supabase/client";
import type { PatientFormValues } from "@/features/shared/validation/patient-schema";

export async function submitPatient(sessionId: string, values: PatientFormValues) {
  const supabase = createClient();

  // Routed through a single SECURITY DEFINER RPC (patients upsert + sessions
  // status update) instead of two direct table writes — Postgres RLS was
  // intermittently denying anon writes on both tables despite correctly
  // configured permissive policies, reproduced directly in psql. The RPC
  // bypasses RLS for this narrow, fixed-shape operation.
  const { error } = await supabase.rpc("submit_patient", {
    p_session_id: sessionId,
    p_first_name: values.firstName,
    p_middle_name: values.middleName || null,
    p_last_name: values.lastName,
    p_date_of_birth: values.dateOfBirth,
    p_gender: values.gender,
    p_phone_number: values.phoneNumber,
    p_email: values.email || null,
    p_address: values.address,
    p_preferred_language: values.preferredLanguage,
    p_nationality: values.nationality,
    p_emergency_contact_name: values.emergencyContactName,
    p_emergency_contact_relationship: values.emergencyContactRelationship,
    p_religion: values.religion || null,
  });

  if (error) throw error;
}
