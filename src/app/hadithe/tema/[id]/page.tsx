import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { SEARCH_LIMIT, getCategories, getCategoryPage, searchCategory } from "@/lib/hadith";
import PageHeading from "@/components/PageHeading";
import HadithAnswer from "@/components/HadithAnswer";
import SourceBadge from "@/components/SourceBadge";

type Props = {
  params: Promise<{ id: string }>;
  searchParams: Promise<{ faqe?: string; q?: string }>;
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { id } = await params;
  const category = (await getCategories()).find((c) => c.id === id);
  return { title: category?.title ?? "Hadithe" };
}

export default async function CategoryPage({ params, searchParams }: Props) {
  const { id } = await params;
  const category = (await getCategories()).find((c) => c.id === id);
  if (!category) notFound();

  const { faqe, q = "" } = await searchParams;
  const query = q.trim();
  const page = Math.max(1, Number(faqe) || 1);
  const { hadiths, lastPage, matches } = query
    ? { ...(await searchCategory(id, query)), lastPage: 1 }
    : { ...(await getCategoryPage(id, page)), matches: 0 };

  return (
    <div className="mx-auto max-w-3xl px-4">
      <Link href="/hadithe" className="mt-8 inline-block text-sm text-muted hover:text-ink">
        ← Të gjitha temat
      </Link>
      <PageHeading
        title={category.title}
        text="Hap një pyetje për të lexuar hadithin, shpjegimin dhe çfarë mësojmë prej tij."
      />

      <form className="mb-6 flex gap-2">
        <input
          type="search"
          name="q"
          defaultValue={query}
          placeholder="Kërko në këtë temë, p.sh. namaz, agjërim…"
          className="min-w-0 flex-1 rounded-2xl border border-line bg-card px-5 py-3.5 outline-none placeholder:text-muted focus:border-gold"
        />
        <button
          type="submit"
          className="rounded-2xl bg-emerald-deep px-5 font-medium text-paper transition-opacity hover:opacity-90"
        >
          Kërko
        </button>
      </form>

      {query && (
        <p className="mb-4 text-sm text-muted">
          {hadiths.length} rezultate për „{query}“
          {matches > SEARCH_LIMIT && " · shfaqen të parat, shto një fjalë tjetër për t'i ngushtuar"}
          {" · "}
          <Link href={`/hadithe/tema/${id}`} className="text-emerald-deep underline-offset-4 hover:underline">
            Pastro kërkimin
          </Link>
        </p>
      )}

      <div className="space-y-3">
        {hadiths.map((h) => (
          <details key={h.id} className="group rounded-2xl border border-line bg-card open:border-gold/60">
            <summary className="flex cursor-pointer list-none items-start gap-4 p-5 [&::-webkit-details-marker]:hidden">
              <span className="mt-0.5 grid size-7 shrink-0 place-items-center rounded-full bg-emerald-soft text-sm font-semibold text-emerald-deep">
                P
              </span>
              <span className="flex-1">
                <span className="block font-serif text-lg leading-snug">{h.title}</span>
                <span className="mt-2 block">
                  <SourceBadge source={h.source} />
                </span>
              </span>
              <span className="mt-1 text-muted transition-transform group-open:rotate-45">+</span>
            </summary>
            <div className="border-t border-line px-5 pt-5 pb-6 sm:pl-16">
              <HadithAnswer hadith={h} compact />
              <Link
                href={`/hadithe/${h.id}`}
                className="mt-5 inline-block text-sm font-medium text-emerald-deep underline-offset-4 hover:underline"
              >
                Hape veçmas →
              </Link>
            </div>
          </details>
        ))}
      </div>

      {hadiths.length === 0 && (
        <p className="rounded-2xl border border-dashed border-line p-8 text-center text-muted">
          {query
            ? "Nuk u gjet asnjë hadith nga Buhariu ose Muslimi. Provo një fjalë tjetër."
            : "Në këtë faqe nuk ka hadithe nga Buhariu ose Muslimi. Provo faqen tjetër."}
        </p>
      )}

      {lastPage > 1 && (
        <nav className="mt-8 flex items-center justify-between text-sm">
          {page > 1 ? (
            <Link href={`?faqe=${page - 1}`} className="rounded-full border border-line bg-card px-4 py-2 hover:border-gold">
              ← Mbrapa
            </Link>
          ) : (
            <span />
          )}
          <span className="text-muted">
            Faqja {page} nga {lastPage}
          </span>
          {page < lastPage ? (
            <Link href={`?faqe=${page + 1}`} className="rounded-full border border-line bg-card px-4 py-2 hover:border-gold">
              Para →
            </Link>
          ) : (
            <span />
          )}
        </nav>
      )}
    </div>
  );
}
