// app/api/auth/verify-otp/route.ts
import { NextResponse } from "next/server"
import { db } from "@/lib/db"

type OtpType = "signup" | "forgot-password" | "login"

export async function POST(req: Request) {
  try {
    const body = await req.json()
    const { email, otp, type } = body as { 
      email: string; 
      otp: string; 
      type: OtpType 
    }

    const otpType: OtpType = type || "signup"

    if (!email || !otp) {
      return NextResponse.json({
        success: false,
        message: "Email and OTP required"
      })
    }

    // Find OTP record
    const record = await db.otp.findFirst({
      where: {
        email,
        otp,
        otpType
      }
    })

    // Check if OTP exists
    if (!record) {
      return NextResponse.json({
        success: false,
        message: "Invalid OTP"
      })
    }

    // Check if OTP expired
    if (record.expiresAt < new Date()) {
      // Delete expired OTP
      await db.otp.deleteMany({
        where: { email, otpType }
      })
      
      return NextResponse.json({
        success: false,
        message: "OTP expired"
      })
    }

    // Don't delete OTP here - let it be used in registration
    // OTP will be deleted after successful registration

    return NextResponse.json({
      success: true,
      message: "OTP verified successfully"
    })

  } catch (error) {
    console.error("Verify OTP Error:", error)
    return NextResponse.json(
      { 
        success: false,
        error: "Verification failed" 
      },
      { status: 500 }
    )
  }
}