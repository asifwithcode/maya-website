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
const tk = (n: number) => "Tk " + (n ?? 0).toLocaleString("en-IN");
export const orderRef = (id: number) => `MAYA-${String(id).padStart(4, "0")}`;
const day = (iso: string) =>
  new Date(iso).toLocaleDateString("en-GB", { day: "numeric", month: "short", year: "numeric", timeZone: "Asia/Dhaka" });

function a4(o: Order, itemName: string, from: Sender): string {
  const due = Math.max(0, o.total - o.paid);
  const ref = orderRef(o.id);
  return `<!doctype html><html><head><meta charset="utf-8"><title>Invoice ${ref}</title><style>
@page{size:A4;margin:16mm}*{box-sizing:border-box}body{font-family:Inter,"Hind Siliguri",Arial,sans-serif;color:#1d1d1f;font-size:10.5pt;margin:0}
.top{display:flex;justify-content:space-between;align-items:flex-start}.brand{font-size:20pt;font-weight:700}.muted{color:#6e6e73}
h1{font-size:24pt;margin:0;text-align:right}.lbl{font-size:8pt;text-transform:uppercase;letter-spacing:.06em;color:#86868b;margin-bottom:2mm}
.boxes{display:flex;gap:8mm;margin:10mm 0}.box{flex:1;border:1px solid #d2d2d7;border-radius:3mm;padding:4mm}
table{width:100%;border-collapse:collapse;margin-top:4mm}th,td{padding:3mm 2mm;border-bottom:1px solid #e5e5ea;text-align:left}th{font-size:8.5pt;color:#6e6e73;font-weight:600}
.r{text-align:right}.tot td{border:none;padding:1.5mm 2mm}.grand td{font-size:13pt;font-weight:700;border-top:2px solid #1d1d1f}
.foot{margin-top:14mm;font-size:9pt;color:#6e6e73}</style></head><body>
<div class="top"><div><div class="brand">${esc(from.name)}</div><div class="muted">${esc(from.address)}<br>${esc([from.phone, from.email].filter(Boolean).join(" · "))}</div></div>
<div><h1>INVOICE</h1><div class="r muted">${ref}<br>${day(o.createdAt)}</div>${code128Svg(ref, 12, 55)}</div></div>
<div class="boxes"><div class="box"><div class="lbl">Bill / ship to</div><b>${esc(o.name)}</b><br>${esc(o.phone)}${o.email ? "<br>" + esc(o.email) : ""}<br>${esc(o.address)}<br><span class="muted">${o.location === "outside" ? "Outside Dhaka" : "Inside Dhaka"}</span></div>
<div class="box"><div class="lbl">Delivery</div>Payment: Cash on delivery${o.paid ? " (part paid)" : ""}<br>Courier: ${esc(o.courier || "—")}<br>Tracking: ${esc(o.trackingNo || "—")}<br>Status: ${esc(o.status.replace(/_/g, " "))}</div></div>
<table><thead><tr><th>Item</th><th class="r">Qty</th><th class="r">Unit price</th><th class="r">Amount</th></tr></thead><tbody>
<tr><td>${esc(itemName)}<div class="muted" style="font-size:9pt">Maya desk robot, accessory and mini keychain, boxed</div></td><td class="r">${o.qty}</td><td class="r">${tk(o.unitPrice)}</td><td class="r">${tk(o.unitPrice * o.qty)}</td></tr>
</tbody></table>
<table class="tot" style="width:45%;margin-left:auto"><tr><td>Subtotal</td><td class="r">${tk(o.unitPrice * o.qty)}</td></tr><tr><td>Delivery</td><td class="r">${tk(o.delivery)}</td></tr>
<tr class="grand"><td>Total</td><td class="r">${tk(o.total)}</td></tr><tr><td>Paid</td><td class="r">${tk(o.paid)}</td></tr><tr><td><b>Due (COD)</b></td><td class="r"><b>${tk(due)}</b></td></tr></table>
<div class="foot">Thank you for choosing Maya. Questions about this order: ${esc([from.phone, from.email].filter(Boolean).join(" · "))}</div>
</body></html>`;
}

function boxLabel(o: Order, itemName: string, from: Sender): string {
  const due = Math.max(0, o.total - o.paid);
  const ref = orderRef(o.id);
  const code = o.trackingNo || ref;
  return `<!doctype html><html><head><meta charset="utf-8"><title>Label ${ref}</title><style>
@page{size:100mm 150mm;margin:4mm}*{box-sizing:border-box}body{font-family:Inter,"Hind Siliguri",Arial,sans-serif;color:#000;margin:0;font-size:9.5pt}
.sec{border-bottom:1.5px dashed #000;padding:2.5mm 0}.lbl{font-size:7pt;text-transform:uppercase;letter-spacing:.08em}.big{font-size:15pt;font-weight:700;line-height:1.15}
.cod{border:2px solid #000;border-radius:2mm;padding:2mm;text-align:center;margin-top:2mm}.cod b{font-size:20pt;display:block}.row{display:flex;justify-content:space-between;align-items:baseline}
</style></head><body>
<div class="sec row"><span class="big">${esc(from.name)}</span><span>${esc(from.phone)}</span></div>
<div class="sec"><div class="lbl">To</div><div class="big">${esc(o.name)}</div><div style="font-size:12pt;font-weight:700">${esc(o.phone)}</div><div style="margin-top:1mm">${esc(o.address)}</div><div>${o.location === "outside" ? "Outside Dhaka" : "Inside Dhaka"}</div></div>
<div class="sec"><div class="row"><span><span class="lbl">Order</span><br><b>${ref}</b></span><span style="text-align:right"><span class="lbl">Courier</span><br><b>${esc(o.courier || "—")}</b></span></div>
<div style="margin-top:2mm">${esc(itemName)} × ${o.qty}</div>
<div class="cod">Cash to collect<b>${tk(due)}</b></div></div>
<div style="padding-top:3mm">${code128Svg(code, 16, 88)}<div style="text-align:center;font-family:monospace;font-size:10pt;margin-top:1mm">${esc(code)}</div></div>
</body></html>`;
}

/** Opens the A4 invoice or the 100 × 150 mm box label in a new tab and starts printing (Save as PDF works too). */
export function printInvoice(kind: "a4" | "label", o: Order, itemName: string, from: Sender): boolean {
  const w = window.open("", "_blank");
  if (!w) return false;
  w.document.open();
  w.document.write(kind === "a4" ? a4(o, itemName, from) : boxLabel(o, itemName, from));
  w.document.close();
  setTimeout(() => {
    try {
      w.focus();
      w.print();
    } catch {}
  }, 600);
  return true;
}
