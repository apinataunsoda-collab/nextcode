import { notFound } from "next/navigation";
import { getProductBySlugFromDb } from "@/lib/catalog";
import ProductDetail from "@/components/ProductDetail";
import JsonLd from "@/components/JsonLd";
import {
  productMetadata,
  softwareApplicationJsonLd,
  breadcrumbJsonLd,
} from "@/lib/seo";

export const dynamic = "force-dynamic";

export async function generateMetadata({ params }: { params: { slug: string } }) {
  const product = await getProductBySlugFromDb(params.slug);
  if (!product) return {};
  return productMetadata(product);
}

export default async function ProductPage({ params }: { params: { slug: string } }) {
  const product = await getProductBySlugFromDb(params.slug);
  if (!product) notFound();
  const [sw, bc] = await Promise.all([
    softwareApplicationJsonLd(product),
    breadcrumbJsonLd(product),
  ]);
  return (
    <>
      <JsonLd data={sw} />
      <JsonLd data={bc} />
      <ProductDetail product={product} />
    </>
  );
}
