import crypto from "node:crypto";
import { cookies } from "next/headers";

const SECRET = process.env.AUTH_SECRET || "dev-secret-change-me";
const COOKIE = "nc_admin";
const MAX_AGE = 60 * 60 * 24 * 7; // 7 วัน

function sign(payload: string) {
  return crypto.createHmac("sha256", SECRET).update(payload).digest("hex");
}

export function createSessionToken(email: string) {
  const exp = Date.now() + MAX_AGE * 1000;
  const payload = Buffer.from(JSON.stringify({ email, exp })).toString("base64url");
  const sig = sign(payload);
  return `${payload}.${sig}`;
}

export function verifySessionToken(token?: string | null) {
  if (!token) return null;
  const [payload, sig] = token.split(".");
  if (!payload || !sig) return null;
  if (sign(payload) !== sig) return null;
  try {
    const data = JSON.parse(Buffer.from(payload, "base64url").toString()) as {
      email: string;
      exp: number;
    };
    if (Date.now() > data.exp) return null;
    return data;
  } catch {
    return null;
  }
}

export function setSessionCookie(token: string) {
  cookies().set(COOKIE, token, {
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    path: "/",
    maxAge: MAX_AGE,
  });
}

export function clearSessionCookie() {
  cookies().delete(COOKIE);
}

export function readSessionFromCookies() {
  const token = cookies().get(COOKIE)?.value;
  return verifySessionToken(token);
}

export const SESSION_COOKIE = COOKIE;

/** hash password แบบ scrypt (ใช้เวลา seed/ตั้งรหัส) */
export function hashPassword(password: string) {
  const salt = crypto.randomBytes(16).toString("hex");
  const hash = crypto.scryptSync(password, salt, 64).toString("hex");
  return `${salt}:${hash}`;
}

export function verifyPassword(password: string, stored: string) {
  const [salt, hash] = stored.split(":");
  if (!salt || !hash) return false;
  const check = crypto.scryptSync(password, salt, 64).toString("hex");
  return crypto.timingSafeEqual(Buffer.from(hash), Buffer.from(check));
}
