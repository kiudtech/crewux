import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { auth } from "@/lib/auth";

// GET /api/events — Browse/list events (public)
export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const category = searchParams.get("category");
    const city = searchParams.get("city");
    const state = searchParams.get("state");
    const eventType = searchParams.get("eventType");
    const search = searchParams.get("search");
    const status = searchParams.get("status") || "PUBLISHED";
    const page = parseInt(searchParams.get("page") || "1");
    const limit = parseInt(searchParams.get("limit") || "12");
    const organizerId = searchParams.get("organizerId");

    const where: Record<string, unknown> = {};

    // For public browsing, only show published/active events
    if (organizerId) {
      where.organizerId = organizerId;
    } else {
      where.status = { in: ["PUBLISHED", "ACTIVE"] };
    }

    if (status && organizerId) {
      if (status === "ALL") {
        // No status filter
      } else {
        where.status = status;
      }
    }

    if (category) where.category = category;
    if (city) where.city = { contains: city };
    if (state) where.state = state;
    if (eventType) where.eventType = eventType;
    if (search) {
      where.OR = [
        { title: { contains: search } },
        { description: { contains: search } },
        { city: { contains: search } },
      ];
    }

    const [events, total] = await Promise.all([
      db.event.findMany({
        where: where as any,
        include: {
          organizer: {
            select: {
              id: true,
              organizationProfile: {
                select: {
                  organizationName: true,
                  logoUrl: true,
                  verificationStatus: true,
                },
              },
            },
          },
          _count: { select: { applications: true } },
        },
        orderBy: { startDate: "asc" },
        skip: (page - 1) * limit,
        take: limit,
      }),
      db.event.count({ where: where as any }),
    ]);

    return NextResponse.json({
      events,
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
      },
    });
  } catch (error) {
    console.error("Events list error:", error);
    return NextResponse.json({ error: "Failed to fetch events" }, { status: 500 });
  }
}

// POST /api/events — Create event (org only)
export async function POST(req: NextRequest) {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
    if (session.user.role !== "ORGANIZATION") {
      return NextResponse.json({ error: "Only organizations can create events" }, { status: 403 });
    }

    const body = await req.json();
    const {
      title, description, shortDesc, category, eventType,
      startDate, endDate, registrationDeadline,
      venue, address, city, state, virtualLink,
      requiredSkills, rolesNeeded, totalSlots,
      contactEmail, contactPhone, perks, eligibility, status,
    } = body;

    if (!title || !description || !category || !startDate || !endDate) {
      return NextResponse.json(
        { error: "Title, description, category, start date, and end date are required" },
        { status: 400 }
      );
    }

    const event = await db.event.create({
      data: {
        organizerId: session.user.id,
        title,
        description,
        shortDesc: shortDesc || title.substring(0, 200),
        category,
        eventType: eventType || "IN_PERSON",
        status: status || "DRAFT",
        startDate: new Date(startDate),
        endDate: new Date(endDate),
        registrationDeadline: registrationDeadline ? new Date(registrationDeadline) : null,
        venue,
        address,
        city,
        state,
        virtualLink,
        requiredSkills: JSON.stringify(requiredSkills || []),
        rolesNeeded: JSON.stringify(rolesNeeded || []),
        totalSlots: totalSlots || 1,
        contactEmail,
        contactPhone,
        perks,
        eligibility,
      },
    });

    return NextResponse.json({ message: "Event created successfully", event }, { status: 201 });
  } catch (error) {
    console.error("Create event error:", error);
    return NextResponse.json({ error: "Failed to create event" }, { status: 500 });
  }
}
