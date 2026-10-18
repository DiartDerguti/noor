import Link from "next/link";
import {
  SEARCH_LIMIT,
  SOURCE_LABEL,
  hadithAsText,
  type Category,
  type Hadith,
} from "@/lib/hadith";
import HadithAnswer from "./HadithAnswer";
import ShareBar from "./ShareBar";
import { SITE_URL } from "@/lib/site";
import SourceBadge from "./SourceBadge";
import CopyButton from "./CopyButton";

export function topicPath(id: string, page = 1) {
  return page > 1 ? `/hadithe/tema/${id}/faqe/${page}` : `/hadithe/tema/${id}`;
}

export default function HadithTopic({
  category,
  hadiths,
  page = 1,
  lastPage = 1,
  query = "",
  matches = 0,
}: {
  category: Category;
  hadiths: Hadith[];
  page?: number;
  lastPage?: number;
  query?: string;
  matches?: number;
}) {
  const base = topicPath(category.id);

  return (
    <>
      {query && (
        <p className="text-muted mb-4 text-sm">
          {hadiths.length} rezultate për „{query}“
          {matches > SEARCH_LIMIT &&
            " · shfaqen të parat, shto një fjalë tjetër për t'i ngushtuar"}
          {" · "}
          <Link
            href={base}
            className="text-emerald-deep underline-offset-4 hover:underline"
          >
            Pastro kërkimin
          </Link>
        </p>
      )}

      <div className="space-y-3">
        {hadiths.map((h) => (
          <details
            key={h.id}
            className="group border-line bg-card open:border-gold/60 rounded-2xl border"
          >
            <summary className="flex list-none items-start gap-4 p-5 [&::-webkit-details-marker]:hidden">
              <span className="flex-1">
                <span className="block font-serif text-lg leading-snug">
                  {h.title}
                </span>
                <span className="mt-2 block">
                  <SourceBadge source={h.source} />
                </span>
              </span>
              <span className="flex items-center gap-1">
                <CopyButton
                  text={`${h.title}\n— ${SOURCE_LABEL[h.source]}`}
                  label="Kopjo hadithin"
                />
                <span className="text-muted grid size-8 place-items-center transition-transform group-open:rotate-45">
                  +
                </span>
              </span>
            </summary>
            <div className="border-line border-t px-5 pt-5 pb-6">
              <HadithAnswer hadith={h} compact />
              <div className="border-line mt-6 flex flex-wrap items-center justify-between gap-4 border-t pt-5">
                <Link
                  href={`/hadithe/${h.id}`}
                  className="text-emerald-deep text-sm font-medium underline-offset-4 hover:underline"
                >
                  Lexo më shumë →
                </Link>
                <ShareBar
                  compact
                  url={`${SITE_URL}/hadithe/${h.id}`}
                  text={h.title}
                  source={SOURCE_LABEL[h.source]}
                  card={`/hadithe/${h.id}/karta`}
                  full={hadithAsText(h, `${SITE_URL}/hadithe/${h.id}`)}
                />
              </div>
            </div>
          </details>
        ))}
      </div>

      {hadiths.length === 0 && (
        <p className="border-line text-muted rounded-2xl border border-dashed p-8 text-center">
          {query
            ? "Nuk u gjet asnjë hadith nga Buhariu ose Muslimi. Provo një fjalë tjetër."
            : "Në këtë faqe nuk ka hadithe nga Buhariu ose Muslimi. Provo faqen tjetër."}
        </p>
      )}

      {!query && lastPage > 1 && (
        <nav className="mt-8 flex items-center justify-between text-sm">
          {page > 1 ? (
            <Link
              href={topicPath(category.id, page - 1)}
              className="border-line bg-card hover:border-gold rounded-full border px-4 py-2"
            >
              ← Mbrapa
            </Link>
          ) : (
            <span />
          )}
          <span className="text-muted">
            Faqja {page} nga {lastPage}
          </span>
          {page < lastPage ? (
            <Link
              href={topicPath(category.id, page + 1)}
              className="border-line bg-card hover:border-gold rounded-full border px-4 py-2"
            >
              Vazhdo →
            </Link>
          ) : (
            <span />
          )}
        </nav>
      )}
    </>
  );
}
