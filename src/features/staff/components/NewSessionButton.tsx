"use client";

import { useState } from "react";
import { QrCodeIcon } from "lucide-react";

import { Button } from "@/components/ui/form/button";
import { SessionLinkDialog } from "@/components/common/SessionLinkDialog";

/**
 * Mints a session id up front so staff can hand the form to a patient's phone
 * without leaving the dashboard. The row itself is created by the patient tab.
 */
export function NewSessionButton() {
  const [sessionId, setSessionId] = useState<string | null>(null);

  return (
    <>
      <Button
        type="button"
        size="sm"
        className={"px-4 py-4"}
        onClick={() => setSessionId(crypto.randomUUID())}
      >
        <QrCodeIcon data-icon="inline-start" />
        New session
      </Button>

      <SessionLinkDialog
        sessionId={sessionId}
        open={sessionId !== null}
        onOpenChange={(open) => !open && setSessionId(null)}
      />
    </>
  );
}
