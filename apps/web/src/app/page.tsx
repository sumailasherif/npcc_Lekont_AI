"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import type { CSSProperties, ReactNode } from "react";

import { useLanguage } from "@/components/language-provider";
import {
  CountUp,
  HeroBackdrop,
  Marquee,
  PageHero,
  Reveal,
  Sparkle,
  buttonGhost,
  buttonPrimary,
  card,
  useTypewriter,
} from "@/components/motion";
import { LiveExtraction } from "@/components/live-extraction";
import { ProductStack } from "@/components/product-stack";
import { SpendChart } from "@/components/spend-chart";
import { TiltCard } from "@/components/tilt-card";
import { WhatsAppTeaser } from "@/components/whatsapp-teaser";
import { AccountantShowcase, BuiltFor } from "@/components/photo-sections";
import { ProblemSection, WhyLekontWins } from "@/components/problem-wins";
import { DealtDeck, OrbitTools, PhotoGallery, PinnedStory, StoryStats } from "@/components/scroll-stories";
import {
  apiGet,
  apiPost,
  money,
  type AskResponse,
  type DashboardSummary,
  type DocumentSummary,
} from "@/lib/api";
import type { Messages } from "@/lib/i18n";

const VOCAB = [
  "Facture",
  "Invoice",
  "Bulletin de paie",
  "Payslip",
  "Contrat",
  "Contract",
  "TVA 15%",
  "VAT",
  "Bon de commande",
  "Purchase order",
  "Relevé bancaire",
  "Bank statement",
  "Note de crédit",
  "Credit note",
];

