# NextCode — Web Agency (Phase 1 + 2)

Landing page + Admin Dashboard สำหรับธุรกิจรับทำเว็บไซต์  
**Next.js 14 (App Router) + TypeScript + Tailwind + Prisma + SQLite**

## ติดตั้ง & รัน

```bash
npm install
npx prisma db push     # สร้างตารางใน SQLite
npm run db:seed        # ใส่ข้อมูลตัวอย่าง + บัญชี admin
npm run dev            # → http://localhost:3000
```

เข้า Admin: http://localhost:3000/admin  
Default login (แก้ได้ใน `.env`):
- Email: `admin@nextcode.co.th`
- Password: `admin1234`

## โครงสร้างโปรเจกต์

```
prisma/
├─ schema.prisma            # DB schema (Category, Product, AddOn, Lead, LeadAddOn, AdminUser)
└─ seed.ts                  # seed ข้อมูลตัวอย่าง + admin
src/
├─ app/
│  ├─ (site)/               # หน้าเว็บฝั่งลูกค้า (public)
│  │  ├─ page.tsx
│  │  └─ products/[slug]/page.tsx
│  ├─ admin/                # Admin Dashboard (ป้องกันด้วย middleware)
│  │  ├─ page.tsx           # Overview
│  │  ├─ leads/             # Lead Management
│  │  ├─ products/          # Inventory Management (list + new + edit)
│  │  ├─ addons/            # Add-on Setting
│  │  └─ login/
│  ├─ api/
│  │  ├─ leads/             # POST (public), GET/PATCH/DELETE (admin)
│  │  ├─ products/          # CRUD
│  │  ├─ addons/            # CRUD
│  │  ├─ categories/
│  │  ├─ upload/            # อัปโหลดรูปลง public/uploads
│  │  └─ auth/login|logout
│  └─ layout.tsx            # root
├─ components/
│  ├─ Header, Footer, Hero, CatalogSection, ProductCard, ProductDetail, ContactForm
│  └─ admin/ (LeadsTable, ProductForm, AddOnsManager, LogoutButton)
├─ data/site.ts             # ข้อมูลบริษัท / social
├─ lib/
│  ├─ prisma.ts             # singleton client
│  ├─ catalog.ts            # ดึง catalog จาก DB
│  ├─ money.ts
│  ├─ auth.ts               # session + hash (Node)
│  └─ auth-edge.ts          # session verifier สำหรับ middleware (Edge)
└─ middleware.ts            # ปกป้องเส้นทาง /admin/*
```

## ฟีเจอร์ Admin Dashboard (Phase 2)

### Lead Management (`/admin/leads`)
- ตารางรายชื่อลูกค้าทั้งหมด พร้อม filter ตามสถานะ + ค้นหา
- โชว์ **สินค้าที่สนใจ** + **บริการเสริมที่เลือก** (snapshot ราคา ณ เวลาที่ส่งฟอร์ม)
- เปลี่ยนสถานะ (NEW / CONTACTED / QUOTED / WON / LOST) ได้ทันที
- ดูข้อความเต็ม / ลบ

### Inventory Management (`/admin/products`)
- เพิ่ม / แก้ไข / ลบสินค้า
- ฟอร์มรองรับ: ชื่อ, slug, หมวดหมู่, อัปโหลดรูป (หรือใส่ URL), ราคาฐาน, ประเภทบริการ, features, บริการเสริมที่เลือกใช้ได้, เปิด/ปิดการขาย

### Add-on Setting (`/admin/addons`)
- เพิ่ม / แก้ไข / ลบบริการเสริม (แก้ราคา / label / description inline)
- เปิด-ปิดบริการได้

## Database Schema (สรุป)

### ตารางหลัก (SQL-like)

