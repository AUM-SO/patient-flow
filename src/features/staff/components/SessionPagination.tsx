"use client";

import { Button } from "@/components/ui/form/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/form/select";
import {
  PAGE_SIZE_OPTIONS,
  getPageNumbers,
} from "@/features/staff/lib/session-table";

type SessionPaginationProps = {
  pageSize: number;
  onPageSizeChange: (size: number) => void;
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
};

export function SessionPagination({
  pageSize,
  onPageSizeChange,
  currentPage,
  totalPages,
  onPageChange,
}: SessionPaginationProps) {
  return (
    <div className="flex flex-wrap items-center justify-between gap-3">
      <div className="flex items-center gap-2 text-sm text-muted-foreground">
        <span>Rows per page</span>
        <Select
          value={String(pageSize)}
          onValueChange={(value) => onPageSizeChange(Number(value))}
        >
          <SelectTrigger size="sm">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            {PAGE_SIZE_OPTIONS.map((size) => (
              <SelectItem key={size} value={String(size)}>
                {size}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <div className="flex items-center gap-1">
        <Button
          type="button"
          variant="outline"
          size="sm"
          disabled={currentPage <= 1}
          onClick={() => onPageChange(Math.max(1, currentPage - 1))}
        >
          Previous
        </Button>
        {getPageNumbers(currentPage, totalPages).map((page, i) =>
          page === "ellipsis" ? (
            <span
              key={`ellipsis-${i}`}
              className="px-2 text-sm text-muted-foreground"
            >
              …
            </span>
          ) : (
            <Button
              key={page}
              type="button"
              variant={page === currentPage ? "default" : "outline"}
              size="sm"
              onClick={() => onPageChange(page)}
            >
              {page}
            </Button>
          ),
        )}
        <Button
          type="button"
          variant="outline"
          size="sm"
          disabled={currentPage >= totalPages}
          onClick={() => onPageChange(Math.min(totalPages, currentPage + 1))}
        >
          Next
        </Button>
      </div>
    </div>
  );
}
