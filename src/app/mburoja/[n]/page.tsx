import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { pageMeta, SITE_URL } from "@/lib/site";
import { audioUrl, chapterAsText, getChapter, HISN_TOTAL } from "@/lib/hisn";
import DuaActions from "@/components/DuaActions";
import DuaAudio from "@/components/DuaAudio";

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

  const actions = (
    <DuaActions
      n={n}
      title={chapter.title}
      url={url}
      text={chapterAsText(chapter, url)}
      audio={chapter.items.flatMap((i) => (i.audio ? [audioUrl(i.audio)] : []))}
    />
  );

  return (
    <article className="pt-4 lg:pt-8">
      <div className="mb-4 flex items-center justify-between gap-3 lg:hidden">
        <Link
          href="/mburoja"
          className="text-muted hover:text-ink inline-flex min-w-0 items-center gap-2 text-sm transition-colors"
        >
          <span className="bg-card border-line grid size-8 shrink-0 place-items-center rounded-full border" aria-hidden>
            <svg viewBox="0 0 24 24" className="size-4" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M19 12H5M11 18l-6-6 6-6" />
            </svg>
          </span>
          <span className="truncate">Të gjitha lutjet</span>
        </Link>
        {actions}
      </div>

      <header className="border-line flex items-center justify-between gap-6 border-b pb-6">
        <h1 className="min-w-0 flex-1 font-serif text-lg leading-snug font-semibold tracking-tight text-balance sm:text-xl">
          {chapter.title}
        </h1>
        <div className="hidden lg:block">{actions}</div>
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
              {item.source && <p className="text-muted mt-3 text-[13px] leading-relaxed italic">— {item.source}</p>}
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

      <nav className="border-line mt-4 grid grid-cols-2 gap-2 border-t pt-8 sm:gap-3 sm:pt-6">
        {prev ? (
          <Link
            href={`/mburoja/${prev.n}`}
            className="group border-line bg-card hover:border-gold flex min-w-0 items-center gap-2 rounded-2xl border px-3 py-2.5 transition-colors sm:gap-3 sm:p-4"
          >
            <span className="text-muted transition-transform group-hover:-translate-x-1" aria-hidden>
              ←
            </span>
            <span className="min-w-0">
              <span className="text-muted block text-[11px] sm:text-xs">Dua {prev.n}</span>
              <span className="block truncate text-[13px] font-medium sm:text-sm">{prev.title}</span>
            </span>
          </Link>
        ) : (
          <span />
        )}
        {next && (
          <Link
            href={`/mburoja/${next.n}`}
            className="group border-line bg-card hover:border-gold flex min-w-0 items-center justify-end gap-2 rounded-2xl border px-3 py-2.5 text-right transition-colors sm:gap-3 sm:p-4"
          >
            <span className="min-w-0">
              <span className="text-muted block text-[11px] sm:text-xs">Dua {next.n}</span>
              <span className="block truncate text-[13px] font-medium sm:text-sm">{next.title}</span>
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
