"use client";

import Link from "next/link";
import { usePathname, useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";

// Served by the service worker for any page that is not in the cache while offline.
// It renders the same views as the server, from the data bundled with the app.

type Rendered = { key: string; node: React.ReactNode | null };

async function render(path: string, query: string): Promise<React.ReactNode | null> {
  let m: RegExpMatchArray | null;

  if ((m = path.match(/^\/kurani\/(\d+)(\/mushaf)?$/))) {
    const q = await import("@/views/quran");
    const n = q.parseSurah(m[1]);
    if (!n) return null;
    const [data, surahs] = await Promise.all([q.loadSurah(n, Boolean(m[2])), (await import("@/lib/quran")).getSurahs()]);
    return (
      <q.ReaderFrame surahs={surahs}>
        <q.SurahView {...data} />
      </q.ReaderFrame>
    );
  }

  if ((m = path.match(/^\/kurani\/(faqe|xhuz)\/(\d+)(\/mushaf)?$/))) {
    const q = await import("@/views/quran");
    const kind = m[1] as "faqe" | "xhuz";
    const n = q.parseSection(kind, m[2]);
    if (!n) return null;
    const [data, surahs] = await Promise.all([q.loadSection(kind, n, Boolean(m[3])), (await import("@/lib/quran")).getSurahs()]);
    return (
      <q.ReaderFrame surahs={surahs}>
        <q.SectionView {...data} />
      </q.ReaderFrame>
    );
  }

  if ((m = path.match(/^\/hadithe\/rijadus-salihin(?:\/faqe\/(\d+)|\/(kerko))?$/))) {
    const [{ RiyadFrame }, riyad, { default: RiyadList }] = await Promise.all([
      import("@/views/riyad"),
      import("@/lib/riyad"),
      import("@/components/RiyadList"),
    ]);
    if (m[2]) {
      const { hadiths, matches } = riyad.searchRiyad(query);
      return (
        <RiyadFrame>
          <RiyadList hadiths={hadiths} query={query} matches={matches} />
        </RiyadFrame>
      );
    }
    const page = Number(m[1] ?? 1);
    if (!Number.isInteger(page) || page < 1 || page > riyad.RIYAD_PAGES) return null;
    return (
      <RiyadFrame>
        <RiyadList hadiths={riyad.getRiyadPage(page)} page={page} />
      </RiyadFrame>
    );
  }

  if ((m = path.match(/^\/hadithe\/tema\/([^/]+)(?:\/faqe\/(\d+)|\/(kerko))?$/))) {
    const [hadith, { TopicFrame }, { default: HadithTopic }] = await Promise.all([
      import("@/lib/hadith"),
      import("@/views/hadith"),
      import("@/components/HadithTopic"),
    ]);
    const category = (await hadith.getCategories()).find((c) => c.id === m![1]);
    if (!category) return null;
    if (m[3]) {
      const { hadiths, matches } = await hadith.searchCategory(category.id, query);
      return (
        <TopicFrame category={category}>
          <HadithTopic category={category} hadiths={hadiths} query={query} matches={matches} />
        </TopicFrame>
      );
    }
    const page = Number(m[2] ?? 1);
    const { hadiths, lastPage } = await hadith.getCategoryPage(category.id, page);
    if (!Number.isInteger(page) || page < 1 || page > lastPage) return null;
    return (
      <TopicFrame category={category}>
        <HadithTopic category={category} hadiths={hadiths} page={page} lastPage={lastPage} />
      </TopicFrame>
    );
  }

  if ((m = path.match(/^\/hadithe\/(\d+)$/))) {
    const [{ getHadith }, { HadithView }] = await Promise.all([import("@/lib/hadith"), import("@/views/hadith")]);
    const hadith = await getHadith(m[1]);
    return hadith ? <HadithView hadith={hadith} /> : null;
  }

  if ((m = path.match(/^\/mburoja\/(\d+)$/))) {
    const [{ getChapter }, { HisnFrame, DuaView }] = await Promise.all([import("@/lib/hisn"), import("@/views/mburoja")]);
    const chapter = getChapter(Number(m[1]));
    return chapter ? (
      <HisnFrame>
        <DuaView chapter={chapter} />
      </HisnFrame>
    ) : null;
  }

  return null;
}

export default function OfflineApp() {
  const pathname = usePathname().replace(/\/+$/, "") || "/";
  const query = useSearchParams().get("q") ?? "";
  const key = `${pathname}?${query}`;
  const [rendered, setRendered] = useState<Rendered | null>(null);

  useEffect(() => {
    let cancelled = false;
    render(pathname, query.trim())
      .catch(() => null)
      .then((node) => {
        if (!cancelled) setRendered({ key, node });
      });
    return () => {
      cancelled = true;
    };
  }, [pathname, query, key]);

  if (!rendered || rendered.key !== key) {
    return (
      <div className="grid min-h-[50vh] place-items-center">
        <span className="border-gold size-6 animate-spin rounded-full border-2 border-t-transparent" aria-label="Duke u hapur" />
      </div>
    );
  }

  if (rendered.node) return rendered.node;

  return (
    <div className="mx-auto max-w-xl px-4 py-24 text-center">
      <p className="arabic text-gold text-4xl">نور</p>
      <h1 className="mt-4 font-serif text-2xl font-semibold">Kjo faqe nuk është e ruajtur offline</h1>
      <p className="text-muted mt-3">
        Kurani, hadithet, Mburoja dhe Rijadus Salihini hapen pa internet. Kjo faqe do të hapet kur të lidhesh sërish.
      </p>
      <Link
        href="/"
        className="bg-emerald-deep text-paper mt-8 inline-block rounded-full px-6 py-2.5 text-sm font-medium transition-opacity hover:opacity-90"
      >
        Kthehu në ballinë
      </Link>
    </div>
  );
}
