import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";

export async function POST(req: Request) {
  try {
    const b = await req.json();
    if (!b.need || String(b.need).trim().length < 3) {
      return NextResponse.json({ error: "Please tell us what you need." }, { status: 400 });
    }
    if (!b.phone || String(b.phone).replace(/[^0-9]/g, "").length < 10) {
      return NextResponse.json({ error: "Please enter a valid phone or WhatsApp number." }, { status: 400 });
    }
    await prisma.serviceRequest.create({
      data: {
        need: String(b.need).trim().slice(0, 500),
        area: String(b.area || "").trim().slice(0, 100),
        phone: String(b.phone).trim().slice(0, 30),
      },
    });
    return NextResponse.json({ ok: true });
  } catch (e) {
    console.error("REQUEST ERROR", e);
    return NextResponse.json({ error: "Something went wrong. Please try again." }, { status: 500 });
  }
}