import type { CSSProperties } from "react";

/**
 * Bento-style mini widgets for the eight deck cards (same order as story.deck.cards).
 * Language-neutral on purpose: numbers, icons and shapes only, so every locale reads them.
 */
export function DeckVisual({ index }: { index: number }) {
  switch (index) {
    case 0:
      return <Receipt />;
    case 1:
      return <SalesSpark />;
    case 2:
      return <SaleBubble />;
    case 3:
      return <StockBars />;
    case 4:
      return <VatRing />;
    case 5:
      return <Approve />;
    case 6:
      return <Avatars />;
    default:
      return <Pdf />;
  }
}

const tile = "relative flex h-full w-full items-center justify-center";

function Receipt() {
  return (
    <div className={tile}>
      <div className="deck-float relative w-16 rotate-[-6deg] rounded-md bg-white p-2 shadow-[0_10px_24px_-10px_rgba(7,20,38,0.45)]">
        {[90, 70, 80, 55].map((width, i) => (
          <span key={i} className="mb-1 block h-1 rounded-full bg-[#e3e8ef]" style={{ width: `${width}%` }} />
        ))}
        <span className="mt-1.5 block h-1.5 w-1/2 rounded-full bg-[#0d9488]" />
        <span className="deck-flash absolute inset-0 rounded-md bg-white" aria-hidden />
      </div>
      <span className="absolute right-[22%] top-[18%] grid h-7 w-7 place-items-center rounded-full bg-[#14b8a6] text-white shadow-lg">
        <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinejoin="round" aria-hidden>
          <path d="M4 8h3l2-3h6l2 3h3v11H4V8Z" />
          <circle cx="12" cy="13" r="3.5" />
        </svg>
      </span>
    </div>
  );
}

function SalesSpark() {
  return (
    <div className={`${tile} flex-col items-start justify-end px-1`}>
      <p className="text-lg font-semibold tabular-nums text-ink">48,250</p>
      <svg viewBox="0 0 120 32" className="h-8 w-full" aria-hidden>
        <defs>
          <linearGradient id="deck-spark" x1="0" x2="0" y1="0" y2="1">
            <stop offset="0" stopColor="#14b8a6" stopOpacity="0.35" />
            <stop offset="1" stopColor="#14b8a6" stopOpacity="0" />
          </linearGradient>
        </defs>
        <path d="M0 26 L18 22 L34 24 L52 15 L70 18 L88 9 L104 11 L120 3 L120 32 L0 32Z" fill="url(#deck-spark)" />
        <path d="M0 26 L18 22 L34 24 L52 15 L70 18 L88 9 L104 11 L120 3" fill="none" stroke="#14b8a6" strokeWidth="2" strokeLinecap="round" className="deck-draw" />
        <circle cx="120" cy="3" r="3" fill="#ff6b4a" className="deck-pulse" />
      </svg>
    </div>
  );
}

function SaleBubble() {
  return (
    <div className={`${tile} flex-col items-stretch justify-center gap-1.5 px-1`}>
      <span className="self-end rounded-lg rounded-tr-sm bg-[#d9fdd3] px-2 py-1 text-[10px] font-medium text-[#111b21] shadow-sm">3 × 250</span>
      <span className="deck-pop flex items-center gap-1 self-start rounded-lg rounded-tl-sm bg-white px-2 py-1 text-[10px] font-semibold text-[#0d9488] shadow-sm">
        <span className="grid h-3.5 w-3.5 place-items-center rounded-full bg-[#0d9488] text-[8px] text-white">✓</span>
        MUR 750
      </span>
    </div>
  );
}

