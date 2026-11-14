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
      {/* Okunabilirlik gradient'i metinle birlikte kalktı; yalnızca görsel kaldı */}
      <h1 className="sr-only">{sector.name}</h1>
    </header>
  );
}
