"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import type { AllahName } from "@/lib/names";
import { fold } from "@/lib/hisn-client";
import CopyButton from "./CopyButton";
import Sheet from "./Sheet";
import { learnedStore, shuffle } from "@/lib/learned";

const learnedNames = learnedStore("noor:emrat-learned");
const toggleLearned = (n: number) => learnedNames.toggle(String(n));


type Filter = "all" | "learned" | "new";

export default function NamesExplorer({ names }: { names: AllahName[] }) {
  const learned = learnedNames.use();
  const [query, setQuery] = useState("");
  const [filter, setFilter] = useState<Filter>("all");
  const [open, setOpen] = useState<number | null>(null);
  const [cards, setCards] = useState(false);
  const closeCards = useCallback(() => setCards(false), []);

  const show = useCallback((n: number | null) => {
    setOpen(n);
    history.replaceState(null, "", n ? `#${n}` : location.pathname);
  }, []);

  useEffect(() => {
    const n = Number(location.hash.slice(1));
    if (n >= 1 && n <= names.length) requestAnimationFrame(() => setOpen(n));
  }, [names.length]);

  const list = useMemo(() => {
    const q = fold(query.trim());
    return names.filter((x) => {
      if (filter === "learned" && !learned.includes(String(x.n))) return false;
      if (filter === "new" && learned.includes(String(x.n))) return false;
      if (!q) return true;
      return String(x.n) === q || fold(`${x.name} ${x.meaning}`).includes(q) || x.arabic.includes(query.trim());
    });
  }, [names, query, filter, learned]);

  const done = learned.length;

  return (
    <>
      <div className="border-line bg-card rounded-[2rem] border p-5 sm:p-6">
        <div className="flex flex-wrap items-center gap-x-6 gap-y-4">
          <div className="min-w-48 flex-1">
            <div className="flex items-baseline justify-between text-sm">
              <span className="font-medium">Progresi yt</span>
              <span className="text-muted tabular-nums">
                <span className="text-gold font-serif text-lg">{done}</span> / {names.length} të mësuar
              </span>
            </div>
            <div className="bg-line mt-2 h-2 overflow-hidden rounded-full">
              <div
                className="from-emerald-deep to-gold h-full rounded-full bg-gradient-to-r transition-[width] duration-700"
                style={{ width: `${(done / names.length) * 100}%` }}
              />
            </div>
          </div>
          <button
            type="button"
            onClick={() => setCards(true)}
            className="bg-emerald-deep text-paper flex items-center gap-2 rounded-full px-5 py-2.5 text-sm font-medium transition-opacity hover:opacity-90"
          >
            <svg viewBox="0 0 24 24" className="size-4" fill="none" stroke="currentColor" strokeWidth="2" strokeLinejoin="round" aria-hidden>
              <rect x="3" y="6" width="14" height="14" rx="2" />
              <path d="M7 6V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2v10a2 2 0 0 1-2 2h-2" />
            </svg>
            Mëso me karta
          </button>
        </div>

        <div className="mt-5 flex flex-col gap-3 sm:flex-row">
          <input
            type="search"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Kërko sipas emrit, kuptimit ose numrit..."
            className="border-line bg-paper/60 placeholder:text-muted focus:border-gold flex-1 rounded-2xl border px-4 py-3 text-sm outline-none"
          />
          <div className="border-line bg-paper/60 grid grid-cols-3 gap-1 rounded-2xl border p-1 text-sm">
            {(
              [
                ["all", "Të gjitha"],
                ["new", "Pa mësuar"],
                ["learned", "Të mësuara"],
              ] as const
            ).map(([key, label]) => (
              <button
                key={key}
                type="button"
                onClick={() => setFilter(key)}
                className={`rounded-xl px-3 py-2 whitespace-nowrap transition-colors ${
                  filter === key ? "bg-emerald-deep text-paper font-medium" : "text-muted hover:text-ink"
                }`}
              >
                {label}
              </button>
            ))}
          </div>
        </div>
      </div>

      <ul className="mt-6 grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-4">
        {list.map((x) => {
          const isLearned = learned.includes(String(x.n));
          return (
            <li key={x.n}>
              <button
                type="button"
                onClick={() => show(x.n)}
                className={`group bg-card hover:border-gold relative flex h-full w-full flex-col items-center rounded-2xl border px-3 pt-4 pb-5 text-center transition-all hover:-translate-y-0.5 ${
                  isLearned ? "border-emerald-deep/40" : "border-line"
                }`}
              >
                <span className="text-muted absolute top-3 left-3.5 font-serif text-xs tabular-nums">{x.n}</span>
                {isLearned && (
                  <span className="bg-emerald-soft text-emerald-deep absolute top-2.5 right-2.5 grid size-5 place-items-center rounded-full" aria-label="E mësuar">
                    <svg viewBox="0 0 24 24" className="size-3" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" aria-hidden>
                      <path d="m5 12 5 5 9-10" />
                    </svg>
                  </span>
                )}
                <span className="arabic text-gold mt-3 text-[2.1rem] leading-[1.6] transition-transform group-hover:scale-105">
                  {x.arabic}
                </span>
                <span className="mt-1 font-serif text-base font-semibold">{x.name}</span>
                <span className="text-muted mt-0.5 text-[13px] leading-snug">{x.meaning}</span>
              </button>
            </li>
          );
        })}
      </ul>

      {list.length === 0 && (
        <p className="border-line text-muted mt-6 rounded-2xl border border-dashed p-8 text-center">
          {filter === "learned" && !query
            ? "Ende nuk ke shënuar asnjë emër si të mësuar."
            : "Nuk u gjet asnjë emër. Provo një fjalë tjetër."}
        </p>
      )}

      {open !== null && <NameDialog names={names} n={open} learned={learned} onChange={show} />}
      {cards && <Flashcards names={names} learned={learned} onClose={closeCards} />}
    </>
  );
}

