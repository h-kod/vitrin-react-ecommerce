export type PdpModule = "variants" | "specs" | "unitPrice" | "deliverySlot";

export type Sector = {
  slug: string;
  name: string;
  tagline: string;
  /** Hero ve ana sayfa kartında kullanılan ürünün id'si (görsel kaynağı) */
  cover: string;
  /** Hero üstündeki küçük etiket */
  kicker: string;
  /** Ürün `attrs` içinden filtre (facet) olarak sunulacak anahtarlar */
  facets: { key: string; label: string }[];
  /** PDP'de sektöre göre render edilecek modüller */
  modules: PdpModule[];
};

// Sektör = veri + config (facet'ler, ürün sayfası modülleri). Görünüm tüm sektörlerde aynıdır.
// Yeni dikey eklemek için: buraya kayıt, data'ya ürün.
export const sectors = {
  moda: {
    slug: "moda",
    name: "Moda",
    tagline: "Beden ve renk varyantlı giyim",
    cover: "m3",
    kicker: "Sezon koleksiyonu",
    facets: [
      { key: "kategori", label: "Kategori" },
      { key: "renk", label: "Renk" },
      { key: "cinsiyet", label: "Cinsiyet" },
    ],
    modules: ["variants"],
  },
  elektronik: {
    slug: "elektronik",
    name: "Elektronik",
    tagline: "Teknik özellik tablolu ürünler",
    cover: "e1",
    kicker: "Teknik katalog",
    facets: [
      { key: "kategori", label: "Kategori" },
      { key: "marka", label: "Marka" },
    ],
    modules: ["specs"],
  },
  market: {
    slug: "market",
    name: "Market",
    tagline: "Birim fiyat ve teslimat slotu",
    cover: "g1",
    kicker: "Her gün taze",
    facets: [
      { key: "kategori", label: "Kategori" },
      { key: "marka", label: "Marka" },
    ],
    modules: ["unitPrice", "deliverySlot"],
  },
} satisfies Record<string, Sector>;

export const sectorList: Sector[] = Object.values(sectors);

export function getSector(slug: string): Sector | undefined {
  return (sectors as Record<string, Sector>)[slug];
}
