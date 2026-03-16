import { NextRequest, NextResponse } from "next/server";
import { hash } from "bcryptjs";
import { db } from "@/lib/db";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const {
      fullName,
      email,
      password,
      phone,
      college,
      course,
      discipline,
      yearOfStudy,
      city,
      state,
      otp
    } = body;

    const normalizedEmail = email?.toLowerCase();

    // Validate required fields
    if (!fullName || !normalizedEmail || !password || !otp) {
      return NextResponse.json(
        { error: "Name, email, password and OTP are required" },
        { status: 400 }
      );
    }

    // Verify OTP first
    const otpRecord = await db.otp.findFirst({
      where: {
        email: normalizedEmail,
        otp,
        otpType: "signup"
      },
      orderBy: {
        createdAt: "desc"
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

    // Check if user already exists
    const existingUser = await db.user.findUnique({
      where: { email: normalizedEmail }
    });

    if (existingUser) {
      return NextResponse.json(
        { error: "Account already exists with this email" },
        { status: 409 }
      );
    }

    // Hash password and create user
    const hashedPassword = await hash(password, 12);

    const user = await db.user.create({
      data: {
        email: normalizedEmail,
        password: hashedPassword,
        role: "VOLUNTEER",
        phone,
        emailVerified: true,
        volunteerProfile: {
          create: {
            fullName,
            college: college || null,
            course: course || null,
            discipline: discipline || null,
            yearOfStudy: yearOfStudy || null,
            city: city || null,
            state: state || null
          }
        }
      }
    });

    // Clean up used OTP
    await db.otp.deleteMany({
      where: {
        email: normalizedEmail,
        otpType: "signup"
      }
    });

    return NextResponse.json(
      {
        success: true,
        message: "Volunteer registered successfully",
        userId: user.id
      },
      { status: 201 }
    );

  } catch (error) {
    console.error("Volunteer Registration Error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}