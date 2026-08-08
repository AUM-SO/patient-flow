import { Skeleton } from "@/components/ui/feedback/skeleton";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/data/table";

const COLUMN_SKELETON_WIDTHS = [
  "h-4 w-6",
  "h-4 w-16",
  "h-5 w-16 rounded-full",
  "h-4 w-32",
  "h-4 w-32",
];

export function SessionTableSkeleton({ rows }: { rows: number }) {
  return (
    <div className="flex flex-col gap-4">
      <Skeleton className="h-8 w-full max-w-xs" />

      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>No.</TableHead>
            <TableHead>Session</TableHead>
            <TableHead>Status</TableHead>
            <TableHead>First opened</TableHead>
            <TableHead>Last updated</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {Array.from({ length: rows }).map((_, rowIndex) => (
            <TableRow key={rowIndex}>
              {COLUMN_SKELETON_WIDTHS.map((className, cellIndex) => (
                <TableCell key={cellIndex}>
                  <Skeleton className={className} />
                </TableCell>
              ))}
            </TableRow>
          ))}
        </TableBody>
      </Table>

      <div className="flex flex-wrap items-center justify-between gap-3">
        <Skeleton className="h-7 w-36" />
        <Skeleton className="h-7 w-56" />
      </div>
    </div>
  );
}
