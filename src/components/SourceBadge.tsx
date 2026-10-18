import { SOURCE_LABEL, type Source } from "@/lib/hadith";

export default function SourceBadge({ source }: { source: Source }) {
  return (
    <span className="inline-flex items-center gap-1.5 rounded-full bg-gold-soft px-2.5 py-0.5 text-xs font-medium text-gold">
      <span className="size-1.5 rounded-full bg-gold" />
      {SOURCE_LABEL[source]}
    </span>
  );
}
