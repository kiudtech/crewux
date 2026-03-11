import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { db } from "@/lib/db";

export async function GET() {
  try {
    const session = await auth();

    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const user = await db.user.findUnique({
      where: { id: session.user.id },
      include: {
        volunteerProfile: true,
        organizationProfile: true,
        collegeProfile: true,
      },
    });

    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { password, ...userWithoutPassword } = user;

    return NextResponse.json(userWithoutPassword);
  } catch (error) {
    console.error("Profile fetch error:", error);
    return NextResponse.json({ error: "Something went wrong" }, { status: 500 });
  }
}

export async function PUT(req: Request) {
  try {
    const session = await auth();

    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await req.json();
    const user = await db.user.findUnique({ where: { id: session.user.id } });

    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    // Update based on role
    if (user.role === "VOLUNTEER" && body.volunteerProfile) {
      await db.volunteerProfile.update({
        where: { userId: user.id },
        data: body.volunteerProfile,
      });
    }

    if (user.role === "ORGANIZATION" && body.organizationProfile) {
      await db.organizationProfile.update({
        where: { userId: user.id },
        data: body.organizationProfile,
      });
    }

    if (user.role === "COLLEGE" && body.collegeProfile) {
      await db.collegeProfile.update({
        where: { userId: user.id },
        data: body.collegeProfile,
      });
    }

    // Update common fields
    if (body.phone !== undefined) {
      await db.user.update({
        where: { id: user.id },
        data: { phone: body.phone },
      });
    }

    return NextResponse.json({ message: "Profile updated successfully" });
  } catch (error) {
    console.error("Profile update error:", error);
    return NextResponse.json({ error: "Something went wrong" }, { status: 500 });
  }
}
