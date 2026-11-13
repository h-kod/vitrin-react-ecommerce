export type Product = {
  id: string;
  sector: string;
  slug: string;
  name: string;
  brand: string;
  price: number;
  image: string;
  description: string;
  /** Facet değerleri — sektör config'indeki `facets` anahtarlarıyla eşleşir */
  attrs: Record<string, string>;
  /** Varyantsız ürünün stoğu. Varyantlı üründe stok `variants[].stock` içindedir. */
  stock?: number;
  variants?: { label: string; stock: number }[];
  specs?: Record<string, string>;
  /** Birim fiyat hesabı için: 600 g peynir → { kind: "kg", size: 0.6 } */
  unit?: { kind: "kg" | "lt" | "adet"; size: number };
};

const img = (id: string) => `/products/${id}.jpg`;

export const products: Product[] = [
  // --- moda ---
  {
    id: "m1", sector: "moda", slug: "basic-pamuklu-tisort", name: "Basic Pamuklu Tişört", brand: "Nordic",
    price: 349.9, image: img("m1"),
    description: "%100 organik pamuk, bisiklet yaka, günlük kullanım için rahat kalıp.",
    attrs: { kategori: "Tişört", renk: "Beyaz", cinsiyet: "Kadın" },
    variants: [{ label: "XS", stock: 3 }, { label: "S", stock: 8 }, { label: "M", stock: 0 }, { label: "L", stock: 5 }, { label: "XL", stock: 2 }],
  },
  {
    id: "m2", sector: "moda", slug: "oversize-tisort", name: "Oversize Tişört", brand: "Nordic",
    price: 399.9, image: img("m2"),
    description: "Düşük omuzlu, bol kesim, ağır gramajlı pamuk.",
    attrs: { kategori: "Tişört", renk: "Siyah", cinsiyet: "Erkek" },
    variants: [{ label: "S", stock: 4 }, { label: "M", stock: 6 }, { label: "L", stock: 6 }, { label: "XL", stock: 1 }],
  },
  {
    id: "m3", sector: "moda", slug: "keten-yazlik-elbise", name: "Keten Yazlık Elbise", brand: "Atlas",
    price: 1299, image: img("m3"),
    description: "Doğal keten, diz üstü kesim, rahat A kalıp.",
    attrs: { kategori: "Elbise", renk: "Bej", cinsiyet: "Kadın" },
    variants: [{ label: "34", stock: 2 }, { label: "36", stock: 5 }, { label: "38", stock: 5 }, { label: "40", stock: 0 }],
  },
  {
    id: "m4", sector: "moda", slug: "deri-biker-ceket", name: "Deri Biker Ceket", brand: "Atlas",
    price: 4499, image: img("m4"),
    description: "Hakiki kuzu derisi, asimetrik fermuar, kapitone astar.",
    attrs: { kategori: "Ceket", renk: "Siyah", cinsiyet: "Erkek" },
    variants: [{ label: "M", stock: 2 }, { label: "L", stock: 3 }, { label: "XL", stock: 1 }],
  },
  {
    id: "m5", sector: "moda", slug: "kosu-ayakkabisi", name: "Koşu Ayakkabısı", brand: "Mono",
    price: 2199, image: img("m5"),
    description: "Hafif köpük taban, nefes alan file üst yüzey.",
    attrs: { kategori: "Ayakkabı", renk: "Beyaz", cinsiyet: "Unisex" },
    variants: [{ label: "38", stock: 2 }, { label: "40", stock: 7 }, { label: "42", stock: 9 }, { label: "44", stock: 0 }],
  },
  {
    id: "m6", sector: "moda", slug: "yun-karisimli-palto", name: "Yün Karışımlı Palto", brand: "Atlas",
    price: 3899, image: img("m6"),
    description: "%70 yün, kruvaze kapama, diz altı boy.",
    attrs: { kategori: "Ceket", renk: "Bej", cinsiyet: "Kadın" },
    variants: [{ label: "36", stock: 1 }, { label: "38", stock: 4 }, { label: "40", stock: 4 }],
  },

  // --- elektronik ---
  {
    id: "e1", stock: 7, sector: "elektronik", slug: "ultrabook-14", name: "Ultrabook 14\"", brand: "Voltra",
    price: 42999, image: img("e1"),
    description: "1,2 kg, 18 saat pil, 2.8K OLED ekran.",
    attrs: { kategori: "Laptop", marka: "Voltra" },
    specs: { İşlemci: "8 çekirdek / 16 iş parçacığı", RAM: "16 GB LPDDR5", Depolama: "1 TB NVMe", Ekran: "14\" 2880×1800 OLED 90 Hz", Ağırlık: "1,2 kg" },
  },
  {
    id: "e2", stock: 8, sector: "elektronik", slug: "gaming-laptop-16", name: "Gaming Laptop 16\"", brand: "Nexon",
    price: 64999, image: img("e2"),
    description: "Ayrık GPU, 240 Hz panel, RGB klavye.",
    attrs: { kategori: "Laptop", marka: "Nexon" },
    specs: { İşlemci: "16 çekirdek", GPU: "12 GB GDDR6", RAM: "32 GB DDR5", Depolama: "2 TB NVMe", Ekran: "16\" 2560×1600 240 Hz" },
  },
  {
    id: "e3", stock: 9, sector: "elektronik", slug: "akilli-telefon-128", name: "Akıllı Telefon 128 GB", brand: "Aurea",
    price: 29999, image: img("e3"),
    description: "6,4\" AMOLED, 50 MP ana kamera, 5000 mAh.",
    attrs: { kategori: "Telefon", marka: "Aurea" },
    specs: { Ekran: "6,4\" AMOLED 120 Hz", Kamera: "50 + 12 + 8 MP", Pil: "5000 mAh", Depolama: "128 GB", Suya_dayanıklılık: "IP68" },
  },
  {
    id: "e4", stock: 1, sector: "elektronik", slug: "kablosuz-kulaklik-anc", name: "Kablosuz Kulaklık ANC", brand: "Voltra",
    price: 9499, image: img("e4"),
    description: "Aktif gürültü engelleme, 30 saat pil, çoklu cihaz bağlantısı.",
    attrs: { kategori: "Kulaklık", marka: "Voltra" },
    specs: { Tip: "Kulak üstü", ANC: "Var", Pil: "30 saat", Bluetooth: "5.3", Ağırlık: "250 g" },
  },
  {
    id: "e5", stock: 0, sector: "elektronik", slug: "27-144hz-monitor", name: "27\" 144 Hz Monitör", brand: "Nexon",
    price: 11999, image: img("e5"),
    description: "QHD IPS panel, 1 ms, yükseklik ayarlı stand.",
    attrs: { kategori: "Monitör", marka: "Nexon" },
    specs: { Panel: "IPS", Çözünürlük: "2560×1440", Yenileme: "144 Hz", Tepki: "1 ms", Bağlantı: "2× HDMI, 1× DP" },
  },
  {
    id: "e6", stock: 3, sector: "elektronik", slug: "kulak-ici-spor-kulaklik", name: "Kulak İçi Spor Kulaklık", brand: "Aurea",
    price: 2299, image: img("e6"),
    description: "Tere dayanıklı, kulak kancalı, 8 saat pil.",
    attrs: { kategori: "Kulaklık", marka: "Aurea" },
    specs: { Tip: "Kulak içi", Dayanıklılık: "IPX5", Pil: "8 + 24 saat", Bluetooth: "5.2" },
  },

  // --- market ---
  {
    id: "g1", stock: 9, sector: "market", slug: "domates", name: "Domates", brand: "Yerli Üretim",
    price: 59.9, image: img("g1"),
    description: "Salkım domates, günlük hasat.",
    attrs: { kategori: "Meyve-Sebze", marka: "Yerli Üretim" },
    unit: { kind: "kg", size: 1 },
  },
  {
    id: "g2", stock: 1, sector: "market", slug: "muz", name: "Muz", brand: "İthal",
    price: 89.9, image: img("g2"),
    description: "Ekvador muzu, olgunlaşmış.",
    attrs: { kategori: "Meyve-Sebze", marka: "İthal" },
    unit: { kind: "kg", size: 1 },
  },
  {
    id: "g3", stock: 0, sector: "market", slug: "gunluk-sut-1l", name: "Günlük Süt 1 L", brand: "Çiftlik",
    price: 44.9, image: img("g3"),
    description: "Pastörize tam yağlı günlük süt.",
    attrs: { kategori: "Süt Ürünleri", marka: "Çiftlik" },
    unit: { kind: "lt", size: 1 },
  },
  {
    id: "g4", stock: 3, sector: "market", slug: "beyaz-peynir-600g", name: "Beyaz Peynir 600 g", brand: "Çiftlik",
    price: 189.9, image: img("g4"),
    description: "Tam yağlı inek peyniri, olgunlaştırılmış.",
    attrs: { kategori: "Süt Ürünleri", marka: "Çiftlik" },
    unit: { kind: "kg", size: 0.6 },
  },
  {
    id: "g5", stock: 4, sector: "market", slug: "patates-cipsi-150g", name: "Patates Cipsi 150 g", brand: "Çıtır",
    price: 64.9, image: img("g5"),
    description: "Klasik tuzlu, ayçiçek yağında kızartılmış.",
    attrs: { kategori: "Atıştırmalık", marka: "Çıtır" },
    unit: { kind: "kg", size: 0.15 },
  },
  {
    id: "g6", stock: 5, sector: "market", slug: "maden-suyu-6x200ml", name: "Maden Suyu 6×200 ml", brand: "Kaynak",
    price: 79.9, image: img("g6"),
    description: "Doğal mineralli, sade.",
    attrs: { kategori: "İçecek", marka: "Kaynak" },
    unit: { kind: "lt", size: 1.2 },
  },
];
