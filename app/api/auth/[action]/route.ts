import { NextRequest, NextResponse } from "next/server";
import { sql, hasDb } from "@/lib/db";
import { login, logout } from "@/lib/auth";
import bcrypt from "bcryptjs";

// Basic email validator
function isValidEmail(email: string) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ action: string }> } // Await the params
) {
  const { action } = await params;
  
  if (!hasDb() || !sql) {
    return NextResponse.json({ error: "Database not connected" }, { status: 500 });
  }

  try {
    const body = await request.json();

    if (action === "register") {
      const { name, email, password } = body;
      
      if (!name || !email || !password) return NextResponse.json({ error: "Missing fields" }, { status: 400 });
      if (!isValidEmail(email)) return NextResponse.json({ error: "Invalid email" }, { status: 400 });

      // Check if user exists
      const existing = await sql`SELECT user_id FROM users WHERE email = ${email}`;
      if (existing.length > 0) return NextResponse.json({ error: "Email already exists" }, { status: 400 });

      const userId = `USR_${Date.now().toString(16)}_${Math.random().toString(36).slice(2, 6)}`;
      const hash = await bcrypt.hash(password, 10);

      await sql`
        INSERT INTO users (user_id, name, email, password_hash, auth_provider)
        VALUES (${userId}, ${name}, ${email}, ${hash}, 'email')
      `;

      await login(userId, email);
      return NextResponse.json({ success: true, user: { userId, name, email } });
    }

    if (action === "login") {
      const { email, password } = body;
      
      if (!email || !password) return NextResponse.json({ error: "Missing fields" }, { status: 400 });

      const users = await sql`SELECT * FROM users WHERE email = ${email} AND auth_provider = 'email'`;
      if (users.length === 0) return NextResponse.json({ error: "Invalid credentials" }, { status: 401 });

      const user = users[0];
      const isValid = await bcrypt.compare(password, user.password_hash);
      
      if (!isValid) return NextResponse.json({ error: "Invalid credentials" }, { status: 401 });

      await sql`UPDATE users SET last_login = NOW() WHERE user_id = ${user.user_id}`;
      await login(user.user_id, user.email);
      
      return NextResponse.json({ success: true, user: { userId: user.user_id, name: user.name, email: user.email } });
    }

    if (action === "oauth_mock") {
      const { name, email } = body;
      if (!name || !email) return NextResponse.json({ error: "Missing mock data" }, { status: 400 });

      const users = await sql`SELECT * FROM users WHERE email = ${email}`;
      let userId = "";
      
      if (users.length === 0) {
        // Create user
        userId = `USR_${Date.now().toString(16)}_${Math.random().toString(36).slice(2, 6)}`;
        await sql`
          INSERT INTO users (user_id, name, email, auth_provider)
          VALUES (${userId}, ${name}, ${email}, 'google')
        `;
      } else {
        userId = users[0].user_id;
        await sql`UPDATE users SET last_login = NOW() WHERE user_id = ${userId}`;
      }

      await login(userId, email);
      return NextResponse.json({ success: true, user: { userId, name, email } });
    }

    if (action === "logout") {
      await logout();
      return NextResponse.json({ success: true });
    }

    return NextResponse.json({ error: "Invalid action" }, { status: 404 });

  } catch (error: any) {
    console.error(`[Auth API Error - ${action}]:`, error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
