import type { Hadith } from "@/lib/hadith";

function Label({ children }: { children: React.ReactNode }) {
  return <h3 className="mb-2 text-xs font-medium tracking-[0.15em] text-gold uppercase">{children}</h3>;
}

export default function HadithAnswer({ hadith, compact = false }: { hadith: Hadith; compact?: boolean }) {
  return (
    <div className="space-y-6">
      {!compact && hadith.arabic && <p className="arabic text-2xl sm:text-[1.65rem]">{hadith.arabic}</p>}

      <section>
        <Label>Hadithi</Label>
        <p className="font-serif text-lg leading-relaxed whitespace-pre-line">{hadith.text}</p>
      </section>

      {hadith.explanation && (
        <section>
          <Label>Shpjegimi</Label>
          <p className="leading-relaxed whitespace-pre-line text-ink/85">{hadith.explanation}</p>
        </section>
      )}

      {hadith.lessons.length > 0 && (
        <section>
          <Label>Çfarë mësojmë?</Label>
          <ul className="space-y-2">
            {hadith.lessons.map((lesson, i) => (
              <li key={i} className="flex gap-3 leading-relaxed text-ink/85">
                <span className="mt-2.5 size-1.5 shrink-0 rotate-45 bg-emerald-deep" />
                {lesson}
              </li>
            ))}
          </ul>
        </section>
      )}
    </div>
  );
}
