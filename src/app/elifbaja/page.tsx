import type { Metadata } from "next";
import { pageMeta } from "@/lib/site";
import Elifba from "@/components/Elifba";

export const metadata: Metadata = pageMeta({
  title: "Elifbaja",
  description: "Shkronjat arabe për fëmijë: si lexohen, si shkruhen në fjalë, karta dhe lojëra për t'i mësuar.",
  path: "/elifbaja",
});

export default function ElifbaPage() {
  return (
    <div className="mx-auto max-w-6xl px-4 pt-8 sm:pt-10">
      <h1 className="sr-only">Elifbaja</h1>
      <Elifba />
    </div>
  );
}
