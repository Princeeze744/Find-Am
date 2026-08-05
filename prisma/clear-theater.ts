import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();

async function main() {
  const fictional = ["chinedu-eze", "ezekiel-amadi", "tamuno-david"];
  const testNames = ["Test Welder", "Test"];

  const toDelete = await prisma.pro.findMany({
    where: {
      OR: [
        { slug: { in: fictional } },
        { name: { in: testNames } },
        { name: { startsWith: "Test " } },
      ],
    },
    select: { id: true, name: true },
  });

  for (const p of toDelete) {
    await prisma.pro.delete({ where: { id: p.id } });
    console.log("RETIRED: " + p.name);
  }

  const testRequests = await prisma.serviceRequest.deleteMany({
    where: { OR: [{ need: { contains: "test", mode: "insensitive" } }, { phone: { contains: "00000" } }] },
  });
  console.log("Test requests removed: " + testRequests.count);

  const remaining = await prisma.pro.findMany({ select: { name: true, status: true } });
  console.log("REMAINING PROS: " + JSON.stringify(remaining));
}

main().catch(console.error).finally(() => prisma.$disconnect());