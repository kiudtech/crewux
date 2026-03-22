import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { db } from "@/lib/db";

export async function POST(
  req: Request,
  { params }: { params: { id: string } }
) {
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

    const { action, notes } = await req.json();
    const orgId = params.id;

    if (action !== "approve" && action !== "reject") {
      return NextResponse.json(
        { error: "Invalid action. Use 'approve' or 'reject'" },
        { status: 400 }
      );
    }

    // Get organization
    const organization = await db.organizationProfile.findUnique({
      where: { id: orgId },
      include: { user: true }
    });

    if (!organization) {
      return NextResponse.json(
        { error: "Organization not found" },
        { status: 404 }
      );
    }

    let updatedOrg;

    if (action === "approve") {
      updatedOrg = await db.organizationProfile.update({
        where: { id: orgId },
        data: {
          verificationStatus: "VERIFIED",
          verifiedAt: new Date(),
          verifiedBy: session.user.id
        }
      });

      // Create notification (if notification table exists)
      try {
        await db.notification.create({
          data: {
            userId: organization.userId,
            title: "Organization Verified! 🎉",
            message: `Your organization "${organization.organizationName}" has been verified. You can now post events.`,
            type: "VERIFICATION",
            read: false
          }
        });
      } catch (e) {
        console.log("Notification table not found, skipping...");
      }

    } else {
      updatedOrg = await db.organizationProfile.update({
        where: { id: orgId },
        data: {
          verificationStatus: "REJECTED",
          rejectionNotes: notes || "Verification failed",
          rejectedAt: new Date(),
          rejectedBy: session.user.id
        }
      });

      try {
        await db.notification.create({
          data: {
            userId: organization.userId,
            title: "Verification Rejected",
            message: notes || `Your organization verification was rejected. Please check documents and resubmit.`,
            type: "VERIFICATION",
            read: false
          }
        });
      } catch (e) {
        console.log("Notification table not found, skipping...");
      }
    }

    return NextResponse.json({
      success: true,
      message: action === "approve" ? "Organization verified" : "Organization rejected",
      organization: {
        id: updatedOrg.id,
        verificationStatus: updatedOrg.verificationStatus
      }
    });

  } catch (error) {
    console.error("Error verifying organization:", error);
    return NextResponse.json(
      { error: "Failed to process verification" },
      { status: 500 }
    );
  }
}