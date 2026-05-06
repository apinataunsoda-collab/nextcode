"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

type AddOn = {
  id: string;
  code: string;
  label: string;
  description: string | null;
  price: number;
  isActive: boolean;
};

export default function AddOnsManager({ initial }: { initial: AddOn[] }) {
  const router = useRouter();
  const [addOns, setAddOns] = useState(initial);
  const [form, setForm] = useState({ code: "", label: "", description: "", price: 0 });
  const [error, setError] = useState<string | null>(null);

  const create = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    const res = await fetch("/api/addons", {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify(form),
    });
    if (!res.ok) {
      const d = await res.json().catch(() => ({}));
      setError(d.error || "บันทึกไม่สำเร็จ");
      return;
    }
    const created = await res.json();
    setAddOns((s) => [...s, created]);
    setForm({ code: "", label: "", description: "", price: 0 });
    router.refresh();
  };

  const save = async (id: string, patch: Partial<AddOn>) => {
    setAddOns((s) => s.map((a) => (a.id === id ? { ...a, ...patch } : a)));
    await fetch(`/api/addons/${id}`, {
      method: "PUT",
      headers: { "content-type": "application/json" },
      body: JSON.stringify(patch),
    });
  };

  const remove = async (id: string) => {
    if (!confirm("ลบบริการเสริมนี้?")) return;
    setAddOns((s) => s.filter((a) => a.id !== id));
    await fetch(`/api/addons/${id}`, { method: "DELETE" });
    router.refresh();
  };

  return (
    <div className="grid gap-6 lg:grid-cols-3">
      <section className="rounded-2xl border border-slate-200 bg-white p-5 lg:col-span-2">
        <h3 className="mb-4 text-sm font-semibold">รายการ Add-ons</h3>
        <div className="overflow-x-auto">
          <table className="min-w-full text-sm">
            <thead className="text-left text-xs uppercase text-slate-500">
              <tr>
                <th className="px-3 py-2">Code</th>
                <th className="px-3 py-2">ชื่อ</th>
                <th className="px-3 py-2">คำอธิบาย</th>
                <th className="px-3 py-2 text-right">ราคา</th>
                <th className="px-3 py-2">เปิด</th>
                <th className="px-3 py-2" />
              </tr>
            </thead>
            <tbody>
              {addOns.map((a) => (
                <tr key={a.id} className="border-t border-slate-100">
                  <td className="px-3 py-2 font-mono text-xs text-slate-500">{a.code}</td>
                  <td className="px-3 py-2">
                    <input
                      defaultValue={a.label}
                      onBlur={(e) =>
                        e.target.value !== a.label && save(a.id, { label: e.target.value })
                      }
                      className="w-full rounded-md border border-transparent px-2 py-1 hover:border-slate-200 focus:border-brand-500 focus:outline-none"
                    />
                  </td>
                  <td className="px-3 py-2">
                    <input
                      defaultValue={a.description ?? ""}
                      onBlur={(e) =>
                        e.target.value !== (a.description ?? "") &&
                        save(a.id, { description: e.target.value })
                      }
                      className="w-full rounded-md border border-transparent px-2 py-1 hover:border-slate-200 focus:border-brand-500 focus:outline-none"
                    />
                  </td>
                  <td className="px-3 py-2 text-right">
                    <input
                      type="number"
                      defaultValue={a.price}
                      onBlur={(e) => {
                        const v = Number(e.target.value);
                        if (v !== a.price) save(a.id, { price: v });
                      }}
                      className="w-24 rounded-md border border-slate-200 px-2 py-1 text-right focus:border-brand-500 focus:outline-none"
                    />
                  </td>
                  <td className="px-3 py-2">
                    <input
                      type="checkbox"
                      checked={a.isActive}
                      onChange={(e) => save(a.id, { isActive: e.target.checked })}
                    />
                  </td>
                  <td className="px-3 py-2 text-right">
                    <button
                      onClick={() => remove(a.id)}
                      className="text-xs text-red-600 hover:underline"
                    >
                      ลบ
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      <section className="rounded-2xl border border-slate-200 bg-white p-5">
        <h3 className="mb-4 text-sm font-semibold">เพิ่ม Add-on ใหม่</h3>
        <form onSubmit={create} className="space-y-3 text-sm">
          <input
            required
            placeholder="Code (เช่น backup)"
            value={form.code}
            onChange={(e) => setForm((s) => ({ ...s, code: e.target.value }))}
            className="w-full rounded-xl border border-slate-200 px-3 py-2 outline-none focus:border-brand-500"
          />
          <input
            required
            placeholder="ชื่อที่แสดงให้ลูกค้า"
            value={form.label}
            onChange={(e) => setForm((s) => ({ ...s, label: e.target.value }))}
            className="w-full rounded-xl border border-slate-200 px-3 py-2 outline-none focus:border-brand-500"
          />
          <textarea
            rows={2}
            placeholder="คำอธิบาย"
            value={form.description}
            onChange={(e) => setForm((s) => ({ ...s, description: e.target.value }))}
            className="w-full rounded-xl border border-slate-200 px-3 py-2 outline-none focus:border-brand-500"
          />
          <input
            type="number"
            required
            min={0}
            placeholder="ราคา (บาท)"
            value={form.price}
            onChange={(e) => setForm((s) => ({ ...s, price: Number(e.target.value) }))}
            className="w-full rounded-xl border border-slate-200 px-3 py-2 outline-none focus:border-brand-500"
          />
          {error && <p className="text-xs text-red-600">{error}</p>}
          <button type="submit" className="btn-primary w-full">
            เพิ่ม
          </button>
        </form>
      </section>
    </div>
  );
}
