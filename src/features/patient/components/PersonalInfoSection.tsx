"use client";

import { useState } from "react";
import { Controller, type Control, type FieldErrors, type UseFormRegister } from "react-hook-form";
import { CalendarIcon } from "lucide-react";

import { Input } from "@/components/ui/form/input";
import { Calendar } from "@/components/ui/form/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/overlay/popover";
import { buttonVariants } from "@/components/ui/form/button";
import { Field, FieldError, FieldGroup, FieldLabel, FieldSet } from "@/components/ui/form/field";
import { cn } from "@/lib/utils";
import { genderSelectOptions } from "@/config/options";
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

function toIsoDate(date: Date) {
  const y = date.getFullYear();
  const m = String(date.getMonth() + 1).padStart(2, "0");
  const d = String(date.getDate()).padStart(2, "0");
  return `${y}-${m}-${d}`;
}

export function PersonalInfoSection({ control, register, errors }: Props) {
  const [open, setOpen] = useState(false);
  const firstNameField = register("firstName");
  const middleNameField = register("middleName");
  const lastNameField = register("lastName");

  return (
    <FieldSet>
      <SectionLegend index={1}>Personal Information</SectionLegend>
      <FieldGroup className="gap-6">
        <Field orientation="responsive">
          <Field data-invalid={!!errors.firstName}>
            <FieldLabel htmlFor="firstName" className={COMFORTABLE_LABEL_CLASS}>
              First name
              <RequiredMark />
            </FieldLabel>
            <Input
              id="firstName"
              autoComplete="given-name"
              placeholder="e.g. John"
              size="lg"
              {...firstNameField}
              onChange={(e) => {
                e.target.value = filterLettersOnly(e.target.value);
                firstNameField.onChange(e);
              }}
            />
            <FieldError errors={errors.firstName ? [errors.firstName] : undefined} />
          </Field>
          <Field data-invalid={!!errors.middleName}>
            <FieldLabel htmlFor="middleName" className={COMFORTABLE_LABEL_CLASS}>
              Middle name (optional)
            </FieldLabel>
            <Input
              id="middleName"
              autoComplete="additional-name"
              placeholder="Optional"
              size="lg"
              {...middleNameField}
              onChange={(e) => {
                e.target.value = filterLettersOnly(e.target.value);
                middleNameField.onChange(e);
              }}
            />
            <FieldError errors={errors.middleName ? [errors.middleName] : undefined} />
          </Field>
          <Field data-invalid={!!errors.lastName}>
            <FieldLabel htmlFor="lastName" className={COMFORTABLE_LABEL_CLASS}>
              Last name
              <RequiredMark />
            </FieldLabel>
            <Input
              id="lastName"
              autoComplete="family-name"
              placeholder="e.g. Doe"
              size="lg"
              {...lastNameField}
              onChange={(e) => {
                e.target.value = filterLettersOnly(e.target.value);
                lastNameField.onChange(e);
              }}
            />
            <FieldError errors={errors.lastName ? [errors.lastName] : undefined} />
          </Field>
        </Field>

        <Field orientation="responsive">
          <Controller
            control={control}
            name="dateOfBirth"
            render={({ field, fieldState }) => (
              <Field data-invalid={!!fieldState.error}>
                <FieldLabel htmlFor="dateOfBirth" className={COMFORTABLE_LABEL_CLASS}>
                  Date of birth
                  <RequiredMark />
                </FieldLabel>
                <Popover open={open} onOpenChange={setOpen}>
                  <PopoverTrigger
                    id="dateOfBirth"
                    aria-invalid={!!fieldState.error}
                    className={cn(
                      buttonVariants({ variant: "outline", size: "lg" }),
                      "w-full justify-start font-normal",
                      !field.value && "text-muted-foreground"
                    )}
                  >
                    <CalendarIcon className="mr-1.5 size-4 text-[#3e7eec]" />
                    {field.value ? field.value : "Select a date"}
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0">
                    <Calendar
                      mode="single"
                      captionLayout="dropdown"
                      className="text-base [--cell-size:--spacing(9)]"
                      selected={field.value ? new Date(field.value) : undefined}
                      onSelect={(date) => {
                        field.onChange(date ? toIsoDate(date) : "");
                        setOpen(false);
                      }}
                      disabled={{ after: new Date() }}
                    />
                  </PopoverContent>
                </Popover>
                <FieldError errors={fieldState.error ? [fieldState.error] : undefined} />
              </Field>
            )}
          />

          <PatientSelectField
            control={control}
            name="gender"
            label="Gender"
            placeholder="Select gender"
            options={genderSelectOptions}
            required
          />
        </Field>
      </FieldGroup>
    </FieldSet>
  );
}
