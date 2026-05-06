"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { ROLES, ROLE_LABELS, MENU_KEYS, MENU_LABELS, getPermissionMatrix } from "@/lib/permissions";
import type { Role, MenuKey } from "@/lib/permissions";

type User = {
  id: string;
  email: string;
  name: string | null;
  role: string;
  permissions: string;
  isActive: boolean;
  createdAt: string;
};

export default function UsersManager({ initial }: { initial: User[] }) {
  const router = useRouter();
  const [users, setUsers] = useState(initial);
  const [editing, setEditing] = useState<User | null>(null);
  const [creating, setCreating] = useState(false);

  const refresh = () => router.refresh();

  return (
    <div className="space-y-6">
      {/* User list */}
      <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white">
        <div className="flex items-center justify-between border-b border-slate-200 px-4 py-3">
          <span className="text-sm font-semibold text-slate-700">
            ผู้ใช้ทั้งหมด ({users.length})
          </span>
          <button onClick={() => setCreating(true)} className="btn-primary text-xs">
            + เพิ่มผู้ใช้
          </button>
        </div>
        <table className="min-w-full text-sm">
          <thead className="bg-slate-50 text-left text-xs uppercase text-slate-500">
            <tr>
              <th className="px-4 py-3">ชื่อ / อีเมล</th>
              <th className="px-4 py-3">Role</th>
              <th className="px-4 py-3">สถานะ</th>
              <th className="px-4 py-3">สิทธิ์</th>
              <th className="px-4 py-3" />
            </tr>
          </thead>
          <tbody>
            {users.map((u) => {
              const matrix = getPermissionMatrix(u.role, u.permissions);
              const viewCount = matrix.filter((m) => m.view).length;
              const editCount = matrix.filter((m) => m.edit).length;
              return (
                <tr key={u.id} className="border-t border-slate-100">
                  <td className="px-4 py-3">
                    <div className="font-medium">{u.name || "—"}</div>
                    <div className="text-xs text-slate-500">{u.email}</div>
                  </td>
                  <td className="px-4 py-3">
                    <span className="rounded-full bg-brand-50 px-2.5 py-0.5 text-xs font-semibold text-brand-700">
                      {ROLE_LABELS[u.role as Role] ?? u.role}
                    </span>
                  </td>
                  <td className="px-4 py-3">
                    <span
                      className={`rounded-full px-2 py-0.5 text-xs ${
                        u.isActive
                          ? "bg-green-100 text-green-700"
                          : "bg-slate-200 text-slate-600"
                      }`}
                    >
                      {u.isActive ? "ใช้งาน" : "ปิดใช้งาน"}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-xs text-slate-500">
                    ดู {viewCount} · แก้ไข {editCount} เมนู
                  </td>
                  <td className="px-4 py-3 text-right">
                    <button
                      onClick={() => setEditing(u)}
                      className="text-xs text-brand-700 hover:underline"
                    >
                      แก้ไข
                    </button>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      {/* Create modal */}
      {creating && (
        <CreateUserModal
          onClose={() => setCreating(false)}
          onCreated={(u) => {
            setUsers((s) => [...s, u]);
            setCreating(false);
            refresh();
          }}
        />
      )}

      {/* Edit modal */}
      {editing && (
        <EditUserModal
          user={editing}
          onClose={() => setEditing(null)}
          onUpdated={(u) => {
            setUsers((s) => s.map((x) => (x.id === u.id ? u : x)));
            setEditing(null);
            refresh();
          }}
          onDeleted={(id) => {
            setUsers((s) => s.filter((x) => x.id !== id));
            setEditing(null);
            refresh();
          }}
        />
      )}
    </div>
  );
}

// --- Create Modal ---
function CreateUserModal({
  onClose,
  onCreated,
}: {
  onClose: () => void;
  onCreated: (u: User) => void;
}) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");
  const [role, setRole] = useState<string>("viewer");
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setSaving(true);
    try {
      const res = await fetch("/api/admin/users", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ email, password, name, role }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "สร้างไม่สำเร็จ");
      onCreated({ ...data, permissions: "[]", createdAt: new Date().toISOString() });
    } catch (e: any) {
      setError(e.message);
    } finally {
      setSaving(false);
    }
  };

  return (
    <Modal title="เพิ่มผู้ใช้ใหม่" onClose={onClose}>
      <form onSubmit={submit} className="space-y-4">
        <Input label="อีเมล *" type="email" value={email} onChange={setEmail} />
        <Input label="รหัสผ่าน *" type="password" value={password} onChange={setPassword} />
        <Input label="ชื่อ" value={name} onChange={setName} />
        <RoleSelect value={role} onChange={setRole} />
        {error && <p className="text-sm text-red-600">{error}</p>}
        <button type="submit" disabled={saving} className="btn-primary w-full disabled:opacity-60">
          {saving ? "กำลังสร้าง..." : "สร้างผู้ใช้"}
        </button>
      </form>
    </Modal>
  );
}

// --- Edit Modal ---
function EditUserModal({
  user,
  onClose,
  onUpdated,
  onDeleted,
}: {
  user: User;
  onClose: () => void;
  onUpdated: (u: User) => void;
  onDeleted: (id: string) => void;
}) {
  const [name, setName] = useState(user.name || "");
  const [email, setEmail] = useState(user.email);
  const [role, setRole] = useState(user.role);
  const [isActive, setIsActive] = useState(user.isActive);
  const [password, setPassword] = useState("");
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const matrix = getPermissionMatrix(role, user.permissions);

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setSaving(true);
    try {
      const body: any = { name, email, role, isActive };
      if (password.length >= 6) body.password = password;
      const res = await fetch(`/api/admin/users/${user.id}`, {
        method: "PUT",
        headers: { "content-type": "application/json" },
        body: JSON.stringify(body),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "บันทึกไม่สำเร็จ");
      onUpdated({ ...user, ...data });
    } catch (e: any) {
      setError(e.message);
    } finally {
      setSaving(false);
    }
  };

  const remove = async () => {
    if (!confirm(`ลบผู้ใช้ ${user.email}?`)) return;
    const res = await fetch(`/api/admin/users/${user.id}`, { method: "DELETE" });
    if (res.ok) onDeleted(user.id);
    else {
      const d = await res.json().catch(() => ({}));
      alert(d.error || "ลบไม่สำเร็จ");
    }
  };

  return (
    <Modal title={`แก้ไขผู้ใช้: ${user.email}`} onClose={onClose}>
      <form onSubmit={submit} className="space-y-4">
        <Input label="ชื่อ" value={name} onChange={setName} />
        <Input label="อีเมล" type="email" value={email} onChange={setEmail} />
        <RoleSelect value={role} onChange={setRole} />
        <label className="flex items-center gap-2 text-sm">
          <input
            type="checkbox"
            checked={isActive}
            onChange={(e) => setIsActive(e.target.checked)}
          />
          เปิดใช้งาน
        </label>
        <Input
          label="เปลี่ยนรหัสผ่าน (เว้นว่างถ้าไม่เปลี่ยน)"
          type="password"
          value={password}
          onChange={setPassword}
        />

        {/* Permission matrix (read-only based on role) */}
        <div className="rounded-xl border border-slate-200 p-3">
          <div className="mb-2 text-xs font-semibold text-slate-700">
            สิทธิ์ตาม Role: {ROLE_LABELS[role as Role] ?? role}
          </div>
          <table className="w-full text-xs">
            <thead>
              <tr className="text-slate-500">
                <th className="pb-1 text-left">เมนู</th>
                <th className="pb-1 text-center">ดู</th>
                <th className="pb-1 text-center">แก้ไข</th>
              </tr>
            </thead>
            <tbody>
              {matrix.map((m) => (
                <tr key={m.menu} className="border-t border-slate-100">
                  <td className="py-1.5">{m.label}</td>
                  <td className="py-1.5 text-center">
                    {m.view ? "✅" : "❌"}
                  </td>
                  <td className="py-1.5 text-center">
                    {m.edit ? "✅" : "❌"}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {error && <p className="text-sm text-red-600">{error}</p>}
        <div className="flex items-center gap-3">
          <button type="submit" disabled={saving} className="btn-primary flex-1 disabled:opacity-60">
            {saving ? "กำลังบันทึก..." : "บันทึก"}
          </button>
          <button type="button" onClick={remove} className="text-sm text-red-600 hover:underline">
            ลบผู้ใช้
          </button>
        </div>
      </form>
    </Modal>
  );
}

// --- Shared components ---
function Modal({
  title,
  onClose,
  children,
}: {
  title: string;
  onClose: () => void;
  children: React.ReactNode;
}) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4">
      <div className="w-full max-w-lg rounded-2xl bg-white p-6 shadow-xl">
        <div className="mb-4 flex items-center justify-between">
          <h3 className="text-lg font-semibold text-slate-900">{title}</h3>
          <button onClick={onClose} className="text-slate-400 hover:text-slate-700">
            ✕
          </button>
        </div>
        {children}
      </div>
    </div>
  );
}

function Input({
  label,
  value,
  onChange,
  type = "text",
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
  type?: string;
}) {
  return (
    <label className="block text-sm">
      <span className="mb-1 block font-medium text-slate-700">{label}</span>
      <input
        type={type}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="w-full rounded-xl border border-slate-200 px-3 py-2 outline-none focus:border-brand-500 focus:ring-2 focus:ring-brand-100"
      />
    </label>
  );
}

function RoleSelect({ value, onChange }: { value: string; onChange: (v: string) => void }) {
  return (
    <label className="block text-sm">
      <span className="mb-1 block font-medium text-slate-700">Role</span>
      <select
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="w-full rounded-xl border border-slate-200 px-3 py-2 outline-none focus:border-brand-500"
      >
        {ROLES.map((r) => (
          <option key={r} value={r}>
            {ROLE_LABELS[r]}
          </option>
        ))}
      </select>
    </label>
  );
}
