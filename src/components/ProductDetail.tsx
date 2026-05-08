"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import { formatTHB } from "@/lib/money";
import type { CatalogProduct } from "@/lib/catalog";
import ContactForm from "./ContactForm";
import { trackAddOnToggle, trackViewItem } from "@/lib/analytics";

export default function ProductDetail({ product }: { product: CatalogProduct }) {
  const [selected, setSelected] = useState<Set<string>>(new Set());

  // ยิง view_item ครั้งเดียวเมื่อเปิดหน้า
  useEffect(() => {
    trackViewItem({
      slug: product.slug,
      name: product.name,
      category: product.categoryName,
      price: product.basePrice,
    });
  }, [product.slug, product.name, product.categoryName, product.basePrice]);

  const toggle = (code: string) => {
    setSelected((prev) => {
      const next = new Set(prev);
      const willSelect = !next.has(code);
      if (willSelect) next.add(code);
      else next.delete(code);

      const addOn = product.addOns.find((a) => a.code === code);
      if (addOn) {
        trackAddOnToggle({
          productSlug: product.slug,
          addOnCode: addOn.code,
          addOnLabel: addOn.label,
          price: addOn.price,
          selected: willSelect,
        });
      }
      return next;
    });
  };

  const { addOnsTotal, total, chosen } = useMemo(() => {
    const chosen = product.addOns.filter((a) => selected.has(a.code));
    const sum = chosen.reduce((acc, a) => acc + a.price, 0);
    return { chosen, addOnsTotal: sum, total: product.basePrice + sum };
  }, [product, selected]);

  const defaultMessage = useMemo(() => {
    const lines = [
      `สนใจแพ็กเกจ: ${product.name}`,
      `ราคาเริ่มต้น: ${formatTHB(product.basePrice)}`,
    ];
    if (chosen.length) {
      lines.push("บริการเสริมที่เลือก:");
      chosen.forEach((a) => lines.push(`- ${a.label} (${formatTHB(a.price)})`));
    }
    lines.push(`รวมทั้งสิ้น: ${formatTHB(total)}`);
    return lines.join("\n");
  }, [product, chosen, total]);

  return (
    <>
      <section className="bg-gradient-to-b from-brand-50 to-white py-12">
        <div className="container-page">
          <nav className="mb-6 text-sm text-slate-500">
            <Link href="/" className="hover:text-brand-700">
              หน้าแรก
            </Link>
            <span className="mx-2">/</span>
            <Link href="/#catalog" className="hover:text-brand-700">
              แคตตาล็อก
            </Link>
            <span className="mx-2">/</span>
            <span className="text-slate-700">{product.name}</span>
          </nav>

          <div className="grid gap-10 lg:grid-cols-2">
            <div className="relative aspect-[4/3] overflow-hidden rounded-3xl border border-slate-200 bg-white">
              {product.image && (
                <Image
                  src={product.image}
                  alt={product.name}
                  fill
                  sizes="(min-width: 1024px) 50vw, 100vw"
                  className="object-cover"
                  priority
                />
              )}
            </div>

            <div>
              <span className="inline-flex rounded-full bg-brand-100 px-3 py-1 text-xs font-semibold text-brand-700">
                {product.categoryName}
              </span>
              <h1 className="mt-3 text-3xl font-bold text-slate-900 sm:text-4xl">
                {product.name}
              </h1>
              <p className="mt-3 text-slate-600">{product.shortDescription}</p>

              {product.tags.length > 0 && (
                <div className="mt-3 flex flex-wrap gap-2">
                  {product.tags.map((t) => (
                    <span
                      key={t}
                      className="rounded-full bg-slate-100 px-3 py-1 text-xs text-slate-600"
                    >
                      #{t}
                    </span>
                  ))}
                </div>
              )}

              <ul className="mt-5 grid gap-2 text-sm text-slate-700 sm:grid-cols-2">
                {product.features.map((f) => (
                  <li key={f} className="flex items-start gap-2">
                    <span className="mt-1 grid h-4 w-4 place-items-center rounded-full bg-brand-600 text-[10px] text-white">
                      ✓
                    </span>
                    {f}
                  </li>
                ))}
              </ul>

              <div className="mt-6 rounded-2xl border border-slate-200 bg-white p-5">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-slate-500">ราคาเริ่มต้น</span>
                  <span className="text-2xl font-bold text-slate-900">
                    {formatTHB(product.basePrice)}
                  </span>
                </div>
                <Link
                  href={`/demo/${product.slug}`}
                  target="_blank"
                  className="mt-4 flex items-center justify-center gap-2 rounded-xl border border-brand-200 bg-brand-50 py-2.5 text-sm font-medium text-brand-700 transition hover:bg-brand-100"
                >
                  🎨 ดูตัวอย่างเว็บจริง (Prototype)
                </Link>
              </div>

              <h3 className="mt-8 text-lg font-semibold text-slate-900">
                บริการเสริม (Add-ons)
              </h3>
              <p className="mt-1 text-sm text-slate-500">
                เลือกเฉพาะที่คุณต้องการ ยอดรวมจะอัปเดตให้อัตโนมัติ
              </p>

              <div className="mt-4 space-y-3">
                {product.addOns.map((addOn) => {
                  const checked = selected.has(addOn.code);
                  return (
                    <label
                      key={addOn.id}
                      className={`flex cursor-pointer items-start gap-3 rounded-2xl border p-4 transition ${
                        checked
                          ? "border-brand-500 bg-brand-50/60"
                          : "border-slate-200 hover:border-brand-300"
                      }`}
                    >
                      <input
                        type="checkbox"
                        checked={checked}
                        onChange={() => toggle(addOn.code)}
                        className="mt-1 h-4 w-4 rounded border-slate-300 text-brand-600 focus:ring-brand-400"
                      />
                      <div className="flex-1">
                        <div className="flex items-center justify-between gap-3">
                          <span className="font-medium text-slate-900">
                            {addOn.label}
                          </span>
                          <span className="whitespace-nowrap text-sm font-semibold text-brand-700">
                            + {formatTHB(addOn.price)}
                          </span>
                        </div>
                        {addOn.description && (
                          <p className="mt-1 text-xs text-slate-500">
                            {addOn.description}
                          </p>
                        )}
                      </div>
                    </label>
                  );
                })}
                {product.addOns.length === 0 && (
                  <p className="text-sm text-slate-500">— ไม่มีบริการเสริม —</p>
                )}
              </div>

              <div className="mt-8 rounded-2xl bg-slate-900 p-5 text-white">
                <div className="flex items-center justify-between text-sm text-white/70">
                  <span>ราคาแพ็กเกจ</span>
                  <span>{formatTHB(product.basePrice)}</span>
                </div>
                <div className="mt-1 flex items-center justify-between text-sm text-white/70">
                  <span>บริการเสริม ({chosen.length} รายการ)</span>
                  <span>{formatTHB(addOnsTotal)}</span>
                </div>
                <div className="mt-4 flex items-end justify-between border-t border-white/10 pt-4">
                  <span className="text-sm text-white/70">ยอดรวม</span>
                  <span className="text-3xl font-extrabold">
                    {formatTHB(total)}
                  </span>
                </div>
                <Link
                  href="#contact"
                  className="mt-5 block rounded-full bg-white py-3 text-center text-sm font-semibold text-slate-900 transition hover:bg-brand-100"
                >
                  สั่งซื้อ / ขอใบเสนอราคา
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      <ContactForm
        title={`สนใจแพ็กเกจ ${product.name}`}
        subtitle="กรอกข้อมูลแล้วทีมงานจะติดต่อกลับพร้อมใบเสนอราคา"
        defaultMessage={defaultMessage}
        totalPreview={total}
        productSlug={product.slug}
        productName={product.name}
        addOnCodes={chosen.map((a) => a.code)}
      />
    </>
  );
}
