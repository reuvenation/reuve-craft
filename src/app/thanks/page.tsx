import type { Metadata } from "next";
import Link from "next/link";
import { CheckIcon } from "@/components/icons";
import { FooterV2, HeaderV2 } from "@/components/v2/site-chrome";

export const metadata: Metadata = {
  title: "Спасибо за заявку",
  alternates: { canonical: "/thanks" },
  robots: { index: false, follow: false },
};

/**
 * Отдельный URL после отправки формы — на него настраивается цель
 * в Яндекс.Метрике / Google Analytics («посещение страницы /thanks»).
 */
export default function ThanksPage() {
  return (
    <>
      <HeaderV2 />

      <main className="mx-auto max-w-[1440px] px-5 pt-24 sm:px-8 lg:px-12 lg:pt-32">
        <div className="mx-auto max-w-[720px]">
          <span className="flex h-12 w-12 items-center justify-center rounded-full border border-ink">
            <CheckIcon className="h-5 w-5 text-ink" />
          </span>

          <h1 className="font-display mt-8 text-[clamp(1.9rem,4.2vw,3.6rem)] leading-[0.95] font-black tracking-tightest">
            Спасибо за заявку
          </h1>

          <p className="mt-6 max-w-lg text-[15px] leading-relaxed text-ink-soft">
            Свяжемся с вами в ближайшее время в выбранном вами мессенджере:
            расскажем о столике, посчитаем срок и ответим на вопросы.
          </p>

          <Link
            href="/"
            className="mt-10 inline-flex cursor-pointer items-center border-b border-ink pb-1 text-[14px] font-medium tracking-tight text-ink transition-opacity hover:opacity-60"
          >
            Вернуться на сайт
          </Link>
        </div>
      </main>

      <FooterV2 />
    </>
  );
}
