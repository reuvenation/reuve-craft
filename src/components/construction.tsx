"use client";

import Image from "next/image";
import { AnimatePresence, motion, useInView } from "motion/react";
import { useRef, useState } from "react";
import { finishes, product, type FinishId } from "@/lib/site";

const ease = [0.16, 1, 0.3, 1] as const;

/* ── Геометрия оверлея ──────────────────────────────────────────────
   Все координаты — в системе viewBox 1100 × 460.
   Кадр 3/4 (1072×584) вписан по ширине в область с отступами 22 %,
   поэтому точки привязки считаются один раз и не «плывут». */
const VW = 1100;
const VH = 460;
const IMG_INSET = 22; // % — для основного ракурса
const IMG_LEFT = (VW * IMG_INSET) / 100;
const IMG_W = VW - IMG_LEFT * 2;
const IMG_H = IMG_W / (1072 / 584);
const IMG_TOP = (VH - IMG_H) / 2;

const px = (ax: number) => IMG_LEFT + ax * IMG_W;
const py = (ay: number) => IMG_TOP + ay * IMG_H;

type Callout = {
  id: string;
  title: string;
  note: string;
  /** точка на изделии в долях кадра */
  anchor: [number, number];
  elbow: [number, number];
  end: [number, number];
  side: "left" | "right";
};

const callouts: Callout[] = [
  {
    id: "glass",
    title: "Закалённое стекло",
    note: "10 мм, шлифованная кромка",
    anchor: [0.55, 0.262],
    elbow: [300, 50],
    end: [225, 50],
    side: "left",
  },
  {
    id: "oak",
    title: "Массив дуба",
    note: "брус 40 мм, масло-воск",
    anchor: [0.17, 0.58],
    elbow: [280, 330],
    end: [225, 330],
    side: "left",
  },
  {
    id: "joint",
    title: "Сборка на шкантах",
    note: "ни одного видимого крепежа",
    anchor: [0.75, 0.3],
    elbow: [830, 105],
    end: [875, 105],
    side: "right",
  },
  {
    id: "feet",
    title: "Мягкие подпятники",
    note: "не царапают пол",
    anchor: [0.865, 0.705],
    elbow: [840, 360],
    end: [875, 360],
    side: "right",
  },
];

type ViewId = "hero" | "front" | "top";

const views = [
  {
    id: "hero",
    label: "Три четверти",
    thumb: "/images/table-angle.jpg",
    w: 1086,
    h: 612,
  },
  {
    id: "front",
    label: "Вид спереди",
    thumb: "/images/table-front.jpg",
    w: 1348,
    h: 500,
  },
  {
    id: "top",
    label: "Вид сверху",
    thumb: "/images/table-top.jpg",
    w: 1348,
    h: 704,
  },
] as const;

