"use client";

import { useEffect, useState } from "react";

type Status = { done: number; total: number; running: boolean; failed?: number };

export default function OfflineStatus({ className = "" }: { className?: string }) {
  const [ready, setReady] = useState(false);
  const [status, setStatus] = useState<Status | null>(null);

  useEffect(() => {
    if (!("serviceWorker" in navigator)) return;
    const onMessage = (e: MessageEvent) => {
      if (e.data?.type !== "noor:offline") return;
      setStatus({ done: e.data.done, total: e.data.total, running: e.data.running, failed: e.data.failed });
    };
    navigator.serviceWorker.addEventListener("message", onMessage);
    navigator.serviceWorker.ready.then((reg) => {
      setReady(true);
      reg.active?.postMessage("noor:offline-status");
    });
    return () => navigator.serviceWorker.removeEventListener("message", onMessage);
  }, []);

  if (!ready) return null;

  async function download() {
    await navigator.storage?.persist?.().catch(() => false);
    const reg = await navigator.serviceWorker.ready;
    setStatus((s) => (s ? { ...s, running: true } : s));
    reg.active?.postMessage("noor:offline-download");
  }

  const complete = status && status.total > 0 && status.done >= status.total;
  const percent = status && status.total ? Math.round((status.done / status.total) * 100) : 0;

  return (
    <div className={`border-line bg-card rounded-2xl border p-4 text-sm ${className}`}>
      <p className="flex items-center gap-2 font-medium">
        <span className="bg-emerald-deep size-2 rounded-full" aria-hidden />
        Noor punon edhe pa internet
      </p>
      <p className="text-muted mt-1 text-xs leading-relaxed">
        Kurani, hadithet, Mburoja dhe Rijadus Salihini janë ruajtur në pajisje.
      </p>

      {complete ? (
        <p className="text-emerald-deep mt-3 text-xs font-medium">Audio e lutjeve dhe Mushafi janë ruajtur ✓</p>
      ) : status?.running ? (
        <div className="mt-3">
          <div className="text-muted flex justify-between text-xs tabular-nums">
            <span>Duke shkarkuar audion dhe Mushafin…</span>
            <span>{percent}%</span>
          </div>
          <div className="bg-line mt-1.5 h-1.5 overflow-hidden rounded-full">
            <div className="bg-emerald-deep h-full rounded-full transition-[width] duration-300" style={{ width: `${percent}%` }} />
          </div>
        </div>
      ) : (
        <button
          type="button"
          onClick={download}
          className="border-gold/50 text-gold hover:bg-gold-soft mt-3 w-full rounded-full border px-4 py-2 text-xs font-medium transition-colors"
        >
          {status && status.done > 0 ? `Vazhdo shkarkimin (${percent}%)` : "Shkarko audion dhe Mushafin · ~63 MB"}
        </button>
      )}
      {status?.failed ? (
        <p className="text-muted mt-2 text-xs">{status.failed} skedarë nuk u shkarkuan. Provo sërish kur të kesh internet.</p>
      ) : null}
    </div>
  );
}
