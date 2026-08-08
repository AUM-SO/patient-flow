export const FIELD_UPDATE_DEBOUNCE_MS = 250;
export const PRESENCE_IDLE_TIMEOUT_MS = 3000;
/** How long a staff-side field stays visually highlighted after it changes. */
export const FIELD_HIGHLIGHT_MS = 2000;

export const SessionStatus = {
  ACTIVE: "active",
  SUBMITTED: "submitted",
  CLOSED: "closed",
} as const;

export type SessionStatus = (typeof SessionStatus)[keyof typeof SessionStatus];

export const PresenceStatus = {
  TYPING: "typing",
  IDLE: "idle",
  SUBMITTED: "submitted",
} as const;

export type PresenceStatus = (typeof PresenceStatus)[keyof typeof PresenceStatus];

export const ConnectionStatus = {
  CONNECTING: "connecting",
  CONNECTED: "connected",
  DISCONNECTED: "disconnected",
} as const;

export type ConnectionStatus =
  (typeof ConnectionStatus)[keyof typeof ConnectionStatus];
