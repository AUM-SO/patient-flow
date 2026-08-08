import { notFound } from "next/navigation";

import { LeaveFormButton } from "@/features/patient/components/LeaveFormButton";
import { PatientFormClient } from "@/features/patient/components/PatientFormClient";
import Grainient from "@/components/common/Grainient";
import { RealtimeStatus } from "@/components/common/RealtimeStatus";
import { isValidUuid } from "@/lib/utils";

export default async function PatientPage({
  params,
}: {
  params: Promise<{ sessionId: string }>;
}) {
  const { sessionId } = await params;

  if (!isValidUuid(sessionId)) {
    notFound();
  }

  return (
    <div className="relative flex flex-1 flex-col items-center gap-4 p-6">
      <Grainient
        className="!fixed inset-0 -z-10 blur-[0.2px] max-h-[45vh] rounded-md"
        color1="#c2c4c9"
        color2="#3e7eec"
        color3="#92afdd"
      />
      <div className="flex w-full max-w-3xl items-center justify-between gap-3">
        <LeaveFormButton sessionId={sessionId} />
        <RealtimeStatus />
      </div>
      <div className="w-full max-w-3xl">
        <PatientFormClient sessionId={sessionId} />
      </div>
    </div>
  );
}
