"use client";

import type { ReactNode } from "react";

import { SiteFooter } from "@/components/site-footer";
import { SiteNav } from "@/components/site-nav";

export function AppShell({ children }: { children: ReactNode }) {
  return (
    <div className="flex min-h-screen flex-col bg-surface text-ink">
      <SiteNav />
      <main className="min-w-0 flex-1">{children}</main>
      <SiteFooter />
    </div>
  );
}
