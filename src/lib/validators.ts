import { z } from "zod";

/**
 * Schema สำหรับฟอร์ม Lead ฝั่งหน้าบ้าน
 * - phone: รองรับ 08x-xxx-xxxx / +66 / เว้นวรรค / ขีด
 * - website: honeypot field (bot มักจะเผลอกรอก); เว้นว่างเท่านั้น
 */
export const leadSchema = z.object({
  name: z.string().trim().min(2, "กรุณากรอกชื่อ").max(120),
  phone: z
    .string()
    .trim()
    .min(9, "เบอร์โทรไม่ถูกต้อง")
    .max(20)
    .regex(/^[0-9+\-\s()]+$/, "เบอร์โทรไม่ถูกต้อง"),
  email: z
    .string()
    .trim()
    .email("อีเมลไม่ถูกต้อง")
    .max(160)
    .optional()
    .or(z.literal("").transform(() => undefined)),
  message: z.string().trim().max(2000).optional().or(z.literal("").transform(() => undefined)),
  productSlug: z.string().trim().max(120).optional(),
  addOnCodes: z.array(z.string().trim().min(1).max(60)).max(30).default([]),
  totalPrice: z.coerce.number().int().min(0).max(100_000_000).default(0),
  // honeypot — ต้องเว้นว่าง ถ้ามีค่า = บอท
  website: z
    .string()
    .max(0, "spam detected")
    .optional()
    .or(z.literal("").transform(() => undefined)),
});

export type LeadInput = z.infer<typeof leadSchema>;