function NameDialog({
  names,
  n,
  learned,
  onChange,
}: {
  names: AllahName[];
  n: number;
  learned: string[];
  onChange: (n: number | null) => void;
}) {
  const x = names[n - 1];
  const close = useCallback(() => onChange(null), [onChange]);
  const isLearned = learned.includes(String(n));

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "ArrowRight" && n < names.length) onChange(n + 1);
      if (e.key === "ArrowLeft" && n > 1) onChange(n - 1);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [n, names.length, onChange]);

  return (
    <Sheet onClose={close} label={x.name}>
      <p className="text-gold text-xs font-medium tracking-[0.25em] uppercase tabular-nums">
        Emri {n} / {names.length}
      </p>
      <div className="pattern border-line mt-4 rounded-3xl border px-4 py-6 text-center">
        <p className="arabic text-gold text-6xl leading-[1.7]">{x.arabic}</p>
        <h2 className="mt-1 font-serif text-3xl font-semibold">{x.name}</h2>
        <p className="text-emerald-deep mt-1 font-medium">{x.meaning}</p>
      </div>
      <p className="text-ink/90 mt-5 leading-relaxed">{x.text}</p>

      <div className="mt-6 flex items-center gap-2">
        <button
          type="button"
          onClick={() => toggleLearned(n)}
          aria-pressed={isLearned}
          className={`flex flex-1 items-center justify-center gap-2 rounded-full border py-2.5 text-sm font-medium transition-colors ${
            isLearned ? "border-emerald-deep bg-emerald-soft text-emerald-deep" : "border-line hover:border-gold"
          }`}
        >
          <svg viewBox="0 0 24 24" className="size-4" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" aria-hidden>
            <path d="m5 12 5 5 9-10" />
          </svg>
          {isLearned ? "E mësuar" : "Shëno si të mësuar"}
        </button>
        <CopyButton label="Kopjo emrin" text={`${x.arabic}\n${x.name} – ${x.meaning}\n\n${x.text}`} />
      </div>

      <div className="border-line mt-6 flex items-center justify-between gap-3 border-t pt-5 text-sm">
        <button
          type="button"
          disabled={n === 1}
          onClick={() => onChange(n - 1)}
          className="border-line hover:border-gold rounded-full border px-4 py-2 transition-colors disabled:opacity-30"
        >
          ← {n > 1 ? names[n - 2].name : ""}
        </button>
        <button
          type="button"
          disabled={n === names.length}
          onClick={() => onChange(n + 1)}
          className="border-line hover:border-gold rounded-full border px-4 py-2 transition-colors disabled:opacity-30"
        >
          {n < names.length ? names[n].name : ""} →
        </button>
      </div>
    </Sheet>
  );
}

