import BackLink from "./BackLink";

type Crumb = { href: string; label: string };

export default function PageHeading({
  arabic,
  title,
  text,
  back,
}: {
  arabic?: string;
  title: string;
  text?: string;
  back?: Crumb;
}) {
  return (
    <header className={back ? "pt-6 pb-6 sm:pt-10 sm:pb-8" : "pt-10 pb-8 sm:pt-16"}>
      {back && <BackLink {...back} />}
      {arabic && <p className="arabic text-left text-2xl leading-loose text-gold">{arabic}</p>}
      <h1 className="font-serif text-3xl font-semibold tracking-tight text-balance sm:text-4xl">{title}</h1>
      {text && <p className="mt-3 max-w-2xl text-pretty text-muted">{text}</p>}
    </header>
  );
}
