import { NextRequest, NextResponse } from "next/server";
import { hash } from "bcryptjs";
import { db } from "@/lib/db";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const {
      organizationName, type, officialEmail, password,
      contactPerson, website, linkedin, city, state, shortDescription
    } = body;

    if (!organizationName || !type || !officialEmail || !password || !contactPerson) {
      return NextResponse.json(
        { error: "Required fields are missing" },
        { status: 400 }
      );
    }

    const existingUser = await db.user.findUnique({ where: { email: officialEmail } });
    if (existingUser) {
      return NextResponse.json(
        { error: "An account with this email already exists" },
        { status: 409 }
      );
    }

    const hashedPassword = await hash(password, 12);

    const user = await db.user.create({
      data: {
        email: officialEmail,
        password: hashedPassword,
        role: "ORGANIZATION",
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
