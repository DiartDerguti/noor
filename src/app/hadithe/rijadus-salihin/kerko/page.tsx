import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { riyadPath, searchRiyad } from "@/lib/riyad";
import RiyadList from "@/components/RiyadList";

type Props = { searchParams: Promise<{ q?: string }> };

export const metadata: Metadata = { title: "Kërko · Rijadus Salihin", robots: { index: false } };

export default async function RiyadSearch({ searchParams }: Props) {
  const query = ((await searchParams).q ?? "").trim();
  if (!query) redirect(riyadPath());

  const { hadiths, matches } = searchRiyad(query);
  return <RiyadList hadiths={hadiths} query={query} matches={matches} />;
}
