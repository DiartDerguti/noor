import type { Metadata } from "next";
import { pageMeta } from "@/lib/site";
import Link from "next/link";
import { getCategories } from "@/lib/hadith";
import PageHeading from "@/components/PageHeading";

export const metadata: Metadata = pageMeta({
  title: "Hadithe nga Buhariu dhe Muslimi",
  description: "Hadithe të sakta në shqip, vetëm nga Sahihu i Buhariut dhe i Muslimit, secili me shpjegim dhe mësimet që nxirren prej tij.",
  path: "/hadithe",
});

export default async function HadithsPage() {
  const categories = await getCategories();

  return (
    <div className="mx-auto max-w-6xl px-4">
      <PageHeading
        arabic="الحديث النبوي"
        title="Hadithe nga Buhariu dhe Muslimi"
        text="Shfaqen vetëm hadithet që gjenden në Sahihun e Buhariut ose të Muslimit, secili me shpjegim dhe mësimet që nxirren prej tij."
      />

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
