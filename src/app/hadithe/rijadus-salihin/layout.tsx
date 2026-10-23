import { Suspense } from "react";
import { RIYAD_SOURCE, RIYAD_TOTAL } from "@/lib/riyad";
import PageHeading from "@/components/PageHeading";
import SearchInput from "@/components/SearchInput";

export default function RiyadLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="mx-auto max-w-4xl px-4">
      <PageHeading
        back={{ href: "/hadithe", label: "Hadithet" }}
        arabic="رياض الصالحين"
        title="Rijadus Salihin"
        text={`Koleksioni i haditheve i Imam Neveviut. ${RIYAD_TOTAL} hadithe në shqip, të renditura sipas numrit. Kërko me fjalë ose me numrin e hadithit.`}
      />
      <Suspense>
        <SearchInput basePath="/hadithe/rijadus-salihin" />
      </Suspense>
      {children}
      <p className="text-muted mt-10 text-sm">
        Përkthimi shqip është marrë nga{" "}
        <a href={RIYAD_SOURCE} target="_blank" rel="noreferrer" className="text-emerald-deep underline-offset-4 hover:underline">
          mburoja.al/hadithe
        </a>
        .
      </p>
    </div>
  );
}
