import { NextRequest, NextResponse } from "next/server";
import { hash } from "bcryptjs";
import { db } from "@/lib/db";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { fullName, email, password, phone, college, course, discipline, yearOfStudy, city, state } = body;

    if (!fullName || !email || !password) {
      return NextResponse.json(
        { error: "Name, email, and password are required" },
        { status: 400 }
      );
    }

    // Check if user already exists
    const existingUser = await db.user.findUnique({ where: { email } });
    if (existingUser) {
      return NextResponse.json(
        { error: "An account with this email already exists" },
        { status: 409 }
      );
    }

    const hashedPassword = await hash(password, 12);

    const user = await db.user.create({
      data: {
        email,
        password: hashedPassword,
        role: "VOLUNTEER",
        phone,
        volunteerProfile: {
          create: {
            fullName,
            college: college || null,
            course: course || null,
            discipline: discipline || null,
            yearOfStudy: yearOfStudy || null,
            city: city || null,
            state: state || null,
          },
        },
      },
    });

    return NextResponse.json(
      { message: "Volunteer registered successfully", userId: user.id },
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
