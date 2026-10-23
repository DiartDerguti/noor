import type { Metadata } from "next";
import { Suspense } from "react";
import OfflineApp from "@/components/OfflineApp";

export const metadata: Metadata = { title: "Offline", robots: { index: false, follow: false } };

export default function OfflinePage() {
  return (
    <Suspense>
      <OfflineApp />
    </Suspense>
  );
}
