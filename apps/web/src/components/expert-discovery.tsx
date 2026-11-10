"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";

import { apiGet, type Expert } from "@/lib/api";

const CATEGORIES = [
  { id: "all", label: "All" },
  { id: "leadership", label: "Leadership" },
  { id: "textile", label: "Textile" },
  { id: "food", label: "Food" },
  { id: "engineering", label: "Engineering" },
  { id: "quality", label: "Quality" },
  { id: "supply_chain", label: "Supply chain" },
  { id: "ai", label: "AI" },
];

export function ExpertDiscovery() {
  const [experts, setExperts] = useState<Expert[]>([]);
  const [query, setQuery] = useState("");
  const [category, setCategory] = useState("all");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let active = true;
    apiGet<Expert[]>("/api/v1/experts")
      .then((data) => {
        if (active) setExperts(data);
      })
      .catch(() => {
        if (active) {
          setError(
            "The API is not reachable. Start it in apps/api with: uvicorn app.main:app --reload",
          );
        }
      })
      .finally(() => {
        if (active) setLoading(false);
      });
    return () => {
      active = false;
    };
  }, []);

  const filtered = useMemo(() => {
    const needle = query.trim().toLowerCase();
    return experts.filter((expert) => {
      const inCategory =
        category === "all" || expert.categories.includes(category);
      if (!inCategory) return false;
      if (!needle) return true;
      return [
        expert.name,
        expert.role,
        expert.organisation,
        expert.headline,
        ...expert.topics,
      ]
        .join(" ")
        .toLowerCase()
        .includes(needle);
    });
  }, [experts, query, category]);

  return (
    <div className="flex w-full flex-col gap-6">
      <div className="rounded-2xl border border-white/12 bg-white/[0.03] p-2 shadow-[0_0_70px_-20px_rgba(255,255,255,0.18)] backdrop-blur">
        <div className="flex items-center gap-3 px-4 py-2">
          <SearchIcon />
          <input
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            placeholder="Describe your situation. Get their perspective."
            className="w-full bg-transparent py-2 text-base text-zinc-100 outline-none placeholder:text-zinc-500"
          />
          {query ? (
            <button
              type="button"
              onClick={() => setQuery("")}
              className="text-xs text-zinc-500 hover:text-zinc-200"
            >
              Clear
            </button>
          ) : (
            <span className="hidden text-xs text-zinc-600 sm:block">
              {experts.length || "—"} minds
            </span>
          )}
        </div>
      </div>

      <div className="flex flex-wrap justify-center gap-2">
        {CATEGORIES.map((item) => (
          <button
            key={item.id}
            type="button"
            onClick={() => setCategory(item.id)}
            className={`rounded-full px-3.5 py-1.5 text-xs font-medium transition ${
              category === item.id
                ? "bg-orange-500 text-white"
                : "bg-white/[0.06] text-zinc-300 hover:bg-white/[0.1]"
            }`}
          >
            {item.label}
          </button>
        ))}
      </div>

      {error ? (
        <p className="rounded-xl border border-red-500/30 bg-red-500/10 px-4 py-3 text-sm text-red-200">
          {error}
        </p>
      ) : null}

      <section className="flex flex-col gap-4">
        <div className="flex items-end justify-between">
          <h2 className="text-lg font-semibold">
            {query ? "Matching minds" : "Ask people who've lived it"}
          </h2>
          <span className="text-xs text-zinc-500">
            {loading ? "Loading…" : `${filtered.length} profiles`}
          </span>
        </div>

        {loading ? (
          <div className="grid gap-3 sm:grid-cols-3">
            {[0, 1, 2].map((index) => (
              <div
                key={index}
                className="h-[190px] animate-pulse rounded-2xl border border-white/10 bg-white/[0.03]"
              />
            ))}
          </div>
        ) : filtered.length === 0 ? (
          <p className="rounded-2xl border border-white/10 bg-white/[0.02] p-6 text-sm text-zinc-400">
            No mind matches that yet. Add a source or widen the sector filter.
          </p>
        ) : (
          <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
            {filtered.map((expert) => (
              <ExpertCard key={expert.id} expert={expert} />
            ))}
          </div>
        )}
      </section>
    </div>
  );
}

function ExpertCard({ expert }: { expert: Expert }) {
  const dark = isDark(expert.accent);
  return (
    <Link
      href={`/experts/${expert.id}`}
      className="group flex min-h-[190px] flex-col justify-between rounded-2xl p-4 transition hover:-translate-y-0.5 hover:shadow-xl"
      style={{ backgroundColor: expert.accent, color: dark ? "#f5f5f5" : "#151515" }}
    >
      <div className="flex items-start justify-between gap-2">
        <span className="grid h-9 w-9 place-items-center rounded-lg bg-black/15 text-sm font-semibold">
          {expert.initials}
        </span>
        <div className="flex flex-wrap justify-end gap-1">
          {expert.mauritian ? (
            <span className="rounded-full bg-black/20 px-2 py-0.5 text-[10px] font-medium">
              Mauritius
            </span>
          ) : null}
          {expert.profile_type === "composite" ? (
            <span className="rounded-full bg-black/20 px-2 py-0.5 text-[10px] font-medium">
              Composite
            </span>
          ) : null}
        </div>
      </div>

      <div className="flex flex-col gap-1.5">
        <h3 className="text-base font-semibold leading-tight">{expert.name}</h3>
        <p className="text-xs opacity-80">
          {expert.role} · {expert.organisation}
        </p>
        <p className="line-clamp-2 text-xs leading-5 opacity-80">
          {expert.headline}
        </p>
      </div>

      <div className="flex items-center justify-between text-[11px] opacity-70">
        <span>{expert.topics[0]}</span>
        <span className="transition group-hover:translate-x-0.5">Ask →</span>
      </div>
    </Link>
  );
}

function isDark(hex: string): boolean {
  const value = hex.replace("#", "");
  if (value.length !== 6) return true;
  const r = parseInt(value.slice(0, 2), 16);
  const g = parseInt(value.slice(2, 4), 16);
  const b = parseInt(value.slice(4, 6), 16);
  return (r * 299 + g * 587 + b * 114) / 1000 < 150;
}

function SearchIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" className="text-zinc-500">
      <circle cx="11" cy="11" r="7" />
      <path d="m20 20-3.5-3.5" />
    </svg>
  );
}