export function Construction() {
  const [view, setView] = useState<ViewId>("hero");
  const [finish, setFinish] = useState<FinishId>("oak");
  const figureRef = useRef<HTMLDivElement>(null);
  const inView = useInView(figureRef, { once: true, margin: "-15% 0px" });

  const activeFinish = finishes.find((f) => f.id === finish) ?? finishes[0];
  const src =
    view === "hero"
      ? activeFinish.image
      : views.find((v) => v.id === view)!.thumb;

  const showCallouts = view === "hero";
  const inset = view === "hero" ? IMG_INSET : 9;

  return (
    <section id="construction" className="border-t border-hair bg-white">
      <div className="mx-auto max-w-[1440px] px-5 py-16 sm:px-8 lg:px-12 lg:py-24">
        <header className="flex flex-col gap-6 md:flex-row md:items-end md:justify-between">
          <div>
            <p className="label-caps flex items-center gap-3 text-ink-faint">
              <span className="inline-block h-px w-8 bg-hair-strong" />
              Конструкция
            </p>
            <h2 className="font-display mt-5 text-[clamp(2rem,4.2vw,3.6rem)] leading-[0.94] font-black tracking-tightest">
              Каждый узел
              <br />
              виден насквозь
            </h2>
          </div>
          <p className="max-w-sm text-[14.5px] leading-relaxed text-ink-soft">
            Стекло лежит в пазу рамы и держится собственным весом — без клея и
            накладок. Опоры-зигзаги разведены наружу, поэтому столик выглядит
            невесомым, но выдерживает {product.size.w > 100 ? "80" : "60"} кг.
          </p>
        </header>

        {/* ─── Основной кадр с выносками ─────────────────────────── */}
        <div
          ref={figureRef}
          className="relative mx-auto mt-14 w-full max-w-[1240px] lg:mt-20"
        >
          <div className="relative aspect-[16/10] w-full sm:aspect-[1100/460]">
            {/* изображение: на мобильных во всю ширину, на десктопе — с полями под выноски */}
            <div
              className="absolute inset-y-0 right-[2%] left-[2%] transition-[left,right] duration-700 ease-[cubic-bezier(0.16,1,0.3,1)] lg:right-[var(--inset)] lg:left-[var(--inset)]"
              style={{ "--inset": `${inset}%` } as React.CSSProperties}
            >
              <AnimatePresence mode="sync">
                <motion.div
                  key={src}
                  initial={{ opacity: 0, scale: 1.015 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.6, ease }}
                  className="absolute inset-0"
                >
                  <Image
                    src={src}
                    alt={`${product.shortName}: ${
                      views.find((v) => v.id === view)!.label
                    }, отделка «${activeFinish.label}»`}
                    fill
                    sizes="(max-width: 1024px) 92vw, 65vw"
                    className="object-contain select-none"
                  />
                </motion.div>
              </AnimatePresence>
            </div>

            {/* выноски — только на десктопе и только для ракурса 3/4 */}
            <AnimatePresence>
              {showCallouts && (
                <motion.svg
                  key="callouts"
                  viewBox={`0 0 ${VW} ${VH}`}
                  preserveAspectRatio="none"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.4 }}
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
                          transition={{
                            duration: 0.85,
                            delay: 0.15 + i * 0.14,
                            ease,
                          }}
                        />
                        <motion.circle
                          cx={ax}
                          cy={ay}
                          r={3}
                          className="fill-ink"
                          initial={{ scale: 0, opacity: 0 }}
                          animate={inView ? { scale: 1, opacity: 1 } : {}}
                          transition={{
                            duration: 0.4,
                            delay: 0.15 + i * 0.14,
                            ease,
                          }}
                          style={{ transformOrigin: `${ax}px ${ay}px` }}
                        />
                      </g>
                    );
                  })}
                </motion.svg>
              )}
            </AnimatePresence>

            {/* подписи к выноскам */}
            <AnimatePresence>
              {showCallouts && (
                <motion.div
                  key="labels"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="pointer-events-none absolute inset-0 hidden lg:block"
                >
                  {callouts.map((c, i) => {
                    const isLeft = c.side === "left";
                    const style = isLeft
                      ? {
                          right: `${((VW - c.end[0] + 14) / VW) * 100}%`,
                          top: `${(c.end[1] / VH) * 100}%`,
                        }
                      : {
                          left: `${((c.end[0] + 14) / VW) * 100}%`,
                          top: `${(c.end[1] / VH) * 100}%`,
                        };
                    return (
                      <motion.div
                        key={c.id}
                        style={style}
                        initial={{ opacity: 0, x: isLeft ? 14 : -14 }}
                        animate={inView ? { opacity: 1, x: 0 } : {}}
                        transition={{
                          duration: 0.6,
                          delay: 0.75 + i * 0.14,
                          ease,
                        }}
                        className={`absolute -translate-y-1/2 ${
                          isLeft ? "text-right" : "text-left"
                        }`}
                      >
                        <p className="font-display text-[15px] leading-tight font-bold tracking-tight text-ink">
                          {c.title}
                        </p>
                        <p className="mt-1 text-[12px] leading-snug text-ink-faint">
                          {c.note}
                        </p>
                      </motion.div>
                    );
                  })}
                </motion.div>
              )}
            </AnimatePresence>

            {/* размерные линии для вида спереди */}
            <AnimatePresence>
              {view === "front" && <Dimensions />}
            </AnimatePresence>
          </div>

          {/* мобильный список характеристик вместо выносок */}
          <ul className="mt-8 grid grid-cols-2 gap-x-6 gap-y-5 border-t border-hair pt-6 lg:hidden">
            {callouts.map((c) => (
              <li key={c.id}>
                <p className="font-display text-[14px] leading-tight font-bold">
                  {c.title}
                </p>
                <p className="mt-1 text-[11.5px] leading-snug text-ink-faint">
                  {c.note}
                </p>
              </li>
            ))}
          </ul>
        </div>

        {/* ─── Ракурсы и отделка ─────────────────────────────────── */}
        <div className="mt-14 grid gap-12 border-t border-hair pt-10 lg:mt-20 lg:grid-cols-12 lg:gap-16">
          <div className="lg:col-span-7">
            <p className="label-caps text-ink-faint">Ракурсы</p>
            <div className="mt-5 grid grid-cols-3 gap-3 sm:gap-5">
              {views.map((v) => {
                const active = view === v.id;
                return (
                  <button
                    key={v.id}
                    type="button"
                    onClick={() => setView(v.id)}
                    aria-pressed={active}
                    className={`group relative border p-2 transition-colors duration-300 sm:p-3 ${
                      active
                        ? "border-ink"
                        : "border-hair hover:border-hair-strong"
                    }`}
                  >
                    <span className="relative block aspect-[16/10] overflow-hidden">
                      <Image
                        src={v.thumb}
                        alt={`${product.shortName}: ${v.label}`}
                        fill
                        sizes="180px"
                        className={`object-contain transition-transform duration-500 ${
                          active ? "" : "group-hover:scale-[1.04]"
                        }`}
                      />
                    </span>
                    <span
                      className={`mt-2 block text-[11.5px] transition-colors ${
                        active ? "text-ink" : "text-ink-faint"
                      }`}
                    >
                      {v.label}
                    </span>
                  </button>
                );
              })}
            </div>
          </div>

          <div className="lg:col-span-5">
            <p className="label-caps text-ink-faint">Доступные цвета</p>
            <div className="mt-5 flex items-center gap-4">
              {finishes.map((f) => {
                const active = finish === f.id;
                return (
                  <button
                    key={f.id}
                    type="button"
                    onClick={() => {
                      setFinish(f.id);
                      setView("hero");
                    }}
                    aria-pressed={active}
                    aria-label={f.label}
                    className="group relative flex h-11 w-11 items-center justify-center rounded-full"
                  >
                    {active && (
                      <motion.span
                        layoutId="finish-ring"
                        transition={{ duration: 0.4, ease }}
                        className="absolute inset-0 rounded-full border border-ink"
                      />
                    )}
                    <span
                      className="h-7 w-7 rounded-full transition-transform duration-300 group-hover:scale-110"
                      style={{ background: f.swatch }}
                    />
                  </button>
                );
              })}
            </div>

            <AnimatePresence mode="wait">
              <motion.div
                key={activeFinish.id}
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -8 }}
                transition={{ duration: 0.35, ease }}
                className="mt-5"
              >
                <p className="font-display text-[17px] font-bold tracking-tight">
                  {activeFinish.label}
                </p>
                <p className="mt-1 text-[13px] text-ink-soft">
                  {activeFinish.note}
                </p>
              </motion.div>
            </AnimatePresence>

            <p className="mt-6 max-w-xs border-t border-hair pt-5 text-[12.5px] leading-relaxed text-ink-faint">
              Подбираем оттенок по образцу: от белёного дуба до венге. Стекло —
              прозрачное, бронза или графит.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}

