"use client";

import { useEffect, useRef } from "react";
import type { ReactNode } from "react";

import { TiltCard } from "@/components/tilt-card";

export type StackItem = {
  key: string;
  eyebrow: string;
  title: string;
  blurb: string;
  action?: ReactNode;
  content: ReactNode;
};

const TOP = 96; // below the fixed navbar
const OFFSET = 22; // each card sticks a little lower than the previous one

/**
 * Sticky product screens: as each new card scrolls up over the previous one,
 * the previous card is gently pressed back (scaled and dimmed).
 */
export function ProductStack({ items }: { items: StackItem[] }) {
  const sticky = useRef<(HTMLDivElement | null)[]>([]);
  const inner = useRef<(HTMLDivElement | null)[]>([]);

  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    let frame = 0;

    const update = () => {
      frame = 0;
      const viewport = window.innerHeight;
      for (let i = 0; i < items.length - 1; i += 1) {
        const next = sticky.current[i + 1];
        const card = inner.current[i];
        if (!next || !card) continue;
        const nextTop = next.getBoundingClientRect().top;
        const stickAt = TOP + (i + 1) * OFFSET;
        const progress = Math.min(Math.max((viewport - nextTop) / (viewport - stickAt), 0), 1);
        card.style.transform = `scale(${1 - progress * 0.06})`;
        card.style.filter = `brightness(${1 - progress * 0.18}) saturate(${1 - progress * 0.3})`;
      }
    };

    const onScroll = () => {
      if (!frame) frame = requestAnimationFrame(update);
    };
    update();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);
    return () => {
      cancelAnimationFrame(frame);
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
    };
  }, [items.length]);

  return (
    <div className="flex flex-col gap-10">
      {items.map((item, index) => (
        <div
          key={item.key}
          ref={(node) => {
            sticky.current[index] = node;
          }}
          className="md:sticky"
          style={{ top: TOP + index * OFFSET }}
        >
          <div
            ref={(node) => {
              inner.current[index] = node;
            }}
            className="origin-top will-change-transform"
          >
            <TiltCard
              max={2}
              className="grid overflow-hidden rounded-3xl border border-line bg-card shadow-[0_30px_80px_-40px_rgba(7,20,38,0.45)] md:min-h-[440px] md:grid-cols-[0.8fr_1.2fr]"
            >
              <div className="flex flex-col justify-between gap-6 bg-night p-6 text-white md:p-8">
                <div>
                  <span className="font-mono text-xs text-lagoon">
                    0{index + 1} / 0{items.length}
                  </span>
                  <p className="mt-4 text-xs font-semibold uppercase tracking-[0.2em] text-lagoon-soft/80">
                    {item.eyebrow}
                  </p>
                  <h3 className="mt-2 text-balance text-2xl font-semibold tracking-tight md:text-3xl">
                    {item.title}
                  </h3>
                  <p className="mt-3 text-sm leading-6 text-slate-300">{item.blurb}</p>
                </div>
                {item.action}
              </div>
              <div className="min-w-0 p-5 md:p-6">{item.content}</div>
            </TiltCard>
          </div>
        </div>
      ))}
    </div>
  );
}
