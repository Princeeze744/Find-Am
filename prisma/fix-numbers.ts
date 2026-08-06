import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();
function wa(raw: string) {
  let n = String(raw || "").replace(/[^0-9]/g, "");
  if (n.startsWith("0")) n = "234" + n.slice(1);
  return n;
}
async function main() {
  const pros = await prisma.pro.findMany({ select: { id: true, name: true, whatsapp: true } });
  for (const p of pros) {
    const fixed = wa(p.whatsapp);
    if (fixed !== p.whatsapp) {
      await prisma.pro.update({ where: { id: p.id }, data: { whatsapp: fixed } });
      console.log(`FIXED: ${p.name} ${p.whatsapp} -> ${fixed}`);
    }
  }
  console.log("Done.");
}
main().catch(console.error).finally(() => prisma.$disconnect());