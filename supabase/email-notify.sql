-- Уведомления о новых заявках на почту (Reuve Craft).
-- Механизм: триггер на INSERT в public.reuve_leads → pg_net → Resend API.
--
-- Почему не SMTP: pg_net умеет только HTTP, отправить письмо напрямую
-- из Postgres нельзя. Поэтому берём почтовый сервис с HTTP API.
--
-- ⚠️ ЭТО ШАБЛОН. Репозиторий публичный, ключ сюда не вписан.
-- Перед запуском подставить свой RESEND_API_KEY прямо в SQL Editor —
-- в файл его не сохранять и в git не коммитить.
--
-- Где взять: resend.com → API Keys → Create API Key (ключ вида re_...).
--
-- Про адрес отправителя (FROM_EMAIL):
--   * пока домен reuve.ru не подтверждён в Resend — только
--     onboarding@resend.dev, и письма уходят ТОЛЬКО на адрес владельца
--     аккаунта Resend. Нам этого достаточно: заявки идут владельцу;
--   * после подтверждения домена (Resend → Domains → добавить reuve.ru
--     и прописать выданные DNS-записи в Рег.ру) можно слать
--     с zayavka@reuve.ru на любые адреса.
--
-- Выполнить один раз: Supabase → SQL Editor → Run.

-- 1) HTTP-расширение для исходящих запросов из БД
create extension if not exists pg_net with schema extensions;

-- 2) Функция-уведомление
create or replace function public.notify_reuve_lead_email()
returns trigger
language plpgsql
security definer
set search_path = public, extensions, net
as $$
declare
  body_text text;
  subj      text;
  moscow    text;
begin
  moscow := to_char(timezone('Europe/Moscow', NEW.created_at), 'DD.MM.YYYY HH24:MI');

  subj := 'Заявка с сайта — ' || coalesce(nullif(trim(NEW.name), ''), 'без имени');

  -- письмо простым текстом: имя и источник приходят от посетителя,
  -- в тексте они не могут ничего сломать, в отличие от html
  body_text :=
    'Новая заявка с сайта reuve.ru'          || E'\n\n' ||
    'Имя: '        || coalesce(NEW.name, '—')      || E'\n' ||
    'Телефон: '    || coalesce(NEW.phone, '—')     || E'\n' ||
    'Мессенджер: ' || coalesce(NEW.messenger, '—') || E'\n' ||
    'Источник: '   || coalesce(NEW.source, '—')    || E'\n' ||
    'Время: '      || moscow || ' МСК'             || E'\n\n' ||
    'Все заявки — в Supabase, таблица reuve_leads.';

  perform net.http_post(
    url     := 'https://api.resend.com/emails',
    headers := jsonb_build_object(
      'Content-Type',  'application/json',
      'Authorization', 'Bearer RESEND_API_KEY'
    ),
    body    := jsonb_build_object(
      'from',    'Reuve Craft <onboarding@resend.dev>',
      'to',      jsonb_build_array('kotov_95@mail.ru'),
      'subject', subj,
      'text',    body_text
    ),
    -- 15 секунд, а не дефолтные 5: на Ламакорде хендшейк из Supabase
    -- наружу в пять секунд не укладывался и уведомления молча терялись
    timeout_milliseconds := 15000
  );
  return NEW;
end;
$$;

-- 3) Триггер на вставку новой заявки
drop trigger if exists trg_notify_reuve_lead_email on public.reuve_leads;
create trigger trg_notify_reuve_lead_email
after insert on public.reuve_leads
for each row execute function public.notify_reuve_lead_email();

-- Проверка: вставить тестовую заявку и посмотреть, пришло ли письмо.
--   insert into public.reuve_leads (name, phone, messenger, source)
--   values ('Проверка почты', '+7 (900) 000-00-00', 'telegram', 'Тест');
-- Ответ Resend виден в net._http_response:
--   select status_code, content from net._http_response order by id desc limit 3;
-- Убрать тест:
--   delete from public.reuve_leads where source = 'Тест';
