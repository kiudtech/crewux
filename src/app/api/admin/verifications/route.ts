import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { db } from "@/lib/db";

export async function GET() {
  try {
    const session = await auth();

    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const admin = await db.user.findUnique({ where: { id: session.user.id } });
    if (admin?.role !== "SUPER_ADMIN") {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    const [pendingOrganizations, unverifiedUsers, pendingColleges] = await Promise.all([
      db.organizationProfile.findMany({
        where: { verificationStatus: "PENDING" },
        include: { user: true },
        take: 20
      }),
      db.user.findMany({
        where: { emailVerified: false },
        include: {
          volunteerProfile: true,
          collegeProfile: true
        },
        take: 20
      }),
      db.collegeProfile.findMany({
        where: { verificationStatus: "PENDING" },
        include: { user: true },
        take: 20
      })
    ]);

    const pending = [
      ...pendingOrganizations.map(org => ({
        id: org.id,
        type: "ORGANIZATION",
        name: org.organizationName,
        email: org.officialEmail,
        contactPerson: org.contactPerson,
        status: "PENDING",
        createdAt: org.createdAt.toISOString()
      })),
      ...unverifiedUsers.map(user => ({
        id: user.id,
        type: user.role === "VOLUNTEER" ? "VOLUNTEER" : "COLLEGE",
        name: user.volunteerProfile?.fullName || user.collegeProfile?.collegeName || user.email,
        email: user.email,
        status: "EMAIL_UNVERIFIED",
        createdAt: user.createdAt.toISOString()
      })),
      ...pendingColleges.map(college => ({
        id: college.id,
        type: "COLLEGE",
        name: college.collegeName,
        email: college.officialEmail,
        contactPerson: college.contactPerson,
        status: "PENDING",
        createdAt: college.createdAt.toISOString()
      }))
    ];

    return NextResponse.json({ pending, count: pending.length });

  } catch (error) {
    console.error("Error fetching pending verifications:", error);
    return NextResponse.json(
      { error: "Failed to fetch pending verifications" },
      { status: 500 }
    );
  }
}