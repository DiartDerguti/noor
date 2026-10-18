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
  compare,
  showSurahHeaders = false,
  arabicOnly = false,
}: {
  groups: SurahGroup[];
  compare: boolean;
  showSurahHeaders?: boolean;
  arabicOnly?: boolean;
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
                    {surah.englishName}
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

            {arabicOnly ? (
              <p className="quran border-line bg-card rounded-[2rem] border px-6 py-8 text-justify text-[1.9rem] leading-[2.4] [text-align-last:center] sm:px-10 sm:text-[2.2rem]">
                {ayahs.map((a) => (
                  <span
                    key={a.number}
                    id={`ajeti-${a.numberInSurah}`}
                    className="scroll-mt-36"
                  >
                    {a.arabic}
                    <AyahNumber n={a.numberInSurah} />{" "}
                  </span>
                ))}
              </p>
            ) : (
              <ol className="divide-line divide-y">
                {ayahs.map((a) => (
                  <li
                    key={a.number}
                    id={`ajeti-${a.numberInSurah}`}
                    className="scroll-mt-36 py-8"
                  >
                    <p className="quran text-ink text-[1.9rem] sm:text-[2.25rem]">
                      {a.arabic}
                      <AyahNumber n={a.numberInSurah} />
                    </p>
                    <div className="mt-4 space-y-4">
                      {a.translations.map((t) => (
                        <div key={t.id}>
                          {compare && (
                            <p className="text-gold mb-1 text-xs font-medium tracking-wide uppercase">
                              {translationName(t.id)}
                            </p>
                          )}
                          <p className="text-ink/90 font-serif text-lg leading-relaxed">
                            {t.text}
                          </p>
                        </div>
                      ))}
                    </div>
                  </li>
                ))}
              </ol>
            )}
          </section>
        );
      })}
    </div>
  );
}
