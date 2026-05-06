"use client";

export default function PrintButton() {
  return (
    <button
      onClick={() => window.print()}
      className="btn-primary"
    >
      🖨️ พิมพ์ / บันทึก PDF
    </button>
  );
}
