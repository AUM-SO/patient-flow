"use client";

import type { Control, FieldErrors, UseFormRegister } from "react-hook-form";

import { Input } from "@/components/ui/form/input";
import { Field, FieldError, FieldGroup, FieldLabel, FieldSet } from "@/components/ui/form/field";
import { languageOptions, nationalityOptions } from "@/config/options";
import type { PatientFormValues } from "@/features/shared/validation/patient-schema";
import { PatientSelectField } from "@/features/patient/components/PatientSelectField";
import { COMFORTABLE_LABEL_CLASS } from "@/features/patient/lib/field-classes";
import { RequiredMark, SectionLegend } from "@/features/patient/components/FormPrimitives";

type Props = {
  control: Control<PatientFormValues>;
  register: UseFormRegister<PatientFormValues>;
  errors: FieldErrors<PatientFormValues>;
};

export function ContactInfoSection({ control, register, errors }: Props) {
  const phoneField = register("phoneNumber");

  return (
    <FieldSet>
      <SectionLegend index={2}>Contact Information</SectionLegend>
      <FieldGroup className="gap-6">
        <Field orientation="responsive">
          <Field data-invalid={!!errors.phoneNumber}>
            <FieldLabel htmlFor="phoneNumber" className={COMFORTABLE_LABEL_CLASS}>
              Phone number
              <RequiredMark />
            </FieldLabel>
            <Input
              id="phoneNumber"
              type="tel"
              inputMode="numeric"
              autoComplete="tel"
              placeholder="0812345678"
              size="lg"
              maxLength={15}
              {...phoneField}
              onChange={(e) => {
                e.target.value = e.target.value.replace(/\D/g, "");
                phoneField.onChange(e);
              }}
            />
            <FieldError errors={errors.phoneNumber ? [errors.phoneNumber] : undefined} />
          </Field>
          <Field data-invalid={!!errors.email}>
            <FieldLabel htmlFor="email" className={COMFORTABLE_LABEL_CLASS}>
              Email (optional)
            </FieldLabel>
            <Input
              id="email"
              type="email"
              autoComplete="email"
              placeholder="name@example.com"
              size="lg"
              {...register("email")}
            />
            <FieldError errors={errors.email ? [errors.email] : undefined} />
          </Field>
        </Field>

        <Field data-invalid={!!errors.address}>
          <FieldLabel htmlFor="address" className={COMFORTABLE_LABEL_CLASS}>
            Address
            <RequiredMark />
          </FieldLabel>
          <Input
            id="address"
            autoComplete="street-address"
            placeholder="House no., street, city"
            size="lg"
            {...register("address")}
          />
          <FieldError errors={errors.address ? [errors.address] : undefined} />
        </Field>

        <Field orientation="responsive">
          <PatientSelectField
            control={control}
            name="preferredLanguage"
            label="Preferred language"
            placeholder="Select language"
            options={languageOptions}
            required
          />
          <PatientSelectField
            control={control}
            name="nationality"
            label="Nationality"
            placeholder="Select nationality"
            options={nationalityOptions}
            required
          />
        </Field>
      </FieldGroup>
    </FieldSet>
  );
}
