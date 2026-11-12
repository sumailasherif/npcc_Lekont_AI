"use client";

import { useEffect, useMemo, useState } from "react";

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
    refresh().catch(() => setError("API not reachable. Start it on port 8010."));
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
    <div className="flex flex-col gap-5">
      <header className="flex flex-wrap items-end justify-between gap-3">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight">Documents</h1>
          <p className="mt-1 max-w-xl text-sm text-[#5b5b53]">
            Extract invoices, payslips and contracts in French and English.
            Nothing is exported until a named reviewer approves it.
          </p>
        </div>
        <div className="flex gap-2">
          <button
            type="button"
            onClick={() => void downloadCsv()}
            className="rounded-lg border border-[#d8d8cf] bg-white px-3 py-2 text-sm font-medium"
          >
            Export CSV
          </button>
          <button
            type="button"
            onClick={() => setShowForm((value) => !value)}
            className="rounded-lg bg-[#171717] px-3 py-2 text-sm font-medium text-white"
          >
            {showForm ? "Close" : "Add document"}
          </button>
        </div>
      </header>

      {error ? (
        <p className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
          {error}
        </p>
      ) : null}

      {showForm ? (
        <section className="flex flex-col gap-3 rounded-2xl border border-[#e2e2da] bg-white p-4">
          <div className="grid gap-3 sm:grid-cols-3">
            <label className="flex flex-col gap-1 text-xs font-medium text-[#5b5b53]">
              File name
              <input
                value={form.filename}
                onChange={(event) => setForm({ ...form, filename: event.target.value })}
                placeholder="invoice_supplier_2026-11.pdf"
                className="rounded-lg border border-[#d8d8cf] px-3 py-2 text-sm font-normal"
              />
            </label>
            <label className="flex flex-col gap-1 text-xs font-medium text-[#5b5b53]">
              Type
              <select
                value={form.doc_type}
                onChange={(event) =>
                  setForm({
                    ...form,
                    doc_type: event.target.value as (typeof DOC_TYPES)[number],
                  })
                }
                className="rounded-lg border border-[#d8d8cf] px-3 py-2 text-sm font-normal"
              >
                {DOC_TYPES.map((type) => (
                  <option key={type}>{type}</option>
                ))}
              </select>
            </label>
            <label className="flex flex-col gap-1 text-xs font-medium text-[#5b5b53]">
              Language
              <select
                value={form.language}
                onChange={(event) => setForm({ ...form, language: event.target.value })}
                className="rounded-lg border border-[#d8d8cf] px-3 py-2 text-sm font-normal"
              >
                <option value="en">English</option>
                <option value="fr">French</option>
              </select>
            </label>
          </div>
          <label className="flex flex-col gap-1 text-xs font-medium text-[#5b5b53]">
            Document text
            <textarea
              value={form.text}
              onChange={(event) => setForm({ ...form, text: event.target.value })}
              rows={6}
              placeholder={"INVOICE\nSupplier: ...\nInvoice No: ...\nTotal: ..."}
              className="rounded-lg border border-[#d8d8cf] px-3 py-2 font-mono text-xs leading-5"
            />
          </label>
          <button
            type="button"
            onClick={() => void addDocument()}
            disabled={busy || form.text.trim().length < 10}
            className="w-fit rounded-lg bg-[#0f5f56] px-4 py-2 text-sm font-medium text-white disabled:opacity-50"
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
                ? "bg-[#171717] text-white"
                : "border border-[#d8d8cf] bg-white text-[#4b4b45]"
            }`}
          >
            {value === "all" ? "All documents" : "Needs review"}
          </button>
        ))}
      </div>

      <div className="grid gap-4 lg:grid-cols-[1.1fr_1fr]">
        <section className="overflow-hidden rounded-2xl border border-[#e2e2da] bg-white">
          <table className="w-full text-left text-sm">
            <thead className="bg-[#fafaf7] text-[11px] uppercase tracking-wide text-[#8a8a80]">
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
                  className={`cursor-pointer border-t border-[#efefe9] hover:bg-[#fafaf7] ${
                    selected?.id === document.id ? "bg-[#f0f6f4]" : ""
                  }`}
                >
                  <td className="px-4 py-3">
                    <span className="block max-w-[190px] truncate">
                      {document.filename}
                    </span>
                    <span className="text-[11px] text-[#8a8a80]">
                      {document.doc_type} · {(document.confidence * 100).toFixed(0)}%
                    </span>
                  </td>
                  <td className="px-4 py-3 text-[#4b4b45]">{document.supplier ?? "—"}</td>
                  <td className="px-4 py-3 text-right tabular-nums">
                    {document.total !== null
                      ? money(document.total, document.currency)
                      : "—"}
                  </td>
                  <td className="px-4 py-3 text-right">
                    <span
                      className={`rounded-full px-2 py-0.5 text-[10px] font-medium ${
                        document.status === "approved"
                          ? "bg-emerald-50 text-emerald-700"
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
                  <td colSpan={4} className="px-4 py-8 text-center text-sm text-[#8a8a80]">
                    Nothing here yet.
                  </td>
                </tr>
              ) : null}
            </tbody>
          </table>
        </section>

        <section className="rounded-2xl border border-[#e2e2da] bg-white p-4">
          {selected ? (
            <div className="flex flex-col gap-4">
              <div>
                <p className="text-[11px] uppercase tracking-wide text-[#8a8a80]">
                  {selected.doc_type} · {selected.language.toUpperCase()}
                </p>
                <h2 className="text-base font-semibold">{selected.filename}</h2>
              </div>

              <div className="flex flex-col gap-3">
                {selected.fields.map((field) => (
                  <label key={field.key} className="flex flex-col gap-1">
                    <span className="flex items-center justify-between text-[11px] text-[#6b6b63]">
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
                          : "border-[#d8d8cf]"
                      }`}
                    />
                  </label>
                ))}
              </div>

              <div className="flex flex-wrap items-end gap-2 border-t border-[#efefe9] pt-3">
                <label className="flex flex-1 flex-col gap-1 text-[11px] text-[#6b6b63]">
                  Reviewed by
                  <input
                    value={reviewer}
                    onChange={(event) => setReviewer(event.target.value)}
                    className="rounded-lg border border-[#d8d8cf] px-3 py-2 text-sm"
                  />
                </label>
                <button
                  type="button"
                  onClick={() => void saveReview()}
                  disabled={busy}
                  className="rounded-lg bg-[#0f5f56] px-4 py-2 text-sm font-medium text-white disabled:opacity-50"
                >
                  {busy
                    ? "Saving…"
                    : selected.status === "approved"
                      ? "Save changes"
                      : "Approve"}
                </button>
              </div>
              <p className="text-[11px] leading-5 text-[#8a8a80]">
                Low-confidence fields are highlighted. The reviewer is recorded with
                the approval and kept in the export.
              </p>
            </div>
          ) : (
            <div className="flex h-full min-h-[220px] items-center justify-center text-center text-sm text-[#8a8a80]">
              Select a document to review its extracted fields.
            </div>
          )}
        </section>
      </div>
    </div>
  );
}
