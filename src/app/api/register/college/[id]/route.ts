import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { db } from "@/lib/db";

// GET /api/college/students/[id] - Get single student details
export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await auth();
    if (!session?.user?.email) {
      return NextResponse.json(
        { error: "Unauthorized - Please login" },
        { status: 401 }
      );
    }

    const { id: studentId } = await params;

    const collegeUser = await db.user.findUnique({
      where: { email: session.user.email },
      include: { collegeProfile: true }
    });

    if (!collegeUser?.collegeProfile) {
      return NextResponse.json(
        { error: "College profile not found" },
        { status: 404 }
      );
    }

    const student = await db.user.findUnique({
      where: { 
        id: studentId,
        role: "VOLUNTEER"
      },
      include: {
        volunteerProfile: true
      }
    });

    if (!student) {
      return NextResponse.json(
        { error: "Student not found" },
        { status: 404 }
      );
    }

    if (student.volunteerProfile?.college !== collegeUser.collegeProfile.collegeName) {
      return NextResponse.json(
        { error: "Unauthorized - This student does not belong to your college" },
        { status: 403 }
      );
    }

    const workHistory = await db.application.findMany({
      where: {
        applicantId: studentId,
        status: { in: ["COMPLETED", "ACCEPTED"] }
      },
      include: {
        event: {
          include: {
            organizer: {
              include: {
                organizationProfile: true
              }
            }
          }
        }
      },
      orderBy: {
        appliedAt: 'desc'
      }
    });

    const formattedWorkHistory = workHistory.map(app => ({
      id: app.id,
      eventName: app.event.title,
      organizationName: app.event.organizer.organizationProfile?.organizationName || "Unknown",
      date: app.event.startDate,
      role: app.role || "Volunteer",
      hours: 0,
      earnings: 0,
      status: app.status.toLowerCase(),
      rating: 4.5,
      feedback: app.message || null
    }));

    const skills = student.volunteerProfile?.skills 
      ? JSON.parse(student.volunteerProfile.skills) 
      : [];
    
    const interests = student.volunteerProfile?.interests 
      ? JSON.parse(student.volunteerProfile.interests) 
      : [];

    const formattedStudent = {
      id: student.id,
      fullName: student.volunteerProfile?.fullName || "",
      email: student.email,
      phone: student.phone || "",
      profilePhoto: student.profilePhoto || null,
      college: student.volunteerProfile?.college || "",
      course: student.volunteerProfile?.course || "",
      discipline: student.volunteerProfile?.discipline || "",
      yearOfStudy: student.volunteerProfile?.yearOfStudy || "",
      city: student.volunteerProfile?.city || "",
      state: student.volunteerProfile?.state || "",
      bio: student.volunteerProfile?.bio || "",
      emailVerified: student.emailVerified,
      phoneVerified: student.phoneVerified || false,
      createdAt: student.createdAt.toISOString(),
      reputationScore: student.volunteerProfile?.reputationScore || 0,
      completionRate: student.volunteerProfile?.completionRate || 0,
      noShowCount: student.volunteerProfile?.noShowCount || 0,
      totalEvents: student.volunteerProfile?.totalEvents || 0,
      totalHours: student.volunteerProfile?.totalHours || 0,
      totalEarnings: 0,
      skills: skills,
      interests: interests,
      workHistory: formattedWorkHistory
    };

    return NextResponse.json(formattedStudent);

  } catch (error) {
    console.error("Error fetching student details:", error);
    return NextResponse.json(
      { error: "Failed to fetch student details" },
      { status: 500 }
    );
  }
}

