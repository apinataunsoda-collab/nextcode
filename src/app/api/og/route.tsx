import { ImageResponse } from "next/og";
import { NextRequest } from "next/server";

export const runtime = "edge";

export async function GET(req: NextRequest) {
  const { searchParams } = req.nextUrl;
  const title = searchParams.get("title") || "NxtCode Solution";
  const subtitle = searchParams.get("subtitle") || "รับทำเว็บไซต์ เริ่มต้น 4,900 บาท";
  const price = searchParams.get("price") || "";

  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          alignItems: "flex-start",
          padding: "60px 80px",
          background: "linear-gradient(135deg, #0f172a 0%, #1e293b 50%, #0f172a 100%)",
          fontFamily: "sans-serif",
        }}
      >
        {/* Decorative circles */}
        <div
          style={{
            position: "absolute",
            top: "-100px",
            right: "-100px",
            width: "400px",
            height: "400px",
            borderRadius: "50%",
            background: "rgba(47, 137, 255, 0.15)",
          }}
        />
        <div
          style={{
            position: "absolute",
            bottom: "-50px",
            left: "-50px",
            width: "300px",
            height: "300px",
            borderRadius: "50%",
            background: "rgba(47, 137, 255, 0.1)",
          }}
        />

        {/* Logo area */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: "12px",
            marginBottom: "40px",
          }}
        >
          <div
            style={{
              width: "48px",
              height: "48px",
              borderRadius: "12px",
              background: "#2f89ff",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              color: "white",
              fontSize: "24px",
              fontWeight: 700,
            }}
          >
            N
          </div>
          <span style={{ color: "#94a3b8", fontSize: "20px", fontWeight: 600 }}>
            NxtCode Solution
          </span>
        </div>

        {/* Title */}
        <h1
          style={{
            fontSize: "52px",
            fontWeight: 800,
            color: "white",
            lineHeight: 1.2,
            margin: 0,
            maxWidth: "900px",
          }}
        >
          {title}
        </h1>

        {/* Subtitle */}
        <p
          style={{
            fontSize: "24px",
            color: "#94a3b8",
            marginTop: "16px",
            maxWidth: "800px",
            lineHeight: 1.4,
          }}
        >
          {subtitle}
        </p>

        {/* Price badge */}
        {price && (
          <div
            style={{
              marginTop: "32px",
              display: "flex",
              alignItems: "center",
              gap: "12px",
            }}
          >
            <div
              style={{
                background: "#2f89ff",
                color: "white",
                padding: "12px 24px",
                borderRadius: "999px",
                fontSize: "22px",
                fontWeight: 700,
              }}
            >
              เริ่มต้น {price}
            </div>
          </div>
        )}

        {/* Bottom bar */}
        <div
          style={{
            position: "absolute",
            bottom: "40px",
            left: "80px",
            right: "80px",
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
          }}
        >
          <span style={{ color: "#64748b", fontSize: "16px" }}>
            nxtcode.xyz
          </span>
          <div style={{ display: "flex", gap: "16px", color: "#64748b", fontSize: "14px" }}>
            <span>🚀 เสร็จใน 7 วัน</span>
            <span>🔎 รองรับ SEO</span>
            <span>📱 Responsive</span>
          </div>
        </div>
      </div>
    ),
    {
      width: 1200,
      height: 630,
    },
  );
}
