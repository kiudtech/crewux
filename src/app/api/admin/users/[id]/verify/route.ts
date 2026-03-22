import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { db } from "@/lib/db";

export async function POST(
  req: Request,
  { params }: { params: { id: string } }
) {
  try {
    const session = await auth();

    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const admin = await db.user.findUnique({ where: { id: session.user.id } });
    if (admin?.role !== "SUPER_ADMIN") {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    const { verified } = await req.json();
    const userId = params.id;

    const updatedUser = await db.user.update({
      where: { id: userId },
      data: { emailVerified: verified }
    });

    return NextResponse.json({
      success: true,
      message: verified ? "User verified" : "User rejected",
      user: { id: updatedUser.id, emailVerified: updatedUser.emailVerified }
    });

  } catch (error) {
    console.error("Error verifying user:", error);
    return NextResponse.json(
      { error: "Failed to verify user" },
      { status: 500 }
    );
  }
}