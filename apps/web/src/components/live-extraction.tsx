"use client";

import { useEffect, useState } from "react";
import type { CSSProperties } from "react";

/**
 * Hero signature animation: a synthetic document is scanned, its fields light up
 * with confidence scores, then land as a new row in the ledger sheet. Loops
 * through English and French documents. All data is invented.
 */

type Field = { key: "party" | "vat" | "total"; text: string; confidence: number };
type DemoDoc = {
  heading: string;
  number: string;
  lines: string[];
  fields: Field[];
  sheet: { doc: string; party: string; vat: string; total: string };
};

const DOCS: DemoDoc[] = [
  {
    heading: "INVOICE",
    number: "INV-2026-0412 · 04 Nov 2026",
    lines: ["Corrugated boxes 40x30 ×300", "Packing tape 48mm ×24"],
    fields: [
      { key: "party", text: "Island Packaging Ltd", confidence: 0.98 },
      { key: "vat", text: "VAT 15%  MUR 630", confidence: 0.96 },
      { key: "total", text: "Total  MUR 4,830", confidence: 0.97 },
    ],
    sheet: { doc: "Invoice · EN", party: "Island Packaging", vat: "630", total: "4,830" },
  },
  {
    heading: "FACTURE",
    number: "F-2026-118 · 06 nov. 2026",
    lines: ["Lait UHT 1L ×240", "Yaourt nature 125g ×600"],
    fields: [
      { key: "party", text: "Laiterie du Nord Ltée", confidence: 0.95 },
      { key: "vat", text: "TVA 15%  MUR 1 245", confidence: 0.82 },
      { key: "total", text: "Total TTC  MUR 9 545", confidence: 0.94 },
    ],
    sheet: { doc: "Facture · FR", party: "Laiterie du Nord", vat: "1,245", total: "9,545" },
  },
  {
    heading: "BULLETIN DE PAIE",
    number: "Octobre 2026 · Employé E-014",
    lines: ["Salaire de base", "CSG salarié 3%"],
    fields: [
      { key: "party", text: "Employeur : Atelier Bois Ltée", confidence: 0.97 },
      { key: "vat", text: "Sans TVA", confidence: 0.99 },
      { key: "total", text: "Net à payer  MUR 23 400", confidence: 0.96 },
    ],
    sheet: { doc: "Payslip · FR", party: "Atelier Bois", vat: "—", total: "23,400" },
  },
];

// Timeline in ms from the moment a document lands.
const FIELD_AT = [900, 1350, 1800];
const ROW_AT = 2400;
const CELL_STEP = 220;
const NEXT_AT = 5600;

type Row = DemoDoc["sheet"] & { id: number; review: boolean };

export type LiveExtractionLabels = {
  sheet: string;
  document: string;
  party: string;
  vat: string;
  total: string;
  reading: string;
  extracted: string;
  review: string;
};

