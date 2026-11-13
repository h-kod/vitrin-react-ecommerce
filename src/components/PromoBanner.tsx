import Image from "next/image";
import Link from "next/link";
import type { Banner } from "@/data/campaigns";

/** Görsel zeminli kampanya banner'ı. Metin gradient üstünde, absolute değil (flex ile alta itilir). */
export function PromoBanner({ banner, sizes }: { banner: Banner; sizes: string }) {
  return (
    <Link
      href={banner.href}
      prefetch
      className="group relative isolate flex min-h-44 overflow-hidden rounded-card bg-sunken shadow-soft"
    >
      <div className="card-media absolute inset-0 overflow-hidden">
        <Image
          src={banner.image}
          alt=""
          fill
          sizes={sizes}
          className="object-cover"
          style={{ objectPosition: banner.pos }}
        />
      </div>
      <div className="absolute inset-0 bg-gradient-to-t from-black/75 via-black/20 to-transparent" aria-hidden />
      <div className="relative mt-auto flex w-full items-end justify-between gap-3 p-5 text-white">
        <div>
          <p className="text-xs text-white/80">{banner.kicker}</p>
          <h3 className="font-display mt-0.5 text-xl font-semibold leading-tight [text-shadow:0_1px_12px_rgb(0_0_0/0.5)]">
            {banner.title}
          </h3>
        </div>
        <span className="grid h-9 w-9 shrink-0 place-items-center rounded-ctl bg-white/90 text-ink transition-transform duration-500 group-hover:translate-x-1" aria-hidden>
          →
        </span>
      </div>
    </Link>
  );
}
