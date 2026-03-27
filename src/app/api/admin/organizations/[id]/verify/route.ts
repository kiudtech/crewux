import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { db } from "@/lib/db";

export async function POST(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await auth();

    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const admin = await db.user.findUnique({ where: { id: session.user.id } });
    if (admin?.role !== "SUPER_ADMIN") {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    const { action, notes } = await req.json();
    const { id: orgId } = await params;

    if (action !== "approve" && action !== "reject") {
      return NextResponse.json(
        { error: "Invalid action. Use 'approve' or 'reject'" },
        { status: 400 }
      );
    }

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
          verificationStatus: "VERIFIED"
        }
      });
    } else {
      updatedOrg = await db.organizationProfile.update({
        where: { id: orgId },
        data: {
          verificationStatus: "REJECTED"
        }
      });
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