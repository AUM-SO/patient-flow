"use client";

import { Sheet, SheetContent, SheetTitle } from "@/components/ui/overlay/sheet";
import { StaffDetailClient } from "@/features/staff/components/StaffDetailClient";

type SessionDetailSheetProps = {
  sessionId: string | null;
  onClose: () => void;
};

export function SessionDetailSheet({
  sessionId,
  onClose,
}: SessionDetailSheetProps) {
  return (
    <Sheet open={sessionId !== null} onOpenChange={(open) => !open && onClose()}>
      <SheetContent side="right" className="w-full overflow-y-auto sm:max-w-2xl">
        <SheetTitle className="sr-only">Session detail</SheetTitle>
        {sessionId && (
          <div className="px-6 pt-12 pb-6">
            <StaffDetailClient sessionId={sessionId} embedded />
          </div>
        )}
      </SheetContent>
    </Sheet>
  );
}
