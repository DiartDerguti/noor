import Link from "next/link";
import Logo from "./Logo";
import InstallApp from "./InstallApp";

const COLUMNS = [
  {
    title: "Lexo",
    links: [
      { href: "/kurani", label: "Kurani" },
      { href: "/kurani/xhuz/1", label: "Sipas xhuzit" },
      { href: "/kurani/faqe/1", label: "Sipas faqes" },
      { href: "/takvimi", label: "Kohët e namazit" },
    ],
  },
  {
    title: "Mëso",
    links: [
      { href: "/hadithe", label: "Hadithe" },
      { href: "/hadithe/rijadus-salihin", label: "Rijadus Salihin" },
      { href: "/mburoja", label: "Mburoja e Muslimanit" },
      { href: "/emrat", label: "99 Emrat e Allahut" },
      { href: "/meso", label: "Kuizi" },
      { href: "/rreth", label: "Burimet" },
    ],
  },
  {
    title: "Burimet",
    links: [
      { href: "https://quran.com", label: "Quran.com" },
      { href: "https://tanzil.net", label: "Tanzil" },
      { href: "https://hadeethenc.com", label: "HadeethEnc" },
      { href: "https://mburojaemuslimanit.com", label: "Mburoja e Muslimanit" },
      { href: "https://mburoja.al", label: "Mburoja.al" },
      { href: "https://aladhan.com", label: "Aladhan" },
    ],
  },
];

export default function Footer() {
  return (
    <footer className="relative mt-8 border-t border-line sm:mt-24">
      <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-gold/50 to-transparent" />

      <div className="mx-auto grid max-w-6xl gap-10 px-4 py-12 sm:grid-cols-2 lg:grid-cols-[1.4fr_1fr_1fr_1fr]">
        <div>
          <Link href="/" className="inline-flex items-center gap-3">
            <Logo className="size-11" />
            <span>
              <span className="block font-serif text-xl font-semibold">Noor</span>
              <span className="arabic block text-left text-sm leading-none text-gold">نور</span>
            </span>
          </Link>
          <p className="mt-4 max-w-xs text-sm leading-relaxed text-muted">
            Kurani në shqip dhe hadithe të sakta nga Buhariu e Muslimi, nga burime zyrtare.
          </p>
          <InstallApp className="mt-5" />
        </div>

        {COLUMNS.map((col) => (
          <nav key={col.title}>
            <h2 className="text-xs font-medium tracking-[0.2em] text-gold uppercase">{col.title}</h2>
            <ul className="mt-4 space-y-2.5 text-sm">
              {col.links.map((l) => {
                const external = l.href.startsWith("http");
                return (
                  <li key={l.href}>
                    <Link
                      href={l.href}
                      {...(external ? { target: "_blank", rel: "noreferrer" } : {})}
                      className="text-muted transition-colors hover:text-ink"
                    >
                      {l.label}
                      {external && " ↗"}
                    </Link>
                  </li>
                );
              })}
            </ul>
          </nav>
        ))}
      </div>

      <div className="border-t border-line">
        <div className="mx-auto flex max-w-6xl flex-col gap-2 px-4 py-5 text-xs text-muted sm:flex-row sm:items-center sm:justify-between">
          <p>© {new Date().getFullYear()} Noor. Tekstet u përkasin përkthyesve dhe burimeve përkatëse.</p>
          <p className="arabic text-left text-sm text-gold/80">وَٱللَّهُ أَعْلَمُ</p>
        </div>
      </div>
    </footer>
  );
}
