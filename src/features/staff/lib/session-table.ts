import type { DateRange } from "react-day-picker";

import { SessionStatus } from "@/config/constants";

export const PAGE_SIZE_OPTIONS = [12, 24, 48, 96];

export const STATUS_OPTIONS: { value: SessionStatus; label: string }[] = [
  { value: SessionStatus.ACTIVE, label: "Active" },
  { value: SessionStatus.SUBMITTED, label: "Submitted" },
  { value: SessionStatus.CLOSED, label: "Closed" },
];

export type SortKey = "id" | "status" | "createdAt" | "updatedAt";
export type SortDirection = "asc" | "desc";
export type StatusFilter = SessionStatus | "all";

const THAI_DATETIME_FORMAT: Intl.DateTimeFormatOptions = {
  dateStyle: "medium",
  timeStyle: "short",
};

export function formatThaiDateTime(value: string) {
  return new Date(value).toLocaleString("th-TH", THAI_DATETIME_FORMAT);
}

export function formatThaiDate(value: Date) {
  return value.toLocaleDateString("th-TH", { dateStyle: "medium" });
}

function startOfDay(date: Date) {
  const d = new Date(date);
  d.setHours(0, 0, 0, 0);
  return d;
}

function endOfDay(date: Date) {
  const d = new Date(date);
  d.setHours(23, 59, 59, 999);
  return d;
}

export function isWithinDateRange(value: Date, range: DateRange) {
  if (!range.from) return true;
  const from = startOfDay(range.from);
  const to = endOfDay(range.to ?? range.from);
  return value >= from && value <= to;
}

export function isSameCalendarDay(a: Date, b: Date) {
  return (
    a.getFullYear() === b.getFullYear() &&
    a.getMonth() === b.getMonth() &&
    a.getDate() === b.getDate()
  );
}

/** Label for the date-range trigger: single day collapses to one date. */
export function formatDateRangeLabel(range: DateRange | undefined) {
  if (!range?.from) return "Filter by date range";
  if (range.to && !isSameCalendarDay(range.from, range.to)) {
    return `${formatThaiDate(range.from)} - ${formatThaiDate(range.to)}`;
  }
  return formatThaiDate(range.from);
}

/** Page buttons with ellipsis gaps once the list outgrows 7 pages. */
export function getPageNumbers(
  current: number,
  total: number,
): (number | "ellipsis")[] {
  if (total <= 7) return Array.from({ length: total }, (_, i) => i + 1);

  const pages: (number | "ellipsis")[] = [1];
  if (current > 3) pages.push("ellipsis");

  const start = Math.max(2, current - 1);
  const end = Math.min(total - 1, current + 1);
  for (let i = start; i <= end; i++) pages.push(i);

  if (current < total - 2) pages.push("ellipsis");
  pages.push(total);
  return pages;
}
