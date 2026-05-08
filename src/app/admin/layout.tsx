import Link from "next/link";
import { readSessionFromCookies } from "@/lib/auth";
import { getSiteSettings } from "@/lib/settings";
import LogoutButton from "@/components/admin/LogoutButton";

export const metadata = { title: "Admin | NextCode" };

const navItems = [
  { href: "/admin", label: "ภาพรวม", exact: true },
  { href: "/admin/leads", label: "Leads ลูกค้า" },
  { href: "/admin/quotations", label: "ใบเสนอราคา" },
  { href: "/admin/insights", label: "Insights" },
  { href: "/admin/products", label: "สินค้า (เว็บไซต์)" },
  { href: "/admin/categories", label: "หมวดหมู่" },
  { href: "/admin/addons", label: "บริการเสริม" },
  { href: "/admin/emails", label: "Email Templates" },
  { href: "/admin/settings", label: "Site Settings" },
  { href: "/admin/users", label: "จัดการผู้ใช้" },
];

export default async function AdminLayout({ children }: { children: React.ReactNode }) {
  const session = readSessionFromCookies();
  const s = await getSiteSettings();

  const LogoBlock = () =>
    s.logoUrl ? (
      <div className="flex h-16 items-center border-b border-slate-200 px-4">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src={s.logoUrl} alt={s.name} className="h-10 w-auto max-w-[180px] object-contain" />
      </div>
    ) : (
      <div className="flex h-16 items-center gap-2 border-b border-slate-200 px-6">
        <span className="grid h-8 w-8 place-items-center rounded-lg bg-brand-600 text-white">
          <span className="text-sm font-bold">{(s.name || "N").charAt(0)}</span>
        </span>
        <span className="font-bold">{s.name} Admin</span>
      </div>
    );

  return (
    <div className="min-h-screen bg-slate-50">
      {session && (
        <aside className="fixed inset-y-0 left-0 hidden w-64 border-r border-slate-200 bg-white lg:block">
          <LogoBlock />
          <nav className="flex flex-col gap-1 p-4">
            {navItems.map((n) => (
              <Link
                key={n.href}
                href={n.href}
                className="rounded-lg px-3 py-2 text-sm font-medium text-slate-600 transition hover:bg-brand-50 hover:text-brand-700"
              >
                {n.label}
              </Link>
            ))}
          </nav>
          <div className="absolute inset-x-0 bottom-0 border-t border-slate-200 p-4 text-xs text-slate-500">
            <div className="mb-2 truncate">👤 {session.email}</div>
            <LogoutButton />
          </div>
        </aside>
      )}
      <div className={session ? "lg:pl-64" : ""}>
        {session && (
          <header className="flex h-16 items-center justify-between border-b border-slate-200 bg-white px-6 lg:hidden">
            {s.logoUrl ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img src={s.logoUrl} alt={s.name} className="h-8 w-auto" />
            ) : (
              <span className="font-bold">{s.name} Admin</span>
            )}
            <LogoutButton />
          </header>
        )}
        <div className="p-6 lg:p-10">{children}</div>
      </div>
    </div>
  );
}
