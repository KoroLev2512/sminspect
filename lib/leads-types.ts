// Pure types & labels for demo requests — safe to import from client components
// (no Node-only dependencies, unlike lib/leads.ts which uses the filesystem).

export type LeadStatus = "new" | "in_progress" | "done";

export interface Lead {
  id: string;
  name: string;
  email: string;
  company: string;
  role: string;
  segment: string;
  message: string;
  status: LeadStatus;
  createdAt: string;
}

export interface NewLead {
  name: string;
  email: string;
  company: string;
  role: string;
  segment: string;
  message: string;
}

export const leadStatusLabels: Record<LeadStatus, string> = {
  new: "Новая",
  in_progress: "В работе",
  done: "Обработана",
};
