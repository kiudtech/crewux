import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { db } from "@/lib/db";

export async function POST(req: Request) {
  try {
    const session = await auth();

    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Verify admin role
    const admin = await db.user.findUnique({ where: { id: session.user.id } });
    if (admin?.role !== "SUPER_ADMIN") {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    const { ids, notes } = await req.json();

    if (!ids || !Array.isArray(ids) || ids.length === 0) {
      return NextResponse.json(
        { error: "No organization IDs provided" },
        { status: 400 }
      );
    }

    // Get organizations
    const organizations = await db.organizationProfile.findMany({
      where: {
        id: { in: ids },
        verificationStatus: "PENDING"
      },
      include: { user: true }
    });

    if (organizations.length === 0) {
      return NextResponse.json(
        { error: "No pending organizations found" },
        { status: 404 }
      );
    }

    // Update all
    const updatedOrgs = await db.$transaction(
      organizations.map(org =>
        db.organizationProfile.update({
          where: { id: org.id },
          data: {
            verificationStatus: "VERIFIED",
            verifiedAt: new Date(),
            verifiedBy: session.user.id
          }
        })
      )
    );

    // Create notifications (if table exists)
    try {
      await db.$transaction(
        organizations.map(org =>
          db.notification.create({
            data: {
              userId: org.userId,
              title: "Organization Verified! 🎉",
              message: `Your organization "${org.organizationName}" has been verified.`,
              type: "VERIFICATION",
              read: false
            }
          })
        )
      );
    } catch (e) {
      console.log("Notification table not found, skipping...");
    }

    return NextResponse.json({
      success: true,
      message: `${organizations.length} organizations verified successfully`,
      verified: organizations.length,
      total: ids.length
    });

  } catch (error) {
    console.error("Error bulk verifying:", error);
    return NextResponse.json(
      { error: "Failed to bulk verify" },
      { status: 500 }
    );
  }
}