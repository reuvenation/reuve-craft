import { Construction } from "@/components/construction";
import { Hero } from "@/components/hero";
import { LogoMark } from "@/components/icons";
import { SiteHeader } from "@/components/site-header";
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
};

export default function Page() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <SiteHeader />
      <main>
        <Hero />
        <Construction />
      </main>
      <footer className="border-t border-hair">
        <div className="mx-auto flex max-w-[1440px] flex-col gap-4 px-5 py-8 sm:flex-row sm:items-center sm:justify-between sm:px-8 lg:px-12">
          <span className="flex items-center gap-3">
            <LogoMark className="h-4 w-6 text-ink" />
            <span className="font-display text-[15px] font-extrabold tracking-tightest">
              {site.name}
            </span>
            <span className="text-[11.5px] text-ink-faint">
              © {new Date().getFullYear()}
            </span>
          </span>
          <a
            href={site.phoneHref}
            className="text-[13px] text-ink-soft transition-colors hover:text-ink"
          >
            {site.phone}
          </a>
        </div>
      </footer>
    </>
  );
}
