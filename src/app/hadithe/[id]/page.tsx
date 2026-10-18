import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { SITE_URL, pageMeta } from "@/lib/site";
import { SOURCE_LABEL, getAllHadithIds, getHadith, hadithAsText, hadithHeadline } from "@/lib/hadith";
import SourceBadge from "@/components/SourceBadge";
import BackLink from "@/components/BackLink";
import ShareBar from "@/components/ShareBar";

type Props = { params: Promise<{ id: string }> };

export const revalidate = 86400;

export async function generateStaticParams() {
  return (await getAllHadithIds()).map((id) => ({ id }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const hadith = await getHadith((await params).id);
  if (!hadith) return { title: "Hadith" };
  const title = hadith.title.replace(/["“”]/g, "");
  return pageMeta({
    title: title.length > 60 ? `${title.slice(0, 57).trimEnd()}...` : title,
    description: `${SOURCE_LABEL[hadith.source]}. Lexo hadithin në shqip, shpjegimin dhe mësimet që nxirren prej tij.`,
    path: `/hadithe/${hadith.id}`,
  });
}

function Label({ children }: { children: React.ReactNode }) {
  return (
    <h2 className="text-gold text-xs font-medium tracking-[0.25em] uppercase">
      {children}
    </h2>
  );
}

export default async function HadithPage({ params }: Props) {
  const hadith = await getHadith((await params).id);
  if (!hadith) notFound();

  const url = `${SITE_URL}/hadithe/${hadith.id}`;

  return (
    <article className="mx-auto max-w-6xl px-4">
      <header className="pt-6 pb-10 sm:pt-10">
        <BackLink href="/hadithe" label="Hadithe" />
        <div>
          <SourceBadge source={hadith.source} />
        </div>
        <h1
          className={`mt-5 font-serif leading-snug font-semibold ${
            hadith.title.length > 140 ? "text-xl sm:text-2xl" : "text-2xl sm:text-3xl"
          }`}
        >
          {hadithHeadline(hadith)}
        </h1>
      </header>

      <div className="grid gap-10 lg:grid-cols-[minmax(0,1fr)_320px] lg:gap-14">
        <div className="space-y-12">
          {hadith.arabic && (
            <div className="border-gold/30 bg-card relative overflow-hidden rounded-[2rem] border px-6 py-8 sm:px-10 sm:py-10">
              <div className="bg-gold/10 absolute -top-20 -left-20 size-56 rounded-full blur-3xl" />
              <p className="arabic text-ink relative text-[1.7rem] leading-[2.2] sm:text-[2rem]">
                {hadith.arabic}
              </p>
            </div>
          )}

          <section>
            <Label>Hadithi</Label>
            <p className="border-gold/60 text-ink mt-4 border-l-2 pl-5 font-serif text-xl leading-relaxed whitespace-pre-line sm:text-[1.35rem]">
              {hadith.text}
            </p>
          </section>

          {hadith.explanation && (
            <section>
              <Label>Shpjegimi</Label>
              <p className="text-ink/85 mt-4 text-[1.05rem] leading-[1.85] whitespace-pre-line">
                {hadith.explanation}
              </p>
            </section>
          )}

          {hadith.lessons.length > 0 && (
            <section>
              <Label>Çfarë mësojmë?</Label>
              <ol className="mt-5 space-y-3">
                {hadith.lessons.map((lesson, i) => (
                  <li
                    key={i}
                    className="border-line bg-card flex gap-4 rounded-2xl border p-5"
                  >
                    <span className="bg-emerald-soft text-emerald-deep grid size-8 shrink-0 place-items-center rounded-full text-sm font-semibold tabular-nums">
                      {i + 1}
                    </span>
                    <span className="text-ink/90 leading-relaxed">
                      {lesson}
                    </span>
                  </li>
                ))}
              </ol>
            </section>
          )}
        </div>

        <aside className="space-y-6 lg:sticky lg:top-24 lg:self-start">
          <section className="border-line bg-card rounded-[2rem] border p-6">
            <div>
              <ShareBar
                url={url}
                text={hadith.title}
                source={SOURCE_LABEL[hadith.source]}
                card={`/hadithe/${hadith.id}/karta`}
                full={hadithAsText(hadith, url)}
              />
            </div>
          </section>

          <section className="border-line bg-card rounded-[2rem] border p-6 text-sm">
            <Label>Burimi</Label>
            <dl className="mt-4 space-y-3">
              <div>
                <dt className="text-muted">Transmetimi</dt>
                <dd className="mt-0.5 font-medium">{hadith.attribution}</dd>
              </div>
              <div>
                <dt className="text-muted">Shkalla</dt>
                <dd className="mt-0.5 font-medium">{hadith.grade}</dd>
              </div>
              <div>
                <dt className="text-muted">Përkthimi, shpjegimi dhe mësimet</dt>
                <dd className="mt-0.5 font-medium">
                  Enciklopedia e Haditheve Profetike të Përkthyera (HadeethEnc)
                </dd>
              </div>
            </dl>
            <a
              href={hadith.url}
              target="_blank"
              rel="noreferrer"
              className="text-emerald-deep mt-5 inline-block font-medium underline-offset-4 hover:underline"
            >
              Shiko në HadeethEnc ↗
            </a>
          </section>
        </aside>
      </div>
    </article>
  );
}
