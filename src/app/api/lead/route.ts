import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";

export async function POST(req: Request) {
  try {
    const b = await req.json();
    if (!b.proId) return NextResponse.json({ error: "Missing proId" }, { status: 400 });
    await prisma.lead.create({
      data: {
        proId: String(b.proId),
        source: String(b.source || "whatsapp_tap").slice(0, 50),
      },
    });
    return NextResponse.json({ ok: true });
  } catch (e) {
    console.error("LEAD ERROR", e);
    return NextResponse.json({ ok: false });
  }
}