import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { db } from "@/lib/db";

export async function GET() {
  try {
    const session = await auth();

    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Verify admin role
    const user = await db.user.findUnique({ where: { id: session.user.id } });
    if (user?.role !== "SUPER_ADMIN") {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    const [totalUsers, totalOrganizations, totalVolunteers, totalColleges, pendingVerifications] =
      await Promise.all([
        db.user.count(),
        db.user.count({ where: { role: "ORGANIZATION" } }),
        db.user.count({ where: { role: "VOLUNTEER" } }),
        db.user.count({ where: { role: "COLLEGE" } }),
        db.organizationProfile.count({ where: { verificationStatus: "PENDING" } }),
      ]);

    return NextResponse.json({
      totalUsers,
      totalOrganizations,
      totalVolunteers,
      totalColleges,
      pendingVerifications,
    });
  } catch (error) {
    console.error("Admin stats error:", error);
    return NextResponse.json({ error: "Something went wrong" }, { status: 500 });
  }
}
