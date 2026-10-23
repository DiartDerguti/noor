import { BASMALA_QPC, type SurahMeta } from "@/lib/quran";
import { pageFontUrl, type MushafPageData } from "@/lib/mushaf";

export default function MushafPage({ data, surahs }: { data: MushafPageData; surahs: SurahMeta[] }) {
  const { page } = data;
  const font = `qcf-p${page}`;
  const centered = page <= 2;
  const name = (n: number) => surahs.find((s) => s.number === n);

  return (
    <article id={`faqja-${page}`} className="@container mx-auto w-full max-w-[640px] scroll-mt-24">
      <style>{`@font-face{font-family:'${font}';src:url('${pageFontUrl(page)}') format('woff2');font-display:block}`}</style>

      <div className="rounded-[2rem] border border-line bg-card px-[4cqw] py-[5cqw] shadow-xl shadow-black/30">
        <div className={`flex flex-col ${centered ? "justify-center py-[6cqw]" : ""}`} dir="rtl">
          {data.lines.map((line) => {
            if (line.kind === "header") {
              const s = name(line.chapter);
              return (
                <div
                  key={line.number}
                  className="my-[1cqw] flex h-[9.5cqw] items-center justify-between rounded-xl border border-gold/50 bg-gold-soft px-[4cqw]"
                >
                  <span className="text-[2.6cqw] text-gold/80" dir="ltr">
                    {s ? `${s.numberOfAyahs} ajete` : ""}
                  </span>
                  <span className="arabic text-[4.6cqw] leading-none text-gold">{s?.name ?? ""}</span>
                  <span className="text-[2.6cqw] text-gold/80" dir="ltr">
                    {s?.englishName ?? ""}
                  </span>
                </div>
              );
            }
            if (line.kind === "basmala") {
              return (
                <p key={line.number} className="quran h-[9.5cqw] text-center text-[5cqw] leading-[9.5cqw] text-ink">
                  {BASMALA_QPC}
                </p>
              );
            }
            return (
              <p
                key={line.number}
                style={{ fontFamily: `'${font}'` }}
                className={`flex h-[9.5cqw] items-center text-[5.4cqw] whitespace-nowrap text-ink ${
                  centered ? "justify-center gap-[1.2cqw]" : "justify-between"
                }`}
              >
                {line.words.map((w, i) => (
                  <span key={i} className={w.end ? "text-gold" : ""}>
                    {w.code}
                  </span>
                ))}
              </p>
            );
          })}
        </div>

        <p className="mt-[3cqw] text-center text-[2.6cqw] text-muted tabular-nums">{page}</p>
      </div>
    </article>
  );
}

export function MushafPages({ pages, surahs }: { pages: MushafPageData[]; surahs: SurahMeta[] }) {
  return (
    <div className="space-y-6">
      {pages.map((p) => (
        <MushafPage key={p.page} data={p} surahs={surahs} />
      ))}
    </div>
  );
}
