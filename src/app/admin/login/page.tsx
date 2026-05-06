"use client";

import { useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";

export default function AdminLoginPage() {
  const router = useRouter();
  const params = useSearchParams();
  const next = params.get("next") || "/admin";

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);
    try {
      const res = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ email, password }),
      });
      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error || "เข้าสู่ระบบไม่สำเร็จ");
      }
      router.push(next);
      router.refresh();
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="grid min-h-screen place-items-center bg-slate-50 p-6">
      <form
        onSubmit={onSubmit}
        className="w-full max-w-sm rounded-2xl border border-slate-200 bg-white p-6 shadow-card"
      >
        <div className="mb-6 flex items-center gap-2">
          <span className="grid h-9 w-9 place-items-center rounded-lg bg-brand-600 text-white">
            <span className="font-bold">N</span>
          </span>
          <span className="text-lg font-bold">NextCode Admin</span>
        </div>

        <label className="mb-1 block text-sm font-medium text-slate-700">อีเมล</label>
        <input
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
          className="mb-4 w-full rounded-xl border border-slate-200 px-4 py-2.5 text-sm outline-none focus:border-brand-500 focus:ring-2 focus:ring-brand-100"
          placeholder="admin@nextcode.co.th"
        />

        <label className="mb-1 block text-sm font-medium text-slate-700">รหัสผ่าน</label>
        <input
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
          className="mb-4 w-full rounded-xl border border-slate-200 px-4 py-2.5 text-sm outline-none focus:border-brand-500 focus:ring-2 focus:ring-brand-100"
        />

        {error && <p className="mb-3 text-sm text-red-600">{error}</p>}

        <button type="submit" disabled={loading} className="btn-primary w-full disabled:opacity-60">
          {loading ? "กำลังเข้าสู่ระบบ..." : "เข้าสู่ระบบ"}
        </button>
      </form>
    </div>
  );
}
