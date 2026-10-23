import type { Metadata } from "next";
import { pageMeta } from "@/lib/site";
import Link from "next/link";
import { getCategories } from "@/lib/hadith";
import Icon3D from "@/components/Icon3D";
import { RIYAD_TOTAL } from "@/lib/riyad";

export const metadata: Metadata = pageMeta({
  title: "Hadithe në shqip",
  description: "Rijadus Salihin i Imam Neveviut dhe hadithe nga Sahihu i Buhariut e i Muslimit, me shpjegim dhe mësimet që nxirren prej tyre.",
  path: "/hadithe",
});

export default async function HadithsPage() {
  const categories = await getCategories();

  return (
    <div className="mx-auto max-w-6xl px-4 pt-8 sm:pt-10">
      <h1 className="sr-only">Hadithe në shqip</h1>

      <Link
        href="/hadithe/rijadus-salihin"
        className="group pattern border-gold/40 hover:border-gold relative mb-10 flex items-center gap-5 overflow-hidden rounded-[2rem] border p-6 transition-colors sm:p-8"
      >
        <Icon3D name="scroll" className="size-14 sm:size-16" />
        <span className="min-w-0 flex-1">
          <span className="text-gold block text-xs font-medium tracking-[0.2em] uppercase">Koleksion i ri</span>
          <span className="mt-1 block font-serif text-2xl font-semibold sm:text-3xl">Rijadus Salihin</span>
          <span className="text-muted mt-1 block text-sm">
            {RIYAD_TOTAL} hadithe nga koleksioni i Imam Neveviut, me kërkim sipas fjalës ose numrit
          </span>
        </span>
        <span className="arabic text-gold hidden text-3xl leading-none md:block">رياض الصالحين</span>
        <span className="text-emerald-deep text-xl transition-transform group-hover:translate-x-1" aria-hidden>
          →
        </span>
      </Link>

      <h2 className="text-gold mb-4 text-xs font-medium tracking-[0.25em] uppercase">Temat nga Buhariu dhe Muslimi</h2>
      <ul className="grid gap-3 sm:grid-cols-2">
        {categories.map((c, i) => (
          <li key={c.id}>
            <Link
              href={`/hadithe/tema/${c.id}`}
              className="group flex h-full items-center gap-4 rounded-2xl border border-line bg-card p-5 transition-colors hover:border-gold"
            >
              <span className="font-serif text-3xl text-gold/70 tabular-nums">{String(i + 1).padStart(2, "0")}</span>
              <span className="flex-1 font-medium">{c.title}</span>
              <span className="text-emerald-deep transition-transform group-hover:translate-x-1">→</span>
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}
