import Link from "next/link";
import { Lock } from "lucide-react";

import { buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";

export function AccessDenied() {
  return (
    <div className="flex min-h-[calc(100vh-3.5rem)] flex-1 flex-col items-center justify-center gap-4 px-6 text-center">
      <Lock
        className="size-10 text-muted-foreground"
        aria-hidden
        strokeWidth={1.5}
      />
      <div className="max-w-sm space-y-2">
        <h1 className="font-heading text-lg font-medium text-foreground">
          Access denied
        </h1>
        <p className="text-pretty text-sm text-muted-foreground">
          You don&apos;t have access to this project, or it doesn&apos;t exist.
        </p>
      </div>
      <Link href="/editor" className={cn(buttonVariants({ variant: "default" }))}>
        Back to editor
      </Link>
    </div>
  );
}
