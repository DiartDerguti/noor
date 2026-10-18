"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  useEffect,
  useLayoutEffect,
  useRef,
  useState,
  useSyncExternalStore,
} from "react";
import Logo from "./Logo";
import Icon3D, { type Icon3DName } from "./Icon3D";

const NAV: { href: string; label: string; arabic: string; icon: Icon3DName }[] =
  [
    { href: "/kurani", label: "Kurani", arabic: "القرآن", icon: "book" },
    { href: "/hadithe", label: "Hadithe", arabic: "الحديث", icon: "scroll" },
    { href: "/meso", label: "Mëso", arabic: "تعلّم", icon: "cap" },
    { href: "/rreth", label: "Burimet", arabic: "المصادر", icon: "seal" },
  ];

function subscribeScroll(listener: () => void) {
  window.addEventListener("scroll", listener, { passive: true });
  return () => window.removeEventListener("scroll", listener);
}

export default function Header() {
  const pathname = usePathname();
  const scrolled = useSyncExternalStore(
    subscribeScroll,
    () => window.scrollY > 40,
    () => false,
  );
  const [open, setOpen] = useState(false);
  const navRef = useRef<HTMLElement>(null);
  const pillRef = useRef<HTMLSpanElement>(null);
  const activeIndex = NAV.findIndex((item) => pathname.startsWith(item.href));

  useLayoutEffect(() => {
    const nav = navRef.current;
    const pill = pillRef.current;
    if (!nav || !pill) return;

    const place = () => {
      const item =
        nav.querySelectorAll<HTMLElement>("[data-nav-item]")[activeIndex];
      if (!item) {
        pill.style.opacity = "0";
        return;
      }
      pill.style.opacity = "1";
      pill.style.width = `${item.offsetWidth}px`;
      pill.style.transform = `translateX(${item.offsetLeft}px)`;
    };

    place();
    const observer = new ResizeObserver(place);
    observer.observe(nav);
    requestAnimationFrame(() => pill.classList.add("transition-all"));
    return () => observer.disconnect();
  }, [activeIndex]);

  useEffect(() => {
    document.body.style.overflow = open ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [open]);

  return (
    <>
      <header
        className={`sticky top-0 z-30 border-b transition-colors duration-300 ${
          pathname === "/" && !scrolled && !open
            ? "border-transparent bg-transparent"
            : "border-line/70 bg-paper/85 backdrop-blur"
        }`}
      >
        <div className="mx-auto flex h-16 max-w-6xl items-center gap-4 px-4">
          <Link
            href="/"
            onClick={() => setOpen(false)}
            className="flex items-center gap-2.5"
          >
            <Logo className="size-10" />
            <span className="font-serif text-xl font-semibold tracking-tight">
              Noor
            </span>
          </Link>

          <nav
            ref={navRef}
            className="border-line bg-card/70 relative ml-auto hidden items-center gap-1 rounded-full border p-1 text-sm shadow-lg shadow-black/20 sm:flex"
          >
            <span
              ref={pillRef}
              aria-hidden
              className="bg-emerald-deep shadow-emerald-deep/25 absolute top-1 bottom-1 left-0 rounded-full opacity-0 shadow-md duration-500 ease-[cubic-bezier(.3,1.3,.5,1)]"
            />
            {NAV.map((item, i) => {
              const active = i === activeIndex;
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  data-nav-item
                  className={`group relative z-10 flex items-center gap-2 rounded-full py-1.5 pr-4 pl-2 font-medium whitespace-nowrap transition-colors duration-300 ${
                    active ? "text-paper" : "text-muted hover:text-ink"
                  }`}
                >
                  <span className="transition-transform duration-300 group-hover:-translate-y-0.5 group-hover:scale-110">
                    <Icon3D name={item.icon} className="size-7" still />
                  </span>
                  {item.label}
                </Link>
              );
            })}
          </nav>

          <button
            type="button"
            onClick={() => setOpen((o) => !o)}
            aria-label={open ? "Mbyll menunë" : "Hap menunë"}
            aria-expanded={open}
            className="relative ml-auto grid size-10 place-items-center rounded-full border border-white/50 bg-black/20 backdrop-blur sm:hidden"
          >
            <span
              className={`bg-ink absolute h-0.5 w-4.5 rounded-full transition-transform duration-300 ${
                open ? "rotate-45" : "-translate-y-1.5"
              }`}
            />
            <span
              className={`bg-ink absolute h-0.5 w-4.5 rounded-full transition-opacity ${open ? "opacity-0" : ""}`}
            />
            <span
              className={`bg-ink absolute h-0.5 w-4.5 rounded-full transition-transform duration-300 ${
                open ? "-rotate-45" : "translate-y-1.5"
              }`}
            />
          </button>
        </div>
      </header>

      <div
        className={`pattern bg-paper fixed inset-x-0 top-16 bottom-0 z-40 transition-all duration-300 sm:hidden ${
          open ? "visible opacity-100" : "invisible -translate-y-2 opacity-0"
        }`}
      >
        <nav className="flex flex-col gap-2 p-4">
          {NAV.map((item, i) => {
            const active = pathname.startsWith(item.href);
            return (
              <Link
                key={item.href}
                href={item.href}
                onClick={() => setOpen(false)}
                style={{ transitionDelay: open ? `${i * 50}ms` : "0ms" }}
                className={`flex items-center gap-4 rounded-2xl border px-4 py-3.5 transition-all duration-300 ${
                  open ? "translate-y-0 opacity-100" : "translate-y-3 opacity-0"
                } ${active ? "border-gold/60 bg-emerald-soft" : "border-line bg-card"}`}
              >
                <Icon3D name={item.icon} className="size-11" still />
                <span
                  className={`flex-1 font-serif text-2xl font-semibold ${active ? "text-emerald-deep" : ""}`}
                >
                  {item.label}
                </span>
                <span className="arabic text-gold text-xl leading-none">
                  {item.arabic}
                </span>
              </Link>
            );
          })}
        </nav>
      </div>
    </>
  );
}
