"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useRef, useState } from "react";

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

function isActive(pathname: string, href: string) {
  return href === "/" ? pathname === "/" : pathname.startsWith(href);
}

/** Scroll state for the bar: whether we left the top, and how far down the page we are. */
function useScroll() {
  const [state, setState] = useState({ scrolled: false, progress: 0 });
  useEffect(() => {
    let frame = 0;
    const update = () => {
      frame = 0;
      const max = document.documentElement.scrollHeight - window.innerHeight;
      setState({
        scrolled: window.scrollY > 12,
        progress: max > 0 ? Math.min(1, window.scrollY / max) : 0,
      });
    };
    const schedule = () => {
      if (!frame) frame = requestAnimationFrame(update);
    };
    schedule();
    window.addEventListener("scroll", schedule, { passive: true });
    window.addEventListener("resize", schedule);
    return () => {
      cancelAnimationFrame(frame);
      window.removeEventListener("scroll", schedule);
      window.removeEventListener("resize", schedule);
    };
  }, []);
  return state;
}

/* ---------- Desktop links with a sliding highlight ---------- */

function NavLinks({ pathname }: { pathname: string }) {
  const { t } = useLanguage();
  const wrap = useRef<HTMLDivElement | null>(null);
  const links = useRef<(HTMLAnchorElement | null)[]>([]);
  const activeIndex = NAV.findIndex((item) => isActive(pathname, item.href));
  const [hover, setHover] = useState<number | null>(null);
  const [box, setBox] = useState<{ left: number; width: number } | null>(null);
  const target = hover ?? activeIndex;

  useEffect(() => {
    const node = wrap.current;
    if (!node) return;
    const measure = () => {
      const link = links.current[target];
      if (!link) {
        setBox(null);
        return;
      }
      setBox({ left: link.offsetLeft, width: link.offsetWidth });
    };
    const frame = requestAnimationFrame(measure);
    const observer = new ResizeObserver(measure);
    observer.observe(node);
    return () => {
      cancelAnimationFrame(frame);
      observer.disconnect();
    };
  }, [target, t]);

  return (
    <div
      ref={wrap}
      className="relative hidden items-center lg:flex"
      onMouseLeave={() => setHover(null)}
    >
      <span
        aria-hidden
        className="absolute inset-y-1 rounded-full bg-white/[0.08] ring-1 ring-white/10 transition-all duration-300 ease-[cubic-bezier(0.22,1,0.36,1)]"
        style={{ left: box?.left ?? 0, width: box?.width ?? 0, opacity: box ? 1 : 0 }}
      />
      <span
        aria-hidden
        className="absolute -bottom-[9px] h-[2px] rounded-full bg-gradient-to-r from-lagoon to-coral shadow-[0_0_12px_rgba(20,184,166,0.8)] transition-all duration-300 ease-[cubic-bezier(0.22,1,0.36,1)]"
        style={{
          left: (box?.left ?? 0) + 14,
          width: Math.max(0, (box?.width ?? 0) - 28),
          opacity: box && hover === null ? 1 : 0,
        }}
      />
      {NAV.map((item, index) => {
        const active = index === activeIndex;
        return (
          <Link
            key={item.href}
            href={item.href}
            ref={(node) => {
              links.current[index] = node;
            }}
            onMouseEnter={() => setHover(index)}
            onFocus={() => setHover(index)}
            onBlur={() => setHover(null)}
            aria-current={active ? "page" : undefined}
            className={`relative z-10 whitespace-nowrap rounded-full px-4 py-2 text-sm transition-colors duration-200 ${
              active ? "font-semibold text-white" : "text-slate-400 hover:text-white"
            }`}
          >
            {t.nav[item.key]}
          </Link>
        );
      })}
    </div>
  );
}

/* ---------- Language dropdown ---------- */

