"use client";

import Image from "next/image";
import { motion } from "motion/react";
import { LeadFormV2 } from "@/components/v2/lead-form-v2";
import { formatPrice, product } from "@/lib/site";

const ease = [0.16, 1, 0.3, 1] as const;

const rise = {
  hidden: { opacity: 0, y: 22 },
  show: (i: number) => ({
    opacity: 1,
    y: 0,
    transition: { duration: 0.9, delay: 0.06 * i, ease },
  }),
};

export function HeroV2() {
  return (
    <section id="top" className="mx-auto max-w-[1440px] px-5 sm:px-8 lg:px-12">
      {/* колонки одной высоты: форма тянется от строки заголовка до низа кадра */}
      <div className="grid grid-cols-1 items-stretch gap-12 pt-10 lg:grid-cols-12 lg:gap-16 lg:pt-14">
        <div className="lg:col-span-7 lg:flex lg:flex-col">
          <motion.h1
            custom={0}
            variants={rise}
            initial="hidden"
            animate="show"
            className="font-display text-[clamp(1.9rem,4.9vw,4.6rem)] leading-[0.95] tracking-tightest"
          >
            <span className="block font-black whitespace-nowrap">
              Журнальный столик
            </span>
            <span className="block font-semibold text-ink-soft">стеклянный</span>
          </motion.h1>

          <motion.div
            initial={{ opacity: 0, scale: 0.99 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 1.2, delay: 0.25, ease }}
            className="relative mt-8 aspect-[1086/612] w-[90%] lg:mt-10 lg:flex-1"
          >
            {/* на десктопе кадр вписывается в остаток высоты колонки и стоит
                на её нижней кромке — так низ фото совпадает с низом формы */}
            <Image
              src="/images/table-angle.jpg"
              alt={`${product.shortName} — вид три четверти: каркас из массива дуба, столешница из закалённого стекла`}
              fill
              priority
              sizes="(max-width: 1024px) 84vw, 52vw"
              className="object-contain object-left-bottom select-none"
            />
          </motion.div>

          <motion.div
            custom={2}
            variants={rise}
            initial="hidden"
            animate="show"
            className="relative z-10 mt-6 flex flex-col items-end text-right lg:-mt-12"
          >
            {/* блок приподнят и заходит на пустой угол кадра — кадр при этом
                не двигается, низ колонки по-прежнему держит форму */}
            <p className="font-display text-[clamp(1.05rem,1.7vw,1.6rem)] leading-tight font-semibold tracking-tightest text-ink-soft">
              Успейте заказать по сниженной цене
              <br />
              <span className="font-black text-ink">до конца недели</span>
            </p>
            <p className="mt-3 flex items-baseline gap-4">
              <span className="text-[17px] text-ink-faint line-through">
                {formatPrice(product.price.regular)}
              </span>
              <span className="font-display text-[clamp(1.9rem,2.6vw,2.5rem)] leading-none font-black tracking-tightest text-ink">
                {formatPrice(product.price.sale)}
              </span>
            </p>
          </motion.div>
        </div>

        <motion.div
          id="order"
          initial={{ opacity: 0, y: 26 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.9, delay: 0.12, ease }}
          className="lg:col-span-4 lg:col-start-9"
        >
          <LeadFormV2 />
        </motion.div>
      </div>
    </section>
  );
}
