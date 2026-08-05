import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";

function slugify(name: string) {
  return (
    name.toLowerCase().trim().replace(/[^a-z0-9\s-]/g, "").replace(/\s+/g, "-") +
    "-" + Math.random().toString(36).slice(2, 6)
  );
}

export async function POST(req: Request) {
  try {
    const b = await req.json();

    if (!b.name || !b.phone || !b.whatsapp || !b.categoryId || !b.trade) {
      return NextResponse.json({ error: "Please fill name, phone, WhatsApp, trade and category." }, { status: 400 });
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

    const whatsapp = String(b.whatsapp).replace(/[^0-9]/g, "");

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
        customAreas: String(b.customAreas || "").trim(),
        customTrade: String(b.customTrade || "").trim(),
        status: "pending",
        categoryId: String(b.categoryId),
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