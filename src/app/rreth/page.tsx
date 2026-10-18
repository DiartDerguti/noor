import type { Metadata } from "next";
import PageHeading from "@/components/PageHeading";
import { TRANSLATIONS } from "@/lib/quran";

export const metadata: Metadata = { title: "Burimet" };

export default function AboutPage() {
  return (
    <div className="mx-auto max-w-2xl px-4">
      <PageHeading
        title="Burimet"
        text="Noor nuk shkruan përkthime apo komente të veta. Gjithçka merret drejtpërdrejt nga burime të njohura dhe tregohet nga vjen."
      />

      <div className="space-y-6">
        <section className="rounded-3xl border border-line bg-card p-6">
          <h2 className="font-serif text-xl font-semibold">Kurani</h2>
          <p className="mt-2 leading-relaxed text-muted">
            Teksti arab (rasm uthmani) dhe përkthimet shqip merren nga{" "}
            <a className="text-emerald-deep underline-offset-4 hover:underline" href="https://alquran.cloud">
              alquran.cloud
            </a>
            :
          </p>
          <ul className="mt-3 space-y-1">
            {TRANSLATIONS.map((t) => (
              <li key={t.id} className="flex items-center gap-2">
                <span className="size-1.5 rotate-45 bg-gold" />
                {t.name}
              </li>
            ))}
          </ul>
        </section>

        <section className="rounded-3xl border border-line bg-card p-6">
          <h2 className="font-serif text-xl font-semibold">Hadithet</h2>
          <p className="mt-2 leading-relaxed text-muted">
            Hadithet, shpjegimet dhe mësimet merren nga{" "}
            <a className="text-emerald-deep underline-offset-4 hover:underline" href="https://hadeethenc.com">
              Enciklopedia e Haditheve të Përkthyera (HadeethEnc)
            </a>
            . Shfaqen vetëm ato që transmetohen nga Buhariu, Muslimi ose të dy bashkë (Muttefek alejhi). Hadithet nga
            koleksionet e tjera nuk përfshihen.
          </p>
        </section>
      </div>
    </div>
  );
}
