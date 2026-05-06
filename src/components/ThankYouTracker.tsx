"use client";

import { useEffect, useRef } from "react";
import { trackLead } from "@/lib/analytics";

/**
 * ยิง Conversion/Lead event ครั้งเดียวเมื่อเปิดหน้า /thank-you
 * ใช้ sessionStorage กัน double-fire กรณี user reload
 */
export default function ThankYouTracker({
  leadId,
  totalPrice,
  productSlug,
  productName,
}: {
  leadId?: string;
  totalPrice: number;
  productSlug?: string;
  productName?: string;
}) {
  const fired = useRef(false);

  useEffect(() => {
    if (fired.current) return;
    fired.current = true;

    const key = leadId ? `ty:${leadId}` : null;
    if (key && typeof window !== "undefined") {
      if (sessionStorage.getItem(key)) return;
      sessionStorage.setItem(key, "1");
    }

    trackLead({
      leadId: leadId || "unknown",
      productSlug,
      productName,
      totalPrice,
    });
  }, [leadId, totalPrice, productSlug, productName]);

  return null;
}
