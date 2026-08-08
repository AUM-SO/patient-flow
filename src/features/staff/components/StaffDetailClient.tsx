"use client";

import { notFound } from "next/navigation";

import { cn } from "@/lib/utils";
import { useNow } from "@/hooks/use-now";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/layout/card";
import { Skeleton } from "@/components/ui/feedback/skeleton";
import { Separator } from "@/components/ui/layout/separator";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/feedback/alert";
import { PresenceStatus } from "@/config/constants";
import { useStaffRealtimeSync } from "@/features/staff/hooks/useStaffRealtimeSync";
import { CloseSessionButton } from "@/features/staff/components/CloseSessionButton";
import { FieldDisplay } from "@/features/staff/components/FieldDisplay";
import { SessionStatusBadge, PresenceIndicator } from "@/features/staff/components/StatusIndicator";
import { PATIENT_FIELD_SECTIONS } from "@/features/staff/lib/patient-fields";

function SectionLabel({ children }: { children: React.ReactNode }) {
  return (
    <h3 className="mb-4 text-xs font-semibold tracking-wide text-muted-foreground uppercase">
      {children}
    </h3>
  );
}

function FieldSkeleton() {
  return (
    <div className="flex flex-col gap-1.5">
      <Skeleton className="h-3.5 w-20" />
      <Skeleton className="h-5 w-3/4" />
    </div>
  );
}

function SectionSkeleton({ fieldCount }: { fieldCount: number }) {
  return (
    <div>
      <Skeleton className="mb-4 h-3 w-32" />
      <div className="grid grid-cols-1 gap-x-4 gap-y-5 sm:grid-cols-2">
        {Array.from({ length: fieldCount }).map((_, i) => (
          <FieldSkeleton key={i} />
        ))}
      </div>
    </div>
  );
}

const bodySkeleton = (
  <div className="flex flex-col gap-6">
    {PATIENT_FIELD_SECTIONS.map((section, i) => (
      <div key={section.title} className="flex flex-col gap-6">
        {i > 0 && <Separator />}
        <SectionSkeleton fieldCount={section.fields.length} />
      </div>
    ))}
  </div>
);

export function StaffDetailClient({
  sessionId,
  embedded = false,
}: {
  sessionId: string;
  embedded?: boolean;
}) {
  const {
    session,
    isLoading,
    notFound: sessionNotFound,
    error,
    broadcastSessionClosed,
  } = useStaffRealtimeSync(sessionId);
  const now = useNow();

  if (sessionNotFound) {
    if (!embedded) notFound();
    return (
      <Alert variant="destructive">
        <AlertTitle>Session not found</AlertTitle>
        <AlertDescription>This session may have been removed.</AlertDescription>
      </Alert>
    );
  }

  if (!isLoading && error && !session) {
    return (
      <Alert variant="destructive" className={cn(!embedded && "mx-auto w-full max-w-3xl")}>
        <AlertTitle>Could not load this session</AlertTitle>
        <AlertDescription>Check the Supabase connection and refresh the page.</AlertDescription>
      </Alert>
    );
  }

  if (isLoading || !session) {
    if (embedded) {
      return (
        <div className="flex flex-col gap-6">
          <div className="flex flex-wrap items-center justify-between gap-2">
            <Skeleton className="h-6 w-40" />
            <div className="flex gap-2">
              <Skeleton className="h-5 w-16 rounded-full" />
              <Skeleton className="h-5 w-14 rounded-full" />
            </div>
          </div>
          <Separator />
          {bodySkeleton}
        </div>
      );
    }
    return (
      <Card className="mx-auto w-full max-w-3xl">
        <CardHeader className="flex items-center justify-between px-6 pt-6 md:px-8 md:pt-8">
          <Skeleton className="h-7 w-48" />
          <div className="flex gap-2">
            <Skeleton className="h-5.5 w-16 rounded-full" />
            <Skeleton className="h-5.5 w-14 rounded-full" />
          </div>
        </CardHeader>
        <CardContent className="flex flex-col gap-6 px-6 pb-6 md:px-8 md:pb-8">
          {bodySkeleton}
        </CardContent>
      </Card>
    );
  }

  const fields = session.fields;
  const fullName =
    fields?.firstName || fields?.lastName
      ? `${fields.firstName ?? ""} ${fields.lastName ?? ""}`.trim()
      : "Patient session";
  const typingField =
    session.presence === PresenceStatus.TYPING ? session.presenceField : undefined;

  const body = (
    <div className="flex flex-col gap-6">
      {PATIENT_FIELD_SECTIONS.map((section, i) => (
        <div key={section.title} className="flex flex-col gap-6">
          {i > 0 && <Separator />}
          <div>
            <SectionLabel>{section.title}</SectionLabel>
            <div className="grid grid-cols-1 gap-x-4 gap-y-3 sm:grid-cols-2">
              {section.fields.map((field) => (
                <FieldDisplay
                  key={field.name}
                  label={field.label}
                  value={fields?.[field.name]}
                  updatedAt={session.fieldUpdatedAt?.[field.name]}
                  now={now}
                  isTyping={typingField === field.name}
                />
              ))}
            </div>
          </div>
        </div>
      ))}
    </div>
  );

  const statusRow = (
    <div className="flex flex-wrap items-center gap-3">
      <SessionStatusBadge status={session.status} />
      <PresenceIndicator presence={session.presence} field={session.presenceField} />
      <CloseSessionButton
        sessionId={sessionId}
        status={session.status}
        onClosed={broadcastSessionClosed}
      />
    </div>
  );

  if (embedded) {
    return (
      <div className="flex flex-col gap-6">
        <div className="flex flex-wrap items-center justify-between gap-2">
          <h2 className="text-lg font-semibold">{fullName}</h2>
          {statusRow}
        </div>
        <Separator />
        {body}
      </div>
    );
  }

  return (
    <Card className="mx-auto w-full max-w-3xl">
      <CardHeader className="flex flex-wrap items-center justify-between gap-2 px-6 pt-6 md:px-8 md:pt-8">
        <CardTitle className="text-xl md:text-2xl">{fullName}</CardTitle>
        {statusRow}
      </CardHeader>
      <CardContent className="flex flex-col gap-6 px-6 pb-6 md:px-8 md:pb-8">{body}</CardContent>
    </Card>
  );
}
