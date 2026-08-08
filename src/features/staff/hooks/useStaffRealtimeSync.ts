"use client";

import { useCallback, useEffect, useRef, useState } from "react";

import {
  getSessionChannel,
  REALTIME_EVENTS,
  type FieldUpdateBroadcast,
  type SessionPresence,
} from "@/lib/realtime/session-channel";
import { fetchSessionDetail } from "@/features/staff/services/fetchSessionDetail";
import { useSessionsStore } from "@/features/staff/store/useSessionsStore";
import { useRealtimeConnectionReporter } from "@/lib/realtime/connection-store";
import { ConnectionStatus, PresenceStatus } from "@/config/constants";

export function useStaffRealtimeSync(sessionId: string) {
  const [isLoading, setIsLoading] = useState(true);
  const [notFound, setNotFound] = useState(false);
  const [error, setError] = useState(false);
  const setConnection = useRealtimeConnectionReporter(`session:${sessionId}`);
  const channelRef = useRef<ReturnType<typeof getSessionChannel> | null>(null);
  const session = useSessionsStore((state) => state.sessions[sessionId]);
  const upsertSession = useSessionsStore((state) => state.upsertSession);
  const applyFieldUpdate = useSessionsStore((state) => state.applyFieldUpdate);
  const setPresence = useSessionsStore((state) => state.setPresence);

  const load = useCallback(
    ({ initial }: { initial: boolean }) => {
      let cancelled = false;

      fetchSessionDetail(sessionId)
        .then((record) => {
          if (cancelled) return;
          setError(false);
          if (!record) {
            setNotFound(true);
            return;
          }
          upsertSession(record);
        })
        .catch(() => {
          if (!cancelled) setError(true);
        })
        .finally(() => {
          if (!cancelled && initial) setIsLoading(false);
        });

      return () => {
        cancelled = true;
      };
    },
    [sessionId, upsertSession],
  );

  useEffect(() => {
    const cancelLoad = load({ initial: true });

    // Broadcasts sent while the socket was down are gone for good, so a
    // re-subscribe has to re-read the row to catch up.
    let wasDisconnected = false;
    let cancelReload: (() => void) | null = null;

    let channel: ReturnType<typeof getSessionChannel> | null = null;
    try {
      channel = getSessionChannel(sessionId);
      channelRef.current = channel;
      channel
        .on("broadcast", { event: REALTIME_EVENTS.FIELD_UPDATE }, ({ payload }) => {
          applyFieldUpdate(sessionId, (payload as FieldUpdateBroadcast).fields);
        })
        .on("broadcast", { event: REALTIME_EVENTS.SUBMITTED }, () => {
          setPresence(sessionId, PresenceStatus.SUBMITTED);
        })
        .on("presence", { event: "sync" }, () => {
          const state = channel?.presenceState<SessionPresence>();
          const [first] = Object.values(state ?? {}).flat();
          if (first) setPresence(sessionId, first.status, first.field);
        })
        .subscribe((status) => {
          if (status === "SUBSCRIBED") {
            setConnection(ConnectionStatus.CONNECTED);
            if (wasDisconnected) {
              wasDisconnected = false;
              cancelReload?.();
              cancelReload = load({ initial: false });
            }
            return;
          }
          if (status === "CHANNEL_ERROR" || status === "TIMED_OUT" || status === "CLOSED") {
            wasDisconnected = true;
            setConnection(ConnectionStatus.DISCONNECTED);
          }
        });
    } catch {
      // Realtime unavailable — detail view still shows the last fetched state.
    }

    return () => {
      cancelLoad();
      cancelReload?.();
      channel?.unsubscribe();
      channelRef.current = null;
    };
  }, [sessionId, load, applyFieldUpdate, setPresence, setConnection]);

  /**
   * Sent over the channel this hook already owns — the patient tab cannot read
   * `sessions` (RLS is staff-only for SELECT), so a broadcast is the only way
   * it learns the session was retired.
   */
  const broadcastSessionClosed = useCallback(async () => {
    await channelRef.current?.send({
      type: "broadcast",
      event: REALTIME_EVENTS.SESSION_CLOSED,
      payload: {},
    });
  }, []);

  return { session, isLoading, notFound, error, broadcastSessionClosed };
}
