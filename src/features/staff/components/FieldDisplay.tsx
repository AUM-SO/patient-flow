import { cn } from "@/lib/utils";
import { FIELD_HIGHLIGHT_MS } from "@/config/constants";
import { formatTimeAgo } from "@/features/staff/lib/relative-time";

type FieldDisplayProps = {
  label: string;
  value?: string;
  /** Epoch ms of the last change to this field, if it has changed at all. */
  updatedAt?: number;
  /** Ticking clock — drives both the highlight expiry and the "ago" label. */
  now: number;
  /** True while the patient's caret is in this field. */
  isTyping?: boolean;
};

export function FieldDisplay({
  label,
  value,
  updatedAt,
  now,
  isTyping = false,
}: FieldDisplayProps) {
  const isFresh = updatedAt !== undefined && now - updatedAt < FIELD_HIGHLIGHT_MS;

  return (
    <div
      className={cn(
        "-mx-2 flex min-w-0 flex-col gap-0.5 rounded-md px-2 py-1 transition-colors duration-500",
        isFresh && "bg-primary/10",
        isTyping && "ring-1 ring-primary/40",
      )}
    >
      <span className="flex items-center gap-1.5 text-sm text-muted-foreground">
        {label}
        {isTyping && (
          <span
            aria-hidden="true"
            className="size-1.5 animate-pulse rounded-full bg-primary"
          />
        )}
      </span>
      <span className="text-sm break-words">{value || "—"}</span>
      {updatedAt !== undefined && (
        <span className="text-xs text-muted-foreground/70">
          Updated {formatTimeAgo(updatedAt, now)}
        </span>
      )}
    </div>
  );
}