function Flashcards({ names, learned, onClose }: { names: AllahName[]; learned: string[]; onClose: () => void }) {
  const [deck] = useState(() => {
    const fresh = names.filter((x) => !learned.includes(String(x.n)));
    return shuffle(fresh.length ? fresh : names);
  });
  const [i, setI] = useState(0);
  const [flipped, setFlipped] = useState(false);
  const [known, setKnown] = useState(0);
  const card = deck[i];
  const finished = i >= deck.length;

  function answer(knows: boolean) {
    if (knows) {
      setKnown((k) => k + 1);
      if (!learned.includes(String(card.n))) toggleLearned(card.n);
    }
    setFlipped(false);
    setI((x) => x + 1);
  }

  return (
    <Sheet onClose={onClose} label="Mëso me karta">
      <p className="text-gold text-xs font-medium tracking-[0.25em] uppercase">Mëso me karta</p>
      {finished ? (
        <div className="py-10 text-center">
          <p className="arabic text-gold text-4xl">مَا شَاءَ ٱللَّٰهُ</p>
          <p className="mt-3 font-serif text-2xl font-semibold">
            {known} nga {deck.length}
          </p>
          <p className="text-muted mt-2">emra i dije në këtë raund.</p>
          <button
            type="button"
            onClick={onClose}
            className="bg-emerald-deep text-paper mt-6 rounded-full px-6 py-2.5 text-sm font-medium"
          >
            Mbyll
          </button>
        </div>
      ) : (
        <>
          <div className="text-muted mt-2 flex justify-between text-xs tabular-nums">
            <span>
              Karta {i + 1} / {deck.length}
            </span>
            <span>{known} të ditura</span>
          </div>
          <div className="bg-line mt-2 h-1 overflow-hidden rounded-full">
            <div className="bg-gold h-full transition-[width] duration-500" style={{ width: `${(i / deck.length) * 100}%` }} />
          </div>

          <button
            type="button"
            onClick={() => setFlipped((f) => !f)}
            className="mt-5 block w-full [perspective:1000px]"
            aria-label={flipped ? "Fshih kuptimin" : "Shfaq kuptimin"}
          >
            <span
              className={`relative grid h-64 transition-transform duration-500 [transform-style:preserve-3d] ${flipped ? "[transform:rotateY(180deg)]" : ""}`}
            >
              <span className="pattern border-line absolute inset-0 grid place-items-center rounded-3xl border [backface-visibility:hidden]">
                <span>
                  <span className="arabic text-gold block text-6xl leading-[1.7]">{card.arabic}</span>
                  <span className="text-muted mt-2 block text-sm">Shtyp për ta kthyer kartën</span>
                </span>
              </span>
              <span className="border-gold/50 bg-card absolute inset-0 grid place-items-center overflow-y-auto rounded-3xl border p-5 [backface-visibility:hidden] [transform:rotateY(180deg)]">
                <span>
                  <span className="block font-serif text-2xl font-semibold">{card.name}</span>
                  <span className="text-emerald-deep mt-1 block font-medium">{card.meaning}</span>
                  <span className="text-muted mt-3 block text-sm leading-relaxed">{card.text}</span>
                </span>
              </span>
            </span>
          </button>

          <div className={`mt-5 grid grid-cols-2 gap-3 transition-opacity ${flipped ? "opacity-100" : "pointer-events-none opacity-0"}`}>
            <button
              type="button"
              onClick={() => answer(false)}
              tabIndex={flipped ? 0 : -1}
              className="border-line hover:border-gold rounded-full border py-3 text-sm font-medium transition-colors"
            >
              Ende jo
            </button>
            <button
              type="button"
              onClick={() => answer(true)}
              tabIndex={flipped ? 0 : -1}
              className="bg-emerald-deep text-paper rounded-full py-3 text-sm font-medium transition-opacity hover:opacity-90"
            >
              E dija ✓
            </button>
          </div>
        </>
      )}
    </Sheet>
  );
}
