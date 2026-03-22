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
    const status = searchParams.get("status");
    const search = searchParams.get("search");

    let where: any = {};

    if (status && status !== "all") {
      where.status = status;
    }

    if (search) {
      where.OR = [
        { title: { contains: search, mode: "insensitive" } },
        { description: { contains: search, mode: "insensitive" } }
      ];
    }

    const events = await db.event.findMany({
      where,
      include: {
        organizer: {
          include: {
            organizationProfile: true
          }
        },
        _count: {
          select: { applications: true }
        }
      },
      orderBy: { createdAt: "desc" },
      take: 50
    });

    const formattedEvents = events.map(event => ({
      id: event.id,
      title: event.title,
      category: event.category,
      status: event.status,
      startDate: event.startDate,
      endDate: event.endDate,
      city: event.city,
      state: event.state,
      totalSlots: event.totalSlots,
      filledSlots: event.filledSlots,
      applicationsCount: event._count.applications,
      organizerName: event.organizer.organizationProfile?.organizationName || "Unknown",
      createdAt: event.createdAt.toISOString()
    }));

    return NextResponse.json({ events: formattedEvents });

  } catch (error) {
    console.error("Error fetching events:", error);
    return NextResponse.json(
      { error: "Failed to fetch events" },
      { status: 500 }
    );
  }
}