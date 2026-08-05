import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

const nigeria: Record<string, { name: string; areas: string[] }> = {
  "abia": { name: "Abia", areas: ["Umuahia", "Aba", "Ohafia", "Arochukwu"] },
  "adamawa": { name: "Adamawa", areas: ["Yola", "Jimeta", "Mubi", "Numan"] },
  "akwa-ibom": { name: "Akwa Ibom", areas: ["Uyo", "Eket", "Ikot Ekpene", "Oron"] },
  "anambra": { name: "Anambra", areas: ["Awka", "Onitsha", "Nnewi", "Ekwulobia"] },
  "bauchi": { name: "Bauchi", areas: ["Bauchi", "Azare", "Misau", "Jama'are"] },
  "bayelsa": { name: "Bayelsa", areas: ["Yenagoa", "Ogbia", "Brass", "Sagbama"] },
  "benue": { name: "Benue", areas: ["Makurdi", "Gboko", "Otukpo", "Katsina-Ala"] },
  "borno": { name: "Borno", areas: ["Maiduguri", "Biu", "Bama", "Monguno"] },
  "cross-river": { name: "Cross River", areas: ["Calabar", "Ikom", "Ogoja", "Obudu"] },
  "delta": { name: "Delta", areas: ["Asaba", "Warri", "Sapele", "Ughelli", "Agbor"] },
  "ebonyi": { name: "Ebonyi", areas: ["Abakaliki", "Afikpo", "Onueke"] },
  "edo": { name: "Edo", areas: ["Benin City", "Ekpoma", "Auchi", "Uromi"] },
  "ekiti": { name: "Ekiti", areas: ["Ado-Ekiti", "Ikere", "Iworoko", "Efon"] },
  "enugu": { name: "Enugu", areas: ["Enugu", "Nsukka", "Agbani", "Oji River"] },
  "fct-abuja": { name: "FCT Abuja", areas: ["Central Area", "Garki", "Wuse", "Maitama", "Asokoro", "Gwarinpa", "Kubwa", "Lugbe"] },
  "gombe": { name: "Gombe", areas: ["Gombe", "Kumo", "Deba", "Bajoga"] },
  "imo": { name: "Imo", areas: ["Owerri", "Orlu", "Okigwe", "Mbaise"] },
  "jigawa": { name: "Jigawa", areas: ["Dutse", "Hadejia", "Gumel", "Kazaure"] },
  "kaduna": { name: "Kaduna", areas: ["Kaduna", "Zaria", "Kafanchan", "Kachia"] },
  "kano": { name: "Kano", areas: ["Kano Municipal", "Fagge", "Nassarawa", "Tarauni", "Gwale"] },
  "katsina": { name: "Katsina", areas: ["Katsina", "Funtua", "Daura", "Malumfashi"] },
  "kebbi": { name: "Kebbi", areas: ["Birnin Kebbi", "Argungu", "Yauri", "Zuru"] },
  "kogi": { name: "Kogi", areas: ["Lokoja", "Okene", "Idah", "Kabba"] },
  "kwara": { name: "Kwara", areas: ["Ilorin", "Offa", "Omu-Aran", "Jebba"] },
  "lagos": { name: "Lagos", areas: ["Ikeja", "Victoria Island", "Lekki", "Yaba", "Surulere", "Ikorodu", "Ajah", "Festac", "Apapa", "Badagry"] },
  "nasarawa": { name: "Nasarawa", areas: ["Lafia", "Keffi", "Akwanga", "Karu"] },
  "niger": { name: "Niger", areas: ["Minna", "Bida", "Suleja", "Kontagora"] },
  "ogun": { name: "Ogun", areas: ["Abeokuta", "Sagamu", "Ijebu-Ode", "Ota", "Ilaro"] },
  "ondo": { name: "Ondo", areas: ["Akure", "Ondo Town", "Owo", "Okitipupa"] },
  "osun": { name: "Osun", areas: ["Osogbo", "Ile-Ife", "Ilesa", "Ede"] },
  "oyo": { name: "Oyo", areas: ["Ibadan", "Ogbomoso", "Oyo Town", "Iseyin"] },
  "plateau": { name: "Plateau", areas: ["Jos", "Bukuru", "Pankshin", "Shendam"] },
  "rivers": { name: "Rivers", areas: ["Rumuola", "GRA", "Woji", "Eliozu", "Trans-Amadi", "Peter Odili", "Rumuodara", "Ada George", "Mile 3", "Elelenwo", "Diobu", "Borokiri", "Rumuokoro", "Choba", "Eleme"] },
  "sokoto": { name: "Sokoto", areas: ["Sokoto", "Tambuwal", "Gwadabawa", "Illela"] },
  "taraba": { name: "Taraba", areas: ["Jalingo", "Wukari", "Bali", "Gembu"] },
  "yobe": { name: "Yobe", areas: ["Damaturu", "Potiskum", "Gashua", "Nguru"] },
  "zamfara": { name: "Zamfara", areas: ["Gusau", "Kaura Namoda", "Talata Mafara", "Anka"] },
};

async function main() {
  let stateCount = 0;
  let areaCount = 0;

  for (const [slug, s] of Object.entries(nigeria)) {
    const state = await prisma.state.upsert({
      where: { slug },
      update: { name: s.name },
      create: { slug, name: s.name, isLive: slug === "rivers" },
    });
    stateCount++;

    for (const areaName of s.areas) {
      await prisma.area.upsert({
        where: { stateId_name: { stateId: state.id, name: areaName } },
        update: {},
        create: { name: areaName, stateId: state.id },
      });
      areaCount++;
    }
  }

  console.log(`NIGERIA SEEDED: ${stateCount} states, ${areaCount} areas. Rivers is LIVE, rest await their day.`);
}

main()
  .catch((e) => { console.error(e); process.exit(1); })
  .finally(() => prisma.$disconnect());