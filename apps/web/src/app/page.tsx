"use client";

import Link from "next/link";
import { useEffect, useState } from "react";

import {
  apiGet,
  apiPost,
  money,
  type AskResponse,
  type DashboardSummary,
  type DocumentSummary,
} from "@/lib/api";

const QUICK_QUESTIONS = [
  "Who are my top 5 suppliers by spend?",
  "How has my monthly spend changed?",
  "How much VAT did I pay in October?",
];

export default function OverviewPage() {
  const [summary, setSummary] = useState<DashboardSummary | null>(null);
  const [documents, setDocuments] = useState<DocumentSummary[]>([]);
  const [question, setQuestion] = useState("");
  const [answer, setAnswer] = useState<AskResponse | null>(null);
  const [asking, setAsking] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    Promise.all([
      apiGet<DashboardSummary>("/api/v1/dashboard/summary"),
      apiGet<DocumentSummary[]>("/api/v1/documents"),
    ])
      .then(([dashboard, docs]) => {
        setSummary(dashboard);
        setDocuments(docs);
      })
      .catch(() =>
        setError("API not reachable. Start it on port 8010, then refresh."),
      );
  }, []);

  async function ask(text: string) {
    if (!text.trim() || asking) return;
    setAsking(true);
    setError(null);
    try {
      setAnswer(await apiPost<AskResponse>("/api/v1/insights/ask", { question: text }));
    } catch {
      setError("Could not answer. Check the API and try again.");
    } finally {
      setAsking(false);
    }
  }

  return (
    <div className="flex flex-col gap-6">
      <header className="flex flex-col gap-2">
        <h1 className="text-3xl font-semibold tracking-tight">
          Your back office, in plain language.
        </h1>
        <p className="max-w-2xl text-sm leading-6 text-[#5b5b53]">
          Lekont reads invoices, payslips and contracts in French and English,
          keeps a human in the loop, then answers questions about the numbers and
          tells you which process to automate first.
        </p>
      </header>

      {error ? (
        <p className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
          {error}
        </p>
      ) : null}

      <section className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
        <Stat label="Documents" value={summary ? String(summary.documents_total) : "—"} hint="invoices, payslips, contracts" />
        <Stat label="Needs review" value={summary ? String(summary.needs_review) : "—"} hint="human check required" accent="text-amber-700" />
        <Stat label="Spend this month" value={summary ? money(summary.monthly_spend, summary.currency) : "—"} hint={summary ? `VAT ${money(summary.monthly_vat, summary.currency)}` : ""} />
        <Stat label="Readiness" value={summary ? `${summary.readiness_score}/100` : "—"} hint="automation self-assessment" accent="text-[#0f5f56]" />
      </section>

      <div className="grid gap-4 lg:grid-cols-[1.35fr_1fr]">
        <section className="rounded-2xl border border-[#e2e2da] bg-white p-5">
          <div className="mb-3 flex items-center justify-between">
            <h2 className="text-sm font-semibold">Recent documents</h2>
            <Link href="/documents" className="text-xs font-medium text-[#0f5f56] hover:underline">
              Open documents →
            </Link>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead className="text-[11px] uppercase tracking-wide text-[#8a8a80]">
                <tr>
                  <th className="pb-2 font-medium">File</th>
                  <th className="pb-2 font-medium">Party</th>
                  <th className="pb-2 text-right font-medium">Total</th>
                  <th className="pb-2 text-right font-medium">Status</th>
                </tr>
              </thead>
              <tbody>
                {documents.slice(0, 5).map((document) => (
                  <tr key={document.id} className="border-t border-[#efefe9]">
                    <td className="max-w-[180px] truncate py-2.5 pr-3">
                      <Link href="/documents" className="hover:underline">
                        {document.filename}
                      </Link>
                      <span className="block text-[11px] text-[#8a8a80]">{document.doc_type}</span>
                    </td>
                    <td className="py-2.5 pr-3 text-[#4b4b45]">{document.supplier ?? "—"}</td>
                    <td className="py-2.5 text-right tabular-nums">
                      {document.total !== null ? money(document.total, document.currency) : "—"}
                    </td>
                    <td className="py-2.5 text-right">
                      <StatusBadge status={document.status} />
                    </td>
                  </tr>
                ))}
                {documents.length === 0 ? (
                  <tr>
                    <td colSpan={4} className="py-6 text-center text-sm text-[#8a8a80]">
                      Loading documents…
                    </td>
                  </tr>
                ) : null}
              </tbody>
            </table>
          </div>
        </section>

        <section className="flex flex-col gap-3 rounded-2xl border border-[#e2e2da] bg-[#0f5f56] p-5 text-white">
          <div>
            <h2 className="text-sm font-semibold">Ask your spreadsheet</h2>
            <p className="mt-1 text-xs leading-5 text-white/75">
              Plain-language questions over the ledger. Every answer shows the
              calculation.
            </p>
          </div>
          <div className="flex flex-col gap-2">
            {QUICK_QUESTIONS.map((item) => (
              <button
                key={item}
                type="button"
                onClick={() => {
                  setQuestion(item);
                  void ask(item);
                }}
                className="rounded-lg border border-white/20 px-3 py-2 text-left text-xs transition hover:bg-white/10"
              >
                {item}
              </button>
            ))}
          </div>
          <form
            onSubmit={(event) => {
              event.preventDefault();
              void ask(question);
            }}
            className="mt-auto flex gap-2"
          >
            <input
              value={question}
              onChange={(event) => setQuestion(event.target.value)}
              placeholder="Type a question…"
              className="min-w-0 flex-1 rounded-lg bg-white/10 px-3 py-2 text-sm text-white outline-none placeholder:text-white/50"
            />
            <button
              type="submit"
              disabled={asking}
              className="rounded-lg bg-white px-3 py-2 text-sm font-semibold text-[#0f5f56] disabled:opacity-60"
            >
              {asking ? "…" : "Ask"}
            </button>
          </form>
          {answer ? (
            <div className="rounded-xl bg-white/10 p-3 text-xs leading-5">
              <p>{answer.answer}</p>
              <p className="mt-2 font-mono text-[10px] text-white/60">{answer.calculation}</p>
              <Link href="/ask" className="mt-2 inline-block text-[11px] underline">
                See the table and chart →
              </Link>
            </div>
          ) : null}
        </section>
      </div>

      <section className="grid gap-4 sm:grid-cols-2">
        <div className="rounded-2xl border border-[#e2e2da] bg-white p-5">
          <h2 className="text-sm font-semibold">Top supplier</h2>
          <p className="mt-2 text-2xl font-semibold">
            {summary?.top_supplier ?? "—"}
          </p>
          <p className="text-sm text-[#6b6b63]">
            {summary ? `${money(summary.top_supplier_spend, summary.currency)} across the demo period` : ""}
          </p>
        </div>
        <div className="flex flex-col justify-between gap-3 rounded-2xl border border-[#e2e2da] bg-white p-5">
          <div>
            <h2 className="text-sm font-semibold">What should I automate first?</h2>
            <p className="mt-1 text-sm text-[#6b6b63]">
              Six processes scored on effort and impact, with a recommended first step.
            </p>
          </div>
          <Link
            href="/readiness"
            className="w-fit rounded-lg bg-[#171717] px-4 py-2 text-sm font-medium text-white"
          >
            Run the readiness check
          </Link>
        </div>
      </section>
    </div>
  );
}

function Stat({
  label,
  value,
  hint,
  accent = "text-[#171717]",
}: {
  label: string;
  value: string;
  hint: string;
  accent?: string;
}) {
  return (
    <div className="rounded-2xl border border-[#e2e2da] bg-white p-4">
      <p className="text-[11px] uppercase tracking-wide text-[#8a8a80]">{label}</p>
      <p className={`mt-1 text-xl font-semibold tabular-nums ${accent}`}>{value}</p>
      <p className="mt-1 text-[11px] text-[#8a8a80]">{hint}</p>
    </div>
  );
}

function StatusBadge({ status }: { status: DocumentSummary["status"] }) {
  const styles =
    status === "approved"
      ? "bg-emerald-50 text-emerald-700"
      : status === "exported"
        ? "bg-blue-50 text-blue-700"
        : "bg-amber-50 text-amber-700";
  return (
    <span className={`rounded-full px-2 py-0.5 text-[10px] font-medium ${styles}`}>
      {status.replace("_", " ")}
    </span>
  );
}
