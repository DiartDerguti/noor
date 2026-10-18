"use client";

import Link from "next/link";
import { useState } from "react";
import { SOURCE_LABEL, type Source } from "@/lib/hadith";
import { revelationLabel, type SurahMeta } from "@/lib/quran";

export type QuizHadith = { id: string; title: string; source: Source };

type Question = {
  prompt: string;
  detail?: string;
  options: string[];
  answer: string;
  link: { href: string; label: string };
};

const LENGTH = 10;

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
        prompt: `Ku është shpallur sureja ${s.englishName}?`,
        options: ["Mekë", "Medinë"],
        answer: revelationLabel(s.revelationType),
        link: { href: `/kurani/${s.number}`, label: `Lexo suren ${s.englishName}` },
      };
    },
    () => {
      const s = pick(surahs);
      return {
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

export default function Quiz({ surahs, hadiths }: { surahs: SurahMeta[]; hadiths: QuizHadith[] }) {
  const [questions, setQuestions] = useState<Question[] | null>(null);
  const [index, setIndex] = useState(0);
  const [chosen, setChosen] = useState<string | null>(null);
  const [score, setScore] = useState(0);

  function start() {
    setQuestions(buildQuestions(surahs, hadiths));
    setIndex(0);
    setChosen(null);
    setScore(0);
  }

  if (!questions) {
    return (
      <div className="rounded-3xl border border-line bg-card p-8 text-center">
        <p className="arabic text-3xl text-gold">بسم الله</p>
        <p className="mt-3 text-muted">Gati? Çdo raund ka pyetje të reja.</p>
        <button
          type="button"
          onClick={start}
          className="mt-6 rounded-full bg-emerald-deep px-6 py-3 font-medium text-paper hover:opacity-90"
        >
          Fillo
        </button>
      </div>
    );
  }

  if (index >= questions.length) {
    return (
      <div className="rounded-3xl border border-line bg-card p-8 text-center">
        <p className="text-sm text-muted">Rezultati</p>
        <p className="mt-2 font-serif text-6xl font-semibold text-emerald-deep tabular-nums">
          {score}
          <span className="text-3xl text-muted">/{questions.length}</span>
        </p>
        <p className="mt-4 text-muted">
          {score === questions.length ? "MashaAllah, të gjitha saktë!" : "Çdo gabim është një mësim. Provo përsëri."}
        </p>
        <button
          type="button"
          onClick={start}
          className="mt-6 rounded-full bg-emerald-deep px-6 py-3 font-medium text-paper hover:opacity-90"
        >
          Raund i ri
        </button>
      </div>
    );
  }

  const q = questions[index];
  const answered = chosen !== null;

  function choose(option: string) {
    if (answered) return;
    setChosen(option);
    if (option === q.answer) setScore((s) => s + 1);
  }

  return (
    <div className="rounded-3xl border border-line bg-card p-6 sm:p-8">
      <div className="mb-6 flex items-center gap-3 text-sm text-muted">
        <span className="tabular-nums">
          {index + 1}/{questions.length}
        </span>
        <span className="h-1.5 flex-1 overflow-hidden rounded-full bg-line">
          <span
            className="block h-full rounded-full bg-gold transition-all"
            style={{ width: `${(index / questions.length) * 100}%` }}
          />
        </span>
        <span className="tabular-nums">{score} saktë</span>
      </div>

      <h2 className="font-serif text-2xl font-semibold text-balance">{q.prompt}</h2>
      {q.detail && (
        <blockquote className="mt-4 border-l-2 border-gold pl-4 font-serif leading-relaxed text-ink/85">
          {q.detail}
        </blockquote>
      )}

      <div className="mt-6 grid gap-2">
        {q.options.map((option) => {
          const state = !answered
            ? "border-line hover:border-gold"
            : option === q.answer
              ? "border-emerald-deep bg-emerald-soft text-emerald-deep"
              : option === chosen
                ? "border-red-400 bg-red-500/10 text-red-300"
                : "border-line opacity-50";
          return (
            <button
              key={option}
              type="button"
              disabled={answered}
              onClick={() => choose(option)}
              className={`rounded-2xl border px-5 py-3.5 text-left transition-colors ${state}`}
            >
              {option}
            </button>
          );
        })}
      </div>

      {answered && (
        <div className="mt-6 flex flex-wrap items-center justify-between gap-3">
          <Link href={q.link.href} target="_blank" className="text-sm text-emerald-deep underline-offset-4 hover:underline">
            {q.link.label} ↗
          </Link>
          <button
            type="button"
            onClick={() => {
              setIndex((i) => i + 1);
              setChosen(null);
            }}
            className="rounded-full bg-emerald-deep px-5 py-2.5 font-medium text-paper hover:opacity-90"
          >
            {index + 1 === questions.length ? "Shiko rezultatin" : "Vazhdo →"}
          </button>
        </div>
      )}
    </div>
  );
}
