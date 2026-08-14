import { NextRequest, NextResponse } from "next/server";
import { geocodeZip } from "@/lib/zip";
import { generateActivities } from "@/lib/activities";

export async function POST(req: NextRequest) {
  const body = await req.json();
  const { zip, personaId, vibeId, budgetId } = body ?? {};

  const location = await geocodeZip(zip ?? "");
  if (!location) {
    return NextResponse.json({ error: "Couldn't find that ZIP code" }, { status: 404 });
  }
  if (typeof personaId !== "string" || !personaId) {
    return NextResponse.json({ error: "Missing personaId" }, { status: 400 });
  }

  const activities = await generateActivities({ location, personaId, vibeId, budgetId });

  return NextResponse.json({ location, activities });
}
