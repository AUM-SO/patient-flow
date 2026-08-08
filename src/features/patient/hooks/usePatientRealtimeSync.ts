"use client";

import { useEffect, useRef, useState } from "react";
import type { UseFormWatch } from "react-hook-form";

import {
  getSessionChannel,
  REALTIME_EVENTS,
  type SessionPresence,
} from "@/lib/realtime/session-channel";
import {
  ConnectionStatus,
  FIELD_UPDATE_DEBOUNCE_MS,
  PRESENCE_IDLE_TIMEOUT_MS,
  PresenceStatus,
} from "@/config/constants";
import { useRealtimeConnectionReporter } from "@/lib/realtime/connection-store";
import type { PatientFormValues } from "@/features/shared/validation/patient-schema";

export function usePatientRealtimeSync(
  sessionId: string,
  watch: UseFormWatch<PatientFormValues>,
) {
  const channelRef = useRef<ReturnType<typeof getSessionChannel> | null>(null);
  const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const idleRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const setConnection = useRealtimeConnectionReporter(`session:${sessionId}`);
  /** Set when staff retire the session — the form locks and cannot submit. */
  const [isClosed, setIsClosed] = useState(false);
  // Mirrored in a ref so the watch subscription below, which is set up once,
  // can stop broadcasting without being torn down and rebuilt.
  const isClosedRef = useRef(false);

  useEffect(() => {
    // getSessionChannel() throws if Supabase env vars aren't configured yet.
    // Realtime sync is a progressive enhancement here — the form must still
    // work (and submitPatient() still runs) without it.
    let channel: ReturnType<typeof getSessionChannel> | null = null;
    try {
      channel = getSessionChannel(sessionId);
      channelRef.current = channel;
      channel.on("broadcast", { event: REALTIME_EVENTS.SESSION_CLOSED }, () => {
        isClosedRef.current = true;
        setIsClosed(true);
      });
      channel.subscribe((status) => {
        if (status === "SUBSCRIBED") {
          setConnection(ConnectionStatus.CONNECTED);
          channel?.track({ status: PresenceStatus.IDLE } satisfies SessionPresence);
          return;
        }
        if (status === "CHANNEL_ERROR" || status === "TIMED_OUT" || status === "CLOSED") {
          setConnection(ConnectionStatus.DISCONNECTED);
        }
      });
    } catch {
      channelRef.current = null;
    }

    return () => {
      if (debounceRef.current) clearTimeout(debounceRef.current);
      if (idleRef.current) clearTimeout(idleRef.current);
      channel?.unsubscribe();
      channelRef.current = null;
    };
  }, [sessionId, setConnection]);

  useEffect(() => {
    const subscription = watch((values, { name }) => {
      const channel = channelRef.current;
      if (!channel || isClosedRef.current) return;

      if (debounceRef.current) clearTimeout(debounceRef.current);
      debounceRef.current = setTimeout(() => {
        channel.send({
          type: "broadcast",
          event: REALTIME_EVENTS.FIELD_UPDATE,
          payload: { fields: values },
        });
      }, FIELD_UPDATE_DEBOUNCE_MS);

      // `name` tells staff which field is being typed into, not just that
      // someone is typing somewhere in the form.
      channel.track({
        status: PresenceStatus.TYPING,
        field: name,
      } satisfies SessionPresence);
      if (idleRef.current) clearTimeout(idleRef.current);
      idleRef.current = setTimeout(() => {
        channel.track({ status: PresenceStatus.IDLE } satisfies SessionPresence);
      }, PRESENCE_IDLE_TIMEOUT_MS);
    });

    return () => subscription.unsubscribe();
  }, [watch]);

  function markSubmitted() {
    const channel = channelRef.current;
    if (!channel) return;
    channel.track({ status: PresenceStatus.SUBMITTED } satisfies SessionPresence);
    channel.send({ type: "broadcast", event: REALTIME_EVENTS.SUBMITTED, payload: {} });
  }

  return { markSubmitted, isClosed };
}
