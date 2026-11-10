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
  return request<T>(path, {
    method: "POST",
    body: JSON.stringify(body),
  });
}

export type Language = "en" | "fr" | "cr";

export type KnowledgeCard = {
  id: string;
  title: string;
  body: string;
  source: string;
  year?: number | null;
  topics: string[];
};

export type Expert = {
  id: string;
  name: string;
  initials: string;
  role: string;
  organisation: string;
  country: string;
  city?: string | null;
  categories: string[];
  headline: string;
  bio: string;
  languages: string[];
  accent: string;
  featured: boolean;
  mauritian: boolean;
  verified: boolean;
  profile_type: "public_record" | "composite";
  disclaimer: string;
  topics: string[];
  sample_questions: string[];
  knowledge: KnowledgeCard[];
};

export type ExpertCitation = {
  card_id: string;
  title: string;
  source: string;
  year?: number | null;
};

export type ExpertAnswer = {
  answer: string;
  source_answer: string;
  language: Language;
  citations: ExpertCitation[];
  confidence: number;
  engine: string;
  review_required: boolean;
  suggested: string[];
  disclaimer: string;
};
