"use client";

import { useCallback, useState } from "react";
import { ELIFBA, letterForms, type ElifbaLetter } from "@/lib/elifba";
import { learnedStore, shuffle } from "@/lib/learned";
import Sheet from "./Sheet";

const learnedLetters = learnedStore("noor:elifba");

function Check({ className = "size-3" }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" className={className} fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" aria-hidden>
      <path d="m5 12 5 5 9-10" />
    </svg>
  );
}

type Game = "cards" | "start" | "find" | null;

export default function Elifba() {
  const learned = learnedLetters.use();
  const [open, setOpen] = useState<number | null>(null);
  const [game, setGame] = useState<Game>(null);
  const close = useCallback(() => setOpen(null), [setOpen]);
  const closeGame = useCallback(() => setGame(null), [setGame]);
  const done = ELIFBA.filter((l) => learned.includes(l.id)).length;

  return (
    <>
      <div className="border-line bg-card rounded-[2rem] border p-5 sm:p-6">
        <div className="flex flex-wrap items-center gap-x-6 gap-y-4">
          <div className="min-w-48 flex-1">
            <div className="flex items-baseline justify-between text-sm">
              <span className="font-medium">Progresi yt</span>
              <span className="text-muted tabular-nums">
                <span className="text-gold font-serif text-lg">{done}</span> / {ELIFBA.length} shkronja të mësuara
              </span>
            </div>
            <div className="bg-line mt-2 h-2 overflow-hidden rounded-full">
              <div
                className="from-emerald-deep to-gold h-full rounded-full bg-gradient-to-r transition-[width] duration-700"
                style={{ width: `${(done / ELIFBA.length) * 100}%` }}
              />
            </div>
          </div>
          <button
            type="button"
            onClick={() => setGame("cards")}
            className="bg-emerald-deep text-paper flex items-center gap-2 rounded-full px-5 py-2.5 text-sm font-medium transition-opacity hover:opacity-90"
          >
            <svg viewBox="0 0 24 24" className="size-4" fill="none" stroke="currentColor" strokeWidth="2" strokeLinejoin="round" aria-hidden>
              <rect x="3" y="6" width="14" height="14" rx="2" />
              <path d="M7 6V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2v10a2 2 0 0 1-2 2h-2" />
            </svg>
            Mëso me karta
          </button>
        </div>

        <div className="border-line mt-5 grid gap-2 border-t pt-5 sm:grid-cols-2">
          {(
            [
              ["start", "Me çka fillon?", "Shiko figurën, zgjidh shkronjën e parë të fjalës"],
              ["find", "Gjej shkronjën", "Lexo emrin, prek shkronjën e duhur"],
            ] as const
          ).map(([key, title, text]) => (
            <button
              key={key}
              type="button"
              onClick={() => setGame(key)}
              className="group border-line hover:border-gold flex items-center justify-between gap-3 rounded-2xl border px-4 py-3 text-left transition-colors"
            >
              <span>
                <span className="block text-sm font-medium">{title}</span>
                <span className="text-muted block text-xs">{text}</span>
              </span>
              <span className="text-emerald-deep transition-transform group-hover:translate-x-1" aria-hidden>
                →
              </span>
            </button>
          ))}
        </div>
      </div>

      <ul className="mt-6 grid grid-cols-3 gap-3 sm:grid-cols-4 lg:grid-cols-7" dir="rtl">
        {ELIFBA.map((l, i) => {
          const isLearned = learned.includes(l.id);
          return (
            <li key={l.id}>
              <button
                type="button"
                onClick={() => setOpen(i)}
                className={`group bg-card hover:border-gold relative flex h-full w-full flex-col items-center rounded-2xl border px-2 pt-5 pb-4 text-center transition-all hover:-translate-y-0.5 ${
                  isLearned ? "border-emerald-deep/40" : "border-line"
                }`}
              >
                <span className="text-muted absolute top-2.5 right-3 font-serif text-xs tabular-nums">{i + 1}</span>
                {isLearned && (
                  <span className="bg-emerald-soft text-emerald-deep absolute top-2 left-2 grid size-5 place-items-center rounded-full" aria-label="E mësuar">
                    <Check />
                  </span>
                )}
                <span className="arabic text-gold text-[2.6rem] leading-[1.5] transition-transform group-hover:scale-105">{l.char}</span>
                <span className="font-serif text-sm font-semibold" dir="ltr">
                  {l.name}
                </span>
              </button>
            </li>
          );
        })}
      </ul>

      {open !== null && <LetterSheet index={open} onIndex={setOpen} onClose={close} />}
      {game === "cards" && <Cards onClose={closeGame} />}
      {(game === "start" || game === "find") && <Quiz mode={game} onClose={closeGame} />}
    </>
  );
}

