"use client";

import { useSyncExternalStore } from "react";

const FAV_KEY = "noor:hisn-fav";

function read<T>(key: string, fallback: T): T {
  try {
    const raw = localStorage.getItem(key);
    return raw === null ? fallback : (JSON.parse(raw) as T);
  } catch {
    return fallback;
  }
}

function write(key: string, value: unknown) {
  try {
    localStorage.setItem(key, JSON.stringify(value));
  } catch {}
}

const listeners = new Set<() => void>();
function subscribe(listener: () => void) {
  listeners.add(listener);
  const onStorage = (e: StorageEvent) => {
    if (e.key === FAV_KEY) {
      favCache = null;
      listener();
    }
  };
  window.addEventListener("storage", onStorage);
  return () => {
    listeners.delete(listener);
    window.removeEventListener("storage", onStorage);
  };
}
const emit = () => listeners.forEach((l) => l());

let favCache: number[] | null = null;
const EMPTY: number[] = [];

function getFavs() {
  favCache ??= read<number[]>(FAV_KEY, []);
  return favCache;
}

export function useFavorites() {
  return useSyncExternalStore(subscribe, getFavs, () => EMPTY);
}

export function toggleFavorite(n: number) {
  const favs = getFavs();
  favCache = favs.includes(n) ? favs.filter((f) => f !== n) : [...favs, n].sort((a, b) => a - b);
  write(FAV_KEY, favCache);
  emit();
}

export const fold = (s: string) =>
  s
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[’'`‘]/g, "");
