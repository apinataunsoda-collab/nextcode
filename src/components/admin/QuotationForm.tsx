"use client";

import { useState, useMemo } from "react";
import { useRouter } from "next/navigation";
import { formatTHB } from "@/lib/money";

type Item = { description: string; quantity: number; unitPrice: number };

type LeadData = {
  leadId: string;
  customerName: string;
  customerPhone: string;
  customerEmail: string;
  productName: string;
  basePrice: number;
  addOns: { label: string; price: number }[];
  totalPrice: number;
} | null;

const DEFAULT_TERMS = `1. ใบเสนอราคานี้มีอายุ 30 วัน นับจากวันที่ออก
2. ชำระเงิน 50% ก่อนเริ่มงาน ส่วนที่เหลือชำระเมื่อส่งมอบงาน
3. ระยะเวลาดำเนินการ 7-14 วันทำการ (ขึ้นอยู่กับแพ็กเกจ)
4. รวมแก้ไข 2 ครั้ง หลังจากนั้นคิดค่าแก้ไขเพิ่มเติม`;

export default function QuotationForm({ leadData }: { leadData: LeadData }) {
  const router = useRouter();

  // Pre-fill items จาก lead
  const initialItems: Item[] = leadData
    ? [
        ...(leadData.productName
          ? [{ description: leadData.productName, quantity: 1, unitPrice: leadData.basePrice }]
          : []),
        ...leadData.addOns.map((a) => ({
          description: a.label,
          quantity: 1,
          unitPrice: a.price,
        })),
      ]
    : [{ description: "", quantity: 1, unitPrice: 0 }];

  const [customerName, setCustomerName] = useState(leadData?.customerName ?? "");
  const [customerPhone, setCustomerPhone] = useState(leadData?.customerPhone ?? "");
  const [customerEmail, setCustomerEmail] = useState(leadData?.customerEmail ?? "");
  const [companyName, setCompanyName] = useState("");
  const [items, setItems] = useState<Item[]>(initialItems);
  const [discount, setDiscount] = useState(0);
  const [includeVat, setIncludeVat] = useState(false);
  const [validDays, setValidDays] = useState(30);
  const [notes, setNotes] = useState("");
  const [terms, setTerms] = useState(DEFAULT_TERMS);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const updateItem = (i: number, patch: Partial<Item>) =>
    setItems((s) => s.map((item, idx) => (idx === i ? { ...item, ...patch } : item)));
  const removeItem = (i: number) => setItems((s) => s.filter((_, idx) => idx !== i));
  const addItem = () => setItems((s) => [...s, { description: "", quantity: 1, unitPrice: 0 }]);

  const { subtotal, vat, total } = useMemo(() => {
    const sub = items.reduce((s, i) => s + i.quantity * i.unitPrice, 0);
    const afterDiscount = sub - discount;
    const v = includeVat ? Math.round(afterDiscount * 0.07) : 0;
    return { subtotal: sub, vat: v, total: afterDiscount + v };
  }, [items, discount, includeVat]);

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    if (!customerName || !customerPhone) {
      setError("กรุณากรอกชื่อและเบอร์โทรลูกค้า");
      return;
    }
    if (!items.some((i) => i.description && i.unitPrice > 0)) {
      setError("กรุณาเพิ่มรายการอย่างน้อย 1 รายการ");
      return;
    }

    setSaving(true);
    try {
      const res = await fetch("/api/quotations", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({
          leadId: leadData?.leadId,
          customerName,
          customerPhone,
          customerEmail,
          companyName,
          notes,
          terms,
          discount,
          includeVat,
          validDays,
          items: items.filter((i) => i.description),
        }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "สร้างไม่สำเร็จ");
      router.push("/admin/quotations");
      router.refresh();
    } catch (e: any) {
      setError(e.message);
    } finally {
      setSaving(false);
    }
  };

  return (
    <form onSubmit={onSubmit} className="grid gap-6 lg:grid-cols-3">
      {/* ข้อมูลลูกค้า */}
      <div className="space-y-4 lg:col-span-2">
        <Card title="ข้อมูลลูกค้า">
          <div className="grid gap-4 sm:grid-cols-2">
            <Input label="ชื่อลูกค้า *" value={customerName} onChange={setCustomerName} />
            <Input label="เบอร์โทร *" value={customerPhone} onChange={setCustomerPhone} />
            <Input label="อีเมล" value={customerEmail} onChange={setCustomerEmail} />
            <Input label="ชื่อบริษัท (ถ้ามี)" value={companyName} onChange={setCompanyName} />
          </div>
        </Card>

        {/* รายการ */}
        <Card title="รายการ">
          <div className="overflow-x-auto">
            <table className="min-w-full text-sm">
              <thead className="text-left text-xs text-slate-500">
                <tr>
                  <th className="pb-2 pr-2">รายละเอียด</th>
                  <th className="pb-2 pr-2 w-20">จำนวน</th>
                  <th className="pb-2 pr-2 w-28">ราคา/หน่วย</th>
                  <th className="pb-2 w-28 text-right">รวม</th>
                  <th className="pb-2 w-10" />
                </tr>
              </thead>
              <tbody>
                {items.map((item, i) => (
                  <tr key={i} className="border-t border-slate-100">
                    <td className="py-2 pr-2">
                      <input
                        value={item.description}
                        onChange={(e) => updateItem(i, { description: e.target.value })}
                        placeholder="เช่น เว็บไซต์ร้านอาหาร"
                        className="w-full rounded-lg border border-slate-200 px-3 py-2 text-sm outline-none focus:border-brand-500"
                      />
                    </td>
                    <td className="py-2 pr-2">
                      <input
                        type="number"
                        min={1}
                        value={item.quantity}
                        onChange={(e) => updateItem(i, { quantity: Number(e.target.value) || 1 })}
                        className="w-full rounded-lg border border-slate-200 px-3 py-2 text-sm outline-none focus:border-brand-500"
                      />
                    </td>
                    <td className="py-2 pr-2">
                      <input
                        type="number"
                        min={0}
                        value={item.unitPrice}
                        onChange={(e) => updateItem(i, { unitPrice: Number(e.target.value) || 0 })}
                        className="w-full rounded-lg border border-slate-200 px-3 py-2 text-sm text-right outline-none focus:border-brand-500"
                      />
                    </td>
                    <td className="py-2 text-right font-medium">
                      {formatTHB(item.quantity * item.unitPrice)}
                    </td>
                    <td className="py-2 text-right">
                      {items.length > 1 && (
                        <button
                          type="button"
                          onClick={() => removeItem(i)}
                          className="text-xs text-red-600 hover:underline"
                        >
                          ลบ
                        </button>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <button type="button" onClick={addItem} className="btn-ghost mt-3 text-xs">
            + เพิ่มรายการ
          </button>
        </Card>

        {/* หมายเหตุ + เงื่อนไข */}
        <Card title="หมายเหตุ & เงื่อนไข">
          <label className="block text-sm">
            <span className="mb-1 block font-medium text-slate-700">หมายเหตุ</span>
            <textarea
              rows={3}
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="หมายเหตุเพิ่มเติม (ลูกค้าจะเห็น)"
              className="w-full rounded-xl border border-slate-200 px-3 py-2 text-sm outline-none focus:border-brand-500"
            />
          </label>
          <label className="block text-sm">
            <span className="mb-1 block font-medium text-slate-700">เงื่อนไข</span>
            <textarea
              rows={5}
              value={terms}
              onChange={(e) => setTerms(e.target.value)}
              className="w-full rounded-xl border border-slate-200 px-3 py-2 text-sm outline-none focus:border-brand-500"
            />
          </label>
        </Card>
      </div>

      {/* Sidebar: สรุปยอด */}
      <div className="space-y-4">
        <Card title="สรุปยอด">
          <div className="space-y-3 text-sm">
            <div className="flex justify-between">
              <span className="text-slate-500">รวมรายการ</span>
              <span>{formatTHB(subtotal)}</span>
            </div>
            <label className="flex items-center justify-between">
              <span className="text-slate-500">ส่วนลด</span>
              <input
                type="number"
                min={0}
                value={discount}
                onChange={(e) => setDiscount(Number(e.target.value) || 0)}
                className="w-28 rounded-lg border border-slate-200 px-3 py-1.5 text-right text-sm outline-none focus:border-brand-500"
              />
            </label>
            <label className="flex items-center gap-2">
              <input
                type="checkbox"
                checked={includeVat}
                onChange={(e) => setIncludeVat(e.target.checked)}
              />
              <span className="text-slate-600">รวม VAT 7%</span>
            </label>
            {includeVat && (
              <div className="flex justify-between">
                <span className="text-slate-500">VAT 7%</span>
                <span>{formatTHB(vat)}</span>
              </div>
            )}
            <div className="flex justify-between border-t border-slate-200 pt-3 text-lg font-bold">
              <span>ยอดรวม</span>
              <span className="text-brand-700">{formatTHB(total)}</span>
            </div>
          </div>
        </Card>

        <Card title="ตั้งค่า">
          <label className="block text-sm">
            <span className="mb-1 block font-medium text-slate-700">อายุใบเสนอราคา (วัน)</span>
            <input
              type="number"
              min={1}
              value={validDays}
              onChange={(e) => setValidDays(Number(e.target.value) || 30)}
              className="w-full rounded-xl border border-slate-200 px-3 py-2 text-sm outline-none focus:border-brand-500"
            />
          </label>
        </Card>

        {error && (
          <p className="rounded-xl bg-red-50 px-4 py-3 text-sm text-red-700">{error}</p>
        )}

        <button type="submit" disabled={saving} className="btn-primary w-full disabled:opacity-60">
          {saving ? "กำลังสร้าง..." : "สร้างใบเสนอราคา"}
        </button>
      </div>
    </form>
  );
}

function Card({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <section className="rounded-2xl border border-slate-200 bg-white p-5">
      <h3 className="mb-4 text-sm font-semibold text-slate-900">{title}</h3>
      <div className="space-y-4">{children}</div>
    </section>
  );
}

function Input({
  label,
  value,
  onChange,
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
}) {
  return (
    <label className="block text-sm">
      <span className="mb-1 block font-medium text-slate-700">{label}</span>
      <input
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="w-full rounded-xl border border-slate-200 px-3 py-2 outline-none focus:border-brand-500"
      />
    </label>
  );
}
