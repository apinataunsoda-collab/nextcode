import { PrismaClient } from "@prisma/client";
import { hashPassword } from "../src/lib/auth";

const prisma = new PrismaClient();

const categories = [
  { name: "ร้านอาหาร / คาเฟ่", slug: "restaurant" },
  { name: "โรงงาน / B2B", slug: "factory" },
  { name: "สุขภาพ / ความงาม", slug: "clinic" },
  { name: "E-Commerce", slug: "ecommerce" },
  { name: "อสังหาริมทรัพย์", slug: "real-estate" },
  { name: "ฟรีแลนซ์ / Portfolio", slug: "portfolio" },
];

const addOns = [
  { code: "domain", label: "จดโดเมน .com / .co.th", description: "รวมค่าจดโดเมน 1 ปีแรก", price: 1290 },
  { code: "hosting", label: "Hosting 1 ปี (SSD + SSL ฟรี)", description: "โฮสต์เร็ว เสถียร รองรับทราฟฟิกระดับกลาง", price: 2500 },
  { code: "seo", label: "บริการ SEO On-Page ด้วย AI", description: "วิเคราะห์คีย์เวิร์ด + เขียน Meta + ปรับโครงสร้าง", price: 4900 },
  { code: "content", label: "เขียนเนื้อหา 5 หน้า ด้วย AI", description: "เนื้อหาเฉพาะธุรกิจของคุณ พร้อมตรวจทานโดยทีมงาน", price: 2900 },
  { code: "line-oa", label: "ผูก LINE OA + แชทบอท", description: "เชื่อมเว็บเข้ากับ LINE Official Account", price: 3500 },
];

const products = [
  {
    slug: "restaurant",
    name: "เว็บไซต์ร้านอาหาร",
    categorySlug: "restaurant",
    image: "https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?auto=format&fit=crop&w=1200&q=60",
    basePrice: 7900,
    shortDescription: "เมนูอาหารสวย ๆ พร้อมระบบจองโต๊ะ และแผนที่ Google Maps ในตัว",
    serviceType: "ออกแบบ + ส่งมอบ",
    features: ["หน้าเมนูอาหารพร้อมรูปภาพ", "ระบบจองโต๊ะออนไลน์", "เชื่อม Google Maps + เวลาทำการ", "รองรับมือถือ 100%"],
    tags: ["ระบบจอง", "คาเฟ่"],
  },
  {
    slug: "factory",
    name: "เว็บไซต์โรงงานอุตสาหกรรม",
    categorySlug: "factory",
    image: "https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?auto=format&fit=crop&w=1200&q=60",
    basePrice: 12900,
    shortDescription: "นำเสนอสินค้า กำลังการผลิต มาตรฐาน ISO พร้อมฟอร์มขอใบเสนอราคา",
    serviceType: "ออกแบบ + ส่งมอบ",
    features: ["หน้าสินค้า / Product Catalog", "ฟอร์มขอใบเสนอราคา (RFQ)", "รองรับ 2 ภาษา (ไทย / อังกฤษ)", "โครงสร้างรองรับ SEO B2B"],
    tags: ["B2B", "2 ภาษา"],
  },
  {
    slug: "clinic",
    name: "เว็บไซต์คลินิก / โรงพยาบาล",
    categorySlug: "clinic",
    image: "https://images.unsplash.com/photo-1579684385127-1ef15d508118?auto=format&fit=crop&w=1200&q=60",
    basePrice: 10900,
    shortDescription: "ระบบนัดหมายออนไลน์ แพ็กเกจบริการ และรีวิวจากคนไข้จริง",
    serviceType: "ออกแบบ + ดูแลรายเดือน",
    features: ["ระบบจองคิว / นัดหมายแพทย์", "หน้าแพ็กเกจ + โปรโมชั่น", "รีวิว / ก่อน-หลัง", "PDPA Ready"],
    tags: ["ระบบจอง", "PDPA"],
  },
  {
    slug: "ecommerce",
    name: "เว็บไซต์ขายของออนไลน์",
    categorySlug: "ecommerce",
    image: "https://images.unsplash.com/photo-1483985988355-763728e1935b?auto=format&fit=crop&w=1200&q=60",
    basePrice: 15900,
    shortDescription: "ตะกร้าสินค้า ระบบชำระเงิน และเชื่อมต่อขนส่งชั้นนำในไทย",
    serviceType: "E-Commerce",
    features: ["ตะกร้าสินค้า + Checkout", "ชำระเงินผ่าน PromptPay / บัตร", "เชื่อมต่อ Flash / Kerry / SPX", "Dashboard จัดการออเดอร์"],
    tags: ["ตะกร้าสินค้า", "ชำระเงินออนไลน์"],
  },
  {
    slug: "real-estate",
    name: "เว็บไซต์อสังหาริมทรัพย์",
    categorySlug: "real-estate",
    image: "https://images.unsplash.com/photo-1560518883-ce09059eeffa?auto=format&fit=crop&w=1200&q=60",
    basePrice: 11900,
    shortDescription: "โชว์โครงการ ยูนิต ราคา แผนผัง พร้อมระบบค้นหาและฟอร์มนัดชม",
    serviceType: "ออกแบบ + ส่งมอบ",
    features: ["รายการโครงการ / ยูนิต", "ฟิลเตอร์ราคา / ทำเล / ขนาด", "ฟอร์มนัดชมโครงการ", "แผนที่ + Street View"],
    tags: ["ระบบจอง", "ค้นหา/ฟิลเตอร์"],
  },
  {
    slug: "portfolio",
    name: "เว็บไซต์ Portfolio ส่วนตัว",
    categorySlug: "portfolio",
    image: "https://images.unsplash.com/photo-1467232004584-a241de8bcf5d?auto=format&fit=crop&w=1200&q=60",
    basePrice: 4900,
    shortDescription: "โชว์ผลงาน ทักษะ และช่องทางติดต่อ สไตล์มินิมอลดูโปรทันที",
    serviceType: "ออกแบบ + ส่งมอบ",
    features: ["Hero + About + Skills", "Gallery ผลงาน", "ฟอร์มติดต่อส่งเข้าอีเมล", "ปรับแต่งธีมได้ง่าย"],
    tags: ["มินิมอล", "1 หน้า"],
  },
];

