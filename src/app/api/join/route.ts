import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { waNumber } from "@/lib/phone";

function slugify(name: string) {
  return (
    name.toLowerCase().trim().replace(/[^a-z0-9\s-]/g, "").replace(/\s+/g, "-") +
    "-" + Math.random().toString(36).slice(2, 6)
  );
}

export async function POST(req: Request) {
  try {
    const b = await req.json();

    if (!b.name || !b.phone || !b.whatsapp || !b.trade) {
      return NextResponse.json({ error: "Please fill name, phone, WhatsApp and what you do." }, { status: 400 });
    }
    if (!b.categoryId && !String(b.customTrade || "").trim()) {
      return NextResponse.json({ error: "Choose a category \u2014 or if yours is not listed, type it in the box above the list." }, { status: 400 });
    }
    if ((!Array.isArray(b.areaIds) || b.areaIds.length === 0) && !String(b.customAreas || "").trim()) {
      return NextResponse.json({ error: "Please select or type at least one area you cover." }, { status: 400 });
    }
    if (!b.idType || !b.idNumber || !b.idPhotoUrl) {
      return NextResponse.json({ error: "Identity verification (ID type, number and photo link) is required." }, { status: 400 });
    }

    const state = b.stateId
      ? await prisma.state.findUnique({ where: { id: String(b.stateId) } })
      : await prisma.state.findUnique({ where: { slug: "rivers" } });
    if (!state) {
      return NextResponse.json({ error: "Please choose your state." }, { status: 400 });
    }

    const whatsapp = waNumber(b.whatsapp);

    let categoryId = String(b.categoryId || "");
    if (!categoryId) {
      const fallback = await prisma.category.upsert({
        where: { slug: "more-services" },
        update: {},
        create: { slug: "more-services", name: "More services", tags: "", priceFrom: 0 },
      });
      categoryId = fallback.id;
    }

    const pro = await prisma.pro.create({
      data: {
        slug: slugify(String(b.name)),
        name: String(b.name).trim(),
        phone: String(b.phone).trim(),
        whatsapp,
        trade: String(b.trade).trim(),
        bio: String(b.bio || "").trim(),
        tags: String(b.tags || "").trim(),
        priceGuide: String(b.priceGuide || "").split("\n").map((s: string) => s.trim()).filter(Boolean).join("|"),
        yearsExp: Number(b.yearsExp) || 0,
        videoUrl: String(b.videoUrl || "").trim(),
        instagram: String(b.instagram || "").trim(),
        facebook: String(b.facebook || "").trim(),
        tiktok: String(b.tiktok || "").trim(),
        workPhotos: String(b.workPhotos || "").trim(),
        idType: String(b.idType || "").trim(),
        idNumber: String(b.idNumber || "").trim(),
        idPhotoUrl: String(b.idPhotoUrl || "").trim(),
        idPhotoBackUrl: String(b.idPhotoBackUrl || "").trim(),
        selfieUrl: String(b.selfieUrl || "").trim(),
        photoUrl: String(b.photoUrl || "").trim(),
        customAreas: String(b.customAreas || "").trim(),
        customTrade: String(b.customTrade || "").trim(),
        pin: String(b.pin || "").replace(/[^0-9]/g, "").slice(0, 4),
        dateOfBirth: String(b.dateOfBirth || "").slice(0, 10),
        gender: String(b.gender || "").slice(0, 10),
        status: "pending",
        categoryId,
        stateId: state.id,
        areas: { create: b.areaIds.map((areaId: string) => ({ areaId })) },
      },
    });

    return NextResponse.json({ ok: true, id: pro.id });
  } catch (e) {
    console.error("JOIN ERROR", e);
    return NextResponse.json({ error: "Something went wrong. Please try again." }, { status: 500 });
  }
}