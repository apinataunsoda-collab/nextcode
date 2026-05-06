// In-memory rate limiter (dev-friendly)
// โปรดักชันจริงแนะนำย้ายไป Upstash/Redis

type Bucket = { count: number; resetAt: number };
const buckets = new Map<string, Bucket>();

const WINDOW = Number(process.env.RATE_LIMIT_WINDOW_MS || 60_000);
const MAX = Number(process.env.RATE_LIMIT_MAX || 5);

export function checkRateLimit(key: string) {
  const now = Date.now();
  const b = buckets.get(key);
  if (!b || b.resetAt < now) {
    buckets.set(key, { count: 1, resetAt: now + WINDOW });
    return { ok: true, remaining: MAX - 1, resetAt: now + WINDOW };
  }
  if (b.count >= MAX) {
    return { ok: false, remaining: 0, resetAt: b.resetAt };
  }
  b.count += 1;
  return { ok: true, remaining: MAX - b.count, resetAt: b.resetAt };
}

export function getClientIp(req: Request) {
  const h = req.headers;
  return (
    h.get("x-forwarded-for")?.split(",")[0]?.trim() ||
    h.get("x-real-ip") ||
    "unknown"
  );
}
