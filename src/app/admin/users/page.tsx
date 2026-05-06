import { prisma } from "@/lib/prisma";
import UsersManager from "@/components/admin/UsersManager";

export const dynamic = "force-dynamic";

export default async function AdminUsersPage() {
  const users = await prisma.adminUser.findMany({
    orderBy: { createdAt: "asc" },
    select: {
      id: true,
      email: true,
      name: true,
      role: true,
      permissions: true,
      isActive: true,
      createdAt: true,
    },
  });

  return (
    <div>
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-slate-900">จัดการผู้ใช้ (Users)</h1>
        <p className="mt-1 text-sm text-slate-500">
          เพิ่ม/แก้ไข admin และกำหนดสิทธิ์การเข้าถึงแต่ละเมนู
        </p>
      </div>
      <UsersManager
        initial={users.map((u) => ({
          ...u,
          createdAt: u.createdAt.toISOString(),
        }))}
      />
    </div>
  );
}
