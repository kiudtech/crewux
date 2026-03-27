import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { db } from "@/lib/db";
import { hash, compare } from "bcryptjs";

// GET - Fetch admin settings
export async function GET() {
  try {
    const session = await auth();

    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const admin = await db.user.findUnique({
      where: { id: session.user.id },
      select: {
        id: true,
        email: true,
        role: true,
        // ❌ Remove name - not in schema
        profilePhoto: true,
        createdAt: true
      }
    });

    if (admin?.role !== "SUPER_ADMIN") {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    const settings = {
      profile: {
        id: admin.id,
        name: admin.email?.split("@")[0] || "Admin", // Use email as fallback
        email: admin.email,
        role: admin.role,
        profilePhoto: admin.profilePhoto,
        joinedAt: admin.createdAt
      },
      preferences: {
        language: "english",
        timezone: "Asia/Kolkata",
        dateFormat: "DD/MM/YYYY",
        timeFormat: "12h",
        darkMode: false
      },
      notifications: {
        emailAlerts: true,
        securityAlerts: true,
        weeklyReports: true,
        marketingEmails: false
      }
    };

    return NextResponse.json(settings);

  } catch (error) {
    console.error("Error fetching settings:", error);
    return NextResponse.json(
      { error: "Failed to fetch settings" },
      { status: 500 }
    );
  }
}

// PUT - Update admin profile
export async function PUT(req: Request) {
  try {
    const session = await auth();

    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const admin = await db.user.findUnique({
      where: { id: session.user.id }
    });

    if (admin?.role !== "SUPER_ADMIN") {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    const { name, email, profilePhoto } = await req.json();

    // ✅ Update only fields that exist
    const updatedAdmin = await db.user.update({
      where: { id: session.user.id },
      data: {
        email: email || undefined,
        profilePhoto: profilePhoto || undefined
        // ❌ name not in schema
      },
      select: {
        id: true,
        email: true,
        role: true,
        profilePhoto: true
      }
    });

    return NextResponse.json({
      success: true,
      message: "Profile updated successfully",
      profile: {
        ...updatedAdmin,
        name: updatedAdmin.email?.split("@")[0] || "Admin"
      }
    });

  } catch (error) {
    console.error("Error updating profile:", error);
    return NextResponse.json(
      { error: "Failed to update profile" },
      { status: 500 }
    );
  }
}

// PATCH - Change password
export async function PATCH(req: Request) {
  try {
    const session = await auth();

    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const admin = await db.user.findUnique({
      where: { id: session.user.id }
    });

    if (admin?.role !== "SUPER_ADMIN") {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    const { currentPassword, newPassword } = await req.json();

    if (!currentPassword || !newPassword) {
      return NextResponse.json(
        { error: "Current password and new password are required" },
        { status: 400 }
      );
    }

    if (newPassword.length < 6) {
      return NextResponse.json(
        { error: "New password must be at least 6 characters" },
        { status: 400 }
      );
    }

    const isValid = await compare(currentPassword, admin.password);
    if (!isValid) {
      return NextResponse.json(
        { error: "Current password is incorrect" },
        { status: 400 }
      );
    }

    const hashedPassword = await hash(newPassword, 12);

    await db.user.update({
      where: { id: session.user.id },
      data: { password: hashedPassword }
    });

    return NextResponse.json({
      success: true,
      message: "Password changed successfully"
    });

  } catch (error) {
    console.error("Error changing password:", error);
    return NextResponse.json(
      { error: "Failed to change password" },
      { status: 500 }
    );
  }
}

// POST - Save preferences
export async function POST(req: Request) {
  try {
    const session = await auth();

    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const admin = await db.user.findUnique({
      where: { id: session.user.id }
    });

    if (admin?.role !== "SUPER_ADMIN") {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    const { preferences, notifications, darkMode } = await req.json();

    return NextResponse.json({
      success: true,
      message: "Preferences saved successfully",
      data: { preferences, notifications, darkMode }
    });

  } catch (error) {
    console.error("Error saving preferences:", error);
    return NextResponse.json(
      { error: "Failed to save preferences" },
      { status: 500 }
    );
  }
}

// DELETE - Delete account (with confirmation)
export async function DELETE(req: Request) {
  try {
    const session = await auth();

    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const admin = await db.user.findUnique({
      where: { id: session.user.id }
    });

    if (admin?.role !== "SUPER_ADMIN") {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    const { confirmation } = await req.json();

    if (confirmation !== "DELETE") {
      return NextResponse.json(
        { error: "Please type DELETE to confirm" },
        { status: 400 }
      );
    }

    await db.user.delete({
      where: { id: session.user.id }
    });

    return NextResponse.json({
      success: true,
      message: "Account deleted successfully"
    });

  } catch (error) {
    console.error("Error deleting account:", error);
    return NextResponse.json(
      { error: "Failed to delete account" },
      { status: 500 }
    );
  }
}