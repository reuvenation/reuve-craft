/**
 * Отправка заявки в Supabase.
 *
 * Сайт собирается статикой (GitHub Pages), поэтому серверного маршрута нет:
 * браузер пишет строку напрямую в таблицу `reuve_leads`. Anon-ключ публичный
 * по своей природе — доступ ограничен политикой RLS «только INSERT».
 * Уведомление в Telegram шлёт триггер на стороне базы, токен бота в браузер
 * не попадает. Схема повторяет рабочую связку лендинга Ламакорд.
 */

const SUPABASE_URL = "https://isjbpafvwwhjchmsadpp.supabase.co";
const SUPABASE_ANON_KEY =
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImlzamJwYWZ2d3doamNobXNhZHBwIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODExMDE4OTUsImV4cCI6MjA5NjY3Nzg5NX0.jKpnSQx8WI0s04o4xV3arzzBpPNpTH6gqmvLvq822PM";

const TABLE = "reuve_leads";

export type LeadPayload = {
  name: string;
  phone: string;
  messenger: string;
  /** какая версия страницы прислала заявку */
  page: string;
};

/** Метки рекламных кампаний из адреса — их кладём в `source`. */
function buildSource(page: string): string {
  if (typeof window === "undefined") return page;

  const params = new URLSearchParams(window.location.search);
  const utm = ["utm_source", "utm_medium", "utm_campaign", "utm_term"]
    .map((key) => {
      const value = params.get(key);
      return value ? `${key.replace("utm_", "")}: ${value}` : null;
    })
    .filter(Boolean);

  return [page, ...utm].join(" · ");
}

export async function sendLead(lead: LeadPayload): Promise<void> {
  const res = await fetch(`${SUPABASE_URL}/rest/v1/${TABLE}`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      apikey: SUPABASE_ANON_KEY,
      Authorization: `Bearer ${SUPABASE_ANON_KEY}`,
      Prefer: "return=minimal",
    },
    body: JSON.stringify({
      name: lead.name,
      phone: lead.phone,
      messenger: lead.messenger,
      source: buildSource(lead.page),
      user_agent:
        typeof navigator === "undefined" ? "" : navigator.userAgent.slice(0, 300),
    }),
  });

  if (!res.ok) {
    throw new Error("Не удалось отправить заявку");
  }
}
