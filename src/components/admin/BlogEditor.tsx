"use client";

import { useState, useMemo } from "react";
import { useRouter } from "next/navigation";

type Post = {
  id?: string;
  slug: string;
  title: string;
  excerpt: string;
  content: string;
  coverImage: string;
  metaTitle: string;
  metaDesc: string;
  keywords: string;
  author: string;
  status: string;
};

const empty: Post = {
  slug: "",
  title: "",
  excerpt: "",
  content: "",
  coverImage: "",
  metaTitle: "",
  metaDesc: "",
  keywords: "",
  author: "",
  status: "DRAFT",
};

export default function BlogEditor({ post }: { post?: any }) {
  const router = useRouter();
  const [form, setForm] = useState<Post>(post ? { ...post } : empty);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const set = (k: keyof Post, v: string) => setForm((s) => ({ ...s, [k]: v }));

  // SEO Score
  const seoScore = useMemo(() => {
    let score = 0;
    const checks: { label: string; pass: boolean }[] = [];

    const title = form.metaTitle || form.title;
    const desc = form.metaDesc || form.excerpt;
    const kw = form.keywords.split(",").map((s) => s.trim()).filter(Boolean);

    checks.push({ label: "มี Title", pass: title.length > 0 });
    checks.push({ label: "Title 30-60 ตัวอักษร", pass: title.length >= 30 && title.length <= 60 });
    checks.push({ label: "มี Description", pass: desc.length > 0 });
    checks.push({ label: "Description 80-160 ตัวอักษร", pass: desc.length >= 80 && desc.length <= 160 });
    checks.push({ label: "มี Keywords", pass: kw.length > 0 });
    checks.push({ label: "มี Slug", pass: form.slug.length > 0 });
    checks.push({ label: "เนื้อหา > 300 ตัวอักษร", pass: form.content.length > 300 });
    checks.push({ label: "มีรูปปก", pass: form.coverImage.length > 0 });
    checks.push({ label: "Keyword อยู่ใน Title", pass: kw.some((k) => title.toLowerCase().includes(k.toLowerCase())) });
    checks.push({ label: "Keyword อยู่ใน Description", pass: kw.some((k) => desc.toLowerCase().includes(k.toLowerCase())) });

    score = checks.filter((c) => c.pass).length * 10;
    return { score, checks };
  }, [form]);

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setSaving(true);
    try {
      const url = post?.id ? `/api/blog/${post.id}` : "/api/blog";
      const method = post?.id ? "PUT" : "POST";
      const res = await fetch(url, {
        method,
        headers: { "content-type": "application/json" },
        body: JSON.stringify(form),
      });
      if (!res.ok) {
        const d = await res.json().catch(() => ({}));
        throw new Error(d.error || "บันทึกไม่สำเร็จ");
      }
      router.push("/admin/blog");
      router.refresh();
    } catch (e: any) {
      setError(e.message);
    } finally {
      setSaving(false);
    }
  };

  const remove = async () => {
    if (!post?.id || !confirm("ลบบทความนี้?")) return;
    await fetch(`/api/blog/${post.id}`, { method: "DELETE" });
    router.push("/admin/blog");
    router.refresh();
  };

  return (
    <form onSubmit={onSubmit} className="grid gap-6 lg:grid-cols-3">
      <div className="space-y-4 lg:col-span-2">
        <Card title="เนื้อหา">
          <Field label="หัวข้อบทความ *">
            <input required value={form.title} onChange={(e) => set("title", e.target.value)} className="input" placeholder="เช่น ทำเว็บร้านอาหารต้องมีอะไรบ้าง" />
          </Field>
          <Field label="Slug (URL) *" hint="เช่น web-restaurant-guide">
            <input required value={form.slug} onChange={(e) => set("slug", e.target.value)} className="input" />
          </Field>
          <Field label="คำอธิบายสั้น (Excerpt)">
            <textarea rows={2} value={form.excerpt} onChange={(e) => set("excerpt", e.target.value)} className="input" placeholder="สรุปสั้นๆ 1-2 ประโยค" />
          </Field>
          <Field label="เนื้อหา (รองรับ Markdown)">
            <textarea rows={16} value={form.content} onChange={(e) => set("content", e.target.value)} className="input font-mono text-xs" placeholder="เขียนเนื้อหาบทความที่นี่..." />
          </Field>
        </Card>

        <Card title="SEO Settings">
          <Field label="Meta Title" hint={`${(form.metaTitle || form.title).length}/60 ตัวอักษร`}>
            <input value={form.metaTitle} onChange={(e) => set("metaTitle", e.target.value)} className="input" placeholder="ถ้าว่าง จะใช้หัวข้อบทความแทน" />
          </Field>
          <Field label="Meta Description" hint={`${(form.metaDesc || form.excerpt).length}/160 ตัวอักษร`}>
            <textarea rows={2} value={form.metaDesc} onChange={(e) => set("metaDesc", e.target.value)} className="input" placeholder="ถ้าว่าง จะใช้ Excerpt แทน" />
          </Field>
          <Field label="Keywords" hint="คั่นด้วย comma เช่น ทำเว็บ,ร้านอาหาร,SEO">
            <input value={form.keywords} onChange={(e) => set("keywords", e.target.value)} className="input" />
          </Field>
        </Card>
      </div>

      <div className="space-y-4">
        {/* SEO Score */}
        <Card title="SEO Score">
          <div className="text-center">
            <div className={`mx-auto grid h-20 w-20 place-items-center rounded-full text-2xl font-bold ${seoScore.score >= 80 ? "bg-green-100 text-green-700" : seoScore.score >= 50 ? "bg-amber-100 text-amber-700" : "bg-red-100 text-red-700"}`}>
              {seoScore.score}
            </div>
            <p className="mt-2 text-xs text-slate-500">
              {seoScore.score >= 80 ? "ดีมาก!" : seoScore.score >= 50 ? "พอใช้ ปรับเพิ่มได้" : "ต้องปรับปรุง"}
            </p>
          </div>
          <ul className="mt-4 space-y-1.5 text-xs">
            {seoScore.checks.map((c) => (
              <li key={c.label} className="flex items-center gap-2">
                <span className={c.pass ? "text-green-600" : "text-red-500"}>
                  {c.pass ? "✅" : "❌"}
                </span>
                <span className={c.pass ? "text-slate-600" : "text-slate-900 font-medium"}>
                  {c.label}
                </span>
              </li>
            ))}
          </ul>
        </Card>

        <Card title="ตั้งค่า">
          <Field label="สถานะ">
            <select value={form.status} onChange={(e) => set("status", e.target.value)} className="input">
              <option value="DRAFT">ร่าง</option>
              <option value="PUBLISHED">เผยแพร่</option>
            </select>
          </Field>
          <Field label="ผู้เขียน">
            <input value={form.author} onChange={(e) => set("author", e.target.value)} className="input" />
          </Field>
          <Field label="รูปปก (URL)">
            <input value={form.coverImage} onChange={(e) => set("coverImage", e.target.value)} className="input" placeholder="วาง URL รูปภาพ" />
          </Field>
        </Card>

        {error && <p className="rounded-xl bg-red-50 px-4 py-3 text-sm text-red-700">{error}</p>}

        <button type="submit" disabled={saving} className="btn-primary w-full disabled:opacity-60">
          {saving ? "กำลังบันทึก..." : post?.id ? "บันทึก" : "สร้างบทความ"}
        </button>
        {post?.id && (
          <button type="button" onClick={remove} className="w-full text-center text-sm text-red-600 hover:underline">
            ลบบทความ
          </button>
        )}
      </div>

      <style jsx>{`
        .input { width:100%; border-radius:0.75rem; border:1px solid rgb(226 232 240); padding:0.625rem 0.875rem; font-size:0.875rem; outline:none; }
        .input:focus { border-color:rgb(47 137 255); box-shadow:0 0 0 3px rgb(217 236 255); }
      `}</style>
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

function Field({ label, hint, children }: { label: string; hint?: string; children: React.ReactNode }) {
  return (
    <label className="block">
      <span className="mb-1 block text-sm font-medium text-slate-700">{label}</span>
      {children}
      {hint && <span className="mt-1 block text-xs text-slate-500">{hint}</span>}
    </label>
  );
}
