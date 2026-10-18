export default function SectionHeader({ eyebrow, title, subtitle }: { eyebrow: string; title: string; subtitle: string }) {
  return (
    <header className="pattern relative -mx-4 overflow-hidden px-4 pt-12 pb-10 text-center sm:rounded-b-[2.5rem]">
      <div className="absolute inset-0 bg-gradient-to-b from-paper/30 to-paper" />
      <div className="relative">
        <p className="text-xs font-medium tracking-[0.2em] text-gold uppercase">{eyebrow}</p>
        <h1 className="mt-3 font-serif text-4xl font-semibold">{title}</h1>
        <p className="mx-auto mt-2 max-w-md text-sm text-muted">{subtitle}</p>
      </div>
    </header>
  );
}
