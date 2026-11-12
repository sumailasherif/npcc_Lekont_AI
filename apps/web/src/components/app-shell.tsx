"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import type { ReactNode } from "react";

import { useLanguage } from "@/components/language-provider";
import { ThemeToggle } from "@/components/theme-toggle";
import { LOCALES } from "@/lib/i18n";

const NAV = [
  { href: "/", key: "overview" },
  { href: "/documents", key: "documents" },
  { href: "/ask", key: "ask" },
  { href: "/readiness", key: "readiness" },
  { href: "/whatsapp", key: "whatsapp" },
] as const;

export function AppShell({ children }: { children: ReactNode }) {
  const pathname = usePathname();
  const { locale, setLocale, t } = useLanguage();
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 12);
    const frame = requestAnimationFrame(onScroll);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => {
      cancelAnimationFrame(frame);
      window.removeEventListener("scroll", onScroll);
    };
  }, []);

  return (
    <div className="flex min-h-screen flex-col bg-surface text-ink">
      <header
        className={`fixed inset-x-0 top-0 z-50 transition-all duration-300 ${
          scrolled
            ? "border-b border-white/10 bg-night/80 shadow-[0_8px_30px_-12px_rgba(0,0,0,0.5)] backdrop-blur-xl"
            : "border-b border-transparent bg-transparent"
        }`}
      >
        <nav className="mx-auto flex h-16 max-w-6xl items-center gap-3 px-4 md:px-6">
          <Link href="/" aria-label="Lekont" className="flex shrink-0 items-center">
            <Image
              src="/brand/lekont-icon.svg"
              alt=""
              width={32}
              height={32}
              unoptimized
              priority
              className="h-8 w-8 sm:hidden"
            />
            <Image
              src="/brand/lekont-logo-white.svg"
              alt=""
              width={534}
              height={146}
              unoptimized
              priority
              className="hidden h-8 w-auto sm:block"
            />
          </Link>

          <div className="mx-auto flex min-w-0 items-center gap-1 overflow-x-auto rounded-full border border-white/10 bg-white/5 p-1 backdrop-blur">
            {NAV.map((item) => {
              const active =
                item.href === "/" ? pathname === "/" : pathname.startsWith(item.href);
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={`whitespace-nowrap rounded-full px-3 py-1.5 text-xs transition md:px-4 md:text-sm ${
                    active
                      ? "bg-white font-medium text-night shadow"
                      : "text-slate-300 hover:bg-white/10 hover:text-white"
                  }`}
                >
                  {t.nav[item.key]}
                </Link>
              );
            })}
          </div>

          <ThemeToggle />

          <div
            role="group"
            aria-label={t.shell.language}
            className="flex shrink-0 items-center gap-0.5 rounded-full border border-white/10 bg-white/5 p-1 text-[11px] font-medium backdrop-blur"
          >
            {LOCALES.map((item) => (
              <button
                key={item.id}
                type="button"
                onClick={() => setLocale(item.id)}
                aria-pressed={locale === item.id}
                className={`rounded-full px-2 py-1 transition ${
                  locale === item.id
                    ? "bg-lagoon text-night"
                    : "text-slate-300 hover:bg-white/10 hover:text-white"
                }`}
              >
                {item.label}
              </button>
            ))}
          </div>

          <Link
            href="/whatsapp"
            className="hidden shrink-0 rounded-full bg-coral px-4 py-1.5 text-sm font-semibold text-white transition hover:-translate-y-0.5 hover:bg-[#ff8466] lg:inline-flex"
          >
            {t.hero.tryLive}
          </Link>
        </nav>
      </header>

      <main className="min-w-0 flex-1">{children}</main>

      <footer className="border-t border-line bg-card">
        <div className="mx-auto flex max-w-6xl flex-col gap-4 px-4 py-8 text-sm text-muted md:flex-row md:items-center md:justify-between md:px-6">
          <div className="flex flex-col gap-2">
            <Image
              src="/brand/lekont-logo.svg"
              alt="Lekont"
              width={534}
              height={146}
              unoptimized
              className="show-light h-7 w-auto self-start"
            />
            <Image
              src="/brand/lekont-logo-white.svg"
              alt=""
              width={534}
              height={146}
              unoptimized
              className="show-dark h-7 w-auto self-start"
            />
            <span className="text-xs text-muted">{t.shell.tagline}</span>
            <span className="mt-2 font-medium text-ink">{t.shell.syntheticDemo}</span>
            <span className="text-xs">{t.shell.syntheticNote}</span>
          </div>
          <div className="flex flex-wrap items-center gap-4 text-xs">
            <span className="flex items-center gap-2">
              <span className="animate-pulse-soft h-2 w-2 rounded-full bg-lagoon" />
              {t.shell.dataSources}: Supabase Postgres
            </span>
            <span>
              {t.shell.seedRows} <span className="tabular-nums text-ink">100</span>
            </span>
          </div>
        </div>
      </footer>
    </div>
  );
}