function LanguageMenu() {
  const { locale, setLocale, t } = useLanguage();
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement | null>(null);
  const current = LOCALES.find((item) => item.id === locale) ?? LOCALES[0];

  useEffect(() => {
    if (!open) return;
    const onPointer = (event: PointerEvent) => {
      if (!ref.current?.contains(event.target as Node)) setOpen(false);
    };
    const onKey = (event: KeyboardEvent) => {
      if (event.key === "Escape") setOpen(false);
    };
    document.addEventListener("pointerdown", onPointer);
    document.addEventListener("keydown", onKey);
    return () => {
      document.removeEventListener("pointerdown", onPointer);
      document.removeEventListener("keydown", onKey);
    };
  }, [open]);

  return (
    <div ref={ref} className="relative">
      <button
        type="button"
        onClick={() => setOpen((value) => !value)}
        aria-haspopup="menu"
        aria-expanded={open}
        aria-label={t.shell.language}
        className="flex h-9 items-center gap-1.5 rounded-full border border-white/10 bg-white/5 px-3 text-xs font-semibold text-slate-200 backdrop-blur transition hover:border-white/25 hover:text-white"
      >
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" aria-hidden>
          <circle cx="12" cy="12" r="9" />
          <path d="M3 12h18M12 3c2.5 2.6 3.8 5.6 3.8 9s-1.3 6.4-3.8 9c-2.5-2.6-3.8-5.6-3.8-9S9.5 5.6 12 3Z" />
        </svg>
        {current.label}
        <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.6" strokeLinecap="round" strokeLinejoin="round" className={`transition-transform duration-200 ${open ? "rotate-180" : ""}`} aria-hidden>
          <path d="m6 9 6 6 6-6" />
        </svg>
      </button>
      <div
        role="menu"
        className={`absolute right-0 top-[calc(100%+8px)] w-40 origin-top-right rounded-2xl border border-white/10 bg-night/95 p-1.5 shadow-[0_20px_50px_-15px_rgba(0,0,0,0.7)] backdrop-blur-xl transition-all duration-200 ${
          open ? "visible scale-100 opacity-100" : "invisible scale-95 opacity-0"
        }`}
      >
        {LOCALES.map((item) => {
          const selected = item.id === locale;
          return (
            <button
              key={item.id}
              type="button"
              role="menuitemradio"
              aria-checked={selected}
              onClick={() => {
                setLocale(item.id);
                setOpen(false);
              }}
              className={`flex w-full items-center justify-between rounded-xl px-3 py-2 text-left text-sm transition ${
                selected ? "bg-lagoon/15 font-semibold text-lagoon-soft" : "text-slate-300 hover:bg-white/5 hover:text-white"
              }`}
            >
              {item.id === "en" ? "English" : item.id === "fr" ? "Français" : "Kreol Morisien"}
              {selected ? <span aria-hidden>✓</span> : null}
            </button>
          );
        })}
      </div>
    </div>
  );
}

/* ---------- Mobile sheet ---------- */

function MobileMenu({ pathname, open, onClose }: { pathname: string; open: boolean; onClose: () => void }) {
  const { locale, setLocale, t } = useLanguage();
  return (
    <div
      className={`overflow-hidden transition-[max-height,opacity] duration-300 ease-out lg:hidden ${
        open ? "max-h-[520px] opacity-100" : "pointer-events-none max-h-0 opacity-0"
      }`}
      aria-hidden={!open}
    >
      <div className="mx-auto max-w-6xl px-4 pb-5 pt-2">
        <div className="flex flex-col gap-1 rounded-2xl border border-white/10 bg-white/[0.04] p-2">
          {NAV.map((item, index) => {
            const active = isActive(pathname, item.href);
            return (
              <Link
                key={item.href}
                href={item.href}
                onClick={onClose}
                tabIndex={open ? undefined : -1}
                className={`flex items-center justify-between rounded-xl px-4 py-3 text-base transition-all duration-300 ${
                  active ? "bg-white/10 font-semibold text-white" : "text-slate-300 hover:bg-white/5"
                }`}
                style={{ transitionDelay: open ? `${index * 40}ms` : "0ms", transform: open ? "none" : "translateY(-6px)" }}
              >
                {t.nav[item.key]}
                {active ? <span className="h-1.5 w-1.5 rounded-full bg-lagoon shadow-[0_0_8px_#14b8a6]" /> : null}
              </Link>
            );
          })}
        </div>
        <div className="mt-3 flex items-center gap-2">
          <div className="flex flex-1 items-center gap-1 rounded-full border border-white/10 bg-white/5 p-1 text-xs font-semibold">
            {LOCALES.map((item) => (
              <button
                key={item.id}
                type="button"
                tabIndex={open ? undefined : -1}
                onClick={() => setLocale(item.id)}
                aria-pressed={locale === item.id}
                className={`flex-1 rounded-full py-1.5 transition ${
                  locale === item.id ? "bg-lagoon text-night" : "text-slate-300"
                }`}
              >
                {item.label}
              </button>
            ))}
          </div>
          <ThemeToggle />
        </div>
      </div>
    </div>
  );
}

