"use client";

import { Loader2, Share2, Trash2, Copy } from "lucide-react";
import {
  type FormEventHandler,
  useCallback,
  useEffect,
  useRef,
  useState,
} from "react";

import type { EditorActiveProject } from "@/components/editor/editor-chrome-context";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { cn } from "@/lib/utils";

type CollaboratorFromApi = {
  id: string;
  email: string;
  createdAt: string;
  clerk: { displayName: string | null; imageUrl: string | null } | null;
};

const COPIED_MS = 2000;

function initialsFrom(email: string, displayName: string | null) {
  const base = displayName?.trim().length ? displayName.trim() : email;
  const parts = base.split(/\s+/).filter(Boolean);
  if (parts.length >= 2) {
    const a = parts[0]![0];
    const b = parts[1]![0];
    if (a && b) return (a + b).toUpperCase();
  }
  const ch = base.slice(0, 2).toUpperCase();
  return ch.length > 0 ? ch : "?";
}

function CollaboratorRow({
  collaborator,
  onRemove,
  canRemove,
}: {
  collaborator: CollaboratorFromApi;
  onRemove: (id: string) => void;
  canRemove: boolean;
}) {
  const displayNameTrimmed = collaborator.clerk?.displayName?.trim() ?? "";
  const primary = displayNameTrimmed.length > 0 ? displayNameTrimmed : collaborator.email;
  const subtitle =
    displayNameTrimmed.length > 0 ? collaborator.email : null;
  const initial = initialsFrom(collaborator.email, displayNameTrimmed || null);
  const avatarUrl =
    collaborator.clerk?.imageUrl &&
    collaborator.clerk.imageUrl.length > 0
      ? collaborator.clerk.imageUrl
      : null;

  return (
    <li className="flex items-center gap-3 rounded-lg border border-border bg-card/40 px-3 py-2">
      {avatarUrl ? (
        <img
          src={avatarUrl}
          alt=""
          width={36}
          height={36}
          className="size-9 shrink-0 rounded-full bg-muted object-cover ring-1 ring-border"
        />
      ) : (
        <div
          className="flex size-9 shrink-0 items-center justify-center rounded-full bg-muted text-[11px] font-medium text-muted-foreground ring-1 ring-border"
          aria-hidden
        >
          {initial}
        </div>
      )}
      <div className="min-w-0 flex-1">
        <div className="truncate text-sm font-medium text-foreground">
          {primary}
        </div>
        {subtitle ? (
          <div className="truncate text-xs text-muted-foreground">{subtitle}</div>
        ) : null}
      </div>
      {canRemove ? (
        <Button
          type="button"
          variant="ghost"
          size="icon-sm"
          className="shrink-0 text-muted-foreground hover:text-destructive"
          aria-label={`Remove collaborator ${collaborator.email}`}
          onClick={() => onRemove(collaborator.id)}
        >
          <Trash2 className="size-4" aria-hidden />
        </Button>
      ) : null}
    </li>
  );
}

