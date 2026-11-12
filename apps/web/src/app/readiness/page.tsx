"use client";

import { useState } from "react";
import type { ReactNode } from "react";

import { apiPost, type DiagnosticResponse } from "@/lib/api";

const TOOLS = ["excel", "whatsapp", "paper", "accounting software", "erp"];
const PAINS = [
  { id: "invoices", label: "Invoices" },
  { id: "payroll", label: "Payroll" },
  { id: "reporting", label: "Reporting" },
  { id: "filing", label: "Filing" },
  { id: "supplier", label: "Supplier reconciliation" },
  { id: "stock", label: "Stock" },
];

export default function ReadinessPage() {
  const [form, setForm] = useState({
    sector: "Distribution",
    employees: 12,
    monthly_invoices: 45,
    monthly_payslips: 6,
    admin_hours: 22,
  });
  const [tools, setTools] = useState<string[]>(["excel", "whatsapp"]);
  const [pains, setPains] = useState<string[]>(["invoices", "reporting"]);
  const [result, setResult] = useState<DiagnosticResponse | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  function toggle(list: string[], value: string, setter: (next: string[]) => void) {
    setter(list.includes(value) ? list.filter((item) => item !== value) : [...list, value]);
  }

  async function submit() {
    setLoading(true);
    setError(null);
    try {
      setResult(
        await apiPost<DiagnosticResponse>("/api/v1/insights/readiness", {
          ...form,
          tools,
          pain_points: pains,
        }),
      );
    } catch {
      setError("Could not run the assessment. Check the API and try again.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="animate-fade-in flex flex-col gap-5">
      <header>
        <h1 className="text-2xl font-semibold tracking-tight">Automation readiness</h1>
        <p className="mt-1 max-w-2xl text-sm text-[#5b5b53]">
          A short diagnostic that scores six back-office processes on effort and
          impact, then tells you which one to automate first. Evidence base: HRDC
          S1, S2 and S4.
        </p>
      </header>

      <section className="grid gap-4 lg:grid-cols-[1fr_1.15fr]">
        <div className="flex flex-col gap-4 rounded-2xl border border-[#e5e7eb] bg-white p-5">
          <div className="grid gap-3 sm:grid-cols-2">
            <Field label="Sector">
              <input
                value={form.sector}
                onChange={(event) => setForm({ ...form, sector: event.target.value })}
                className="rounded-lg border border-[#d1d5db] px-3 py-2 text-sm font-normal text-[#171717]"
              />
            </Field>
            <Field label="Employees">
              <input
                type="number"
                value={form.employees}
                onChange={(event) =>
                  setForm({ ...form, employees: Number(event.target.value) })
                }
                className="rounded-lg border border-[#d1d5db] px-3 py-2 text-sm font-normal text-[#171717]"
              />
            </Field>
            <Field label="Invoices / month">
              <input
                type="number"
                value={form.monthly_invoices}
                onChange={(event) =>
                  setForm({ ...form, monthly_invoices: Number(event.target.value) })
                }
                className="rounded-lg border border-[#d1d5db] px-3 py-2 text-sm font-normal text-[#171717]"
              />
            </Field>
            <Field label="Payslips / month">
              <input
                type="number"
                value={form.monthly_payslips}
                onChange={(event) =>
                  setForm({ ...form, monthly_payslips: Number(event.target.value) })
                }
                className="rounded-lg border border-[#d1d5db] px-3 py-2 text-sm font-normal text-[#171717]"
              />
            </Field>
            <Field label="Admin hours / month">
              <input
                type="number"
                value={form.admin_hours}
                onChange={(event) =>
                  setForm({ ...form, admin_hours: Number(event.target.value) })
                }
                className="rounded-lg border border-[#d1d5db] px-3 py-2 text-sm font-normal text-[#171717]"
              />
            </Field>
          </div>

          <div className="flex flex-col gap-2">
            <span className="text-[11px] font-medium uppercase tracking-wide text-[#6b7280]">
              Tools today
            </span>
            <div className="flex flex-wrap gap-2">
              {TOOLS.map((tool) => (
                <Chip
                  key={tool}
                  active={tools.includes(tool)}
                  onClick={() => toggle(tools, tool, setTools)}
                >
                  {tool}
                </Chip>
              ))}
            </div>
          </div>

          <div className="flex flex-col gap-2">
            <span className="text-[11px] font-medium uppercase tracking-wide text-[#6b7280]">
              Where it hurts
            </span>
            <div className="flex flex-wrap gap-2">
              {PAINS.map((pain) => (
                <Chip
                  key={pain.id}
                  active={pains.includes(pain.id)}
                  onClick={() => toggle(pains, pain.id, setPains)}
                >
                  {pain.label}
                </Chip>
              ))}
            </div>
          </div>

          <button
            type="button"
            onClick={() => void submit()}
            disabled={loading}
            className="mt-2 w-fit rounded-lg bg-[#4f46e5] px-4 py-2 text-sm font-medium text-white disabled:opacity-60"
          >
            {loading ? "Scoring…" : "Run the check"}
          </button>
        </div>

        <div className="flex flex-col gap-4">
          {error ? (
            <p className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
              {error}
            </p>
          ) : null}

          {result ? (
            <>
              <div className="rounded-2xl border border-[#e5e7eb] bg-[#4f46e5] p-5 text-white">
                <div className="flex items-start justify-between gap-4">
                  <div>
                    <p className="text-[11px] uppercase tracking-wide text-white/60">
                      Readiness score
                    </p>
                    <p className="text-4xl font-semibold">{result.readiness_score}/100</p>
                    <p className="mt-1 text-sm text-white/80">{result.band}</p>
                  </div>
                  <div className="rounded-xl bg-white/10 px-3 py-2 text-right">
                    <p className="text-[10px] uppercase tracking-wide text-white/60">
                      Start with
                    </p>
                    <p className="text-sm font-semibold">{result.recommended_first}</p>
                  </div>
                </div>
                <p className="mt-4 text-sm leading-6 text-white/85">{result.summary}</p>
              </div>

              <div className="flex flex-col gap-3 rounded-2xl border border-[#e5e7eb] bg-white p-5">
                <h2 className="text-sm font-semibold">Process scores</h2>
                {result.scores.map((score) => (
                  <div key={score.process} className="flex flex-col gap-1">
                    <div className="flex items-center justify-between text-xs">
                      <span className="font-medium">{score.process}</span>
                      <span className="flex gap-1">
                        <Tag tone={score.impact}>{score.impact}</Tag>
                        <Tag tone={score.effort}>{score.effort} effort</Tag>
                        <span className="tabular-nums text-[#4b5563]">{score.score}</span>
                      </span>
                    </div>
                    <span className="h-2 overflow-hidden rounded-full bg-[#f1f3f5]">
                      <span
                        className="grow-bar block h-full rounded-full bg-[#4f46e5]"
                        style={{ width: `${score.score}%` }}
                      />
                    </span>
                    <span className="text-[11px] text-[#6b7280]">{score.reason}</span>
                  </div>
                ))}
              </div>

              <div className="rounded-2xl border border-[#e5e7eb] bg-white p-5">
                <h2 className="text-sm font-semibold">Next steps</h2>
                <ol className="mt-2 flex flex-col gap-2 text-sm text-[#374151]">
                  {result.next_steps.map((step, index) => (
                    <li key={step} className="flex gap-2">
                      <span className="grid h-5 w-5 shrink-0 place-items-center rounded-full bg-[#eef2ff] text-[11px] font-semibold text-[#4f46e5]">
                        {index + 1}
                      </span>
                      {step}
                    </li>
                  ))}
                </ol>
              </div>
            </>
          ) : (
            <div className="flex min-h-[260px] flex-col items-center justify-center gap-2 rounded-2xl border border-dashed border-[#d1d5db] bg-white p-6 text-center">
              <p className="text-sm font-medium">No assessment yet</p>
              <p className="max-w-sm text-xs leading-5 text-[#6b7280]">
                Answer the six inputs and run the check. The recommendation is
                rule-based and explainable; it is a starting point for interviews,
                not a prediction.
              </p>
            </div>
          )}
        </div>
      </section>
    </div>
  );
}

function Field({ label, children }: { label: string; children: ReactNode }) {
  return (
    <label className="flex flex-col gap-1 text-[11px] font-medium text-[#4b5563]">
      {label}
      {children}
    </label>
  );
}

function Chip({
  active,
  onClick,
  children,
}: {
  active: boolean;
  onClick: () => void;
  children: ReactNode;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`rounded-full px-3 py-1.5 text-xs capitalize ${
        active
          ? "bg-[#171717] text-white"
          : "border border-[#d1d5db] bg-white text-[#374151]"
      }`}
    >
      {children}
    </button>
  );
}

function Tag({ children, tone }: { children: ReactNode; tone: string }) {
  const color =
    tone === "high"
      ? "bg-emerald-50 text-emerald-700"
      : tone === "medium"
        ? "bg-amber-50 text-amber-700"
        : "bg-[#f7f8fa] text-[#4b5563]";
  return (
    <span className={`rounded-full px-2 py-0.5 text-[10px] font-medium ${color}`}>
      {children}
    </span>
  );
}
