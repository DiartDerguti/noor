import { getChapters } from "@/lib/hisn";
import { HisnShell } from "@/components/HisnList";
import { TextSizeButton } from "@/components/DuaActions";
import Icon3D from "@/components/Icon3D";

export default function HisnLayout({ children }: { children: React.ReactNode }) {
  const chapters = getChapters().map(({ n, title }) => ({ n, title }));

  const heading = (
    <header className="flex items-center gap-4 pt-8 pb-6 sm:pt-10">
      <Icon3D name="shield" className="size-14 sm:size-16" />
      <div className="min-w-0 flex-1">
        <h1 className="font-serif text-2xl font-semibold tracking-tight sm:text-3xl">Mburoja e Muslimanit</h1>
        <p className="text-muted mt-1 text-xs font-medium tracking-[0.18em] uppercase sm:text-[13px]">
          Hisnul Muslim · Lutjet e përditshme
        </p>
      </div>
      <p className="arabic text-gold hidden text-3xl leading-none sm:block">حصن المسلم</p>
      <TextSizeButton />
    </header>
  );

  return (
    <div className="mx-auto max-w-6xl px-4">
      <HisnShell chapters={chapters} heading={heading}>
        {children}
      </HisnShell>
    </div>
  );
}
