"use client";

import Image from "next/image";
import Link from "next/link";

import { useLanguage } from "@/components/language-provider";
import { HeroBackdrop } from "@/components/motion";
import { BOOKING_HREF, HAS_BOOKING } from "@/lib/site";

export function SiteFooter() {
  const { t } = useLanguage();
  const f = t.site.footer;
  const year = new Date().getFullYear();
  const external = HAS_BOOKING ? { target: "_blank", rel: "noopener noreferrer" } : {};

  const product = [
    { href: "/", label: t.nav.overview },
    { href: "/documents", label: t.nav.documents },
    { href: "/ask", label: t.nav.ask },
    { href: "/readiness", label: t.nav.readiness },
    { href: "/whatsapp", label: t.nav.whatsapp },
  ];

  return (
    <footer className="relative isolate overflow-hidden bg-night text-slate-300">
      <HeroBackdrop />

      {/* Call band */}
      <div className="relative mx-auto max-w-6xl px-4 pt-16 md:px-6">
        <div className="flex flex-col items-start justify-between gap-6 rounded-3xl border border-white/10 bg-white/[0.04] p-6 backdrop-blur md:flex-row md:items-center md:p-8">
          <div>
            <p className="text-balance text-2xl font-semibold tracking-tight text-white md:text-3xl">{f.ctaTitle}</p>
            <p className="mt-2 max-w-xl text-sm text-slate-400 md:text-base">{f.ctaSub}</p>
          </div>
          <div className="flex shrink-0 flex-wrap gap-3">
            {HAS_BOOKING ? (
              <a
                href={BOOKING_HREF}
                {...external}
                className="inline-flex items-center gap-2 rounded-xl bg-coral px-5 py-2.5 text-sm font-semibold text-white shadow-[0_12px_30px_-10px_rgba(255,107,74,0.8)] transition hover:-translate-y-0.5 hover:bg-[#ff8466]"
              >
                <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
                  <path d="M7 3v3m10-3v3M4 8h16M5 5h14v15H5V5Zm4 8h2m2 0h2m-6 3h2" />
                </svg>
                {f.bookCall}
              </a>
            ) : null}
            <Link
              href="/try"
              className="inline-flex items-center gap-2 rounded-xl border border-white/20 bg-white/5 px-5 py-2.5 text-sm font-semibold text-white transition hover:-translate-y-0.5 hover:bg-white/10"
            >
              {f.tryWhatsApp}
            </Link>
          </div>
        </div>
      </div>

      {/* Columns */}
      <div className="relative mx-auto grid max-w-6xl gap-10 px-4 py-14 md:grid-cols-[1.4fr_1fr_1fr] md:px-6">
        <div>
          <Image src="/brand/lekont-logo-white.svg" alt="Lekont" width={534} height={146} unoptimized className="h-8 w-auto" />
          <p className="mt-4 max-w-xs text-sm leading-6 text-slate-400">{t.overview.subtitle}</p>
          <p className="mt-4 inline-flex items-center gap-2 text-xs text-slate-500">
            <span className="animate-pulse-soft h-2 w-2 rounded-full bg-lagoon" />
            {f.madeFor}
          </p>
        </div>
        <nav aria-label={f.product}>
          <p className="text-xs font-semibold uppercase tracking-[0.18em] text-white">{f.product}</p>
          <ul className="mt-4 flex flex-col gap-2.5 text-sm">
            {product.map((item) => (
              <li key={item.href}>
                <Link href={item.href} className="transition hover:text-lagoon-soft">
                  {item.label}
                </Link>
              </li>
            ))}
          </ul>
        </nav>
        <nav aria-label={f.company}>
          <p className="text-xs font-semibold uppercase tracking-[0.18em] text-white">{f.company}</p>
          <ul className="mt-4 flex flex-col gap-2.5 text-sm">
            <li>
              <Link href="/#faq" className="transition hover:text-lagoon-soft">
                {f.faq}
              </Link>
            </li>
            {HAS_BOOKING ? (
              <li>
                <a href={BOOKING_HREF} {...external} className="transition hover:text-lagoon-soft">
                  {f.bookCall}
                </a>
              </li>
            ) : null}
            <li>
              <Link href="/try" className="transition hover:text-lagoon-soft">
                {f.tryWhatsApp}
              </Link>
            </li>
          </ul>
        </nav>
      </div>

      {/* Bottom bar */}
      <div className="relative border-t border-white/10">
        <div className="mx-auto flex max-w-6xl flex-col gap-2 px-4 py-6 text-xs text-slate-500 md:flex-row md:items-center md:justify-between md:px-6">
          <p>
            © {year} Lekont. {f.rights}
          </p>
          <p>
            {t.shell.syntheticDemo} · {t.shell.syntheticNote}
          </p>
        </div>
      </div>
    </footer>
  );
}
