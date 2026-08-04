import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();
async function main() {
  const r = await prisma.pro.update({
    where: { slug: "ezekiel-amadi" },
    data: { photoUrl: "/images/plumber-portrait.jpeg" },
  });
  console.log("UPDATED: " + r.name + " -> " + r.photoUrl);
}
main().catch(console.error).finally(() => prisma.$disconnect());