import { Suspense } from "react";
import { notFound } from "next/navigation";
import { getCategories } from "@/lib/hadith";
import PageHeading from "@/components/PageHeading";
import SearchInput from "@/components/SearchInput";

export default async function TopicLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const category = (await getCategories()).find((c) => c.id === id);
  if (!category) notFound();

  return (
    <div className="mx-auto max-w-6xl px-4">
      <PageHeading
        back={{ href: "/hadithe", label: "Të gjitha temat" }}
        title={category.title}
        text="Hap një pyetje për të lexuar hadithin, shpjegimin dhe çfarë mësojmë prej tij."
      />
      <Suspense>
        <SearchInput basePath={`/hadithe/tema/${id}`} />
      </Suspense>
      {children}
    </div>
  );
}
