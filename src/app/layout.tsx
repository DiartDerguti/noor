import type { Metadata, Viewport } from "next";
import { Inter, Literata, Scheherazade_New } from "next/font/google";
import localFont from "next/font/local";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { RegisterServiceWorker } from "@/components/InstallApp";
import { SITE_DESCRIPTION, SITE_NAME, SITE_TITLE, SITE_URL } from "@/lib/site";
import "./globals.css";

const inter = Inter({
  subsets: ["latin", "latin-ext"],
  variable: "--font-inter",
});
const literata = Literata({
  subsets: ["latin", "latin-ext"],
  variable: "--font-literata",
});
const naskh = Scheherazade_New({
  subsets: ["arabic"],
  weight: ["400", "700"],
  variable: "--font-naskh",
});
const quran = localFont({
  src: "../fonts/UthmanicHafs1Ver18.woff2",
  variable: "--font-quran",
  display: "swap",
});

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: { default: SITE_TITLE, template: `%s · ${SITE_NAME}` },
  description: SITE_DESCRIPTION,
  applicationName: SITE_NAME,
  keywords: [
    "Kurani në shqip",
    "Kurani shqip",
    "Hasan Efendi Nahi",
    "Sherif Ahmeti",
    "Feti Mehdiu",
    "hadithe",
    "Buhariu",
    "Muslimi",
    "Islam",
    "Quran Albanian",
  ],
  alternates: { canonical: "/" },
  openGraph: {
    title: SITE_TITLE,
    description: SITE_DESCRIPTION,
    url: "/",
    siteName: SITE_NAME,
    locale: "sq_AL",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: SITE_TITLE,
    description: SITE_DESCRIPTION,
  },
  appleWebApp: { capable: true, title: SITE_NAME, statusBarStyle: "black-translucent" },
};

export const viewport: Viewport = {
  themeColor: "#0f1714",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html
      lang="sq"
      className={`${inter.variable} ${literata.variable} ${naskh.variable} ${quran.variable}`}
      suppressHydrationWarning
    >
      <head>
        <script
          dangerouslySetInnerHTML={{
            __html: `try{var t=localStorage.getItem("noor:tr");if(t)document.documentElement.dataset.tr=t}catch(e){}`,
          }}
        />
      </head>
      <body className="flex min-h-dvh flex-col">
        <Header />
        <main className="flex-1">{children}</main>
        <Footer />
        <RegisterServiceWorker />
      </body>
    </html>
  );
}
