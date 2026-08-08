"use client";

import { Controller, type Control, type FieldPath } from "react-hook-form";

import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/form/select";
import { Field, FieldError, FieldLabel } from "@/components/ui/form/field";
import type { SelectOption } from "@/config/options";
import type { PatientFormValues } from "@/features/shared/validation/patient-schema";
import { COMFORTABLE_LABEL_CLASS } from "@/features/patient/lib/field-classes";
import { RequiredMark } from "@/features/patient/components/FormPrimitives";

type Props = {
  control: Control<PatientFormValues>;
  name: FieldPath<PatientFormValues>;
  label: string;
  placeholder: string;
  options: SelectOption[];
  required?: boolean;
};

export function PatientSelectField({
  control,
  name,
  label,
  placeholder,
  options,
  required,
}: Props) {
  const items = [{ label: placeholder, value: null as string | null }, ...options];

  return (
    <Controller
      control={control}
      name={name}
      render={({ field, fieldState }) => (
        <Field data-invalid={!!fieldState.error}>
          <FieldLabel htmlFor={name} className={COMFORTABLE_LABEL_CLASS}>
            {label}
            {required && <RequiredMark />}
          </FieldLabel>
          <Select
            items={items}
            value={(field.value as string) || null}
            onValueChange={(value) => field.onChange(value ?? "")}
          >
            <SelectTrigger
              id={name}
              aria-invalid={!!fieldState.error}
              size="lg"
              className="w-full"
            >
              <SelectValue placeholder={placeholder} />
            </SelectTrigger>
            <SelectContent>
              <SelectGroup>
                {items.map((item) => (
                  <SelectItem key={item.value ?? "placeholder"} value={item.value as string}>
                    {item.label}
                  </SelectItem>
                ))}
              </SelectGroup>
            </SelectContent>
          </Select>
          <FieldError errors={fieldState.error ? [fieldState.error] : undefined} />
        </Field>
      )}
    />
  );
}
