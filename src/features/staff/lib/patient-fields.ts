import type { PatientFieldName } from "@/features/staff/store/useSessionsStore";

/**
 * Single source for how patient data is presented on the staff side — drives
 * the detail layout and the "typing in <field>" presence label.
 */
export const PATIENT_FIELD_SECTIONS: {
  title: string;
  fields: { name: PatientFieldName; label: string }[];
}[] = [
  {
    title: "Personal Information",
    fields: [
      { name: "firstName", label: "First name" },
      { name: "middleName", label: "Middle name" },
      { name: "lastName", label: "Last name" },
      { name: "dateOfBirth", label: "Date of birth" },
      { name: "gender", label: "Gender" },
    ],
  },
  {
    title: "Contact Information",
    fields: [
      { name: "phoneNumber", label: "Phone number" },
      { name: "email", label: "Email" },
      { name: "address", label: "Address" },
      { name: "preferredLanguage", label: "Preferred language" },
      { name: "nationality", label: "Nationality" },
    ],
  },
  {
    title: "Emergency Contact",
    fields: [
      { name: "emergencyContactName", label: "Contact name" },
      { name: "emergencyContactRelationship", label: "Relationship" },
      { name: "religion", label: "Religion" },
    ],
  },
];

export const PATIENT_FIELD_LABELS = Object.fromEntries(
  PATIENT_FIELD_SECTIONS.flatMap((section) =>
    section.fields.map((field) => [field.name, field.label]),
  ),
) as Record<PatientFieldName, string>;

export const PATIENT_FIELD_COUNT = Object.keys(PATIENT_FIELD_LABELS).length;