async function main() {
  // 1) categories
  for (const c of categories) {
    await prisma.category.upsert({
      where: { slug: c.slug },
      update: { name: c.name },
      create: c,
    });
  }

  // 2) add-ons
  for (const a of addOns) {
    await prisma.addOn.upsert({
      where: { code: a.code },
      update: a,
      create: a,
    });
  }

  const allAddOns = await prisma.addOn.findMany();

  // 3) products + link ทุกตัวกับ add-ons ทั้งหมด (เริ่มต้น)
  for (const p of products) {
    const cat = await prisma.category.findUnique({ where: { slug: p.categorySlug } });
    if (!cat) continue;

    const product = await prisma.product.upsert({
      where: { slug: p.slug },
      update: {
        name: p.name,
        image: p.image,
        basePrice: p.basePrice,
        shortDescription: p.shortDescription,
        serviceType: p.serviceType,
        features: JSON.stringify(p.features),
        tags: JSON.stringify(p.tags ?? []),
        categoryId: cat.id,
      },
      create: {
        slug: p.slug,
        name: p.name,
        image: p.image,
        basePrice: p.basePrice,
        shortDescription: p.shortDescription,
        serviceType: p.serviceType,
        features: JSON.stringify(p.features),
        tags: JSON.stringify(p.tags ?? []),
        categoryId: cat.id,
      },
    });

    // link add-ons ทั้งหมด (ลบของเก่าก่อน)
    await prisma.productAddOn.deleteMany({ where: { productId: product.id } });
    await prisma.productAddOn.createMany({
      data: allAddOns.map((a) => ({ productId: product.id, addOnId: a.id })),
    });
  }

  // 4) admin user
  const email = process.env.ADMIN_EMAIL || "apinat.a@intervision.co";
  const password = process.env.ADMIN_PASSWORD || "123456";
  await prisma.adminUser.upsert({
    where: { email },
    update: { passwordHash: hashPassword(password), role: "owner" },
    create: { email, passwordHash: hashPassword(password), name: "Admin", role: "owner" },
  });

  // 5) site settings (single row id=1)
  await prisma.siteSetting.upsert({
    where: { id: 1 },
    update: {},
    create: { id: 1 },
  });

  console.log("✅ Seed done. Admin:", email);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());
