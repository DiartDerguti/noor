"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { COUNTRIES, findCity } from "@/lib/prayer";

const simplify = (s: string) =>
  s
    .toLowerCase()
    .normalize("NFD")
    .replace(/[^a-z]/g, "");

export default function CityPicker({
  value,
  onChange,
}: {
  value: string;
  onChange: (id: string) => void;
}) {
  const [open, setOpen] = useState(false);
  const [search, setSearch] = useState("");
  const ref = useRef<HTMLDivElement>(null);
  const { city, country } = findCity(value)!;

  useEffect(() => {
    if (!open) return;
    const close = (e: MouseEvent | KeyboardEvent) => {
      if (
        e instanceof KeyboardEvent
          ? e.key === "Escape"
          : !ref.current?.contains(e.target as Node)
      )
        setOpen(false);
    };
    document.addEventListener("mousedown", close);
    document.addEventListener("keydown", close);
    return () => {
      document.removeEventListener("mousedown", close);
      document.removeEventListener("keydown", close);
    };
  }, [open]);

  const groups = useMemo(() => {
    const q = simplify(search);
    return COUNTRIES.map((c) => ({
      ...c,
      cities: c.cities.filter(
        (ct) =>
          !q || simplify(ct.name).includes(q) || simplify(c.name).includes(q),
      ),
    })).filter((c) => c.cities.length > 0);
  }, [search]);

  return (
    <div ref={ref} className="relative w-full sm:w-auto">
      <button
        type="button"
        onClick={() => {
          setOpen((o) => !o);
          setSearch("");
        }}
        aria-haspopup="listbox"
        aria-expanded={open}
        className={`bg-paper/60 flex w-full items-center gap-2.5 rounded-full border py-2 pr-3 pl-2.5 text-left transition-colors sm:w-auto ${
          open ? "border-gold" : "border-line hover:border-gold/60"
        }`}
      >
        <svg
          viewBox="0 0 24 24"
          className="text-gold size-4"
          fill="currentColor"
          aria-hidden
        >
          <path d="M12 2a7 7 0 0 0-7 7c0 5.2 7 13 7 13s7-7.8 7-13a7 7 0 0 0-7-7Zm0 9.5A2.5 2.5 0 1 1 12 6.5a2.5 2.5 0 0 1 0 5Z" />
        </svg>
        <span className="leading-tight">
          <span className="block text-sm font-medium">{city.name}</span>
          <span className="text-muted block text-[11px]">{country.name}</span>
        </span>
        <svg
          viewBox="0 0 24 24"
          className={`text-muted ml-auto size-4 transition-transform sm:ml-1 ${open ? "rotate-180" : ""}`}
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          aria-hidden
        >
          <path d="m6 9 6 6 6-6" />
        </svg>
      </button>

      {open && (
        <div className="border-line bg-card absolute right-0 left-0 z-40 mt-2 w-auto overflow-hidden rounded-2xl border shadow-2xl shadow-black/50 sm:left-auto sm:w-72">
          <div className="border-line border-b p-2">
            <input
              autoFocus
              type="search"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Kërko qytetin..."
              className="bg-paper/70 placeholder:text-muted w-full rounded-xl px-3 py-2 text-sm outline-none"
            />
          </div>
          <div role="listbox" className="max-h-72 overflow-y-auto p-1.5">
            {groups.map((c) => (
              <div key={c.name} className="mb-1">
                <p className="bg-card text-gold sticky top-0 px-2.5 pt-2 pb-1 text-[11px] font-medium tracking-[0.15em] uppercase">
                  {c.name}
                </p>
                {c.cities.map((ct) => {
                  const selected = ct.id === value;
                  return (
                    <button
                      key={ct.id}
                      type="button"
                      role="option"
                      aria-selected={selected}
                      onClick={() => {
                        onChange(ct.id);
                        setOpen(false);
                      }}
                      className={`flex w-full items-center justify-between rounded-xl px-2.5 py-2 text-left text-sm transition-colors ${
                        selected
                          ? "bg-emerald-soft text-emerald-deep"
                          : "hover:bg-paper/70"
                      }`}
                    >
                      {ct.name}
                      {selected && (
                        <svg
                          viewBox="0 0 24 24"
                          className="size-4"
                          fill="none"
                          stroke="currentColor"
                          strokeWidth="2.5"
                          aria-hidden
                        >
                          <path d="m5 12 5 5 9-10" />
                        </svg>
                      )}
                    </button>
                  );
                })}
              </div>
            ))}
            {groups.length === 0 && (
              <p className="text-muted px-3 py-6 text-center text-sm">
                Asnjë qytet.
              </p>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
