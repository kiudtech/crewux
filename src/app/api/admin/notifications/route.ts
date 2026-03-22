import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { db } from "@/lib/db";

// GET - Fetch all notifications
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
    const limit = parseInt(searchParams.get("limit") || "50");
    const offset = parseInt(searchParams.get("offset") || "0");
    const type = searchParams.get("type");

    let where: any = {};
    if (type && type !== "all") {
      where.type = type;
    }

    const [notifications, totalCount] = await Promise.all([
      db.notification.findMany({
        where,
        orderBy: { createdAt: "desc" },
        skip: offset,
        take: limit,
        include: {
          user: {
            select: {
              email: true,
              role: true,
              volunteerProfile: {
                select: { fullName: true }
              },
              organizationProfile: {
                select: { organizationName: true }
              },
              collegeProfile: {
                select: { collegeName: true }
              }
            }
          }
        }
      }),
      db.notification.count({ where })
    ]);

    const formattedNotifications = notifications.map(notif => ({
      id: notif.id,
      title: notif.title,
      message: notif.message,
      type: notif.type,
      read: notif.read,
      createdAt: notif.createdAt.toISOString(),
      user: {
        id: notif.userId,
        email: notif.user.email,
        role: notif.user.role,
        name: notif.user.volunteerProfile?.fullName || 
              notif.user.organizationProfile?.organizationName || 
              notif.user.collegeProfile?.collegeName || 
              notif.user.email
      }
    }));

    return NextResponse.json({
      notifications: formattedNotifications,
      pagination: {
        total: totalCount,
        limit,
        offset,
        hasMore: offset + limit < totalCount
      }
    });

  } catch (error) {
    console.error("Error fetching notifications:", error);
    return NextResponse.json(
      { error: "Failed to fetch notifications" },
      { status: 500 }
    );
  }
}

// POST - Send notification to users
export async function POST(req: Request) {
  try {
    const session = await auth();

    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const admin = await db.user.findUnique({ where: { id: session.user.id } });
    if (admin?.role !== "SUPER_ADMIN") {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    const { title, message, type, target } = await req.json();

    if (!title || !message) {
      return NextResponse.json(
        { error: "Title and message are required" },
        { status: 400 }
      );
    }

    // Build user filter based on target
    let userFilter: any = {};

    if (target === "volunteers") {
      userFilter.role = "VOLUNTEER";
    } else if (target === "organizations") {
      userFilter.role = "ORGANIZATION";
    } else if (target === "colleges") {
      userFilter.role = "COLLEGE";
    }
    // target === "all" - no filter

    // Get all users to send notification
    const users = await db.user.findMany({
      where: userFilter,
      select: { id: true }
    });

    if (users.length === 0) {
      return NextResponse.json(
        { error: "No users found for this target" },
        { status: 404 }
      );
    }

    // Create notifications for all users
    const notifications = await db.$transaction(
      users.map(user =>
        db.notification.create({
          data: {
            userId: user.id,
            title,
            message,
            type: type || "info",
            read: false
          }
        })
      )
    );

    // Log admin action
    try {
      await db.adminLog.create({
        data: {
          adminId: session.user.id,
          action: "SEND_NOTIFICATION",
          targetId: target,
          targetType: "NOTIFICATION",
          details: {
            title,
            message,
            type,
            recipients: users.length
          }
        }
      });
    } catch (e) {
      console.log("AdminLog table not found, skipping...");
    }

    return NextResponse.json({
      success: true,
      message: `Notification sent to ${users.length} users`,
      recipients: users.length,
      notifications: notifications.length
    });

  } catch (error) {
    console.error("Error sending notification:", error);
    return NextResponse.json(
      { error: "Failed to send notification" },
      { status: 500 }
    );
  }
}

// PUT - Mark notification as read
export async function PUT(req: Request) {
  try {
    const session = await auth();

    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { notificationId, markAll } = await req.json();

    if (markAll) {
      // Mark all notifications as read for this user
      await db.notification.updateMany({
        where: {
          userId: session.user.id,
          read: false
        },
        data: { read: true }
      });
      
      return NextResponse.json({
        success: true,
        message: "All notifications marked as read"
      });
    }

    if (!notificationId) {
      return NextResponse.json(
        { error: "Notification ID required" },
        { status: 400 }
      );
    }

    const notification = await db.notification.update({
      where: { id: notificationId },
      data: { read: true }
    });

    return NextResponse.json({
      success: true,
      message: "Notification marked as read",
      notification
    });

  } catch (error) {
    console.error("Error updating notification:", error);
    return NextResponse.json(
      { error: "Failed to update notification" },
      { status: 500 }
    );
  }
}

// DELETE - Delete notification
export async function DELETE(req: Request) {
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
    const notificationId = searchParams.get("id");

    if (!notificationId) {
      return NextResponse.json(
        { error: "Notification ID required" },
        { status: 400 }
      );
    }

    await db.notification.delete({
      where: { id: notificationId }
    });

    return NextResponse.json({
      success: true,
      message: "Notification deleted successfully"
    });

  } catch (error) {
    console.error("Error deleting notification:", error);
    return NextResponse.json(
      { error: "Failed to delete notification" },
      { status: 500 }
    );
  }
}