"use client";

import Image from "next/image";
import { motion, useInView } from "motion/react";
import { useRef } from "react";
import { product } from "@/lib/site";

const ease = [0.16, 1, 0.3, 1] as const;

/* ── Геометрия оверлея ──────────────────────────────────────────────
   Система координат viewBox 1100 × 460; кадр 1072×584 вписан по ширине
   с полями 22 %. Точки anchor — те же доли кадра, что в первом варианте:
   они вычислены сканированием пикселей рендера, на глаз их не двигать. */
const VW = 1100;
const VH = 460;
const IMG_INSET = 21;
const IMG_LEFT = (VW * IMG_INSET) / 100;
const IMG_W = VW - IMG_LEFT * 2;
const IMG_H = IMG_W / (1072 / 584);
const IMG_TOP = (VH - IMG_H) / 2;

const px = (ax: number) => IMG_LEFT + ax * IMG_W;
const py = (ay: number) => IMG_TOP + ay * IMG_H;

type Callout = {
  id: string;
  title: string;
  anchor: [number, number];
  elbow: [number, number];
  end: [number, number];
  side: "left" | "right";
};

const callouts: Callout[] = [
  {
    id: "glass",
    /* точка на видимой кромке стекла, середина её участка (скан пикселей:
       кромка читается только при x 0.50–0.65, в центре панели стекло
       прозрачное и сливается с белым фоном) */
    title: "Ударопрочное стекло 6 мм",
    anchor: [0.52, 0.276],
    elbow: [300, 50],
    end: [225, 50],
    side: "left",
  },
  {
    id: "oak",
    title: "Цельный массив дуба",
    anchor: [0.17, 0.58],
    elbow: [280, 330],
    end: [225, 330],
    side: "left",
  },
  {
    id: "joint",
    title: "Полностью ручная работа",
    anchor: [0.75, 0.3],
    elbow: [830, 105],
    end: [875, 105],
    side: "right",
  },
  {
    id: "size",
    title: `Размер ${product.size.w} × ${product.size.d} × ${product.size.h} см`,
    anchor: [0.865, 0.705],
    elbow: [840, 360],
    end: [875, 360],
    side: "right",
  },
];

/** Статичный кадр столика с тонкими выносками — без переключателей. */
export function FigureV2() {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, margin: "-15% 0px" });

  return (
    <section
      id="construction"
      className="mx-auto max-w-[1440px] px-5 pt-8 sm:px-8 lg:px-12 lg:pt-12"
    >
      <div ref={ref} className="relative mx-auto w-full max-w-[1240px]">
        <div className="relative aspect-[16/10] w-full sm:aspect-[1100/460]">
          <div className="absolute inset-y-0 right-[6%] left-[6%] lg:right-[21%] lg:left-[21%]">
            <Image
              src="/images/table-oak-hero.jpg"
              alt={`${product.shortName}: каркас из массива дуба и столешница из закалённого стекла`}
              fill
              sizes="(max-width: 1024px) 92vw, 55vw"
              className="object-contain select-none"
            />
          </div>

          {/* линии-выноски */}
          <svg
            viewBox={`0 0 ${VW} ${VH}`}
            preserveAspectRatio="none"
            className="pointer-events-none absolute inset-0 hidden h-full w-full lg:block"
            aria-hidden="true"
          >
            {callouts.map((c, i) => {
              const ax = px(c.anchor[0]);
              const ay = py(c.anchor[1]);
              return (
                <g key={c.id}>
                  <motion.path
                    d={`M ${ax} ${ay} L ${c.elbow[0]} ${c.elbow[1]} L ${c.end[0]} ${c.end[1]}`}
                    fill="none"
                    stroke="currentColor"
                    strokeWidth={1}
                    vectorEffect="non-scaling-stroke"
                    className="text-ink"
                    initial={{ pathLength: 0 }}
                    animate={inView ? { pathLength: 1 } : {}}
                    transition={{ duration: 0.9, delay: 0.1 + i * 0.12, ease }}
                  />
                  <motion.circle
                    cx={ax}
                    cy={ay}
                    r={2.5}
                    className="fill-ink"
                    initial={{ scale: 0, opacity: 0 }}
                    animate={inView ? { scale: 1, opacity: 1 } : {}}
                    transition={{ duration: 0.4, delay: 0.1 + i * 0.12, ease }}
                    style={{ transformOrigin: `${ax}px ${ay}px` }}
                  />
                </g>
              );
            })}
          </svg>

          {/* подписи */}
          <div className="pointer-events-none absolute inset-0 hidden lg:block">
            {callouts.map((c, i) => {
              const isLeft = c.side === "left";
              const style = isLeft
                ? {
                    right: `${((VW - c.end[0] + 12) / VW) * 100}%`,
                    top: `${(c.end[1] / VH) * 100}%`,
                  }
                : {
                    left: `${((c.end[0] + 12) / VW) * 100}%`,
                    top: `${(c.end[1] / VH) * 100}%`,
                  };
              return (
                <motion.p
                  key={c.id}
                  style={style}
                  initial={{ opacity: 0, x: isLeft ? 12 : -12 }}
                  animate={inView ? { opacity: 1, x: 0 } : {}}
                  transition={{ duration: 0.6, delay: 0.7 + i * 0.12, ease }}
                  className={`font-display absolute -translate-y-1/2 text-[14.5px] leading-tight font-semibold tracking-tight text-ink ${
                    isLeft ? "text-right" : "text-left"
                  }`}
                >
                  {c.title}
                </motion.p>
              );
            })}
          </div>
        </div>

        {/* то же самое списком — там, где выноски не помещаются */}
        <ul className="mt-10 grid grid-cols-2 gap-x-6 gap-y-4 lg:hidden">
          {callouts.map((c) => (
            <li
              key={c.id}
              className="font-display text-[14px] leading-snug font-semibold"
            >
              {c.title}
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