export default function OverviewPage() {
  const { locale, t } = useLanguage();
  const [summary, setSummary] = useState<DashboardSummary | null>(null);
  const [documents, setDocuments] = useState<DocumentSummary[] | null>(null);
  const [question, setQuestion] = useState("");
  const [answer, setAnswer] = useState<AskResponse | null>(null);
  const [asking, setAsking] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [focused, setFocused] = useState(false);

  const typed = useTypewriter(t.ask.suggestions, !focused && question === "");

  useEffect(() => {
    Promise.all([
      apiGet<DashboardSummary>("/api/v1/dashboard/summary"),
      apiGet<DocumentSummary[]>("/api/v1/documents"),
    ])
      .then(([dashboard, docs]) => {
        setSummary(dashboard);
        setDocuments(docs);
      })
      .catch(() => setError(t.overview.errorApi));
  }, [t.overview.errorApi]);

  async function ask(text: string) {
    if (!text.trim() || asking) return;
    setAsking(true);
    setError(null);
    try {
      setAnswer(
        await apiPost<AskResponse>("/api/v1/insights/ask", {
          question: text,
          language: locale,
        }),
      );
    } catch {
      setError(t.overview.errorAsk);
    } finally {
      setAsking(false);
    }
  }

  const currency = summary?.currency ?? "MUR";

  return (
    <>
      <PageHero
        eyebrow={t.hero.overviewEyebrow}
        title={t.hero.overviewLead}
        highlight={t.hero.overviewHighlight}
        description={t.overview.subtitle}
        aside={<LiveExtraction key={locale} labels={t.hero.demo} />}
        actions={
          <>
            <Link href="/documents" className={buttonPrimary}>
              {t.hero.reviewDocuments}
              <Arrow />
            </Link>
            <Link href="/readiness" className={buttonGhost}>
              {t.overview.runReadiness}
            </Link>
          </>
        }
      >
        <div className="mx-auto max-w-2xl lg:mx-0">
          <form
            onSubmit={(event) => {
              event.preventDefault();
              void ask(question);
            }}
            className="relative flex items-center gap-2 rounded-2xl border border-white/15 bg-white/[0.06] p-2 text-left shadow-[0_20px_60px_-20px_rgba(20,184,166,0.45)] backdrop-blur-xl transition focus-within:border-lagoon/60"
          >
            <span className="pl-2 text-lagoon">
              <Sparkle />
            </span>
            <div className="relative min-w-0 flex-1">
              <input
                value={question}
                onChange={(event) => setQuestion(event.target.value)}
                onFocus={() => setFocused(true)}
                onBlur={() => setFocused(false)}
                aria-label={t.overview.askTitle}
                placeholder={focused ? t.overview.typeQuestion : ""}
                className="w-full bg-transparent px-1 py-2 text-sm text-white outline-none placeholder:text-slate-500 md:text-base"
              />
              {question === "" && !focused ? (
                <span
                  aria-hidden
                  className="caret pointer-events-none absolute inset-y-0 left-1 flex max-w-full items-center overflow-hidden whitespace-nowrap text-sm text-slate-400 md:text-base"
                >
                  {typed}
                </span>
              ) : null}
            </div>
            <button type="submit" disabled={asking} className={`${buttonPrimary} px-4 py-2`}>
              {asking ? t.ask.thinking : t.overview.ask}
            </button>
          </form>

          <div className="mt-3 flex flex-wrap justify-center gap-2 lg:justify-start">
            {t.overview.quickQuestions.map((item) => (
              <button
                key={item}
                type="button"
                onClick={() => {
                  setQuestion(item);
                  void ask(item);
                }}
                className="rounded-full border border-white/10 bg-white/5 px-3 py-1 text-xs text-slate-300 transition hover:border-lagoon/50 hover:text-white"
              >
                {item}
              </button>
            ))}
          </div>

          {answer ? (
            <div
              key={answer.answer}
              className="animate-fade-up mt-5 rounded-2xl border border-white/10 bg-ink-2/80 p-4 text-left backdrop-blur"
            >
              <div className="flex items-start justify-between gap-3">
                <p className="text-sm leading-6 text-white">{answer.answer}</p>
                <span className="shrink-0 rounded-full bg-lagoon/15 px-2 py-0.5 text-[11px] font-medium text-lagoon-soft">
                  {Math.round(answer.confidence * 100)}%
                </span>
              </div>
              <code className="mt-3 block overflow-x-auto rounded-lg bg-black/30 px-3 py-2 font-mono text-[11px] text-lagoon-soft/80">
                {answer.calculation}
              </code>
              <Link href="/ask" className="mt-3 inline-flex text-xs font-medium text-coral hover:underline">
                {t.overview.seeTable}
              </Link>
            </div>
          ) : null}
        </div>
      </PageHero>

      {/* KPI cards overlapping the hero */}
      <section className="relative z-10 mx-auto -mt-20 max-w-6xl px-4 md:px-6">
        {error ? (
          <p className="mb-4 rounded-xl border border-rose-200 bg-rose-50 px-4 py-3 text-sm text-rose-700">
            {error}
          </p>
        ) : null}
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <Stat
            delay={0}
            label={t.overview.documentsProcessed}
            hint={t.overview.approvedHint.replace("{n}", String(summary?.approved ?? "…"))}
            tone="lagoon"
            icon="M6 3h9l4 4v14H6V3Zm8 1v4h4"
          >
            <CountUp value={summary?.documents_total} />
          </Stat>
          <Stat
            delay={80}
            label={t.overview.needsReview}
            hint={t.overview.reviewHint}
            tone="sun"
            icon="M12 8v5m0 3h.01M10.3 3.9 2.6 17a2 2 0 0 0 1.7 3h15.4a2 2 0 0 0 1.7-3L13.7 3.9a2 2 0 0 0-3.4 0Z"
          >
            <CountUp value={summary?.needs_review} />
          </Stat>
          <Stat
            delay={160}
            label={t.overview.spendThisMonth}
            hint={t.overview.vatHint.replace(
              "{amount}",
              summary ? money(summary.monthly_vat, currency) : "…",
            )}
            tone="ink"
            icon="M4 19V9m5 10V5m5 14v-7m5 7V7"
          >
            <CountUp value={summary?.monthly_spend} format={(n) => money(n, currency)} />
          </Stat>
          <Stat
            delay={240}
            label={t.overview.readiness}
            hint={t.overview.readinessHint}
            tone="coral"
            icon="M12 3a9 9 0 1 0 9 9h-9V3Z"
          >
            <CountUp value={summary?.readiness_score} />
            <span className="text-base font-medium text-muted">/100</span>
          </Stat>
        </div>
      </section>

      {/* The problem, then why Lekont wins */}
      <ProblemSection copy={t.story.problem} />
      <WhyLekontWins copy={t.story.wins} />

      {/* WhatsApp: the value proposition */}
      <WhatsAppTeaser copy={t.hero.wa} />

      {/* Real owners */}
      <BuiltFor copy={t.hero.built} />

      {/* Count-up stats */}
      <StoryStats copy={t.story.stats} />

      {/* Bilingual document vocabulary */}
      <section className="mx-auto max-w-6xl px-4 pt-16 md:px-6">
        <Reveal>
          <p className="text-center text-xs font-medium uppercase tracking-[0.2em] text-muted">
            {t.hero.marquee}
          </p>
          <div className="mt-6">
            <Marquee
              items={VOCAB.map((word, index) => (
                <span
                  key={word}
                  className={`inline-flex items-center gap-2 rounded-full border px-4 py-2 text-sm font-medium ${
                    index % 2 === 0
                      ? "border-lagoon/30 bg-lagoon-wash text-lagoon-deep"
                      : "border-line bg-card text-ink"
                  }`}
                >
                  <span
                    className={`h-1.5 w-1.5 rounded-full ${index % 2 === 0 ? "bg-lagoon" : "bg-coral"}`}
                  />
                  {word}
                </span>
              ))}
            />
          </div>
        </Reveal>
      </section>

      {/* How it works */}
      <section className="mx-auto max-w-6xl px-4 py-24 md:px-6">
        <SectionHeading eyebrow={t.hero.howEyebrow} title={t.hero.howTitle} description={t.hero.howSub} />
        <Reveal delay={120} className="mt-12">
          <Flow steps={t.hero.steps} />
        </Reveal>
      </section>

      {/* Pinned scroll story: one invoice, four steps */}
      <PinnedStory copy={t.story.pinned} />

      {/* For accountants */}
      <AccountantShowcase copy={t.hero.acct} />

      {/* Six tools orbiting the ledger */}
      <OrbitTools copy={t.story.orbit} />

      {/* Cards dealt from a deck as you scroll */}
      <DealtDeck copy={t.story.deck} />

      {/* Live tabbed showcase */}
      <section className="border-y border-line bg-card py-24">
        <div className="mx-auto max-w-6xl px-4 md:px-6">
          <SectionHeading eyebrow={t.hero.liveEyebrow} title={t.hero.liveTitle} description={t.hero.liveSub} />
          <div className="mt-12">
            <ProductStack
              items={[
                {
                  key: "documents",
                  eyebrow: t.hero.tabs[0].label,
                  title: t.overview.recentDocuments,
                  blurb: t.hero.tabs[0].blurb,
                  action: <StackLink href="/documents">{t.hero.stackOpen[0]}</StackLink>,
                  content: <DocsPanel documents={documents} t={t} />,
                },
                {
                  key: "cash",
                  eyebrow: t.hero.tabs[1].label,
                  title: t.overview.monthlyTotals,
                  blurb: t.hero.tabs[1].blurb,
                  action: <StackLink href="/ask">{t.hero.stackOpen[1]}</StackLink>,
                  content: summary ? (
                    <div>
                      <div className="mb-3 flex items-end justify-between gap-3">
                        <p className="text-sm font-semibold">{t.overview.cashOutflow}</p>
                        <div className="text-right">
                          <p className="text-lg font-semibold tabular-nums">
                            {money(summary.monthly_spend, currency)}
                          </p>
                          <p className="text-[11px] text-muted">{t.overview.thisMonth}</p>
                        </div>
                      </div>
                      <SpendChart data={summary.monthly} />
                    </div>
                  ) : (
                    <span className="skeleton block h-60 rounded-xl" />
                  ),
                },
                {
                  key: "supplier",
                  eyebrow: t.hero.tabs[2].label,
                  title: summary?.top_supplier ?? t.overview.topSupplier,
                  blurb: t.hero.tabs[2].blurb,
                  action: <StackLink href="/ask">{t.hero.stackOpen[2]}</StackLink>,
                  content: (
                    <div className="flex h-full min-h-[260px] flex-col justify-center gap-3">
                      <p className="text-xs font-medium uppercase tracking-[0.14em] text-muted">
                        {t.overview.topSupplier}
                      </p>
                      <p className="text-3xl font-semibold tracking-tight md:text-4xl">
                        {summary?.top_supplier ?? <span className="skeleton inline-block h-9 w-56 rounded-lg" />}
                      </p>
                      <p className="text-2xl font-semibold text-lagoon-deep">
                        <CountUp value={summary?.top_supplier_spend} format={(n) => money(n, currency)} />
                      </p>
                      <p className="text-sm text-muted">
                        {summary
                          ? t.overview.topSupplierSub.replace("{amount}", money(summary.top_supplier_spend, currency))
                          : ""}
                      </p>
                    </div>
                  ),
                },
              ]}
            />
          </div>
        </div>
      </section>

      {/* Horizontal photo gallery driven by vertical scroll */}
      <PhotoGallery copy={t.story.gallery} />

      {/* Call to action */}
      <section className="mx-auto max-w-6xl px-4 py-24 md:px-6">
        <Reveal>
          <div className="relative isolate overflow-hidden rounded-3xl bg-night px-6 py-16 text-center text-white md:px-16">
            <HeroBackdrop />
            <div className="relative">
              <h2 className="mx-auto max-w-2xl text-balance text-3xl font-semibold tracking-tight md:text-4xl">
                {t.hero.ctaLead} <span className="text-gradient">{t.hero.ctaHighlight}</span>
              </h2>
              <p className="mx-auto mt-4 max-w-xl text-slate-300">{t.hero.ctaSub}</p>
              <div className="mt-8 flex flex-wrap justify-center gap-3">
                <Link href="/readiness" className={buttonPrimary}>
                  {t.hero.ctaStart}
                </Link>
                <Link href="/ask" className={buttonGhost}>
                  {t.overview.askTitle}
                </Link>
              </div>
            </div>
          </div>
        </Reveal>
      </section>
    </>
  );
}

