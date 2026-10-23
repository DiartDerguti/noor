import type { Metadata } from "next";
import { pageMeta } from "@/lib/site";
import { getNames, NAMES_SOURCE } from "@/lib/names";
import PageHeading from "@/components/PageHeading";
import NamesExplorer from "@/components/NamesExplorer";

export const metadata: Metadata = pageMeta({
  title: "99 Emrat e Allahut",
  description: "Esmaul Husna: 99 emrat e bukur të Allahut me shkrim arab, transliterim, kuptim në shqip dhe karta për t'i mësuar përmendsh.",
  path: "/emrat",
});

export default function NamesPage() {
  return (
    <div className="mx-auto max-w-6xl px-4">
      <PageHeading
        arabic="ٱلْأَسْمَاءُ ٱلْحُسْنَىٰ"
        title="99 Emrat e Allahut"
        text="Hap një emër për ta lexuar kuptimin, shëno ata që i ke mësuar dhe provoje veten me kartat."
      />
      <NamesExplorer names={getNames()} />
      <p className="text-muted mt-10 text-sm">
        Emrat dhe kuptimet janë marrë nga{" "}
        <a href={NAMES_SOURCE} target="_blank" rel="noreferrer" className="text-emerald-deep underline-offset-4 hover:underline">
          mburoja.al/99emrat
        </a>
        .
      </p>
    </div>
  );
}
