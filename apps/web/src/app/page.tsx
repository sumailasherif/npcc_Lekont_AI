"use client";

import Link from "next/link";
import { useEffect, useState } from "react";

import { CountUp } from "@/components/count-up";
import { SpendChart } from "@/components/spend-chart";
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
    <div className="flex flex-col gap-5">
      <header className="animate-fade-up">
        <p className="text-[11px] font-medium uppercase tracking-[0.18em] text-[#94a3b8]">
          Workspace · Overview
        </p>
        <div className="mt-1 flex flex-wrap items-end justify-between gap-3">
          <div>
            <h1 className="text-2xl font-semibold tracking-tight text-[#0f172a]">
              Back office overview
            </h1>
            <p className="mt-1 max-w-2xl text-sm text-[#64748b]">
              Documents in, human-checked data out, then plain-language answers and
              a recommended first automation.
            </p>
          </div>
          <Link
            href="/documents"
            className="rounded-xl bg-gradient-to-r from-[#4f46e5] to-[#6366f1] px-4 py-2 text-sm font-medium text-white shadow-lg shadow-indigo-500/20 transition hover:brightness-110"
          >
            + Add document
          </Link>
        </div>
      </header>

      {error ? (
        <p className="animate-fade-in rounded-xl border border-rose-200 bg-rose-50 px-4 py-3 text-sm text-rose-700">
          {error}
        </p>
      ) : null}

      <section className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
        <Kpi
          label="Documents processed"
          value={summary?.documents_total ?? 0}
          hint={`${summary?.approved ?? 0} approved`}
          tone="indigo"
          delay="delay-1"
          icon="M6 3h9l4 4v14H6V3Zm8 1v4h4"
        />
        <Kpi
          label="Needs review"
          value={summary?.needs_review ?? 0}
          hint="human check required"
          tone="amber"
          delay="delay-2"
          icon="M12 8v5m0 3h.01M10.3 3.9 2.6 17a2 2 0 0 0 1.7 3h15.4a2 2 0 0 0 1.7-3L13.7 3.9a2 2 0 0 0-3.4 0Z"
        />
        <Kpi
          label="Spend this month"
          value={summary?.monthly_spend ?? 0}
          hint={`VAT ${summary ? money(summary.monthly_vat, summary.currency) : "—"}`}
          tone="teal"
          delay="delay-3"
          prefix="MUR "
          icon="M4 19V9m5 10V5m5 14v-7m5 7V7"
        />
        <Kpi
          label="Automation readiness"
          value={summary?.readiness_score ?? 0}
          hint="out of 100"
          tone="violet"
          delay="delay-4"
          suffix="/100"
          icon="M12 3a9 9 0 1 0 9 9h-9V3Z"
        />
      </section>

      <section className="grid gap-4 xl:grid-cols-[1.5fr_1fr]">
        <article className="animate-fade-up delay-2 rounded-2xl border border-[#e6e8f0] bg-white p-5 card-lift">
          <div className="flex items-start justify-between">
            <div>
              <h2 className="text-sm font-semibold text-[#0f172a]">Cash outflow</h2>
              <p className="text-xs text-[#64748b]">Monthly ledger totals, Feb–Nov 2026</p>
            </div>
            <div className="text-right">
              <p className="text-lg font-semibold tabular-nums text-[#0f172a]">
                {summary ? money(summary.monthly_spend, summary.currency) : "—"}
              </p>
              <p className="text-[11px] text-[#64748b]">this month</p>
            </div>
          </div>
          <div className="mt-4">
            {summary ? <SpendChart data={summary.monthly} /> : <ChartSkeleton />}
          </div>
          <div className="mt-3 flex items-center gap-4 text-[11px] text-[#64748b]">
            <span className="flex items-center gap-1.5">
              <span className="h-2 w-2 rounded-full bg-[#4f46e5]" />
              Spend
            </span>
            <span className="flex items-center gap-1.5">
              <span className="h-2 w-2 rounded-full bg-[#0d9488]" />
              Includes payroll
            </span>
          </div>
        </article>

        <article className="animate-fade-up delay-3 flex flex-col gap-3 rounded-2xl border border-transparent bg-gradient-to-br from-[#4f46e5] via-[#5b4ae0] to-[#7c3aed] p-5 text-white shadow-xl shadow-indigo-500/20">
          <div>
            <span className="rounded-full bg-white/15 px-2.5 py-1 text-[10px] font-medium uppercase tracking-wide">
              Ask AI
            </span>
            <h2 className="mt-3 text-lg font-semibold leading-tight">
              Ask your spreadsheet
            </h2>
            <p className="mt-1 text-xs leading-5 text-white/75">
              Every answer shows the calculation, the rows behind it, and what it
              does not cover.
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
                className="rounded-xl border border-white/20 px-3 py-2 text-left text-xs transition hover:translate-x-0.5 hover:bg-white/10"
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
              className="min-w-0 flex-1 rounded-xl bg-white/10 px-3 py-2 text-sm text-white outline-none placeholder:text-white/50"
            />
            <button
              type="submit"
              disabled={asking}
              className="rounded-xl bg-white px-3 py-2 text-sm font-semibold text-[#4f46e5] transition hover:bg-indigo-50 disabled:opacity-60"
            >
              {asking ? "…" : "Ask"}
            </button>
          </form>
          {answer ? (
            <div className="animate-fade-in rounded-xl bg-black/15 p-3 text-xs leading-5">
              <p>{answer.answer}</p>
              <p className="mt-2 font-mono text-[10px] text-white/60">
                {answer.calculation}
              </p>
              <Link href="/ask" className="mt-2 inline-block text-[11px] underline">
                See the table and chart →
              </Link>
            </div>
          ) : null}
        </article>
      </section>

      <section className="animate-fade-up delay-3 overflow-hidden rounded-2xl border border-[#e6e8f0] bg-white card-lift">
        <div className="flex items-center justify-between border-b border-[#f1f3f5] px-5 py-3">
          <div>
            <h2 className="text-sm font-semibold text-[#0f172a]">Recent documents</h2>
            <p className="text-[11px] text-[#64748b]">Extraction confidence and review state</p>
          </div>
          <Link href="/documents" className="text-xs font-medium text-[#4f46e5] hover:underline">
            View all →
          </Link>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead className="bg-[#f9fafb] text-[10px] uppercase tracking-wide text-[#94a3b8]">
              <tr>
                <th className="px-5 py-2.5 font-medium">File</th>
                <th className="px-5 py-2.5 font-medium">Party</th>
                <th className="px-5 py-2.5 text-right font-medium">Total</th>
                <th className="px-5 py-2.5 text-right font-medium">Confidence</th>
                <th className="px-5 py-2.5 text-right font-medium">Status</th>
              </tr>
            </thead>
            <tbody>
              {documents.slice(0, 6).map((document) => (
                <tr
                  key={document.id}
                  className="group border-t border-[#f1f3f5] transition-colors hover:bg-[#f9fafb]"
                >
                  <td className="px-5 py-3">
                    <Link href="/documents" className="font-medium group-hover:text-[#4f46e5]">
                      {document.filename}
                    </Link>
                    <span className="block text-[11px] text-[#94a3b8]">
                      {document.doc_type} · {document.language.toUpperCase()}
                    </span>
                  </td>
                  <td className="px-5 py-3 text-[#475569]">{document.supplier ?? "—"}</td>
                  <td className="px-5 py-3 text-right tabular-nums">
                    {document.total !== null
                      ? money(document.total, document.currency)
                      : "—"}
                  </td>
                  <td className="px-5 py-3 text-right">
                    <span className="inline-flex items-center gap-2">
                      <span className="h-1.5 w-16 overflow-hidden rounded-full bg-[#eef0f6]">
                        <span
                          className="grow-bar block h-full rounded-full bg-[#4f46e5]"
                          style={{ width: `${document.confidence * 100}%` }}
                        />
                      </span>
                      <span className="text-[11px] tabular-nums text-[#64748b]">
                        {Math.round(document.confidence * 100)}%
                      </span>
                    </span>
                  </td>
                  <td className="px-5 py-3 text-right">
                    <StatusBadge status={document.status} />
                  </td>
                </tr>
              ))}
              {documents.length === 0 ? (
                <tr>
                  <td colSpan={5} className="px-5 py-10 text-center text-sm text-[#94a3b8]">
                    Loading documents…
                  </td>
                </tr>
              ) : null}
            </tbody>
          </table>
        </div>
      </section>

      <section className="grid gap-4 sm:grid-cols-2">
        <article className="animate-fade-up delay-4 rounded-2xl border border-[#e6e8f0] bg-white p-5 card-lift">
          <p className="text-[10px] font-semibold uppercase tracking-wide text-[#94a3b8]">
            Top supplier
          </p>
          <p className="mt-2 text-xl font-semibold text-[#0f172a]">
            {summary?.top_supplier ?? "—"}
          </p>
          <p className="text-sm text-[#64748b]">
            {summary
              ? `${money(summary.top_supplier_spend, summary.currency)} across the demo period`
              : ""}
          </p>
        </article>
        <article className="animate-fade-up delay-5 flex flex-col justify-between gap-3 rounded-2xl border border-[#e6e8f0] bg-white p-5 card-lift">
          <div>
            <p className="text-[10px] font-semibold uppercase tracking-wide text-[#94a3b8]">
              Next best action
            </p>
            <h2 className="mt-1 text-sm font-semibold text-[#0f172a]">
              What should I automate first?
            </h2>
            <p className="mt-1 text-xs leading-5 text-[#64748b]">
              Six processes scored on effort and impact, with a recommended first
              step.
            </p>
          </div>
          <Link
            href="/readiness"
            className="w-fit rounded-xl bg-[#0f172a] px-4 py-2 text-sm font-medium text-white transition hover:bg-[#1e293b]"
          >
            Run the readiness check
          </Link>
        </article>
      </section>
    </div>
  );
}

