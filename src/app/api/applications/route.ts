import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { auth } from "@/lib/auth";

// GET /api/applications — List applications
// For volunteers: their own applications
// For orgs: applications to their events
export async function GET(req: NextRequest) {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { searchParams } = new URL(req.url);
    const eventId = searchParams.get("eventId");
    const status = searchParams.get("status");
    const page = parseInt(searchParams.get("page") || "1");
    const limit = parseInt(searchParams.get("limit") || "20");

    let where: Record<string, unknown> = {};

    if (session.user.role === "VOLUNTEER") {
      where.applicantId = session.user.id;
    } else if (session.user.role === "ORGANIZATION") {
      // Get all events for this org, then find applications
      where.event = { organizerId: session.user.id };
    } else if (session.user.role === "SUPER_ADMIN") {
      // Admin sees all
    } else {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    if (eventId) where.eventId = eventId;
    if (status && status !== "ALL") where.status = status;

    const [applications, total] = await Promise.all([
      db.application.findMany({
        where: where as any,
        include: {
          event: {
            select: {
              id: true,
              title: true,
              category: true,
              startDate: true,
              endDate: true,
              city: true,
              state: true,
              status: true,
              organizer: {
                select: {
                  organizationProfile: {
                    select: { organizationName: true },
                  },
                },
              },
            },
          },
          applicant: {
            select: {
              id: true,
              email: true,
              volunteerProfile: {
                select: {
                  fullName: true,
                  college: true,
                  skills: true,
                  reputationScore: true,
                  completionRate: true,
                  totalEvents: true,
                },
              },
            },
          },
          team: {
            select: {
              id: true,
              name: true,
              skills: true,
            },
          },
        },
        orderBy: { appliedAt: "desc" },
        skip: (page - 1) * limit,
        take: limit,
      }),
      db.application.count({ where: where as any }),
    ]);

    return NextResponse.json({
      applications,
      pagination: { page, limit, total, totalPages: Math.ceil(total / limit) },
    });
  } catch (error) {
    console.error("Applications list error:", error);
    return NextResponse.json({ error: "Failed to fetch applications" }, { status: 500 });
  }
}

// POST /api/applications — Apply to an event
export async function POST(req: NextRequest) {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
    if (session.user.role !== "VOLUNTEER") {
      return NextResponse.json({ error: "Only volunteers can apply to events" }, { status: 403 });
    }

    const body = await req.json();
    const { eventId, role, message, teamId } = body;

    if (!eventId) {
      return NextResponse.json({ error: "Event ID is required" }, { status: 400 });
    }

    // Check event exists and is open
    const event = await db.event.findUnique({ where: { id: eventId } });
    if (!event) {
      return NextResponse.json({ error: "Event not found" }, { status: 404 });
    }
    if (!["PUBLISHED", "ACTIVE"].includes(event.status)) {
      return NextResponse.json({ error: "Event is not accepting applications" }, { status: 400 });
    }
    if (event.registrationDeadline && new Date(event.registrationDeadline) < new Date()) {
      return NextResponse.json({ error: "Registration deadline has passed" }, { status: 400 });
    }
    if (event.filledSlots >= event.totalSlots) {
      return NextResponse.json({ error: "Event is full" }, { status: 400 });
    }

    // Check not already applied
    const existing = await db.application.findUnique({
      where: {
        eventId_applicantId: {
          eventId,
          applicantId: session.user.id,
        },
      },
    });
    if (existing) {
      return NextResponse.json({ error: "You have already applied to this event" }, { status: 409 });
    }

    const application = await db.application.create({
      data: {
        eventId,
        applicantId: session.user.id,
        role: role || null,
        message: message || null,
        teamId: teamId || null,
      },
    });

    return NextResponse.json({ message: "Application submitted successfully", application }, { status: 201 });
  } catch (error) {
    console.error("Apply error:", error);
    return NextResponse.json({ error: "Failed to submit application" }, { status: 500 });
  }
}
