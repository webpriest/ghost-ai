Read the `AGENTS.md` before starting.

We are adding the UI system and design primitive components.

Install and configure `shadcn/ui`.
Add these shadcn components:
- Button
- Card
- Dialogue
- Input
- Tabs
- Textarea
- ScrollArea

Do not modify the `components/ui/*` files after installation.

Also install `lucide-react`.

Create `lib/utils.ts` with a reusable `cn()` helper for merging Tailwind classes.

Ensure all components match the existing dark theme in `globals.css`.

### Check when done

- All components import without errors
- `cn()` works properly
- No default light styling appears