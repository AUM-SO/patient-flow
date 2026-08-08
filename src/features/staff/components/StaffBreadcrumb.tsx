"use client";

import { usePathname } from "next/navigation";

import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/layout/breadcrumb";

export function StaffBreadcrumb() {
  const pathname = usePathname();
  const segments = pathname.split("/").filter(Boolean); // ["staff"] or ["staff", "<id>"]
  const sessionId = segments[1];

  return (
    <Breadcrumb>
      <BreadcrumbList>
        <BreadcrumbItem>
          {sessionId ? (
            <BreadcrumbLink href="/staff">Sessions</BreadcrumbLink>
          ) : (
            <BreadcrumbPage>Sessions</BreadcrumbPage>
          )}
        </BreadcrumbItem>
        {sessionId && (
          <>
            <BreadcrumbSeparator />
            <BreadcrumbItem>
              <BreadcrumbPage className="font-mono">{sessionId.slice(0, 8)}</BreadcrumbPage>
            </BreadcrumbItem>
          </>
        )}
      </BreadcrumbList>
    </Breadcrumb>
  );
}
