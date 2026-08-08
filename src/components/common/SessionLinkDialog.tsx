"use client";

import { useEffect, useState } from "react";
import { QRCodeSVG } from "qrcode.react";
import { CheckIcon, CopyIcon } from "lucide-react";

import { Button } from "@/components/ui/form/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/overlay/dialog";
import { Input } from "@/components/ui/form/input";

const COPIED_RESET_MS = 2000;

/**
 * Hands a session off to the patient's own device. The intake tablet stays on
 * the staff console while the patient scans and fills the form on their phone.
 */
export function SessionLinkDialog({
  sessionId,
  open,
  onOpenChange,
}: {
  sessionId: string | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}) {
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    if (!copied) return;
    const id = setTimeout(() => setCopied(false), COPIED_RESET_MS);
    return () => clearTimeout(id);
  }, [copied]);

  if (!sessionId) return null;

  // Safe to read during render: the dialog body only mounts once `open` is
  // true, which cannot happen before hydration.
  const path = `/patient/${sessionId}`;
  const url =
    typeof window === "undefined" ? path : `${window.location.origin}${path}`;

  async function copyLink() {
    try {
      await navigator.clipboard.writeText(url);
      setCopied(true);
    } catch {
      // Clipboard blocked (insecure origin or denied permission) — the input
      // next to the button is selectable, so there is still a way to copy.
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-sm">
        <DialogHeader>
          <DialogTitle>Open on the patient&apos;s device</DialogTitle>
          <DialogDescription>
            Scan this code, or send the link. Anything typed there shows up here
            live.
          </DialogDescription>
        </DialogHeader>

        <div className="flex flex-col items-center gap-6">
          <div className="rounded-lg bg-white p-3 ring-1 ring-border">
            <QRCodeSVG value={url} size={168} marginSize={0} />
          </div>

          <div className="flex w-full items-center gap-4">
            <Input readOnly value={url} className="font-mono text-xs" />
            <Button
              type="button"
              variant="outline"
              size="icon"
              onClick={copyLink}
              aria-label={copied ? "Link copied" : "Copy link"}
            >
              {copied ? <CheckIcon /> : <CopyIcon />}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
