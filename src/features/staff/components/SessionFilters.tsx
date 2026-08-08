"use client";

import type { DateRange } from "react-day-picker";
import { CalendarIcon, SearchIcon, XIcon } from "lucide-react";

import { Button } from "@/components/ui/form/button";
import { Calendar } from "@/components/ui/form/calendar";
import { Input } from "@/components/ui/form/input";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/overlay/popover";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/form/select";
import {
  STATUS_OPTIONS,
  formatDateRangeLabel,
  type StatusFilter,
} from "@/features/staff/lib/session-table";

type SessionFiltersProps = {
  search: string;
  onSearchChange: (value: string) => void;
  statusFilter: StatusFilter;
  onStatusFilterChange: (value: StatusFilter) => void;
  dateRange: DateRange | undefined;
  onDateRangeChange: (range: DateRange | undefined) => void;
  hasActiveFilters: boolean;
  onClearFilters: () => void;
  totalCount: number;
  filteredCount: number;
};

export function SessionFilters({
  search,
  onSearchChange,
  statusFilter,
  onStatusFilterChange,
  dateRange,
  onDateRangeChange,
  hasActiveFilters,
  onClearFilters,
  totalCount,
  filteredCount,
}: SessionFiltersProps) {
  return (
    <div className="flex flex-wrap items-center justify-between gap-3">
      <div className="flex flex-wrap items-center gap-3">
        <div className="relative max-w-xs flex-1">
          <SearchIcon className="pointer-events-none absolute top-1/2 left-2.5 size-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            value={search}
            onChange={(e) => onSearchChange(e.target.value)}
            placeholder="Search by session ID..."
            className="pl-8"
          />
        </div>

        <Select
          value={statusFilter}
          onValueChange={(value) => onStatusFilterChange(value as StatusFilter)}
        >
          <SelectTrigger className="w-36">
            <SelectValue placeholder="Status" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All statuses</SelectItem>
            {STATUS_OPTIONS.map((option) => (
              <SelectItem key={option.value} value={option.value}>
                {option.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        <Popover>
          <PopoverTrigger
            render={
              <Button
                type="button"
                variant="outline"
                className="justify-start font-normal"
              >
                <CalendarIcon />
                {formatDateRangeLabel(dateRange)}
              </Button>
            }
          />
          <PopoverContent className="w-auto p-0">
            <Calendar
              mode="range"
              selected={dateRange}
              onSelect={onDateRangeChange}
            />
          </PopoverContent>
        </Popover>

        {hasActiveFilters && (
          <Button type="button" variant="ghost" size="sm" onClick={onClearFilters}>
            <XIcon />
            Clear filters
          </Button>
        )}
      </div>

      <div className="text-sm whitespace-nowrap text-muted-foreground">
        {hasActiveFilters ? (
          <span>
            Showing {filteredCount} of {totalCount} sessions
          </span>
        ) : (
          <span>Total {totalCount} sessions</span>
        )}
      </div>
    </div>
  );
}
