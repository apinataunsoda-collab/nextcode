import type { Metadata } from "next";
import "./globals.css";
import { getSiteSettings } from "@/lib/settings";
import Analytics from "@/components/analytics/Analytics";

export async function generateMetadata(): Promise<Metadata> {
  const s = await getSiteSettings();
  const title = `${s.name} | ${s.tagline}`;

  return {
    metadataBase: new URL(s.url),
    title: { default: title, template: `%s | ${s.name}` },
    description: s.description,
    applicationName: s.name,
    authors: [{ name: s.name, url: s.url }],
    creator: s.name,
    publisher: s.name,
    alternates: { canonical: "/" },
    icons: s.faviconUrl
      ? { icon: s.faviconUrl, shortcut: s.faviconUrl, apple: s.faviconUrl }
      : undefined,
    openGraph: {
      type: "website",
      url: s.url,
      title,
      description: s.description,
      siteName: s.name,
      locale: "th_TH",
      images: [{ url: s.logoUrl || "/og-default.png", alt: s.name }],
    },
    twitter: {
      card: "summary_large_image",
      title,
      description: s.description,
      images: [s.logoUrl || "/og-default.png"],
    },
    robots: {
      index: true,
      follow: true,
      googleBot: {
        index: true,
        follow: true,
        "max-image-preview": "large",
        "max-snippet": -1,
      },
    },
    formatDetection: { telephone: true, email: true, address: false },
  };
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="th">
      <head>
        <link
          href="https://fonts.googleapis.com/css2?family=Prompt:wght@300;400;500;600;700&display=swap"
          rel="stylesheet"
        />
      </head>
      <body className="font-sans">
        {children}
        <Analytics />
      </body>
    </html>
  );
}
