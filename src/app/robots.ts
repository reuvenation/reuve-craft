import type { MetadataRoute } from "next";
import { site } from "@/lib/site";

/** Статический экспорт: файл должен собраться на этапе сборки, а не в рантайме. */
export const dynamic = "force-static";

export default function robots(): MetadataRoute.Robots {
  return {
    // серверных маршрутов больше нет — на статике запрещать нечего
    rules: [{ userAgent: "*", allow: "/" }],
    sitemap: `${site.url}/sitemap.xml`,
    host: site.url,
  };
}
