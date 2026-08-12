"use client";

import { motion, useMotionValueEvent, useScroll } from "motion/react";
import { useState } from "react";
import { LogoMark } from "@/components/icons";
import { site } from "@/lib/site";

const nav = [
  { href: "#model", label: "Модель" },
  { href: "#construction", label: "Конструкция" },
  { href: "#order", label: "Заказать" },
];

export function SiteHeader() {
  const { scrollY } = useScroll();
  const [stuck, setStuck] = useState(false);

  useMotionValueEvent(scrollY, "change", (v) => setStuck(v > 12));

  return (
    <motion.header
      initial={{ y: -24, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
      className={`sticky top-0 z-50 transition-colors duration-300 ${
        stuck
          ? "border-b border-hair bg-white/85 backdrop-blur-md"
          : "border-b border-transparent bg-white"
      }`}
    >
      <div className="mx-auto flex h-16 max-w-[1440px] items-center justify-between px-5 sm:px-8 lg:px-12">
        <a href="#top" className="group flex items-center gap-3">
          <LogoMark className="h-5 w-7 text-ink transition-transform duration-500 group-hover:-translate-y-0.5" />
          <span className="flex items-baseline gap-2">
            <span className="font-display text-[19px] font-extrabold tracking-tightest">
              {site.name}
            </span>
            <span className="hidden text-[11px] tracking-[0.14em] text-ink-faint uppercase sm:inline">
              {site.tagline}
            </span>
          </span>
        </a>

        <nav className="hidden items-center gap-9 md:flex">
          {nav.map((item) => (
            <a
              key={item.href}
              href={item.href}
              className="group relative text-[13px] text-ink-soft transition-colors hover:text-ink"
            >
              {item.label}
              <span className="absolute -bottom-1 left-0 h-px w-0 bg-ink transition-all duration-300 group-hover:w-full" />
            </a>
          ))}
        </nav>

        <a
          href={site.phoneHref}
          className="text-[13px] font-medium tracking-tight text-ink transition-opacity hover:opacity-60"
        >
          {site.phone}
        </a>
      </div>
    </motion.header>
  );
}
