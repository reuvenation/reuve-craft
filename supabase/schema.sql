-- Схема Supabase для лендинга Reuve Craft (таблица заявок).
--
-- Выполнить один раз: Supabase → SQL Editor → вставить целиком → Run.
-- Проект — тот же, где живёт Ламакорд (isjbpafvwwhjchmsadpp), поэтому
-- таблица названа с префиксом: рядом уже лежит public.leads от Ламакорда.
--
-- Поля повторяют то, что шлёт браузер из src/lib/leads.ts.

create table if not exists public.reuve_leads (
  id          bigint generated always as identity primary key,
  name        text,
  phone       text not null,
  messenger   text,                      -- telegram / max / whatsapp
  source      text default 'Главная',    -- страница + utm-метки из адреса
  user_agent  text,
  created_at  timestamptz not null default now()
);

-- RLS: анонимный посетитель может только ДОБАВИТЬ заявку.
-- Читать через anon-ключ нельзя — заявки смотреть в дашборде Supabase
-- или через service_role. Именно поэтому anon-ключ не страшно держать
-- в коде статического сайта.
alter table public.reuve_leads enable row level security;

drop policy if exists "anon insert reuve_leads" on public.reuve_leads;
create policy "anon insert reuve_leads"
  on public.reuve_leads
  for insert
  to anon
  with check (true);

grant insert on public.reuve_leads to anon;
