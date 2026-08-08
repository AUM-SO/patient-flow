"use client";

import type { ReactNode } from "react";
import {
  ArrowDownIcon,
  ArrowUpIcon,
  ChevronsUpDownIcon,
} from "lucide-react";

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/data/table";
import { SessionStatusBadge } from "@/features/staff/components/StatusIndicator";
import {
  formatThaiDateTime,
  type SortDirection,
  type SortKey,
} from "@/features/staff/lib/session-table";
import type { SessionRecord } from "@/features/staff/store/useSessionsStore";

const SORTABLE_COLUMNS: { key: SortKey; label: string }[] = [
  { key: "id", label: "Session" },
  { key: "status", label: "Status" },
  { key: "createdAt", label: "First opened" },
  { key: "updatedAt", label: "Last updated" },
];

function SortableTableHead({
  sortKey,
  activeKey,
  direction,
  onSort,
  children,
}: {
  sortKey: SortKey;
  activeKey: SortKey;
  direction: SortDirection;
  onSort: (key: SortKey) => void;
  children: ReactNode;
}) {
  const isActive = sortKey === activeKey;
  const Icon = !isActive
    ? ChevronsUpDownIcon
    : direction === "asc"
      ? ArrowUpIcon
      : ArrowDownIcon;

  return (
    <TableHead>
      <button
        type="button"
        onClick={() => onSort(sortKey)}
        className={`flex cursor-pointer items-center gap-1 transition-colors hover:text-foreground ${
          isActive ? "text-foreground" : "text-muted-foreground"
        }`}
      >
        {children}
        <Icon className="size-3.5" />
      </button>
    </TableHead>
  );
}

type SessionTableProps = {
  sessions: SessionRecord[];
  sessionRank: Map<string, number>;
  sortKey: SortKey;
  sortDirection: SortDirection;
  onSort: (key: SortKey) => void;
  onOpenSession: (sessionId: string) => void;
};

export function SessionTable({
  sessions,
  sessionRank,
  sortKey,
  sortDirection,
  onSort,
  onOpenSession,
}: SessionTableProps) {
  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead className="w-12">No.</TableHead>
          {SORTABLE_COLUMNS.map((column) => (
            <SortableTableHead
              key={column.key}
              sortKey={column.key}
              activeKey={sortKey}
              direction={sortDirection}
              onSort={onSort}
            >
              {column.label}
            </SortableTableHead>
          ))}
        </TableRow>
      </TableHeader>
      <TableBody>
        {sessions.map((session) => (
          <TableRow
            key={session.id}
            onClick={() => onOpenSession(session.id)}
            className="cursor-pointer"
          >
            <TableCell className="text-muted-foreground">
              {sessionRank.get(session.id)}
            </TableCell>
            <TableCell>
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  onOpenSession(session.id);
                }}
                className="cursor-pointer font-mono text-xs text-foreground transition-colors hover:text-primary hover:underline"
              >
                {session.id.slice(0, 8)}
              </button>
            </TableCell>
            <TableCell>
              <SessionStatusBadge status={session.status} />
            </TableCell>
            <TableCell className="text-muted-foreground">
              {formatThaiDateTime(session.createdAt)}
            </TableCell>
            <TableCell className="text-muted-foreground">
              {formatThaiDateTime(session.updatedAt)}
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
}
