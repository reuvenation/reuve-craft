"use client";

import Script from "next/script";
import { usePathname, useSearchParams } from "next/navigation";
import { Suspense, useEffect, useRef } from "react";

/** Счётчик Яндекс.Метрики для reuve.ru (аккаунт reuveques). */
const COUNTER_ID = 111720032;

declare global {
  interface Window {
    ym?: (counter: number, action: string, ...args: unknown[]) => void;
  }
}

/**
 * Досылает просмотр при клиентской навигации. Форма уводит на `/thanks`
 * через `router.push`, а такой переход счётчик сам не замечает — без хита
 * цель «посещение /thanks» не сработает ни разу.
 */
function RouteHits() {
  const pathname = usePathname();
  const search = useSearchParams();
  const firstRender = useRef(true);

  useEffect(() => {
    // Первый просмотр уже отправлен вызовом init.
    if (firstRender.current) {
      firstRender.current = false;
      return;
    }

    const query = search.toString();
    window.ym?.(COUNTER_ID, "hit", `${pathname}${query ? `?${query}` : ""}`);
  }, [pathname, search]);

  return null;
}

export function YandexMetrika() {
  return (
    <>
      <Script id="yandex-metrika" strategy="afterInteractive">
        {`(function(m,e,t,r,i,k,a){m[i]=m[i]||function(){(m[i].a=m[i].a||[]).push(arguments)};
m[i].l=1*new Date();
for (var j = 0; j < document.scripts.length; j++) {if (document.scripts[j].src === r) { return; }}
k=e.createElement(t),a=e.getElementsByTagName(t)[0],k.async=1,k.src=r,a.parentNode.insertBefore(k,a)})
(window, document, "script", "https://mc.yandex.ru/metrika/tag.js", "ym");

ym(${COUNTER_ID}, "init", {ssr:true, webvisor:true, clickmap:true, accurateTrackBounce:true, trackLinks:true});`}
      </Script>
      <Suspense fallback={null}>
        <RouteHits />
      </Suspense>
      <noscript>
        <div>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={`https://mc.yandex.ru/watch/${COUNTER_ID}`}
            style={{ position: "absolute", left: "-9999px" }}
            alt=""
          />
        </div>
      </noscript>
    </>
  );
}