const TONES = {
  indigo: "bg-[#eef2ff] text-[#4f46e5]",
  amber: "bg-[#fffbeb] text-[#d97706]",
  teal: "bg-[#ecfdf5] text-[#0d9488]",
  violet: "bg-[#f5f3ff] text-[#7c3aed]",
};

function Kpi({
  label,
  value,
  hint,
  tone,
  delay,
  prefix = "",
  suffix = "",
  icon,
}: {
  label: string;
  value: number;
  hint: string;
  tone: keyof typeof TONES;
  delay: string;
  prefix?: string;
  suffix?: string;
  icon: string;
}) {
  return (
    <article
      className={`animate-fade-up ${delay} rounded-2xl border border-[#e6e8f0] bg-white p-4 card-lift`}
    >
      <div className="flex items-start justify-between">
        <p className="text-[10px] font-semibold uppercase tracking-wide text-[#94a3b8]">
          {label}
        </p>
        <span className={`grid h-7 w-7 place-items-center rounded-lg ${TONES[tone]}`}>
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
            <path d={icon} />
          </svg>
        </span>
      </div>
      <p className="mt-2 text-2xl font-semibold text-[#0f172a]">
        <CountUp value={value} prefix={prefix} suffix={suffix} />
      </p>
      <p className="mt-1 text-[11px] text-[#64748b]">{hint}</p>
    </article>
  );
}

function ChartSkeleton() {
  return <div className="skeleton h-44 w-full rounded-xl" />;
}

function StatusBadge({ status }: { status: DocumentSummary["status"] }) {
  const styles =
    status === "approved"
      ? "bg-emerald-50 text-emerald-700"
      : status === "exported"
        ? "bg-sky-50 text-sky-700"
        : "bg-amber-50 text-amber-700";
  return (
    <span className={`rounded-full px-2 py-0.5 text-[10px] font-medium ${styles}`}>
      {status.replace("_", " ")}
    </span>
  );
}
