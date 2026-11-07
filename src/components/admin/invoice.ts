import type { Order } from "./lib";

/* Code 128, set B: printable ASCII as bars, for order and tracking numbers. */
const PATTERNS = [
  "212222", "222122", "222221", "121223", "121322", "131222", "122213", "122312", "132212", "221213",
  "221312", "231212", "112232", "122132", "122231", "113222", "123122", "123221", "223211", "221132",
  "221231", "213212", "223112", "312131", "311222", "321122", "321221", "312212", "322112", "322211",
  "212123", "212321", "232121", "111323", "131123", "131321", "112313", "132113", "132311", "211313",
  "231113", "231311", "112133", "112331", "132131", "113123", "113321", "133121", "313121", "211331",
  "231131", "213113", "213311", "213131", "311123", "311321", "331121", "312113", "312311", "332111",
  "314111", "221411", "431111", "111224", "111422", "121124", "121421", "141122", "141221", "112214",
  "112412", "122114", "122411", "142112", "142211", "241211", "221114", "413111", "241112", "134111",
  "111242", "121142", "121241", "114212", "124112", "124211", "411212", "421112", "421211", "212141",
  "214121", "412121", "111143", "111341", "131141", "114113", "114311", "411113", "411311", "113141",
  "114131", "311141", "411131", "211412", "211214", "211232", "2331112",
];
export const CODE128_PATTERNS = PATTERNS;

/** Bar/space widths (in modules) for `text`, start B through stop. */
export function code128Modules(text: string): number[] {
  const safe = [...text].filter((ch) => ch.charCodeAt(0) >= 32 && ch.charCodeAt(0) <= 126).join("");
  const values = [104, ...[...safe].map((ch) => ch.charCodeAt(0) - 32)];
  const check = values.reduce((sum, v, i) => sum + v * (i === 0 ? 1 : i), 0) % 103;
  return [...values, check, 106].flatMap((v) => [...PATTERNS[v]].map(Number));
}

export function code128Svg(text: string, heightMm: number, widthMm: number): string {
  const mods = code128Modules(text);
  const quiet = 10;
  const total = mods.reduce((a, b) => a + b, 0) + quiet * 2;
  let x = quiet;
  let rects = "";
  mods.forEach((w, i) => {
    if (i % 2 === 0) rects += `<rect x="${x}" y="0" width="${w}" height="100"/>`;
    x += w;
  });
  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${total} 100" preserveAspectRatio="none" style="width:${widthMm}mm;height:${heightMm}mm;display:block">${rects}</svg>`;
}

/* Printable documents. */

export type Sender = { name: string; address: string; phone: string; email: string };

const esc = (s: string) => s.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;");
const tk = (n: number) => "৳" + (n ?? 0).toLocaleString("en-IN");
export const orderRef = (id: number) => `MAYA-${String(id).padStart(4, "0")}`;
const day = (iso: string) =>
  new Date(iso).toLocaleDateString("en-GB", { day: "numeric", month: "short", year: "numeric", timeZone: "Asia/Dhaka" });
const zone = (o: Order) => (o.location === "outside" ? "Outside Dhaka" : "Inside Dhaka");
const contact = (f: Sender) => [f.phone, f.email].filter(Boolean).join("  ·  ");
const SITE = "themaya.site";

const FONTS =
  '<link rel="preconnect" href="https://fonts.googleapis.com"><link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>' +
  '<link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800&family=Hind+Siliguri:wght@400;500;600;700&display=swap" rel="stylesheet">';

/** What is in the box, for the invoice line. */
function contents(o: Order) {
  return /collector/i.test(o.variant)
    ? "Maya robot (assembled), all 6 snap-on accessories, all 6 mini keychains, USB-C cable"
    : "Maya robot (assembled), snap-on accessory, matching mini keychain, USB-C cable";
}

