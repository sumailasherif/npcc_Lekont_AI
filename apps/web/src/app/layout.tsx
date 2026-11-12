import type { Metadata } from "next";
import type { ReactNode } from "react";
import { Bricolage_Grotesque, Caveat, DM_Sans, Geist_Mono, Instrument_Serif } from "next/font/google";

import { AppShell } from "@/components/app-shell";
import { LanguageProvider } from "@/components/language-provider";
import { THEME_BOOT_SCRIPT } from "@/components/theme-toggle";
import "./globals.css";

/* Type system: DM Sans for reading, Bricolage Grotesque for headings,
   Instrument Serif italic for the highlighted words in headings. */
const body = DM_Sans({
  variable: "--font-body",
  subsets: ["latin"],
});

const display = Bricolage_Grotesque({
  variable: "--font-display",
  subsets: ["latin"],
});

const serif = Instrument_Serif({
  variable: "--font-serif",
  subsets: ["latin"],
  weight: "400",
  style: ["normal", "italic"],
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
      className={`${body.variable} ${display.variable} ${serif.variable} ${geistMono.variable} ${caveat.variable} h-full antialiased`}
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
