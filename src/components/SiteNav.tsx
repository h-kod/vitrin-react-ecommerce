"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { sectorList } from "@/sectors";

const isActive = (path: string | undefined, slug: string) =>
  path !== undefined && (path === `/${slug}` || path.startsWith(`/${slug}/`));

/** Masaüstü gezinme: geçerli sektör aria-current ile işaretlenir ve altı çizilir. */
function NavLinks({ path }: { path?: string }) {
  return (
    <nav aria-label="Ana menü" className="hidden items-center gap-1 md:flex">
      {sectorList.map((s) => (
        <Link
          key={s.slug}
          href={`/${s.slug}`}
          prefetch
          aria-current={isActive(path, s.slug) ? "page" : undefined}
          className="nav-link px-3 py-2 text-sm font-medium text-muted transition-colors hover:text-ink aria-[current=page]:text-ink"
        >
          {s.name}
        </Link>
      ))}
    </nav>
  );
}

// usePathname() URL verisi okur ve cacheComponents altında prerender sırasında Suspense sınırı ister.
export function DesktopNav() {
  const path = usePathname();
  return <NavLinks path={path} />;
}

export function DesktopNavFallback() {
  return <NavLinks />;
}

/** Mobil menü: hamburger düğmesi ve tam genişlikte açılır panel. Rota değişince, Escape'te ve dışarı tıklayınca kapanır. */
function MobileMenuView({ path }: { path?: string }) {
  // Menü "hangi rotada açıldı" olarak tutulur: rota değişince efekt gerekmeden kendiliğinden kapanır
  const [openAt, setOpenAt] = useState<string | null>(null);
  const open = path !== undefined && openAt === path;
  const setOpen = (v: boolean) => setOpenAt(v && path !== undefined ? path : null);
  const root = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!open) return;
    const close = () => setOpenAt(null);
    const onDown = (e: PointerEvent) => !root.current?.contains(e.target as Node) && close();
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && close();
    document.addEventListener("pointerdown", onDown);
    document.addEventListener("keydown", onKey);
    return () => {
      document.removeEventListener("pointerdown", onDown);
      document.removeEventListener("keydown", onKey);
    };
  }, [open]);

  return (
    <div ref={root} className="md:hidden">
      <button
        type="button"
        aria-label={open ? "Menüyü kapat" : "Menüyü aç"}
        aria-expanded={open}
        aria-controls="mobile-menu"
        onClick={() => setOpen(!open)}
        className="grid h-10 w-10 place-items-center rounded-ctl border border-line bg-surface transition hover:border-ink"
      >
        <span aria-hidden className="relative block h-3 w-5">
          <span className={`absolute left-0 h-0.5 w-5 bg-ink transition-all duration-300 ${open ? "top-1/2 -translate-y-1/2 rotate-45" : "top-0"}`} />
          <span className={`absolute left-0 top-1/2 h-0.5 w-5 -translate-y-1/2 bg-ink transition-opacity duration-200 ${open ? "opacity-0" : ""}`} />
          <span className={`absolute left-0 h-0.5 w-5 bg-ink transition-all duration-300 ${open ? "top-1/2 -translate-y-1/2 -rotate-45" : "bottom-0"}`} />
        </span>
      </button>

      {open && (
        <nav
          id="mobile-menu"
          aria-label="Ana menü"
          className="absolute inset-x-0 top-full border-b border-line bg-canvas shadow-soft"
        >
          <ul className="mx-auto flex max-w-6xl flex-col px-5 py-2">
            {sectorList.map((s, i) => (
              <li key={s.slug} className="border-b border-line last:border-b-0">
                <Link
                  href={`/${s.slug}`}
                  prefetch
                  aria-current={isActive(path, s.slug) ? "page" : undefined}
                  className="flex items-center gap-4 py-4 font-display text-2xl font-semibold text-muted aria-[current=page]:text-ink"
                >
                  <span aria-hidden className="w-6 text-sm tabular-nums text-muted">0{i + 1}</span>
                  {s.name}
                  <span aria-hidden className="ml-auto text-muted">→</span>
                </Link>
              </li>
            ))}
          </ul>
        </nav>
      )}
    </div>
  );
}

export function MobileMenu() {
  const path = usePathname();
  return <MobileMenuView path={path} />;
}

export function MobileMenuFallback() {
  return <MobileMenuView />;
}