function LetterSheet({ index, onIndex, onClose }: { index: number; onIndex: (i: number) => void; onClose: () => void }) {
  const letter = ELIFBA[index];
  const learned = learnedLetters.use().includes(letter.id);
  const prev = ELIFBA[index - 1];
  const next = ELIFBA[index + 1];

  return (
    <Sheet onClose={onClose} label={`Shkronja ${letter.name}`}>
      <p className="text-gold text-xs font-medium tracking-[0.25em] uppercase tabular-nums">
        Shkronja {index + 1} / {ELIFBA.length}
      </p>

      <div className="pattern border-line mt-4 rounded-3xl border px-4 py-6 text-center">
        <p className="arabic text-gold text-7xl leading-[1.6]">{letter.char}</p>
        <h2 className="mt-1 font-serif text-3xl font-semibold">{letter.name}</h2>
        <p className="arabic text-emerald-deep text-xl leading-normal">{letter.nameAr}</p>
      </div>

      <p className="text-ink/90 mt-5 leading-relaxed">
        <span className="text-muted">Si lexohet: </span>
        {letter.sound}
      </p>

      <div className="mt-5">
        <p className="text-muted text-xs">Si shkruhet në fjalë</p>
        <div className="mt-2 grid grid-cols-4 gap-2" dir="rtl">
          {letterForms(letter).map((f) => (
            <div key={f.label} className="border-line rounded-xl border py-2 text-center">
              <span className="arabic text-ink block text-3xl leading-[1.7]">{f.text}</span>
              <span className="text-muted block text-[10px]" dir="ltr">
                {f.label}
              </span>
            </div>
          ))}
        </div>
      </div>

      <div className="mt-5">
        <p className="text-muted text-xs">Fjalë me këtë shkronjë</p>
        <div className="border-line mt-2 flex items-center gap-4 rounded-2xl border p-3">
          <span className="bg-card grid size-14 shrink-0 place-items-center rounded-xl text-3xl" aria-hidden>
            {letter.word.emoji}
          </span>
          <span className="min-w-0 flex-1">
            <span className="block font-medium">{letter.word.meaning}</span>
            <span className="text-muted block text-sm italic">{letter.word.translit}</span>
          </span>
          <span className="arabic text-ink shrink-0 text-3xl leading-[1.7]">{letter.word.text}</span>
        </div>
      </div>

      <button
        type="button"
        onClick={() => learnedLetters.toggle(letter.id)}
        aria-pressed={learned}
        className={`mt-6 flex w-full items-center justify-center gap-2 rounded-full border py-2.5 text-sm font-medium transition-colors ${
          learned ? "border-emerald-deep bg-emerald-soft text-emerald-deep" : "border-line hover:border-gold"
        }`}
      >
        <Check className="size-4" />
        {learned ? "E mësuar" : "Shëno si të mësuar"}
      </button>

      <div className="border-line mt-6 flex items-center justify-between gap-3 border-t pt-5 text-sm">
        <button
          type="button"
          disabled={!prev}
          onClick={() => onIndex(index - 1)}
          className="border-line hover:border-gold rounded-full border px-4 py-2 transition-colors disabled:opacity-30"
        >
          ← {prev?.name ?? ""}
        </button>
        <button
          type="button"
          disabled={!next}
          onClick={() => onIndex(index + 1)}
          className="border-line hover:border-gold rounded-full border px-4 py-2 transition-colors disabled:opacity-30"
        >
          {next?.name ?? ""} →
        </button>
      </div>
    </Sheet>
  );
}

