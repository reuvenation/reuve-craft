/** Единая точка правды по бренду и товару — используется в SEO, разметке и UI. */

export const site = {
  name: "Reuve Craft",
  legalName: "Мастерская Reuve Craft",
  tagline: "мебель из массива",
  /**
   * Канонический адрес. Через `||`, а не `??`: незаданная переменная
   * репозитория приходит в CI пустой строкой, а `??` её пропускает —
   * сборка падала на `new URL("")` в `layout.tsx`.
   */
  url: process.env.NEXT_PUBLIC_SITE_URL || "https://reuve.ru",
  phone: "+7 (999) 000-00-00",
  phoneHref: "tel:+79990000000",
  city: "Москва",
  /** Продавец для подвала и политики. ИНН и почту заказчик пока не даёт. */
  seller: "СМЗ Котов И. А.",
} as const;

export const product = {
  model: "ГРАНЬ 01",
  name: "Дизайнерский журнальный столик из дуба и закалённого стекла",
  shortName: "Журнальный столик ГРАНЬ 01",
  description:
    "Журнальный столик ручной работы: каркас из массива дуба и столешница из закалённого стекла 10 мм. Геометричная опора-зигзаг, соединение на шкантах, покрытие маслом-воском. Изготовление на заказ, доставка по России.",
  size: { w: 100, d: 50, h: 45 },
  leadTimeDays: 14,
  /** Цены в рублях: обычная и по акции (используется во втором варианте). */
  price: { regular: 59000, sale: 47000 },
} as const;

/** 47000 → «47 000 ₽» (с неразрывными пробелами). */
export const formatPrice = (value: number) =>
  `${new Intl.NumberFormat("ru-RU").format(value)} ₽`;

export const finishes = [
  {
    id: "oak",
    label: "Светлый дуб",
    note: "натуральное масло",
    swatch: "#c89a5b",
    image: "/images/table-oak-hero.jpg",
  },
  {
    id: "walnut",
    label: "Тёмный орех",
    note: "тонировка + масло",
    swatch: "#6b4a2f",
    image: "/images/table-walnut.jpg",
  },
  {
    id: "rare",
    label: "Ценные породы",
    note: "ясень, венге, палисандр — под заказ",
    swatch: "#3a2c22",
    image: "/images/table-oak-hero.jpg",
  },
] as const;

export type FinishId = (typeof finishes)[number]["id"];

export const messengers = [
  { id: "telegram", label: "Telegram" },
  { id: "max", label: "MAX" },
  { id: "whatsapp", label: "WhatsApp" },
] as const;

export type MessengerId = (typeof messengers)[number]["id"];
