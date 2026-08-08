"use client";

import { useState } from "react";
import { CircleSlashIcon } from "lucide-react";
import { toast } from "sonner";

import { Button } from "@/components/ui/form/button";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/overlay/alert-dialog";
import { SessionStatus } from "@/config/constants";
import { closeSession } from "@/features/shared/services/closeSession";
import { useSessionsStore } from "@/features/staff/store/useSessionsStore";

/**
 * Lets staff retire an abandoned session. Without it `closed` only ever came
 * from the patient tab, so stale rows piled up in the dashboard forever.
 */
export function CloseSessionButton({
  sessionId,
  status,
  onClosed,
}: {
  sessionId: string;
  status: SessionStatus;
  /** Fired after the row is closed — used to tell the patient tab to lock. */
  onClosed?: () => Promise<void> | void;
}) {
  const [isClosing, setIsClosing] = useState(false);
  const [open, setOpen] = useState(false);
  const setSessionStatus = useSessionsStore((state) => state.setSessionStatus);

  if (status === SessionStatus.CLOSED) return null;

  async function handleClose() {
    setIsClosing(true);
    try {
      await closeSession(sessionId);
      // Postgres Changes will confirm this shortly; update now so the button
      // and badge don't lag behind the click.
      setSessionStatus(sessionId, SessionStatus.CLOSED);

      // Best effort — the row is already closed, so a failed notification must
      // not read as a failed close.
      try {
        await onClosed?.();
      } catch {
        // Patient tab keeps its stale form until it reloads.
      }

      setOpen(false);
      toast.success("Session closed.");
    } catch {
      toast.error("Could not close this session. Please try again.");
    } finally {
      setIsClosing(false);
    }
  }

  return (
    <AlertDialog open={open} onOpenChange={setOpen}>
      <AlertDialogTrigger
        render={
          <Button variant="outline" size="sm">
            <CircleSlashIcon data-icon="inline-start" />
            Close session
          </Button>
        }
      />
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Close this session?</AlertDialogTitle>
          <AlertDialogDescription>
            {status === SessionStatus.SUBMITTED
              ? "The submitted record stays available. The session is just marked as finished."
              : "The patient will no longer be able to submit this form. Anything they have typed but not submitted is discarded."}
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>Cancel</AlertDialogCancel>
          <AlertDialogAction
            variant="destructive"
            disabled={isClosing}
            onClick={handleClose}
          >
            {isClosing ? "Closing..." : "Close session"}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