/** Размерные линии поверх вида спереди. */
function Dimensions() {
  const front = { left: 9, right: 91 }; // % — отступы кадра
  const lineY = 432;
  const imgTop = 62.7;
  const imgBottom = 397.3;

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.5, delay: 0.25, ease }}
      className="pointer-events-none absolute inset-0 hidden lg:block"
      aria-hidden="true"
    >
      <svg
        viewBox={`0 0 ${VW} ${VH}`}
        preserveAspectRatio="none"
        className="absolute inset-0 h-full w-full text-ink-faint"
      >
        {/* ширина */}
        <motion.path
          d={`M ${(VW * front.left) / 100} ${lineY} H ${(VW * front.right) / 100}`}
          stroke="currentColor"
          strokeWidth={1}
          vectorEffect="non-scaling-stroke"
          initial={{ pathLength: 0 }}
          animate={{ pathLength: 1 }}
          transition={{ duration: 0.8, ease }}
        />
        <path
          d={`M ${(VW * front.left) / 100} ${lineY - 7} v 14 M ${(VW * front.right) / 100} ${lineY - 7} v 14`}
          stroke="currentColor"
          strokeWidth={1}
          vectorEffect="non-scaling-stroke"
        />
        {/* высота */}
        <motion.path
          d={`M 1040 ${imgTop} V ${imgBottom}`}
          stroke="currentColor"
          strokeWidth={1}
          vectorEffect="non-scaling-stroke"
          initial={{ pathLength: 0 }}
          animate={{ pathLength: 1 }}
          transition={{ duration: 0.8, delay: 0.15, ease }}
        />
        <path
          d={`M 1033 ${imgTop} h 14 M 1033 ${imgBottom} h 14`}
          stroke="currentColor"
          strokeWidth={1}
          vectorEffect="non-scaling-stroke"
        />
      </svg>

      <span
        className="absolute -translate-x-1/2 -translate-y-1/2 bg-white px-2 text-[11.5px] tracking-wide text-ink-soft"
        style={{ left: "50%", top: `${(lineY / VH) * 100}%` }}
      >
        {product.size.w} см
      </span>
      <span
        className="absolute -translate-x-1/2 -translate-y-1/2 bg-white px-2 text-[11.5px] tracking-wide text-ink-soft"
        style={{
          left: `${(1040 / VW) * 100}%`,
          top: `${(((imgTop + imgBottom) / 2 / VH) * 100).toFixed(2)}%`,
        }}
      >
        {product.size.h} см
      </span>
    </motion.div>
  );
}
