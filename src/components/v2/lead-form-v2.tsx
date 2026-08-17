"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { AnimatePresence, motion } from "motion/react";
import { useRef, useState, type FormEvent } from "react";
import {
  ArrowIcon,
  MaxIcon,
  TelegramIcon,
  WhatsappIcon,
} from "@/components/icons";
import { sendLead } from "@/lib/leads";
import { formatPhone, isPhoneComplete } from "@/lib/phone";
import { messengers, type MessengerId } from "@/lib/site";

const icons = {
  telegram: TelegramIcon,
  max: MaxIcon,
  whatsapp: WhatsappIcon,
} as const;

const ease = [0.16, 1, 0.3, 1] as const;

type Status = "idle" | "sending" | "error";

/**
 * Форма первого варианта (карточка с уголками-засечками), но без
 * абзаца-описания и без чекбокса согласия — согласие даётся кнопкой.
 * После успешной отправки уводит на /v2/thanks: отдельный URL нужен,
 * чтобы на него настроить цель в Яндекс.Метрике.
 */
export function LeadFormV2() {
  const router = useRouter();
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [messenger, setMessenger] = useState<MessengerId>("telegram");
  const [status, setStatus] = useState<Status>("idle");
  const [error, setError] = useState<string | null>(null);
  const honeypot = useRef<HTMLInputElement>(null);

  async function onSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError(null);

    if (name.trim().length < 2) return setError("Как к вам обращаться?");
    if (!isPhoneComplete(phone)) return setError("Проверьте номер телефона");

    // honeypot: у людей поле пустое, боты его заполняют
    if (honeypot.current?.value) return router.push("/thanks");

    setStatus("sending");
    try {
      await sendLead({
        name: name.trim(),
        phone,
        messenger,
        page: "Главная",
      });

      router.push("/thanks");
    } catch (err) {
      setStatus("error");
      setError(
        err instanceof Error ? err.message : "Не удалось отправить заявку",
      );
    }
  }

  return (
    <div className="relative flex w-full flex-col border border-hair bg-white p-6 sm:p-8 lg:h-full">
      <Corner className="-top-px -left-px" />
      <Corner className="-top-px -right-px rotate-90" />
      <Corner className="-right-px -bottom-px rotate-180" />
      <Corner className="-bottom-px -left-px -rotate-90" />

      <motion.form
        noValidate
        onSubmit={onSubmit}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.4, ease }}
        className="flex flex-col lg:flex-1"
      >
        <h2 className="font-display text-center text-[22px] leading-none font-extrabold tracking-tightest">
          Оставить заявку
        </h2>

        <div className="mt-7 flex flex-col justify-center gap-5 lg:flex-1">
          <Field label="Как вас зовут">
            <input
              type="text"
              name="name"
              autoComplete="name"
              placeholder="Иван"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full border-b border-hair-strong bg-transparent pt-1 pb-2 text-[15px] outline-none transition-colors placeholder:text-ink-faint focus:border-ink"
            />
          </Field>

          <Field label="Телефон">
            <input
              type="tel"
              name="phone"
              inputMode="tel"
              autoComplete="tel"
              placeholder="+7 (___) ___-__-__"
              value={phone}
              onFocus={() => !phone && setPhone("+7 ")}
              onChange={(e) => setPhone(formatPhone(e.target.value))}
              className="w-full border-b border-hair-strong bg-transparent pt-1 pb-2 text-[15px] outline-none transition-colors placeholder:text-ink-faint focus:border-ink"
            />
          </Field>

          <fieldset>
            <legend className="label-caps text-ink-faint">
              Где удобно общаться
            </legend>
            <div className="mt-3 grid grid-cols-3 gap-2">
              {messengers.map((m) => {
                const Icon = icons[m.id];
                const active = messenger === m.id;
                return (
                  <button
                    key={m.id}
                    type="button"
                    onClick={() => setMessenger(m.id)}
                    aria-pressed={active}
                    className={`group relative flex cursor-pointer flex-col items-center justify-center gap-2 border py-3 text-[12.5px] transition-colors duration-300 active:bg-paper-dim ${
                      active
                        ? "border-ink text-ink"
                        : "border-hair text-ink-soft hover:border-hair-strong hover:text-ink"
                    }`}
                  >
                    {active && (
                      <motion.span
                        layoutId="v2-messenger-pill"
                        transition={{ duration: 0.35, ease }}
                        className="absolute inset-0 -z-10 bg-paper-dim"
                      />
                    )}
                    <Icon className="h-5 w-5" />
                    {m.label}
                  </button>
                );
              })}
            </div>
          </fieldset>

          <p className="text-[12px] leading-relaxed text-ink-soft">
            Свяжемся в течение дня: расскажем о столике, посчитаем срок и
            ответим на вопросы.
          </p>
        </div>

        {/* honeypot для ботов */}
        <input
          ref={honeypot}
          type="text"
          name="company"
          tabIndex={-1}
          autoComplete="off"
          aria-hidden="true"
          className="pointer-events-none absolute h-0 w-0 opacity-0"
        />

        <button
          type="submit"
          disabled={status === "sending"}
          className="group mt-7 flex w-full cursor-pointer items-center justify-center gap-3 bg-ink py-4 text-[14px] font-medium tracking-tight text-white transition-all duration-300 hover:gap-5 hover:bg-ink-hover active:bg-ink-soft disabled:cursor-not-allowed disabled:opacity-60"
        >
          {status === "sending" ? "Отправляем…" : "Отправить"}
          <ArrowIcon className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-0.5" />
        </button>

        <AnimatePresence>
          {error && (
            <motion.p
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              className="overflow-hidden pt-3 text-[12.5px] text-[#b3261e]"
            >
              {error}
            </motion.p>
          )}
        </AnimatePresence>

        <p className="mt-4 text-[11.5px] leading-relaxed text-ink-faint">
          Нажимая кнопку, вы соглашаетесь с{" "}
          <Link
            href="/privacy"
            className="underline underline-offset-2 transition-colors hover:text-ink"
          >
            политикой обработки персональных данных
          </Link>
        </p>
      </motion.form>
    </div>
  );
}

function Field({
  label,
  children,
}: {
  label: string;
  children: React.ReactNode;
}) {
  return (
    <label className="block">
      <span className="label-caps text-ink-faint">{label}</span>
      <div className="mt-2">{children}</div>
    </label>
  );
}

function Corner({ className }: { className?: string }) {
  return (
    <span
      aria-hidden="true"
      className={`pointer-events-none absolute h-3 w-3 border-t border-l border-ink ${className}`}
    />
  );
}
