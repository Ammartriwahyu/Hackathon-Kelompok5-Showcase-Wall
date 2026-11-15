export interface ApiResponse<T> {
  data: T;
  meta?: { next_cursor?: string | null };
}

export interface ApiError {
  error: {
    code: string;
    message: string;
    fields?: Record<string, string>;
  };
}

export interface User {
  id: string;
  email: string;
  display_name: string;
  role: "Contributor" | "Admin";
}

export interface PublicWork {
  id: string;
  title: string;
  summary: string;
  category: string;
  tech_stack: string[];
  team_members: string[];
  cover_url: string;
  published_at: string;
  is_featured: boolean;
}

export interface PublicWorkDetail extends PublicWork {
  description: string;
  benefits: string;
  demo_url: string | null;
  repo_url: string | null;
}

export interface ManagedWork extends Omit<PublicWorkDetail, "published_at"> {
  status: "Draft" | "Published" | "Unpublished";
  owner_name: string;
  published_at: string | null;
  created_at: string;
  updated_at: string;
}

export interface DashboardSummary {
  total_draft: number;
  total_published: number;
  total_unpublished: number;
  total_featured: number;
}

export type WsWorkEvent =
  | { type: "work.published"; seq: number; payload: Omit<PublicWork, "is_featured"> }
  | { type: "work.unpublished"; seq: number; payload: { id: string } }
  | { type: "work.deleted"; seq: number; payload: { id: string } };