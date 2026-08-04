import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";

function authorized(req: Request) {
  const key = req.headers.get("x-admin-key") || "";
  return key.length > 0 && key === process.env.ADMIN_KEY;
}

export async function GET(req: Request) {
  if (!authorized(req)) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const [pending, pros, requests, leads, searches] = await Promise.all([
    prisma.pro.findMany({
      where: { status: "pending" },
      orderBy: { createdAt: "desc" },
      include: { category: true, areas: { include: { area: true } } },
    }),
    prisma.pro.findMany({
      where: { status: { not: "pending" } },
      orderBy: { createdAt: "desc" },
      include: { category: true, _count: { select: { leads: true, reviews: true } } },
    }),
    prisma.serviceRequest.findMany({ orderBy: { createdAt: "desc" }, take: 50 }),
    prisma.lead.findMany({ orderBy: { createdAt: "desc" }, take: 50, include: { pro: { select: { name: true } } } }),
    prisma.searchLog.findMany({ orderBy: { createdAt: "desc" }, take: 50 }),
  ]);

  return NextResponse.json({ pending, pros, requests, leads, searches });
}

export async function POST(req: Request) {
  if (!authorized(req)) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const b = await req.json();
  const { action, proId } = b;

  if (action === "approve") {
    const pro = await prisma.pro.update({
      where: { id: String(proId) },
      data: {
        status: "vetted",
        vettedAt: new Date(),
        vettedNotes: String(b.notes || "Reviewed and approved by FindAm team."),
      },
    });
    return NextResponse.json({ ok: true, pro });
  }

  if (action === "reject") {
    const pro = await prisma.pro.update({
      where: { id: String(proId) },
      data: { status: "rejected" },
    });
    return NextResponse.json({ ok: true, pro });
  }

  if (action === "requestStatus") {
    const r = await prisma.serviceRequest.update({
      where: { id: String(b.requestId) },
      data: { status: String(b.status || "open") },
    });
    return NextResponse.json({ ok: true, r });
  }

  return NextResponse.json({ error: "Unknown action" }, { status: 400 });
}