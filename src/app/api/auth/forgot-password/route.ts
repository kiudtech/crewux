import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";

export async function POST(req: NextRequest) {
  try {
    const { email } = await req.json();

    if (!email) {
      return NextResponse.json({ error: "Email is required" }, { status: 400 });
    }

    // Check if user exists (don't reveal if account exists)
    const user = await db.user.findUnique({ where: { email } });

    if (user) {
      // In production: send email with reset link + token
      // For now, just log it
      console.log(`Password reset requested for: ${email}`);
    }

    // Always return success to prevent email enumeration
    return NextResponse.json({ message: "If an account exists, reset instructions have been sent." });
  } catch (error) {
    console.error("Forgot password error:", error);
    return NextResponse.json({ error: "Something went wrong" }, { status: 500 });
  }
}
