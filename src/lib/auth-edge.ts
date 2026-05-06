// Edge-safe session verifier (ใช้ใน middleware)
// ใช้ Web Crypto API ที่มีทั้งใน Node และ Edge Runtime

const SECRET = process.env.AUTH_SECRET || "dev-secret-change-me";

async function hmac(payload: string) {
  const enc = new TextEncoder();
  const key = await crypto.subtle.importKey(
    "raw",
    enc.encode(SECRET),
    { name: "HMAC", hash: "SHA-256" },
    false,
    ["sign"],
  );
  const sig = await crypto.subtle.sign("HMAC", key, enc.encode(payload));
  const bytes = new Uint8Array(sig);
  let hex = "";
  for (let i = 0; i < bytes.length; i++) {
    hex += bytes[i].toString(16).padStart(2, "0");
  }
  return hex;
}

function base64UrlDecode(s: string) {
  s = s.replace(/-/g, "+").replace(/_/g, "/");
  while (s.length % 4) s += "=";
  if (typeof atob === "function") return atob(s);
  // fallback (node)
  return Buffer.from(s, "base64").toString();
}

export async function verifySessionTokenEdge(token?: string | null) {
  if (!token) return null;
  const [payload, sig] = token.split(".");
  if (!payload || !sig) return null;
  const expected = await hmac(payload);
  if (expected !== sig) return null;
  try {
    const data = JSON.parse(base64UrlDecode(payload)) as { email: string; exp: number };
    if (Date.now() > data.exp) return null;
    return data;
  } catch {
    return null;
  }
}

export const SESSION_COOKIE = "nc_admin";
