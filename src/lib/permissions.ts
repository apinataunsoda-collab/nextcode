/**
 * Role & Permission system
 *
 * Roles (ลำดับจากสิทธิ์สูงสุด → ต่ำสุด):
 *   owner   — เข้าถึงทุกอย่าง + จัดการ users
 *   admin   — เข้าถึงทุกอย่าง ยกเว้นจัดการ users
 *   editor  — ดู + แก้ไข (leads, quotations, products, addons)
 *   viewer  — ดูอย่างเดียว
 *
 * แต่ละเมนูมี 2 ระดับ: view (ดู) และ edit (แก้ไข)
 */

export const ROLES = ["owner", "admin", "editor", "viewer"] as const;
export type Role = (typeof ROLES)[number];

export const ROLE_LABELS: Record<Role, string> = {
  owner: "Owner (เจ้าของ)",
  admin: "Admin (ผู้ดูแลระบบ)",
  editor: "Editor (แก้ไขข้อมูล)",
  viewer: "Viewer (ดูอย่างเดียว)",
};

// เมนู/ส่วนที่ควบคุมได้
export const MENU_KEYS = [
  "leads",
  "quotations",
  "insights",
  "products",
  "addons",
  "emails",
  "settings",
  "users",
] as const;
export type MenuKey = (typeof MENU_KEYS)[number];

export const MENU_LABELS: Record<MenuKey, string> = {
  leads: "Leads ลูกค้า",
  quotations: "ใบเสนอราคา",
  insights: "Insights",
  products: "สินค้า (เว็บไซต์)",
  addons: "บริการเสริม",
  emails: "Email Templates",
  settings: "Site Settings",
  users: "จัดการผู้ใช้",
};

export type PermAction = "view" | "edit";
export type PermKey = `${MenuKey}:${PermAction}`;

/**
 * Default permissions ตาม role
 * owner/admin ได้ทุกอย่าง, editor ดู+แก้ไขยกเว้น users/settings, viewer ดูอย่างเดียว
 */
function defaultPermsForRole(role: Role): Set<PermKey> {
  const all = new Set<PermKey>();

  if (role === "owner" || role === "admin") {
    for (const m of MENU_KEYS) {
      all.add(`${m}:view`);
      all.add(`${m}:edit`);
    }
    // admin ไม่สามารถจัดการ users
    if (role === "admin") {
      all.delete("users:edit");
    }
    return all;
  }

  if (role === "editor") {
    for (const m of MENU_KEYS) {
      if (m === "users") continue; // editor ไม่เห็นหน้า users
      all.add(`${m}:view`);
      if (m !== "settings") all.add(`${m}:edit`);
    }
    return all;
  }

  // viewer — ดูอย่างเดียว ยกเว้น users
  for (const m of MENU_KEYS) {
    if (m === "users") continue;
    all.add(`${m}:view`);
  }
  return all;
}

/**
 * คำนวณ permissions จริงของ user = default ตาม role + custom overrides
 */
export function resolvePermissions(role: string, customJson?: string): Set<PermKey> {
  const r = (ROLES.includes(role as Role) ? role : "viewer") as Role;
  const perms = defaultPermsForRole(r);

  // custom permissions (เพิ่มเติมจาก role)
  if (customJson) {
    try {
      const arr = JSON.parse(customJson);
      if (Array.isArray(arr)) {
        for (const p of arr) {
          if (typeof p === "string" && p.includes(":")) perms.add(p as PermKey);
        }
      }
    } catch {}
  }

  return perms;
}

/** เช็คว่า user มีสิทธิ์ไหม */
export function hasPermission(
  role: string,
  customJson: string | undefined | null,
  menu: MenuKey,
  action: PermAction,
): boolean {
  const perms = resolvePermissions(role, customJson ?? undefined);
  return perms.has(`${menu}:${action}`);
}

/** สร้าง permission matrix สำหรับแสดงใน UI */
export function getPermissionMatrix(role: string, customJson?: string) {
  const perms = resolvePermissions(role, customJson);
  return MENU_KEYS.map((menu) => ({
    menu,
    label: MENU_LABELS[menu],
    view: perms.has(`${menu}:view`),
    edit: perms.has(`${menu}:edit`),
  }));
}
