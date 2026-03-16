import { NextRequest, NextResponse } from "next/server";
import { hash } from "bcryptjs";
import { db } from "@/lib/db";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const {
      organizationName, type, officialEmail, password,
      contactPerson, website, linkedin, city, state, 
      shortDescription, otp
    } = body;

    // Validate required fields
    if (!organizationName || !type || !officialEmail || !password || !contactPerson || !otp) {
      return NextResponse.json(
        { error: "Required fields are missing" },
        { status: 400 }
      );
    }

    // Verify OTP
    const otpRecord = await db.otp.findFirst({
      where: { 
        email: officialEmail, 
        otp,
        otpType: "organization-signup"
      }
    });

    if (!otpRecord) {
      return NextResponse.json(
        { error: "Invalid OTP" },
        { status: 400 }
      );
    }

    if (otpRecord.expiresAt < new Date()) {
      return NextResponse.json(
        { error: "OTP expired" },
        { status: 400 }
      );
    }

    // Check existing user
    const existingUser = await db.user.findUnique({ 
      where: { email: officialEmail } 
    });
    
    if (existingUser) {
      return NextResponse.json(
        { error: "An account with this email already exists" },
        { status: 409 }
      );
    }

    // Create user
    const hashedPassword = await hash(password, 12);

    const user = await db.user.create({
      data: {
        email: officialEmail,
        password: hashedPassword,
        role: "ORGANIZATION",
        emailVerified: true,
        organizationProfile: {
          create: {
            organizationName,
            type,
            officialEmail,
            contactPerson,
            website: website || null,
            linkedin: linkedin || null,
            city: city || null,
            state: state || null,
            shortDescription: shortDescription || null,
          },
        },
      },
    });

    // Delete used OTP
    await db.otp.deleteMany({
      where: { 
        email: officialEmail,
        otpType: "organization-signup"
      }
    });

    return NextResponse.json(
      { message: "Organization registered successfully", userId: user.id },
      { status: 201 }
    );

  } catch (error) {
    console.error("Registration error:", error);
    return NextResponse.json(
      { error: "Something went wrong. Please try again." },
      { status: 500 }
    );
  }
}