import type { NextConfig } from "next";

/**
 * Сайт выкладывается статикой на GitHub Pages, поэтому `output: "export"`.
 * Серверных маршрутов нет: заявки уходят из браузера прямо в Supabase
 * (см. `src/lib/leads.ts`), уведомление в Telegram шлёт триггер в базе.
 *
 * BASE_PATH нужен, только если сайт лежит в подпапке. На своём домене
 * reuve.ru он пустой — сайт в корне (домен прописан в `public/CNAME`).
 */
const basePath = process.env.BASE_PATH ?? "";

const nextConfig: NextConfig = {
  output: "export",
  trailingSlash: true,
  basePath: basePath || undefined,
  images: {
    // оптимизатор Next требует сервера — на статике отдаём файлы как есть
    unoptimized: true,
  },
};

export default nextConfig;
