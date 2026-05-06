// Unified analytics helper — ยิง event ไป GA4 + Meta Pixel + GTM dataLayer พร้อมกัน
// ถ้าไม่ได้ตั้ง env ID ของ provider ไหน ก็ข้ามไปเฉย ๆ ไม่ error

declare global {
  interface Window {
    gtag?: (...args: any[]) => void;
    fbq?: (...args: any[]) => void;
    dataLayer?: any[];
  }
}

export const GA_ID = process.env.NEXT_PUBLIC_GA_ID || "";
export const PIXEL_ID = process.env.NEXT_PUBLIC_META_PIXEL_ID || "";
export const GTM_ID = process.env.NEXT_PUBLIC_GTM_ID || "";

export const isAnalyticsEnabled = Boolean(GA_ID || PIXEL_ID || GTM_ID);

/** ยิง pageview (เรียกจาก AnalyticsRouteListener เมื่อ path เปลี่ยน) */
export function trackPageView(url: string) {
  if (typeof window === "undefined") return;
  if (GA_ID && window.gtag) {
    window.gtag("event", "page_view", { page_path: url });
  }
  if (PIXEL_ID && window.fbq) {
    window.fbq("track", "PageView");
  }
  window.dataLayer?.push({ event: "page_view", page_path: url });
}

type TrackOptions = {
  /** GA4 event params */
  ga?: Record<string, any>;
  /** Meta Pixel params */
  meta?: Record<string, any>;
  /** ชื่อ event ฝั่ง Meta Pixel (ถ้าไม่กำหนดใช้ชื่อเดียวกัน) */
  metaEventName?: string;
  /** ถ้า true = track เป็น standard event ของ Pixel, false = trackCustom */
  metaStandard?: boolean;
};

/**
 * ยิง event ไปทุก provider
 *
 *   track("view_item", {
 *     ga: { item_id: "restaurant", value: 7900 },
 *     meta: { content_ids: ["restaurant"], value: 7900, currency: "THB" },
 *     metaEventName: "ViewContent",
 *     metaStandard: true,
 *   });
 */
export function track(eventName: string, opts: TrackOptions = {}) {
  if (typeof window === "undefined") return;

  // GA4
  if (GA_ID && window.gtag) {
    window.gtag("event", eventName, opts.ga || {});
  }

  // GTM dataLayer
  window.dataLayer?.push({ event: eventName, ...(opts.ga || {}) });

  // Meta Pixel
  if (PIXEL_ID && window.fbq) {
    const fbName = opts.metaEventName || eventName;
    const fbParams = opts.meta || {};
    if (opts.metaStandard ?? Boolean(opts.metaEventName)) {
      window.fbq("track", fbName, fbParams);
    } else {
      window.fbq("trackCustom", fbName, fbParams);
    }
  }
}

// ---------- Pre-defined events (ใช้จากหลายที่ได้) ----------

export function trackViewItem(p: {
  slug: string;
  name: string;
  category: string;
  price: number;
}) {
  track("view_item", {
    ga: {
      currency: "THB",
      value: p.price,
      items: [
        {
          item_id: p.slug,
          item_name: p.name,
          item_category: p.category,
          price: p.price,
          quantity: 1,
        },
      ],
    },
    meta: {
      content_type: "product",
      content_ids: [p.slug],
      content_name: p.name,
      content_category: p.category,
      value: p.price,
      currency: "THB",
    },
    metaEventName: "ViewContent",
    metaStandard: true,
  });
}

export function trackSelectItem(p: {
  slug: string;
  name: string;
  category: string;
  price: number;
  listName?: string;
}) {
  track("select_item", {
    ga: {
      item_list_name: p.listName || "catalog",
      items: [
        {
          item_id: p.slug,
          item_name: p.name,
          item_category: p.category,
          price: p.price,
        },
      ],
    },
    meta: {
      content_ids: [p.slug],
      content_name: p.name,
      content_category: p.category,
      value: p.price,
      currency: "THB",
    },
    metaEventName: "SelectContent",
  });
}

export function trackAddOnToggle(info: {
  productSlug: string;
  addOnCode: string;
  addOnLabel: string;
  price: number;
  selected: boolean;
}) {
  track(info.selected ? "add_to_cart" : "remove_from_cart", {
    ga: {
      currency: "THB",
      value: info.price,
      items: [
        {
          item_id: info.addOnCode,
          item_name: info.addOnLabel,
          item_category: "addon",
          price: info.price,
          quantity: 1,
        },
      ],
      product_slug: info.productSlug,
    },
    meta: {
      content_type: "addon",
      content_ids: [info.addOnCode],
      content_name: info.addOnLabel,
      value: info.price,
      currency: "THB",
    },
    metaEventName: info.selected ? "AddToCart" : undefined,
    metaStandard: info.selected,
  });
}

export function trackFormSubmit(info: {
  productSlug?: string;
  productName?: string;
  addOnCount: number;
  totalPrice: number;
}) {
  track("form_submit", {
    ga: {
      product_slug: info.productSlug,
      product_name: info.productName,
      addon_count: info.addOnCount,
      currency: "THB",
      value: info.totalPrice,
    },
    meta: {
      content_name: info.productName,
      content_ids: info.productSlug ? [info.productSlug] : [],
      num_items: info.addOnCount,
      value: info.totalPrice,
      currency: "THB",
    },
    metaEventName: "SubmitApplication",
    metaStandard: true,
  });
}

export function trackLead(info: {
  leadId: string;
  productSlug?: string;
  productName?: string;
  totalPrice: number;
}) {
  track("generate_lead", {
    ga: {
      transaction_id: info.leadId,
      currency: "THB",
      value: info.totalPrice,
      product_slug: info.productSlug,
      product_name: info.productName,
    },
    meta: {
      content_name: info.productName,
      content_ids: info.productSlug ? [info.productSlug] : [],
      value: info.totalPrice,
      currency: "THB",
    },
    metaEventName: "Lead",
    metaStandard: true,
  });
}
