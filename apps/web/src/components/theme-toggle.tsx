"use client";

import { useSyncExternalStore } from "react";
import type { MouseEvent } from "react";

export type ThemeChoice = "light" | "dark" | "system";

const STORAGE_KEY = "lekont.theme";
const listeners = new Set<() => void>();

/** Runs before first paint (see layout.tsx) so the page never flashes the wrong theme. */
export const THEME_BOOT_SCRIPT = `try{var t=localStorage.getItem("${STORAGE_KEY}");if(t==="light"||t==="dark"){document.documentElement.dataset.theme=t}}catch(e){}`;

function read(): ThemeChoice {
  try {
    const value = window.localStorage.getItem(STORAGE_KEY);
    return value === "light" || value === "dark" ? value : "system";
  } catch {
    return "system";
  }
}

function subscribe(callback: () => void) {
  listeners.add(callback);
  window.addEventListener("storage", callback);
  return () => {
    listeners.delete(callback);
    window.removeEventListener("storage", callback);
  };
}

function apply(choice: ThemeChoice) {
  const root = document.documentElement;
  if (choice === "system") delete root.dataset.theme;
  else root.dataset.theme = choice;
  try {
    if (choice === "system") window.localStorage.removeItem(STORAGE_KEY);
    else window.localStorage.setItem(STORAGE_KEY, choice);
  } catch {
    // storage blocked: the choice still applies for this visit
  }
  listeners.forEach((listener) => listener());
}

const OPTIONS: { id: ThemeChoice; label: string; icon: string }[] = [
  { id: "light", label: "Light", icon: "M12 4V2m0 20v-2m8-8h2M2 12h2m13.66-5.66 1.41-1.41M4.93 19.07l1.41-1.41m0-11.32L4.93 4.93m14.14 14.14-1.41-1.41M12 17a5 5 0 1 0 0-10 5 5 0 0 0 0 10Z" },
  { id: "dark", label: "Dark", icon: "M21 12.8A9 9 0 1 1 11.2 3a7 7 0 0 0 9.8 9.8Z" },
  { id: "system", label: "System", icon: "M3 5h18v11H3V5Zm5 15h8m-4-4v4" },
];

export function ThemeToggle() {
  const choice = useSyncExternalStore(subscribe, read, () => "system" as ThemeChoice);

  function choose(next: ThemeChoice, event: MouseEvent<HTMLButtonElement>) {
    if (next === choice) return;
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const doc = document as Document & { startViewTransition?: (cb: () => void) => unknown };

    if (!reduce && typeof doc.startViewTransition === "function") {
      const rect = event.currentTarget.getBoundingClientRect();
      document.documentElement.style.setProperty("--tx", `${rect.left + rect.width / 2}px`);
      document.documentElement.style.setProperty("--ty", `${rect.top + rect.height / 2}px`);
      doc.startViewTransition(() => apply(next));
      return;
    }

    document.documentElement.classList.add("theme-fade");
    apply(next);
    window.setTimeout(() => document.documentElement.classList.remove("theme-fade"), 400);
  }

  return (
    <div
      role="radiogroup"
      aria-label="Theme"
      className="flex shrink-0 items-center gap-0.5 rounded-full border border-white/10 bg-white/5 p-1 backdrop-blur"
    >
      {OPTIONS.map((option) => {
        const active = option.id === choice;
        return (
          <button
            key={option.id}
            type="button"
            role="radio"
            aria-checked={active}
            aria-label={option.label}
            title={option.label}
            onClick={(event) => choose(option.id, event)}
            className={`grid h-7 w-7 place-items-center rounded-full transition ${
              active ? "bg-white text-night shadow" : "text-slate-300 hover:bg-white/10 hover:text-white"
            }`}
          >
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.9" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
              <path d={option.icon} />
            </svg>
          </button>
        );
      })}
    </div>
  );
}