```
Category (id, name, slug)
   └── 1..n ──▶ Product (id, slug, name, shortDescription, image,
                         basePrice, serviceType, features, isActive, categoryId)
                   │
                   └── many-to-many via ProductAddOn ──▶ AddOn (id, code, label,
                                                                description, price, isActive)
                   └── 1..n ──▶ Lead (id, name, phone, email, message,
                                      totalPrice, status, productId)
                                   └── 1..n ──▶ LeadAddOn (addOnId, label,
                                                           priceAtTime)
```

### ทำไมต้องมี `ProductAddOn` (join table)
- รองรับความสัมพันธ์ **many-to-many** (add-on ตัวเดียวใช้ได้กับหลายสินค้า + สินค้าหนึ่งตัวมีหลาย add-on)
- มี `priceOverride` เผื่ออยากตั้งราคาต่างจาก default สำหรับสินค้าตัวนั้น

### ทำไมต้องมี `LeadAddOn` (snapshot)
- เก็บ `priceAtTime` + `label` ณ วันที่ลูกค้าส่งฟอร์ม — ถ้าภายหลังขึ้นราคา add-on ข้อมูลของ lead เก่ายังเก็บราคาที่เคยเสนอไว้อยู่

### JSON ตัวอย่าง (Lead 1 รายการ)

```json
{
  "id": "clx...",
  "name": "สมชาย ใจดี",
  "phone": "081-234-5678",
  "email": "somchai@example.com",
  "message": "สนใจแพ็กเกจร้านอาหาร",
  "totalPrice": 16090,
  "status": "NEW",
  "createdAt": "2026-05-06T10:00:00.000Z",
  "product": {
    "id": "clx...",
    "slug": "restaurant",
    "name": "เว็บไซต์ร้านอาหาร"
  },
  "addOns": [
    { "label": "จดโดเมน .com / .co.th", "priceAtTime": 1290 },
    { "label": "บริการ SEO On-Page ด้วย AI", "priceAtTime": 4900 }
  ]
}
```

## ย้ายจาก SQLite ไป Postgres/MySQL
1. เปลี่ยน `provider` + `DATABASE_URL` ใน `prisma/schema.prisma` และ `.env`
2. (ถ้าใช้ Postgres) สามารถเปลี่ยน `status String` ของ `Lead` กลับเป็น `enum LeadStatus` ได้
3. `npx prisma migrate dev` แล้วรัน seed ใหม่

## หมายเหตุด้านความปลอดภัย (ตั้งก่อนใช้จริง)
- เปลี่ยน `ADMIN_PASSWORD` และ `AUTH_SECRET` ใน `.env` ให้เป็นค่าที่สุ่มยาว ๆ
- อัปโหลดไฟล์ใน Phase 2 เก็บใน `public/uploads` — ใน production แนะนำย้ายไป S3/R2
- ถ้าเปิดสาธารณะ ควรเพิ่ม rate limit ให้ `/api/leads` และ `/api/auth/login`


---

## Phase 3 — Integration & Data Flow

### ขั้นตอนเมื่อผู้ใช้กด "ส่งข้อมูล"

```
[ContactForm] ──POST──▶ /api/leads
                         │
                         ├─ 1. rate limit ตาม IP
                         ├─ 2. validate ด้วย Zod (honeypot + รูปแบบข้อมูล)
                         ├─ 3. resolve product + add-ons จาก DB
                         │     แล้วคำนวณ totalPrice ใหม่ฝั่ง server
                         ├─ 4. Prisma.lead.create(...) + snapshot add-ons
                         ├─ 5. fanOutLead() — best-effort ส่งต่อไป:
                         │     • LINE Notify
                         │     • Discord / Slack webhook
                         │     • Google Sheets (Apps Script webhook)
                         │     • Email (Resend)
                         └─ 6. ตอบ { ok, leadId, message: "ขอบคุณที่สนใจ..." }
```

ถ้า integration ไหนล้มเหลวจะถูก log แต่ **ไม่กระทบการบันทึกลง DB** และไม่กระทบ response ของลูกค้า

