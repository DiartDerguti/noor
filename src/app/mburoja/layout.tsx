import { getChapters } from "@/lib/hisn";
import { HisnShell } from "@/components/HisnList";

export default function HisnLayout({ children }: { children: React.ReactNode }) {
  const chapters = getChapters().map(({ n, title }) => ({ n, title }));

  return (
    <div className="mx-auto max-w-6xl px-4">
      <HisnShell chapters={chapters} heading={<h1 className="sr-only">Mburoja e Muslimanit</h1>}>
        {children}
      </HisnShell>
    </div>
  );
}
