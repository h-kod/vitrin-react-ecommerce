"use client";

import { useEffect, useRef } from "react";

/** İmleç yaklaşınca çocuğu hafifçe kendine çeker. rAF ile lerp; handler içinde layout okuması yok. */
export function Magnetic({ children, strength = 0.28 }: { children: React.ReactNode; strength?: number }) {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el || matchMedia("(prefers-reduced-motion: reduce), (pointer: coarse)").matches) return;

    let cx = 0, cy = 0; // hover başında bir kez ölçülen merkez
    let tx = 0, ty = 0, x = 0, y = 0, raf = 0;

    const tick = () => {
      x += (tx - x) * 0.18;
      y += (ty - y) * 0.18;
      el.style.transform = `translate3d(${x}px, ${y}px, 0)`;
      const settled = Math.abs(tx - x) < 0.1 && Math.abs(ty - y) < 0.1;
      raf = settled ? 0 : requestAnimationFrame(tick);
    };
    const kick = () => { if (!raf) raf = requestAnimationFrame(tick); };

    const enter = () => {
      const r = el.getBoundingClientRect();
      cx = r.left + r.width / 2;
      cy = r.top + r.height / 2;
    };
    const move = (e: PointerEvent) => {
      tx = (e.clientX - cx) * strength;
      ty = (e.clientY - cy) * strength;
      kick();
    };
    const leave = () => { tx = 0; ty = 0; kick(); };

    el.addEventListener("pointerenter", enter);
    el.addEventListener("pointermove", move);
    el.addEventListener("pointerleave", leave);
    return () => {
      cancelAnimationFrame(raf);
      el.removeEventListener("pointerenter", enter);
      el.removeEventListener("pointermove", move);
      el.removeEventListener("pointerleave", leave);
      el.style.transform = "";
    };
  }, [strength]);

  return <div ref={ref} className="w-fit will-change-transform">{children}</div>;
}
