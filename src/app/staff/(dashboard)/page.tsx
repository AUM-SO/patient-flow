import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/layout/card";
import { NewSessionButton } from "@/features/staff/components/NewSessionButton";
import { SessionList } from "@/features/staff/components/SessionList";

export default function StaffDashboardPage() {
  return (
    <Card>
      <CardHeader className="flex flex-wrap items-start justify-between gap-3">
        <div className="flex flex-col gap-1.5">
          <CardTitle className="text-xl md:text-2xl">Active Sessions</CardTitle>
          <CardDescription className="text-base">
            Live list of patient registration sessions.
          </CardDescription>
        </div>
        <NewSessionButton />
      </CardHeader>
      <CardContent>
        <SessionList />
      </CardContent>
    </Card>
  );
}
