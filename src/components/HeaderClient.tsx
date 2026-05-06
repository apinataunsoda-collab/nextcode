"use client";

import Link from "next/link";
import { useState } from "react";
import type { NavItem } from "@/lib/settings";

export default function HeaderClient({
  name,
  logoUrl,
  nav,
}: {
  name: string;
  logoUrl: string;
  nav: NavItem[];
}) {
  const [open, setOpen] = useState(false);

  const Logo = () =>
    logoUrl ? (
      // eslint-disable-next-line @next/next/no-img-element
      <img src={logoUrl} alt={name} className="h-11 w-auto max-w-[200px] object-contain" />
    ) : (
      <span className="flex items-center gap-2">
        <span className="grid h-10 w-10 place-items-center rounded-xl bg-brand-600 text-white shadow-card">
          <span className="text-xl font-bold">{name.charAt(0) || "N"}</span>
        </span>
        <span className="text-xl font-bold text-slate-900">{name}</span>
      </span>
    );

  return (
    <header className="sticky top-0 z-40 border-b border-slate-200/60 bg-white/80 backdrop-blur">
      <div className="container-page flex h-20 items-center justify-between">
        <Link href="/" className="flex items-center gap-2">
          <Logo />
        </Link>

        <nav className="hidden items-center gap-8 md:flex">
          {nav.map((item) => (
            <Link
              key={`${item.href}-${item.label}`}
              href={item.href}
              className="text-sm font-medium text-slate-600 transition hover:text-brand-700"
            >
              {item.label}
            </Link>
          ))}
          <Link href="/#contact" className="btn-primary">
            ขอใบเสนอราคา
          </Link>
        </nav>

        <button
          type="button"
          aria-label="Toggle menu"
          className="rounded-lg p-2 text-slate-700 md:hidden"
          onClick={() => setOpen((v) => !v)}
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-6 w-6"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            strokeWidth={2}
          >
            {open ? (
              <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
            ) : (
              <path strokeLinecap="round" strokeLinejoin="round" d="M4 6h16M4 12h16M4 18h16" />
            )}
          </svg>
        </button>
      </div>

      {open && (
        <nav className="border-t border-slate-200 bg-white md:hidden">
          <div className="container-page flex flex-col gap-2 py-3">
            {nav.map((item) => (
              <Link
                key={`${item.href}-${item.label}`}
                href={item.href}
                onClick={() => setOpen(false)}
                className="rounded-lg px-3 py-2 text-sm font-medium text-slate-700 hover:bg-slate-100"
              >
                {item.label}
              </Link>
            ))}
            <Link
              href="/#contact"
              onClick={() => setOpen(false)}
              className="btn-primary mt-2 w-full"
            >
              ขอใบเสนอราคา
            </Link>
          </div>
        </nav>
      )}
    </header>
  );
}
