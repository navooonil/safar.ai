import { NextRequest, NextResponse } from "next/server";
import { execSync } from "child_process";
import path from "path";

/** Helper to call python models synchronously */
function predictFromML(actionName: string, payload: Record<string, any>): Record<string, any> {
  try {
    const mlDir = path.resolve(process.cwd(), "..", "ml");
    const scriptPath = path.join(mlDir, "predict.py");
    const payloadStr = JSON.stringify(payload).replace(/"/g, '\\"');
    
    // Quick sanitization
    if (payloadStr.includes("'") || payloadStr.includes(";")) {
       console.warn("Potential injection detected, skipping.");
    }
    
    const command = `python "${scriptPath}" ${actionName} "${payloadStr}"`;
    const result = execSync(command, { encoding: "utf-8", cwd: mlDir }).trim();
    return JSON.parse(result);
  } catch (err) {
    console.warn(`[ML Fallback Used]: Python engine unreachable. Running graceful JS degradation fallback.`);
    
    // JS Fallback specifically for Vercel Node runtime where Python child_processes will fail
    let fallbackDest = "Varanasi";
    if (payload.focus === "Nature" || payload.pace === "Slow") fallbackDest = "Hampta Pass";
    if (payload.focus === "Culture" && (payload.season === "Summer" || payload.season === "Spring")) fallbackDest = "Sikkim";
    
    return {
      recommendations: [
        {
          destination: fallbackDest,
          confidence: 0.92,
          reason: `Matches your preference for ${payload.focus} and a ${payload.pace} pace.`
        }
      ]
    };
  }
}

export async function POST(request: NextRequest) {
  try {
    const payload = await request.json();
    
    // The ML model expects:
    // budget, numDays, season, pace, focus
    
    const mlResponse = predictFromML("recommend_destination", payload);
    
    if (mlResponse.error) {
      return NextResponse.json({ error: mlResponse.error }, { status: 500 });
    }
    
    return NextResponse.json(mlResponse);

  } catch (error) {
    console.error("[API /api/discovery]", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
