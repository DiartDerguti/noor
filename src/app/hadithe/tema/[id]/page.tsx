import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { getCategories, getCategoryPage } from "@/lib/hadith";
import PageHeading from "@/components/PageHeading";
import HadithAnswer from "@/components/HadithAnswer";
import SourceBadge from "@/components/SourceBadge";

type Props = {
  params: Promise<{ id: string }>;
  searchParams: Promise<{ faqe?: string }>;
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

  const page = Math.max(1, Number((await searchParams).faqe) || 1);
  const { hadiths, lastPage } = await getCategoryPage(id, page);

  return (
    <div className="mx-auto max-w-3xl px-4">
      <Link href="/hadithe" className="mt-8 inline-block text-sm text-muted hover:text-ink">
        ← Të gjitha temat
      </Link>
      <PageHeading
        title={category.title}
        text="Hap një pyetje për të lexuar hadithin, shpjegimin dhe çfarë mësojmë prej tij."
      />

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
          Në këtë faqe nuk ka hadithe nga Buhariu ose Muslimi. Provo faqen tjetër.
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
