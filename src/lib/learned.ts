"use client";

import { useSyncExternalStore } from "react";

const EMPTY: string[] = [];

// A list of learned item ids kept in localStorage, shared by every component that reads the same key.
export function learnedStore(key: string) {
  const listeners = new Set<() => void>();
  let cache: string[] | null = null;

  function get() {
    if (cache) return cache;
    try {
      cache = (JSON.parse(localStorage.getItem(key) ?? "[]") as unknown[]).map(String);
    } catch {
      cache = [];
    }
    return cache;
  }

  function set(next: string[]) {
    cache = next;
    try {
      localStorage.setItem(key, JSON.stringify(next));
    } catch {}
    listeners.forEach((l) => l());
  }

  return {
    toggle(id: string) {
      const list = get();
      set(list.includes(id) ? list.filter((x) => x !== id) : [...list, id]);
    },
    add(id: string) {
      const list = get();
      if (!list.includes(id)) set([...list, id]);
    },
    use() {
      return useSyncExternalStore(
        (l) => {
          listeners.add(l);
          return () => listeners.delete(l);
        },
        get,
        () => EMPTY,
      );
    },
  };
}

export function shuffle<T>(list: T[]) {
  const a = [...list];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}