function Cards({ onClose }: { onClose: () => void }) {
  const [deck] = useState(() => shuffle(ELIFBA));
  const [i, setI] = useState(0);
  const [flipped, setFlipped] = useState(false);
  const [known, setKnown] = useState(0);
  const card = deck[i];

  function answer(knows: boolean) {
    if (knows) {
      setKnown((k) => k + 1);
      learnedLetters.add(card.id);
    }
    setFlipped(false);
    setI((x) => x + 1);
  }

  return (
    <Sheet onClose={onClose} label="Mëso me karta">
      <p className="text-gold text-xs font-medium tracking-[0.25em] uppercase">Mëso me karta</p>
      {!card ? (
        <Finish score={known} total={deck.length} action="Mbyll" onAction={onClose} />
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
            aria-label={flipped ? "Fshih emrin" : "Shfaq emrin"}
          >
            <span className={`relative grid h-64 transition-transform duration-500 [transform-style:preserve-3d] ${flipped ? "[transform:rotateY(180deg)]" : ""}`}>
              <span className="pattern border-line absolute inset-0 grid place-items-center rounded-3xl border pb-8 [backface-visibility:hidden]">
                <span className="arabic text-gold text-8xl leading-[1.6]">{card.char}</span>
                <span className="text-muted absolute inset-x-0 bottom-5 text-center text-sm">Shtyp për ta kthyer kartën</span>
              </span>
              <span className="border-gold/50 bg-card absolute inset-0 grid place-items-center rounded-3xl border p-5 [backface-visibility:hidden] [transform:rotateY(180deg)]">
                <span>
                  <span className="block font-serif text-3xl font-semibold">{card.name}</span>
                  <span className="arabic text-emerald-deep block text-xl leading-normal">{card.nameAr}</span>
                  <span className="mt-3 block text-5xl" aria-hidden>
                    {card.word.emoji}
                  </span>
                  <span className="arabic mt-1 block text-2xl leading-normal">{card.word.text}</span>
                  <span className="text-muted block text-sm">{card.word.meaning}</span>
                </span>
              </span>
            </span>
          </button>

          <div className={`mt-5 grid grid-cols-2 gap-3 transition-opacity ${flipped ? "opacity-100" : "pointer-events-none opacity-0"}`}>
            <button
              type="button"
              tabIndex={flipped ? 0 : -1}
              onClick={() => answer(false)}
              className="border-line hover:border-gold rounded-full border py-3 text-sm font-medium transition-colors"
            >
              Ende jo
            </button>
            <button
              type="button"
              tabIndex={flipped ? 0 : -1}
              onClick={() => answer(true)}
              className="bg-emerald-deep text-paper rounded-full py-3 text-sm font-medium transition-opacity hover:opacity-90"
            >
              E dija
            </button>
          </div>
        </>
      )}
    </Sheet>
  );
}

type Question = { letter: ElifbaLetter; options: ElifbaLetter[] };

function makeQuestions(mode: "start" | "find", rounds = 10): Question[] {
  return shuffle(ELIFBA)
    .slice(0, rounds)
    .map((letter) => ({
      letter,
      options: shuffle([letter, ...shuffle(ELIFBA.filter((l) => l.id !== letter.id)).slice(0, mode === "start" ? 3 : 5)]),
    }));
}

