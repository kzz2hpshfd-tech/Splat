import { NextRequest, NextResponse } from "next/server";
import { geocodeZip } from "@/lib/zip";
import { generateActivities } from "@/lib/activities";

// Next.js 14 force-caches any fetch() by default, including the Anthropic SDK's
// outbound call — without this, every search after the first returns the same
// cached response regardless of ZIP/persona/vibe/budget.
export const dynamic = "force-dynamic";

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

  const { activities, source, reason } = await generateActivities({ location, personaId, vibeId, budgetId });

  // Full error text (billing/quota/auth details) stays in server logs only —
  // the client only ever sees the safe, generic "no key configured" case.
  const publicReason = reason === "no ANTHROPIC_API_KEY set" ? reason : undefined;

  return NextResponse.json({ location, activities, source, reason: publicReason });
}
