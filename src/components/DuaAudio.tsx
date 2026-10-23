"use client";

import { seek, toggle, toggleLoop, usePlayer } from "@/lib/audio-player";

export default function DuaAudio({ src }: { src: string }) {
  const player = usePlayer();
  const current = player.src === src;
  const playing = current && player.playing;
  const loading = current && player.loading;
  const progress = current ? player.progress : 0;

  return (
    <div className="mt-5 flex items-center gap-3">
      <button
        type="button"
        onClick={() => toggle(src)}
        aria-label={playing ? "Ndalo" : "Dëgjo"}
        className={`flex items-center gap-2.5 rounded-full py-1.5 pr-4 pl-1.5 text-sm font-medium transition-colors ${
          current ? "bg-emerald-deep text-paper" : "bg-emerald-soft text-emerald-deep hover:bg-emerald-deep hover:text-paper"
        }`}
      >
        <span className={`grid size-8 place-items-center rounded-full ${current ? "bg-paper/15" : "bg-emerald-deep text-paper"}`}>
          {loading ? (
            <span className="size-3.5 animate-spin rounded-full border-2 border-current border-t-transparent" />
          ) : playing ? (
            <svg viewBox="0 0 24 24" className="size-3.5" fill="currentColor" aria-hidden>
              <rect x="6" y="5" width="4" height="14" rx="1" />
              <rect x="14" y="5" width="4" height="14" rx="1" />
            </svg>
          ) : (
            <svg viewBox="0 0 24 24" className="ml-0.5 size-3.5" fill="currentColor" aria-hidden>
              <path d="M7 4.5v15a1 1 0 0 0 1.5.9l12-7.5a1 1 0 0 0 0-1.8l-12-7.5A1 1 0 0 0 7 4.5Z" />
            </svg>
          )}
        </span>
        {playing ? "Ndalo" : "Dëgjo"}
      </button>

      <button
        type="button"
        onClick={toggleLoop}
        aria-pressed={player.loop}
        aria-label="Përsërite pa ndërprerje"
        title="Përsërite"
        className={`grid size-9 place-items-center rounded-full border transition-colors ${
          player.loop ? "border-gold bg-gold-soft text-gold" : "border-line text-muted hover:border-gold hover:text-ink"
        }`}
      >
        <svg viewBox="0 0 24 24" className="size-4" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
          <path d="m17 2 4 4-4 4" />
          <path d="M3 11v-1a4 4 0 0 1 4-4h14" />
          <path d="m7 22-4-4 4-4" />
          <path d="M21 13v1a4 4 0 0 1-4 4H3" />
        </svg>
      </button>

      <div
        role="slider"
        tabIndex={current ? 0 : -1}
        aria-label="Pozicioni i audios"
        aria-valuemin={0}
        aria-valuemax={100}
        aria-valuenow={Math.round(progress * 100)}
        onClick={(e) => {
          const r = e.currentTarget.getBoundingClientRect();
          seek(src, Math.min(1, Math.max(0, (e.clientX - r.left) / r.width)));
        }}
        onKeyDown={(e) => {
          if (e.key === "ArrowRight") seek(src, Math.min(1, progress + 0.05));
          if (e.key === "ArrowLeft") seek(src, Math.max(0, progress - 0.05));
        }}
        className={`group relative h-6 flex-1 cursor-pointer transition-opacity ${current ? "opacity-100" : "opacity-0 sm:opacity-40"}`}
      >
        <span className="bg-line absolute inset-x-0 top-1/2 h-1 -translate-y-1/2 rounded-full" />
        <span
          className="bg-emerald-deep absolute top-1/2 left-0 h-1 -translate-y-1/2 rounded-full"
          style={{ width: `${progress * 100}%` }}
        />
      </div>
    </div>
  );
}
