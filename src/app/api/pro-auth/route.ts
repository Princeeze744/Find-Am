import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { prisma } from "@/lib/db";
import { waNumber } from "@/lib/phone";

function code6() {
  return String(Math.floor(100000 + Math.random() * 900000));
}

export async function POST(req: Request) {
  try {
    const b = await req.json();
    const action = String(b.action || "");
    const whatsapp = waNumber(b.whatsapp);

    if (whatsapp.length < 10) {
      return NextResponse.json({ error: "Enter the WhatsApp number you registered with." }, { status: 400 });
    }

    const pro = await prisma.pro.findFirst({ where: { whatsapp } });
    if (!pro) {
      return NextResponse.json({ error: "No profile found with this number. Apply on the Join page first." }, { status: 404 });
    }

    if (action === "pin") {
      const supplied = String(b.pin || "").replace(/[^0-9]/g, "");
      if (!pro.pin) {
        return NextResponse.json({ error: "No PIN set for this account yet. Use \u0027Forgot PIN\u0027 below to get a code and set one." }, { status: 400 });
      }
      if (supplied.length !== 4 || supplied !== pro.pin) {
        return NextResponse.json({ error: "Wrong PIN. Check and try again." }, { status: 400 });
      }
      const jar = await cookies();
      jar.set("fa-pro", pro.id, { httpOnly: true, sameSite: "lax", maxAge: 60 * 60 * 24 * 30, path: "/" });
      return NextResponse.json({ ok: true });
    }

    if (action === "request") {
      const otp = code6();
      await prisma.pro.update({
        where: { id: pro.id },
        data: { otpCode: otp, otpExpires: new Date(Date.now() + 10 * 60 * 1000) },
      });
      return NextResponse.json({ ok: true, message: "Code created. Our team will send it to your WhatsApp shortly." });
    }

    if (action === "verify") {
      const supplied = String(b.code || "").trim();
      if (!pro.otpCode || !pro.otpExpires || new Date() > pro.otpExpires) {
        return NextResponse.json({ error: "Code expired. Request a new one." }, { status: 400 });
      }
      if (supplied !== pro.otpCode) {
        return NextResponse.json({ error: "Wrong code. Check and try again." }, { status: 400 });
      }
      const newPin = String(b.newPin || "").replace(/[^0-9]/g, "").slice(0, 4);
      await prisma.pro.update({ where: { id: pro.id }, data: { otpCode: "", otpExpires: null, ...(newPin.length === 4 ? { pin: newPin } : {}) } });
      const jar = await cookies();
      jar.set("fa-pro", pro.id, { httpOnly: true, sameSite: "lax", maxAge: 60 * 60 * 24 * 30, path: "/" });
      return NextResponse.json({ ok: true });
    }

    if (action === "logout") {
      const jar = await cookies();
      jar.delete("fa-pro");
      return NextResponse.json({ ok: true });
    }

    return NextResponse.json({ error: "Unknown action" }, { status: 400 });
  } catch (e) {
    console.error("PRO AUTH ERROR", e);
    return NextResponse.json({ error: "Something went wrong." }, { status: 500 });
  }
}