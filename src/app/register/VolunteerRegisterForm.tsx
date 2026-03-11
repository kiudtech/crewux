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
  const [isLoading, setIsLoading] = useState(false);

  const { register, handleSubmit, formState: { errors }, watch } = useForm<VolunteerRegisterInput>();
  const password = watch("password");

  const onSubmit = async (data: VolunteerRegisterInput) => {
    setIsLoading(true);
    try {
      const res = await fetch("/api/register/volunteer", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });

      const result = await res.json();

      if (!res.ok) {
        toast.error(result.error || "Registration failed");
        return;
      }

      toast.success("Account created! Please sign in.");
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
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Input
            label="Full Name *"
            id="fullName"
            placeholder="Enter your full name"
            error={errors.fullName?.message}
            {...register("fullName", { required: "Full name is required", minLength: { value: 2, message: "Min 2 characters" } })}
          />
          <Input
            label="Email *"
            id="email"
            type="email"
            placeholder="you@example.com"
            error={errors.email?.message}
            {...register("email", { required: "Email is required", pattern: { value: /^\S+@\S+$/i, message: "Invalid email" } })}
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Input
            label="Password *"
            id="password"
            type="password"
            placeholder="Min 6 characters"
            error={errors.password?.message}
            {...register("password", { required: "Password is required", minLength: { value: 6, message: "Min 6 characters" } })}
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

        <Input
          label="Phone"
          id="phone"
          type="tel"
          placeholder="+91 XXXXX XXXXX"
          {...register("phone")}
        />

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Input
            label="College / School"
            id="college"
            placeholder="Your institution"
            {...register("college")}
          />
          <Input
            label="Course"
            id="course"
            placeholder="e.g., B.Tech, BBA"
            {...register("course")}
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Select
            label="Discipline"
            id="discipline"
            placeholder="Select discipline"
            options={DISCIPLINES.map((d) => ({ value: d, label: d }))}
            {...register("discipline")}
          />
          <Select
            label="Year of Study"
            id="yearOfStudy"
            placeholder="Select year"
            options={[
              { value: "1", label: "1st Year" },
              { value: "2", label: "2nd Year" },
              { value: "3", label: "3rd Year" },
              { value: "4", label: "4th Year" },
              { value: "5", label: "5th Year" },
              { value: "graduated", label: "Graduated" },
            ]}
            {...register("yearOfStudy")}
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Input
            label="City"
            id="city"
            placeholder="Your city"
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
        <div className="flex items-start gap-2 text-sm text-gray-600">
        <input type="checkbox" required className="mt-1" />

      <p>
        I agree to the{" "}
        <a href="/terms" className="text-indigo-600 underline">
          Terms & Conditions
        </a>{" "}
        and{" "}
        <a href="/task-policy" className="text-indigo-600 underline">
      Task Policy
    </a>
  </p>
</div>

        <Button type="submit" isLoading={isLoading} className="w-full" size="lg">
          Create Volunteer Account
        </Button>
      </form>
    </div>
  );
}
