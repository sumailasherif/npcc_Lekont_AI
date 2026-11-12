"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import type { ReactNode } from "react";

import { useLanguage } from "@/components/language-provider";
import { LOCALES } from "@/lib/i18n";

const NAV = [
  { href: "/", key: "overview", icon: "M4 13h6V4H4v9Zm0 7h6v-4H4v4Zm10 0h6V11h-6v9Zm0-16v4h6V4h-6Z" },
  { href: "/documents", key: "documents", icon: "M6 3h9l4 4v14H6V3Zm8 1v4h4" },
  { href: "/ask", key: "ask", icon: "M4 5h16v11H9l-5 4V5Z" },
  { href: "/readiness", key: "readiness", icon: "M4 19V9m5 10V5m5 14v-7m5 7V7" },
] as const;

export function AppShell({ children }: { children: ReactNode }) {
  const pathname = usePathname();
  const { locale, setLocale, t } = useLanguage();

  return (
    <div className="min-h-screen">
      <header className="sticky top-0 z-30 border-b border-[#e6e8f0] bg-white/80 backdrop-blur-xl">
        <div className="mx-auto flex h-16 w-full max-w-7xl items-center gap-4 px-4 md:px-6">
          <Link href="/" className="flex items-center gap-2">
            <span className="grid h-9 w-9 place-items-center rounded-xl bg-gradient-to-br from-[#4f46e5] to-[#7c3aed] text-sm font-bold text-white shadow-lg shadow-indigo-500/25">
              L
            </span>
            <span className="leading-tight">
              <span className="block text-sm font-semibold tracking-tight">Lekont</span>
              <span className="block text-[10px] text-[#64748b]">{t.shell.tagline}</span>
            </span>
          </Link>

          <span className="hidden rounded-full bg-[#eef2ff] px-2.5 py-1 text-[10px] font-medium text-[#4f46e5] sm:block">
            {t.shell.demoWorkspace}
          </span>

          <div className="ml-auto hidden w-72 items-center gap-2 rounded-xl border border-[#e6e8f0] bg-[#f9fafb] px-3 py-2 text-xs text-[#64748b] lg:flex">
            <SearchIcon />
            <span className="flex-1">{t.shell.searchPlaceholder}</span>
            <kbd className="rounded border border-[#e6e8f0] bg-white px-1.5 py-0.5 text-[10px]">
              ⌘K
            </kbd>
          </div>

          <div className="flex items-center gap-1 rounded-xl border border-[#e6e8f0] bg-white p-1 text-[11px] font-medium">
            {LOCALES.map((item) => (
              <button
                key={item.id}
                type="button"
                onClick={() => setLocale(item.id)}
                aria-pressed={locale === item.id}
                className={`rounded-lg px-2 py-1 transition ${
                  locale === item.id
                    ? "bg-[#0f172a] text-white"
                    : "text-[#64748b] hover:bg-[#f1f5f9]"
                }`}
              >
                {item.label}
              </button>
            ))}
          </div>

          <Link
            href="/ask"
            className="hidden rounded-xl bg-[#0f172a] px-3.5 py-2 text-xs font-medium text-white transition hover:bg-[#1e293b] sm:block"
          >
            {t.shell.askAi}
          </Link>
          <span className="grid h-9 w-9 place-items-center rounded-full bg-gradient-to-br from-[#0d9488] to-[#059669] text-xs font-semibold text-white">
            SS
          </span>
        </div>
      </header>

      <div className="mx-auto flex w-full max-w-7xl gap-6 px-4 py-6 md:px-6 md:py-8">
        <aside className="hidden w-56 shrink-0 flex-col justify-between md:flex">
          <nav className="flex flex-col gap-1">
            <p className="mb-2 px-3 text-[10px] font-semibold uppercase tracking-[0.16em] text-[#94a3b8]">
              {t.shell.workspace}
            </p>
            {NAV.map((item, index) => {
              const active =
                item.href === "/" ? pathname === "/" : pathname.startsWith(item.href);
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  style={{ animationDelay: `${index * 45}ms` }}
                  className={`animate-fade-up group flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm transition-all duration-200 ${
                    active
                      ? "bg-gradient-to-r from-[#4f46e5] to-[#6366f1] text-white shadow-lg shadow-indigo-500/20"
                      : "text-[#475569] hover:translate-x-0.5 hover:bg-white hover:text-[#0f172a]"
                  }`}
                >
                  <svg
                    width="16"
                    height="16"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="1.7"
                    className={active ? "" : "text-[#94a3b8] group-hover:text-[#4f46e5]"}
                  >
                    <path d={item.icon} />
                  </svg>
                  {t.nav[item.key]}
                </Link>
              );
            })}

            <div className="mt-6 rounded-2xl border border-[#e6e8f0] bg-white p-3">
              <p className="text-[10px] font-semibold uppercase tracking-wide text-[#94a3b8]">
                {t.shell.dataSources}
              </p>
              <div className="mt-2 flex flex-col gap-1.5 text-[11px] text-[#475569]">
                <span className="flex items-center justify-between">
                  Supabase Postgres
                  <span className="h-1.5 w-1.5 rounded-full bg-emerald-500 animate-pulse-soft" />
                </span>
                <span className="flex items-center justify-between text-[#94a3b8]">
                  {t.shell.seedRows}
                  <span className="tabular-nums">100</span>
                </span>
                <span className="flex items-center justify-between text-[#94a3b8]">
                  {t.shell.documents}
                  <span className="tabular-nums">6</span>
                </span>
              </div>
            </div>
          </nav>

          <div className="mt-6 rounded-2xl bg-[#0f172a] p-4 text-white">
            <p className="text-xs font-medium">{t.shell.syntheticDemo}</p>
            <p className="mt-1 text-[11px] leading-5 text-white/60">{t.shell.syntheticNote}</p>
          </div>
        </aside>

        <main className="min-w-0 flex-1 pb-16">{children}</main>
      </div>
    </div>
  );
}

function SearchIcon() {
  return (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
      <circle cx="11" cy="11" r="7" />
      <path d="m20 20-3.5-3.5" />
    </svg>
  );
}
