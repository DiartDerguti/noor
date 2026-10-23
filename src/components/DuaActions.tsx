"use client";

import { useState } from "react";
import { playAll, usePlayer } from "@/lib/audio-player";
import { cycleTextSize, toggleFavorite, useFavorites, useTextSize } from "@/lib/hisn-client";

const round =
  "grid size-10 place-items-center rounded-full border border-line bg-card text-muted transition-colors hover:border-gold hover:text-ink";

export function TextSizeButton() {
  const size = useTextSize();
  return (
    <button
      type="button"
      onClick={cycleTextSize}
      aria-label={`Madhësia e tekstit: ${size + 1} nga 4`}
      title="Madhësia e tekstit"
      className={`${round} font-serif`}
    >
      <span className="flex items-end leading-none font-semibold">
        <span className="text-sm">A</span>
        <span className="text-[10px]">a</span>
      </span>
    </button>
  );
}

export default function DuaActions({
  n,
  title,
  url,
  text,
  audio,
}: {
  n: number;
  title: string;
  url: string;
  text: string;
  audio: string[];
}) {
  const favs = useFavorites();
  const fav = favs.includes(n);
  const player = usePlayer();
  const [toast, setToast] = useState<string | null>(null);
  const allPlaying = player.playlist?.[0] === audio[0] && (player.playing || player.loading);

  function notify(message: string) {
    setToast(message);
    setTimeout(() => setToast(null), 2200);
  }

  async function share() {
    if (navigator.share) {
      try {
        await navigator.share({ title, text: text.slice(0, 600), url });
        return;
      } catch (e) {
        if ((e as Error).name === "AbortError") return;
      }
    }
    try {
      await navigator.clipboard.writeText(text);
      notify("Duaja u kopjua");
    } catch {}
  }

  return (
    <div className="relative flex shrink-0 items-center gap-2">
      {audio.length > 1 && (
        <button
          type="button"
          onClick={() => playAll(audio)}
          className={`hidden h-10 items-center gap-2 rounded-full border px-4 text-sm transition-colors sm:flex ${
            allPlaying ? "border-emerald-deep bg-emerald-soft text-emerald-deep" : "border-line bg-card text-muted hover:border-gold hover:text-ink"
          }`}
        >
          <svg viewBox="0 0 24 24" className="size-3.5" fill="currentColor" aria-hidden>
            {allPlaying ? (
              <rect x="6" y="6" width="12" height="12" rx="1.5" />
            ) : (
              <path d="M7 4.5v15a1 1 0 0 0 1.5.9l12-7.5a1 1 0 0 0 0-1.8l-12-7.5A1 1 0 0 0 7 4.5Z" />
            )}
          </svg>
          {allPlaying ? "Ndalo" : `Dëgjo të gjitha (${audio.length})`}
        </button>
      )}
      <span className="lg:hidden">
        <TextSizeButton />
      </span>
      <button type="button" onClick={share} aria-label="Shpërndaje" title="Shpërndaje" className={round}>
        <svg viewBox="0 0 24 24" className="size-4" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
          <circle cx="18" cy="5" r="3" />
          <circle cx="6" cy="12" r="3" />
          <circle cx="18" cy="19" r="3" />
          <path d="m8.6 13.5 6.8 4M15.4 6.5l-6.8 4" />
        </svg>
      </button>
      <button
        type="button"
        onClick={() => {
          toggleFavorite(n);
          notify(fav ? "U hoq nga favoritet" : "U shtua te favoritet");
        }}
        aria-pressed={fav}
        aria-label={fav ? "Hiqe nga favoritet" : "Shtoje te favoritet"}
        title={fav ? "Hiqe nga favoritet" : "Shtoje te favoritet"}
        className={`${round} ${fav ? "!border-gold/70 !text-gold" : ""}`}
      >
        <svg
          viewBox="0 0 24 24"
          className={`size-4 transition-transform ${fav ? "scale-110" : ""}`}
          fill={fav ? "currentColor" : "none"}
          stroke="currentColor"
          strokeWidth="2"
          strokeLinejoin="round"
          aria-hidden
        >
          <path d="M12 21s-7.5-4.6-9.5-9.2C1 8.3 3.3 4.5 7 4.5c2 0 3.5 1 5 2.8 1.5-1.8 3-2.8 5-2.8 3.7 0 6 3.8 4.5 7.3C19.5 16.4 12 21 12 21Z" />
        </svg>
      </button>

      <span
        role="status"
        className={`bg-ink text-paper pointer-events-none absolute top-full right-0 z-10 mt-2 rounded-full px-3 py-1.5 text-xs font-medium whitespace-nowrap shadow-lg transition-all duration-300 ${
          toast ? "translate-y-0 opacity-100" : "-translate-y-1 opacity-0"
        }`}
      >
        {toast}
      </span>
    </div>
  );
}
