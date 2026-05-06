"use client";

import { useMemo, useState } from "react";
import ProductCard from "./ProductCard";
import type { CatalogProduct } from "@/lib/catalog";
import { formatTHB } from "@/lib/money";

type SortKey = "featured" | "price-asc" | "price-desc";

export default function CatalogExplorer({ products }: { products: CatalogProduct[] }) {
  const [q, setQ] = useState("");
  const [cat, setCat] = useState<string>("ALL");
  const [tag, setTag] = useState<string>("ALL");
  const [sort, setSort] = useState<SortKey>("featured");

  // categories + tags ที่ใช้ได้จริง (มาจาก data)
  const categories = useMemo(() => {
    const map = new Map<string, { slug: string; name: string; count: number }>();
    for (const p of products) {
      const ex = map.get(p.categorySlug);
      if (ex) ex.count += 1;
      else map.set(p.categorySlug, { slug: p.categorySlug, name: p.categoryName, count: 1 });
    }
    return [...map.values()].sort((a, b) => b.count - a.count);
  }, [products]);

  const tags = useMemo(() => {
    const set = new Set<string>();
    products.forEach((p) => p.tags.forEach((t) => set.add(t)));
    return [...set].sort();
  }, [products]);

  const filtered = useMemo(() => {
    const needle = q.trim().toLowerCase();

    const out = products.filter((p) => {
      if (cat !== "ALL" && p.categorySlug !== cat) return false;
      if (tag !== "ALL" && !p.tags.includes(tag)) return false;
      if (!needle) return true;
      const hay = [
        p.name,
        p.shortDescription,
        p.categoryName,
        ...p.features,
        ...p.tags,
      ]
        .join(" ")
        .toLowerCase();
      return hay.includes(needle);
    });

    switch (sort) {
      case "price-asc":
        return out.sort((a, b) => a.basePrice - b.basePrice);
      case "price-desc":
        return out.sort((a, b) => b.basePrice - a.basePrice);
      default:
        return out;
    }
  }, [products, q, cat, tag, sort]);

  const minPrice = products.length ? Math.min(...products.map((p) => p.basePrice)) : 0;
  const maxPrice = products.length ? Math.max(...products.map((p) => p.basePrice)) : 0;

  const reset = () => {
    setQ("");
    setCat("ALL");
    setTag("ALL");
    setSort("featured");
  };

  return (
    <section id="catalog" className="py-20">
      <div className="container-page">
        <div className="mx-auto max-w-2xl text-center">
          <h2 className="section-title">แคตตาล็อกเว็บไซต์ตัวอย่าง</h2>
          <p className="section-subtitle">
            กรองตามประเภทธุรกิจ หรือค้นหาฟีเจอร์ที่คุณต้องการ
            {products.length > 0 && (
              <>
                {" "}· ราคาเริ่มต้น{" "}
                <span className="font-semibold text-brand-700">{formatTHB(minPrice)}</span>
              </>
            )}
          </p>
        </div>

        {/* Search + Sort */}
        <div className="mx-auto mt-10 flex max-w-3xl flex-col gap-3 sm:flex-row">
          <div className="relative flex-1">
            <input
              value={q}
              onChange={(e) => setQ(e.target.value)}
              placeholder="ค้นหา เช่น ระบบจอง, ร้านอาหาร, E-Commerce"
              className="w-full rounded-full border border-slate-200 px-5 py-3 pl-11 text-sm outline-none transition focus:border-brand-500 focus:ring-2 focus:ring-brand-100"
              aria-label="ค้นหาแพ็กเกจเว็บไซต์"
            />
            <span className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-slate-400">
              🔍
            </span>
          </div>
          <select
            value={sort}
            onChange={(e) => setSort(e.target.value as SortKey)}
            className="rounded-full border border-slate-200 px-4 py-3 text-sm outline-none focus:border-brand-500 focus:ring-2 focus:ring-brand-100"
            aria-label="เรียงลำดับ"
          >
            <option value="featured">แนะนำ</option>
            <option value="price-asc">ราคาต่ำ → สูง</option>
            <option value="price-desc">ราคาสูง → ต่ำ</option>
          </select>
        </div>

        {/* Category chips */}
        <div className="mt-6 flex flex-wrap justify-center gap-2">
          <Chip active={cat === "ALL"} onClick={() => setCat("ALL")}>
            ทั้งหมด ({products.length})
          </Chip>
          {categories.map((c) => (
            <Chip key={c.slug} active={cat === c.slug} onClick={() => setCat(c.slug)}>
              {c.name} ({c.count})
            </Chip>
          ))}
        </div>

        {/* Tag chips */}
        {tags.length > 0 && (
          <div className="mt-3 flex flex-wrap justify-center gap-2 text-xs">
            <MiniChip active={tag === "ALL"} onClick={() => setTag("ALL")}>
              # ทุกฟีเจอร์
            </MiniChip>
            {tags.map((t) => (
              <MiniChip key={t} active={tag === t} onClick={() => setTag(t)}>
                # {t}
              </MiniChip>
            ))}
          </div>
        )}

        {/* Results */}
        <div className="mt-10">
          {filtered.length === 0 ? (
            <div className="rounded-2xl border border-dashed border-slate-300 bg-white p-10 text-center text-slate-500">
              ไม่พบแพ็กเกจที่ตรงกับเงื่อนไข
              <button onClick={reset} className="ml-2 text-brand-700 hover:underline">
                ล้างตัวกรอง
              </button>
            </div>
          ) : (
            <>
              <div className="mb-4 flex items-center justify-between text-sm text-slate-500">
                <span>พบ {filtered.length} แพ็กเกจ</span>
                {(q || cat !== "ALL" || tag !== "ALL" || sort !== "featured") && (
                  <button onClick={reset} className="text-brand-700 hover:underline">
                    ล้างตัวกรอง
                  </button>
                )}
              </div>
              <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
                {filtered.map((p) => (
                  <ProductCard key={p.id} product={p} />
                ))}
              </div>
            </>
          )}
        </div>
      </div>
    </section>
  );
}

function Chip({
  children,
  active,
  onClick,
}: {
  children: React.ReactNode;
  active?: boolean;
  onClick?: () => void;
}) {
  return (
    <button
      onClick={onClick}
      className={`rounded-full px-4 py-1.5 text-sm font-medium transition ${
        active
          ? "bg-brand-600 text-white shadow-card"
          : "border border-slate-200 bg-white text-slate-700 hover:border-brand-400 hover:text-brand-700"
      }`}
    >
      {children}
    </button>
  );
}

function MiniChip({
  children,
  active,
  onClick,
}: {
  children: React.ReactNode;
  active?: boolean;
  onClick?: () => void;
}) {
  return (
    <button
      onClick={onClick}
      className={`rounded-full px-3 py-1 transition ${
        active
          ? "bg-slate-900 text-white"
          : "bg-slate-100 text-slate-600 hover:bg-slate-200"
      }`}
    >
      {children}
    </button>
  );
}
