"use client";

import Link from "next/link";
import Image from "next/image";
import { formatTHB } from "@/lib/money";
import type { CatalogProduct } from "@/lib/catalog";
import { trackSelectItem } from "@/lib/analytics";

export default function ProductCard({ product }: { product: CatalogProduct }) {
  const onSelect = () => {
    trackSelectItem({
      slug: product.slug,
      name: product.name,
      category: product.categoryName,
      price: product.basePrice,
      listName: "catalog",
    });
  };

  return (
    <article className="group flex flex-col overflow-hidden rounded-2xl border border-slate-200 bg-white transition hover:-translate-y-1 hover:shadow-card">
      <Link href={`/products/${product.slug}`} onClick={onSelect} className="relative block aspect-[4/3] overflow-hidden bg-slate-100">
        {product.image ? (
          <Image
            src={product.image}
            alt={product.name}
            fill
            sizes="(min-width: 1024px) 33vw, (min-width: 640px) 50vw, 100vw"
            className="object-cover transition duration-500 group-hover:scale-105"
          />
        ) : null}
        <span className="absolute left-3 top-3 rounded-full bg-white/90 px-3 py-1 text-xs font-semibold text-brand-700 backdrop-blur">
          {product.categoryName}
        </span>
      </Link>

      <div className="flex flex-1 flex-col p-5">
        <h3 className="text-lg font-semibold text-slate-900">{product.name}</h3>
        <p className="mt-1 line-clamp-2 text-sm text-slate-600">
          {product.shortDescription}
        </p>

        {product.tags.length > 0 && (
          <div className="mt-3 flex flex-wrap gap-1.5">
            {product.tags.slice(0, 3).map((t) => (
              <span
                key={t}
                className="rounded-full bg-slate-100 px-2 py-0.5 text-[11px] text-slate-600"
              >
                #{t}
              </span>
            ))}
          </div>
        )}

        <div className="mt-4 flex items-end justify-between">
          <div>
            <p className="text-xs text-slate-500">ราคาเริ่มต้น</p>
            <p className="text-xl font-bold text-brand-700">
              {formatTHB(product.basePrice)}
            </p>
          </div>
          <Link
            href={`/products/${product.slug}`}
            onClick={onSelect}
            className="btn-primary !px-4 !py-2 text-xs"
            data-event="select_item"
            data-product-slug={product.slug}
          >
            ดูรายละเอียด
          </Link>
        </div>
      </div>
    </article>
  );
}
