import type { ReactNode } from "react";

import { FieldLegend } from "@/components/ui/form/field";

export function RequiredMark() {
  return (
    <span className="ml-0.5 text-destructive" aria-hidden="true">
      *
    </span>
  );
}

export function SectionLegend({ index, children }: { index: number; children: ReactNode }) {
  return (
    <FieldLegend className="flex items-center gap-2.5 text-lg">
      <span className="flex size-7 shrink-0 items-center justify-center rounded-full bg-primary/10 text-sm font-semibold text-primary">
        {index}
      </span>
      {children}
    </FieldLegend>
  );
}
