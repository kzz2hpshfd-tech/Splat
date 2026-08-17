import { NextRequest, NextResponse } from "next/server";
import { generateConcepts } from "@/lib/generate";
import { STYLES, StyleKey } from "@/lib/styles";

// Next.js 14 force-caches any fetch() by default, including the Anthropic SDK's
// outbound call — without this, every generation after the first returns the
// same cached response regardless of prompt/style.
export const dynamic = "force-dynamic";

export async function POST(req: NextRequest) {
  const body = await req.json();
  const { prompt, styleKey } = body ?? {};

  if (typeof prompt !== "string" || !prompt.trim()) {
    return NextResponse.json({ error: "Tell me what you want to draw" }, { status: 400 });
  }
  if (typeof styleKey !== "string" || !STYLES.some((s) => s.key === styleKey)) {
    return NextResponse.json({ error: "Missing or invalid styleKey" }, { status: 400 });
  }

  const { concepts, source, reason } = await generateConcepts(prompt.trim(), styleKey as StyleKey);

  return NextResponse.json({ concepts, source, reason });
}
