import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { prisma } from "@/lib/db";

const EDITABLE = ["photoUrl", "dateOfBirth", "gender", "bio", "tags", "priceGuide", "yearsExp", "videoUrl", "instagram", "facebook", "tiktok", "workPhotos"] as const;

export async function POST(req: Request) {
  try {
    const jar = await cookies();
    const proId = jar.get("fa-pro")?.value;
    if (!proId) return NextResponse.json({ error: "Not signed in." }, { status: 401 });

    const b = await req.json();
    const data: Record<string, string | number> = {};
    for (const key of EDITABLE) {
      if (key in b) {
        data[key] = key === "yearsExp" ? Number(b[key]) || 0 : String(b[key]).slice(0, 2000);
      }
    }
    if (Object.keys(data).length === 0) {
      return NextResponse.json({ error: "Nothing to update." }, { status: 400 });
    }

    await prisma.pro.update({ where: { id: proId }, data });
    return NextResponse.json({ ok: true });
  } catch (e) {
    console.error("PROFILE EDIT ERROR", e);
    return NextResponse.json({ error: "Something went wrong." }, { status: 500 });
  }
}