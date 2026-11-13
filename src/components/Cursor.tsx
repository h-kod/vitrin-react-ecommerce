"use client";

import { useEffect, useRef } from "react";

/** İmleci izleyen halka. Yerel imleç gizlenmez; halka eklenti olarak süzülür, etkileşimli öğeye yaklaşınca
 *  büyür ve öğenin merkezine doğru çekilir (magnetic snap). Dokunmatik ve reduced-motion'da hiç kurulmaz. */
export function Cursor() {
  const ring = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = ring.current;
    if (!el || !matchMedia("(hover: hover) and (pointer: fine) and (prefers-reduced-motion: no-preference)").matches) return;

    let px = -100, py = -100; // imleç
    let x = px, y = py, scale = 1, raf = 0;
    let target: { cx: number; cy: number; w: number; h: number } | null = null; // pointerover'da bir kez ölçülür
    let pressed = false;
    el.style.opacity = "0";

    const tick = () => {
      // Hedef varsa halka öğenin merkezine %35 çekilir
      const tx = target ? px + (target.cx - px) * 0.35 : px;
      const ty = target ? py + (target.cy - py) * 0.35 : py;
      const ts = pressed ? 0.7 : target ? 1.9 : 1;
      x += (tx - x) * 0.2;
      y += (ty - y) * 0.2;
      scale += (ts - scale) * 0.2;
      el.style.transform = `translate3d(${x - 18}px, ${y - 18}px, 0) scale(${scale})`;
      raf = requestAnimationFrame(tick);
    };

    const move = (e: PointerEvent) => {
      px = e.clientX;
      py = e.clientY;
      el.style.opacity = "1";
    };
    const over = (e: PointerEvent) => {
      const t = (e.target as Element).closest<HTMLElement>("a, button, [role=radio], input");
      if (!t || (t as HTMLButtonElement).disabled) { target = null; return; }
      const r = t.getBoundingClientRect(); // hover başına tek ölçüm
      target = { cx: r.left + r.width / 2, cy: r.top + r.height / 2, w: r.width, h: r.height };
    };
    const leaveDoc = () => { el.style.opacity = "0"; };
    const down = () => { pressed = true; };
    const up = () => { pressed = false; };

    document.addEventListener("pointermove", move, { passive: true });
    document.addEventListener("pointerover", over, { passive: true });
    document.addEventListener("pointerdown", down, { passive: true });
    document.addEventListener("pointerup", up, { passive: true });
    document.documentElement.addEventListener("pointerleave", leaveDoc);
    raf = requestAnimationFrame(tick);
    return () => {
      cancelAnimationFrame(raf);
      document.removeEventListener("pointermove", move);
      document.removeEventListener("pointerover", over);
      document.removeEventListener("pointerdown", down);
      document.removeEventListener("pointerup", up);
      document.documentElement.removeEventListener("pointerleave", leaveDoc);
    };
  }, []);

  return (
    <div
      ref={ring}
      aria-hidden
      className="pointer-events-none fixed left-0 top-0 z-50 h-9 w-9 rounded-full border-[1.5px] border-white opacity-0 mix-blend-difference transition-opacity duration-300"
    />
  );
}
