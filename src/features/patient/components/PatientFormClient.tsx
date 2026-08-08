"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

import { Button } from "@/components/ui/form/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/layout/card";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/feedback/alert";
import { FieldGroup, FieldSeparator } from "@/components/ui/form/field";
import { usePatientForm } from "@/features/patient/hooks/usePatientForm";
import { usePatientRealtimeSync } from "@/features/patient/hooks/usePatientRealtimeSync";
import { upsertSession } from "@/features/patient/services/upsertSession";
import { submitPatient } from "@/features/patient/services/submitPatient";
import { PersonalInfoSection } from "@/features/patient/components/PersonalInfoSection";
import { ContactInfoSection } from "@/features/patient/components/ContactInfoSection";
import { EmergencyContactSection } from "@/features/patient/components/EmergencyContactSection";

export function PatientFormClient({ sessionId }: { sessionId: string }) {
  const router = useRouter();
  const [sessionError, setSessionError] = useState(false);
  const {
    control,
    register,
    handleSubmit,
    watch,
    formState: { errors, isSubmitting },
  } = usePatientForm();

  const { markSubmitted, isClosed } = usePatientRealtimeSync(sessionId, watch);

  // Fire in the background so the form is usable immediately; submitPatient()
  // will surface a clear error later if the session row never got created.
  useEffect(() => {
    upsertSession(sessionId).catch(() => setSessionError(true));
  }, [sessionId]);

  const onSubmit = handleSubmit(
    async (values) => {
      // The fieldset below already blocks the button; this covers a close that
      // lands between validation and the write.
      if (isClosed) {
        toast.error("This session was closed by staff.");
        return;
      }
      try {
        await submitPatient(sessionId, values);
        markSubmitted();
        router.push(`/patient/${sessionId}/submitted`);
      } catch {
        toast.error("Submission failed. Please try again.");
      }
    },
    () => {
      toast.error("Please fix the highlighted fields before submitting.");
    }
  );

  const errorCount = Object.keys(errors).length;

  return (
    <Card className="mx-auto w-full max-w-3xl">
      <CardHeader className="px-6 pt-6 md:px-8 md:pt-8">
        <CardTitle className="text-xl md:text-2xl">Patient Registration</CardTitle>
        <CardDescription className="text-base">
          Fields marked with <span className="text-destructive">*</span> are required.
        </CardDescription>
      </CardHeader>
      <CardContent className="px-6 pb-6 md:px-8 md:pb-8">
        <form onSubmit={onSubmit} noValidate>
          {/* Native fieldset disabling — one attribute locks every input,
              select and button inside once staff close the session. */}
          <fieldset disabled={isClosed} className="min-w-0">
            <FieldGroup className="gap-7">
              {isClosed && (
                <Alert variant="destructive">
                  <AlertTitle>This session was closed</AlertTitle>
                  <AlertDescription>
                    A staff member ended this registration, so it can no longer be
                    submitted. Please ask staff for a new link.
                  </AlertDescription>
                </Alert>
              )}
              {sessionError && (
                <Alert variant="destructive">
                  <AlertTitle>Connection issue</AlertTitle>
                  <AlertDescription>
                    Could not reach the server. You can keep filling the form, but
                    submission may fail until this is resolved.
                  </AlertDescription>
                </Alert>
              )}
              {errorCount > 0 && (
                <Alert variant="destructive">
                  <AlertTitle>Some fields need your attention</AlertTitle>
                  <AlertDescription>
                    {errorCount} field{errorCount > 1 ? "s" : ""} still need to be fixed.
                  </AlertDescription>
                </Alert>
              )}

              <PersonalInfoSection control={control} register={register} errors={errors} />
              <FieldSeparator />
              <ContactInfoSection control={control} register={register} errors={errors} />
              <FieldSeparator />
              <EmergencyContactSection control={control} register={register} errors={errors} />

              <Button type="submit" size="lg" disabled={isSubmitting} className="w-full">
                {isSubmitting ? "Submitting..." : "Submit"}
              </Button>
            </FieldGroup>
          </fieldset>
        </form>
      </CardContent>
    </Card>
  );
}