function a4(o: Order, itemName: string, from: Sender, logo: string): string {
  const due = Math.max(0, o.total - o.paid);
  const ref = orderRef(o.id);
  const paidUp = due === 0 && o.total > 0;
  const subtotal = o.unitPrice * o.qty;
  return `<!doctype html><html lang="en"><head><meta charset="utf-8"><title>Invoice ${ref} · ${esc(from.name)}</title>${FONTS}<style>
@page{size:A4;margin:0}
*{box-sizing:border-box}
html,body{margin:0;background:#fff}
body{font-family:Inter,"Hind Siliguri",system-ui,sans-serif;color:#1d1d1f;font-size:10pt;line-height:1.45;-webkit-print-color-adjust:exact;print-color-adjust:exact}
.page{width:210mm;min-height:297mm;padding:0 16mm 14mm;display:flex;flex-direction:column;background:#fff}
.bar{height:5mm;margin:0 -16mm;background:linear-gradient(90deg,#0071e3,#5e5ce6)}
.head{display:flex;justify-content:space-between;align-items:flex-start;padding-top:11mm}
.brand{display:flex;gap:4mm;align-items:center}
.brand img{width:15mm;height:15mm;border-radius:3.5mm}
.brand b{display:block;font-size:17pt;font-weight:800;letter-spacing:-.02em}
.brand span{color:#6e6e73;font-size:9pt}
.title{text-align:right}
.title h1{margin:0;font-size:26pt;font-weight:800;letter-spacing:.08em;color:#0071e3}
.title .ref{font-size:11pt;font-weight:600;margin-top:1mm}
.title svg{margin:2.5mm 0 0 auto}
.from{margin-top:5mm;color:#6e6e73;font-size:9pt}
.meta{display:grid;grid-template-columns:repeat(4,1fr);margin-top:8mm;border:1px solid #e5e5ea;border-radius:3mm;overflow:hidden}
.meta div{padding:3mm 4mm;border-right:1px solid #e5e5ea}
.meta div:last-child{border-right:0}
.k{display:block;font-size:7.5pt;font-weight:600;letter-spacing:.08em;text-transform:uppercase;color:#86868b;margin-bottom:.8mm}
.v{font-weight:600}
.badge{display:inline-block;padding:.6mm 2.6mm;border-radius:10mm;font-size:8.5pt;font-weight:700}
.badge.due{background:#fff4e5;color:#a35200}
.badge.ok{background:#e7f6ea;color:#1d7a33}
.cards{display:grid;grid-template-columns:1fr 1fr;gap:5mm;margin-top:6mm}
.card{background:#f5f5f7;border-radius:3mm;padding:4.5mm 5mm}
.card .name{font-size:12pt;font-weight:700;margin-bottom:.8mm}
.muted{color:#6e6e73}
table{width:100%;border-collapse:collapse;margin-top:8mm}
th{font-size:7.5pt;font-weight:600;letter-spacing:.08em;text-transform:uppercase;color:#86868b;text-align:left;padding:0 3mm 2.5mm;border-bottom:1.5px solid #1d1d1f}
td{padding:4mm 3mm;border-bottom:1px solid #e5e5ea;vertical-align:top}
.r{text-align:right}
.item{font-weight:600;font-size:11pt}
.sub{color:#6e6e73;font-size:8.5pt;margin-top:1mm}
.sum{display:flex;justify-content:space-between;gap:10mm;margin-top:7mm}
.note{flex:1;font-size:9pt;color:#424245}
.note b{color:#1d1d1f}
.totals{width:78mm}
.totals div{display:flex;justify-content:space-between;padding:1.6mm 0}
.totals .grand{border-top:1.5px solid #1d1d1f;margin-top:1.5mm;padding-top:3mm;font-size:13pt;font-weight:800}
.amount{margin-top:3mm;border-radius:3mm;padding:4mm 5mm !important;align-items:center;background:#0071e3;color:#fff}
.amount.ok{background:#1d7a33}
.amount span{font-size:9pt;font-weight:600;letter-spacing:.04em;text-transform:uppercase;opacity:.9}
.amount b{font-size:17pt;font-weight:800}
.foot{margin-top:auto;padding-top:8mm;border-top:1px solid #e5e5ea;display:flex;justify-content:space-between;gap:6mm;font-size:8.5pt;color:#86868b}
@media screen{body{background:#e8e8ed}.page{margin:8mm auto;box-shadow:0 2mm 8mm rgba(0,0,0,.12)}}
</style></head><body><div class="page">
<div class="bar"></div>
<div class="head">
  <div>
    <div class="brand"><img src="${logo}" alt=""><div><b>${esc(from.name)}</b><span>Maya · Desk companion robot</span></div></div>
    <div class="from">${esc(from.address)}${contact(from) ? "<br>" + esc(contact(from)) : ""}<br>${SITE}</div>
  </div>
  <div class="title"><h1>INVOICE</h1><div class="ref">${ref}</div>${code128Svg(ref, 10, 52)}</div>
</div>
<div class="meta">
  <div><span class="k">Invoice no.</span><span class="v">${ref}</span></div>
  <div><span class="k">Order date</span><span class="v">${day(o.createdAt)}</span></div>
  <div><span class="k">Payment</span><span class="v">Cash on delivery</span></div>
  <div><span class="k">Status</span><span class="badge ${paidUp ? "ok" : "due"}">${paidUp ? "PAID" : o.paid ? "PART PAID" : "PAYMENT DUE"}</span></div>
</div>
<div class="cards">
  <div class="card"><span class="k">Bill &amp; ship to</span><div class="name">${esc(o.name)}</div>${esc(o.phone)}${o.email ? "<br>" + esc(o.email) : ""}<br>${esc(o.address)}<br><span class="muted">${zone(o)}</span></div>
  <div class="card"><span class="k">Shipment</span>
    <div>Courier: <b>${esc(o.courier || "To be assigned")}</b></div>
    <div>Tracking no.: <b>${esc(o.trackingNo || "—")}</b></div>
    <div>Delivery zone: ${zone(o)}</div>
    <div>Boxes: ${o.qty}</div>
  </div>
</div>
<table>
  <thead><tr><th style="width:52%">Description</th><th class="r">Qty</th><th class="r">Unit price</th><th class="r">Amount</th></tr></thead>
  <tbody><tr><td><div class="item">${esc(itemName)}</div><div class="sub">${contents(o)}</div></td><td class="r">${o.qty}</td><td class="r">${tk(o.unitPrice)}</td><td class="r">${tk(subtotal)}</td></tr>
  <tr><td><div class="item">Delivery</div><div class="sub">${zone(o)}${o.courier ? " · " + esc(o.courier) : ""}</div></td><td class="r">1</td><td class="r">${tk(o.delivery)}</td><td class="r">${tk(o.delivery)}</td></tr></tbody>
</table>
<div class="sum">
  <div class="note"><b>Thank you for choosing Maya.</b><br>Please check the box when it arrives. To set Maya up, install the Maya app from ${SITE}/app and follow the guide at ${SITE}/docs.${contact(from) ? "<br>Questions about this order: " + esc(contact(from)) : ""}</div>
  <div class="totals">
    <div><span class="muted">Subtotal</span><span>${tk(subtotal)}</span></div>
    <div><span class="muted">Delivery</span><span>${tk(o.delivery)}</span></div>
    <div class="grand"><span>Total</span><span>${tk(o.total)}</span></div>
    <div><span class="muted">Paid</span><span>${tk(o.paid)}</span></div>
    <div class="amount ${paidUp ? "ok" : ""}"><span>${paidUp ? "Fully paid" : "Amount due (COD)"}</span><b>${tk(due)}</b></div>
  </div>
</div>
<div class="foot"><span>${esc(from.name)} · ${esc(from.address)} · ${SITE}</span><span>Computer-generated invoice, no signature needed.</span></div>
</div></body></html>`;
}

