import { NextResponse } from "next/server";
import { put } from "@vercel/blob";

export async function POST(req: Request) {
  try {
    const form = await req.formData();
    const file = form.get("file") as File | null;
    if (!file) return NextResponse.json({ error: "No file received." }, { status: 400 });
    if (file.size > 4 * 1024 * 1024) {
      return NextResponse.json({ error: "File too large. Please keep it under 4MB." }, { status: 400 });
    }
    if (!file.type.startsWith("image/")) {
      return NextResponse.json({ error: "Please upload an image (photo)." }, { status: 400 });
    }
    const safeName = (file.name || "upload").replace(/[^a-zA-Z0-9.\-_]/g, "_").slice(0, 60);
    const blob = await put(`ids/${Date.now()}-${safeName}`, file, { access: "public", addRandomSuffix: true });
    return NextResponse.json({ ok: true, url: blob.url });
  } catch (e) {
    console.error("UPLOAD ERROR", e);
    return NextResponse.json({ error: "Upload failed. Please try again." }, { status: 500 });
  }
}