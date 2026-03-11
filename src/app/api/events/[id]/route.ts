import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { auth } from "@/lib/auth";

// GET /api/events/[id] — Get single event detail
export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const event = await db.event.findUnique({
      where: { id },
      include: {
        organizer: {
          select: {
            id: true,
            email: true,
            organizationProfile: {
              select: {
                organizationName: true,
                logoUrl: true,
                verificationStatus: true,
                type: true,
                city: true,
                state: true,
                website: true,
              },
            },
          },
        },
        _count: { select: { applications: true } },
      },
    });

    if (!event) {
      return NextResponse.json({ error: "Event not found" }, { status: 404 });
    }

    // Check if current user has already applied
    const session = await auth();
    let userApplication = null;
    if (session?.user?.id) {
      userApplication = await db.application.findUnique({
        where: {
          eventId_applicantId: {
            eventId: id,
            applicantId: session.user.id,
          },
        },
      });
    }

    return NextResponse.json({ event, userApplication });
  } catch (error) {
    console.error("Event detail error:", error);
    return NextResponse.json({ error: "Failed to fetch event" }, { status: 500 });
  }
}

// PUT /api/events/[id] — Update event (org owner only)
export async function PUT(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { id } = await params;
    const event = await db.event.findUnique({ where: { id } });
    if (!event) {
      return NextResponse.json({ error: "Event not found" }, { status: 404 });
    }
    if (event.organizerId !== session.user.id && session.user.role !== "SUPER_ADMIN") {
      return NextResponse.json({ error: "Not authorized" }, { status: 403 });
    }

    const body = await req.json();
    const {
      title, description, shortDesc, category, eventType, status,
      startDate, endDate, registrationDeadline,
      venue, address, city, state, virtualLink,
      requiredSkills, rolesNeeded, totalSlots,
      contactEmail, contactPhone, perks, eligibility,
    } = body;

    const updateData: Record<string, unknown> = {};
    if (title !== undefined) updateData.title = title;
    if (description !== undefined) updateData.description = description;
    if (shortDesc !== undefined) updateData.shortDesc = shortDesc;
    if (category !== undefined) updateData.category = category;
    if (eventType !== undefined) updateData.eventType = eventType;
    if (status !== undefined) updateData.status = status;
    if (startDate !== undefined) updateData.startDate = new Date(startDate);
    if (endDate !== undefined) updateData.endDate = new Date(endDate);
    if (registrationDeadline !== undefined) updateData.registrationDeadline = registrationDeadline ? new Date(registrationDeadline) : null;
    if (venue !== undefined) updateData.venue = venue;
    if (address !== undefined) updateData.address = address;
    if (city !== undefined) updateData.city = city;
    if (state !== undefined) updateData.state = state;
    if (virtualLink !== undefined) updateData.virtualLink = virtualLink;
    if (requiredSkills !== undefined) updateData.requiredSkills = JSON.stringify(requiredSkills);
    if (rolesNeeded !== undefined) updateData.rolesNeeded = JSON.stringify(rolesNeeded);
    if (totalSlots !== undefined) updateData.totalSlots = totalSlots;
    if (contactEmail !== undefined) updateData.contactEmail = contactEmail;
    if (contactPhone !== undefined) updateData.contactPhone = contactPhone;
    if (perks !== undefined) updateData.perks = perks;
    if (eligibility !== undefined) updateData.eligibility = eligibility;

    const updated = await db.event.update({
      where: { id },
      data: updateData,
    });

    return NextResponse.json({ message: "Event updated successfully", event: updated });
  } catch (error) {
    console.error("Update event error:", error);
    return NextResponse.json({ error: "Failed to update event" }, { status: 500 });
  }
}

// DELETE /api/events/[id] — Delete event (org owner or admin)
export async function DELETE(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { id } = await params;
    const event = await db.event.findUnique({ where: { id } });
    if (!event) {
      return NextResponse.json({ error: "Event not found" }, { status: 404 });
    }
    if (event.organizerId !== session.user.id && session.user.role !== "SUPER_ADMIN") {
      return NextResponse.json({ error: "Not authorized" }, { status: 403 });
    }

    await db.event.delete({ where: { id } });
    return NextResponse.json({ message: "Event deleted successfully" });
  } catch (error) {
    console.error("Delete event error:", error);
    return NextResponse.json({ error: "Failed to delete event" }, { status: 500 });
  }
}
