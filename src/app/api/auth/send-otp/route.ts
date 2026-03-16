// app/api/auth/send-otp/route.ts
import { NextResponse } from "next/server"
import { db } from "@/lib/db"
import nodemailer from "nodemailer"

// Define types
type OtpType = "signup" | "forgot-password" | "login"

export async function POST(req: Request) {
  try {
    const body = await req.json()
    const { email, type } = body as { email: string; type: OtpType }

    if (!email) {
      return NextResponse.json({ error: "Email required" }, { status: 400 })
    }

    // Generate 6-digit OTP
    const otp = Math.floor(100000 + Math.random() * 900000).toString()
    const otpType: OtpType = type || "signup"

    // Delete old OTPs
    await db.otp.deleteMany({
      where: { 
        email, 
        otpType 
      }
    })

    // Create new OTP
    await db.otp.create({
      data: {
        email,
        otp,
        otpType,
        expiresAt: new Date(Date.now() + 5 * 60 * 1000) // 5 minutes
      }
    })

    // Email config
    const transporter = nodemailer.createTransport({
      host: "smtp.gmail.com",
      port: 587, // Use 587 for TLS
      secure: false, // false for 587
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS
      },
      tls: {
        rejectUnauthorized: false // Only for development
      }
    })

    await transporter.sendMail({
      from: `"Crewux" <${process.env.EMAIL_USER}>`,
      to: email,
      subject: "Crewux OTP Verification",
      html: `
        <div style="font-family: Arial, sans-serif; padding: 20px; max-width: 500px;">
          <h2 style="color: #4F46E5;">OTP Verification</h2>
          <p>Your OTP for ${otpType} is:</p>
          <h1 style="color: #4F46E5; font-size: 36px; letter-spacing: 5px;">${otp}</h1>
          <p>This OTP will expire in <strong>5 minutes</strong>.</p>
          <hr style="border: 1px solid #eee;" />
          <p style="color: #666; font-size: 12px;">If you didn't request this, please ignore this email.</p>
        </div>
      `
    })

    return NextResponse.json({ 
      success: true,
      message: "OTP sent successfully" 
    })

  } catch (error) {
    console.error("Send OTP Error:", error)
    return NextResponse.json(
      { error: "Failed to send OTP. Check email configuration." },
      { status: 500 }
    )
  }
}