function StockBars() {
  const levels = [82, 64, 18, 71];
  return (
    <div className={`${tile} items-end gap-2 px-2 pb-1`}>
      {levels.map((level, i) => (
        <span key={i} className="relative h-full w-full overflow-hidden rounded-md bg-surface">
          <span
            className={`deck-grow absolute inset-x-0 bottom-0 rounded-md ${level < 25 ? "bg-coral" : "bg-gradient-to-t from-[#f59e0b] to-[#fcd34d]"}`}
            style={{ height: `${level}%`, "--d": `${i * 120}ms` } as CSSProperties}
          />
          {level < 25 ? <span className="deck-pulse absolute inset-x-0 top-1 mx-auto h-1.5 w-1.5 rounded-full bg-coral" /> : null}
        </span>
      ))}
    </div>
  );
}

function VatRing() {
  const r = 22;
  const c = 2 * Math.PI * r;
  return (
    <div className={tile}>
      <svg viewBox="0 0 60 60" className="h-16 w-16 -rotate-90" aria-hidden>
        <circle cx="30" cy="30" r={r} fill="none" stroke="var(--color-line)" strokeWidth="6" />
        <circle cx="30" cy="30" r={r} fill="none" stroke="#ff6b4a" strokeWidth="6" strokeLinecap="round" strokeDasharray={`${c * 0.15} ${c}`} className="deck-ring" />
      </svg>
      <span className="absolute text-sm font-bold tabular-nums text-ink">15%</span>
      <span className="absolute right-[18%] top-[16%] grid h-5 w-5 place-items-center rounded-full bg-[#0d9488] text-[10px] text-white">✓</span>
    </div>
  );
}

function Approve() {
  return (
    <div className={`${tile} flex-col gap-2`}>
      <span className="deck-toggle relative h-6 w-11 rounded-full bg-[#0d9488] shadow-inner">
        <span className="absolute right-0.5 top-0.5 h-5 w-5 rounded-full bg-white shadow" />
      </span>
      <span className="flex -space-x-1.5">
        {["#ff6b4a", "#6366f1"].map((color) => (
          <span key={color} className="h-5 w-5 rounded-full border-2 border-card" style={{ background: color }} />
        ))}
      </span>
    </div>
  );
}

function Avatars() {
  const people = [
    ["AR", "#14b8a6"],
    ["MB", "#ff6b4a"],
    ["KJ", "#6366f1"],
    ["SP", "#f59e0b"],
    ["NL", "#0c1f3a"],
  ];
  return (
    <div className={`${tile} flex-col gap-2`}>
      <span className="flex -space-x-2">
        {people.map(([initials, color], i) => (
          <span
            key={initials}
            className="deck-pop grid h-7 w-7 place-items-center rounded-full border-2 border-card text-[9px] font-bold text-white"
            style={{ background: color, "--d": `${i * 90}ms` } as CSSProperties}
          >
            {initials}
          </span>
        ))}
      </span>
      <span className="h-1.5 w-20 overflow-hidden rounded-full bg-surface">
        <span className="deck-grow-x block h-full rounded-full bg-[#14b8a6]" />
      </span>
    </div>
  );
}

function Pdf() {
  return (
    <div className={tile}>
      <span className="deck-float relative grid h-16 w-13 place-items-center rounded-lg bg-white p-1 shadow-[0_12px_24px_-10px_rgba(7,20,38,0.45)]" style={{ width: 52 }}>
        <span className="absolute -left-1.5 top-2 rounded bg-coral px-1 py-0.5 text-[8px] font-bold text-white">PDF</span>
        <span className="mt-3 flex w-full flex-col gap-1 px-1">
          {[100, 70, 85].map((width, i) => (
            <span key={i} className="h-1 rounded-full bg-[#e3e8ef]" style={{ width: `${width}%` }} />
          ))}
        </span>
      </span>
      <span className="deck-bounce absolute bottom-[10%] right-[24%] grid h-6 w-6 place-items-center rounded-full bg-ink text-card shadow-lg">
        <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.6" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
          <path d="M12 4v12m0 0-5-5m5 5 5-5M5 20h14" />
        </svg>
      </span>
    </div>
  );
}
