import { getSurahs } from "@/lib/quran";
import { ReaderFrame } from "@/views/quran";

export default async function ReaderLayout({ children }: { children: React.ReactNode }) {
  return <ReaderFrame surahs={await getSurahs()}>{children}</ReaderFrame>;
}
