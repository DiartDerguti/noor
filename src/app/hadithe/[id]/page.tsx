import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { getHadith } from "@/lib/hadith";
import HadithAnswer from "@/components/HadithAnswer";
import SourceBadge from "@/components/SourceBadge";

type Props = { params: Promise<{ id: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const hadith = await getHadith((await params).id);
  return { title: hadith?.title.slice(0, 60) ?? "Hadith" };
}

export default async function HadithPage({ params }: Props) {
  const hadith = await getHadith((await params).id);
  if (!hadith) notFound();

  return (
    <article className="mx-auto max-w-3xl px-4">
      <Link href="/hadithe" className="mt-8 inline-block text-sm text-muted hover:text-ink">
        ← Hadithe
      </Link>
      <header className="pt-8 pb-8">
        <SourceBadge source={hadith.source} />
        <h1 className="mt-4 font-serif text-3xl leading-snug font-semibold text-balance sm:text-4xl">{hadith.title}</h1>
        <p className="mt-3 text-sm text-muted">Shkalla: {hadith.grade}</p>
      </header>
      <div className="rounded-3xl border border-line bg-card p-6 sm:p-10">
        <HadithAnswer hadith={hadith} />
      </div>
      <p className="mt-6 text-sm text-muted">
        Burimi:{" "}
        <a
          className="underline-offset-4 hover:underline"
          href={`https://hadeethenc.com/sq/browse/hadith/${hadith.id}`}
          target="_blank"
          rel="noreferrer"
        >
          HadeethEnc #{hadith.id}
        </a>
      </p>
    </article>
  );
}
