"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import Logo from "./Logo";

const NAV = [
  { href: "/kurani", label: "Kurani" },
  { href: "/hadithe", label: "Hadithe" },
  { href: "/meso", label: "Mëso" },
  { href: "/rreth", label: "Burimet" },
];

export default function Header() {
  const pathname = usePathname();

  return (
    <header className="sticky top-0 z-30 border-b border-line/70 bg-paper/85 backdrop-blur">
      <div className="mx-auto flex h-16 max-w-5xl items-center gap-4 px-4">
        <Link href="/" className="flex items-center gap-2.5">
          <Logo className="size-10" />
          <span className="font-serif text-xl font-semibold tracking-tight">Noor</span>
        </Link>

        <nav className="ml-auto flex items-center gap-1 overflow-x-auto text-sm">
          {NAV.map((item) => {
            const active = pathname.startsWith(item.href);
            return (
              <Link
                key={item.href}
                href={item.href}
                className={`rounded-full px-3 py-1.5 whitespace-nowrap transition-colors ${
                  active ? "bg-emerald-soft font-medium text-emerald-deep" : "text-muted hover:text-ink"
                }`}
              >
                {item.label}
              </Link>
            );
          })}
        </nav>
      </div>
    </header>
  );
}
