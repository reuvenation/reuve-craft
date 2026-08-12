import { appendFile, mkdir } from "node:fs/promises";
import path from "node:path";
import { NextResponse } from "next/server";
import { z } from "zod";

const LeadSchema = z.object({
  name: z.string().trim().min(2, "Как к вам обращаться?").max(80),
  phone: z
    .string()
    .trim()
    .regex(/^\+7 \(\d{3}\) \d{3}-\d{2}-\d{2}$/, "Проверьте номер телефона"),
  messenger: z.enum(["telegram", "max", "whatsapp"]),
  product: z.string().trim().max(60).optional(),
  /** honeypot: у людей поле пустое */
  company: z.string().max(0).optional(),
});

export type Lead = z.infer<typeof LeadSchema>;

const WINDOW_MS = 10 * 60 * 1000;
const MAX_PER_WINDOW = 5;
const hits = new Map<string, number[]>();

function rateLimited(ip: string) {
  const now = Date.now();
  const recent = (hits.get(ip) ?? []).filter((t) => now - t < WINDOW_MS);
  recent.push(now);
  hits.set(ip, recent);
  return recent.length > MAX_PER_WINDOW;
}

async function persist(lead: Lead, meta: Record<string, unknown>) {
  const dir = path.join(process.cwd(), "data");
  const line = `${JSON.stringify({ ...lead, ...meta })}\n`;
  try {
    await mkdir(dir, { recursive: true });
    await appendFile(path.join(dir, "leads.jsonl"), line, "utf8");
  } catch {
    // на readonly-хостинге просто логируем — заявка не теряется в выводе
    console.info("[lead]", line.trim());
  }
}

async function notifyTelegram(lead: Lead) {
  const token = process.env.TELEGRAM_BOT_TOKEN;
  const chatId = process.env.TELEGRAM_CHAT_ID;
  if (!token || !chatId) return;

  const text = [
    "🪵 Новая заявка",
    `Имя: ${lead.name}`,
    `Телефон: ${lead.phone}`,
    `Связь: ${lead.messenger}`,
    lead.product ? `Модель: ${lead.product}` : null,
  ]
    .filter(Boolean)
    .join("\n");

  try {
    await fetch(`https://api.telegram.org/bot${token}/sendMessage`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ chat_id: chatId, text }),
    });
  } catch (error) {
    console.error("[lead] telegram notify failed", error);
  }
}

export async function POST(request: Request) {
  const ip =
    request.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ??
    request.headers.get("x-real-ip") ??
    "local";

  if (rateLimited(ip)) {
    return NextResponse.json(
      { error: "Слишком много заявок. Попробуйте позже." },
      { status: 429 },
    );
  }

  let payload: unknown;
  try {
    payload = await request.json();
  } catch {
    return NextResponse.json({ error: "Некорректный запрос" }, { status: 400 });
  }

  const parsed = LeadSchema.safeParse(payload);
  if (!parsed.success) {
    return NextResponse.json(
      { error: parsed.error.issues[0]?.message ?? "Проверьте поля формы" },
      { status: 422 },
    );
  }

  const { company, ...lead } = parsed.data;
  if (company) {
    // бот заполнил скрытое поле — отвечаем успехом, но ничего не сохраняем
    return NextResponse.json({ ok: true });
  }

  await persist(lead as Lead, {
    at: new Date().toISOString(),
    ip,
    ua: request.headers.get("user-agent") ?? "",
  });
  await notifyTelegram(lead as Lead);

  return NextResponse.json({ ok: true });
}
