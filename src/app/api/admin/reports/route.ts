import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { db } from "@/lib/db";

export async function GET(req: Request) {
  try {
    const session = await auth();

    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const admin = await db.user.findUnique({ where: { id: session.user.id } });
    if (admin?.role !== "SUPER_ADMIN") {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    const { searchParams } = new URL(req.url);
    const type = searchParams.get("type") || "users";
    const format = searchParams.get("format") || "json";

    // ✅ FIX: Define type for data
    let data: any[] = [];

    if (type === "users") {
      const users = await db.user.findMany({
        include: {
          volunteerProfile: true,
          organizationProfile: true,
          collegeProfile: true
        }
      });
      data = users.map(u => ({
        email: u.email,
        role: u.role,
        name: u.volunteerProfile?.fullName || u.organizationProfile?.organizationName || u.collegeProfile?.collegeName,
        verified: u.emailVerified,
        joined: u.createdAt.toISOString().split("T")[0]
      }));
    } 
    else if (type === "organizations") {
      const orgs = await db.organizationProfile.findMany({
        include: { user: true }
      });
      data = orgs.map(o => ({
        name: o.organizationName,
        email: o.officialEmail,
        type: o.type,
        status: o.verificationStatus,
        contactPerson: o.contactPerson,
        joined: o.createdAt.toISOString().split("T")[0]
      }));
    }
    else if (type === "events") {
      const events = await db.event.findMany({
        include: {
          organizer: {
            include: { organizationProfile: true }
          }
        }
      });
      data = events.map(e => ({
        title: e.title,
        category: e.category,
        status: e.status,
        date: e.startDate.toISOString().split("T")[0],
        location: `${e.city || ""} ${e.state || ""}`.trim(),
        organizer: e.organizer.organizationProfile?.organizationName,
        slots: `${e.filledSlots}/${e.totalSlots}`
      }));
    }
    else if (type === "earnings") {
      const volunteers = await db.volunteerProfile.findMany({
        select: {
          fullName: true,
          totalEvents: true,
          totalHours: true,
          reputationScore: true
        }
      });
      data = volunteers.map(v => ({
        name: v.fullName,
        events: v.totalEvents,
        hours: v.totalHours,
        earnings: v.totalHours * 200,
        rating: v.reputationScore
      }));
    }

    if (format === "csv") {
      if (data.length === 0) {
        return NextResponse.json({ error: "No data to export" }, { status: 404 });
      }
      const headers = Object.keys(data[0]);
      const csv = [
        headers.join(","),
        ...data.map(row => headers.map(h => JSON.stringify(row[h as keyof typeof row] || "")).join(","))
      ].join("\n");
      
      return new NextResponse(csv, {
        headers: {
          "Content-Type": "text/csv",
          "Content-Disposition": `attachment; filename=${type}_report_${new Date().toISOString().split("T")[0]}.csv`
        }
      });
    }

    return NextResponse.json({ data, count: data.length });

  } catch (error) {
    console.error("Error generating report:", error);
    return NextResponse.json(
      { error: "Failed to generate report" },
      { status: 500 }
    );
  }
}