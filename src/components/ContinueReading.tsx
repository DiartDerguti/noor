"use client";

import Link from "next/link";
import { useEffect, useSyncExternalStore } from "react";

export const LAST_READ_KEY = "noor:last-read";

type LastRead = { number: number; name: string };

function read(): string | null {
  try {
    return localStorage.getItem(LAST_READ_KEY);
  } catch {
    return null;
  }
}

export default function ContinueReading() {
  const raw = useSyncExternalStore(
    () => () => {},
    read,
    () => null,
  );
  if (!raw) return null;

  let last: LastRead;
  try {
    last = JSON.parse(raw);
  } catch {
    return null;
  }

  return (
    <Link
      href={`/kurani/${last.number}`}
      className="mt-6 inline-flex items-center gap-2 text-sm text-muted underline-offset-4 hover:text-ink hover:underline"
    >
      Vazhdo leximin: <span className="font-medium text-ink">{last.name}</span> →
    </Link>
  );
}

export function SaveLastRead({ number, name }: LastRead) {
  useEffect(() => {
    try {
      localStorage.setItem(LAST_READ_KEY, JSON.stringify({ number, name }));
    } catch {}
  }, [number, name]);
  return null;
}
