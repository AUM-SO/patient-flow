"use client";

import { useState } from "react";
import { SearchXIcon } from "lucide-react";

import { Alert, AlertDescription, AlertTitle } from "@/components/ui/feedback/alert";
import { Button } from "@/components/ui/form/button";
import {
  Empty,
  EmptyContent,
  EmptyDescription,
  EmptyHeader,
  EmptyMedia,
  EmptyTitle,
} from "@/components/ui/feedback/empty";
import { IconStack } from "@/components/reui/icon-stack";
import { SessionDetailSheet } from "@/features/staff/components/SessionDetailSheet";
import { SessionFilters } from "@/features/staff/components/SessionFilters";
import { SessionPagination } from "@/features/staff/components/SessionPagination";
import { SessionTable } from "@/features/staff/components/SessionTable";
import { SessionTableSkeleton } from "@/features/staff/components/SessionTableSkeleton";
import { useSessionTable } from "@/features/staff/hooks/useSessionTable";
import { useSessionsList } from "@/features/staff/hooks/useSessionsList";
import { PAGE_SIZE_OPTIONS } from "@/features/staff/lib/session-table";

export function SessionList() {
  const { sessions, isLoading, error } = useSessionsList();
  const [openSessionId, setOpenSessionId] = useState<string | null>(null);
  const table = useSessionTable(sessions);

  if (error) {
    return (
      <Alert variant="destructive">
        <AlertTitle>Could not load sessions</AlertTitle>
        <AlertDescription>
          Check the Supabase connection and refresh the page.
        </AlertDescription>
      </Alert>
    );
  }

  if (isLoading) {
    return <SessionTableSkeleton rows={PAGE_SIZE_OPTIONS[0]} />;
  }

  if (sessions.length === 0) {
    return (
      <Empty>
        <EmptyTitle>No sessions yet</EmptyTitle>
        <EmptyDescription>
          New patient sessions will appear here in real time.
        </EmptyDescription>
      </Empty>
    );
  }

  return (
    <>
      <div className="flex flex-col gap-4">
        <SessionFilters
          search={table.search}
          onSearchChange={table.changeSearch}
          statusFilter={table.statusFilter}
          onStatusFilterChange={table.changeStatusFilter}
          dateRange={table.dateRange}
          onDateRangeChange={table.changeDateRange}
          hasActiveFilters={table.hasActiveFilters}
          onClearFilters={table.clearFilters}
          totalCount={sessions.length}
          filteredCount={table.filteredSessions.length}
        />

        {table.paginatedSessions.length === 0 ? (
          <Empty className="py-10">
            <EmptyHeader>
              <EmptyMedia>
                <IconStack aria-hidden="true" className="h-24 w-22 text-primary">
                  <SearchXIcon className="size-5 text-primary" />
                </IconStack>
              </EmptyMedia>
              <EmptyTitle>No matching sessions</EmptyTitle>
              <EmptyDescription>
                Try adjusting your search or filters.
              </EmptyDescription>
            </EmptyHeader>
            {table.hasActiveFilters && (
              <EmptyContent>
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={table.clearFilters}
                  className="border-primary text-primary hover:bg-primary/10"
                >
                  Clear filters
                </Button>
              </EmptyContent>
            )}
          </Empty>
        ) : (
          <SessionTable
            sessions={table.paginatedSessions}
            sessionRank={table.sessionRank}
            sortKey={table.sortKey}
            sortDirection={table.sortDirection}
            onSort={table.toggleSort}
            onOpenSession={setOpenSessionId}
          />
        )}

        {table.filteredSessions.length > 0 && (
          <SessionPagination
            pageSize={table.pageSize}
            onPageSizeChange={table.changePageSize}
            currentPage={table.currentPage}
            totalPages={table.totalPages}
            onPageChange={table.goToPage}
          />
        )}
      </div>

      <SessionDetailSheet
        sessionId={openSessionId}
        onClose={() => setOpenSessionId(null)}
      />
    </>
  );
}
