import type { ComponentProps } from "react";

import { cn } from "@/lib/utils";

/** Presentational shell for future `Dialog`; uses theme tokens wired in `globals.css`. */
export function DialogPattern({
  className,
  ...props
}: ComponentProps<"div">) {
  return (
    <div
      className={cn(
        "grid gap-4 rounded-3xl border border-border bg-popover p-6 text-popover-foreground shadow-lg ring-1 ring-foreground/10",
        className
      )}
      {...props}
    />
  );
}

export function DialogPatternTitle({
  className,
  ...props
}: ComponentProps<"h2">) {
  return (
    <h2
      className={cn(
        "font-heading text-lg font-medium leading-none tracking-tight text-foreground",
        className
      )}
      {...props}
    />
  );
}

export function DialogPatternDescription({
  className,
  ...props
}: ComponentProps<"p">) {
  return (
    <p className={cn("text-sm text-muted-foreground", className)} {...props} />
  );
}

export function DialogPatternFooter({
  className,
  ...props
}: ComponentProps<"div">) {
  return (
    <div
      className={cn(
        "flex flex-col-reverse gap-2 border-t border-border pt-4 sm:flex-row sm:justify-end",
        className
      )}
      {...props}
    />
  );
}