### เปิดใช้งาน Integration

ทุกตัวเป็น *optional* — เปิดเฉพาะที่อยากใช้ โดยใส่ค่าใน `.env`:

```bash
# LINE Notify: https://notify-bot.line.me/my/ → "Generate token"
LINE_NOTIFY_TOKEN="xxxxxxxx"

# Discord: Server Settings → Integrations → Webhooks
DISCORD_WEBHOOK_URL="https://discord.com/api/webhooks/..."

# Slack: https://api.slack.com/messaging/webhooks
SLACK_WEBHOOK_URL="https://hooks.slack.com/services/..."

# Google Sheets (วิธีตั้งดูหัวข้อถัดไป)
GOOGLE_SHEET_WEBHOOK_URL="https://script.google.com/macros/s/.../exec"
GOOGLE_SHEET_WEBHOOK_SECRET="some-random-string"

# Resend (อีเมล): https://resend.com
RESEND_API_KEY="re_..."
NOTIFY_EMAIL_TO="sales@nextcode.co.th"
NOTIFY_EMAIL_FROM="NextCode <no-reply@nextcode.co.th>"
```

### ตั้งค่า Google Sheets (ผ่าน Apps Script)

1. เปิด Google Sheet ใหม่ → Extensions → Apps Script
2. วางโค้ดนี้ แล้ว Deploy → New deployment → Web app → Anyone

```js
const SECRET = "some-random-string"; // ต้องตรงกับ GOOGLE_SHEET_WEBHOOK_SECRET

function doPost(e) {
  const data = JSON.parse(e.postData.contents);
  if (data.secret !== SECRET) {
    return ContentService.createTextOutput("forbidden").setMimeType(ContentService.MimeType.TEXT);
  }
  const sheet = SpreadsheetApp.getActiveSpreadsheet().getActiveSheet();
  if (sheet.getLastRow() === 0) {
    sheet.appendRow([
      "createdAt","id","name","phone","email",
      "productName","productSlug","addOns","addOnsPrice","totalPrice","message",
    ]);
  }
  sheet.appendRow([
    data.createdAt, data.id, data.name, data.phone, data.email,
    data.productName, data.productSlug, data.addOns, data.addOnsPrice, data.totalPrice, data.message,
  ]);
  return ContentService.createTextOutput(JSON.stringify({ ok: true })).setMimeType(ContentService.MimeType.JSON);
}
```

3. คัดลอก URL ที่ได้มาใส่ `GOOGLE_SHEET_WEBHOOK_URL`

### Anti-spam

- **Honeypot field** (`website`) ซ่อน CSS — ถ้าบอทกรอกจะถูกตีตกที่ Zod
- **Rate limit** ตาม IP (in-memory) — ปรับได้ที่ `RATE_LIMIT_WINDOW_MS` / `RATE_LIMIT_MAX`  
  โปรดักชันแนะนำย้ายไป Upstash Redis

### Admin: Export CSV
`/admin/leads` → ปุ่ม **⬇︎ Export CSV** โหลดทั้งหมดรวม add-ons + status


---

## Phase 4 — SEO & Filtering

### Filter & Search (หน้าแคตตาล็อก)

หน้าแรก section `#catalog` เปลี่ยนเป็น `CatalogExplorer` (client component) มี:
- **ช่องค้นหา** — จับคู่กับ ชื่อ / คำอธิบาย / หมวดหมู่ / features / tags
- **Chip หมวดหมู่** — "ทั้งหมด / ร้านอาหาร / โรงงาน / คลินิก / …" (มาจาก DB ล้วน)
- **Chip tags** — เช่น `#ระบบจอง`, `#B2B`, `#ตะกร้าสินค้า` (แก้ไขได้จาก Admin)
- **เรียงลำดับ** — แนะนำ / ราคาต่ำ→สูง / สูง→ต่ำ