/* ---------- The bar ---------- */

export function SiteNav() {
  const pathname = usePathname();
  const { scrolled, progress } = useScroll();
  // The menu belongs to the page it was opened on, so navigating closes it.
  const [menuFor, setMenuFor] = useState<string | null>(null);
  const menuOpen = menuFor === pathname;
  const solid = scrolled || menuOpen;

  return (
    <header className="fixed inset-x-0 top-0 z-50 px-0 transition-all duration-300 lg:px-4">
      <div
        className={`relative mx-auto transition-all duration-300 ease-out ${
          solid
            ? "border-b border-white/10 bg-night/85 shadow-[0_18px_40px_-20px_rgba(0,0,0,0.7)] backdrop-blur-xl lg:mt-3 lg:max-w-6xl lg:rounded-2xl lg:border"
            : "border-b border-transparent bg-transparent lg:mt-0 lg:max-w-7xl"
        }`}
      >
        <nav className="mx-auto flex h-16 max-w-6xl items-center gap-4 px-4 md:px-6" aria-label="Main">
          <Link href="/" aria-label="Lekont home" className="flex shrink-0 items-center">
            <Image src="/brand/lekont-icon.svg" alt="" width={32} height={32} unoptimized priority className="h-8 w-8 sm:hidden" />
            <Image src="/brand/lekont-logo-white.svg" alt="" width={534} height={146} unoptimized priority className="hidden h-8 w-auto sm:block" />
          </Link>

          <div className="flex flex-1 justify-center">
            <NavLinks pathname={pathname} />
          </div>

          <div className="hidden items-center gap-2 lg:flex">
            <LanguageMenu />
            <ThemeToggle />
          </div>

          <button
            type="button"
            onClick={() => setMenuFor(menuOpen ? null : pathname)}
            aria-expanded={menuOpen}
            aria-label={menuOpen ? "Close menu" : "Open menu"}
            className="grid h-10 w-10 place-items-center rounded-full border border-white/10 bg-white/5 text-white transition hover:bg-white/10 lg:hidden"
          >
            <span className="relative block h-3 w-4" aria-hidden>
              <span className={`absolute left-0 h-0.5 w-4 rounded bg-current transition-all duration-300 ${menuOpen ? "top-[5px] rotate-45" : "top-0"}`} />
              <span className={`absolute left-0 top-[5px] h-0.5 w-4 rounded bg-current transition-opacity duration-200 ${menuOpen ? "opacity-0" : ""}`} />
              <span className={`absolute left-0 h-0.5 w-4 rounded bg-current transition-all duration-300 ${menuOpen ? "top-[5px] -rotate-45" : "top-[10px]"}`} />
            </span>
          </button>
        </nav>

        <MobileMenu pathname={pathname} open={menuOpen} onClose={() => setMenuFor(null)} />

        {/* Reading progress */}
        <span
          aria-hidden
          className="absolute inset-x-0 bottom-0 h-px origin-left bg-gradient-to-r from-lagoon via-lagoon-soft to-coral transition-opacity duration-300 lg:inset-x-4"
          style={{ transform: `scaleX(${progress})`, opacity: scrolled ? 1 : 0 }}
        />
      </div>
    </header>
  );
}
