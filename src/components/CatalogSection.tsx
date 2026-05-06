import { getCatalog } from "@/lib/catalog";
import CatalogExplorer from "./CatalogExplorer";

export default async function CatalogSection() {
  const products = await getCatalog();

  if (products.length === 0) {
    return (
      <section id="catalog" className="py-20">
        <div className="container-page text-center text-slate-500">
          ยังไม่มีแบบเว็บในระบบ — ตั้งค่าได้จาก /admin/products
        </div>
      </section>
    );
  }

  return <CatalogExplorer products={products} />;
}
