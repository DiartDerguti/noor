"use client";

import { OPEN_NAV_EVENT } from "./ReaderSidebar";

export default function OpenNavButton({ label, position }: { label: string; position: string }) {
  return (
    <button
      type="button"
      onClick={() => window.dispatchEvent(new Event(OPEN_NAV_EVENT))}
      className="flex min-w-0 flex-1 flex-col items-center rounded-2xl border border-line bg-card px-3 py-1.5 transition-colors hover:border-gold"
    >
      <span className="flex max-w-full items-center gap-1.5 truncate text-sm font-medium">
        {label}
        <span className="text-xs text-muted">▾</span>
      </span>
      <span className="max-w-full truncate text-xs text-muted">{position}</span>
    </button>
  );
}
