"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import toast from "react-hot-toast";
import { Input } from "@/components/ui/Input";
import { Select } from "@/components/ui/Select";
import { Button } from "@/components/ui/Button";
import { INDIAN_STATES } from "@/lib/constants";
import type { CollegeRegisterInput } from "@/lib/validations";

export function CollegeRegisterForm() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [otpSent, setOtpSent] = useState(false);
  const [otpVerified, setOtpVerified] = useState(false);
  const [otp, setOtp] = useState("");
  const [checkingEmail, setCheckingEmail] = useState(false);

  const { register, handleSubmit, formState: { errors }, watch, setError, clearErrors } = useForm<CollegeRegisterInput>();
  const password = watch("password");
  const email = watch("officialEmail");

  // Check if email exists
  const checkEmailExists = async () => {
    if (!email) return false;
    
    setCheckingEmail(true);
    try {
      const res = await fetch("/api/auth/check-email", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email })
      });
      
      const data = await res.json();
      
      if (data.exists) {
        setError("officialEmail", { 
          type: "manual", 
          message: "Account already exists! Please login." 
        });
        toast.error(
          <div>
            Account already exists! 
            <button 
              onClick={() => router.push('/login')}
              className="ml-2 underline font-bold"
            >
              Login here
            </button>
          </div>
        );
        return true;
      } else {
        clearErrors("officialEmail");
        return false;
      }
    } catch {
      return false;
    } finally {
      setCheckingEmail(false);
    }
  };

  // Send OTP
  const sendOtp = async () => {
    if (!email) {
      toast.error("Enter email first");
      return;
    }

    const exists = await checkEmailExists();
    if (exists) return;

    try {
      const res = await fetch("/api/auth/send-otp", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email,
          type: "college-signup"
        })
      });

      const data = await res.json();

      if (!res.ok) {
        toast.error(data.error || "Failed to send OTP");
        return;
      }

      setOtpSent(true);
      toast.success("OTP sent to your email");
    } catch {
      toast.error("Error sending OTP");
    }
  };

  // Verify OTP
  const verifyOtp = async () => {
    if (!otp || otp.length !== 6) {
      toast.error("Enter valid 6-digit OTP");
      return;
    }

    try {
      const res = await fetch("/api/auth/verify-otp", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email,
          otp,
          type: "college-signup"
        })
      });

      const data = await res.json();

      if (!data.success) {
        toast.error(data.message || "Invalid OTP");
        return;
      }

      setOtpVerified(true);
      toast.success("Email verified successfully!");
    } catch {
      toast.error("Verification failed");
    }
  };

  const onSubmit = async (data: CollegeRegisterInput) => {
    if (!otpVerified) {
      toast.error("Please verify email first");
      return;
    }

    setIsLoading(true);
    try {
      const res = await fetch("/api/register/college", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...data, otp }),
      });

      const result = await res.json();

      if (!res.ok) {
        toast.error(result.error || "Registration failed");
        return;
      }

      toast.success("College registered! Please sign in.");
      router.push("/login");
    } catch {
      toast.error("Something went wrong");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="bg-white rounded-xl border border-gray-200 p-6 shadow-sm">
      <div className="flex items-center gap-3 mb-6">
        <div className="w-10 h-10 bg-purple-100 rounded-lg flex items-center justify-center">
          <span className="text-purple-600 font-bold">C</span>
        </div>
        <div>
          <h2 className="text-lg font-semibold text-gray-900">College Registration</h2>
          <p className="text-sm text-gray-500">Register your institution on Gig Bharat</p>
        </div>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        <Input
          label="College / School Name *"
          id="collegeName"
          placeholder="Institution name"
          error={errors.collegeName?.message}
          {...register("collegeName", { required: "College name is required" })}
        />

        {/* Email with OTP */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Input
            label="Official Email *"
            id="officialEmail"
            type="email"
            placeholder="admin@college.edu"
            error={errors.officialEmail?.message}
            {...register("officialEmail", { 
              required: "Email is required", 
              pattern: { value: /^\S+@\S+$/i, message: "Invalid email" } 
            })}
            onBlur={checkEmailExists}
          />
          
          <div className="flex items-end gap-2">
            <Button
              type="button"
              onClick={sendOtp}
              disabled={otpVerified || checkingEmail}
              className="flex-1"
              size="sm"
            >
              {checkingEmail ? "Checking..." : (otpVerified ? "Verified ✓" : "Send OTP")}
            </Button>
          </div>
        </div>

        {/* OTP Input */}
        {otpSent && !otpVerified && (
          <div className="flex gap-2 items-end">
            <div className="flex-1">
              <Input
                label="Enter OTP"
                value={otp}
                onChange={(e) => setOtp(e.target.value)}
                placeholder="6-digit code"
                maxLength={6}
              />
            </div>
            <Button type="button" onClick={verifyOtp} size="sm">
              Verify
            </Button>
          </div>
        )}

        <Input
          label="Contact Person *"
          id="contactPerson"
          placeholder="Contact name"
          error={errors.contactPerson?.message}
          {...register("contactPerson", { required: "Contact person is required" })}
        />

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Input
            label="Password *"
            id="password"
            type="password"
            placeholder="Min 6 characters"
            error={errors.password?.message}
            {...register("password", { 
              required: "Password is required", 
              minLength: { value: 6, message: "Min 6 characters" } 
            })}
          />
          <Input
            label="Confirm Password *"
            id="confirmPassword"
            type="password"
            placeholder="Re-enter password"
            error={errors.confirmPassword?.message}
            {...register("confirmPassword", {
              required: "Please confirm password",
              validate: (value) => value === password || "Passwords don't match",
            })}
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Input
            label="Website"
            id="website"
            type="url"
            placeholder="https://college.edu"
            {...register("website")}
          />
          <Input
            label="Affiliated University"
            id="affiliatedUniversity"
            placeholder="University name"
            {...register("affiliatedUniversity")}
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Input
            label="City"
            id="city"
            placeholder="City"
            {...register("city")}
          />
          <Select
            label="State"
            id="state"
            placeholder="Select state"
            options={INDIAN_STATES.map((s) => ({ value: s, label: s }))}
            {...register("state")}
          />
        </div>

        <Button 
          type="submit" 
          isLoading={isLoading} 
          className="w-full" 
          size="lg"
          disabled={!otpVerified}
        >
          {otpVerified ? "Register College" : "Verify Email First"}
        </Button>
      </form>
    </div>
  );
}