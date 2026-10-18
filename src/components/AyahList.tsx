import Link from "next/link";
import {
  BASMALA_QPC,
  revelationLabel,
  translationName,
  type SurahGroup,
} from "@/lib/quran";

const ARABIC_DIGITS = "٠١٢٣٤٥٦٧٨٩";

export function AyahNumber({ n }: { n: number }) {
  return (
    <span className="text-gold mx-1">
      {String(n).replace(/\d/g, (d) => ARABIC_DIGITS[Number(d)])}
    </span>
  );
}

export default function AyahList({
  groups,
  showSurahHeaders = false,
}: {
  groups: SurahGroup[];
  showSurahHeaders?: boolean;
}) {
  return (
    <div className="space-y-6">
      {groups.map(({ surah, ayahs }) => {
        const starts = ayahs[0].numberInSurah === 1;
        return (
          <section key={surah.number}>
            {showSurahHeaders && (
              <Link
                href={`/kurani/${surah.number}`}
                className="border-line bg-card hover:border-gold mb-2 flex items-center justify-between gap-4 rounded-2xl border px-5 py-4 transition-colors"
              >
                <span>
                  <span className="block font-serif text-lg font-semibold">
                    {surah.englishName}{" "}
                    <span className="text-muted font-normal">({surah.albanianName})</span>
                  </span>
                  <span className="text-muted text-xs">
                    Sureja {surah.number} ·{" "}
                    {revelationLabel(surah.revelationType)} ·{" "}
                    {surah.numberOfAyahs} ajete
                  </span>
                </span>
                <span className="arabic text-emerald-deep text-2xl leading-none">
                  {surah.name.replace("سُورَةُ ", "")}
                </span>
              </Link>
            )}

            {starts && surah.number !== 1 && surah.number !== 9 && (
              <p className="quran text-gold my-6 text-center text-3xl">
                {BASMALA_QPC}
              </p>
            )}

            <ol className="divide-line divide-y">
              {ayahs.map((a) => (
                <li
                  key={a.number}
                  id={`ajeti-${a.numberInSurah}`}
                  className="scroll-mt-36 py-8 [content-visibility:auto] [contain-intrinsic-size:auto_260px]"
                >
                  <p className="quran text-ink text-[1.9rem] sm:text-[2.25rem]">
                    {a.arabic}
                    <AyahNumber n={a.numberInSurah} />
                  </p>
                  <div className="mt-4 space-y-4">
                    {a.translations.map((t) => (
                      <div key={t.id} data-tr-text={t.id}>
                        <p
                          data-tr-label
                          className="text-gold mb-1 text-xs font-medium tracking-wide uppercase"
                        >
                          {translationName(t.id)}
                        </p>
                        <p className="text-ink/90 font-serif text-lg leading-relaxed">
                          <span className="text-gold mr-1.5 font-sans text-sm font-medium tabular-nums">
                            {a.numberInSurah}.
                          </span>
                          {t.text}
                        </p>
                      </div>
                    ))}
                  </div>
                </li>
              ))}
            </ol>
          </section>
        );
      })}
    </div>
  );
}
