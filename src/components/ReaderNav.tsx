import Link from "next/link";
import OpenNavButton from "./OpenNavButton";

type Target = { href: string; label: string } | null;

export default function ReaderNav({
  prev,
  next,
  label,
  position,
}: {
  prev: Target;
  next: Target;
  label: string;
  position: string;
}) {
  const arrow =
    "grid size-12 shrink-0 place-items-center rounded-full border border-line bg-card text-lg transition-colors hover:border-gold";

  return (
    <>
      <div className="mt-10 grid grid-cols-2 gap-3">
        {prev ? (
          <Link href={prev.href} className="rounded-2xl border border-line bg-card p-4 transition-colors hover:border-gold">
            <span className="text-xs text-muted">← Mbrapa</span>
            <span className="block font-medium">{prev.label}</span>
          </Link>
        ) : (
          <span />
        )}
        {next && (
          <Link
            href={next.href}
            className="rounded-2xl border border-line bg-card p-4 text-right transition-colors hover:border-gold"
          >
            <span className="text-xs text-muted">Vazhdo →</span>
            <span className="block font-medium">{next.label}</span>
          </Link>
        )}
      </div>

      <div className="fixed inset-x-0 bottom-0 z-30 border-t border-line bg-paper/90 backdrop-blur-md lg:hidden">
        <div className="mx-auto flex max-w-3xl items-center gap-3 px-4 pt-3 pb-[max(0.75rem,env(safe-area-inset-bottom))]">
          {prev ? (
            <Link href={prev.href} aria-label={`Mbrapa: ${prev.label}`} className={arrow}>
              ←
            </Link>
          ) : (
            <span className={`${arrow} opacity-30`}>←</span>
          )}
          <OpenNavButton label={label} position={position} />
          {next ? (
            <Link href={next.href} aria-label={`Vazhdo: ${next.label}`} className={arrow}>
              →
            </Link>
          ) : (
            <span className={`${arrow} opacity-30`}>→</span>
          )}
        </div>
      </div>
    </>
  );
}
