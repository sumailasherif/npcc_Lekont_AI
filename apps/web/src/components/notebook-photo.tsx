import type { CSSProperties } from "react";

export type LedgerLine = { date: string; description: string; amount: number; note?: string };

/**
 * A "photo" of a handwritten shop ledger page, as an owner would snap it and send it on WhatsApp:
 * lined paper on a wooden counter, red margin, handwriting, a coffee ring and a pen, warm light.
 * Built in CSS so the handwriting always matches the lines the bot reports back.
 */
export function NotebookPhoto({
  lines,
  heading = "Lavant · 12/11",
  className = "",
}: {
  lines: LedgerLine[];
  heading?: string;
  className?: string;
}) {
  const total = lines.reduce((sum, line) => sum + line.amount, 0);
  return (
    <div
      className={`notebook-photo relative block w-full overflow-hidden ${className}`}
      style={{ aspectRatio: "4 / 5" }}
      role="img"
      aria-label={`Photo of a handwritten ledger page: ${lines.map((line) => `${line.description} ${line.amount}`).join(", ")}, total ${total}`}
    >
      {/* paper, slightly rotated with perspective like a hand-held snapshot */}
      <div className="notebook-paper absolute left-[7%] top-[6%] h-[96%] w-[84%] font-hand text-[#1d2b6b]">
        {/* spiral holes */}
        <div className="absolute -left-[2px] top-[4%] flex h-[90%] flex-col justify-between" aria-hidden>
          {Array.from({ length: 9 }).map((_, index) => (
            <span key={index} className="h-[7px] w-[7px] rounded-full bg-[#3b2a1c]/70 shadow-[inset_0_1px_1px_rgba(0,0,0,0.6)]" />
          ))}
        </div>
        <div className="relative h-full pl-[17%] pr-[6%] pt-[8%]">
          <p className="text-[19px] font-bold leading-none tracking-wide text-[#16205a]" style={{ transform: "rotate(-1.5deg)" }}>
            {heading}
          </p>
          <div className="mt-[10px] flex flex-col">
            {lines.map((line, index) => (
              <div
                key={`${line.description}-${index}`}
                className="flex items-baseline justify-between gap-2 text-[16px] leading-[24px]"
                style={{ transform: `rotate(${index % 2 === 0 ? -0.6 : 0.5}deg) translateX(${(index % 3) - 1}px)` } as CSSProperties}
              >
                <span className="truncate">
                  <span className="mr-1.5 text-[13px] opacity-70">{line.date}</span>
                  {line.description}
                  {line.note ? <span className="ml-1 text-[#b42318]">({line.note})</span> : null}
                </span>
                <span className="shrink-0 font-bold">{line.amount.toLocaleString("en-GB")}</span>
              </div>
            ))}
          </div>
          <div className="mt-[6px] flex items-baseline justify-between border-t-2 border-[#1d2b6b]/70 pt-[2px] text-[18px] font-bold" style={{ transform: "rotate(-0.8deg)" }}>
            <span>Total</span>
            <span className="underline decoration-[#b42318] decoration-2 underline-offset-2">Rs {total.toLocaleString("en-GB")}</span>
          </div>
        </div>
        {/* coffee ring */}
        <span className="absolute -bottom-[6%] right-[8%] h-[26%] w-[30%] rounded-full border-[5px] border-[#8b5a2b]/25" aria-hidden />
      </div>
      {/* pen */}
      <span className="notebook-pen absolute bottom-[10%] right-[-6%] h-[7px] w-[46%]" aria-hidden />
      {/* warm light and lens vignette */}
      <span className="pointer-events-none absolute inset-0 bg-[radial-gradient(120%_90%_at_30%_20%,rgba(255,236,200,0.25),transparent_55%),radial-gradient(130%_100%_at_50%_50%,transparent_55%,rgba(0,0,0,0.35))]" aria-hidden />
    </div>
  );
}
