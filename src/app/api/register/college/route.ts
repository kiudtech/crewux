import { NextRequest, NextResponse } from "next/server";
import { hash } from "bcryptjs";
import { db } from "@/lib/db";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();

    const {
      collegeName,
      officialEmail,
      password,
      contactPerson,
      website,
      city,
      state,
      affiliatedUniversity,
      otp
    } = body;

    // Validate required fields
    if (!collegeName || !officialEmail || !password || !contactPerson || !otp) {
      return NextResponse.json(
        { error: "Required fields missing" },
        { status: 400 }
      );
    }

    // 🔍 Verify OTP
    const record = await db.otp.findFirst({
      where: { 
        email: officialEmail, 
        otp,
        otpType: "college-signup"  // Specific type for college
      }
    });

    // ❌ Invalid OTP
    if (!record) {
      return NextResponse.json(
        { error: "Invalid OTP" },
        { status: 400 }
      );
    }

    // ⏰ Check expiry
    if (record.expiresAt < new Date()) {
      return NextResponse.json(
        { error: "OTP expired" },
        { status: 400 }
      );
    }

    // Check if user already exists
    const existingUser = await db.user.findUnique({
      where: { email: officialEmail }
    });

    if (existingUser) {
      return NextResponse.json(
        { error: "Account already exists" },
        { status: 409 }
      );
    }

    // Hash password
    const hashedPassword = await hash(password, 12);

    // Create user
    const user = await db.user.create({
      data: {
        email: officialEmail,
        password: hashedPassword,
        role: "COLLEGE",
        emailVerified: true,  // Mark as verified since OTP is done
        collegeProfile: {
          create: {
            collegeName,
            officialEmail,
            contactPerson,
            website: website || null,
            city: city || null,
            state: state || null,
            affiliatedUniversity: affiliatedUniversity || null,
          },
        },
      },
    });

    // 🗑️ Delete used OTP
    await db.otp.deleteMany({
      where: { 
        email: officialEmail,
        otpType: "college-signup"
      }
    });

    return NextResponse.json(
      { message: "College registered successfully", userId: user.id },
      { status: 201 }
    );

  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { error: "Server error" },
      { status: 500 }
    );
  }
}