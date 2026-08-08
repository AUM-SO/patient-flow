"use client";

import type { Control, FieldErrors, UseFormRegister } from "react-hook-form";

import { Input } from "@/components/ui/form/input";
import { Field, FieldError, FieldGroup, FieldLabel, FieldSet } from "@/components/ui/form/field";
import { religionOptions } from "@/config/options";
import type { PatientFormValues } from "@/features/shared/validation/patient-schema";
import { PatientSelectField } from "@/features/patient/components/PatientSelectField";
import { COMFORTABLE_LABEL_CLASS } from "@/features/patient/lib/field-classes";
import { filterLettersOnly } from "@/features/patient/lib/input-filters";
import { RequiredMark, SectionLegend } from "@/features/patient/components/FormPrimitives";

type Props = {
  control: Control<PatientFormValues>;
  register: UseFormRegister<PatientFormValues>;
  errors: FieldErrors<PatientFormValues>;
};

export function EmergencyContactSection({ control, register, errors }: Props) {
  const contactNameField = register("emergencyContactName");
  const relationshipField = register("emergencyContactRelationship");

  return (
    <FieldSet>
      <SectionLegend index={3}>Emergency Contact</SectionLegend>
      <FieldGroup className="gap-6">
        <Field orientation="responsive">
          <Field data-invalid={!!errors.emergencyContactName}>
            <FieldLabel htmlFor="emergencyContactName" className={COMFORTABLE_LABEL_CLASS}>
              Contact name
              <RequiredMark />
            </FieldLabel>
            <Input
              id="emergencyContactName"
              placeholder="e.g. Jane Doe"
              size="lg"
              {...contactNameField}
              onChange={(e) => {
                e.target.value = filterLettersOnly(e.target.value);
                contactNameField.onChange(e);
              }}
            />
            <FieldError
              errors={errors.emergencyContactName ? [errors.emergencyContactName] : undefined}
            />
          </Field>
          <Field data-invalid={!!errors.emergencyContactRelationship}>
            <FieldLabel htmlFor="emergencyContactRelationship" className={COMFORTABLE_LABEL_CLASS}>
              Relationship
              <RequiredMark />
            </FieldLabel>
            <Input
              id="emergencyContactRelationship"
              placeholder="e.g. Spouse"
              size="lg"
              {...relationshipField}
              onChange={(e) => {
                e.target.value = filterLettersOnly(e.target.value);
                relationshipField.onChange(e);
              }}
            />
            <FieldError
              errors={
                errors.emergencyContactRelationship
                  ? [errors.emergencyContactRelationship]
                  : undefined
              }
            />
          </Field>
        </Field>

        <PatientSelectField
          control={control}
          name="religion"
          label="Religion (optional)"
          placeholder="Select religion"
          options={religionOptions}
        />
      </FieldGroup>
    </FieldSet>
  );
}
