"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import toast from "react-hot-toast";
import { Input } from "@/components/ui/Input";
import { Select } from "@/components/ui/Select";
import { Textarea } from "@/components/ui/Textarea";
import { Button } from "@/components/ui/Button";
import { INDIAN_STATES, ORG_TYPES } from "@/lib/constants";
import type { OrganizationRegisterInput } from "@/lib/validations";

export function OrganizationRegisterForm() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);

  const { register, handleSubmit, formState: { errors }, watch } = useForm<OrganizationRegisterInput>();
  const password = watch("password");

  const onSubmit = async (data: OrganizationRegisterInput) => {
    setIsLoading(true);
    try {
      const res = await fetch("/api/register/organization", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });

      const result = await res.json();

      if (!res.ok) {
        toast.error(result.error || "Registration failed");
        return;
      }

      toast.success("Organization registered! Please sign in.");
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
        <div className="w-10 h-10 bg-emerald-100 rounded-lg flex items-center justify-center">
          <span className="text-emerald-600 font-bold">O</span>
        </div>
        <div>
          <h2 className="text-lg font-semibold text-gray-900">Organization Registration</h2>
          <p className="text-sm text-gray-500">Register your organization on Gig Bharat</p>
        </div>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Input
            label="Organization Name *"
            id="organizationName"
            placeholder="Your organization name"
            error={errors.organizationName?.message}
            {...register("organizationName", { required: "Organization name is required" })}
          />
          <Select
            label="Organization Type *"
            id="type"
            placeholder="Select type"
            options={ORG_TYPES}
            error={errors.type?.message}
            {...register("type", { required: "Please select organization type" })}
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Input
            label="Official Email *"
            id="officialEmail"
            type="email"
            placeholder="org@example.com"
            error={errors.officialEmail?.message}
            {...register("officialEmail", { required: "Email is required", pattern: { value: /^\S+@\S+$/i, message: "Invalid email" } })}
          />
          <Input
            label="Contact Person *"
            id="contactPerson"
            placeholder="Contact name"
            error={errors.contactPerson?.message}
            {...register("contactPerson", { required: "Contact person is required" })}
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

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Input
            label="Website"
            id="website"
            type="url"
            placeholder="https://yourorg.com"
            {...register("website")}
          />
          <Input
            label="LinkedIn"
            id="linkedin"
            placeholder="LinkedIn profile URL"
            {...register("linkedin")}
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

        <Textarea
          label="Short Description"
          id="shortDescription"
          placeholder="Tell us about your organization (max 500 characters)"
          {...register("shortDescription", { maxLength: { value: 500, message: "Max 500 characters" } })}
        />

        <Button type="submit" isLoading={isLoading} className="w-full" size="lg">
          Register Organization
        </Button>
      </form>
    </div>
  );
}
