import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { db } from "@/lib/db";

export async function GET(req: Request) {
  try {
    const session = await auth();
    
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const user = await db.user.findUnique({ where: { id: session.user.id } });
    if (user?.role !== "SUPER_ADMIN") {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    const { searchParams } = new URL(req.url);
    const status = searchParams.get("status");
    const type = searchParams.get("type");
    const search = searchParams.get("search");
    const page = parseInt(searchParams.get("page") || "1");
    const limit = parseInt(searchParams.get("limit") || "20");
    const skip = (page - 1) * limit;

    let where: any = {};

    if (status && status !== "all") {
      where.verificationStatus = status;
    }

    if (type && type !== "all") {
      where.type = type;
    }

    if (search) {
      where.OR = [
        { organizationName: { contains: search, mode: "insensitive" } },
        { officialEmail: { contains: search, mode: "insensitive" } },
        { contactPerson: { contains: search, mode: "insensitive" } },
        { city: { contains: search, mode: "insensitive" } }
      ];
    }

    const [organizations, totalCount] = await Promise.all([
      db.organizationProfile.findMany({
        where,
        include: {
          user: {
            select: {
              id: true,
              email: true,
              emailVerified: true,
              phone: true,
              createdAt: true,
              _count: {
                select: {
                  organizedEvents: true
                }
              }
            }
          }
        },
        orderBy: {
          createdAt: "desc"
        },
        skip,
        take: limit
      }),
      db.organizationProfile.count({ where })
    ]);

    // ✅ FIX: org.user.phone use karo, org.phone nahi
    const formattedOrganizations = organizations.map(org => ({
      id: org.id,
      organizationName: org.organizationName,
      officialEmail: org.officialEmail,
      contactPerson: org.contactPerson,
      phone: org.user?.phone || null,
      type: org.type,
      city: org.city,
      state: org.state,
      verificationStatus: org.verificationStatus,
      emailVerified: org.user?.emailVerified || false,
      createdAt: org.createdAt.toISOString(),
      totalEvents: org.user?._count?.organizedEvents || 0,
      totalVolunteers: 0,
      logo: org.logoUrl
    }));

    return NextResponse.json({
      organizations: formattedOrganizations,
      pagination: {
        total: totalCount,
        page,
        limit,
        totalPages: Math.ceil(totalCount / limit)
      }
    });

  } catch (error) {
    console.error("Error fetching organizations:", error);
    return NextResponse.json(
      { error: "Failed to fetch organizations" },
      { status: 500 }
    );
  }
}