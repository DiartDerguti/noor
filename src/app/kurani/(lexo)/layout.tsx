import { Suspense } from "react";
import { getSurahs } from "@/lib/quran";
import ReaderSidebar from "@/components/ReaderSidebar";

export default async function ReaderLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const surahs = await getSurahs();

  return (
    <div className="mx-auto flex max-w-6xl gap-8 lg:px-4">
      <Suspense>
        <ReaderSidebar surahs={surahs} />
      </Suspense>
      <div className="min-w-0 flex-1 pb-28 lg:pb-0">{children}</div>
    </div>
  );
}
