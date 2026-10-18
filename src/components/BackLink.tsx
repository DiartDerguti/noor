import Link from "next/link";

export default function BackLink({ href, label }: { href: string; label: string }) {
  return (
    <Link
      href={href}
      className="group mb-4 inline-flex items-center gap-2 rounded-full border border-line bg-card py-1.5 pr-4 pl-2 text-sm text-muted transition-colors hover:border-gold hover:text-ink"
    >
      <span className="grid size-6 place-items-center rounded-full bg-emerald-soft text-emerald-deep transition-transform group-hover:-translate-x-0.5">
        ←
      </span>
      {label}
    </Link>
  );
}
