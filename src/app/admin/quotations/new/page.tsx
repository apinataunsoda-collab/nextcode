import { prisma } from "@/lib/prisma";
import QuotationForm from "@/components/admin/QuotationForm";

export const dynamic = "force-dynamic";

export default async function NewQuotationPage({
  searchParams,
}: {
  searchParams?: { leadId?: string };
}) {
  let leadData = null;

  if (searchParams?.leadId) {
    const lead = await prisma.lead.findUnique({
      where: { id: searchParams.leadId },
      include: { product: true, addOns: true },
    });
    if (lead) {
      leadData = {
        leadId: lead.id,
        customerName: lead.name,
        customerPhone: lead.phone,
        customerEmail: lead.email ?? "",
        productName: lead.product?.name ?? "",
        basePrice: lead.product?.basePrice ?? 0,
        addOns: lead.addOns.map((a) => ({
          label: a.label,
          price: a.priceAtTime,
        })),
        totalPrice: lead.totalPrice,
      };
    }
  }

  return (
    <div>
      <h1 className="mb-6 text-2xl font-bold text-slate-900">สร้างใบเสนอราคา</h1>
      <QuotationForm leadData={leadData} />
    </div>
  );
}
