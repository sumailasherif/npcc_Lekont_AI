"use client";

import { useId } from "react";

export function SpendChart({
  data,
}: {
  data: { month: string; spend: number }[];
}) {
  const gradientId = `spend-${useId().replaceAll(":", "")}`;

  if (data.length < 2) return null;

  const width = 640;
  const height = 190;
  const padX = 24;
  const padY = 26;
  const max = Math.max(...data.map((point) => point.spend)) * 1.15 || 1;

  const points = data.map((point, index) => {
    const x = padX + (index * (width - padX * 2)) / (data.length - 1);
    const y = height - padY - (point.spend / max) * (height - padY * 2);
    return { x, y, ...point };
  });

  const line = points.map((point) => `${point.x},${point.y}`).join(" ");
  const area = `M ${padX},${height - padY} L ${line.replaceAll(" ", " L ")} L ${
    width - padX
  },${height - padY} Z`;

  return (
    <div className="w-full">
      <svg viewBox={`0 0 ${width} ${height}`} className="h-44 w-full" preserveAspectRatio="none">
        <defs>
          <linearGradient id={gradientId} x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#4f46e5" stopOpacity="0.24" />
            <stop offset="100%" stopColor="#4f46e5" stopOpacity="0" />
          </linearGradient>
        </defs>
        {[0.25, 0.5, 0.75].map((ratio) => (
          <line
            key={ratio}
            x1={padX}
            x2={width - padX}
            y1={padY + ratio * (height - padY * 2)}
            y2={padY + ratio * (height - padY * 2)}
            stroke="#eef0f6"
            strokeWidth="1"
          />
        ))}
        <path d={area} fill={`url(#${gradientId})`} className="animate-fade-in" />
        <polyline
          points={line}
          fill="none"
          stroke="#4f46e5"
          strokeWidth="2.2"
          strokeLinejoin="round"
          strokeLinecap="round"
          className="animate-draw"
          vectorEffect="non-scaling-stroke"
        />
        {points.map((point, index) => (
          <circle
            key={point.month}
            cx={point.x}
            cy={point.y}
            r="3"
            fill="#ffffff"
            stroke="#4f46e5"
            strokeWidth="2"
            className="animate-scale-in"
            style={{ animationDelay: `${400 + index * 45}ms` }}
          />
        ))}
      </svg>
      <div className="mt-1 flex justify-between px-1 text-[10px] text-[#94a3b8]">
        {data.map((point) => (
          <span key={point.month}>{point.month.slice(5)}</span>
        ))}
      </div>
    </div>
  );
}
