# Progress Tracker

Update this file after every meaningful implementation
change.

## Current Phase

- Incremental features on top of foundation

## Current Goal

- Canvas / Liveblocks integration and editor workspace behavior beyond project shell.

## Completed

- **01-design-system** — shadcn/ui (Base UI “nova” preset) with Button, Card, Dialog, Input, Tabs, Textarea, ScrollArea; lucide-react; `lib/utils.ts` `cn()`; Ghost dark palette and Geist fonts wired in `app/globals.css` + `dark` on `<html>`. `components/ui/*` untouched after CLI install.
- **02-editor** — `editor-navbar.tsx` (fixed-height top bar; left/center/right; sidebar toggle `PanelLeftOpen`/`PanelLeftClose`; right empty; dark `bg-card` + `border-border`); `project-sidebar.tsx` (fixed overlay, no layout shift; slide from left; `isOpen` / `onClose`; Projects header + close; Tabs “My Projects” / “Shared” + empty placeholders; full-width bottom “New Project” + `Plus`); `dialog-pattern.tsx` (`DialogPattern` + title/description/footer slots via `globals.css` theme tokens — no modal); `editor-layout.tsx` wires navbar + sidebar in `app/editor/layout.tsx`; editor shell routes live under `/editor`.
- **03-auth** — `@clerk/ui` + `dark` theme; `lib/clerk-appearance.ts` maps Clerk appearance variables to app CSS tokens; `ClerkProvider` in `app/layout.tsx`; root `proxy.ts` (Next 16) with protect-by-default and public paths derived from `NEXT_PUBLIC_CLERK_SIGN_IN_URL` / `NEXT_PUBLIC_CLERK_SIGN_UP_URL`; `app/sign-in/[[...sign-in]]` and `app/sign-up/[[...sign-up]]` with `AuthShell` (two-panel ≥ `lg`, form-only on small screens); `app/page.tsx` redirects signed-in users to `/editor` and signed-out to `/sign-in`; `UserButton` in editor navbar.
- **05-prisma** — `prisma/models/project.prisma`: `Project` (`ownerId`, `name`, optional `description`, `ProjectStatus` DRAFT/ARCHIVED, `canvasJsonPath`, timestamps; indexes on `ownerId`, `createdAt`) and `ProjectCollaborator` (relation `onDelete: Cascade`, `email`, `createdAt`, `@@unique([projectId, email])`, indexes on `email` and `[projectId, createdAt]`). `lib/prisma.ts` singleton: `prisma+postgres://` → Prisma Accelerate (`@prisma/extension-accelerate`); else `@prisma/adapter-pg`; dev caches on `globalThis`. Initial migration `20260513124559_add_project_and_collaborator`; `npm run build` runs `prisma generate` then `next build`.
- **06-project-apis** — REST `app/api/projects` (GET list, POST create with default name `Untitled Project`, `ownerId` from Clerk, `canvasJsonPath` placeholder `""`, cuid IDs) and `app/api/projects/[projectId]` (PATCH rename, DELETE). `lib/api/require-user.ts` + `lib/api/project-http.ts` (serialization + JSON validation). Unauthenticated → `401`; non-owner PATCH/DELETE → `403`. `proxy.ts` skips `auth.protect()` for `/api/*` so API routes return JSON `401` instead of redirects. `lib/prisma.ts` export typed as `InstanceType<typeof PrismaClient>` to satisfy TS across Accelerate vs adapter clients.
- **07-wire-editor-home** — `lib/project-data.ts` loads owned (`ownerId`) and shared (collaborator email matches Clerk primary email) projects server-side. Async `app/editor/layout.tsx` passes both lists into `ProjectWorkspaceProvider`; `ProjectDialogs` mounted once in layout. `hooks/use-project-dialogs.ts` drives create (POST, room ID preview `slug-suffix`, navigate to `/editor/[id]` using server `id` as canonical room/project id), rename (PATCH + `router.refresh()`), delete (DELETE, redirect to `/editor` when deleting active workspace). `project-sidebar.tsx` lists real data with owner-only rename/delete. `app/editor/page.tsx` shows `EditorHome`; `app/editor/[projectId]/page.tsx` placeholder workspace. `npm run build` passes.

## In Progress

- None yet.

## Next Up

- Canvas persistence and real-time collaboration (Liveblocks or equivalent), or next feature slice from specs.

## Open Questions

- Add all resolved product or implementation questions here.

## Architecture Decisions

- Prisma v7 multi-file schema under `prisma/` with models in `prisma/models/`; generated client at `app/generated/prisma` (gitignored). Runtime DB access branches on `DATABASE_URL`: Accelerate extension for `prisma+postgres://`, otherwise `pg` via `@prisma/adapter-pg`. The exported client is asserted to `InstanceType<typeof PrismaClient>` so typings stay usable when the runtime branch mixes Accelerate vs non-Accelerate APIs.
- App Router JSON APIs under `/api/*` are excluded from Clerk `auth.protect()` in `proxy.ts`; handlers use `auth()` and return `401` JSON for sessionless calls.
- Editor project list and mutations: server-rendered initial lists; client hook calls REST and uses `router.refresh()` to reconcile with server state after mutations.

## Session Notes

- shadcn was initialized as `style: base-nova` (`@base-ui/react`). Spec file listed “Dialogue”; component added is **`dialog`** (`components/ui/dialog.tsx`) per CLI naming.
- `lib/mock-projects.ts` was removed after **07-wire-editor-home**; lists come from Prisma via `getEditorProjectLists` and `types/project.ts` + `lib/slug-preview.ts` remain in use.
