import type { Metadata, Viewport } from "next";
import { Inter, Inter_Tight } from "next/font/google";
import "./globals.css";
import { MotionProvider } from "@/components/motion-provider";
import { product, site } from "@/lib/site";

const display = Inter_Tight({
  variable: "--font-display",
  subsets: ["latin", "cyrillic"],
  weight: ["500", "600", "700", "800", "900"],
  display: "swap",
});

const body = Inter({
  variable: "--font-body",
  subsets: ["latin", "cyrillic"],
  display: "swap",
});

export const metadata: Metadata = {
  metadataBase: new URL(site.url),
  title: {
    default: `${product.name} — ${site.name}`,
    template: `%s — ${site.name}`,
  },
  description: product.description,
  keywords: [
    "журнальный столик",
    "дизайнерский журнальный столик",
    "журнальный столик из дуба",
    "столик из массива дуба",
    "журнальный стол со стеклом",
    "закалённое стекло",
    "мебель на заказ",
    "столик в гостиную",
  ],
  applicationName: site.name,
  authors: [{ name: site.legalName }],
  alternates: { canonical: "/" },
  openGraph: {
    type: "website",
    locale: "ru_RU",
    url: site.url,
    siteName: site.name,
    title: `${product.name} — ${site.name}`,
    description: product.description,
    images: [
      {
        url: "/images/table-oak-hero.jpg",
        width: 1072,
        height: 584,
        alt: product.name,
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: `${product.name} — ${site.name}`,
    description: product.description,
    images: ["/images/table-oak-hero.jpg"],
  },
  robots: { index: true, follow: true },
};

export const viewport: Viewport = {
  themeColor: "#ffffff",
  colorScheme: "light",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html
      lang="ru"
      className={`${display.variable} ${body.variable} h-full antialiased`}
    >
      <body className="min-h-full bg-white text-ink">
        <MotionProvider>{children}</MotionProvider>
      </body>
    </html>
  );
}
