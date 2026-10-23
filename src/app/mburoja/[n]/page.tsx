import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { pageMeta, SITE_URL } from "@/lib/site";
import { audioUrl, chapterAsText, getChapter, HISN_TOTAL } from "@/lib/hisn";
import DuaActions from "@/components/DuaActions";
import DuaAudio from "@/components/DuaAudio";
import CopyButton from "@/components/CopyButton";

type Props = { params: Promise<{ n: string }> };

export const dynamicParams = false;

export function generateStaticParams() {
  return Array.from({ length: HISN_TOTAL }, (_, i) => ({ n: String(i + 1) }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const chapter = getChapter(Number((await params).n));
  if (!chapter) return { title: "Mburoja e Muslimanit" };
  const first = chapter.items.find((i) => i.translation)?.translation ?? chapter.items[0]?.text ?? "";
  return pageMeta({
    title: `${chapter.title} · Mburoja e Muslimanit`,
    description: first.length > 155 ? `${first.slice(0, 152)}…` : first,
    path: `/mburoja/${chapter.n}`,
  });
}

export default async function DuaPage({ params }: Props) {
  const n = Number((await params).n);
  const chapter = getChapter(n);
  if (!chapter) notFound();

  const url = `${SITE_URL}/mburoja/${n}`;
  const prev = n > 1 ? getChapter(n - 1) : null;
  const next = n < HISN_TOTAL ? getChapter(n + 1) : null;

  return (
    <article className="pt-4 pb-10 lg:py-8">
      <Link
        href="/mburoja"
        className="text-muted hover:text-ink mb-4 inline-flex items-center gap-2 text-sm transition-colors lg:hidden"
      >
        <span className="bg-card border-line grid size-8 place-items-center rounded-full border" aria-hidden>
          ←
        </span>
        Të gjitha lutjet
      </Link>

      <header className="border-line flex flex-wrap items-start justify-between gap-x-6 gap-y-4 border-b pb-6">
        <div className="min-w-0 flex-1 basis-64">
          <p className="text-emerald-deep text-xs font-semibold tracking-[0.18em] uppercase tabular-nums">
            Dua {n} / {HISN_TOTAL}
          </p>
          <h1 className="mt-2 font-serif text-3xl leading-tight font-semibold tracking-tight text-balance sm:text-4xl">
            {chapter.title}
          </h1>
        </div>
        <DuaActions
          n={n}
          title={chapter.title}
          url={url}
          text={chapterAsText(chapter, url)}
          audio={chapter.items.flatMap((i) => (i.audio ? [audioUrl(i.audio)] : []))}
        />
      </header>

      <div className="divide-line divide-y">
        {chapter.items.map((item, i) =>
          item.arabic ? (
            <section key={i} className="relative py-8 pl-5 sm:pl-7">
              <span className="bg-emerald-deep/70 absolute top-8 bottom-8 left-0 w-0.5 rounded-full" aria-hidden />
              <p className="arabic text-ink text-[length:var(--hisn-ar)] leading-[2.1]">{item.arabic}</p>
              {item.translit && (
                <p className="text-emerald-deep mt-4 font-serif text-[length:var(--hisn-tx)] leading-relaxed italic">
                  {item.translit}
                </p>
              )}
              {item.translation && (
                <p className="text-ink/90 mt-3 text-[length:var(--hisn-tx)] leading-relaxed">{item.translation}</p>
              )}
              <div className="mt-3 flex items-start justify-between gap-3">
                {item.source ? (
                  <p className="text-muted text-[13px] leading-relaxed italic">— {item.source}</p>
                ) : (
                  <span />
                )}
                <CopyButton
                  label="Kopjo duanë"
                  text={[item.arabic, item.translit, item.translation, item.source && `— ${item.source}`]
                    .filter(Boolean)
                    .join("\n\n")}
                />
              </div>
              {item.audio && <DuaAudio src={audioUrl(item.audio)} />}
            </section>
          ) : (
            <section key={i} className="py-6">
              <div className="border-gold/30 bg-gold-soft/60 rounded-2xl border p-5 sm:p-6">
                <p className="text-ink/90 text-[length:var(--hisn-tx)] leading-relaxed">{item.text}</p>
                {item.source && <p className="text-muted mt-3 text-[13px] leading-relaxed italic">— {item.source}</p>}
                {item.audio && <DuaAudio src={audioUrl(item.audio)} />}
              </div>
            </section>
          ),
        )}
      </div>

      <nav className="border-line mt-4 grid gap-3 border-t pt-6 sm:grid-cols-2">
        {prev ? (
          <Link
            href={`/mburoja/${prev.n}`}
            className="group border-line bg-card hover:border-gold flex items-center gap-3 rounded-2xl border p-4 transition-colors"
          >
            <span className="text-muted transition-transform group-hover:-translate-x-1" aria-hidden>
              ←
            </span>
            <span className="min-w-0">
              <span className="text-muted block text-xs">Dua {prev.n}</span>
              <span className="block truncate text-sm font-medium">{prev.title}</span>
            </span>
          </Link>
        ) : (
          <span className="hidden sm:block" />
        )}
        {next && (
          <Link
            href={`/mburoja/${next.n}`}
            className="group border-line bg-card hover:border-gold flex items-center justify-end gap-3 rounded-2xl border p-4 text-right transition-colors"
          >
            <span className="min-w-0">
              <span className="text-muted block text-xs">Dua {next.n}</span>
              <span className="block truncate text-sm font-medium">{next.title}</span>
            </span>
            <span className="text-emerald-deep transition-transform group-hover:translate-x-1" aria-hidden>
              →
            </span>
          </Link>
        )}
      </nav>
    </article>
  );
}
