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
    text: "Temat përmbajnë vetëm hadithet që transmetohen nga Buhariu, Muslimi ose të dy bashkë. Rijadus Salihin i Imam Neveviut shfaqet si koleksion më vete, me transmetuesin e secilit hadith.",
    items: [
      {
        label: "Përkthimi, shpjegimi dhe mësimet",
        detail: "Enciklopedia e Haditheve Profetike të Përkthyera",
        href: "https://hadeethenc.com/sq/home",
      },
      {
        label: "Rijadus Salihin në shqip",
        detail: "mburoja.al/hadithe",
        href: "https://mburoja.al/hadithe/",
      },
    ],
  },
  {
    icon: "shield",
    title: "Mburoja e Muslimanit",
    text: "Lutjet e librit “Hisnul Muslim” me tekst arabisht, transliterim, përkthim shqip, burim dhe audio, të marra pa ndryshime.",
    items: [
      {
        label: "Teksti dhe incizimet audio",
        detail: "mburojaemuslimanit.com",
        href: "https://mburojaemuslimanit.com",
      },
    ],
  },
  {
    icon: "star",
    title: "99 Emrat e Allahut",
    text: "Emrat me shkrim arab, transliterimin, kuptimin dhe një shpjegim të shkurtër në shqip.",
    items: [
      {
        label: "Emrat dhe kuptimet",
        detail: "mburoja.al/99emrat",
        href: "https://mburoja.al/99emrat/",
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
    </div>
  );
}
