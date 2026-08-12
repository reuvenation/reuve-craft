import Link from "next/link";
import { LogoMark } from "@/components/icons";
import { site } from "@/lib/site";

/** Шапка второго варианта: знак, название и расшифровка. */
export function HeaderV2() {
  return (
    <header className="mx-auto flex max-w-[1440px] items-center gap-4 px-5 pt-8 sm:px-8 lg:px-12">
      <Link href="/v2" className="flex items-center gap-3">
        <LogoMark className="h-4 w-6 text-ink" />
        <span className="font-display text-[17px] font-extrabold tracking-tightest">
          {site.name}
        </span>
      </Link>
      <span className="hidden text-[13px] text-ink-soft sm:block">
        — журнальные столики в Москве и области
      </span>
    </header>
  );
}

/** Подвал: копирайт, статус продавца и ссылка на политику. */
export function FooterV2() {
  return (
    <footer className="mx-auto flex max-w-[1440px] flex-col gap-2 px-5 pt-24 pb-10 text-[12px] text-ink-faint sm:flex-row sm:items-center sm:justify-between sm:px-8 lg:px-12 lg:pt-28">
      <span>
        {site.name} © {new Date().getFullYear()} · {site.seller}
      </span>
      <Link href="/v2/privacy" className="transition-colors hover:text-ink">
        Политика обработки персональных данных
      </Link>
    </footer>
  );
}
