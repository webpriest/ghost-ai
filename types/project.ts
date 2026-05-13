export interface Project {
  id: string;
  name: string;
  slug: string;
  /** Owner sees rename/delete; collaborator (shared) does not */
  role: "owner" | "collaborator";
}
