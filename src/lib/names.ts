import data from "@/data/names.json";

export type AllahName = { n: number; arabic: string; name: string; meaning: string; text: string };

export const NAMES_SOURCE = "https://mburoja.al/99emrat/";

export function getNames() {
  return data as AllahName[];
}
