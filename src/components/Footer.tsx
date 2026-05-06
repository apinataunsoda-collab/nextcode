import Link from "next/link";
import { getSiteSettings } from "@/lib/settings";

export default async function Footer() {
  const s = await getSiteSettings();
  const socials = Object.entries(s.social).filter(([, url]) => Boolean(url));

  return (
    <footer className="mt-20 border-t border-slate-200 bg-slate-50">
      <div className="container-page grid gap-10 py-12 md:grid-cols-3">
        <div>
          <div className="flex items-center gap-2">
            {s.logoUrl ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img src={s.logoUrl} alt={s.name} className="h-12 w-auto max-w-[200px] object-contain" />
            ) : (
              <>
                <span className="grid h-10 w-10 place-items-center rounded-xl bg-brand-600 text-white">
                  <span className="text-xl font-bold">{s.name.charAt(0) || "N"}</span>
                </span>
                <span className="text-xl font-bold text-slate-900">{s.name}</span>
              </>
            )}
          </div>
          <p className="mt-3 max-w-sm whitespace-pre-line text-sm text-slate-600">
            {s.footerText || s.tagline}
          </p>
        </div>

        <div>
          <h4 className="text-sm font-semibold text-slate-900">ติดต่อเรา</h4>
          <ul className="mt-3 space-y-2 text-sm text-slate-600">
            {s.address && <li>{s.address}</li>}
            {(s.phone || s.mobile) && (
              <li>
                โทร:{" "}
                {s.phone && (
                  <a href={`tel:${s.phone}`} className="hover:text-brand-700">
                    {s.phone}
                  </a>
                )}
                {s.phone && s.mobile && " / "}
                {s.mobile && (
                  <a href={`tel:${s.mobile}`} className="hover:text-brand-700">
                    {s.mobile}
                  </a>
                )}
              </li>
            )}
            {s.email && (
              <li>
                อีเมล:{" "}
                <a href={`mailto:${s.email}`} className="hover:text-brand-700">
                  {s.email}
                </a>
              </li>
            )}
            {s.lineId && <li>LINE: {s.lineId}</li>}
          </ul>
        </div>

        <div>
          <h4 className="text-sm font-semibold text-slate-900">โซเชียลมีเดีย</h4>
          {socials.length ? (
            <ul className="mt-3 flex flex-wrap gap-3 text-sm">
              {socials.map(([key, url]) => (
                <li key={key}>
                  <Link
                    href={url}
                    target="_blank"
                    rel="noreferrer"
                    className="rounded-full border border-slate-200 px-4 py-1.5 capitalize text-slate-700 transition hover:border-brand-400 hover:text-brand-700"
                  >
                    {key}
                  </Link>
                </li>
              ))}
            </ul>
          ) : (
            <p className="mt-3 text-sm text-slate-400">ยังไม่ได้ตั้งค่าช่องทาง social</p>
          )}
        </div>
      </div>

      <div className="border-t border-slate-200 py-4">
        <p className="container-page text-center text-xs text-slate-500">
          © {new Date().getFullYear()} {s.name}. สงวนลิขสิทธิ์.
        </p>
      </div>
    </footer>
  );
}
