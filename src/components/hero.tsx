"use client";

import Image from "next/image";
import { motion, useScroll, useTransform } from "motion/react";
import { useRef } from "react";
import { LeadForm } from "@/components/lead-form";
import { product } from "@/lib/site";

const ease = [0.16, 1, 0.3, 1] as const;

const rise = {
  hidden: { opacity: 0, y: 26 },
  show: (i: number) => ({
    opacity: 1,
    y: 0,
    transition: { duration: 0.9, delay: 0.06 * i, ease },
  }),
};

const facts = [
  `${product.size.w} × ${product.size.d} × ${product.size.h} см`,
  `${product.leadTimeDays} дней на изготовление`,
  "Доставка по России",
];

export function Hero() {
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start start", "end start"],
  });
  const y = useTransform(scrollYProgress, [0, 1], [0, -70]);
  const fade = useTransform(scrollYProgress, [0.35, 1], [1, 0.35]);

  return (
    <section id="top" ref={ref} className="relative overflow-hidden">
      <div className="mx-auto max-w-[1440px] px-5 sm:px-8 lg:px-12">
        <div className="grid grid-cols-1 gap-12 pt-10 pb-14 lg:grid-cols-12 lg:gap-14 lg:pt-16 lg:pb-24">
          {/* левая колонка — заголовок и главный кадр */}
          <div className="lg:col-span-7 xl:col-span-8">
            <motion.p
              custom={0}
              variants={rise}
              initial="hidden"
              animate="show"
              className="label-caps flex items-center gap-3 text-ink-faint"
            >
              <span className="inline-block h-px w-8 bg-hair-strong" />
              {product.model} · дуб + закалённое стекло
            </motion.p>

            <motion.h1
              custom={1}
              variants={rise}
              initial="hidden"
              animate="show"
              className="font-display mt-6 text-[clamp(2.6rem,6.4vw,5.6rem)] leading-[0.92] tracking-tightest"
            >
              <span className="block font-black">Дизайнерский</span>
              <span className="block font-semibold text-ink-soft">
                журнальный столик
              </span>
            </motion.h1>

            <motion.p
              custom={2}
              variants={rise}
              initial="hidden"
              animate="show"
              className="mt-6 max-w-xl text-[15px] leading-relaxed text-ink-soft"
            >
              Массив дуба и закалённое стекло 10&nbsp;мм. Каркас собирается на
              шкантах — ни одного видимого крепежа, только чистая геометрия.
              Делаем на заказ в своей мастерской.
            </motion.p>

            <motion.div
              initial={{ opacity: 0, scale: 0.985 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 1.2, delay: 0.25, ease }}
              className="relative mt-8 lg:mt-10"
            >
              {/* параллакс при скролле */}
              <motion.div style={{ y, opacity: fade }}>
                {/* едва заметное «дыхание» кадра */}
                <motion.div
                  animate={{ y: [0, -9, 0] }}
                  transition={{
                    duration: 9,
                    repeat: Infinity,
                    ease: "easeInOut",
                  }}
                >
                  <Image
                    src="/images/table-angle.jpg"
                    alt={`${product.shortName} — вид три четверти, каркас из массива дуба и столешница из закалённого стекла`}
                    width={1086}
                    height={612}
                    priority
                    sizes="(max-width: 1024px) 92vw, 60vw"
                    className="h-auto w-full select-none"
                  />
                </motion.div>
              </motion.div>
            </motion.div>

            <motion.ul
              custom={4}
              variants={rise}
              initial="hidden"
              animate="show"
              className="mt-8 flex flex-wrap items-center gap-x-8 gap-y-3 border-t border-hair pt-5 text-[12.5px] text-ink-soft"
            >
              {facts.map((fact) => (
                <li key={fact} className="flex items-center gap-2.5">
                  <span className="h-1 w-1 rounded-full bg-oak" />
                  {fact}
                </li>
              ))}
            </motion.ul>
          </div>

          {/* правая колонка — форма заявки */}
          <motion.div
            id="order"
            initial={{ opacity: 0, y: 32 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.9, delay: 0.15, ease }}
            className="lg:col-span-5 xl:col-span-4"
          >
            <div className="lg:sticky lg:top-24">
              <LeadForm />
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
