import { NextResponse } from "next/server";
import { getSession } from "@/lib/auth";
import { sql, hasDb } from "@/lib/db";

export async function GET() {
  if (!hasDb() || !sql) {
    return NextResponse.json({ error: "Database not connected" }, { status: 500 });
  }

  try {
    const session = await getSession();
    if (!session || !session.userId) {
      return NextResponse.json({ session: null }, { status: 200 }); // Not logged in
    }

    const userId = session.userId;

    // Get user details
    const users = await sql`SELECT user_id, name, email FROM users WHERE user_id = ${userId}`;
    if (users.length === 0) {
      return NextResponse.json({ session: null }, { status: 200 });
    }

    const __user = users[0];

    // Get user traits if they exist
    const traits = await sql`SELECT * FROM user_traits WHERE user_id = ${userId}`;
    
    return NextResponse.json({
      session: {
        userId: __user.user_id,
        name: __user.name,
        email: __user.email,
        onboarded: traits.length > 0, // True if traits exist
        traits: traits.length > 0 ? traits[0] : null,
      }
    }, { status: 200 });

  } catch (error) {
    console.error("[Session/Me Check Error]:", error);
    return NextResponse.json({ error: "Internal error" }, { status: 500 });
  }
}
