"use client";

import Image from "next/image";
import Link from "next/link";
import { useCallback, useEffect, useRef, useState } from "react";
import type { Slide } from "@/data/campaigns";

const INTERVAL = 6000;

/** Native scroll-snap slider: dokunmatikte kaydırılır, klavyeyle düğmeler/noktalar kullanılır. */
export function HeroSlider({ slides }: { slides: Slide[] }) {
  const trackRef = useRef<HTMLDivElement>(null);
  const [index, setIndex] = useState(0);
  const [playing, setPlaying] = useState(true); // kullanıcı tercihi (durdur/oynat)
  const [hold, setHold] = useState(false); // hover veya odak içindeyken geçici duraklatma
  const [reduced, setReduced] = useState(false);

  useEffect(() => {
    const mq = matchMedia("(prefers-reduced-motion: reduce)");
    const sync = () => setReduced(mq.matches);
    sync();
    mq.addEventListener("change", sync);
    return () => mq.removeEventListener("change", sync);
  }, []);

  const goTo = useCallback(
    (i: number) => {
      const el = trackRef.current;
      if (!el) return;
      const next = (i + slides.length) % slides.length;
      el.scrollTo({ left: next * el.clientWidth, behavior: reduced ? "auto" : "smooth" });
    },
    [slides.length, reduced],
  );

  // Aktif slayt kaydırma konumundan hesaplanır (dokunmatik kaydırma dahil). IntersectionObserver eşik geçişlerine
  // dayanır ve yeniden boyutlanmada yanlış indeksi kilitleyebilir; konumdan hesaplamak her durumda tutarlıdır.
  const indexRef = useRef(0);
  useEffect(() => {
    indexRef.current = index;
  }, [index]);
  useEffect(() => {
    const el = trackRef.current;
    if (!el) return;
    let raf = 0;
    const sync = () => {
      raf = 0;
      setIndex(Math.round(el.scrollLeft / el.clientWidth) || 0);
    };
    const schedule = () => {
      if (!raf) raf = requestAnimationFrame(sync);
    };
    const onResize = () => {
      el.scrollTo({ left: indexRef.current * el.clientWidth, behavior: "auto" }); // genişlik değişince aktif slayt hizalı kalsın
      schedule();
    };
    el.addEventListener("scroll", schedule, { passive: true });
    window.addEventListener("resize", onResize);
    return () => {
      cancelAnimationFrame(raf);
      el.removeEventListener("scroll", schedule);
      window.removeEventListener("resize", onResize);
    };
  }, []);

  // Otomatik oynatma: reduced-motion, kullanıcı durdurması ve hover/odak durumunda çalışmaz
  const auto = playing && !hold && !reduced;
  useEffect(() => {
    if (!auto) return;
    const t = setTimeout(() => goTo(index + 1), INTERVAL);
    return () => clearTimeout(t);
  }, [auto, index, goTo]);

  const btn =
    "grid h-10 w-10 place-items-center rounded-ctl bg-black/45 text-white backdrop-blur-sm transition hover:bg-black/65 active:scale-95";

  return (
    <section
      aria-roledescription="carousel"
      aria-label="Kampanyalar"
      className="relative isolate flex h-full flex-col overflow-hidden rounded-card bg-sunken shadow-soft"
      onMouseEnter={() => setHold(true)}
      onMouseLeave={() => setHold(false)}
      onFocus={() => setHold(true)}
      onBlur={() => setHold(false)}
    >
      <div
        ref={trackRef}
        aria-live={auto ? "off" : "polite"}
        className="no-scrollbar flex h-full snap-x snap-mandatory overflow-x-auto"
      >
        {slides.map((s, i) => (
          <div
            key={s.id}
            data-i={i}
            data-active={i === index}
            role="group"
            aria-roledescription="slide"
            aria-label={`${i + 1} / ${slides.length}`}
            inert={i !== index}
            className="relative flex h-full min-h-[24rem] w-full shrink-0 snap-center sm:min-h-[28rem]"
          >
            <Link
              href={s.href}
              prefetch
              aria-label={s.title}
              className="absolute inset-0 overflow-hidden"
            >
              <Image
                src={s.image}
                alt=""
                fill
                priority={i === 0}
                sizes="(min-width: 1152px) 800px, 100vw"
                className="object-cover"
                style={{ objectPosition: s.pos }}
              />
            </Link>
            {/* Kontrollerin okunabilirliği için alt gradient; slaytta metin yok */}
            <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/45 to-transparent" aria-hidden />
          </div>
        ))}
      </div>

      <div className="absolute inset-x-0 bottom-0 flex items-center justify-between gap-3 p-4 sm:px-6">
        <div className="flex items-center gap-2 rounded-ctl bg-black/45 p-1.5 backdrop-blur-sm">
          {slides.map((s, i) => (
            <button
              key={s.id}
              type="button"
              aria-label={`Slayt ${i + 1}: ${s.kicker}`}
              aria-current={i === index}
              onClick={() => goTo(i)}
              className={`h-2.5 rounded-full bg-white transition-all duration-500 ${i === index ? "w-8" : "w-2.5 opacity-50 hover:opacity-80"}`}
            />
          ))}
        </div>
        <div className="flex gap-2">
          <button type="button" className={btn} aria-label={playing ? "Otomatik oynatmayı durdur" : "Otomatik oynatmayı başlat"} onClick={() => setPlaying((p) => !p)}>
            {playing ? "❚❚" : "▶"}
          </button>
          <button type="button" className={btn} aria-label="Önceki slayt" onClick={() => goTo(index - 1)}>←</button>
          <button type="button" className={btn} aria-label="Sonraki slayt" onClick={() => goTo(index + 1)}>→</button>
        </div>
      </div>
    </section>
  );
}
