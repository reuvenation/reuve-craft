import type { Metadata } from "next";
import { Construction } from "@/components/construction";
import { Hero } from "@/components/hero";
import { LogoMark } from "@/components/icons";
import { SiteHeader } from "@/components/site-header";
import { site } from "@/lib/site";

export const metadata: Metadata = {
  title: "Журнальный столик — первый вариант",
  alternates: { canonical: "/v1" },
  // боевой вариант живёт на `/`; первый оставлен для сравнения и в индекс не идёт
  robots: { index: false, follow: false },
};

/**
 * Первый вариант лендинга — тот, что делали до перехода на минимализм.
 * Оставлен целиком, чтобы можно было вернуться к решениям: карточка формы
 * с уголками-засечками, переключатели ракурсов и отделок в «Конструкции».
 * На проде не публикуется как главная и закрыт от индексации.
 */
export default function PageV1() {
  return (
    <>
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
