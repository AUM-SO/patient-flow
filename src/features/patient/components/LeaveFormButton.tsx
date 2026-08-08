"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { ChevronsLeftIcon } from "lucide-react";
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
import { closeSession } from "@/features/shared/services/closeSession";

export function LeaveFormButton({ sessionId }: { sessionId: string }) {
  const router = useRouter();
  const [isLeaving, setIsLeaving] = useState(false);

  async function handleLeave() {
    setIsLeaving(true);
    try {
      await closeSession(sessionId);
    } catch {
      toast.error("Could not close the session, but you can still leave.");
    } finally {
      router.push("/");
    }
  }

  return (
    <AlertDialog>
      <AlertDialogTrigger
        render={
          <Button variant="ghost" size="sm">
            <ChevronsLeftIcon data-icon="inline-start" />
            Back
          </Button>
        }
      />
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Leave this form?</AlertDialogTitle>
          <AlertDialogDescription>
            Your progress won&apos;t be saved and this session will be closed. You&apos;ll need
            to start a new registration to try again.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>Stay</AlertDialogCancel>
          <AlertDialogAction
            variant="destructive"
            disabled={isLeaving}
            onClick={handleLeave}
          >
            {isLeaving ? "Leaving..." : "Leave"}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
