import type { Metadata, Viewport } from "next";
import { Amiri, Inter, Literata } from "next/font/google";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import "./globals.css";

const inter = Inter({ subsets: ["latin", "latin-ext"], variable: "--font-inter" });
const literata = Literata({ subsets: ["latin", "latin-ext"], variable: "--font-literata" });
const amiri = Amiri({ subsets: ["arabic"], weight: ["400", "700"], variable: "--font-amiri" });

export const metadata: Metadata = {
  title: { default: "Noor · Kurani dhe Hadithi në shqip", template: "%s · Noor" },
  description:
    "Kurani me përkthimet shqip të Hasan Efendi Nahit, Sherif Ahmetit dhe Feti Mehdiut, dhe hadithe nga Buhariu e Muslimi.",
};

export const viewport: Viewport = {
  themeColor: "#0f1714",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="sq" className={`${inter.variable} ${literata.variable} ${amiri.variable}`}>
      <body className="flex min-h-dvh flex-col">
        <Header />
        <main className="flex-1">{children}</main>
        <Footer />
      </body>
    </html>
  );
}
