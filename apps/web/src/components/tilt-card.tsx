"use client";

import { useRef } from "react";
import type { PointerEvent, ReactNode } from "react";

/**
 * Card that tilts toward the pointer while a lamp glow follows it along the border.
 * Mouse and pen only; touch and reduced-motion users get a still card (see .tilt in globals.css).
 */
export function TiltCard({
  children,
  className = "",
  max = 6,
}: {
  children: ReactNode;
  className?: string;
  max?: number;
}) {
  const ref = useRef<HTMLDivElement>(null);

  function move(event: PointerEvent<HTMLDivElement>) {
    if (event.pointerType === "touch") return;
    const node = ref.current;
    if (!node) return;
    const rect = node.getBoundingClientRect();
    const x = (event.clientX - rect.left) / rect.width;
    const y = (event.clientY - rect.top) / rect.height;
    node.style.setProperty("--rx", `${((0.5 - y) * max).toFixed(2)}deg`);
    node.style.setProperty("--ry", `${((x - 0.5) * max).toFixed(2)}deg`);
    node.style.setProperty("--mx", `${(x * 100).toFixed(1)}%`);
    node.style.setProperty("--my", `${(y * 100).toFixed(1)}%`);
  }

  function leave() {
    const node = ref.current;
    if (!node) return;
    node.style.setProperty("--rx", "0deg");
    node.style.setProperty("--ry", "0deg");
  }

  return (
    <div ref={ref} onPointerMove={move} onPointerLeave={leave} className={`tilt ${className}`}>
      {children}
      <span className="tilt-lamp" aria-hidden />
    </div>
  );
}
