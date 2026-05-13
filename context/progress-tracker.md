# Progress Tracker

Update this file after every meaningful implementation
change.

## Current Phase

- Incremental features on top of foundation

## Current Goal

- Continue with the next unit in `context/feature-specs/` after **04-project-dialogs**.

## Completed

- **01-design-system** — shadcn/ui (Base UI “nova” preset) with Button, Card, Dialog, Input, Tabs, Textarea, ScrollArea; lucide-react; `lib/utils.ts` `cn()`; Ghost dark palette and Geist fonts wired in `app/globals.css` + `dark` on `<html>`. `components/ui/*` untouched after CLI install except Dialog z-index raised to sit above editor chrome (`z-[110]` overlay/popup).
- **02-editor** — `editor-navbar.tsx` (fixed-height top bar; left/center/right; sidebar toggle `PanelLeftOpen`/`PanelLeftClose`; right empty; dark `bg-card` + `border-border`); `project-sidebar.tsx` (fixed overlay, no layout shift; slide from left; `isOpen` / `onClose`; Projects header + close; Tabs “My Projects” / “Shared” + empty placeholders; full-width bottom “New Project” + `Plus`); `dialog-pattern.tsx` (`DialogPattern` + title/description/footer slots via `globals.css` theme tokens — no modal); `editor-layout.tsx` wires navbar + sidebar in `app/editor/layout.tsx`; editor shell routes live under `/editor`.
- **03-auth** — `@clerk/ui` + `dark` theme; `lib/clerk-appearance.ts` maps Clerk appearance variables to app CSS tokens; `ClerkProvider` in `app/layout.tsx`; root `proxy.ts` (Next 16) with protect-by-default and public paths derived from `NEXT_PUBLIC_CLERK_SIGN_IN_URL` / `NEXT_PUBLIC_CLERK_SIGN_UP_URL`; `app/sign-in/[[...sign-in]]` and `app/sign-up/[[...sign-up]]` with `AuthShell` (two-panel ≥ `lg`, form-only on small screens); `app/page.tsx` redirects signed-in users to `/editor` and signed-out to `/sign-in`; `UserButton` in editor navbar.
- **04-project-dialogs** — `/editor` home (`editor-home.tsx`): heading + description + `New Project` with `Plus` (no cards). `useProjectDialogs` hook (`hooks/use-project-dialogs.ts`): dialog mode state, create/rename form state, mock loading delays, mock project list mutations; `ProjectWorkspaceProvider` + `project-dialogs.tsx` (Create with live slug preview, Rename with prefilled/focused name + description showing current name + Enter submits via form, Delete destructive confirm only). `project-sidebar.tsx`: mock owned vs shared lists; rename/delete icon actions only on owned projects; sidebar scrim closes on outside tap; wired New Project → Create + sidebar rename/delete → dialogs.

## In Progress

- None yet.

## Next Up

- Next numbered feature spec in `context/feature-specs/` (after **04-project-dialogs**).

## Open Questions

- Add all resolved product or implementation questions here.

## Architecture Decisions

- Add decisions that affect the system design or data model.

## Session Notes

- shadcn was initialized as `style: base-nova` (`@base-ui/react`). Spec file listed “Dialogue”; component added is **`dialog`** (`components/ui/dialog.tsx`) per CLI naming.
