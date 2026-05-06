// แก้ไขข้อมูลบริษัท / social ได้ที่ไฟล์นี้
export const siteConfig = {
  name: "NextCode",
  url:
    process.env.NEXT_PUBLIC_SITE_URL ||
    "https://nextcode.co.th", // ใช้ใน canonical, OG, sitemap
  tagline: "เว็บราคาประหยัด รองรับ SEO ด้วยขุมพลัง AI",
  description:
    "รับทำเว็บไซต์ธุรกิจครบวงจร ออกแบบสวย โหลดเร็ว รองรับ SEO ด้วย AI ในราคาที่เจ้าของกิจการจับต้องได้",
  contact: {
    address: "123/45 ถนนสุขุมวิท แขวงคลองเตย เขตคลองเตย กรุงเทพฯ 10110",
    phone: "02-000-0000",
    mobile: "081-234-5678",
    email: "hello@nextcode.co.th",
    lineId: "@nextcode",
  },
  social: {
    facebook: "https://facebook.com/nextcode",
    instagram: "https://instagram.com/nextcode",
    tiktok: "https://tiktok.com/@nextcode",
    youtube: "https://youtube.com/@nextcode",
  },
  nav: [
    { label: "หน้าแรก", href: "/#home" },
    { label: "แคตตาล็อก", href: "/#catalog" },
    { label: "ติดต่อเรา", href: "/#contact" },
  ],
};
