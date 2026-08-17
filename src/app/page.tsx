import { FigureV2 } from "@/components/v2/figure-v2";
import { GalleryV2 } from "@/components/v2/gallery-v2";
import { HeroV2 } from "@/components/v2/hero-v2";
import { FooterV2, HeaderV2 } from "@/components/v2/site-chrome";
import { product, site } from "@/lib/site";

const jsonLd = {
  "@context": "https://schema.org",
  "@type": "Product",
  name: product.name,
  sku: product.model,
  description: product.description,
  image: [`${site.url}/images/table-oak-hero.jpg`],
  material: ["Массив дуба", "Закалённое стекло"],
  color: "Светлый дуб, тёмный орех",
  width: { "@type": "QuantitativeValue", value: product.size.w, unitCode: "CMT" },
  depth: { "@type": "QuantitativeValue", value: product.size.d, unitCode: "CMT" },
  height: { "@type": "QuantitativeValue", value: product.size.h, unitCode: "CMT" },
  brand: { "@type": "Brand", name: site.name },
  manufacturer: { "@type": "Organization", name: site.legalName },
  category: "Журнальные столики",
  offers: {
    "@type": "Offer",
    priceCurrency: "RUB",
    price: product.price.sale,
    availability: "https://schema.org/InStock",
    seller: { "@type": "Organization", name: site.legalName },
  },
};

/**
 * Боевая страница. Это бывший второй вариант (`/v2`) — заказчик выбрал его
 * для релиза 17.08.2026. Первый вариант никуда не делся, он на `/v1`.
 * Метатитул и описание берутся из `layout.tsx`, здесь свои не нужны.
 */
export default function Page() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

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
