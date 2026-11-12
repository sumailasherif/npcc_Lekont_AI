import type { Metadata } from "next";
import type { ReactNode } from "react";
import { Caveat, Geist, Geist_Mono } from "next/font/google";

import { AppShell } from "@/components/app-shell";
import { LanguageProvider } from "@/components/language-provider";
import { THEME_BOOT_SCRIPT } from "@/components/theme-toggle";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

const caveat = Caveat({
  variable: "--font-caveat",
  subsets: ["latin"],
  weight: ["500", "700"],
});

export const metadata: Metadata = {
  title: "Lekont - your SME back office, in plain language",
  description:
    "Extract invoices, payslips and contracts in French and English, review them, then ask plain-language questions about the numbers and what to automate first.",
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html
      lang="en"
      suppressHydrationWarning
      className={`${geistSans.variable} ${geistMono.variable} ${caveat.variable} h-full antialiased`}
    >
      <head>
        <script dangerouslySetInnerHTML={{ __html: THEME_BOOT_SCRIPT }} />
      </head>
      <body className="min-h-full">
        <LanguageProvider>
          <AppShell>{children}</AppShell>
        </LanguageProvider>
      </body>
    </html>
  );
}
