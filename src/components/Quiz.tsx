"use client";

import Link from "next/link";
import { useCallback, useEffect, useState, useSyncExternalStore } from "react";
import { SOURCE_LABEL, type Source } from "@/lib/hadith";
import { revelationLabel, type SurahMeta } from "@/lib/quran";
import Icon3D from "./Icon3D";

export type QuizHadith = { id: string; title: string; source: Source };

type Question = {
  kind: string;
  prompt: string;
  detail?: string;
  options: string[];
  answer: string;
  link: { href: string; label: string };
};

const LENGTH = 10;
const LETTERS = ["A", "B", "C", "D"];
const BEST_KEY = "noor:quiz-best";
const bestListeners = new Set<() => void>();

function readBest() {
  try {
    return Number(localStorage.getItem(BEST_KEY)) || 0;
  } catch {
    return 0;
  }
}

function saveBest(score: number) {
  try {
    if (score > readBest()) localStorage.setItem(BEST_KEY, String(score));
  } catch {}
  bestListeners.forEach((l) => l());
}

function pick<T>(list: T[]) {
  return list[Math.floor(Math.random() * list.length)];
}

function shuffle<T>(list: T[]) {
  const copy = [...list];
  for (let i = copy.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [copy[i], copy[j]] = [copy[j], copy[i]];
  }
  return copy;
}

function withDistractors(answer: string, pool: string[]) {
  const others = shuffle([...new Set(pool)].filter((o) => o !== answer)).slice(0, 3);
  return shuffle([answer, ...others]);
}

function buildQuestions(surahs: SurahMeta[], hadiths: QuizHadith[]): Question[] {
  const makers: (() => Question)[] = [
    () => {
      const s = pick(surahs);
      return {
        kind: "Kurani · Numri i ajeteve",
        prompt: `Sa ajete ka sureja ${s.englishName}?`,
        options: withDistractors(
          String(s.numberOfAyahs),
          surahs.map((x) => String(x.numberOfAyahs)),
        ),
        answer: String(s.numberOfAyahs),
        link: { href: `/kurani/${s.number}`, label: `Lexo suren ${s.englishName}` },
      };
    },
    () => {
      const s = pick(surahs);
      return {
        kind: "Kurani · Vendi i shpalljes",
        prompt: `Ku është shpallur sureja ${s.englishName}?`,
        options: ["Mekë", "Medinë"],
        answer: revelationLabel(s.revelationType),
        link: { href: `/kurani/${s.number}`, label: `Lexo suren ${s.englishName}` },
      };
    },
    () => {
      const s = pick(surahs);
      return {
        kind: "Kurani · Renditja",
        prompt: `Cila është sureja e ${s.number}-të në Kuran?`,
        options: withDistractors(
          s.englishName,
          surahs.map((x) => x.englishName),
        ),
        answer: s.englishName,
        link: { href: `/kurani/${s.number}`, label: `Lexo suren ${s.englishName}` },
      };
    },
  ];

  if (hadiths.length > 0) {
    makers.push(() => {
      const h = pick(hadiths);
      return {
        kind: "Hadith · Transmetuesi",
        prompt: "Kush e transmeton këtë hadith?",
        detail: h.title,
        options: Object.values(SOURCE_LABEL),
        answer: SOURCE_LABEL[h.source],
        link: { href: `/hadithe/${h.id}`, label: "Lexo hadithin me shpjegim" },
      };
    });
  }

  const questions: Question[] = [];
  const seen = new Set<string>();
  while (questions.length < LENGTH) {
    const q = pick(makers)();
    const key = q.prompt + (q.detail ?? "");
    if (seen.has(key)) continue;
    seen.add(key);
    questions.push(q);
  }
  return questions;
}

function verdict(score: number) {
  if (score === LENGTH) return "MashaAllah, të gjitha saktë!";
  if (score >= 7) return "Shumë mirë. Edhe pak dhe i ke të gjitha.";
  if (score >= 4) return "Mirë. Çdo gabim është një mësim i ri.";
  return "Fillim i mirë. Lexo pak dhe provo përsëri.";
}

