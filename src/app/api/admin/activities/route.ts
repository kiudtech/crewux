import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { db } from "@/lib/db";

export async function GET() {
  try {
    const session = await auth();

    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const user = await db.user.findUnique({ where: { id: session.user.id } });
    if (user?.role !== "SUPER_ADMIN") {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    // Fetch recent users
    const recentUsers = await db.user.findMany({
      take: 5,
      orderBy: { createdAt: "desc" },
      include: {
        volunteerProfile: true,
        organizationProfile: true
      }
    });

    const activities = recentUsers.map(user => ({
      id: user.id,
      type: "user",
      action: `New ${user.role.toLowerCase()} registered: ${user.volunteerProfile?.fullName || user.organizationProfile?.organizationName || user.email}`,
      user: user.email,
      timestamp: user.createdAt.toISOString()
    }));

    return NextResponse.json(activities);

  } catch (error) {
    console.error("Error fetching activities:", error);
    return NextResponse.json(
      { error: "Failed to fetch activities" },
      { status: 500 }
    );
  }
}