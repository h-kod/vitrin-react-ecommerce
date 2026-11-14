// Demo kampanya içeriği: metinler örnek amaçlıdır, gerçek bir kampanyayı temsil etmez.
export type Slide = {
  id: string;
  href: string;
  kicker: string;
  /** Slayt bağlantısının erişilebilir adı */
  title: string;
  image: string;
  /** object-position: hero kırpılırken öznenin görünmesi için */
  pos?: string;
};

export type Banner = Pick<Slide, "id" | "href" | "kicker" | "title" | "image" | "pos">;

export const slides: Slide[] = [
  {
    id: "yeni-sezon",
    href: "/moda",
    kicker: "Yeni sezon",
    title: "Sıcak tonlar, rahat kesimler",
    image: "/products/m6.jpg",
    pos: "50% 22%",
  },
  {
    id: "teknoloji",
    href: "/elektronik",
    kicker: "Teknoloji günleri",
    title: "Sesin ve ekranın en iyisi",
    image: "/products/e4.jpg",
    pos: "50% 40%",
  },
  {
    id: "taze",
    href: "/market",
    kicker: "Her gün taze",
    title: "Sofranıza taze ve yerel",
    image: "/products/g1.jpg",
    pos: "50% 50%",
  },
];

export const banners: Banner[] = [
  { id: "oyun", href: "/elektronik?kategori=Laptop", kicker: "Oyun gecesi", title: "Gaming laptop'lar", image: "/products/e2.jpg", pos: "50% 30%" },
  { id: "ceket", href: "/moda?kategori=Ceket", kicker: "Sezon parçası", title: "Deri ve yün ceketler", image: "/products/m4.jpg", pos: "50% 40%" },
];

export const perks = [
  { id: "kargo", title: "Ücretsiz kargo", text: "500 TL ve üzeri siparişlerde" },
  { id: "teslimat", title: "Aynı gün teslimat", text: "Market ürünlerinde slot seçerek" },
  { id: "taksit", title: "6 taksit imkânı", text: "Elektronik alışverişlerde" },
];