Tags เพิ่มใหม่ในตาราง `Product.tags` (JSON string) — เพิ่มได้จาก `/admin/products/[id]`

### SEO Meta Tags

- `metadataBase` + `alternates.canonical` อัตโนมัติทุกหน้า
- `OpenGraph` + `twitter` card ครอบคลุมทั้งเว็บ
- หน้าสินค้า `generateMetadata()` → `productMetadata(product)` สร้าง **Title** และ **Description** แบบ dynamic จากข้อมูลสินค้า:
  - Title: `"เว็บไซต์ร้านอาหาร เริ่มต้น ฿7,900 | NextCode"`
  - Description: ตัด 160 ตัวอักษร ประกอบจาก shortDescription + category + features[0..2] + ราคาเริ่มต้น
- มี `src/app/sitemap.ts` และ `src/app/robots.ts` → Next.js generate `sitemap.xml` / `robots.txt` ให้เอง

ตั้ง base URL ของเว็บจริงใน `.env` (หรือแก้ที่ `siteConfig.url`):
```
NEXT_PUBLIC_SITE_URL="https://nextcode.co.th"
```

### JSON-LD Schema

ฝังผ่าน `<JsonLd />` (component ง่าย ๆ render `<script type="application/ld+json">`)

**หน้าแรก** — `ProfessionalService` พร้อม `makesOffer` ราคาเริ่มต้น (ดึงจากสินค้าที่ถูกที่สุด)
```json
{
  "@context": "https://schema.org",
  "@type": "ProfessionalService",
  "name": "NextCode",
  "priceRange": "฿฿",
  "makesOffer": {
    "@type": "Offer",
    "priceCurrency": "THB",
    "price": "4900",
    "description": "รับทำเว็บไซต์ เริ่มต้น ฿4,900"
  }
}
```

**หน้าสินค้า** — `SoftwareApplication` + `BreadcrumbList`
```json
{
  "@context": "https://schema.org",
  "@type": "SoftwareApplication",
  "name": "เว็บไซต์ร้านอาหาร",
  "applicationCategory": "BusinessApplication",
  "operatingSystem": "Web",
  "offers": {
    "@type": "Offer",
    "priceCurrency": "THB",
    "price": "7900"
  },
  "featureList": ["ระบบจองโต๊ะออนไลน์", "เชื่อม Google Maps", "..."]
}
```

