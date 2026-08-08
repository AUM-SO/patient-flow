"use client";

import { cn } from "@/lib/utils";
import { ConnectionStatus } from "@/config/constants";
import { useRealtimeConnection } from "@/lib/realtime/connection-store";

const STATUS_TEXT: Record<ConnectionStatus, string> = {
  [ConnectionStatus.CONNECTING]: "Connecting…",
  [ConnectionStatus.CONNECTED]: "Live",
  [ConnectionStatus.DISCONNECTED]: "Reconnecting…",
};

const DOT_CLASS: Record<ConnectionStatus, string> = {
  [ConnectionStatus.CONNECTING]: "bg-muted-foreground animate-pulse",
  [ConnectionStatus.CONNECTED]: "bg-emerald-500",
  [ConnectionStatus.DISCONNECTED]: "bg-destructive animate-pulse",
};

/**
 * Page-level health of the realtime feed, meant for persistent chrome (nav bar
 * / page header) rather than any one card — a dropped websocket otherwise looks
 * exactly like a patient who stopped typing. Renders nothing until a channel is
 * actually subscribed.
 */
export function RealtimeStatus({ className }: { className?: string }) {
  const status = useRealtimeConnection();
  if (!status) return null;

  return (
    <span
      className={cn(
        "inline-flex items-center gap-1.5 text-xs whitespace-nowrap text-muted-foreground",
        className,
      )}
      role="status"
      aria-live="polite"
    >
      <span
        aria-hidden="true"
        className={cn("size-1.5 rounded-full", DOT_CLASS[status])}
      />
      {STATUS_TEXT[status]}
    </span>
  );
}
