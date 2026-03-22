import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { db } from "@/lib/db";

export async function GET() {
  try {
    const session = await auth();

    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const admin = await db.user.findUnique({ where: { id: session.user.id } });
    if (admin?.role !== "SUPER_ADMIN") {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    // Get volunteer earnings
    const volunteers = await db.volunteerProfile.findMany({
      select: {
        fullName: true,
        userId: true,
        totalEvents: true,
        totalHours: true,
        reputationScore: true
      },
      orderBy: { totalHours: "desc" },
      take: 50
    });

    const earningsData = volunteers.map(v => ({
      userId: v.userId,
      name: v.fullName,
      totalEvents: v.totalEvents,
      totalHours: v.totalHours,
      earnings: v.totalHours * 200, // Example: ₹200 per hour
      reputationScore: v.reputationScore
    }));

    const totalEarnings = earningsData.reduce((sum, v) => sum + v.earnings, 0);

    return NextResponse.json({
      earnings: earningsData,
      totalEarnings,
      totalVolunteers: volunteers.length
    });

  } catch (error) {
    console.error("Error fetching earnings:", error);
    return NextResponse.json(
      { error: "Failed to fetch earnings" },
      { status: 500 }
    );
  }
}