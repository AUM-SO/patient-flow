import { create } from "zustand";

import type { PresenceStatus, SessionStatus } from "@/config/constants";
import type {
  PatientFieldUpdate,
  PatientFormValues,
} from "@/features/shared/validation/patient-schema";

export type PatientFieldName = keyof PatientFormValues;

export type SessionRecord = {
  id: string;
  status: SessionStatus;
  createdAt: string;
  updatedAt: string;
  /** Populated once the detail page's realtime channel starts receiving broadcasts. */
  fields?: PatientFieldUpdate;
  /** Epoch ms of the last change per field — drives the "just updated" highlight. */
  fieldUpdatedAt?: Partial<Record<PatientFieldName, number>>;
  presence?: PresenceStatus;
  /** Field the patient is currently typing into, if any. */
  presenceField?: PatientFieldName;
};

type SessionsState = {
  sessions: Record<string, SessionRecord>;
  setSessions: (sessions: SessionRecord[]) => void;
  upsertSession: (session: SessionRecord) => void;
  applyFieldUpdate: (sessionId: string, fields: PatientFieldUpdate) => void;
  setSessionStatus: (sessionId: string, status: SessionStatus) => void;
  setPresence: (
    sessionId: string,
    presence: PresenceStatus,
    field?: PatientFieldName,
  ) => void;
};

export const useSessionsStore = create<SessionsState>((set) => ({
  sessions: {},

  setSessions: (sessions) =>
    set((state) => ({
      sessions: Object.fromEntries(
        sessions.map((session) => [
          session.id,
          { ...state.sessions[session.id], ...session },
        ])
      ),
    })),

  upsertSession: (session) =>
    set((state) => ({
      sessions: {
        ...state.sessions,
        [session.id]: { ...state.sessions[session.id], ...session },
      },
    })),

  applyFieldUpdate: (sessionId, fields) =>
    set((state) => {
      const existing = state.sessions[sessionId];
      if (!existing) return state;

      // The broadcast carries the whole form, so stamp only the keys whose
      // value actually moved — otherwise every keystroke would flash all 13.
      const now = Date.now();
      const fieldUpdatedAt = { ...existing.fieldUpdatedAt };
      for (const [key, value] of Object.entries(fields)) {
        const name = key as PatientFieldName;
        if (existing.fields?.[name] !== value) fieldUpdatedAt[name] = now;
      }

      return {
        sessions: {
          ...state.sessions,
          [sessionId]: {
            ...existing,
            fields: { ...existing.fields, ...fields },
            fieldUpdatedAt,
          },
        },
      };
    }),

  setSessionStatus: (sessionId, status) =>
    set((state) => {
      const existing = state.sessions[sessionId];
      if (!existing) return state;
      return {
        sessions: {
          ...state.sessions,
          [sessionId]: { ...existing, status, updatedAt: new Date().toISOString() },
        },
      };
    }),

  setPresence: (sessionId, presence, field) =>
    set((state) => {
      const existing = state.sessions[sessionId];
      if (!existing) return state;
      return {
        sessions: {
          ...state.sessions,
          [sessionId]: { ...existing, presence, presenceField: field },
        },
      };
    }),
}));
