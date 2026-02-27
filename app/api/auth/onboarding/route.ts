import { NextRequest, NextResponse } from "next/server";
import { sql, hasDb } from "@/lib/db";
import { getSession } from "@/lib/auth";

export async function POST(request: NextRequest) {
  if (!hasDb() || !sql) {
    return NextResponse.json({ error: "Database not connected" }, { status: 500 });
  }

  try {
    const session = await getSession();
    if (!session || !session.userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await request.json();
    const { travel_style, budget_comfort, group_type, interests } = body;

    // Inference logic based on explicit traits
    const inferred_pace = (travel_style === "adventure" || travel_style === "fast") ? "Fast" : "Slow";
    const inferred_bias = (budget_comfort === "premium") ? "Comfort" : "Experience";

    const interestsJson = JSON.stringify(interests || []);

    // Upsert user traits
    await sql`
      INSERT INTO user_traits (user_id, travel_style, budget_comfort, group_type, interests, inferred_pace, inferred_bias, updated_at)
      VALUES (${session.userId}, ${travel_style}, ${budget_comfort}, ${group_type}, ${interestsJson}::jsonb, ${inferred_pace}, ${inferred_bias}, NOW())
      ON CONFLICT (user_id) DO UPDATE 
      SET travel_style = EXCLUDED.travel_style,
          budget_comfort = EXCLUDED.budget_comfort,
          group_type = EXCLUDED.group_type,
          interests = EXCLUDED.interests,
          inferred_pace = EXCLUDED.inferred_pace,
          inferred_bias = EXCLUDED.inferred_bias,
          updated_at = NOW();
    `;

    return NextResponse.json({ success: true, inferred_pace, inferred_bias });

  } catch (error) {
    console.error("[Onboarding API Error]:", error);
    return NextResponse.json({ error: "Internal error updating traits" }, { status: 500 });
  }
}
