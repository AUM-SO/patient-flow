"use client";

import { useMemo, useState } from "react";
import type { DateRange } from "react-day-picker";

import type { SessionRecord } from "@/features/staff/store/useSessionsStore";
import {
  PAGE_SIZE_OPTIONS,
  isWithinDateRange,
  type SortDirection,
  type SortKey,
  type StatusFilter,
} from "@/features/staff/lib/session-table";

/**
 * Client-side search / filter / sort / pagination over the realtime session
 * list. Kept out of the components so `SessionList` stays a layout shell.
 */
export function useSessionTable(sessions: SessionRecord[]) {
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState<StatusFilter>("all");
  const [dateRange, setDateRange] = useState<DateRange | undefined>(undefined);
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(PAGE_SIZE_OPTIONS[0]);
  const [sortKey, setSortKey] = useState<SortKey>("updatedAt");
  const [sortDirection, setSortDirection] = useState<SortDirection>("desc");

  /** Stable display number per session, oldest session = 1. */
  const sessionRank = useMemo(() => {
    const byCreatedAtAsc = [...sessions].sort(
      (a, b) =>
        new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime(),
    );
    return new Map(byCreatedAtAsc.map((session, i) => [session.id, i + 1]));
  }, [sessions]);

  const filteredSessions = useMemo(() => {
    const query = search.trim().toLowerCase();
    return sessions.filter((session) => {
      if (query && !session.id.toLowerCase().includes(query)) return false;
      if (statusFilter !== "all" && session.status !== statusFilter)
        return false;
      if (
        dateRange?.from &&
        !isWithinDateRange(new Date(session.updatedAt), dateRange)
      )
        return false;
      return true;
    });
  }, [sessions, search, statusFilter, dateRange]);

  const sortedSessions = useMemo(() => {
    const dir = sortDirection === "asc" ? 1 : -1;
    return [...filteredSessions].sort((a, b) => {
      if (sortKey === "updatedAt" || sortKey === "createdAt") {
        return (
          (new Date(a[sortKey]).getTime() - new Date(b[sortKey]).getTime()) * dir
        );
      }
      return a[sortKey].localeCompare(b[sortKey]) * dir;
    });
  }, [filteredSessions, sortKey, sortDirection]);

  const totalPages = Math.max(1, Math.ceil(sortedSessions.length / pageSize));
  const currentPage = Math.min(page, totalPages);
  const paginatedSessions = sortedSessions.slice(
    (currentPage - 1) * pageSize,
    currentPage * pageSize,
  );

  const hasActiveFilters =
    search.trim() !== "" ||
    statusFilter !== "all" ||
    dateRange?.from !== undefined;

  function changeSearch(value: string) {
    setSearch(value);
    setPage(1);
  }

  function changeStatusFilter(value: StatusFilter) {
    setStatusFilter(value);
    setPage(1);
  }

  function changeDateRange(range: DateRange | undefined) {
    setDateRange(range);
    setPage(1);
  }

  function changePageSize(size: number) {
    setPageSize(size);
    setPage(1);
  }

  function clearFilters() {
    setSearch("");
    setStatusFilter("all");
    setDateRange(undefined);
    setPage(1);
  }

  /** Same column toggles direction; a new column starts ascending. */
  function toggleSort(key: SortKey) {
    if (key === sortKey) {
      setSortDirection((d) => (d === "asc" ? "desc" : "asc"));
    } else {
      setSortKey(key);
      setSortDirection("asc");
    }
    setPage(1);
  }

  return {
    search,
    statusFilter,
    dateRange,
    hasActiveFilters,
    changeSearch,
    changeStatusFilter,
    changeDateRange,
    clearFilters,

    sessionRank,
    filteredSessions,
    paginatedSessions,

    sortKey,
    sortDirection,
    toggleSort,

    pageSize,
    changePageSize,
    currentPage,
    totalPages,
    goToPage: setPage,
  };
}
