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
      <div className="mt-8 flex items-center gap-3">
        {prev && (
          <Link
            href={prev.href}
            className="flex min-w-0 shrink-0 items-center gap-2 rounded-full border border-line bg-card px-4 py-3 text-sm transition-colors hover:border-gold"
          >
            <span aria-hidden>←</span>
            <span className="truncate">{prev.label}</span>
          </Link>
        )}
        {next && (
          <Link
            href={next.href}
            className="group flex min-w-0 flex-1 items-center justify-center gap-2 rounded-full bg-emerald-deep px-5 py-3 text-sm font-medium text-paper transition-opacity hover:opacity-90"
          >
            <span className="opacity-80">Vazhdo</span>
            <span aria-hidden className="opacity-50">
              ·
            </span>
            <span className="truncate">{next.label}</span>
            <span aria-hidden className="transition-transform group-hover:translate-x-1">
              →
            </span>
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
