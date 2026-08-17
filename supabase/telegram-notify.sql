-- Уведомления в Telegram о новых заявках (Reuve Craft).
-- Механизм: триггер на INSERT в public.reuve_leads → pg_net → Telegram sendMessage.
--
-- ⚠️ ЭТО ШАБЛОН. Репозиторий публичный, поэтому токен бота сюда не вписан.
-- Перед запуском подставить свои значения вместо BOT_TOKEN и CHAT_ID
-- прямо в SQL Editor — в файл их не сохранять и в git не коммитить.
--
-- Где взять:
--   BOT_TOKEN — @BotFather → бот → API Token (можно завести отдельного
--               бота под Reuve Craft, можно взять существующего)
--   CHAT_ID   — добавить бота в группу заявок и открыть
--               https://api.telegram.org/bot<TOKEN>/getUpdates
--
-- Выполнить один раз: Supabase → SQL Editor → Run.

-- 1) HTTP-расширение для исходящих запросов из БД
create extension if not exists pg_net with schema extensions;

-- 2) Функция-уведомление
create or replace function public.notify_reuve_lead_telegram()
returns trigger
language plpgsql
security definer
set search_path = public, extensions, net
as $$
declare
  msg text;
begin
  msg := 'Новая заявка — Reuve Craft' || E'\n' ||
         'Имя: '       || coalesce(NEW.name, '—')      || E'\n' ||
         'Телефон: '   || coalesce(NEW.phone, '—')     || E'\n' ||
         'Мессенджер: '|| coalesce(NEW.messenger, '—') || E'\n' ||
         'Источник: '  || coalesce(NEW.source, '—')    || E'\n' ||
         to_char(timezone('Europe/Moscow', NEW.created_at), 'DD.MM.YYYY HH24:MI') || ' МСК';

  perform net.http_post(
    url     := 'https://api.telegram.org/botBOT_TOKEN/sendMessage',
    headers := jsonb_build_object('Content-Type', 'application/json'),
    body    := jsonb_build_object('chat_id', CHAT_ID, 'text', msg),
    -- 15 секунд, а не дефолтные 5: на Ламакорде хендшейк Supabase→Telegram
    -- в пять секунд не укладывался и уведомления молча терялись
    timeout_milliseconds := 15000
  );
  return NEW;
end;
$$;

-- 3) Триггер на вставку новой заявки
drop trigger if exists trg_notify_reuve_lead_telegram on public.reuve_leads;
create trigger trg_notify_reuve_lead_telegram
after insert on public.reuve_leads
for each row execute function public.notify_reuve_lead_telegram();
