"use client";

import Image from "next/image";
import { useEffect, useRef, useState } from "react";
import type { ReactNode } from "react";

type Point = [number, number];

/**
 * Places live UI onto a device screen inside a photo.
 * `quad` holds the screen's four corners in percent of the photo (TL, TR, BR, BL);
 * the content is rendered at `screen` size and warped onto that quad with a CSS homography,
 * so it follows the photo's perspective at any display size.
 */
export function ScreenComposite({
  src,
  alt,
  width,
  height,
  quad,
  screen,
  radius = 0,
  className = "",
  imageClassName = "",
  priority = false,
  children,
}: {
  src: string;
  alt: string;
  width: number;
  height: number;
  quad: [Point, Point, Point, Point];
  screen: { width: number; height: number };
  radius?: number;
  className?: string;
  imageClassName?: string;
  priority?: boolean;
  children: ReactNode;
}) {
  const box = useRef<HTMLDivElement | null>(null);
  const [matrix, setMatrix] = useState<string | null>(null);

  useEffect(() => {
    const node = box.current;
    if (!node) return;
    const update = () => {
      // Layout size, not getBoundingClientRect: parents may scale or rotate this box,
      // and the overlay lives inside the same transform, so it must use untransformed units.
      const w = node.offsetWidth;
      const h = node.offsetHeight;
      if (!w || !h) return;
      const target = quad.map(([x, y]) => [(x / 100) * w, (y / 100) * h]) as [Point, Point, Point, Point];
      setMatrix(homography(screen.width, screen.height, target));
    };
    update();
    const observer = new ResizeObserver(update);
    observer.observe(node);
    return () => observer.disconnect();
  }, [quad, screen.width, screen.height]);

  return (
    <div ref={box} className={`relative overflow-hidden ${className}`}>
      <Image src={src} alt={alt} width={width} height={height} priority={priority} className={`block h-auto w-full ${imageClassName}`} />
      <div
        aria-hidden={!matrix}
        className="light-scope absolute left-0 top-0 overflow-hidden"
        style={{
          width: screen.width,
          height: screen.height,
          borderRadius: radius,
          transformOrigin: "0 0",
          transform: matrix ?? "scale(0)",
          opacity: matrix ? 1 : 0,
          transition: "opacity 0.4s ease",
        }}
      >
        {children}
      </div>
    </div>
  );
}

/** CSS matrix3d mapping the rectangle (0,0)-(w,h) onto the quadrilateral `to` (TL, TR, BR, BL). */
function homography(w: number, h: number, to: [Point, Point, Point, Point]): string {
  const from: Point[] = [
    [0, 0],
    [w, 0],
    [w, h],
    [0, h],
  ];
  const A: number[][] = [];
  const b: number[] = [];
  for (let i = 0; i < 4; i += 1) {
    const [x, y] = from[i];
    const [u, v] = to[i];
    A.push([x, y, 1, 0, 0, 0, -u * x, -u * y]);
    b.push(u);
    A.push([0, 0, 0, x, y, 1, -v * x, -v * y]);
    b.push(v);
  }
  const [a, bb, c, d, e, f, g, hh] = solve(A, b);
  // Column-major 4x4 for matrix3d.
  return `matrix3d(${[a, d, 0, g, bb, e, 0, hh, 0, 0, 1, 0, c, f, 0, 1].map((n) => n.toFixed(10)).join(",")})`;
}

function solve(A: number[][], b: number[]): number[] {
  const n = b.length;
  const M = A.map((row, i) => [...row, b[i]]);
  for (let col = 0; col < n; col += 1) {
    let pivot = col;
    for (let row = col + 1; row < n; row += 1) {
      if (Math.abs(M[row][col]) > Math.abs(M[pivot][col])) pivot = row;
    }
    [M[col], M[pivot]] = [M[pivot], M[col]];
    for (let row = 0; row < n; row += 1) {
      if (row === col) continue;
      const factor = M[row][col] / M[col][col];
      for (let k = col; k <= n; k += 1) M[row][k] -= factor * M[col][k];
    }
  }
  return M.map((row, i) => row[n] / row[i]);
}
