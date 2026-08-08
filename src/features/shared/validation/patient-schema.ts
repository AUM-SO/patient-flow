import { z } from "zod";

export const genderOptions = ["male", "female", "other"] as const;

const NAME_RE = /^[\p{L}\s'-]+$/u;

export const patientSchema = z.object({
  firstName: z.string().trim().min(1, "First name is required").regex(NAME_RE, "Letters only"),
  middleName: z
    .string()
    .trim()
    .regex(NAME_RE, "Letters only")
    .optional()
    .or(z.literal("")),
  lastName: z.string().trim().min(1, "Last name is required").regex(NAME_RE, "Letters only"),
  dateOfBirth: z.string().min(1, "Date of birth is required"),
  gender: z.enum(genderOptions, { message: "Gender is required" }),
  phoneNumber: z
    .string()
    .trim()
    .min(9, "Phone number must be at least 9 digits")
    .max(15, "Phone number is too long")
    .regex(/^[0-9]+$/, "Phone number must contain digits only"),
  email: z.email("Invalid email").optional().or(z.literal("")),
  address: z.string().trim().min(1, "Address is required"),
  preferredLanguage: z.string().trim().min(1, "Preferred language is required"),
  nationality: z.string().trim().min(1, "Nationality is required"),
  emergencyContactName: z
    .string()
    .trim()
    .min(1, "Emergency contact name is required")
    .regex(NAME_RE, "Letters only"),
  emergencyContactRelationship: z
    .string()
    .trim()
    .min(1, "Emergency contact relationship is required")
    .regex(NAME_RE, "Letters only"),
  religion: z.string().trim().optional().or(z.literal("")),
});

export type PatientFormValues = z.infer<typeof patientSchema>;

/** Partial shape used for realtime broadcast — every field optional since it fires per-keystroke. */
export const patientFieldUpdateSchema = patientSchema.partial();

export type PatientFieldUpdate = z.infer<typeof patientFieldUpdateSchema>;