function boxLabel(o: Order, itemName: string, from: Sender, logo: string): string {
  const due = Math.max(0, o.total - o.paid);
  const ref = orderRef(o.id);
  const code = o.trackingNo || ref;
  return `<!doctype html><html lang="en"><head><meta charset="utf-8"><title>Label ${ref}</title>${FONTS}<style>
@page{size:100mm 150mm;margin:0}
*{box-sizing:border-box}
html,body{margin:0;background:#fff}
body{font-family:Inter,"Hind Siliguri",system-ui,sans-serif;color:#000;font-size:9pt;line-height:1.3;-webkit-print-color-adjust:exact;print-color-adjust:exact}
.l{width:100mm;height:150mm;padding:4mm;display:flex;flex-direction:column;gap:2.5mm;overflow:hidden;background:#fff}
.top{display:flex;justify-content:space-between;align-items:center;border-bottom:2px solid #000;padding-bottom:2mm}
.brand{display:flex;gap:2mm;align-items:center}
.brand img{width:8mm;height:8mm;border-radius:2mm;filter:grayscale(1) contrast(1.2)}
.brand b{font-size:11pt;font-weight:800;display:block;line-height:1.05}
.brand span{font-size:7pt}
.ref{text-align:right;font-weight:800;font-size:11pt;line-height:1.1}
.ref span{display:block;font-size:6.5pt;font-weight:700;letter-spacing:.12em}
.k{display:block;font-size:6.5pt;font-weight:700;letter-spacing:.12em;text-transform:uppercase;margin-bottom:.5mm}
.to .name{font-size:15pt;font-weight:800;line-height:1.1}
.to .phone{font-size:14pt;font-weight:800;margin:.8mm 0;letter-spacing:.02em}
.to .addr{font-size:10pt}
.zone{display:inline-block;margin-top:1mm;border:1.5px solid #000;border-radius:5mm;padding:.2mm 2.5mm;font-size:8pt;font-weight:700}
.grid{display:grid;grid-template-columns:1fr 1fr;border:1.5px solid #000;border-radius:2mm}
.grid div{padding:1.6mm 2.2mm}
.grid div:nth-child(odd){border-right:1.5px solid #000}
.grid div:nth-child(-n+2){border-bottom:1.5px solid #000}
.grid b{font-size:9.5pt}
.cod{background:#000;color:#fff;border-radius:2mm;padding:2.2mm 3mm;display:flex;justify-content:space-between;align-items:center}
.cod span{font-size:8pt;font-weight:700;letter-spacing:.08em;text-transform:uppercase}
.cod b{font-size:20pt;font-weight:800}
.cod.ok{background:#fff;color:#000;border:2px solid #000}
.bc{text-align:center}
.bc svg{margin:0 auto}
.bc div{font-family:ui-monospace,Consolas,monospace;font-size:10pt;font-weight:700;letter-spacing:.1em;margin-top:.8mm}
.from{margin-top:auto;border-top:1.5px dashed #000;padding-top:1.8mm;font-size:7.5pt}
@media screen{body{background:#e8e8ed}.l{margin:8mm auto;box-shadow:0 2mm 8mm rgba(0,0,0,.15)}}
</style></head><body><div class="l">
<div class="top"><div class="brand"><img src="${logo}" alt=""><div><b>${esc(from.name)}</b><span>Maya desk robot · ${SITE}</span></div></div><div class="ref"><span>ORDER</span>${ref}</div></div>
<div class="to"><span class="k">Deliver to</span><div class="name">${esc(o.name)}</div><div class="phone">${esc(o.phone)}</div><div class="addr">${esc(o.address)}</div><span class="zone">${zone(o)}</span></div>
<div class="grid">
  <div><span class="k">Courier</span><b>${esc(o.courier || "—")}</b></div>
  <div><span class="k">Order date</span><b>${day(o.createdAt)}</b></div>
  <div><span class="k">Contents</span><b>${esc(itemName)}</b></div>
  <div><span class="k">Boxes</span><b>${o.qty}</b></div>
</div>
<div class="cod ${due === 0 ? "ok" : ""}"><span>${due === 0 ? "Paid · collect nothing" : "Cash to collect"}</span><b>${tk(due)}</b></div>
<div class="bc">${code128Svg(code, 15, 86)}<div>${esc(code)}</div></div>
<div class="from"><span class="k">From / return to</span>${esc(from.name)}, ${esc(from.address)}${from.phone ? " · " + esc(from.phone) : ""}</div>
</div></body></html>`;
}