function Arrow() {
  return (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" aria-hidden>
      <path d="M5 12h14m-6-6 6 6-6 6" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

const TONES = {
  lagoon: { glow: "from-lagoon/25", icon: "bg-lagoon-wash text-lagoon-deep", value: "text-lagoon-deep" },
  sun: { glow: "from-sun/25", icon: "bg-sun-soft text-sun-ink", value: "text-sun-ink" },
  ink: { glow: "from-ink/10", icon: "bg-surface text-ink", value: "text-ink" },
  coral: { glow: "from-coral/25", icon: "bg-coral-soft text-coral", value: "text-coral" },
} as const;

function Stat({
  label,
  hint,
  tone,
  delay,
  icon,
  children,
}: {
  label: string;
  hint: string;
  tone: keyof typeof TONES;
  delay: number;
  icon: string;
  children: ReactNode;
}) {
  const styles = TONES[tone];
  return (
    <div className="hero-animated" style={{ "--d": `${450 + delay}ms` } as CSSProperties}>
    <TiltCard className={`${card} group h-full overflow-hidden p-5`}>
      <span
        className={`pointer-events-none absolute -right-10 -top-10 h-28 w-28 rounded-full bg-gradient-to-br ${styles.glow} to-transparent transition duration-500 group-hover:scale-150`}
      />
      <div className="relative flex items-start justify-between gap-2">
        <p className="text-[11px] font-medium uppercase tracking-[0.14em] text-muted">{label}</p>
        <span className={`grid h-7 w-7 shrink-0 place-items-center rounded-lg ${styles.icon}`}>
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" aria-hidden>
            <path d={icon} />
          </svg>
        </span>
      </div>
      <p className={`relative mt-2 text-2xl font-semibold ${styles.value}`}>{children}</p>
      <p className="relative mt-1 text-xs text-muted">{hint}</p>
    </TiltCard>
    </div>
  );
}

function SectionHeading({
  eyebrow,
  title,
  description,
}: {
  eyebrow: string;
  title: string;
  description: string;
}) {
  return (
    <Reveal className="mx-auto max-w-2xl text-center">
      <span className="text-xs font-semibold uppercase tracking-[0.2em] text-lagoon-deep">{eyebrow}</span>
      <h2 className="mt-3 text-balance text-3xl font-semibold tracking-tight md:text-4xl">{title}</h2>
      <p className="mt-4 text-pretty text-muted">{description}</p>
    </Reveal>
  );
}

const STEP_ICONS = [
  "M12 16V4m0 0-4 4m4-4 4 4M4 16v3a1 1 0 0 0 1 1h14a1 1 0 0 0 1-1v-3",
  "M4 6h16M4 12h10M4 18h6",
  "m5 12 4 4L19 6",
  "M4 5h16v11H9l-5 4V5Z",
];

function Flow({ steps }: { steps: { title: string; body: string }[] }) {
  const path = "M 60 60 C 200 10, 260 110, 400 60 S 600 10, 740 60 S 940 110, 1080 60";
  return (
    <div className={`${card} relative overflow-hidden p-6 md:p-10`}>
      <svg
        viewBox="0 0 1140 120"
        className="absolute inset-x-6 top-[68px] hidden h-28 w-[calc(100%-3rem)] -translate-y-1/2 md:block"
        preserveAspectRatio="none"
        aria-hidden
      >
        <path d={path} fill="none" stroke="#ccfbf1" strokeWidth="6" strokeLinecap="round" />
        <path d={path} fill="none" stroke="#14b8a6" strokeWidth="1.5" className="dash-march" />
        {[0, 1.2, 2.4].map((delay, index) => (
          <circle
            key={delay}
            r="5"
            className="flow-dot-svg"
            fill={index === 1 ? "#ff6b4a" : "#14b8a6"}
            opacity="0"
          >
            <animateMotion dur="3.6s" begin={`${delay}s`} repeatCount="indefinite" path={path} />
            <animate
              attributeName="opacity"
              values="0;1;1;0"
              keyTimes="0;0.1;0.9;1"
              dur="3.6s"
              begin={`${delay}s`}
              repeatCount="indefinite"
            />
          </circle>
        ))}
      </svg>
      <ol className="relative grid gap-8 md:grid-cols-4 md:gap-6">
        {steps.map((step, index) => (
          <Reveal as="li" key={index} delay={index * 110} className="flex flex-col items-center text-center">
            <span className="relative grid h-14 w-14 place-items-center rounded-2xl border border-lagoon/30 bg-card text-lagoon-deep shadow-[0_10px_30px_-10px_rgba(20,184,166,0.6)]">
              <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
                <path d={STEP_ICONS[index % STEP_ICONS.length]} />
              </svg>
              <span className="absolute -right-2 -top-2 grid h-5 w-5 place-items-center rounded-full bg-ink text-[10px] font-semibold text-card">
                {index + 1}
              </span>
            </span>
            <span className="mt-4 font-semibold">{step.title}</span>
            <span className="mt-1 max-w-[18ch] text-sm text-muted">{step.body}</span>
          </Reveal>
        ))}
      </ol>
    </div>
  );
}

function StackLink({ href, children }: { href: string; children: ReactNode }) {
  return (
    <Link
      href={href}
      className="inline-flex w-fit items-center gap-1 rounded-full border border-white/15 bg-white/5 px-4 py-2 text-sm font-semibold text-white transition hover:-translate-y-0.5 hover:border-lagoon/60"
    >
      {children}
    </Link>
  );
}

function DocsPanel({ documents, t }: { documents: DocumentSummary[] | null; t: Messages }) {
  if (!documents) {
    return (
      <div className="flex flex-col gap-3">
        {[0, 1, 2, 3].map((row) => (
          <span key={row} className="skeleton h-10 rounded-lg" />
        ))}
      </div>
    );
  }
  return (
    <div className="overflow-x-auto">
      <table className="w-full text-left text-sm">
        <thead className="text-[11px] uppercase tracking-wide text-muted">
          <tr>
            <th className="pb-3 font-medium">{t.overview.file}</th>
            <th className="pb-3 font-medium">{t.overview.party}</th>
            <th className="pb-3 text-right font-medium">{t.overview.total}</th>
            <th className="hidden pb-3 text-right font-medium sm:table-cell">{t.overview.confidence}</th>
            <th className="pb-3 text-right font-medium">{t.overview.status}</th>
          </tr>
        </thead>
        <tbody>
          {documents.slice(0, 6).map((document, index) => (
            <tr
              key={document.id}
              className="animate-fade-up group border-t border-line"
              style={{ "--d": `${index * 60}ms` } as CSSProperties}
            >
              <td className="max-w-[200px] py-3 pr-3">
                <Link href="/documents" className="block truncate font-medium group-hover:text-lagoon-deep">
                  {document.filename}
                </Link>
                <span className="block text-[11px] text-muted">
                  {document.doc_type} · {document.language.toUpperCase()}
                </span>
              </td>
              <td className="py-3 pr-3 text-muted">{document.supplier ?? "—"}</td>
              <td className="py-3 text-right tabular-nums">
                {document.total !== null ? money(document.total, document.currency) : "—"}
              </td>
              <td className="hidden py-3 text-right sm:table-cell">
                <span className="inline-flex items-center gap-2">
                  <span className="h-1.5 w-14 overflow-hidden rounded-full bg-lagoon-wash">
                    <span
                      className="grow-bar block h-full rounded-full bg-lagoon"
                      style={{ width: `${document.confidence * 100}%`, "--d": `${200 + index * 60}ms` } as CSSProperties}
                    />
                  </span>
                  <span className="text-[11px] tabular-nums text-muted">
                    {Math.round(document.confidence * 100)}%
                  </span>
                </span>
              </td>
              <td className="py-3 text-right">
                <StatusBadge status={document.status} label={t.overview.statusLabels[document.status]} />
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

function StatusBadge({ status, label }: { status: DocumentSummary["status"]; label: string }) {
  const styles =
    status === "approved"
      ? "bg-lagoon-wash text-lagoon-deep ring-lagoon/30"
      : status === "exported"
        ? "bg-surface text-ink ring-ink/15"
        : "bg-sun-soft text-sun-ink ring-sun/30";
  return (
    <span className={`whitespace-nowrap rounded-full px-2 py-0.5 text-[10px] font-medium ring-1 ${styles}`}>
      {label}
    </span>
  );
}
