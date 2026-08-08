import { Badge } from "@/components/ui/data/badge";
import { cn } from "@/lib/utils";
import { PresenceStatus, SessionStatus } from "@/config/constants";
import { PATIENT_FIELD_LABELS } from "@/features/staff/lib/patient-fields";
import type { PatientFieldName } from "@/features/staff/store/useSessionsStore";

const STATUS_LABEL: Record<SessionStatus, string> = {
  [SessionStatus.ACTIVE]: "Active",
  [SessionStatus.SUBMITTED]: "Submitted",
  [SessionStatus.CLOSED]: "Closed",
};

const STATUS_VARIANT: Record<
  SessionStatus,
  "default" | "secondary" | "outline" | "destructive"
> = {
  [SessionStatus.ACTIVE]: "outline",
  [SessionStatus.SUBMITTED]: "default",
  [SessionStatus.CLOSED]: "secondary",
};

const PRESENCE_LABEL: Record<PresenceStatus, string> = {
  [PresenceStatus.TYPING]: "Typing…",
  [PresenceStatus.IDLE]: "Idle",
  [PresenceStatus.SUBMITTED]: "Submitted",
};

const PRESENCE_DOT_CLASS: Record<PresenceStatus, string> = {
  [PresenceStatus.TYPING]: "bg-primary animate-pulse",
  [PresenceStatus.IDLE]: "bg-muted-foreground",
  [PresenceStatus.SUBMITTED]: "bg-emerald-500",
};

export function SessionStatusBadge({ status }: { status: SessionStatus }) {
  return <Badge variant={STATUS_VARIANT[status]}>{STATUS_LABEL[status]}</Badge>;
}

/**
 * A live, ambient signal (is the patient typing right now?) — deliberately
 * styled as a quiet dot + text rather than a Badge, so it doesn't compete
 * visually with SessionStatusBadge's actual record status.
 */
export function PresenceIndicator({
  presence,
  field,
}: {
  presence?: PresenceStatus;
  field?: PatientFieldName;
}) {
  if (!presence) return null;
  const isTyping = presence === PresenceStatus.TYPING;
  const label =
    isTyping && field
      ? `Typing: ${PATIENT_FIELD_LABELS[field]}`
      : PRESENCE_LABEL[presence];

  return (
    <span className="inline-flex items-center gap-1.5 text-xs whitespace-nowrap text-muted-foreground">
      <span
        aria-hidden="true"
        className={cn("size-1.5 rounded-full", PRESENCE_DOT_CLASS[presence])}
      />
      {label}
    </span>
  );
}