/** The documents as HTML, for printing or for checking the layout. */
export function invoiceHtml(kind: "a4" | "label", o: Order, itemName: string, from: Sender, origin: string): string {
  const logo = `${origin}/icon.png`;
  return kind === "a4" ? a4(o, itemName, from, logo) : boxLabel(o, itemName, from, logo);
}

/** Opens the A4 invoice or the 100 × 150 mm box label in a new tab and prints it once fonts and logo are in (Save as PDF works too). */
export function printInvoice(kind: "a4" | "label", o: Order, itemName: string, from: Sender): boolean {
  const w = window.open("", "_blank");
  if (!w) return false;
  w.document.open();
  w.document.write(invoiceHtml(kind, o, itemName, from, window.location.origin));
  w.document.close();
  let printed = false;
  const go = () => {
    if (printed) return;
    printed = true;
    try {
      w.focus();
      w.print();
    } catch {}
  };
  const imgs = Array.from(w.document.images).map((im) =>
    im.complete ? Promise.resolve() : new Promise<void>((r) => (im.onload = im.onerror = () => r())),
  );
  Promise.all([w.document.fonts?.ready ?? Promise.resolve(), ...imgs]).then(() => setTimeout(go, 100));
  setTimeout(go, 2500); // never wait forever on a slow font
  return true;
}

