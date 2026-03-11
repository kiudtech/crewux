import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { auth } from "@/lib/auth";

// PUT /api/applications/[id] — Update application status
// Org can: SHORTLISTED, ACCEPTED, REJECTED
// Volunteer can: WITHDRAWN
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
    const application = await db.application.findUnique({
      where: { id },
      include: { event: true },
    });

    if (!application) {
      return NextResponse.json({ error: "Application not found" }, { status: 404 });
    }

    const body = await req.json();
    const { status, orgNote } = body;

    // Volunteer can only withdraw their own applications
    if (session.user.role === "VOLUNTEER") {
      if (application.applicantId !== session.user.id) {
        return NextResponse.json({ error: "Not authorized" }, { status: 403 });
      }
      if (status !== "WITHDRAWN") {
        return NextResponse.json({ error: "You can only withdraw your application" }, { status: 400 });
      }
    }
    // Org can update applications for their events
    else if (session.user.role === "ORGANIZATION") {
      if (application.event.organizerId !== session.user.id) {
        return NextResponse.json({ error: "Not authorized" }, { status: 403 });
      }
      if (!["SHORTLISTED", "ACCEPTED", "REJECTED"].includes(status)) {
        return NextResponse.json(
          { error: "Invalid status. Use SHORTLISTED, ACCEPTED, or REJECTED" },
          { status: 400 }
        );
      }
    }
    // Admin can do anything
    else if (session.user.role !== "SUPER_ADMIN") {
      return NextResponse.json({ error: "Not authorized" }, { status: 403 });
    }

    const updateData: Record<string, unknown> = { status };
    if (orgNote !== undefined) updateData.orgNote = orgNote;

    // If accepting, increment filledSlots
    if (status === "ACCEPTED" && application.status !== "ACCEPTED") {
      await db.event.update({
        where: { id: application.eventId },
        data: { filledSlots: { increment: 1 } },
      });
    }
    // If un-accepting (e.g. rejected after accepted), decrement
    if (application.status === "ACCEPTED" && status !== "ACCEPTED") {
      await db.event.update({
        where: { id: application.eventId },
        data: { filledSlots: { decrement: 1 } },
      });
    }

    const updated = await db.application.update({
      where: { id },
      data: updateData,
    });

    return NextResponse.json({ message: "Application updated", application: updated });
  } catch (error) {
    console.error("Update application error:", error);
    return NextResponse.json({ error: "Failed to update application" }, { status: 500 });
  }
}
