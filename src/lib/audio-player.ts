"use client";

import { useSyncExternalStore } from "react";

export type PlayerState = {
  src: string | null;
  playing: boolean;
  loading: boolean;
  loop: boolean;
  progress: number;
  queue: string[];
  playlist: string[] | null;
};

let state: PlayerState = { src: null, playing: false, loading: false, loop: false, progress: 0, queue: [], playlist: null };
let audio: HTMLAudioElement | null = null;
const listeners = new Set<() => void>();

function set(patch: Partial<PlayerState>) {
  state = { ...state, ...patch };
  listeners.forEach((l) => l());
}

function element() {
  if (audio) return audio;
  audio = new Audio();
  audio.preload = "auto";
  audio.addEventListener("playing", () => set({ playing: true, loading: false }));
  audio.addEventListener("pause", () => set({ playing: false }));
  audio.addEventListener("waiting", () => set({ loading: true }));
  audio.addEventListener("timeupdate", () => {
    const a = audio!;
    if (a.duration) set({ progress: a.currentTime / a.duration });
  });
  audio.addEventListener("error", () => set({ playing: false, loading: false }));
  audio.addEventListener("ended", () => {
    const [next, ...rest] = state.queue;
    const { playlist } = state;
    if (next) start(next, rest, playlist);
    else if (playlist && state.loop) start(playlist[0], playlist.slice(1), playlist);
    else set({ playing: false, progress: 1, playlist: null });
  });
  return audio;
}

function start(src: string, queue: string[] = [], playlist: string[] | null = null) {
  const a = element();
  a.src = src;
  a.loop = state.loop && !playlist;
  set({ src, queue, playlist, progress: 0, loading: true });
  a.play().catch(() => set({ playing: false, loading: false }));
}

export function toggle(src: string) {
  const a = element();
  if (state.src === src) {
    if (a.paused) {
      if (a.ended) a.currentTime = 0;
      a.play().catch(() => {});
    } else a.pause();
    return;
  }
  start(src);
}

export function playAll(sources: string[]) {
  if (state.playlist?.[0] === sources[0] && (state.playing || state.loading)) {
    stop();
    return;
  }
  const [first, ...rest] = sources;
  if (first) start(first, rest, sources);
}

export function stop() {
  audio?.pause();
  set({ queue: [], playlist: null, src: null, progress: 0, playing: false, loading: false });
}

export function toggleLoop() {
  const loop = !state.loop;
  if (audio) audio.loop = loop && !state.playlist;
  set({ loop });
}

export function seek(src: string, fraction: number) {
  const a = element();
  if (state.src !== src) start(src);
  else if (a.duration) a.currentTime = fraction * a.duration;
}

const subscribe = (l: () => void) => {
  listeners.add(l);
  return () => listeners.delete(l);
};
const SERVER = state;

export function usePlayer() {
  return useSyncExternalStore(
    subscribe,
    () => state,
    () => SERVER,
  );
}
