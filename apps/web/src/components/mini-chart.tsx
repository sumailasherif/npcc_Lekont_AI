import type { AskResponse } from "@/lib/api";

export function MiniChart({ result }: { result: AskResponse }) {
  if (!result.chart || result.rows.length === 0) return null;
  const { x, y, type } = result.chart;
  const values = result.rows.map((row) => Number(row[y]) || 0);
  const max = Math.max(...values, 1);

  if (type === "line") {
    const points = values
      .map((value, index) => {
        const xPos = (index / Math.max(values.length - 1, 1)) * 100;
        const yPos = 100 - (value / max) * 80;
        return `${xPos},${yPos}`;
      })
      .join(" ");
    return (
      <div className="rounded-xl border border-[#efefe9] bg-[#fafaf7] p-4">
        <svg viewBox="0 0 100 100" className="h-40 w-full" preserveAspectRatio="none">
          <polyline
            points={points}
            fill="none"
            stroke="#0f5f56"
            strokeWidth="1.8"
            vectorEffect="non-scaling-stroke"
          />
        </svg>
        <div className="mt-2 flex justify-between text-[10px] text-[#8a8a80]">
          {result.rows.map((row) => (
            <span key={String(row[x])}>{String(row[x]).slice(5)}</span>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-2 rounded-xl border border-[#efefe9] bg-[#fafaf7] p-4">
      {result.rows.map((row) => {
        const value = Number(row[y]) || 0;
        return (
          <div key={String(row[x])} className="flex items-center gap-3 text-xs">
            <span className="w-28 shrink-0 truncate text-[#6b6b63]">{String(row[x])}</span>
            <span className="h-3 flex-1 overflow-hidden rounded-full bg-[#e8e8e0]">
              <span
                className="block h-full rounded-full bg-[#0f5f56]"
                style={{ width: `${Math.max((value / max) * 100, 2)}%` }}
              />
            </span>
            <span className="w-24 text-right tabular-nums text-[#4b4b45]">
              {Math.round(value).toLocaleString("en-GB")}
            </span>
          </div>
        );
      })}
    </div>
  );
}
