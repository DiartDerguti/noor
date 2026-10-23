import Link from "next/link";
import { RIYAD_PAGES, RIYAD_SEARCH_LIMIT, riyadPath, type RiyadHadith } from "@/lib/riyad";
import CopyButton from "./CopyButton";

export default function RiyadList({
  hadiths,
  page = 1,
  query = "",
  matches = 0,
}: {
  hadiths: RiyadHadith[];
  page?: number;
  query?: string;
  matches?: number;
}) {
  return (
    <>
      {query && (
        <p className="text-muted mb-4 text-sm">
          {matches} rezultate për „{query}“
          {matches > RIYAD_SEARCH_LIMIT && ` · shfaqen ${RIYAD_SEARCH_LIMIT} të parat, shto një fjalë tjetër për t'i ngushtuar`}
          {" · "}
          <Link href={riyadPath()} className="text-emerald-deep underline-offset-4 hover:underline">
            Pastro kërkimin
          </Link>
        </p>
      )}

      <ol className="space-y-3">
        {hadiths.map((h) => (
          <li
            key={h.n}
            id={`h-${h.n.replace(/\D+/g, "-")}`}
            className="border-line bg-card scroll-mt-24 rounded-2xl border p-5 sm:p-6"
          >
            <div className="flex items-start gap-4">
              <span className="border-gold/40 bg-gold-soft text-gold grid min-w-11 shrink-0 place-items-center rounded-xl border px-2 py-1.5 font-serif text-sm tabular-nums">
                {h.n}
              </span>
              <p className="text-ink/90 flex-1 leading-relaxed text-pretty">{h.text}</p>
              <CopyButton label="Kopjo hadithin" text={`${h.text}\n— ${h.by} (Rijadus Salihin, nr. ${h.n})`} />
            </div>
            <p className="text-muted mt-3 pl-15 text-sm italic">— {h.by}</p>
          </li>
        ))}
      </ol>

      {hadiths.length === 0 && (
        <p className="border-line text-muted rounded-2xl border border-dashed p-8 text-center">
          Nuk u gjet asnjë hadith. Provo një fjalë tjetër ose numrin e hadithit.
        </p>
      )}

      {!query && RIYAD_PAGES > 1 && <Pager page={page} />}
    </>
  );
}

function Pager({ page }: { page: number }) {
  const around = [1, page - 2, page - 1, page, page + 1, page + 2, RIYAD_PAGES].filter(
    (p, i, a) => p >= 1 && p <= RIYAD_PAGES && a.indexOf(p) === i,
  );
  const pages = around.sort((a, b) => a - b);
  const pill = "grid h-10 min-w-10 place-items-center rounded-full border px-3 text-sm transition-colors";

  return (
    <nav aria-label="Faqet" className="mt-8 flex flex-col items-center gap-4">
      <div className="flex flex-wrap items-center justify-center gap-1.5">
        {page > 1 && (
          <Link href={riyadPath(page - 1)} className={`${pill} border-line bg-card hover:border-gold`} aria-label="Faqja e mëparshme">
            ←
          </Link>
        )}
        {pages.map((p, i) => (
          <span key={p} className="flex items-center gap-1.5">
            {i > 0 && p - pages[i - 1] > 1 && <span className="text-muted px-1">…</span>}
            <Link
              href={riyadPath(p)}
              aria-current={p === page ? "page" : undefined}
              className={`${pill} tabular-nums ${p === page ? "border-emerald-deep bg-emerald-deep text-paper font-medium" : "border-line bg-card hover:border-gold"}`}
            >
              {p}
            </Link>
          </span>
        ))}
        {page < RIYAD_PAGES && (
          <Link href={riyadPath(page + 1)} className={`${pill} border-line bg-card hover:border-gold`} aria-label="Faqja tjetër">
            →
          </Link>
        )}
      </div>
      <p className="text-muted text-xs">
        Faqja {page} nga {RIYAD_PAGES}
      </p>
    </nav>
  );
}
