import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Suspense } from "react";
import { ProductCard } from "@/components/ProductCard";
import { SectorHero } from "@/components/SectorHero";
import { facetValues, getProducts } from "@/lib/catalog";
import { getSector, sectors, type Sector } from "@/sectors";

type Props = PageProps<"/[sector]">;

export function generateStaticParams() {
  return Object.keys(sectors).map((sector) => ({ sector }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { sector } = await params;
  return { title: getSector(sector)?.name ?? "Bulunamadı" };
}

// Kabuk (layout + iskelet) statik; params'a bağlı her şey Suspense içinde → navigasyon instant.
export default function SectorPage(props: Props) {
  return (
    <main className="flex flex-col gap-8">
      <Suspense fallback={<PageSkeleton />}>
        <SectorContent params={props.params} searchParams={props.searchParams} />
      </Suspense>
    </main>
  );
}

async function SectorContent({ params, searchParams }: Pick<Props, "params" | "searchParams">) {
  const { sector: slug } = await params;
  const sector = getSector(slug);
  if (!sector) notFound();

  return (
    <div className="flex flex-col gap-8">
      <SectorHero sector={sector} />
      {/* searchParams ayrı sınırda: sektör başlığı listeyi beklemeden gelir */}
      <Suspense fallback={<GridSkeleton />}>
        <Catalog sector={sector} searchParams={searchParams} />
      </Suspense>
    </div>
  );
}

async function Catalog({ sector, searchParams }: { sector: Sector; searchParams: Props["searchParams"] }) {
  const sp = await searchParams;
  const filters: Record<string, string> = {};
  for (const f of sector.facets) {
    const v = sp[f.key];
    if (typeof v === "string" && v) filters[f.key] = v;
  }

  const [all, list] = await Promise.all([getProducts(sector.slug), getProducts(sector.slug, filters)]);

  const hrefFor = (key: string, value: string) => {
    const q = new URLSearchParams(filters);
    if (filters[key] === value) q.delete(key);
    else q.set(key, value);
    const s = q.toString();
    return `/${sector.slug}${s ? `?${s}` : ""}`;
  };

  return (
    <>
      <div className="flex flex-col gap-4 rounded-card border border-line bg-surface p-5 shadow-soft">
        {sector.facets.map((f) => (
          <div key={f.key} className="flex flex-wrap items-center gap-2">
            <h2 className="w-24 text-xs font-medium uppercase tracking-wide text-muted">{f.label}</h2>
            {facetValues(all, f.key).map((v) => {
              const active = filters[f.key] === v;
              return (
                <Link
                  key={v}
                  href={hrefFor(f.key, v)}
                  aria-pressed={active}
                  className={`rounded-ctl border px-3.5 py-1.5 text-sm transition ${
                    active
                      ? "border-accent bg-accent text-accent-ink"
                      : "border-line hover:border-ink"
                  }`}
                >
                  {v}
                </Link>
              );
            })}
          </div>
        ))}
        {Object.keys(filters).length > 0 && (
          <Link href={`/${sector.slug}`} className="w-fit text-sm text-muted underline underline-offset-4 hover:text-ink">
            Filtreleri temizle
          </Link>
        )}
      </div>

      <section>
        <p className="mb-5 text-sm text-muted">{list.length} ürün</p>
        {list.length === 0 ? (
          <p className="rounded-card bg-sunken p-10 text-center text-muted">Bu filtreyle eşleşen ürün yok.</p>
        ) : (
          <ul className="grid grid-cols-2 gap-x-4 gap-y-8 lg:grid-cols-3">
            {list.map((p) => (
              <li key={p.id} className="reveal"><ProductCard product={p} /></li>
            ))}
          </ul>
        )}
      </section>
    </>
  );
}

function PageSkeleton() {
  return (
    <>
      <div className="h-10 w-48 animate-pulse rounded-ctl bg-sunken" aria-hidden />
      <GridSkeleton />
    </>
  );
}

function GridSkeleton() {
  return (
    <div className="grid grid-cols-2 gap-4 lg:grid-cols-3" aria-hidden>
      {Array.from({ length: 6 }, (_, i) => (
        <div key={i} className="aspect-[4/5] animate-pulse rounded-card bg-sunken" />
      ))}
    </div>
  );
}
