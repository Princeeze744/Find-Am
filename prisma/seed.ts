import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
  const rivers = await prisma.state.upsert({
    where: { slug: "rivers" },
    update: {},
    create: { slug: "rivers", name: "Rivers", isLive: true },
  });

  const areaNames = ["Rumuola", "GRA", "Woji", "Eliozu", "Trans-Amadi", "Peter Odili", "Rumuodara", "Ada George", "Mile 3", "Elelenwo"];
  const areas: Record<string, string> = {};
  for (const name of areaNames) {
    const a = await prisma.area.upsert({
      where: { stateId_name: { stateId: rivers.id, name } },
      update: {},
      create: { name, stateId: rivers.id },
    });
    areas[name] = a.id;
  }

  const cats = [
    { slug: "electricians", name: "Electricians", tags: "wiring,socket,fan,inverter,solar,light,fuse,electric", priceFrom: 3000 },
    { slug: "plumbers", name: "Plumbers", tags: "pipe,leak,tap,toilet,water,pump,drainage,sink", priceFrom: 3500 },
    { slug: "generator-techs", name: "Generator techs", tags: "generator,gen,servicing,carburetor,fuel,engine", priceFrom: 4000 },
    { slug: "ac-technicians", name: "AC technicians", tags: "ac,air conditioner,cooling,gas,split unit,servicing", priceFrom: 4000 },
    { slug: "tailors", name: "Tailors", tags: "sewing,native,suit,amend,fashion,clothes,agbada", priceFrom: 2000 },
    { slug: "cleaners", name: "Cleaners", tags: "cleaning,deep clean,fumigation,compound,office,house", priceFrom: 5000 },
    { slug: "musicians", name: "Musicians", tags: "keyboardist,pianist,drummer,mc,dj,live band,wedding,church", priceFrom: 15000 },
  ];
  const catIds: Record<string, string> = {};
  for (const c of cats) {
    const created = await prisma.category.upsert({
      where: { slug: c.slug },
      update: { tags: c.tags, priceFrom: c.priceFrom },
      create: c,
    });
    catIds[c.slug] = created.id;
  }

  const prosData = [
    {
      slug: "chinedu-eze", name: "Chinedu Eze", phone: "+2340000000001", whatsapp: "2340000000001",
      trade: "Electrician", categoryId: catIds["electricians"],
      tags: "wiring,socket,inverter,solar,fan,fuse box",
      bio: "Nine years wiring homes and shops across Port Harcourt. Known for same-day response and honest pricing.",
      photoUrl: "/images/hero-electrician.png",
      priceGuide: "Fan/socket repair from N3,000|Wiring fault trace from N7,000|Full room wiring: quote after inspection",
      status: "vetted", vettedAt: new Date("2026-08-01"),
      vettedNotes: "Workshop visited. 2 completed jobs inspected. 2 references called. ID confirmed.",
      yearsExp: 9, replyMins: 25, jobsDone: 84,
      areaNames: ["Rumuola", "GRA", "Woji"],
    },
    {
      slug: "ezekiel-amadi", name: "Ezekiel Amadi", phone: "+2340000000002", whatsapp: "2340000000002",
      trade: "Plumber", categoryId: catIds["plumbers"],
      tags: "pipe,leak,pump,toilet,water heater",
      bio: "Plumbing and water systems specialist. If water passes through it, Ezekiel fixes it.",
      photoUrl: "/images/handshake-trust.png",
      priceGuide: "Tap/leak repair from N3,500|Toilet system from N8,000|Pump installation: quote after inspection",
      status: "vetted", vettedAt: new Date("2026-08-02"),
      vettedNotes: "Workshop visited. 2 completed jobs inspected. 2 references called. ID confirmed.",
      yearsExp: 7, replyMins: 15, jobsDone: 57,
      areaNames: ["GRA", "Peter Odili", "Trans-Amadi"],
    },
    {
      slug: "tamuno-david", name: "Tamuno David", phone: "+2340000000003", whatsapp: "2340000000003",
      trade: "Keyboardist", categoryId: catIds["musicians"],
      tags: "keyboardist,pianist,wedding,church,live band,event",
      bio: "Live keyboardist for weddings, church programs and private events across Port Harcourt.",
      photoUrl: "/images/keyboardist-wedding.png",
      priceGuide: "Church program from N15,000|Wedding reception from N40,000|Full band: quote on request",
      status: "vetted", vettedAt: new Date("2026-08-03"),
      vettedNotes: "Performance attended live. 2 references called. ID confirmed.",
      yearsExp: 6, replyMins: 30, jobsDone: 41,
      areaNames: ["GRA", "Woji", "Eliozu"],
    },
  ];

  for (const p of prosData) {
    const { areaNames: pAreas, ...proData } = p;
    const pro = await prisma.pro.upsert({
      where: { slug: p.slug },
      update: {},
      create: { ...proData, stateId: rivers.id },
    });
    for (const areaName of pAreas) {
      await prisma.proArea.upsert({
        where: { proId_areaId: { proId: pro.id, areaId: areas[areaName] } },
        update: {},
        create: { proId: pro.id, areaId: areas[areaName] },
      });
    }
  }

  const chinedu = await prisma.pro.findUnique({ where: { slug: "chinedu-eze" } });
  if (chinedu) {
    const existing = await prisma.review.count({ where: { proId: chinedu.id } });
    if (existing === 0) {
      await prisma.review.create({
        data: {
          proId: chinedu.id, rating: 5, author: "Mrs. Adaeze", area: "Woji", verified: true,
          text: "He came same day, fixed the fault, and the price he said is the price I paid. I have kept his number.",
        },
      });
    }
  }

  console.log("SEED COMPLETE: Rivers live, " + areaNames.length + " areas, " + cats.length + " categories, " + prosData.length + " pros.");
}

main()
  .catch((e) => { console.error(e); process.exit(1); })
  .finally(() => prisma.$disconnect());