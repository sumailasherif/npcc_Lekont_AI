"use client";

import { useSyncExternalStore } from "react";

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
  // Another tab changed the theme: apply it here too, then refresh the button.
  const onStorage = () => {
    const choice = read();
    if (choice === "system") delete document.documentElement.dataset.theme;
    else document.documentElement.dataset.theme = choice;
    callback();
  };
  listeners.add(callback);
  window.addEventListener("storage", onStorage);
  return () => {
    listeners.delete(callback);
    window.removeEventListener("storage", onStorage);
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

const SUN =
  "M12 4V2m0 20v-2m8-8h2M2 12h2m13.66-5.66 1.41-1.41M4.93 19.07l1.41-1.41m0-11.32L4.93 4.93m14.14 14.14-1.41-1.41M12 17a5 5 0 1 0 0-10 5 5 0 0 0 0 10Z";
const MOON = "M21 12.8A9 9 0 1 1 11.2 3a7 7 0 0 0 9.8 9.8Z";
const DARK_QUERY = "(prefers-color-scheme: dark)";

/** The theme actually on screen: the saved choice, or the device setting when none is saved. */
function readEffective(): "light" | "dark" {
  const choice = read();
  if (choice !== "system") return choice;
  return window.matchMedia(DARK_QUERY).matches ? "dark" : "light";
}

function subscribeEffective(callback: () => void) {
  const media = window.matchMedia(DARK_QUERY);
  media.addEventListener("change", callback);
  const stop = subscribe(callback);
  return () => {
    media.removeEventListener("change", callback);
    stop();
  };
}

/**
 * One quiet light/dark switch. Follows the device until the visitor picks a side;
 * the change is a short cross-fade rather than a wipe.
 */
export function ThemeToggle() {
  const theme = useSyncExternalStore(subscribeEffective, readEffective, () => "light" as const);
  const next = theme === "dark" ? "light" : "dark";
  const label = next === "dark" ? "Switch to dark mode" : "Switch to light mode";

  function toggle() {
    const deviceTheme = window.matchMedia(DARK_QUERY).matches ? "dark" : "light";
    // Picking the device's own theme goes back to following the device.
    const choice: ThemeChoice = next === deviceTheme ? "system" : next;
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const doc = document as Document & { startViewTransition?: (cb: () => void) => unknown };
    if (!reduce && typeof doc.startViewTransition === "function") {
      doc.startViewTransition(() => apply(choice));
      return;
    }
    document.documentElement.classList.add("theme-fade");
    apply(choice);
    window.setTimeout(() => document.documentElement.classList.remove("theme-fade"), 300);
  }

  return (
    <button
      type="button"
      onClick={toggle}
      aria-label={label}
      title={label}
      className="grid h-9 w-9 shrink-0 place-items-center rounded-full border border-white/10 bg-white/5 text-slate-300 backdrop-blur transition hover:border-white/25 hover:text-white"
    >
      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.9" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
        <path d={theme === "dark" ? SUN : MOON} />
      </svg>
    </button>
  );
}
