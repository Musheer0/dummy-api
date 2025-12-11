import { NextResponse } from "next/server";

// Simple authentication - in production, use proper auth (JWT, sessions, etc.)
const ADMIN_CREDENTIALS = {
  username: "admin",
  password: "admin123", // Change this in production!
};

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { username, password } = body;

    if (!username || !password) {
      return NextResponse.json(
        { success: false, message: "Username and password are required" },
        { status: 400 }
      );
    }

    if (
      username === ADMIN_CREDENTIALS.username &&
      password === ADMIN_CREDENTIALS.password
    ) {
      // In production, generate a JWT token here
      return NextResponse.json({
        success: true,
        message: "Login successful",
        token: "admin-token", // Simple token for demo
      });
    }

    return NextResponse.json(
      { success: false, message: "Invalid credentials" },
      { status: 401 }
    );
  } catch (err) {
    return NextResponse.json(
      { success: false, message: "Invalid request" },
      { status: 400 }
    );
  }
}