export function LiveExtraction({ labels }: { labels: LiveExtractionLabels }) {
  const [cycle, setCycle] = useState(0);
  const [elapsed, setElapsed] = useState(0);
  const [rows, setRows] = useState<Row[]>([]);
  const [still, setStill] = useState(false);

  const doc = DOCS[cycle % DOCS.length];

  useEffect(() => {
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const frame = requestAnimationFrame(() => {
      if (reduce) {
        setStill(true);
        setElapsed(NEXT_AT);
        setRows(
          DOCS.map((item, index) => ({
            ...item.sheet,
            id: index,
            review: item.fields.some((field) => field.confidence < 0.9),
          })),
        );
      }
    });
    return () => cancelAnimationFrame(frame);
  }, []);

  useEffect(() => {
    if (still) return;
    const marks = [...FIELD_AT, ROW_AT, ROW_AT + CELL_STEP * 4, NEXT_AT];
    const timers = marks.map((mark) =>
      setTimeout(() => {
        setElapsed(mark);
        if (mark === ROW_AT) {
          setRows((current) =>
            current.some((row) => row.id === cycle) ? current : [
              {
                ...doc.sheet,
                id: cycle,
                review: doc.fields.some((field) => field.confidence < 0.9),
              },
              ...current,
            ].slice(0, 3),
          );
        }
        if (mark === NEXT_AT) {
          setElapsed(0);
          setCycle((value) => value + 1);
        }
      }, mark),
    );
    return () => timers.forEach(clearTimeout);
  }, [cycle, doc, still]);

  const shown = (index: number) => elapsed >= FIELD_AT[index];
  const landed = elapsed >= ROW_AT;

  return (
    <div className="relative grid gap-4 text-left sm:grid-cols-[1fr_auto_1.1fr] sm:items-center">
      {/* Document */}
      <div
        key={`doc-${cycle}`}
        className="doc-enter light-scope relative overflow-hidden rounded-2xl bg-card p-4 text-ink shadow-[0_30px_80px_-30px_rgba(0,0,0,0.7)]"
      >
        {!still && !landed ? <span key={`scan-${cycle}`} className="scan-line" aria-hidden /> : null}
        <div className="flex items-start justify-between gap-2">
          <div>
            <p className="text-[11px] font-bold tracking-[0.18em] text-ink">{doc.heading}</p>
            <p className="mt-0.5 text-[10px] text-muted">{doc.number}</p>
          </div>
          <span className="rounded bg-surface px-1.5 py-0.5 font-mono text-[9px] text-muted">PDF</span>
        </div>
        <div className="mt-3 flex flex-col gap-1.5">
          {doc.fields.map((field, index) => (
            <div key={field.key} className={index === 0 ? "order-first" : "order-last"}>
              <span
                className={`relative inline-flex max-w-full items-center gap-2 rounded-md px-1.5 py-0.5 text-[11px] transition-all duration-500 ${
                  shown(index)
                    ? field.confidence < 0.9
                      ? "bg-sun-soft ring-1 ring-sun"
                      : "bg-lagoon-wash ring-1 ring-lagoon"
                    : "ring-1 ring-transparent"
                } ${field.key === "total" ? "font-semibold" : ""}`}
              >
                <span className="truncate">{field.text}</span>
                <span
                  className={`shrink-0 rounded-full px-1.5 font-mono text-[9px] font-semibold text-white transition-all duration-300 ${
                    shown(index) ? "scale-100 opacity-100" : "scale-0 opacity-0"
                  } ${field.confidence < 0.9 ? "bg-sun" : "bg-lagoon-deep"}`}
                >
                  {Math.round(field.confidence * 100)}%
                </span>
              </span>
            </div>
          ))}
          <div className="order-2 my-1 flex flex-col gap-1 border-y border-dashed border-line py-2">
            {doc.lines.map((line) => (
              <span key={line} className="flex justify-between gap-2 text-[10px] text-muted">
                <span className="truncate">{line}</span>
                <span className="h-1.5 w-10 shrink-0 self-center rounded bg-line" />
              </span>
            ))}
          </div>
        </div>
        <p className="mt-3 flex items-center gap-1.5 text-[10px] text-muted">
          <span
            className={`h-1.5 w-1.5 rounded-full ${
              !landed
                ? "animate-pulse-soft bg-coral"
                : doc.fields.some((field) => field.confidence < 0.9)
                  ? "bg-sun"
                  : "bg-lagoon"
            }`}
          />
          {landed
            ? doc.fields.some((field) => field.confidence < 0.9)
              ? labels.review
              : labels.extracted
            : labels.reading}
        </p>
      </div>

      {/* Connector */}
      <svg viewBox="0 0 60 24" className="mx-auto hidden h-6 w-14 sm:block" aria-hidden>
        <path d="M2 12 H50" stroke="#5eead4" strokeWidth="1.5" className="dash-march" fill="none" />
        <path d="M46 6 L54 12 L46 18" stroke="#5eead4" strokeWidth="1.5" fill="none" strokeLinecap="round" />
      </svg>

      {/* Ledger sheet */}
      <div className="overflow-hidden rounded-2xl border border-white/10 bg-ink-2/80 backdrop-blur">
        <div className="flex items-center justify-between border-b border-white/10 px-3 py-2">
          <span className="text-[11px] font-medium text-slate-300">{labels.sheet}</span>
          <span className="font-mono text-[10px] text-slate-500">ledger.xlsx</span>
        </div>
        <table className="w-full table-fixed text-[11px]">
          <thead className="text-[9px] uppercase tracking-wider text-slate-500">
            <tr>
              <th className="w-[30%] px-3 py-1.5 text-left font-medium">{labels.document}</th>
              <th className="w-[30%] px-2 py-1.5 text-left font-medium">{labels.party}</th>
              <th className="px-2 py-1.5 text-right font-medium">{labels.vat}</th>
              <th className="px-3 py-1.5 text-right font-medium">{labels.total}</th>
            </tr>
          </thead>
          <tbody>
            {rows.map((row, rowIndex) => (
              <tr key={row.id} className={`border-t border-white/5 ${rowIndex === 0 && !still ? "row-land" : ""}`}>
                {[row.doc, row.party, row.vat, row.total].map((cell, cellIndex) => (
                  <td
                    key={cellIndex}
                    className={`truncate py-2 text-slate-200 ${cellIndex === 0 ? "px-3" : "px-2"} ${
                      cellIndex >= 2 ? "text-right tabular-nums" : ""
                    } ${cellIndex === 3 ? "pr-3 font-semibold text-white" : ""} ${
                      rowIndex === 0 && !still ? "cell-fill" : ""
                    }`}
                    style={{ "--d": `${cellIndex * CELL_STEP}ms` } as CSSProperties}
                  >
                    {cell}
                  </td>
                ))}
              </tr>
            ))}
            {rows.length === 0
              ? [0, 1, 2].map((row) => (
                  <tr key={row} className="border-t border-white/5">
                    <td colSpan={4} className="px-3 py-2">
                      <span className="block h-2 w-full rounded bg-white/5" />
                    </td>
                  </tr>
                ))
              : null}
          </tbody>
        </table>
        <div className="flex flex-wrap gap-2 border-t border-white/10 px-3 py-2">
          {rows.slice(0, 3).map((row) => (
            <span
              key={row.id}
              className={`rounded-full px-2 py-0.5 text-[9px] font-medium ${
                row.review ? "bg-sun/15 text-sun" : "bg-lagoon/15 text-lagoon-soft"
              }`}
            >
              {row.party} · {row.review ? labels.review : labels.extracted}
            </span>
          ))}
        </div>
      </div>
    </div>
  );
}
