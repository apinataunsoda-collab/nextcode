import SettingsForm from "@/components/admin/SettingsForm";
import { ensureSettingsRow, getSiteSettings } from "@/lib/settings";

export const dynamic = "force-dynamic";

export default async function AdminSettingsPage() {
  await ensureSettingsRow();
  const settings = await getSiteSettings();

  return (
    <div>
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-slate-900">Site Settings</h1>
        <p className="mt-1 text-sm text-slate-500">
          แก้ไขชื่อเว็บ โลโก้ ข้อมูลติดต่อ โซเชียล และ Footer — มีผลทั่วเว็บ
        </p>
      </div>
      <SettingsForm initial={settings} />
    </div>
  );
}
