"use client";

import { createContext, useContext, useState } from "react";

type Ctx = { selected: string | null; setSelected: (v: string) => void };
const VariantCtx = createContext<Ctx | null>(null);

/** Beden seçimi, aralarında Suspense sınırı olan Variants ve AddToCart arasında paylaşılır. */
export function VariantProvider({ children }: { children: React.ReactNode }) {
  const [selected, setSelected] = useState<string | null>(null);
  return <VariantCtx value={{ selected, setSelected }}>{children}</VariantCtx>;
}

export const useVariant = () => useContext(VariantCtx);
