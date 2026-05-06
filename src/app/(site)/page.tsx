import Hero from "@/components/Hero";
import ProcessSteps from "@/components/ProcessSteps";
import CatalogSection from "@/components/CatalogSection";
import SocialProof from "@/components/SocialProof";
import FAQ from "@/components/FAQ";
import ContactForm from "@/components/ContactForm";
import JsonLd from "@/components/JsonLd";
import { professionalServiceJsonLd } from "@/lib/seo";
import { getCatalog } from "@/lib/catalog";

export const dynamic = "force-dynamic";

export default async function HomePage() {
  const products = await getCatalog();
  const minPrice = products.length ? Math.min(...products.map((p) => p.basePrice)) : undefined;
  const jsonLd = await professionalServiceJsonLd(minPrice);

  return (
    <>
      <JsonLd data={jsonLd} />
      <Hero />
      <ProcessSteps />
      <CatalogSection />
      <SocialProof />
      <FAQ />
      <ContactForm />
    </>
  );
}
