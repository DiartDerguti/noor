import type { Metadata } from "next";
import Link from "next/link";
import { pageMeta } from "@/lib/site";
import { getChapter, getChapters, HISN_SOURCE, HISN_TOTAL } from "@/lib/hisn";

export const metadata: Metadata = pageMeta({
  title: "Mburoja e Muslimanit · Hisnul Muslim shqip",
  description: `Hisnul Muslim në shqip: ${HISN_TOTAL} kapituj me lutje dhe dhikre, me tekst arabisht, transliterim, përkthim shqip dhe audio.`,
  path: "/mburoja",
});

const DAILY = [1, 10, 13, 25, 27, 28, 69, 96];

export default function HisnPage() {
  const all = getChapters().flatMap((c) => c.items);
  const stats = [
    [HISN_TOTAL, "kapituj"],
    [all.length, "lutje dhe këshilla"],
    [all.filter((i) => i.audio).length, "incizime audio"],
  ] as const;

  return (
    <div className="py-6">
      <section className="pattern border-line relative overflow-hidden rounded-[2rem] border p-8">
        <p className="arabic text-gold text-left text-4xl leading-normal">حصن المسلم</p>
        <h2 className="mt-1 font-serif text-3xl font-semibold tracking-tight">Lutjet e muslimanit për çdo ditë</h2>
        <dl className="mt-6 flex flex-wrap gap-x-8 gap-y-3 text-sm">
          {stats.map(([value, label]) => (
            <div key={label} className="flex items-baseline gap-2">
              <dd className="text-gold font-serif text-2xl tabular-nums">{value}</dd>
              <dt className="text-muted">{label}</dt>
            </div>
          ))}
        </dl>
      </section>

      <h2 className="text-gold mt-10 text-xs font-medium tracking-[0.25em] uppercase">Për çdo ditë</h2>
      <ul className="mt-4 grid gap-3 sm:grid-cols-2">
        {DAILY.map(getChapter).map((c) => (
          <li key={c.n}>
            <Link
              href={`/mburoja/${c.n}`}
              className="group border-line bg-card hover:border-gold flex h-full items-center gap-4 rounded-2xl border p-4 transition-colors"
            >
              <span className="text-gold/70 w-8 font-serif text-2xl tabular-nums">{c.n}</span>
              <span className="flex-1">
                <span className="block font-medium">{c.title}</span>
                <span className="text-muted block text-xs">
                  {c.items.length} {c.items.length === 1 ? "tekst" : "tekste"}
                  {c.items.some((i) => i.audio) && " · me audio"}
                </span>
              </span>
              <span className="text-emerald-deep transition-transform group-hover:translate-x-1" aria-hidden>
                →
              </span>
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}
