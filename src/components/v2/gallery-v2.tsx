"use client";

import Image from "next/image";
import { motion } from "motion/react";
import { DeliveryIcon, GrainIcon, SizeIcon } from "@/components/icons";
import { product } from "@/lib/site";

const ease = [0.16, 1, 0.3, 1] as const;

const shots = [
  { src: "/images/table-front.jpg", label: "Вид спереди" },
  { src: "/images/table-top.jpg", label: "Вид сверху" },
  { src: "/images/table-walnut.jpg", label: "Тёмный орех" },
] as const;

const benefits = [
  { text: "Возможность изготовления по индивидуальным размерам", Icon: SizeIcon },
  { text: "Доставляем по Москве и области", Icon: DeliveryIcon },
  { text: "Только ценные породы дерева", Icon: GrainIcon },
] as const;

/** Три кадра, разделители и три преимущества — без кликов и переключений. */
export function GalleryV2() {
  return (
    <section className="mx-auto max-w-[1440px] px-5 pt-4 sm:px-8 lg:px-12 lg:pt-6">
      <div className="mx-auto max-w-[1240px]">
        {/* линия под основным кадром */}
        <motion.div
          initial={{ opacity: 0, scaleX: 0.85 }}
          whileInView={{ opacity: 1, scaleX: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 1, ease }}
          className="h-px w-full bg-gradient-to-r from-transparent via-hair-strong to-transparent"
        />

        <div className="mt-8 grid grid-cols-3 gap-4 sm:gap-8 lg:mt-10 lg:gap-12">
          {shots.map((shot, i) => (
            <motion.figure
              key={shot.src}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-10% 0px" }}
              transition={{ duration: 0.8, delay: i * 0.08, ease }}
              className="relative"
            >
              {/* вертикальный разделитель по центру промежутка */}
              {i > 0 && (
                <span
                  aria-hidden="true"
                  className="absolute top-[4%] bottom-[4%] -left-2 w-px bg-gradient-to-b from-transparent via-hair-strong to-transparent sm:-left-4 lg:-left-6"
                />
              )}
              <span className="relative mx-auto block aspect-[4/3] w-[70%]">
                <Image
                  src={shot.src}
                  alt={`${product.shortName}: ${shot.label}`}
                  fill
                  sizes="(max-width: 640px) 22vw, 280px"
                  className="object-contain select-none"
                />
              </span>
            </motion.figure>
          ))}
        </div>

        {/* линия под тремя кадрами */}
        <motion.div
          initial={{ opacity: 0, scaleX: 0.85 }}
          whileInView={{ opacity: 1, scaleX: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 1, ease }}
          className="mt-10 h-px w-full bg-gradient-to-r from-transparent via-hair-strong to-transparent lg:mt-14"
        />

        <ul className="mt-8 grid grid-cols-3 gap-4 sm:gap-8 lg:mt-10 lg:gap-12">
          {benefits.map(({ text, Icon }, i) => (
            <motion.li
              key={text}
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-10% 0px" }}
              transition={{ duration: 0.8, delay: i * 0.08, ease }}
              className="relative flex flex-col items-center px-2 text-center"
            >
              {/* короткий вертикальный разделитель по центру промежутка */}
              {i > 0 && (
                <span
                  aria-hidden="true"
                  className="absolute top-1/2 -left-2 h-14 w-px -translate-y-1/2 bg-gradient-to-b from-transparent via-hair-strong to-transparent sm:-left-4 lg:-left-6"
                />
              )}
              <Icon className="h-6 w-6 text-ink" />
              <span className="font-display mt-4 text-[clamp(0.85rem,1.05vw,1.05rem)] leading-snug font-semibold tracking-tight text-ink">
                {text}
              </span>
            </motion.li>
          ))}
        </ul>
      </div>
    </section>
  );
}
