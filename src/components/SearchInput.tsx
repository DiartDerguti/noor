"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { useEffect, useRef, useState, useTransition } from "react";

export default function SearchInput({ basePath }: { basePath: string }) {
  const router = useRouter();
  const q = useSearchParams().get("q") ?? "";
  const [value, setValue] = useState(q);
  const [lastQ, setLastQ] = useState(q);
  if (q !== lastQ) {
    setLastQ(q);
    if (!q) setValue("");
  }
  const [pending, startTransition] = useTransition();
  const timer = useRef<ReturnType<typeof setTimeout>>(undefined);

  useEffect(() => () => clearTimeout(timer.current), []);

  function onChange(next: string) {
    setValue(next);
    clearTimeout(timer.current);
    timer.current = setTimeout(() => {
      const q = next.trim();
      startTransition(() => {
        router.replace(q ? `${basePath}/kerko?q=${encodeURIComponent(q)}` : basePath, { scroll: false });
      });
    }, 400);
  }

  return (
    <div className="relative mb-6">
      <input
        type="search"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder="Kërko..."
        className="w-full rounded-2xl border border-line bg-card px-5 py-3.5 pr-12 outline-none placeholder:text-muted focus:border-gold"
      />
      {pending && (
        <span className="absolute top-1/2 right-5 size-4 -translate-y-1/2 animate-spin rounded-full border-2 border-gold border-t-transparent" />
      )}
    </div>
  );
}
