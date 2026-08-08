# Agnos — Real-time Patient Intake

Two synchronized interfaces over one patient session:

- **Patient form** (`/patient/[sessionId]`) — public, no login. Every keystroke is broadcast live.
- **Staff console** (`/staff`) — auth-gated. Watches sessions and field edits as they happen.

**Live demo:** _(fill in the Vercel URL after deploying)_

---

## Tech stack

| Layer | Choice |
| --- | --- |
| Framework | Next.js 16 (App Router, React 19) |
| Styling | Tailwind CSS v4 + shadcn/ui (Base UI primitives) |
| Forms / validation | react-hook-form + Zod (one schema shared by form and realtime payload) |
| Realtime | Supabase Realtime — Broadcast (field updates), Presence (typing/idle), Postgres Changes (session list) |
| Client state | Zustand (one store per feature) |
| Auth | Supabase Auth (email/password), gates `/staff/*` only |
| Database | Supabase Postgres (`sessions`, `patients`) |
| Hosting | Vercel |

Package manager: **bun**.

---

## Getting started

```bash
bun install
cp .env.example .env.local   # fill in the two values below
bun dev
```

Open http://localhost:3000.

### Environment variables

| Name | Where to find it |
| --- | --- |
| `NEXT_PUBLIC_SUPABASE_URL` | Supabase dashboard → Project Settings → API |
| `NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY` | same page (the publishable / anon key) |

Both are public by design — the database is protected by RLS, not by key secrecy.

### Database setup

Run [`supabase/schema.sql`](supabase/schema.sql) in the Supabase SQL editor. It creates both
tables, the `updated_at` trigger, grants, and RLS policies.

Then enable Realtime for the `sessions` table (Database → Replication), and create one staff
user under Authentication → Users — that email/password is the staff login.

`supabase/reset-and-recreate.sql` and `supabase/final-setup.sql` are destructive re-runs of the
same schema (they `drop table … cascade` first). Use them only to wipe a dev project.

### Test staff account

Use this account to reach the staff console on the live demo, or create the same one under
Authentication → Users in your own Supabase project.

| Field | Value |
| --- | --- |
| Email | `<FILL IN>` |
| Password | `<FILL IN>` |

Sign in at [`/staff/login`](http://localhost:3000/staff/login). There is no public sign-up —
staff accounts are seeded by hand, so this is the only way into `/staff/*`.

The patient side needs no account at all: open the landing page, start a session, and the form
link works for anyone who has it.

> This account exists only for reviewing the assignment and holds no real data. Rotate or delete
> it before the project is reused for anything else.

---

## How the realtime sync works

1. Landing page mints a `sessionId` (`crypto.randomUUID()`) and routes to `/patient/[sessionId]`.
2. The patient form upserts a `sessions` row, then debounces field changes
   (`FIELD_UPDATE_DEBOUNCE_MS`) onto a Supabase Broadcast channel keyed by session id.
3. Presence on the same channel reports `typing` / `idle` / `submitted`.
4. The staff console subscribes to that channel per open session, and to Postgres Changes on
   `sessions` for the list — so new sessions and status changes appear without a refresh.
5. Submitting writes the full row to `patients` and flips `sessions.status` to `submitted`.

Persisted writes and the live broadcast are separate paths on purpose: staff see edits
immediately, while the database only stores the debounced/committed state.

### What makes the sync legible

- **Per-field highlight** — a field that just changed flashes and carries an "Updated 4s ago"
  label, so staff can see *what* moved, not just that something did.
- **Field-level typing indicator** — presence carries the field name, so the badge reads
  "Typing: Phone number" and that field gets a live dot.
- **Connection indicator** — a `Live` / `Reconnecting…` dot in the page chrome (staff nav bar,
  patient top bar). A dropped socket otherwise looks exactly like a patient who stopped typing.
  Status is aggregated across every subscribed channel in `lib/realtime/connection-store.ts`,
  so one indicator speaks for the whole page and the worst status wins.
- **Catch-up on reconnect** — broadcasts sent while the socket was down are gone forever, so
  re-subscribing triggers a re-read of the row/table.

### Hand-off and session lifecycle

- **QR hand-off** — the landing page and the staff dashboard can mint a session and show a QR
  code plus a copyable link, so the patient fills the form on their own phone while staff watch
  from the console.
- **Staff can close a session** — abandoned sessions no longer sit in the list forever;
  `closed` was previously only reachable from the patient tab. Closing broadcasts
  `session_closed` on the session channel, and the patient tab locks the form behind a
  disabled `<fieldset>` with an explanatory alert. The patient side cannot read `sessions`
  (RLS restricts SELECT to staff), so a broadcast is the only live path for that signal.

---

## Project structure

```
src/
├── app/                        # routes only — thin, delegates to features/
│   ├── patient/[sessionId]/    # public form + submitted confirmation
│   └── staff/                  # (dashboard) group + login
├── features/                   # vertical slices: components / hooks / services / store
│   ├── auth/
│   ├── patient/
│   ├── staff/
│   └── shared/validation/      # Zod schema used by both sides
├── components/
│   ├── ui/                     # shadcn primitives
│   ├── common/                 # shared visual pieces
│   ├── animate-ui/ · reui/     # vendored registry components
├── config/                     # constants + select options
├── hooks/                      # app-wide hooks (use-now, use-mobile, …)
├── lib/                        # supabase clients, realtime channel, utils
├── types/database.ts           # hand-written Supabase types
└── proxy.ts                    # route guard for /staff/* (Next 16 middleware)
```

Rules of thumb: a route file wires data to a feature component; anything used by exactly one
feature lives in that feature; `components/` holds only genuinely shared UI.

---

## Scripts

```bash
bun dev      # dev server
bun run build
bun start
bun run lint
bunx tsc --noEmit
```

---

## Deployment

Import the repo on Vercel, set the two environment variables for Preview + Production, deploy.
No custom server or build config needed — Supabase is hosted separately.

---

## Known scope limits

- Light mode only — the supplied brand tokens had no dark palette.
- `src/types/database.ts` is hand-written; regenerate with `supabase gen types typescript`
  once the project is linked.
- No automated tests; verification was manual across desktop and 390px mobile
  (see `docs/actions/`).
