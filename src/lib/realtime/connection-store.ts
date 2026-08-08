"use client";

import { useCallback, useEffect } from "react";
import { create } from "zustand";

import { ConnectionStatus } from "@/config/constants";
import { isSupabaseConfigured } from "@/lib/supabase/client";

type ConnectionState = {
  /** Status per subscribed channel — a page can hold several at once. */
  channels: Record<string, ConnectionStatus>;
  setChannelStatus: (key: string, status: ConnectionStatus) => void;
  clearChannel: (key: string) => void;
};

export const useConnectionStore = create<ConnectionState>((set) => ({
  channels: {},

  setChannelStatus: (key, status) =>
    set((state) => ({ channels: { ...state.channels, [key]: status } })),

  clearChannel: (key) =>
    set((state) => {
      if (!(key in state.channels)) return state;
      const rest = { ...state.channels };
      delete rest[key];
      return { channels: rest };
    }),
}));

/**
 * Registers one channel with the store for as long as the calling hook is
 * mounted, and hands back a reporter for its subscribe callback.
 */
export function useRealtimeConnectionReporter(key: string) {
  const setChannelStatus = useConnectionStore((state) => state.setChannelStatus);
  const clearChannel = useConnectionStore((state) => state.clearChannel);

  useEffect(() => {
    setChannelStatus(
      key,
      isSupabaseConfigured
        ? ConnectionStatus.CONNECTING
        : ConnectionStatus.DISCONNECTED,
    );
    return () => clearChannel(key);
  }, [key, setChannelStatus, clearChannel]);

  return useCallback(
    (status: ConnectionStatus) => setChannelStatus(key, status),
    [key, setChannelStatus],
  );
}

/**
 * One honest answer for the whole page: any channel down means the view can be
 * stale, so the worst status wins. Returns null when nothing is subscribed, so
 * the chrome can hide the indicator instead of claiming a state.
 */
export function useRealtimeConnection(): ConnectionStatus | null {
  const channels = useConnectionStore((state) => state.channels);
  const statuses = Object.values(channels);

  if (statuses.length === 0) return null;
  if (statuses.includes(ConnectionStatus.DISCONNECTED)) {
    return ConnectionStatus.DISCONNECTED;
  }
  if (statuses.includes(ConnectionStatus.CONNECTING)) {
    return ConnectionStatus.CONNECTING;
  }
  return ConnectionStatus.CONNECTED;
}
