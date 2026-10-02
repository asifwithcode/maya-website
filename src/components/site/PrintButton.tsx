"use client";

export default function PrintButton() {
  return (
    <button
      type="button"
      onClick={() => window.print()}
      className="rounded-full border border-ink/15 bg-card px-5 py-2.5 text-sm font-medium transition hover:border-ink/40 print:hidden"
    >
      Save as PDF
    </button>
  );
}
