"use client";

import { AnimatePresence, motion } from "motion/react";
import { useRef, useState, type FormEvent } from "react";
import {
  ArrowIcon,
  CheckIcon,
  MaxIcon,
  TelegramIcon,
  WhatsappIcon,
} from "@/components/icons";
import { formatPhone, isPhoneComplete } from "@/lib/phone";
import { messengers, product, type MessengerId } from "@/lib/site";

const icons = {
  telegram: TelegramIcon,
  max: MaxIcon,
  whatsapp: WhatsappIcon,
} as const;

const ease = [0.16, 1, 0.3, 1] as const;

type Status = "idle" | "sending" | "done" | "error";

export function LeadForm() {
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [messenger, setMessenger] = useState<MessengerId>("telegram");
  const [agree, setAgree] = useState(false);
  const [status, setStatus] = useState<Status>("idle");
  const [error, setError] = useState<string | null>(null);
  const honeypot = useRef<HTMLInputElement>(null);

  async function onSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError(null);

    if (name.trim().length < 2) return setError("Как к вам обращаться?");
    if (!isPhoneComplete(phone)) return setError("Проверьте номер телефона");
    if (!agree) return setError("Нужно согласие на обработку данных");

    setStatus("sending");
    try {
      const res = await fetch("/api/lead", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: name.trim(),
          phone,
          messenger,
          product: product.model,
          company: honeypot.current?.value ?? "",
        }),
      });

      if (!res.ok) {
        const data = (await res.json().catch(() => null)) as {
          error?: string;
        } | null;
        throw new Error(data?.error ?? "Не удалось отправить заявку");
      }

      setStatus("done");
    } catch (err) {
      setStatus("error");
      setError(
        err instanceof Error ? err.message : "Не удалось отправить заявку",
      );
    }
  }

  return (
    <div className="relative w-full border border-hair bg-white p-6 sm:p-8">
      {/* уголки-засечки, отсылка к чертёжной подаче референсов */}
      <Corner className="-top-px -left-px" />
      <Corner className="-top-px -right-px rotate-90" />
      <Corner className="-right-px -bottom-px rotate-180" />
      <Corner className="-bottom-px -left-px -rotate-90" />

      <AnimatePresence mode="wait" initial={false}>
        {status === "done" ? (
          <motion.div
            key="done"
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -12 }}
            transition={{ duration: 0.5, ease }}
            className="flex min-h-[380px] flex-col items-start justify-center"
          >
            <motion.span
              initial={{ scale: 0.6, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ delay: 0.1, duration: 0.5, ease }}
              className="flex h-12 w-12 items-center justify-center rounded-full border border-ink"
            >
              <CheckIcon className="h-5 w-5 text-ink" />
            </motion.span>
            <h3 className="font-display mt-6 text-2xl font-bold tracking-tightest">
              Заявка принята
            </h3>
            <p className="mt-3 max-w-xs text-[14px] leading-relaxed text-ink-soft">
              Свяжемся с вами в{" "}
              {messengers.find((m) => m.id === messenger)?.label} в течение
              рабочего дня и пришлём смету с точными размерами.
            </p>
            <button
              type="button"
              onClick={() => {
                setStatus("idle");
                setName("");
                setPhone("");
                setAgree(false);
              }}
              className="mt-6 text-[13px] text-ink-faint underline underline-offset-4 transition-colors hover:text-ink"
            >
              Отправить ещё одну
            </button>
          </motion.div>
        ) : (
          <motion.form
            key="form"
            noValidate
            onSubmit={onSubmit}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.4, ease }}
          >
            <div className="flex items-baseline justify-between gap-4">
              <h2 className="font-display text-[22px] leading-none font-extrabold tracking-tightest">
                Оставить заявку
              </h2>
              <span className="label-caps text-ink-faint">
                {product.model}
              </span>
            </div>
            <p className="mt-3 text-[13.5px] leading-relaxed text-ink-soft">
              Рассчитаем стоимость под ваш размер и покажем образцы шпона.
              Обычно отвечаем за 15 минут.
            </p>

            <div className="mt-7 space-y-5">
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
                        className={`group relative flex flex-col items-center justify-center gap-2 border py-3 text-[12.5px] transition-colors duration-300 ${
                          active
                            ? "border-ink text-ink"
                            : "border-hair text-ink-soft hover:border-hair-strong hover:text-ink"
                        }`}
                      >
                        {active && (
                          <motion.span
                            layoutId="messenger-pill"
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

              <label className="flex cursor-pointer items-start gap-3 pt-1">
                <span
                  className={`mt-0.5 flex h-4 w-4 shrink-0 items-center justify-center border transition-colors ${
                    agree ? "border-ink bg-ink" : "border-hair-strong bg-white"
                  }`}
                >
                  <AnimatePresence>
                    {agree && (
                      <motion.span
                        initial={{ scale: 0.4, opacity: 0 }}
                        animate={{ scale: 1, opacity: 1 }}
                        exit={{ scale: 0.4, opacity: 0 }}
                        transition={{ duration: 0.2 }}
                      >
                        <CheckIcon className="h-2.5 w-2.5 text-white" />
                      </motion.span>
                    )}
                  </AnimatePresence>
                </span>
                <input
                  type="checkbox"
                  checked={agree}
                  onChange={(e) => setAgree(e.target.checked)}
                  className="sr-only"
                />
                <span className="text-[12px] leading-relaxed text-ink-faint">
                  Согласен на обработку персональных данных
                </span>
              </label>
            </div>

            <button
              type="submit"
              disabled={status === "sending"}
              className="group mt-7 flex w-full items-center justify-center gap-3 bg-ink py-4 text-[14px] font-medium tracking-tight text-white transition-all duration-300 hover:gap-5 disabled:opacity-60"
            >
              {status === "sending" ? "Отправляем…" : "Обсудить столик"}
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
          </motion.form>
        )}
      </AnimatePresence>
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