function Quiz({ mode, onClose }: { mode: "start" | "find"; onClose: () => void }) {
  const [questions, setQuestions] = useState(() => makeQuestions(mode));
  const [i, setI] = useState(0);
  const [picked, setPicked] = useState<string | null>(null);
  const [score, setScore] = useState(0);
  const q = questions[i];
  const title = mode === "start" ? "Me çka fillon?" : "Gjej shkronjën";

  function pick(l: ElifbaLetter) {
    if (picked) return;
    setPicked(l.id);
    if (l.id === q.letter.id) {
      setScore((s) => s + 1);
      learnedLetters.add(q.letter.id);
    }
  }

  function again() {
    setQuestions(makeQuestions(mode));
    setI(0);
    setScore(0);
    setPicked(null);
  }

  const correct = picked !== null && picked === q?.letter.id;

  return (
    <Sheet onClose={onClose} label={title}>
      <p className="text-gold text-xs font-medium tracking-[0.25em] uppercase">{title}</p>
      {!q ? (
        <Finish score={score} total={questions.length} action="Luaj sërish" onAction={again} />
      ) : (
        <>
          <div className="text-muted mt-2 flex justify-between text-xs tabular-nums">
            <span>
              Pyetja {i + 1} / {questions.length}
            </span>
            <span>{score} të sakta</span>
          </div>
          <div className="bg-line mt-2 h-1 overflow-hidden rounded-full">
            <div className="bg-gold h-full transition-[width] duration-500" style={{ width: `${(i / questions.length) * 100}%` }} />
          </div>

          <div className="pattern border-line mt-5 rounded-3xl border px-4 py-6 text-center">
            {mode === "start" ? (
              <>
                <span key={q.letter.id} className="animate-pop block text-6xl" aria-hidden>
                  {q.letter.word.emoji}
                </span>
                <p className="mt-3 text-lg font-medium">{q.letter.word.meaning}</p>
                <p className="text-muted text-sm italic">{q.letter.word.translit}</p>
                {picked && <p className="arabic text-ink mt-1 text-3xl leading-normal">{q.letter.word.text}</p>}
              </>
            ) : (
              <>
                <p className="text-muted text-sm">Ku është shkronja</p>
                <p className="mt-1 font-serif text-4xl font-semibold">{q.letter.name}</p>
                <p className="arabic text-emerald-deep text-xl leading-normal">{q.letter.nameAr}</p>
              </>
            )}
          </div>

          <div className={`mt-4 grid gap-2 ${mode === "start" ? "grid-cols-2" : "grid-cols-3"}`} dir="rtl">
            {q.options.map((l) => {
              const state = !picked ? "idle" : l.id === q.letter.id ? "right" : l.id === picked ? "wrong" : "dim";
              return (
                <button
                  key={l.id}
                  type="button"
                  onClick={() => pick(l)}
                  className={`arabic h-20 rounded-2xl border text-4xl leading-[1.6] transition-all ${
                    state === "right"
                      ? "animate-pop border-emerald-deep bg-emerald-soft text-emerald-deep"
                      : state === "wrong"
                        ? "animate-shake border-[#e08a8a]/70 text-[#e08a8a]"
                        : state === "dim"
                          ? "border-line text-muted opacity-40"
                          : "border-line bg-card text-gold hover:border-gold active:scale-95"
                  }`}
                >
                  {l.char}
                </button>
              );
            })}
          </div>

          <div className={`mt-4 flex items-center justify-between gap-3 transition-opacity ${picked ? "opacity-100" : "pointer-events-none opacity-0"}`}>
            <p className={`text-sm font-medium ${correct ? "text-emerald-deep" : "text-[#e08a8a]"}`}>
              {correct ? "Saktë!" : `Ishte ${q.letter.name}`}
            </p>
            <button
              type="button"
              onClick={() => {
                setPicked(null);
                setI((n) => n + 1);
              }}
              tabIndex={picked ? 0 : -1}
              className="bg-emerald-deep text-paper rounded-full px-6 py-2.5 text-sm font-medium transition-opacity hover:opacity-90"
            >
              {i + 1 < questions.length ? "Vazhdo →" : "Shiko rezultatin"}
            </button>
          </div>
        </>
      )}
    </Sheet>
  );
}

function Finish({ score, total, action, onAction }: { score: number; total: number; action: string; onAction: () => void }) {
  const ratio = total ? score / total : 0;
  return (
    <div className="py-10 text-center">
      <p className="text-gold font-serif text-5xl font-semibold tabular-nums">
        {score}
        <span className="text-muted text-2xl"> / {total}</span>
      </p>
      <p className="text-muted mt-3">
        {ratio === 1 ? "Të gjitha saktë." : ratio >= 0.6 ? "Shumë mirë, edhe pak." : "Provo sërish, çdo herë del më mirë."}
      </p>
      <button
        type="button"
        onClick={onAction}
        className="bg-emerald-deep text-paper mt-6 rounded-full px-6 py-2.5 text-sm font-medium transition-opacity hover:opacity-90"
      >
        {action}
      </button>
    </div>
  );
}
