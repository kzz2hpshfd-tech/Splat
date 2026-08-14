import { NextRequest, NextResponse } from "next/server";
import { geocodeZip } from "@/lib/zip";

export async function GET(req: NextRequest) {
  const zip = req.nextUrl.searchParams.get("zip") ?? "";
  const location = await geocodeZip(zip);

  if (!location) {
    return NextResponse.json({ error: "Couldn't find that ZIP code" }, { status: 404 });
  }

  return NextResponse.json(location);
}
