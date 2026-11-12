"use client";

import { useEffect, useMemo, useState } from "react";

import { useLanguage } from "@/components/language-provider";
import { PageHero, buttonGhost, buttonPrimary } from "@/components/motion";
import {
  apiGet,
  apiPost,
  money,
  type DocumentRecord,
  type DocumentSummary,
  type ExportResponse,
} from "@/lib/api";

const DOC_TYPES = ["invoice", "payslip", "contract"] as const;

export default function DocumentsPage() {
  const { t } = useLanguage();
  const [documents, setDocuments] = useState<DocumentSummary[]>([]);
  const [selected, setSelected] = useState<DocumentRecord | null>(null);
  const [edits, setEdits] = useState<Record<string, string>>({});
  const [reviewer, setReviewer] = useState("demo.accountant");
  const [filter, setFilter] = useState<"all" | "needs_review">("all");
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState({
    filename: "",
    doc_type: "invoice" as (typeof DOC_TYPES)[number],
    language: "en",
    text: "",
  });
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function refresh() {
    setDocuments(await apiGet<DocumentSummary[]>("/api/v1/documents"));
  }

  useEffect(() => {
    apiGet<DocumentSummary[]>("/api/v1/documents")
      .then(setDocuments)
      .catch(() => setError("API not reachable. Start it on port 8010."));
  }, []);

  const visible = useMemo(
    () =>
      filter === "all"
        ? documents
        : documents.filter((doc) => doc.status === "needs_review"),
    [documents, filter],
  );

  function select(document: DocumentRecord) {
    setSelected(document);
    setEdits(Object.fromEntries(document.fields.map((f) => [f.key, f.value])));
  }

  async function open(id: string) {
    try {
      select(await apiGet<DocumentRecord>(`/api/v1/documents/${id}`));
    } catch {
      setError("Could not open that document.");
    }
  }

  async function saveReview() {
    if (!selected || busy) return;
    setBusy(true);
    try {
      const updated = await apiPost<DocumentRecord>(
        `/api/v1/documents/${selected.id}/review`,
        {
          reviewer,
          fields: Object.entries(edits).map(([key, value]) => ({ key, value })),
        },
      );
      select(updated);
      await refresh();
    } catch {
      setError("Could not save the review.");
    } finally {
      setBusy(false);
    }
  }

  async function addDocument() {
    if (!form.filename.trim() || form.text.trim().length < 10 || busy) return;
    setBusy(true);
    try {
      const created = await apiPost<DocumentRecord>("/api/v1/documents", form);
      setShowForm(false);
      setForm({ filename: "", doc_type: "invoice", language: "en", text: "" });
      await refresh();
      select(created);
    } catch {
      setError("Could not extract that document.");
    } finally {
      setBusy(false);
    }
  }

  async function downloadCsv() {
    try {
      const result = await apiGet<ExportResponse>("/api/v1/documents/export");
      const url = URL.createObjectURL(
        new Blob([result.csv], { type: "text/csv;charset=utf-8" }),
      );
      const anchor = document.createElement("a");
      anchor.href = url;
      anchor.download = result.filename;
      anchor.click();
      URL.revokeObjectURL(url);
    } catch {
      setError("Export failed.");
    }
  }

  return (
    <>
      <PageHero
        compact
        eyebrow={t.hero.docsEyebrow}
        title={t.hero.docsLead}
        highlight={t.hero.docsHighlight}
        description={t.hero.docsSub}
        actions={
          <>
            <button type="button" onClick={() => setShowForm((value) => !value)} className={buttonPrimary}>
              {showForm ? "Close" : "Add document"}
            </button>
            <button type="button" onClick={() => void downloadCsv()} className={buttonGhost}>
              Export CSV
            </button>
          </>
        }
      />
    <div className="relative z-10 mx-auto -mt-16 flex max-w-6xl flex-col gap-5 px-4 pb-24 md:px-6">

      {error ? (
        <p className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
          {error}
        </p>
      ) : null}

      {showForm ? (
        <section className="flex flex-col gap-3 rounded-2xl border border-line bg-card card-lift shadow-[0_1px_2px_rgba(15,23,42,0.04),0_12px_32px_-16px_rgba(15,23,42,0.12)] p-4">
          <div className="grid gap-3 sm:grid-cols-3">
            <label className="flex flex-col gap-1 text-xs font-medium text-muted">
              File name
              <input
                value={form.filename}
                onChange={(event) => setForm({ ...form, filename: event.target.value })}
                placeholder="invoice_supplier_2026-11.pdf"
                className="rounded-xl border border-line bg-card px-3 py-2 outline-none transition focus:border-lagoon focus:ring-4 focus:ring-lagoon/15 text-sm font-normal"
              />
            </label>
            <label className="flex flex-col gap-1 text-xs font-medium text-muted">
              Type
              <select
                value={form.doc_type}
                onChange={(event) =>
                  setForm({
                    ...form,
                    doc_type: event.target.value as (typeof DOC_TYPES)[number],
                  })
                }
                className="rounded-xl border border-line bg-card px-3 py-2 outline-none transition focus:border-lagoon focus:ring-4 focus:ring-lagoon/15 text-sm font-normal"
              >
                {DOC_TYPES.map((type) => (
                  <option key={type}>{type}</option>
                ))}
              </select>
            </label>
            <label className="flex flex-col gap-1 text-xs font-medium text-muted">
              Language
              <select
                value={form.language}
                onChange={(event) => setForm({ ...form, language: event.target.value })}
                className="rounded-xl border border-line bg-card px-3 py-2 outline-none transition focus:border-lagoon focus:ring-4 focus:ring-lagoon/15 text-sm font-normal"
              >
                <option value="en">English</option>
                <option value="fr">French</option>
              </select>
            </label>
          </div>
          <label className="flex flex-col gap-1 text-xs font-medium text-muted">
            Document text
            <textarea
              value={form.text}
              onChange={(event) => setForm({ ...form, text: event.target.value })}
              rows={6}
              placeholder={"INVOICE\nSupplier: ...\nInvoice No: ...\nTotal: ..."}
              className="rounded-xl border border-line bg-card px-3 py-2 outline-none transition focus:border-lagoon focus:ring-4 focus:ring-lagoon/15 font-mono text-xs leading-5"
            />
          </label>
          <button
            type="button"
            onClick={() => void addDocument()}
            disabled={busy || form.text.trim().length < 10}
            className="w-fit rounded-lg bg-lagoon-deep px-4 py-2 text-sm font-semibold text-white transition hover:-translate-y-0.5 hover:bg-lagoon disabled:opacity-50"
          >
            {busy ? "Extracting…" : "Extract fields"}
          </button>
        </section>
      ) : null}

      <div className="flex gap-2">
        {(["all", "needs_review"] as const).map((value) => (
          <button
            key={value}
            type="button"
            onClick={() => setFilter(value)}
            className={`rounded-full px-3 py-1.5 text-xs font-medium ${
              filter === value
                ? "bg-ink text-card"
                : "border border-line bg-card text-ink"
            }`}
          >
            {value === "all" ? "All documents" : "Needs review"}
          </button>
        ))}
      </div>

      <div className="grid gap-4 lg:grid-cols-[1.1fr_1fr]">
        <section className="overflow-hidden rounded-2xl border border-line bg-card card-lift shadow-[0_1px_2px_rgba(15,23,42,0.04),0_12px_32px_-16px_rgba(15,23,42,0.12)]">
          <table className="w-full text-left text-sm">
            <thead className="bg-surface text-[11px] uppercase tracking-wide text-muted">
              <tr>
                <th className="px-4 py-2.5 font-medium">File</th>
                <th className="px-4 py-2.5 font-medium">Party</th>
                <th className="px-4 py-2.5 text-right font-medium">Total</th>
                <th className="px-4 py-2.5 text-right font-medium">Status</th>
              </tr>
            </thead>
            <tbody>
              {visible.map((document) => (
                <tr
                  key={document.id}
                  onClick={() => void open(document.id)}
                  className={`cursor-pointer border-t border-line hover:bg-surface ${
                    selected?.id === document.id ? "bg-lagoon-wash" : ""
                  }`}
                >
                  <td className="px-4 py-3">
                    <span className="block max-w-[190px] truncate">
                      {document.filename}
                    </span>
                    <span className="text-[11px] text-muted">
                      {document.doc_type} · {(document.confidence * 100).toFixed(0)}%
                    </span>
                  </td>
                  <td className="px-4 py-3 text-ink">{document.supplier ?? "—"}</td>
                  <td className="px-4 py-3 text-right tabular-nums">
                    {document.total !== null
                      ? money(document.total, document.currency)
                      : "—"}
                  </td>
                  <td className="px-4 py-3 text-right">
                    <span
                      className={`rounded-full px-2 py-0.5 text-[10px] font-medium ${
                        document.status === "approved"
                          ? "bg-lagoon-wash text-lagoon-deep"
                          : "bg-amber-50 text-amber-700"
                      }`}
                    >
                      {document.status.replace("_", " ")}
                    </span>
                  </td>
                </tr>
              ))}
              {visible.length === 0 ? (
                <tr>
                  <td colSpan={4} className="px-4 py-8 text-center text-sm text-muted">
                    Nothing here yet.
                  </td>
                </tr>
              ) : null}
            </tbody>
          </table>
        </section>

        <section className="rounded-2xl border border-line bg-card card-lift shadow-[0_1px_2px_rgba(15,23,42,0.04),0_12px_32px_-16px_rgba(15,23,42,0.12)] p-4">
          {selected ? (
            <div className="flex flex-col gap-4">
              <div>
                <p className="text-[11px] uppercase tracking-wide text-muted">
                  {selected.doc_type} · {selected.language.toUpperCase()}
                </p>
                <h2 className="text-base font-semibold">{selected.filename}</h2>
              </div>

              <div className="flex flex-col gap-3">
                {selected.fields.map((field) => (
                  <label key={field.key} className="flex flex-col gap-1">
                    <span className="flex items-center justify-between text-[11px] text-muted">
                      {field.label}
                      <span className="font-mono text-[10px]">
                        {(field.confidence * 100).toFixed(0)}%
                      </span>
                    </span>
                    <input
                      value={edits[field.key] ?? field.value}
                      onChange={(event) =>
                        setEdits({ ...edits, [field.key]: event.target.value })
                      }
                      className={`rounded-lg border px-3 py-2 text-sm ${
                        field.confidence < 0.9
                          ? "border-amber-300 bg-amber-50"
                          : "border-line"
                      }`}
                    />
                  </label>
                ))}
              </div>

              <div className="flex flex-wrap items-end gap-2 border-t border-line pt-3">
                <label className="flex flex-1 flex-col gap-1 text-[11px] text-muted">
                  Reviewed by
                  <input
                    value={reviewer}
                    onChange={(event) => setReviewer(event.target.value)}
                    className="rounded-xl border border-line bg-card px-3 py-2 outline-none transition focus:border-lagoon focus:ring-4 focus:ring-lagoon/15 text-sm"
                  />
                </label>
                <button
                  type="button"
                  onClick={() => void saveReview()}
                  disabled={busy}
                  className="rounded-lg bg-lagoon-deep px-4 py-2 text-sm font-semibold text-white transition hover:-translate-y-0.5 hover:bg-lagoon disabled:opacity-50"
                >
                  {busy
                    ? "Saving…"
                    : selected.status === "approved"
                      ? "Save changes"
                      : "Approve"}
                </button>
              </div>
              <p className="text-[11px] leading-5 text-muted">
                Low-confidence fields are highlighted. The reviewer is recorded with
                the approval and kept in the export.
              </p>
            </div>
          ) : (
            <div className="flex h-full min-h-[220px] items-center justify-center text-center text-sm text-muted">
              Select a document to review its extracted fields.
            </div>
          )}
        </section>
      </div>
    </div>
    </>
  );
}