ทดสอบ Structured Data ที่ [https://search.google.com/test/rich-results](https://search.google.com/test/rich-results)


---

## Phase 5 — Tracking & Analytics

### Providers ที่รองรับ (ทั้งหมด optional)

ใส่ ID ใน `.env` เฉพาะที่อยากเปิด ถ้าไม่ใส่ script จะไม่ถูกโหลด:

```
NEXT_PUBLIC_GA_ID="G-XXXXXXX"
NEXT_PUBLIC_META_PIXEL_ID="123456789012345"
NEXT_PUBLIC_GTM_ID="GTM-XXXXXX"
```

Script ถูกโหลดแบบ `afterInteractive` ที่ root layout (`<Analytics />`) และจะยิง `page_view` อัตโนมัติทุกครั้งที่เปลี่ยน route

### Event ที่ระบบยิงอัตโนมัติ

| เหตุการณ์ | ที่ไหน | GA4 event | Meta Pixel event |
|---|---|---|---|
| คลิกดูรายละเอียดจากการ์ด | `ProductCard` | `select_item` | `SelectContent` (custom) |
| เปิดหน้ารายละเอียดสินค้า | `ProductDetail` mount | `view_item` | `ViewContent` |
| ติ๊ก / ยกเลิก Add-on | `ProductDetail` toggle | `add_to_cart` / `remove_from_cart` | `AddToCart` |
| กดปุ่มส่งฟอร์ม | `ContactForm` submit | `form_submit` | `SubmitApplication` |
| เปิดหน้า `/thank-you` | `ThankYouTracker` | `generate_lead` | `Lead` |

ทั้งหมดยิงผ่าน `src/lib/analytics.ts` → `track()` ซึ่ง push เข้า GA4 + `dataLayer` + Meta Pixel พร้อมกัน

### Conversion Tracking

เมื่อส่งฟอร์มสำเร็จ → redirect ไป `/thank-you?id=...&total=...&product=...&productName=...`
- หน้านี้ `robots: noindex` (ไม่ให้ Google เก็บหน้าขอบคุณ)
- ยิง `Lead` (Pixel) + `generate_lead` (GA4) **ทันทีที่เปิดหน้า** แนบ `transaction_id` = leadId กัน dedup
- ใช้ URL นี้ตั้งเป็น Conversion ใน:
  - **Meta Ads**: URL contains `/thank-you`
  - **Google Ads**: Conversion event = `generate_lead` (หรือ URL destination `/thank-you`)
  - **GA4**: mark event `generate_lead` as conversion

### Admin: Insights (`/admin/insights`)

- Leads 30 วัน / ทั้งหมด / ยอดประเมินรวม / สถานะ NEW
- กราฟแท่ง **แพ็กเกจที่ลูกค้าสนใจ** (นับจาก product ใน Lead)
- กราฟแท่ง **หมวดหมู่ที่มาแรง** (กลุ่มธุรกิจ)
- **บริการเสริมยอดนิยม** — นับจำนวนครั้ง + รวมมูลค่า

ใช้วิเคราะห์ว่าควรยิงโฆษณาไปทางไหน / เพิ่มแพ็กเกจแบบไหน / เสนอ add-on ตัวไหนเป็นค่าเริ่มต้น


---

## Phase 6 — Auto-Reply Emails

### สองฝั่งที่ระบบส่งอัตโนมัติเมื่อมี Lead ใหม่

**1) User Auto-Reply** (ถ้าลูกค้ากรอกอีเมลมา)
- Subject: `ขอบคุณสำหรับความสนใจใน [ชื่อแพ็กเกจ] | NextCode`
- เนื้อหา: ขอบคุณ + ระบุบริการที่เลือก + สรุปแพ็กเกจ/add-ons/ยอดรวม + ระยะเวลาติดต่อกลับ 24 ชม. + ปุ่มโทร + LINE
- `Reply-To` = อีเมลทีม — ลูกค้ากด Reply แล้วถึงทีมทันที

**2) Admin Notification** (ส่งให้ทีม)
- Subject: `🎯 Lead ใหม่: [ชื่อ] ([แพ็กเกจ]) · ฿[ยอดรวม]`
- เนื้อหา: รายละเอียดเต็ม (เบอร์, อีเมล, แพ็กเกจ, add-ons, ยอดรวม, ข้อความ) + ปุ่ม **📞 โทรกลับ** + ปุ่ม **เปิดใน Admin**
- `Reply-To` = อีเมลลูกค้า — ทีมกด Reply แล้วถึงลูกค้าทันที

### ตั้งค่า (ใช้ Resend)

```bash
RESEND_API_KEY="re_..."
NOTIFY_EMAIL_TO="sales@nextcode.co.th,manager@nextcode.co.th"
NOTIFY_EMAIL_FROM="NextCode <no-reply@nextcode.co.th>"
```

> ถ้าไม่ตั้ง `RESEND_API_KEY` ระบบจะ **ไม่ส่งจริง** แต่จะ log หัวอีเมลลง console — สะดวกกับ dev

### แก้ไขเทมเพลต
- เลย์เอาท์กลาง / สี / footer: `src/emails/shared.ts`
- ข้อความฝั่งลูกค้า: `src/emails/userAutoReply.ts`
- ข้อความฝั่งทีม: `src/emails/adminNotification.ts`

