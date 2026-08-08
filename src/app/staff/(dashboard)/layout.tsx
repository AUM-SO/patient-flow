import { redirect } from "next/navigation";

import { RealtimeStatus } from "@/components/common/RealtimeStatus";
import { Separator } from "@/components/ui/layout/separator";
import { SidebarInset, SidebarProvider, SidebarTrigger } from "@/components/ui/layout/sidebar";
import { StaffBreadcrumb } from "@/features/staff/components/StaffBreadcrumb";
import { StaffSidebar } from "@/features/staff/components/StaffSidebar";
import { createClient } from "@/lib/supabase/server";

export default async function StaffDashboardLayout({ children }: { children: React.ReactNode }) {
  // proxy.ts already guards this route tree, but this layout also needs the
  // user's email to render — if Supabase is unreachable here, send back to
  // login rather than rendering a shell with no identity.
  let userEmail: string | null = null;
  try {
    const supabase = await createClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();
    userEmail = user?.email ?? null;
  } catch {
    userEmail = null;
  }

  if (!userEmail) {
    redirect("/staff/login");
  }

  return (
    <SidebarProvider>
      <StaffSidebar userEmail={userEmail} />
      <SidebarInset>
        <header className="sticky top-0 flex shrink-0 items-center gap-2 border-b bg-background p-4">
          <SidebarTrigger className="-ml-1" />
          <Separator orientation="vertical" className="mr-2 data-vertical:h-4 data-vertical:self-auto" />
          <StaffBreadcrumb />
          {/* <RealtimeStatus className="ml-auto" /> */}
        </header>
        <div className="flex flex-1 flex-col p-4 md:p-6">{children}</div>
      </SidebarInset>
    </SidebarProvider>
  );
}
