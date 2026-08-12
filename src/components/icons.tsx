import type { SVGProps } from "react";

/** Знак бренда — фронтальный силуэт столика: стекло и две разведённые опоры. */
export function LogoMark(props: SVGProps<SVGSVGElement>) {
  return (
    <svg
      viewBox="0 0 28 20"
      fill="none"
      aria-hidden="true"
      strokeLinecap="square"
      {...props}
    >
      <path d="M1 5.5h26" stroke="currentColor" strokeWidth="1.7" />
      <path d="M9.5 5.5 5 17.5" stroke="currentColor" strokeWidth="1.7" />
      <path d="M18.5 5.5 23 17.5" stroke="currentColor" strokeWidth="1.7" />
    </svg>
  );
}

export function TelegramIcon(props: SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 24 24" fill="none" aria-hidden="true" {...props}>
      <path
        d="M21.6 4.3 3.3 11.4c-1 .4-1 1.8.1 2.1l4.4 1.3 1.7 5.2c.3.8 1.3 1 1.9.4l2.4-2.3 4.5 3.3c.7.5 1.7.1 1.9-.7l3-14.4c.2-1-.7-1.8-1.6-1.4Z"
        fill="currentColor"
        opacity=".15"
      />
      <path
        d="M21.9 4.6 3.6 11.7c-.8.3-.8 1.4 0 1.7l4.6 1.4 1.8 5.4c.2.6 1 .8 1.5.3l2.5-2.4 4.6 3.4c.5.4 1.3.1 1.5-.6l3-14.7c.2-.8-.6-1.5-1.2-1.3Z"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinejoin="round"
      />
      <path
        d="m8.2 14.8 10.5-7.6-7 8.2v3.6"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinejoin="round"
      />
    </svg>
  );
}

export function WhatsappIcon(props: SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 24 24" fill="none" aria-hidden="true" {...props}>
      <path
        d="M12 3a9 9 0 0 0-7.7 13.7L3 21l4.4-1.2A9 9 0 1 0 12 3Z"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinejoin="round"
      />
      <path
        d="M9.2 8.1c.2-.5.5-.5.8-.5h.5c.2 0 .4 0 .6.5l.7 1.7c0 .2 0 .4-.1.5l-.5.6c-.1.2-.2.3 0 .6.3.5.8 1.2 1.5 1.7.7.5 1.1.6 1.3.7.2 0 .4 0 .5-.1l.6-.7c.2-.2.3-.2.5-.1l1.6.8c.2.1.4.2.4.4 0 .2 0 .9-.3 1.3-.3.4-1 .8-1.5.8-1.2 0-2.9-.7-4.4-2.1-1.6-1.5-2.6-3.2-2.8-4-.2-.9 0-1.6.3-2.1Z"
        fill="currentColor"
      />
    </svg>
  );
}

/** MAX — текстовый знак, чтобы не тянуть чужой логотип. */
export function MaxIcon(props: SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 24 24" fill="none" aria-hidden="true" {...props}>
      <rect
        x="2.75"
        y="4.75"
        width="18.5"
        height="14.5"
        rx="4.5"
        stroke="currentColor"
        strokeWidth="1.5"
      />
      <path
        d="M6.6 15.4V9.2l2.6 3.6 2.6-3.6v6.2"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="m14.4 9.2 3.4 6.2m0-6.2-3.4 6.2"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
      />
    </svg>
  );
}

/* ── Значки преимуществ во втором варианте: только контур, без заливки ── */

/** Размерная линия с засечками — изготовление по своим размерам. */
export function SizeIcon(props: SVGProps<SVGSVGElement>) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      aria-hidden="true"
      strokeLinecap="square"
      {...props}
    >
      <path d="M2.5 12h19" stroke="currentColor" strokeWidth="1.3" />
      <path
        d="M2.5 8v8M21.5 8v8M12 9.5v5"
        stroke="currentColor"
        strokeWidth="1.3"
      />
    </svg>
  );
}

/** Ящик со стрелкой — доставка. */
export function DeliveryIcon(props: SVGProps<SVGSVGElement>) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      aria-hidden="true"
      strokeLinecap="square"
      {...props}
    >
      <path d="M2.5 6.5h11v11h-11z" stroke="currentColor" strokeWidth="1.3" />
      <path d="M2.5 10h11" stroke="currentColor" strokeWidth="1.3" />
      <path
        d="M16 12h5.5m0 0L18.5 9m3 3-3 3"
        stroke="currentColor"
        strokeWidth="1.3"
      />
    </svg>
  );
}

/** Годовые кольца на спиле — порода дерева. */
export function GrainIcon(props: SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 24 24" fill="none" aria-hidden="true" {...props}>
      <circle cx="12" cy="12" r="9" stroke="currentColor" strokeWidth="1.3" />
      <circle cx="12" cy="12" r="5.5" stroke="currentColor" strokeWidth="1.3" />
      <circle cx="12" cy="12" r="2" stroke="currentColor" strokeWidth="1.3" />
    </svg>
  );
}

export function CheckIcon(props: SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 24 24" fill="none" aria-hidden="true" {...props}>
      <path
        d="m4 12.5 5.2 5.2L20 6.9"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

export function ArrowIcon(props: SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 24 24" fill="none" aria-hidden="true" {...props}>
      <path
        d="M4 12h15m0 0-5.5-5.5M19 12l-5.5 5.5"
        stroke="currentColor"
        strokeWidth="1.6"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}
