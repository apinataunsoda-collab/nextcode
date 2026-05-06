import { getSiteSettings } from "@/lib/settings";
import HeaderClient from "./HeaderClient";

export default async function Header() {
  const s = await getSiteSettings();
  return (
    <HeaderClient
      name={s.name}
      logoUrl={s.logoUrl}
      nav={s.nav}
    />
  );
}
