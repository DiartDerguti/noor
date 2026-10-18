export default function PageHeading({ arabic, title, text }: { arabic?: string; title: string; text?: string }) {
  return (
    <header className="pt-12 pb-8 sm:pt-16">
      {arabic && <p className="arabic text-left text-2xl leading-loose text-gold">{arabic}</p>}
      <h1 className="mt-1 font-serif text-4xl font-semibold tracking-tight text-balance">{title}</h1>
      {text && <p className="mt-3 max-w-2xl text-pretty text-muted">{text}</p>}
    </header>
  );
}