export function ShareProjectDialog({
  activeProject,
  open,
  onOpenChange,
}: {
  activeProject: NonNullable<EditorActiveProject>;
  open: boolean;
  onOpenChange: (next: boolean) => void;
}) {
  const isOwner = activeProject.role === "owner";
  const [collaborators, setCollaborators] = useState<CollaboratorFromApi[]>([]);
  const [loadError, setLoadError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [inviteEmail, setInviteEmail] = useState("");
  const [inviteBusy, setInviteBusy] = useState(false);
  const [inviteError, setInviteError] = useState<string | null>(null);
  const [copiedLabel, setCopiedLabel] = useState(false);
  const copiedResetRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const loadCollaborators = useCallback(async () => {
    setLoading(true);
    setLoadError(null);
    try {
      const res = await fetch(
        `/api/projects/${encodeURIComponent(activeProject.id)}/collaborators`
      );
      if (!res.ok) {
        const body = await res.json().catch(() => ({}));
        const msg =
          typeof body === "object" &&
          body !== null &&
          "error" in body &&
          typeof (body as { error?: unknown }).error === "string"
            ? (body as { error: string }).error
            : `Failed to load collaborators (${res.status})`;
        setLoadError(msg);
        setCollaborators([]);
        return;
      }
      const data = (await res.json()) as {
        collaborators?: CollaboratorFromApi[];
      };
      setCollaborators(
        Array.isArray(data.collaborators) ? data.collaborators : []
      );
    } catch {
      setLoadError("Failed to load collaborators");
      setCollaborators([]);
    } finally {
      setLoading(false);
    }
  }, [activeProject.id]);

  useEffect(() => {
    if (!open) return;
    void loadCollaborators();
  }, [open, loadCollaborators]);

  useEffect(() => () => {
    if (copiedResetRef.current) clearTimeout(copiedResetRef.current);
  }, []);

  const markCopied = useCallback(() => {
    setCopiedLabel(true);
    if (copiedResetRef.current) clearTimeout(copiedResetRef.current);
    copiedResetRef.current = setTimeout(() => setCopiedLabel(false), COPIED_MS);
  }, []);

  const handleCopyLink = useCallback(async () => {
    if (typeof window === "undefined") return;
    const url = `${window.location.origin}/editor/${activeProject.id}`;
    try {
      await navigator.clipboard.writeText(url);
      markCopied();
    } catch {
      /* ignore clipboard failures */
    }
  }, [activeProject.id, markCopied]);

  const handleInviteSubmit: FormEventHandler<HTMLFormElement> = async (ev) => {
    ev.preventDefault();
    setInviteError(null);
    const email = inviteEmail.trim();
    if (!email || !isOwner) return;

    setInviteBusy(true);
    try {
      const res = await fetch(
        `/api/projects/${encodeURIComponent(activeProject.id)}/collaborators`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ email }),
        }
      );

      const bodyRaw = await res.json().catch(() => ({}));
      if (!res.ok) {
        const msg =
          typeof bodyRaw === "object" &&
          bodyRaw !== null &&
          "error" in bodyRaw &&
          typeof (bodyRaw as { error?: unknown }).error === "string"
            ? (bodyRaw as { error: string }).error
            : `Invite failed (${res.status})`;
        setInviteError(msg);
        return;
      }

      const created = bodyRaw as CollaboratorFromApi;
      if (
        typeof created?.id === "string" &&
        typeof created.email === "string"
      ) {
        setCollaborators((prev) => [...prev, created]);
      } else {
        await loadCollaborators();
      }
      setInviteEmail("");
    } finally {
      setInviteBusy(false);
    }
  };

  const handleRemove = async (collaboratorId: string) => {
    try {
      const res = await fetch(
        `/api/projects/${encodeURIComponent(activeProject.id)}/collaborators/${encodeURIComponent(collaboratorId)}`,
        { method: "DELETE" }
      );

      if (res.ok) {
        setCollaborators((prev) => prev.filter((c) => c.id !== collaboratorId));
        return;
      }

      const bodyRaw = await res.json().catch(() => ({}));
      const msg =
        typeof bodyRaw === "object" &&
        bodyRaw !== null &&
        "error" in bodyRaw &&
        typeof (bodyRaw as { error?: unknown }).error === "string"
          ? (bodyRaw as { error: string }).error
          : `Remove failed (${res.status})`;
      setLoadError(msg);
      await loadCollaborators();
    } catch {
      setLoadError("Failed to remove collaborator");
      await loadCollaborators();
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent showCloseButton className="gap-6 sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Share project</DialogTitle>
          <DialogDescription>
            {isOwner
              ? "Invite collaborators by email. They appear here once invited."
              : "People invited to collaborate on this project."}
          </DialogDescription>
        </DialogHeader>

        {loadError ? (
          <p className="rounded-lg border border-destructive/30 bg-destructive/10 px-3 py-2 text-sm text-destructive">
            {loadError}
          </p>
        ) : null}

        <div className="grid gap-2">
          <div className="flex flex-wrap items-center justify-between gap-2">
            <span className="text-xs font-medium text-muted-foreground">
              Collaborators ({collaborators.length})
            </span>
          </div>
          <ScrollArea className={cn(collaborators.length > 6 ? "h-52" : "max-h-52")}>
            {loading ? (
              <div className="flex items-center gap-2 py-6 text-sm text-muted-foreground">
                <Loader2 className="size-4 animate-spin shrink-0" aria-hidden />
                Loading…
              </div>
            ) : collaborators.length === 0 ? (
              <p className="rounded-lg border border-dashed border-border bg-muted/20 px-3 py-4 text-center text-sm text-muted-foreground">
                No collaborators yet.
              </p>
            ) : (
              <ul className="flex flex-col gap-2 pe-4 pb-3">
                {collaborators.map((c) => (
                  <CollaboratorRow
                    key={c.id}
                    collaborator={c}
                    onRemove={handleRemove}
                    canRemove={isOwner}
                  />
                ))}
              </ul>
            )}
          </ScrollArea>
        </div>

        {isOwner ? (
          <form className="grid gap-3" onSubmit={handleInviteSubmit}>
            <div className="grid gap-2">
              <label
                htmlFor="share-invite-email"
                className="text-xs font-medium text-muted-foreground"
              >
                Invite by email
              </label>
              <div className="flex flex-col gap-2 sm:flex-row">
                <Input
                  id="share-invite-email"
                  type="email"
                  name="share-invite-email"
                  autoComplete="email"
                  placeholder="name@company.com"
                  value={inviteEmail}
                  disabled={inviteBusy}
                  className="min-w-0 sm:flex-1"
                  onChange={(e) => {
                    setInviteEmail(e.target.value);
                    setInviteError(null);
                  }}
                />
                <Button
                  type="submit"
                  className="inline-flex shrink-0 items-center gap-2"
                  disabled={inviteBusy || !inviteEmail.trim()}
                >
                  {inviteBusy ? (
                    <>
                      <Loader2 className="size-4 animate-spin" aria-hidden />
                      Invite
                    </>
                  ) : (
                    "Invite"
                  )}
                </Button>
              </div>
            </div>
            {inviteError ? (
              <p className="text-xs text-destructive">{inviteError}</p>
            ) : null}
          </form>
        ) : null}

        {isOwner ? (
          <div className="border-t border-border pt-5">
            <Button
              type="button"
              variant="outline"
              className="w-full gap-2"
              onClick={() => void handleCopyLink()}
            >
              <Copy className="size-4" aria-hidden />
              {copiedLabel ? "Copied!" : "Copy project link"}
            </Button>
          </div>
        ) : null}
      </DialogContent>
    </Dialog>
  );
}

export function ShareProjectTriggerButton(props: {
  activeProject: NonNullable<EditorActiveProject>;
}) {
  const [open, setOpen] = useState(false);

  return (
    <>
      <Button
        type="button"
        variant="outline"
        size="sm"
        aria-label="Share project"
        aria-haspopup="dialog"
        onClick={() => setOpen(true)}
      >
        <Share2 className="size-4 sm:mr-1" aria-hidden />
        <span className="hidden sm:inline">Share</span>
      </Button>
      <ShareProjectDialog
        activeProject={props.activeProject}
        open={open}
        onOpenChange={setOpen}
      />
    </>
  );
}