### ทดสอบจากหน้า Admin
เปิด `/admin/emails`
- พรีวิวเทมเพลตสดทั้ง 2 แบบ
- ปุ่ม "ส่งอีเมลทดสอบ" — เลือก template + ใส่อีเมลปลายทาง → ส่งจริงผ่าน Resend

API ภายใต้:
- `GET /api/admin/email-preview?type=user|admin` → render HTML preview
- `POST /api/admin/email-test` body `{ type: "user" | "admin", to: "..." }` → ส่งทดสอบ

### Flow หลังส่งฟอร์ม (รวม Phase 3)

```
POST /api/leads
  ├─ validate + rate limit
  ├─ บันทึก Prisma
  └─ fanOutLead() (best-effort, ไม่ block response):
        ├─ LINE Notify / Discord / Slack
        ├─ Google Sheet webhook
        ├─ 📧 Admin notification email (ถ้ามี NOTIFY_EMAIL_TO)
        └─ 📧 User thank-you email  (ถ้าลูกค้ากรอก email)
```


---

## Phase 7 — Site Settings (Content Management)

ข้อมูลพื้นฐานของเว็บทั้งหมดย้ายเข้า DB แล้ว แก้ได้จาก `/admin/settings` โดยไม่ต้องแก้โค้ด

### สิ่งที่แก้ไขได้

**ข้อมูลทั่วไป** — ชื่อเว็บ, Tagline, Description, Site URL (ใช้ทำ canonical/sitemap)
**ติดต่อ** — ที่อยู่, เบอร์สำนักงาน, เบอร์มือถือ, อีเมล, LINE ID
**Social** — Facebook, Instagram, TikTok, YouTube
**Branding** — อัปโหลดโลโก้ และ Favicon (ใช้ทั่วเว็บ + ใน Header ของอีเมล + OG)
**Footer** — ข้อความยาวหลายบรรทัด แสดงมุมซ้ายของ Footer
**Navigation** — จัดการเมนู Header (label + href, ย้ายขึ้น-ลง-ลบ-เพิ่ม)

### มีผลที่ไหนบ้าง

| จุดที่เปลี่ยน | อ่านจาก settings |
|---|---|
| `<Header />` | โลโก้, ชื่อ, เมนู |
| `<Footer />` | โลโก้, ข้อมูลติดต่อ, social, footerText |
| Root metadata (OG, Twitter, favicon) | name, tagline, description, url, logoUrl, faviconUrl |
| หน้าสินค้า metadata | name, url, logoUrl (fallback) |
| JSON-LD ProfessionalService / SoftwareApplication / Breadcrumb | name, url, logoUrl, mobile, email, address, social |
| `sitemap.xml` / `robots.txt` | url |
| Email templates (user & admin) | name, tagline, logoUrl, address, mobile, email, lineId, url |
| Thank-you page | mobile, phone, lineId, email |

### สถาปัตยกรรม

- DB: `SiteSetting` (single row `id=1`) + Prisma migration แล้ว
- Helper: `src/lib/settings.ts`
  - `getSiteSettings()` — อ่าน + fallback ทีละ field
  - `defaultSettings()` — default จาก `src/data/site.ts`
  - `ensureSettingsRow()` — upsert row id=1
- API: `GET/PUT /api/admin/settings` (ต้อง login admin)
- อัปโหลดโลโก้/favicon ใช้ `/api/upload` ตัวเดิม (เก็บลง `public/uploads/`)

### วิธีใช้
1. เข้า `/admin/settings`
2. แก้ข้อมูล → กด "บันทึกการตั้งค่า"
3. กลับไปดูหน้า public — Header, Footer, Meta, อีเมลจะใช้ข้อมูลใหม่ทันที

> หมายเหตุ: หน้า public ใช้ App Router server components ซึ่งอาจถูก cache — ถ้าหลังบันทึกแล้วยังเห็นของเก่า ลอง refresh (หน้า public ใน dev จะ refresh ให้อัตโนมัติ)
