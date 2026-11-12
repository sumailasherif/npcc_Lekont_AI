"use client";

import Link from "next/link";
import { useState } from "react";

import { Reveal, buttonLagoon, card } from "@/components/motion";
import { BOOKING_HREF, HAS_BOOKING } from "@/lib/site";
import type { Messages } from "@/lib/i18n";

type Copy = Messages["site"];

export function Faq({ copy, footer }: { copy: Copy["faq"]; footer: Copy["footer"] }) {
  const [open, setOpen] = useState<number | null>(0);

  const schema = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: copy.items.map((item) => ({
      "@type": "Question",
      name: item.q,
      acceptedAnswer: { "@type": "Answer", text: item.a },
    })),
  };

  return (
    <section id="faq" className="mx-auto max-w-6xl scroll-mt-24 px-4 py-24 md:px-6">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }} />
      <div className="grid gap-10 lg:grid-cols-[0.8fr_1.2fr] lg:gap-14">
        <Reveal className="lg:sticky lg:top-28 lg:self-start">
          <span className="text-xs font-semibold uppercase tracking-[0.2em] text-lagoon-deep">{copy.eyebrow}</span>
          <h2 className="mt-3 text-balance text-3xl font-semibold tracking-tight md:text-5xl">{copy.title}</h2>
          <p className="mt-4 text-pretty text-muted md:text-lg">{copy.sub}</p>
          <div className={`${card} mt-8 flex items-center gap-4 p-5`}>
            <span className="grid h-11 w-11 shrink-0 place-items-center rounded-full bg-lagoon-wash text-lagoon-deep">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
                <path d="M5 4h4l2 5-2.5 1.5a11 11 0 0 0 5 5L15 13l5 2v4a2 2 0 0 1-2 2A16 16 0 0 1 3 6a2 2 0 0 1 2-2Z" />
              </svg>
            </span>
            <div className="min-w-0 flex-1">
              <p className="font-semibold">{copy.more}</p>
              <p className="text-sm text-muted">{footer.ctaSub}</p>
            </div>
          </div>
          <Link
            href={BOOKING_HREF}
            className={`${buttonLagoon} mt-4`}
            {...(HAS_BOOKING ? { target: "_blank", rel: "noopener noreferrer" } : {})}
          >
            {HAS_BOOKING ? footer.bookCall : footer.tryWhatsApp} →
          </Link>
        </Reveal>

        <div className="flex flex-col gap-3">
          {copy.items.map((item, index) => {
            const isOpen = open === index;
            const id = `faq-${index}`;
            return (
              <Reveal key={item.q} delay={index * 60}>
                <div
                  className={`faq-item ${card} overflow-hidden transition-colors duration-300 ${isOpen ? "border-lagoon/50" : ""}`}
                  data-open={isOpen}
                >
                  <button
                    type="button"
                    aria-expanded={isOpen}
                    aria-controls={id}
                    onClick={() => setOpen(isOpen ? null : index)}
                    className="flex w-full items-center gap-4 px-5 py-4 text-left md:px-6 md:py-5"
                  >
                    <span className="font-mono text-xs text-muted">{String(index + 1).padStart(2, "0")}</span>
                    <span className="flex-1 font-semibold md:text-lg">{item.q}</span>
                    <span
                      className={`faq-icon grid h-8 w-8 shrink-0 place-items-center rounded-full transition duration-300 ${
                        isOpen ? "bg-lagoon text-night" : "bg-surface text-ink"
                      }`}
                    >
                      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" aria-hidden>
                        <path d="M12 5v14M5 12h14" />
                      </svg>
                    </span>
                  </button>
                  <div id={id} role="region" className="faq-panel">
                    <div className="overflow-hidden">
                      <p className="px-5 pb-5 pl-[3.25rem] text-sm leading-7 text-muted md:px-6 md:pl-[3.6rem] md:text-base">
                        {item.a}
                      </p>
                    </div>
                  </div>
                </div>
              </Reveal>
            );
          })}
        </div>
      </div>
    </section>
  );
}
