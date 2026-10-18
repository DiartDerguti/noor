"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import { revelationLabel, type SurahMeta } from "@/lib/quran";

const simplify = (s: string) =>
  s
    .toLowerCase()
    .normalize("NFD")
    .replace(/[^a-z0-9]/g, "");

export default function SurahList({ surahs }: { surahs: SurahMeta[] }) {
  const [query, setQuery] = useState("");

  const filtered = useMemo(() => {
    const q = simplify(query);
    if (!q) return surahs;
    return surahs.filter((s) => String(s.number) === q || simplify(s.englishName).includes(q));
  }, [query, surahs]);

  return (
    <>
      <input
        type="search"
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        placeholder="Kërko..."
        className="mb-6 w-full rounded-2xl border border-line bg-card px-5 py-3.5 outline-none placeholder:text-muted focus:border-gold"
      />

      <ul className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
        {filtered.map((s) => (
          <li key={s.number}>
            <Link
              href={`/kurani/${s.number}`}
              className="flex items-center gap-4 rounded-2xl border border-line bg-card p-4 transition-colors hover:border-gold"
            >
              <span className="grid size-10 shrink-0 rotate-45 place-items-center rounded-lg border border-gold/50 text-sm">
                <span className="-rotate-45 font-medium tabular-nums">{s.number}</span>
              </span>
              <span className="min-w-0 flex-1">
                <span className="block truncate font-medium">
                  {s.englishName} <span className="font-normal text-muted">({s.albanianName})</span>
                </span>
                <span className="text-xs text-muted">
                  {revelationLabel(s.revelationType)} · {s.numberOfAyahs} ajete
                </span>
              </span>
              <span className="arabic text-xl leading-none text-emerald-deep">{s.name.replace("سُورَةُ ", "")}</span>
            </Link>
          </li>
        ))}
      </ul>

      {filtered.length === 0 && <p className="py-10 text-center text-muted">Asnjë sure nuk përputhet me kërkimin.</p>}
    </>
  );
}
