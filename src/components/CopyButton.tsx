"use client";

import { useState } from "react";

export default function CopyButton({ text, label = "Kopjo" }: { text: string; label?: string }) {
  const [copied, setCopied] = useState(false);

  async function copy(e: React.MouseEvent) {
    e.preventDefault();
    e.stopPropagation();
    try {
      await navigator.clipboard.writeText(text);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {}
  }

  return (
    <button
      type="button"
      onClick={copy}
      aria-label={copied ? "U kopjua" : label}
      title={copied ? "U kopjua" : label}
      className={`grid size-8 shrink-0 place-items-center rounded-full border transition-colors ${
        copied ? "border-emerald-deep/60 text-emerald-deep" : "border-transparent text-muted hover:border-line hover:text-ink"
      }`}
    >
      <svg
        viewBox="0 0 24 24"
        className="size-4"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
        aria-hidden
      >
        {copied ? (
          <path d="m5 12 5 5 9-10" />
        ) : (
          <>
            <rect x="9" y="9" width="11" height="11" rx="2" />
            <path d="M5 15V6a2 2 0 0 1 2-2h9" />
          </>
        )}
      </svg>
    </button>
  );
}
