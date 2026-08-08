// Patient-facing form: this can be filled by a walk-in patient on a tablet,
// including elderly users, so labels read larger than shadcn's dashboard-
// density default (text-sm). Control sizing itself is handled by each
// component's own `size="lg"` prop (see ui/input.tsx, ui/select.tsx,
// ui/button.tsx) — not overridden here, since fighting a component's own
// data-attribute-scoped variant classes via a plain className is unreliable
// (see docs/actions/2026-08-07-select-height-bug.md for why).
export const COMFORTABLE_LABEL_CLASS = "text-base";
