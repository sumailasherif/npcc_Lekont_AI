"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import type { ReactNode } from "react";

const NAV = [
  { href: "/", label: "Overview", icon: "M4 13h6V4H4v9Zm0 7h6v-4H4v4Zm10 0h6V11h-6v9Zm0-16v4h6V4h-6Z" },
  { href: "/documents", label: "Documents", icon: "M6 3h9l4 4v14H6V3Zm8 1v4h4" },
  { href: "/ask", label: "Ask", icon: "M4 5h16v11H9l-5 4V5Z" },
  { href: "/readiness", label: "Readiness", icon: "M4 19V9m5 10V5m5 14v-7m5 7V7" },
];

export function AppShell({ children }: { children: ReactNode }) {
  const pathname = usePathname();

  return (
    <div className="min-h-screen bg-[#f5f5f1] text-[#171717]">
      <div className="mx-auto flex w-full max-w-6xl flex-col gap-6 px-4 py-6 md:flex-row md:gap-8 md:px-6 md:py-8">
        <aside className="flex shrink-0 flex-col justify-between gap-6 md:w-56">
          <div className="flex flex-col gap-8">
            <Link href="/" className="flex items-center gap-2 px-2">
              <span className="grid h-9 w-9 place-items-center rounded-lg bg-[#0f5f56] text-sm font-bold text-white">
                L
              </span>
              <span>
                <span className="block text-base font-semibold leading-tight">Lekont</span>
                <span className="block text-[11px] text-[#6b6b63]">SME back office</span>
              </span>
            </Link>

            <nav className="flex flex-row gap-1 overflow-x-auto md:flex-col">
              {NAV.map((item) => {
                const active =
                  item.href === "/" ? pathname === "/" : pathname.startsWith(item.href);
                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    className={`flex items-center gap-2 whitespace-nowrap rounded-lg px-3 py-2 text-sm transition ${
                      active
                        ? "bg-[#0f5f56] text-white"
                        : "text-[#4b4b45] hover:bg-white"
                    }`}
                  >
                    <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7">
                      <path d={item.icon} />
                    </svg>
                    {item.label}
                  </Link>
                );
              })}
            </nav>
          </div>

          <div className="hidden flex-col gap-2 rounded-xl border border-[#e2e2da] bg-white p-3 text-[11px] text-[#6b6b63] md:flex">
            <span className="font-medium text-[#3b3b36]">Synthetic demo data</span>
            <span>6 documents · 20 ledger lines</span>
            <span>No real company or personal data.</span>
          </div>
        </aside>

        <main className="min-w-0 flex-1 pb-16">{children}</main>
      </div>
    </div>
  );
}
