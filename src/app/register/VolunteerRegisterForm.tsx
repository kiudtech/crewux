"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import toast from "react-hot-toast";
import { Input } from "@/components/ui/Input";
import { Select } from "@/components/ui/Select";
import { Button } from "@/components/ui/Button";
import { INDIAN_STATES, DISCIPLINES } from "@/lib/constants";
import type { VolunteerRegisterInput } from "@/lib/validations";

export function VolunteerRegisterForm() {

const router = useRouter();

const [isLoading,setIsLoading] = useState(false);
const [otpSent,setOtpSent] = useState(false);
const [otpVerified,setOtpVerified] = useState(false);
const [otp,setOtp] = useState("");

const {
register,
handleSubmit,
formState:{ errors },
watch,
getValues
} = useForm<VolunteerRegisterInput>();

const password = watch("password");
const email = watch("email");

// SEND OTP
const sendOtp = async () => {


if(!email){
  toast.error("Enter email first");
  return;
}

try{

  const res = await fetch("/api/auth/send-otp",{
    method:"POST",
    headers:{ "Content-Type":"application/json" },
    body:JSON.stringify({
      email,
      type:"signup"
    })
  });

  if(!res.ok){
    toast.error("Failed to send OTP");
    return;
  }

  setOtpSent(true);
  toast.success("OTP sent to your email");

}catch{
  toast.error("Error sending OTP");
}


};

// VERIFY OTP
const verifyOtp = async ()=>{


try{

  const res = await fetch("/api/auth/verify-otp",{
    method:"POST",
    headers:{ "Content-Type":"application/json" },
    body:JSON.stringify({
      email,
      otp,
      type:"signup"
    })
  });

  const data = await res.json();

  if(!data.success){
    toast.error(data.message || "Invalid OTP");
    return;
  }

  setOtpVerified(true);
  toast.success("OTP verified");

}catch{
  toast.error("Verification failed");
}


};

// REGISTER USER
const onSubmit = async (data: VolunteerRegisterInput) => {


if(!otpVerified){
  toast.error("Please verify OTP first");
  return;
}

setIsLoading(true);

try {

  const res = await fetch("/api/register/volunteer", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      ...data,
      otp
    }),
  });

  const result = await res.json();

  if (!res.ok) {
    toast.error(result.error || "Registration failed");
    return;
  }

  toast.success("Account created successfully!");
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
    <div className="w-10 h-10 bg-indigo-100 rounded-lg flex items-center justify-center">
      <span className="text-indigo-600 font-bold">V</span>
    </div>
    <div>
      <h2 className="text-lg font-semibold text-gray-900">Volunteer Registration</h2>
      <p className="text-sm text-gray-500">Create your volunteer profile</p>
    </div>
  </div>

  <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">

    {/* NAME + EMAIL */}

    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">

      <Input
        label="Full Name *"
        id="fullName"
        placeholder="Enter your full name"
        error={errors.fullName?.message}
        {...register("fullName",{ required:"Full name required" })}
      />

      <div className="flex flex-col gap-2">

        <Input
          label="Email *"
          id="email"
          type="email"
          placeholder="you@example.com"
          error={errors.email?.message}
          {...register("email",{ required:"Email required" })}
        />

        <Button
          type="button"
          onClick={sendOtp}
          size="sm"
          className="w-fit"
        >
          Send OTP
        </Button>

      </div>

    </div>

    {/* OTP INPUT */}

    {otpSent && (

      <div className="flex gap-2">

        <Input
          label="Enter OTP"
          value={otp}
          onChange={(e)=>setOtp(e.target.value)}
        />

        <Button
          type="button"
          onClick={verifyOtp}
          size="sm"
        >
          Verify OTP
        </Button>

      </div>

    )}

    {/* PASSWORD */}

    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">

      <Input
        label="Password *"
        id="password"
        type="password"
        placeholder="Min 6 characters"
        error={errors.password?.message}
        {...register("password",{ required:true })}
      />

      <Input
        label="Confirm Password *"
        id="confirmPassword"
        type="password"
        placeholder="Re-enter password"
        error={errors.confirmPassword?.message}
        {...register("confirmPassword",{
          validate:(value)=> value===password || "Passwords don't match"
        })}
      />

    </div>

    {/* PHONE */}

    <Input
      label="Phone"
      id="phone"
      {...register("phone")}
    />

    {/* COLLEGE */}

    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">

      <Input
        label="College"
        {...register("college")}
      />

      <Input
        label="Course"
        {...register("course")}
      />

    </div>

    {/* DISCIPLINE */}

    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">

      <Select
        label="Discipline"
        options={DISCIPLINES.map(d=>({value:d,label:d}))}
        {...register("discipline")}
      />

      <Select
        label="Year"
        options={[
          {value:"1",label:"1st Year"},
          {value:"2",label:"2nd Year"},
          {value:"3",label:"3rd Year"},
          {value:"4",label:"4th Year"}
        ]}
        {...register("yearOfStudy")}
      />

    </div>

    {/* LOCATION */}

    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">

      <Input
        label="City"
        {...register("city")}
      />

      <Select
        label="State"
        options={INDIAN_STATES.map(s=>({value:s,label:s}))}
        {...register("state")}
      />

    </div>

    {/* SUBMIT */}

    <Button
      type="submit"
      isLoading={isLoading}
      disabled={!otpVerified}
      className="w-full"
      size="lg"
    >
      Create Volunteer Account
    </Button>

  </form>

</div>


);

}
