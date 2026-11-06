export function parsePreorderNote(note: string | null | undefined) {
  const text = note ?? "";
  const phoneMatch = text.match(/Phone:\s*([^|]+)/i);
  const addressMatch = text.match(/Address:\s*([^|]+)/i);
  const locationMatch = text.match(/Location:\s*([^|]+)/i);

  const phone = phoneMatch ? phoneMatch[1].trim() : null;
  const address = addressMatch ? addressMatch[1].trim() : null;
  const location = locationMatch ? locationMatch[1].trim() : null;

  // Clean out parsed fields to get internal admin notes
  let adminNote = text
    .replace(/Phone:\s*[^|]+(\||\b)/i, "")
    .replace(/Address:\s*[^|]+(\||\b)/i, "")
    .replace(/Location:\s*[^|]+(\||\b)/i, "")
    .trim();

  adminNote = adminNote.replace(/^\|\s*|\s*\|$/g, "").trim();

  return { phone, address, location, adminNote };
}

export function formatTaka(amount: number) {
  return "৳" + amount.toLocaleString("en-US");
}
