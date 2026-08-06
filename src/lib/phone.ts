// Normalizes Nigerian phone numbers to wa.me-ready international format.
// "08031234567" -> "2348031234567" · "+234 803..." -> "2348..." · already-234 passes through.
export function waNumber(raw: string): string {
  let n = String(raw || "").replace(/[^0-9]/g, "");
  if (n.startsWith("0")) n = "234" + n.slice(1);
  if (n.startsWith("234234")) n = n.slice(3);
  return n;
}