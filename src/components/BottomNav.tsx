"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import Icon3D, { type Icon3DName } from "./Icon3D";

const ITEMS: { href: string; label: string; icon: Icon3DName }[] = [
  { href: "/", label: "Ballina", icon: "home" },
  { href: "/kurani", label: "Kurani", icon: "book" },
  { href: "/hadithe", label: "Hadithe", icon: "scroll" },
  { href: "/mburoja", label: "Mburoja", icon: "shield" },
  { href: "/meso", label: "Mëso", icon: "cap" },
];

export default function BottomNav() {
  const pathname = usePathname();

  // The Quran reader has its own bottom bar with previous/next.
  if (/^\/kurani\/.+/.test(pathname)) return null;

  return (
    <>
      <div className="h-[calc(4.25rem+env(safe-area-inset-bottom))] lg:hidden" aria-hidden />
      <nav
        aria-label="Navigimi kryesor"
        className="border-line/80 bg-paper/90 fixed inset-x-0 bottom-0 z-30 border-t pb-[env(safe-area-inset-bottom)] backdrop-blur-md lg:hidden"
      >
        <ul className="mx-auto grid h-[4.25rem] max-w-lg grid-cols-5">
          {ITEMS.map((item) => {
            const active = item.href === "/" ? pathname === "/" : pathname.startsWith(item.href);
            return (
              <li key={item.href}>
                <Link
                  href={item.href}
                  aria-current={active ? "page" : undefined}
                  className={`relative flex h-full flex-col items-center justify-center gap-1 text-[11px] font-medium transition-colors ${
                    active ? "text-emerald-deep" : "text-muted active:text-ink"
                  }`}
                >
                  <span
                    className={`bg-emerald-deep absolute top-0 h-0.5 rounded-full transition-all duration-300 ${active ? "w-8 opacity-100" : "w-0 opacity-0"}`}
                    aria-hidden
                  />
                  <span
                    className={`grid h-8 w-12 place-items-center rounded-full transition-colors duration-300 ${active ? "bg-emerald-soft" : ""}`}
                  >
                    <Icon3D
                      name={item.icon}
                      className={`size-6 transition-all duration-300 ${active ? "scale-110" : "opacity-75 grayscale-[35%]"}`}
                      still
                    />
                  </span>
                  {item.label}
                </Link>
              </li>
            );
          })}
        </ul>
      </nav>
    </>
  );
}
