# โครงสร้างโปรเจกต์ NextCode Studio

แยกตามหน้าที่: **Frontend** (หน้าบ้าน) / **Backend** (หลังบ้าน + API + DB)

---

## 📁 Root Files (Config)

```
├── .env                    # Environment variables (ห้าม commit)
├── .env.example            # ตัวอย่าง env
├── .gitignore
├── next.config.mjs         # Next.js config
├── package.json            # Dependencies + scripts
├── postcss.config.mjs      # PostCSS (Tailwind)
├── tailwind.config.ts      # Tailwind theme + colors
├── tsconfig.json           # TypeScript config
└── README.md
```

---

## 🎨 FRONTEND (หน้าบ้าน — ลูกค้าเห็น)

```
src/
├── app/(site)/                         ← Route group หน้าบ้าน
│   ├── layout.tsx                      # Layout: Header + Footer
│   ├── page.tsx                        # หน้าแรก (Hero + Catalog + Contact)
│   ├── products/[slug]/page.tsx        # หน้ารายละเอียดสินค้า
│   ├── quotation/[id]/page.tsx         # ใบเสนอราคา (ลูกค้าดู/พิมพ์)
│   └── thank-you/page.tsx              # หน้าขอบคุณ (Conversion)
│
├── components/                         ← UI Components (หน้าบ้าน)
│   ├── Header.tsx                      # Server: ดึง settings
│   ├── HeaderClient.tsx                # Client: mobile menu + logo
│   ├── Footer.tsx                      # Server: ข้อมูลติดต่อ + social
│   ├── Hero.tsx                        # Hero section
│   ├── CatalogSection.tsx              # Server: fetch products → pass to Explorer
│   ├── CatalogExplorer.tsx             # Client: filter + search + sort
│   ├── ProductCard.tsx                 # Client: card + tracking event
│   ├── ProductDetail.tsx               # Client: add-ons + real-time total
│   ├── ContactForm.tsx                 # Client: form + submit + redirect
│   ├── PrintButton.tsx                 # Client: ปุ่มพิมพ์ใบเสนอราคา
│   ├── ThankYouTracker.tsx             # Client: ยิง conversion event
│   └── JsonLd.tsx                      # Server: render JSON-LD script
│
├── components/analytics/
│   └── Analytics.tsx                   # Client: GA4 + Pixel + GTM loader
│
├── app/globals.css                     # Tailwind + custom utilities
├── app/layout.tsx                      # Root layout (metadata + font + Analytics)
├── app/robots.ts                       # robots.txt generator
└── app/sitemap.ts                      # sitemap.xml generator
```

---

## ⚙️ BACKEND (API + Admin + DB + Logic)

### Database

```
prisma/
├── schema.prisma           # DB Schema ทั้งหมด (SQLite/Postgres)
├── seed.ts                 # Seed ข้อมูลตัวอย่าง + admin user
└── dev.db                  # SQLite database file (dev only)
```

### API Routes

```
src/app/api/
├── auth/
│   ├── login/route.ts      # POST: login → set cookie
│   └── logout/route.ts     # POST: clear cookie
│
├── leads/
│   ├── route.ts            # POST (public): สร้าง lead / GET (admin): list
│   ├── [id]/route.ts       # PATCH: update status / DELETE
│   └── export/route.ts     # GET: download CSV
│
├── products/
│   ├── route.ts            # GET: list / POST: create
│   └── [id]/route.ts       # PUT: update / DELETE
│
├── addons/
│   ├── route.ts            # GET: list / POST: create
│   └── [id]/route.ts       # PUT: update / DELETE
│
├── categories/route.ts     # GET: list / POST: create
│
├── quotations/
│   ├── route.ts            # GET: list / POST: create
│   └── [id]/route.ts       # GET (public) / PATCH / DELETE
│
├── upload/route.ts         # POST: upload image → public/uploads/
│
└── admin/
    ├── settings/route.ts   # GET / PUT: site settings
    ├── users/
    │   ├── route.ts        # GET: list / POST: create user
    │   └── [id]/route.ts   # PUT: update / DELETE user
    ├── email-preview/route.ts  # GET: render email template HTML
    └── email-test/route.ts     # POST: send test email
```

### Admin Pages

```
src/app/admin/
├── layout.tsx              # Admin layout (sidebar + auth check)
├── login/page.tsx          # Login form
├── page.tsx                # Dashboard overview
├── leads/page.tsx          # Lead management
├── quotations/
│   ├── page.tsx            # Quotation list
│   └── new/page.tsx        # Create quotation form
├── insights/page.tsx       # Analytics / charts
├── products/
│   ├── page.tsx            # Product list
│   ├── new/page.tsx        # Create product
│   └── [id]/page.tsx       # Edit product
├── addons/page.tsx         # Add-on settings
├── emails/page.tsx         # Email template preview + test
├── settings/page.tsx       # Site settings
└── users/page.tsx          # User/role management
```

### Admin Components

```
src/components/admin/
├── LogoutButton.tsx
├── LeadsTable.tsx          # Client: table + filter + status change
├── QuotationsTable.tsx     # Client: table + status dropdown
├── QuotationForm.tsx       # Client: create quotation form
├── ProductForm.tsx         # Client: create/edit product
├── AddOnsManager.tsx       # Client: CRUD add-ons inline
├── EmailTestPanel.tsx      # Client: preview + send test
├── SettingsForm.tsx        # Client: site settings form
└── UsersManager.tsx        # Client: user CRUD + role matrix
```

### Backend Libraries (Logic)

```
src/lib/
├── prisma.ts               # Prisma client singleton
├── auth.ts                 # Session: hash, sign, verify (Node)
├── auth-edge.ts            # Session verify (Edge/middleware)
├── catalog.ts              # ดึง products จาก DB → CatalogProduct type
├── settings.ts             # ดึง/อัปเดต site settings
├── permissions.ts          # Role & permission system
├── validators.ts           # Zod schemas (lead form)
├── rate-limit.ts           # In-memory rate limiter
├── notifications.ts        # Fan-out: LINE/Discord/Slack/Sheet/Email
├── mailer.ts               # Resend email sender
├── seo.ts                  # Meta tags + JSON-LD generators
├── money.ts                # formatTHB()
└── analytics.ts            # Client: unified track() helper
```

### Email Templates

```
src/emails/
├── shared.ts               # Layout + helpers (ใช้ร่วมกัน)
├── userAutoReply.ts        # Template: ขอบคุณลูกค้า
└── adminNotification.ts    # Template: แจ้งทีม lead ใหม่
```

### Middleware

```
src/middleware.ts           # ป้องกัน /admin/* (redirect ไป login)
```

### Static Data (Defaults)

```
src/data/
└── site.ts                 # ค่า default ของ site settings (fallback)
```

---

## 📂 Public (Static Files)

```
public/
├── uploads/                # รูปที่อัปโหลดจาก admin
│   └── .gitkeep
├── logo.png                # โลโก้ (วางเอง)
└── og-default.png          # OG image default (ถ้ามี)
```

---

## สรุปแบบ 2 กลุ่ม

| กลุ่ม | ไฟล์/โฟลเดอร์ | หน้าที่ |
|---|---|---|
| **Frontend** | `src/app/(site)/`, `src/components/` (ไม่รวม admin/), `src/lib/analytics.ts`, `globals.css` | UI ที่ลูกค้าเห็น + interaction |
| **Backend** | `prisma/`, `src/app/api/`, `src/app/admin/`, `src/components/admin/`, `src/lib/` (ส่วนใหญ่), `src/emails/`, `src/middleware.ts` | DB, API, Admin, Auth, Email, Logic |
