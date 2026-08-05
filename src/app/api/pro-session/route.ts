import { NextResponse } from "next/server";
import { cookies } from "next/headers";

export async function GET() {
  const jar = await cookies();
  const proId = jar.get("fa-pro")?.value || null;
  return NextResponse.json({ signedIn: Boolean(proId) });
}