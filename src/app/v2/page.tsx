import type { Metadata } from "next";
import { FigureV2 } from "@/components/v2/figure-v2";
import { GalleryV2 } from "@/components/v2/gallery-v2";
import { HeroV2 } from "@/components/v2/hero-v2";
import { FooterV2, HeaderV2 } from "@/components/v2/site-chrome";

export const metadata: Metadata = {
  title: "Журнальный столик — вариант 2",
  alternates: { canonical: "/v2" },
  // второй вариант живёт параллельно с главной — в индекс его не пускаем
  robots: { index: false, follow: false },
};

export default function PageV2() {
  return (
    <>
      <HeaderV2 />

      <main>
        <HeroV2 />
        <FigureV2 />
        <GalleryV2 />
      </main>

      <FooterV2 />
    </>
  );
}
