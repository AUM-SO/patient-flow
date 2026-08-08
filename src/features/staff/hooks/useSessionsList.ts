"use client";

import { useCallback, useEffect, useState } from "react";

import { createClient } from "@/lib/supabase/client";
import { useRealtimeConnectionReporter } from "@/lib/realtime/connection-store";
import { fetchSessions } from "@/features/staff/services/fetchSessions";
import { useSessionsStore } from "@/features/staff/store/useSessionsStore";
import { ConnectionStatus, type SessionStatus } from "@/config/constants";

const SESSIONS_CHANNEL = "sessions-changes";

type SessionRow = {
  id: string;
  status: SessionStatus;
  created_at: string;
  updated_at: string;
};

export function useSessionsList() {
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(false);
  const setConnection = useRealtimeConnectionReporter(SESSIONS_CHANNEL);
  const sessions = useSessionsStore((state) => state.sessions);
  const setSessions = useSessionsStore((state) => state.setSessions);
  const upsertSession = useSessionsStore((state) => state.upsertSession);

  const load = useCallback(
    ({ initial }: { initial: boolean }) => {
      let cancelled = false;

      fetchSessions()
        .then((rows) => {
          if (cancelled) return;
          setSessions(rows);
          setError(false);
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
    [setSessions],
  );

  useEffect(() => {
    let cancelled = false;
    let channel: ReturnType<ReturnType<typeof createClient>["channel"]> | null = null;

    const cancelLoad = load({ initial: true });
    // Rows inserted while the socket was down never arrive as changes, so a
    // reconnect has to re-read the table.
    let wasDisconnected = false;
    let cancelReload: (() => void) | null = null;

    async function subscribe() {
      try {
        const supabase = createClient();
        // Realtime's postgres_changes authorizes each subscribe using the
        // client's current JWT (RLS requires role=authenticated to read
        // sessions). Subscribing before the session is loaded from cookies
        // can join as anon and get silently RLS-filtered — wait for auth
        // to resolve first so the channel joins with the right role.
        await supabase.auth.getSession();
        if (cancelled) return;

        channel = supabase
          .channel(SESSIONS_CHANNEL)
          .on<SessionRow>(
            "postgres_changes",
            { event: "*", schema: "public", table: "sessions" },
            (payload) => {
              const row = payload.new as SessionRow;
              if (!row?.id) return;
              upsertSession({
                id: row.id,
                status: row.status,
                createdAt: row.created_at,
                updatedAt: row.updated_at,
              });
            }
          )
          .subscribe((status, err) => {
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
              if (err) console.error(`[${SESSIONS_CHANNEL}] realtime subscribe failed:`, status, err);
            }
          });
      } catch {
        // Live updates unavailable (Supabase not configured) — the initial
        // fetch above still ran, so the list just won't auto-refresh.
      }
    }

    subscribe();

    return () => {
      cancelled = true;
      cancelLoad();
      cancelReload?.();
      channel?.unsubscribe();
    };
  }, [load, upsertSession, setConnection]);

  const sessionList = Object.values(sessions).sort(
    (a, b) => new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime()
  );

  return { sessions: sessionList, isLoading, error };
}
