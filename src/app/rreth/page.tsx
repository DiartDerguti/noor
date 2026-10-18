import type { Metadata } from "next";
import { pageMeta } from "@/lib/site";
import { TRANSLATIONS } from "@/lib/quran";
import Icon3D, { type Icon3DName } from "@/components/Icon3D";

export const metadata: Metadata = pageMeta({
  title: "Burimet",
  description:
    "Nga vjen çdo tekst në Noor: Kurani, përkthimet shqip, hadithet, takvimi dhe kalendari hixhri.",
  path: "/rreth",
});

type Source = {
  icon: Icon3DName;
  title: string;
  text: string;
  items: { label: string; detail?: string; href?: string }[];
};

const SOURCES: Source[] = [
  {
    icon: "book",
    title: "Kurani",
    text: "Teksti arab dhe fontet e Mushafit të Medinës, me përkthimet shqip ajet për ajet.",
    items: [
      {
        label: "Teksti arab dhe faqet e Mushafit",
        detail: "Quran.com",
        href: "https://quran.com",
      },
      {
        label: "Fontet e Mushafit",
        detail: "Kompleksi Mbreti Fahd (KFGQPC)",
        href: "https://qurancomplex.gov.sa",
      },
      ...TRANSLATIONS.map((t) => ({
        label: `Përkthimi i ${t.name}`,
        detail: "Tanzil, përmes quran-api",
        href: "https://tanzil.net/trans/",
      })),
    ],
  },
  {
    icon: "scroll",
    title: "Hadithet",
    text: "Vetëm hadithet që transmetohen nga Buhariu, Muslimi ose të dy bashkë. Ato nga koleksionet e tjera nuk përfshihen.",
    items: [
      {
        label: "Përkthimi, shpjegimi dhe mësimet",
        detail: "Enciklopedia e Haditheve Profetike të Përkthyera",
        href: "https://hadeethenc.com/sq/home",
      },
    ],
  },
  {
    icon: "mosque",
    title: "Takvimi",
    text: "Kohët e namazit llogariten sipas metodës Dijanet për çdo qytet dhe mund të ndryshojnë 1–2 minuta nga takvimi zyrtar.",
    items: [
      {
        label: "Llogaritja e kohëve",
        detail: "Aladhan",
        href: "https://aladhan.com",
      },
      {
        label: "Takvimi zyrtar për Kosovë",
        detail: "takvimi-ks.com",
        href: "https://takvimi-ks.com",
      },
    ],
  },
  {
    icon: "calendar",
    title: "Kalendari hixhri",
    text: "Data hixhri dhe festat sipas kalendarit Dijanet. Data e saktë e Ramazanit dhe e Bajrameve shpallet nga Bashkësia Islame.",
    items: [
      {
        label: "Konvertimi i datave",
        detail: "Aladhan",
        href: "https://aladhan.com",
      },
    ],
  },
];

const PHOTOS = [
  {
    place: "Xhamia e Madhe (Fatih), Prishtinë",
    credit: "Fikret Ahmeti · CC BY-SA 4.0",
    href: "https://commons.wikimedia.org/wiki/File:Sultan_Mehmet_Fatih_Mosque_2.jpg",
  },
  {
    place: "Xhamia e Sinan Pashës, Prizren",
    credit: "Ravi Dwivedi · CC BY-SA 4.0",
    href: "https://commons.wikimedia.org/wiki/File:Sinan_Pasha_Mosque,_Prizren,_Kosovo.jpg",
  },
  {
    place: "Xhamia e Jahja Pashës, Shkup",
    credit: "Mitatos · CC BY-SA 3.0",
    href: "https://commons.wikimedia.org/wiki/File:%D0%88%D0%B0%D1%85%D1%98%D0%B0-%D0%BF%D0%B0%D1%88%D0%B0.jpg",
  },
  {
    place: "Xhamia e Et'hem Beut, Tiranë",
    credit: "Yastay · CC BY 4.0",
    href: "https://commons.wikimedia.org/wiki/File:Detalle_Interior_de_la_Mezquita_de_Et%27hem_Bey_01.jpg",
  },
];

export default function AboutPage() {
  return (
    <div className="mx-auto max-w-6xl px-4">
      <header className="pattern relative -mx-4 overflow-hidden px-4 pt-14 pb-16 sm:rounded-b-[2.5rem] sm:pt-20">
        <div className="to-paper absolute inset-0 bg-gradient-to-b from-transparent" />
        <div className="relative max-w-2xl">
          <Icon3D name="seal" className="size-16" />
          <h1 className="mt-6 font-serif text-4xl font-semibold tracking-tight sm:text-5xl">
            Burimet
          </h1>
          <p className="text-muted mt-4 text-lg leading-relaxed">
            Noor nuk shkruan përkthime, shpjegime apo fetva të veta. Çdo tekst
            merret nga një burim i njohur dhe tregohet nga vjen.
          </p>
        </div>
      </header>

      <div className="grid gap-6 md:grid-cols-2">
        {SOURCES.map((s) => (
          <section
            key={s.title}
            className="border-line bg-card flex flex-col rounded-[2rem] border p-6 sm:p-8"
          >
            <div className="flex items-center gap-4">
              <Icon3D name={s.icon} className="size-12" still />
              <h2 className="font-serif text-2xl font-semibold">{s.title}</h2>
            </div>
            <p className="text-muted mt-4 leading-relaxed">{s.text}</p>
            <ul className="divide-line border-line mt-6 divide-y border-t">
              {s.items.map((item) => (
                <li key={item.label}>
                  <a
                    href={item.href}
                    target="_blank"
                    rel="noreferrer"
                    className="group flex items-center justify-between gap-4 py-3.5"
                  >
                    <span>
                      <span className="block text-sm font-medium">
                        {item.label}
                      </span>
                      {item.detail && (
                        <span className="text-muted block text-sm">
                          {item.detail}
                        </span>
                      )}
                    </span>
                    <span className="text-muted group-hover:text-gold transition-colors">
                      ↗
                    </span>
                  </a>
                </li>
              ))}
            </ul>
          </section>
        ))}
      </div>

      <section className="border-line bg-card mt-16 rounded-[2rem] border p-6 sm:p-8">
        <h2 className="font-serif text-2xl font-semibold">Fotot</h2>
        <p className="text-muted mt-2">
          Fotot e xhamive në faqen kryesore janë nga Wikimedia Commons, me
          licencë të lirë.
        </p>
        <ul className="mt-6 grid gap-x-8 sm:grid-cols-2">
          {PHOTOS.map((p) => (
            <li key={p.place} className="border-line border-t">
              <a
                href={p.href}
                target="_blank"
                rel="noreferrer"
                className="group flex items-center justify-between gap-4 py-3.5"
              >
                <span>
                  <span className="block text-sm font-medium">{p.place}</span>
                  <span className="text-muted block text-sm">{p.credit}</span>
                </span>
                <span className="text-muted group-hover:text-gold transition-colors">
                  ↗
                </span>
              </a>
            </li>
          ))}
        </ul>
      </section>
    </div>
  );
}
