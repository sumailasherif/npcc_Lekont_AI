export const API_BASE =
  process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:8000";

async function request<T>(path: string, init?: RequestInit): Promise<T> {
  const response = await fetch(`${API_BASE}${path}`, {
    ...init,
    headers: {
      "Content-Type": "application/json",
      ...(init?.headers ?? {}),
    },
  });
  if (!response.ok) {
    throw new Error(`API responded ${response.status}`);
  }
  return (await response.json()) as T;
}

export function apiGet<T>(path: string): Promise<T> {
  return request<T>(path, { cache: "no-store" });
}

export function apiPost<T>(path: string, body: unknown): Promise<T> {
  return request<T>(path, { method: "POST", body: JSON.stringify(body) });
}

export function money(value: number, currency = "MUR"): string {
  return `${currency} ${Math.round(value).toLocaleString("en-GB")}`;
}

export type DocumentType = "invoice" | "payslip" | "contract";
export type DocumentStatus = "needs_review" | "approved" | "exported";

export type DocumentSummary = {
  id: string;
  filename: string;
  doc_type: DocumentType;
  language: "en" | "fr";
  supplier: string | null;
  total: number | null;
  currency: string;
  status: DocumentStatus;
  confidence: number;
  needs_review: number;
  uploaded_at: string;
};

export type ExtractedField = {
  key: string;
  label: string;
  value: string;
  confidence: number;
  page: number;
  corrected: boolean;
};

export type DocumentRecord = DocumentSummary & {
  text: string;
  fields: ExtractedField[];
  reviewer: string | null;
  reviewed_at: string | null;
};

export type Column = { key: string; label: string };

export type AskResponse = {
  intent: string;
  answer: string;
  calculation: string;
  columns: Column[];
  rows: Record<string, string | number>[];
  chart: { type: "bar" | "line"; x: string; y: string } | null;
  confidence: number;
  caveats: string[];
  suggested: string[];
};

export type ProcessScore = {
  process: string;
  score: number;
  effort: "low" | "medium" | "high";
  impact: "low" | "medium" | "high";
  reason: string;
};

export type DiagnosticResponse = {
  readiness_score: number;
  band: string;
  recommended_first: string;
  summary: string;
  scores: ProcessScore[];
  next_steps: string[];
};

export type DashboardSummary = {
  documents_total: number;
  needs_review: number;
  approved: number;
  monthly_spend: number;
  monthly_vat: number;
  readiness_score: number;
  top_supplier: string | null;
  top_supplier_spend: number;
  currency: string;
  monthly: { month: string; spend: number; vat: number }[];
};

export type ExportResponse = { filename: string; rows: number; csv: string };

export type WhatsAppMessage = {
  id: string;
  direction: "in" | "out";
  from_number: string;
  text: string;
  intent: string;
  created_at: string;
  data: Record<string, unknown> | null;
};

export type WhatsAppReply = {
  reply: string;
  intent: string;
  messages: WhatsAppMessage[];
  data: Record<string, unknown> | null;
};
