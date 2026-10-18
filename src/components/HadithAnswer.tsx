import type { Hadith } from "@/lib/hadith";

function Label({ children }: { children: React.ReactNode }) {
  return (
    <h3 className="text-gold mb-2 text-xs font-medium tracking-[0.15em] uppercase">
      {children}
    </h3>
  );
}

export default function HadithAnswer({
  hadith,
  compact = false,
  hideSource = false,
}: {
  hadith: Hadith;
  compact?: boolean;
  hideSource?: boolean;
}) {
  return (
    <div className="space-y-6">
      {!compact && hadith.arabic && (
        <p className="arabic text-2xl sm:text-[1.65rem]">{hadith.arabic}</p>
      )}

      <section>
        <Label>Hadithi</Label>
        <p className="font-serif text-lg leading-relaxed whitespace-pre-line">
          {hadith.text}
        </p>
      </section>

      {hadith.explanation && (
        <section>
          <Label>Shpjegimi</Label>
          <p className="text-ink/85 leading-relaxed whitespace-pre-line">
            {hadith.explanation}
          </p>
        </section>
      )}

      {hadith.lessons.length > 0 && (
        <section>
          <Label>Çfarë mësojmë?</Label>
          <ul className="space-y-2">
            {hadith.lessons.map((lesson, i) => (
              <li key={i} className="text-ink/85 flex gap-3 leading-relaxed">
                <span className="bg-emerald-deep mt-2.5 size-1.5 shrink-0 rotate-45" />
                {lesson}
              </li>
            ))}
          </ul>
        </section>
      )}

      {!hideSource && (
        <section className="border-line bg-paper/60 rounded-2xl border p-4 text-sm">
          <Label>Burimi</Label>
          <dl className="text-muted grid gap-1.5 sm:grid-cols-[auto_1fr] sm:gap-x-4">
            <dt>Transmetimi</dt>
            <dd className="text-ink">
              {hadith.attribution} · {hadith.grade}
            </dd>
            <dt>Shpjegimi dhe mësimet</dt>
            <dd className="text-ink">
              Enciklopedia e Haditheve Profetike të Përkthyera (HadeethEnc)
            </dd>
          </dl>
          <a
            href={hadith.url}
            target="_blank"
            rel="noreferrer"
            className="text-emerald-deep mt-3 inline-block font-medium underline-offset-4 hover:underline"
          >
            Shiko hadithin në HadeethEnc ↗
          </a>
        </section>
      )}
    </div>
  );
}
