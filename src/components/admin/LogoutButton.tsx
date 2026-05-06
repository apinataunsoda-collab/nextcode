"use client";

import { useRouter } from "next/navigation";

export default function LogoutButton() {
  const router = useRouter();
  const onClick = async () => {
    await fetch("/api/auth/logout", { method: "POST" });
    router.push("/admin/login");
    router.refresh();
  };
  return (
    <button
      onClick={onClick}
      className="rounded-lg border border-slate-200 px-3 py-1.5 text-xs font-medium text-slate-700 hover:border-red-400 hover:text-red-600"
    >
      ออกจากระบบ
    </button>
  );
}
