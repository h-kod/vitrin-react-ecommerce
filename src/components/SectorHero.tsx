import Image from "next/image";
import { ViewTransition } from "react";
import { products } from "@/data/products";
import type { Sector } from "@/sectors";

/** Sektör girişi: ana sayfadaki kartın görseli buraya morph olur, başlık ve görsel scroll'da farklı hızda kayar. */
export function SectorHero({ sector }: { sector: Sector }) {
  const cover = products.find((p) => p.id === sector.cover);

  return (
    <header className="relative isolate flex min-h-[22rem] overflow-clip rounded-card bg-sunken shadow-soft sm:min-h-[26rem]">
      {cover && (
        <ViewTransition name={`cover-${sector.slug}`} share="morph" default="none">
          <div className="absolute inset-0 overflow-clip" aria-hidden>
            <Image
              src={cover.image}
              alt=""
              fill
              priority
              sizes="(min-width: 1152px) 1100px, 100vw"
              className="hero-parallax object-cover object-[50%_30%]"
            />
          </div>
        </ViewTransition>
      )}
      {/* Okunabilirlik için alt gradient; metin aşağıda, görselin üstünde (absolute değil) */}
      <div className="absolute inset-0 bg-gradient-to-t from-black/75 via-black/25 to-transparent" aria-hidden />

      <div className="hero-title relative mt-auto flex flex-col gap-3 p-6 text-white sm:p-10">
        <p className="w-fit rounded-ctl bg-black/45 px-3 py-1 text-xs font-medium backdrop-blur-sm">{sector.kicker}</p>
        <h1 className="font-display text-5xl font-semibold leading-none [text-shadow:0_2px_24px_rgb(0_0_0/0.45)] sm:text-7xl">
          {sector.name}
        </h1>
        <p className="max-w-md text-base text-white/85 [text-shadow:0_1px_12px_rgb(0_0_0/0.5)]">{sector.tagline}</p>
      </div>
    </header>
  );
}
