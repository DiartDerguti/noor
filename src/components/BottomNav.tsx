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

  const activeIndex = ITEMS.findIndex((item) => (item.href === "/" ? pathname === "/" : pathname.startsWith(item.href)));

  return (
    <>
      <div className="h-[calc(5.5rem+env(safe-area-inset-bottom))] lg:hidden" aria-hidden />
      <nav
        aria-label="Navigimi kryesor"
        className="fixed inset-x-3 bottom-[calc(0.75rem+env(safe-area-inset-bottom))] z-30 mx-auto max-w-md rounded-[1.75rem] border border-white/10 bg-[#16211c]/55 p-1.5 shadow-[0_12px_40px_-8px_rgb(0_0_0/0.7),inset_0_1px_0_rgb(255_255_255/0.06)] backdrop-blur-xl backdrop-saturate-150 lg:hidden"
      >
        <ul className="relative grid h-[3.75rem] grid-cols-5">
          <li
            aria-hidden
            className={`absolute inset-y-0 left-0 w-1/5 transition-[transform,opacity] duration-500 ease-[cubic-bezier(.3,1.25,.5,1)] ${
              activeIndex < 0 ? "opacity-0" : "opacity-100"
            }`}
            style={{ transform: `translateX(${Math.max(activeIndex, 0) * 100}%)` }}
          >
            <span className="bg-emerald-soft/90 absolute inset-0 rounded-[1.35rem] border border-white/5" />
            <span className="bg-emerald-deep absolute bottom-1 left-1/2 h-[3px] w-6 -translate-x-1/2 rounded-full shadow-[0_0_10px_rgb(127_207_170/0.7)]" />
          </li>
          {ITEMS.map((item, i) => {
            const active = i === activeIndex;
            return (
              <li key={item.href} className="relative">
                <Link
                  href={item.href}
                  aria-current={active ? "page" : undefined}
                  className={`flex h-full flex-col items-center justify-center gap-0.5 pb-1 text-[11px] font-medium transition-colors duration-300 ${
                    active ? "text-emerald-deep" : "text-muted active:text-ink"
                  }`}
                >
                  <Icon3D
                    name={item.icon}
                    className={`size-6 transition-all duration-500 ${active ? "-translate-y-0.5 scale-110" : "opacity-75 grayscale-[35%]"}`}
                    still
                  />
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
