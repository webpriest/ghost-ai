import type { ReactNode } from "react";

export function AuthShell({ children }: { children: ReactNode }) {
  return (
    <div className="grid min-h-screen grid-cols-1 bg-background lg:grid-cols-2">
      <aside className="hidden bg-card lg:flex lg:flex-col lg:justify-center lg:border-r lg:border-border">
        <div className="mx-auto flex w-full max-w-md flex-col gap-10 px-10 py-12 xl:px-14">
          <header className="flex flex-col gap-3">
            <p className="font-sans text-xs font-semibold uppercase tracking-[0.22em] text-muted-foreground">
              System design workspace
            </p>
            <h1 className="font-heading text-3xl font-semibold tracking-tight text-foreground xl:text-[2rem] xl:leading-tight">
              Ghost AI
            </h1>
            <p className="font-sans text-base leading-relaxed text-pretty text-muted-foreground">
              Collaborative architecture on a shared canvas — describe intent in plain language, evolve the graph
              together, and export a living technical spec.
            </p>
          </header>
          <ul
            className="font-sans flex flex-col gap-4 text-sm leading-relaxed text-secondary-foreground"
            aria-label="Features"
          >
            <li className="flex gap-3">
              <span
                className="mt-2 size-1 shrink-0 rounded-full bg-primary ring-2 ring-primary/25"
                aria-hidden
              />
              <span>Projects and access shaped for how your team actually ships systems.</span>
            </li>
            <li className="flex gap-3">
              <span className="mt-2 size-1 shrink-0 rounded-full bg-primary ring-2 ring-primary/25" aria-hidden />
              <span>Realtime canvas built for diagrams, review, and incremental refinement.</span>
            </li>
            <li className="flex gap-3">
              <span className="mt-2 size-1 shrink-0 rounded-full bg-primary ring-2 ring-primary/25" aria-hidden />
              <span>AI-assisted drafts grounded in what you wrote — not generic filler architecture.</span>
            </li>
          </ul>
        </div>
      </aside>

      <div className="flex min-h-screen flex-col items-center justify-center px-6 py-12 sm:px-10 lg:min-h-screen lg:px-12 xl:px-16">
        <div className="flex w-full max-w-md flex-col">{children}</div>
      </div>
    </div>
  );
}
