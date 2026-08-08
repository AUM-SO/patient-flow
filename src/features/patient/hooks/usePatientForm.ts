import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";

import {
  patientSchema,
  type PatientFormValues,
} from "@/features/shared/validation/patient-schema";

const defaultValues: PatientFormValues = {
  firstName: "",
  middleName: "",
  lastName: "",
  dateOfBirth: "",
  gender: "" as PatientFormValues["gender"],
  phoneNumber: "",
  email: "",
  address: "",
  preferredLanguage: "",
  nationality: "",
  emergencyContactName: "",
  emergencyContactRelationship: "",
  religion: "",
};

export function usePatientForm() {
  return useForm<PatientFormValues>({
    resolver: zodResolver(patientSchema),
    defaultValues,
    mode: "onBlur",
  });
}
