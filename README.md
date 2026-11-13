# vitrin

Sektör-bağımsız React storefront. Tek kod tabanı; katalog, sepet ve PDP ortak, **sektör = config + veri**.

| Sektör | Facet'ler | PDP modülleri |
|---|---|---|
| Moda | kategori, renk, cinsiyet | beden varyantları |
| Elektronik | kategori, marka | teknik özellik tablosu |
| Market | kategori, marka | birim fiyat, teslimat slotu |

Yeni dikey: `src/sectors/index.ts`'e bir kayıt + `src/data/products.ts`'e ürün.

**Tek tasarım:** tüm sektörler aynı paleti, fontu (Geist) ve köşe dilini kullanır; renk/tipografi tokenları `src/app/globals.css` içindeki `:root` bloğundadır. Açık mod standarttır.

## Stack
Next.js 16 (App Router, Cache Components / PPR), React 19, TypeScript, Tailwind 4.

## Öne çıkan React/Next kararları
- **Statik kabuk + stream:** `cookies()` ve `searchParams` okuyan her şey `<Suspense>` içinde; kabuk prerender edilir, stok/sepet/filtre sonucu request-time stream edilir.
- **`'use cache'` + `cacheTag`:** katalog okumaları tag'li cache'te; ileride webhook ile `revalidateTag('catalog')`.
- **Server Actions ile sepet:** httpOnly cookie, `refresh()` ile tek turda header rozeti + sayfa güncellenir.
- **`useOptimistic`:** sepet adedi sunucu cevabını beklemeden değişir, hata olursa server state'e döner.
- **Server-rendered facet'ler:** filtreler `<Link>` + URL; client JS yok, paylaşılabilir URL.

## Çalıştırma
```bash
npm install
npm run dev   # http://localhost:3000
```

## Bilinçli ödünler
- **Bilinmeyen sektör/slug → 200 + `noindex` + 404 UI.** Cache Components altında `notFound()` Suspense içinde çalışır; kabuk 200 ile gitmiş olur, Next `<meta name="robots" content="noindex">` ekler. Gerçek 404 status gerekirse: `proxy.ts`'te path'i katalogla doğrulayıp erken 404 dön (`dynamicParams=false` Cache Components ile kullanılamıyor).
- Varyant seçimi sepete taşınmıyor; teslimat slotu statik liste. İlgili yerlerde `ponytail:` yorumu var.

## Görseller
Ürün fotoğrafları [Unsplash](https://unsplash.com) (Unsplash License), `public/products/` altında yerel; fotoğrafçı kredileri `public/products/CREDITS.md`. Dosya adı = ürün `id`'si.