export default function Quiz({ surahs, hadiths }: { surahs: SurahMeta[]; hadiths: QuizHadith[] }) {
  const [questions, setQuestions] = useState<Question[] | null>(null);
  const [answers, setAnswers] = useState<string[]>([]);
  const [chosen, setChosen] = useState<string | null>(null);
  const best = useSyncExternalStore(
    (l) => {
      bestListeners.add(l);
      return () => bestListeners.delete(l);
    },
    readBest,
    () => 0,
  );

  const index = answers.length - (chosen === null ? 0 : 1);
  const q = questions?.[index];
  const finished = questions !== null && answers.length === LENGTH && chosen === null;
  const score = questions ? answers.filter((a, i) => a === questions[i].answer).length : 0;

  function start() {
    setQuestions(buildQuestions(surahs, hadiths));
    setAnswers([]);
    setChosen(null);
  }

  const choose = useCallback(
    (option: string) => {
      if (!q || chosen !== null) return;
      setChosen(option);
      setAnswers((a) => [...a, option]);
    },
    [q, chosen],
  );

  const next = useCallback(() => {
    if (chosen === null || !questions) return;
    setChosen(null);
    if (answers.length === LENGTH) {
      saveBest(answers.filter((a, i) => a === questions[i].answer).length);
    }
  }, [chosen, answers, questions]);

  useEffect(() => {
    function onKey(e: KeyboardEvent) {
      if (!q) return;
      if (chosen !== null && (e.key === "Enter" || e.key === " ")) {
        e.preventDefault();
        next();
        return;
      }
      const i = /^[1-4]$/.test(e.key) ? Number(e.key) - 1 : LETTERS.indexOf(e.key.toUpperCase());
      if (i >= 0 && i < q.options.length) choose(q.options[i]);
    }
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [q, chosen, choose, next]);

  const card = "rounded-[2rem] border border-line bg-card p-6 sm:p-10";
  const primary =
    "rounded-full bg-emerald-deep px-7 py-3 font-medium text-paper transition-opacity hover:opacity-90";

  if (!questions) {
    return (
      <div className={`${card} flex flex-col items-center text-center`}>
        <Icon3D name="cap" className="size-24" />
        <h2 className="mt-6 font-serif text-3xl font-semibold">Gati për {LENGTH} pyetje?</h2>
        <p className="mt-3 max-w-md text-muted">
          Pyetje të shkurtra për suret e Kuranit dhe hadithet e Buhariut e Muslimit. Çdo raund ka pyetje të reja.
        </p>
        {best > 0 && (
          <p className="mt-5 rounded-full border border-gold/40 bg-gold-soft px-4 py-1.5 text-sm text-gold">
            Rezultati yt më i mirë: {best}/{LENGTH}
          </p>
        )}
        <button type="button" onClick={start} className={`mt-8 ${primary}`}>
          Fillo kuizin
        </button>
      </div>
    );
  }

  if (finished) {
    return (
      <div className={card}>
        <div className="flex flex-col items-center text-center">
          <div className="grid size-36 place-items-center rounded-full border-4 border-gold/60 bg-gold-soft">
            <span className="font-serif text-5xl font-semibold text-gold tabular-nums">
              {score}
              <span className="text-2xl text-gold/60">/{LENGTH}</span>
            </span>
          </div>
          <h2 className="mt-6 font-serif text-3xl font-semibold">{verdict(score)}</h2>
          {score >= best && score > 0 && <p className="mt-2 text-sm text-gold">Rezultati yt më i mirë deri tani.</p>}
        </div>

        <ol className="mt-10 divide-y divide-line border-y border-line">
          {questions.map((item, i) => {
            const right = answers[i] === item.answer;
            return (
              <li key={i} className="flex items-start gap-4 py-4">
                <span
                  className={`mt-0.5 grid size-7 shrink-0 place-items-center rounded-full text-xs font-semibold ${
                    right ? "bg-emerald-soft text-emerald-deep" : "bg-red-500/15 text-red-300"
                  }`}
                >
                  {right ? "✓" : "✗"}
                </span>
                <span className="min-w-0 flex-1">
                  <span className="block font-medium">{item.prompt}</span>
                  <span className="block text-sm text-muted">
                    {right ? item.answer : `Ti: ${answers[i]} · Saktë: ${item.answer}`}
                  </span>
                </span>
                <Link href={item.link.href} className="shrink-0 text-sm text-emerald-deep hover:underline">
                  Shiko →
                </Link>
              </li>
            );
          })}
        </ol>

        <div className="mt-8 flex justify-center">
          <button type="button" onClick={start} className={primary}>
            Raund i ri
          </button>
        </div>
      </div>
    );
  }

  const answered = chosen !== null;
  const correct = chosen === q!.answer;

  return (
    <div className={card}>
      <div className="flex gap-1.5" aria-hidden>
        {questions.map((item, i) => (
          <span
            key={i}
            className={`h-1.5 flex-1 rounded-full transition-colors duration-500 ${
              i < answers.length
                ? answers[i] === item.answer
                  ? "bg-emerald-deep"
                  : "bg-red-400/70"
                : i === index
                  ? "bg-gold/70"
                  : "bg-line"
            }`}
          />
        ))}
      </div>

      <div className="mt-8 flex items-center justify-between text-sm">
        <span className="text-xs font-medium tracking-[0.2em] text-gold uppercase">{q!.kind}</span>
        <span className="text-muted tabular-nums">
          {index + 1} / {LENGTH}
        </span>
      </div>

      <h2 className="mt-3 font-serif text-2xl font-semibold text-balance sm:text-3xl">{q!.prompt}</h2>
      {q!.detail && (
        <blockquote className="mt-5 rounded-2xl border border-line bg-paper/50 p-5 font-serif text-lg leading-relaxed text-ink/90">
          {q!.detail}
        </blockquote>
      )}

      <div className="mt-8 grid gap-3">
        {q!.options.map((option, i) => {
          const isAnswer = option === q!.answer;
          const isChosen = option === chosen;
          const state = !answered
            ? "border-line hover:border-gold/60 hover:bg-paper/40"
            : isAnswer
              ? "border-emerald-deep/70 bg-emerald-soft"
              : isChosen
                ? "border-red-400/60 bg-red-500/10"
                : "border-line opacity-45";
          return (
            <button
              key={option}
              type="button"
              disabled={answered}
              onClick={() => choose(option)}
              className={`flex items-center gap-4 rounded-2xl border px-4 py-4 text-left transition-all ${state}`}
            >
              <span
                className={`grid size-9 shrink-0 place-items-center rounded-xl text-sm font-semibold ${
                  answered && isAnswer
                    ? "bg-emerald-deep text-paper"
                    : answered && isChosen
                      ? "bg-red-400/80 text-paper"
                      : "bg-paper/70 text-muted"
                }`}
              >
                {LETTERS[i]}
              </span>
              <span className="text-lg">{option}</span>
            </button>
          );
        })}
      </div>

      {answered ? (
        <div
          className={`mt-6 flex flex-wrap items-center justify-between gap-4 rounded-2xl border p-5 ${
            correct ? "border-emerald-deep/40 bg-emerald-soft/60" : "border-red-400/30 bg-red-500/5"
          }`}
        >
          <div>
            <p className={`font-medium ${correct ? "text-emerald-deep" : "text-red-300"}`}>
              {correct ? "Saktë!" : `Përgjigjja e saktë: ${q!.answer}`}
            </p>
            <Link href={q!.link.href} target="_blank" className="text-sm text-muted hover:text-ink">
              {q!.link.label} ↗
            </Link>
          </div>
          <button type="button" onClick={next} className={primary}>
            {answers.length === LENGTH ? "Shiko rezultatin" : "Vazhdo →"}
          </button>
        </div>
      ) : (
        <p className="mt-6 text-center text-xs text-muted">Mund të përgjigjesh edhe me tastierë: 1–4 ose A–D</p>
      )}
    </div>
  );
}
