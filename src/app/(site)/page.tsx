import Hero from "@/components/Hero";
import CatalogSection from "@/components/CatalogSection";
import ContactForm from "@/components/ContactForm";
import JsonLd from "@/components/JsonLd";
import { professionalServiceJsonLd } from "@/lib/seo";
import { getCatalog } from "@/lib/catalog";

export default async function HomePage() {
  const products = await getCatalog();
  const minPrice = products.length ? Math.min(...products.map((p) => p.basePrice)) : undefined;
  const jsonLd = await professionalServiceJsonLd(minPrice);

  return (
    <>
      <JsonLd data={jsonLd} />
      <Hero />
      <CatalogSection />
      <ContactForm />
    </>
  );
}