// PUT /api/college/students/[id] - Update student details
export async function PUT(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await auth();
    if (!session?.user?.email) {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 }
      );
    }

    const { id: studentId } = await params;
    const body = await req.json();
    const {
      fullName,
      phone,
      course,
      discipline,
      yearOfStudy,
      city,
      state,
      bio
    } = body;

    const collegeUser = await db.user.findUnique({
      where: { email: session.user.email },
      include: { collegeProfile: true }
    });

    if (!collegeUser?.collegeProfile) {
      return NextResponse.json(
        { error: "College profile not found" },
        { status: 404 }
      );
    }

    const student = await db.user.findUnique({
      where: { id: studentId },
      include: { volunteerProfile: true }
    });

    if (!student) {
      return NextResponse.json(
        { error: "Student not found" },
        { status: 404 }
      );
    }

    if (student.volunteerProfile?.college !== collegeUser.collegeProfile.collegeName) {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 403 }
      );
    }

    // ✅ Update phone in User table
    if (phone !== undefined) {
      await db.user.update({
        where: { id: studentId },
        data: { phone: phone || null }
      });
    }

    // ✅ Update other fields in VolunteerProfile
    const updatedProfile = await db.volunteerProfile.update({
      where: { userId: studentId },
      data: {
        fullName: fullName || undefined,
        course: course || undefined,
        discipline: discipline || undefined,
        yearOfStudy: yearOfStudy || undefined,
        city: city || undefined,
        state: state || undefined,
        bio: bio || undefined
      }
    });

    return NextResponse.json({
      message: "Student updated successfully",
      profile: updatedProfile
    });

  } catch (error) {
    console.error("Error updating student:", error);
    return NextResponse.json(
      { error: "Failed to update student" },
      { status: 500 }
    );
  }
}

// DELETE /api/college/students/[id] - Remove student
export async function DELETE(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await auth();
    if (!session?.user?.email) {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 }
      );
    }

    const { id: studentId } = await params;

    const collegeUser = await db.user.findUnique({
      where: { email: session.user.email },
      include: { collegeProfile: true }
    });

    if (!collegeUser?.collegeProfile) {
      return NextResponse.json(
        { error: "College profile not found" },
        { status: 404 }
      );
    }

    const student = await db.user.findUnique({
      where: { id: studentId },
      include: { volunteerProfile: true }
    });

    if (!student) {
      return NextResponse.json(
        { error: "Student not found" },
        { status: 404 }
      );
    }

    if (student.volunteerProfile?.college !== collegeUser.collegeProfile.collegeName) {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 403 }
      );
    }

    await db.user.delete({
      where: { id: studentId }
    });

    return NextResponse.json({
      message: "Student deleted successfully"
    });

  } catch (error) {
    console.error("Error deleting student:", error);
    return NextResponse.json(
      { error: "Failed to delete student" },
      { status: 500 }
    );
  }
}

// PATCH /api/college/students/[id]/verify - Verify student
export async function PATCH(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await auth();
    if (!session?.user?.email) {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 }
      );
    }

    const { id: studentId } = await params;
    const { action } = await req.json();

    const collegeUser = await db.user.findUnique({
      where: { email: session.user.email },
      include: { collegeProfile: true }
    });

    if (!collegeUser?.collegeProfile) {
      return NextResponse.json(
        { error: "College profile not found" },
        { status: 404 }
      );
    }

    const student = await db.user.findUnique({
      where: { id: studentId },
      include: { volunteerProfile: true }
    });

    if (!student) {
      return NextResponse.json(
        { error: "Student not found" },
        { status: 404 }
      );
    }

    if (student.volunteerProfile?.college !== collegeUser.collegeProfile.collegeName) {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 403 }
      );
    }

    if (action === "verify") {
      await db.user.update({
        where: { id: studentId },
        data: {
          emailVerified: true
        }
      });

      return NextResponse.json({
        message: "Student verified successfully"
      });
    } 
    else if (action === "reject") {
      return NextResponse.json({
        message: "Student verification rejected"
      });
    }

    return NextResponse.json(
      { error: "Invalid action" },
      { status: 400 }
    );

  } catch (error) {
    console.error("Error verifying student:", error);
    return NextResponse.json(
      { error: "Failed to verify student" },
      { status: 500 }
    );
  }
}