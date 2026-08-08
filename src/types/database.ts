/**
 * Hand-written to match supabase/schema.sql until `supabase gen types typescript`
 * can run against the real project (needs `supabase link` + project ref).
 */
export type Database = {
  public: {
    Tables: {
      sessions: {
        Row: {
          id: string;
          status: "active" | "submitted" | "closed";
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          status?: "active" | "submitted" | "closed";
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          status?: "active" | "submitted" | "closed";
          created_at?: string;
          updated_at?: string;
        };
        Relationships: [];
      };
      patients: {
        Row: {
          session_id: string;
          first_name: string | null;
          middle_name: string | null;
          last_name: string | null;
          date_of_birth: string | null;
          gender: string | null;
          phone_number: string | null;
          email: string | null;
          address: string | null;
          preferred_language: string | null;
          nationality: string | null;
          emergency_contact_name: string | null;
          emergency_contact_relationship: string | null;
          religion: string | null;
          submitted_at: string | null;
        };
        Insert: Partial<
          Omit<Database["public"]["Tables"]["patients"]["Row"], "session_id">
        > & {
          session_id: string;
        };
        Update: Partial<Database["public"]["Tables"]["patients"]["Row"]>;
        Relationships: [];
      };
    };
    Views: Record<string, never>;
    Functions: {
      set_session_status: {
        Args: {
          p_session_id: string;
          p_status: "active" | "submitted" | "closed";
        };
        Returns: void;
      };
      create_session: {
        Args: {
          p_session_id: string;
        };
        Returns: void;
      };
      submit_patient: {
        Args: {
          p_session_id: string;
          p_first_name: string;
          p_middle_name: string | null;
          p_last_name: string;
          p_date_of_birth: string;
          p_gender: string;
          p_phone_number: string;
          p_email: string | null;
          p_address: string;
          p_preferred_language: string;
          p_nationality: string;
          p_emergency_contact_name: string;
          p_emergency_contact_relationship: string;
          p_religion: string | null;
        };
        Returns: void;
      };
    };
  };
};
