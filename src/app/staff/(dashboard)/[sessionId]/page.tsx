import { notFound } from "next/navigation";

import { StaffDetailClient } from "@/features/staff/components/StaffDetailClient";
import { isValidUuid } from "@/lib/utils";

export default async function StaffSessionDetailPage({
  params,
}: {
  params: Promise<{ sessionId: string }>;
}) {
  const { sessionId } = await params;

  if (!isValidUuid(sessionId)) {
    notFound();
  }

  return <StaffDetailClient sessionId={sessionId} />;
}
