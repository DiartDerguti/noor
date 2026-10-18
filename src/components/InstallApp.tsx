"use client";

import { useEffect, useState, useSyncExternalStore } from "react";

type InstallEvent = Event & {
  prompt: () => Promise<void>;
  userChoice: Promise<{ outcome: string }>;
};

let deferred: InstallEvent | null = null;
const listeners = new Set<() => void>();

if (typeof window !== "undefined") {
  window.addEventListener("beforeinstallprompt", (e) => {
    e.preventDefault();
    deferred = e as InstallEvent;
    listeners.forEach((l) => l());
  });
  window.addEventListener("appinstalled", () => {
    deferred = null;
    listeners.forEach((l) => l());
  });
}

function subscribe(l: () => void) {
  listeners.add(l);
  return () => listeners.delete(l);
}

function platform() {
  if (window.matchMedia("(display-mode: standalone)").matches)
    return "installed";
  if (/iphone|ipad|ipod/i.test(navigator.userAgent)) return "ios";
  return deferred ? "prompt" : "none";
}

export function RegisterServiceWorker() {
  useEffect(() => {
    if ("serviceWorker" in navigator && process.env.NODE_ENV === "production") {
      navigator.serviceWorker.register("/sw.js").catch(() => {});
    }
  }, []);
  return null;
}

export default function InstallApp({ className = "" }: { className?: string }) {
  const mode = useSyncExternalStore(subscribe, platform, () => "none");
  const [help, setHelp] = useState(false);

  if (mode === "installed" || mode === "none") return null;

  async function install() {
    if (mode === "ios") {
      setHelp((h) => !h);
      return;
    }
    if (!deferred) return;
    await deferred.prompt();
    await deferred.userChoice;
    deferred = null;
    listeners.forEach((l) => l());
  }

  return (
    <div className={className}>
      <button
        type="button"
        onClick={install}
        className="border-gold/50 bg-gold-soft text-gold hover:border-gold inline-flex items-center gap-2 rounded-full border px-4 py-2 text-sm font-medium transition-colors"
      >
        <svg
          viewBox="0 0 24 24"
          className="size-4"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          aria-hidden
        >
          <path d="M12 3v12m0 0-4-4m4 4 4-4M5 21h14" />
        </svg>
        Shkarko aplikacionin
      </button>
      {help && (
        <ol className="border-line bg-card text-muted mt-3 max-w-xs space-y-1.5 rounded-2xl border p-4 text-sm">
          <li>
            1. Shtyp butonin <span className="text-ink">Share</span> poshtë në
            Safari
          </li>
          <li>
            2. Zgjidh <span className="text-ink">Add to Home Screen</span>
          </li>
          <li>
            3. Shtyp <span className="text-ink">Add</span>. Noor del si
            aplikacion në ekran.
          </li>
        </ol>
      )}
    </div>
  );
}
