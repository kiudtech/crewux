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

    // Get current date for this month
    const now = new Date();
    const firstDayOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
    const lastDayOfMonth = new Date(now.getFullYear(), now.getMonth() + 1, 0);

    // Fetch all counts
    const [
      totalUsers,
      totalOrganizations,
      totalVolunteers,
      totalColleges,
      totalEvents,
      totalApplications,
      pendingVerifications,
      activeEvents,
      totalEarnings,
      thisMonthUsers,
      thisMonthEvents
    ] = await Promise.all([
      db.user.count(),
      db.user.count({ where: { role: "ORGANIZATION" } }),
      db.user.count({ where: { role: "VOLUNTEER" } }),
      db.user.count({ where: { role: "COLLEGE" } }),
      db.event.count(),
      db.application.count(),
      db.organizationProfile.count({ where: { verificationStatus: "PENDING" } }),
      db.event.count({ where: { status: "ACTIVE" } }),
      db.volunteerProfile.aggregate({ _sum: { totalHours: true } }),
      db.user.count({ where: { createdAt: { gte: firstDayOfMonth, lte: lastDayOfMonth } } }),
      db.event.count({ where: { createdAt: { gte: firstDayOfMonth, lte: lastDayOfMonth } } })
    ]);

    // Calculate earnings (assuming ₹200 per hour)
    const earnings = (totalEarnings._sum.totalHours || 0) * 200;

    return NextResponse.json({
      totalUsers: totalUsers || 0,
      totalOrganizations: totalOrganizations || 0,
      totalVolunteers: totalVolunteers || 0,
      totalColleges: totalColleges || 0,
      totalEvents: totalEvents || 0,
      totalApplications: totalApplications || 0,
      pendingVerifications: pendingVerifications || 0,
      pendingOrganizations: pendingVerifications || 0,
      activeEvents: activeEvents || 0,
      totalEarnings: earnings || 0,
      thisMonthUsers: thisMonthUsers || 0,
      thisMonthEvents: thisMonthEvents || 0,
      growthRate: 12
    });

  } catch (error) {
    console.error("Admin stats error:", error);
    return NextResponse.json(
      { 
        error: "Something went wrong",
        // Fallback data so dashboard doesn't crash
        totalUsers: 0,
        totalOrganizations: 0,
        totalVolunteers: 0,
        totalColleges: 0,
        totalEvents: 0,
        totalApplications: 0,
        pendingVerifications: 0,
        pendingOrganizations: 0,
        activeEvents: 0,
        totalEarnings: 0,
        thisMonthUsers: 0,
        thisMonthEvents: 0,
        growthRate: 12
      },
      { status: 500 }
    );
  }
}