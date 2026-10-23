"use client";

import { useSyncExternalStore } from "react";

const FAV_KEY = "noor:hisn-fav";
const SIZE_KEY = "noor:hisn-size";
export const TEXT_SIZES = 4;

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
    if (e.key === FAV_KEY || e.key === SIZE_KEY) {
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

function getSize() {
  return Math.min(TEXT_SIZES - 1, Math.max(0, Number(read(SIZE_KEY, 1)) || 0));
}

export function useTextSize() {
  return useSyncExternalStore(subscribe, getSize, () => 1);
}

export function cycleTextSize() {
  const next = (getSize() + 1) % TEXT_SIZES;
  write(SIZE_KEY, next);
  document.documentElement.dataset.hisnSize = String(next);
  emit();
}

export const fold = (s: string) =>
  s
    .toLowerCase()
    .normalize("NFD")
    .replace(/[̀-ͯ]/g, "")
    .replace(/[’'`‘]/g, "");

export function dayNumber(total: number, date = new Date()) {
  const start = Date.UTC(date.getFullYear(), 0, 0);
  const day = Math.floor((Date.UTC(date.getFullYear(), date.getMonth(), date.getDate()) - start) / 86400000);
  return ((day + date.getFullYear()) % total) + 1;
}
