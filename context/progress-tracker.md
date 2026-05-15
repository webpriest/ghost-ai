# Progress Tracker



Update this file after every meaningful implementation

change.



## Current Phase



- Incremental features on top of foundation



## Current Goal



- **09-share-dialog** is shipped. Decide the next increment from `context/feature-specs/` (**10**+ when numbered) when scope is ready.



## Completed



- **01-design-system** — shadcn/ui (Base UI “nova” preset) with Button, Card, Dialog, Input, Tabs, Textarea, ScrollArea; lucide-react; `lib/utils.ts` `cn()`; Ghost dark palette and Geist fonts wired in `app/globals.css` + `dark` on `<html>`. `components/ui/*` untouched after CLI install except Dialog z-index raised to sit above editor chrome (`z-[110]` overlay/popup).

- **02-editor** — `editor-navbar.tsx` (fixed-height top bar; left/center/right; sidebar toggle `PanelLeftOpen`/`PanelLeftClose`; right empty; dark `bg-card` + `border-border`); `project-sidebar.tsx` (fixed overlay, no layout shift; slide from left; `isOpen` / `onClose`; Projects header + close; Tabs “My Projects” / “Shared” + empty placeholders; full-width bottom “New Project” + `Plus`); `dialog-pattern.tsx` (`DialogPattern` + title/description/footer slots via `globals.css` theme tokens — no modal); `editor-layout.tsx` wires navbar + sidebar in `app/editor/layout.tsx`; editor shell routes live under `/editor`.

- **03-auth** — `@clerk/ui` + `dark` theme; `lib/clerk-appearance.ts` maps Clerk appearance variables to app CSS tokens; `ClerkProvider` in `app/layout.tsx`; root `proxy.ts` (Next 16) with protect-by-default and public paths derived from `NEXT_PUBLIC_CLERK_SIGN_IN_URL` / `NEXT_PUBLIC_CLERK_SIGN_UP_URL`; `app/sign-in/[[...sign-in]]` and `app/sign-up/[[...sign-up]]` with `AuthShell` (two-panel ≥ `lg`, form-only on small screens); `app/page.tsx` redirects signed-in users to `/editor` and signed-out to `/sign-in`; `UserButton` in editor navbar.

- **04-project-dialogs** — `/editor` home (`editor-home.tsx`): heading + description + `New Project` with `Plus` (no cards); `project-dialogs.tsx` (dialogs + forms); sidebar rename/delete wired to dialogs. Initially mock data and `hooks/use-project-dialogs.ts`; superseded by **07** (`use-project-actions.ts` + real API).

- **05-prisma** — `prisma/models/project.prisma` (`Project`, `ProjectCollaborator`, `ProjectStatus` enum); `prisma/schema.prisma` generator + datasource; `prisma.config.ts` (`DATABASE_URL`), multi-file schema root `prisma/`; cached singleton `lib/prisma.ts` branching `prisma+postgres://` / `prisma://` → Accelerate (`accelerateUrl`) vs `@prisma/adapter-pg` `{ connectionString }`; first migration restored as `20260513124559_add_project_and_collaborator` (`prisma/migrations/*`); generated client → `generated/prisma` (gitignored; `postinstall` + pre-build `prisma generate`).

- **06-project-apis** — `GET`/`POST` `app/api/projects/route.ts`; `PATCH`/`DELETE` `app/api/projects/[projectId]/route.ts`; `lib/api/require-user.ts` (401); owner checks on mutations (403 / 404); `lib/api/project-http.ts` (create default name `Untitled Project`, payloads, serializers); Clerk `ownerId`.

- **07-wire-editor-home** — Server `app/editor/layout.tsx`: `fetchEditorProjectsData` in `lib/editor-projects-data.ts` (owned vs shared via `ProjectCollaborator` email); passes lists into client `EditorLayout` / `ProjectWorkspaceProvider`; `hooks/use-project-actions.ts` replaces mocks with `fetch` CRUD + `router.refresh()`, create → `router.push(/editor/[id])` (`slug` aligns with persisted `Project.id`), delete redirects from active workspace.

- **08-editor-workspace-shell** — Server `app/editor/[roomId]/page.tsx`: `getClerkEditorIdentity` + `findAccessibleProjectForUser` from `lib/project-access.ts`; unauthenticated redirect to `/sign-in`; missing/forbidden IDs → `AccessDenied` (`components/editor/access-denied.tsx`): centered layout, Lock icon, copy, primary-styled link to `/editor`. `EditorChromeProvider` (`editor-chrome-context.tsx`) inside `EditorLayout`; `ActiveProjectHydrator` sets navbar project context; `EditorWorkspaceShell` (`editor-workspace-shell.tsx`) fills viewport under navbar — muted bordered canvas placeholder + optional right AI placeholder toggled via navbar Sparkles; `ProjectSidebar` links `/editor/[id]` with `usePathname` active styling. Scoped per spec (no canvas engine, Liveblocks, real share, or AI). Verified: production build + TypeScript pass.

- **09-share-dialog** — Navbar `Share` opens `share-project-dialog.tsx` (`Dialog` + invite form, collaborator list with remove when owner; “Copy project link” with transient “Copied!” for owners only). Collaborators GET list-only (no invite/remove/copy). APIs: `GET`/`POST` `app/api/projects/[projectId]/collaborators/route.ts`, `DELETE` `collaborators/[collaboratorId]`; `lib/api/project-collaborator-access.ts` gates owner or collaborator; invite/remove enforced owner-side; collaborator emails enriched via Clerk Backend `users.getUserList({ emailAddress })` in `lib/api/enrich-collaborators-clerk.ts` (fallback to email-only). `EditorChromeContext`/`ActiveProjectHydrator` carry `role` from project payload. Verified: `npm run build`.

## In Progress



- None.



## Next Up



- Pick the next feature spec (**10**+ when numbered) or non-numbered backlog item; **09** satisfies `feature-specs/09-share-dialog.md`.



## Open Questions



- Add all resolved product or implementation questions here.



## Architecture Decisions



- **Prisma ORM 7**: config in `prisma.config.ts`; client output `./generated/prisma`; Accelerate URLs use constructor `accelerateUrl` (no `@prisma/extension-accelerate` dependency). Collaborator lookups use normalized primary email (lowercase) when listing shared projects.



## Session Notes



- shadcn was initialized as `style: base-nova` (`@base-ui/react`). Spec file listed “Dialogue”; component added is **`dialog`** (`components/ui/dialog.tsx`) per CLI naming.

- **08-editor-workspace-shell** closed out `/editor/[roomId]` server access checks (`lib/project-access.ts`), `AccessDenied`, workspace chrome/context, and canvas/AI placeholders wired to navbar actions.