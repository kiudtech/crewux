"use client";

import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import toast from "react-hot-toast";
import { Navbar } from "@/components/layout/Navbar";
import { DashboardSidebar } from "@/components/layout/DashboardSidebar";
import { Input } from "@/components/ui/Input";
import { Select } from "@/components/ui/Select";
import { Button } from "@/components/ui/Button";
import { Card, CardContent, CardHeader } from "@/components/ui/Card";
import { INDIAN_STATES } from "@/lib/constants";

export default function CollegeProfilePage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  const { register, handleSubmit, reset, formState: { errors } } = useForm();

  useEffect(() => {
    if (status === "unauthenticated") router.push("/login");
  }, [status, router]);

  useEffect(() => {
    async function fetchProfile() {
      try {
        const res = await fetch("/api/profile");
        if (res.ok) {
          const data = await res.json();
          const profile = data.collegeProfile;
          if (profile) {
            reset({
              collegeName: profile.collegeName,
              officialEmail: profile.officialEmail,
              contactPerson: profile.contactPerson,
              website: profile.website || "",
              city: profile.city || "",
              state: profile.state || "",
              affiliatedUniversity: profile.affiliatedUniversity || "",
            });
          }
        }
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    }
    if (session?.user) fetchProfile();
  }, [session, reset]);

  const onSubmit = async (data: Record<string, string>) => {
    setSaving(true);
    try {
      const res = await fetch("/api/profile", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          collegeProfile: {
            collegeName: data.collegeName,
            contactPerson: data.contactPerson,
            website: data.website || null,
            city: data.city || null,
            state: data.state || null,
            affiliatedUniversity: data.affiliatedUniversity || null,
          },
        }),
      });

      if (res.ok) {
        toast.success("Profile updated!");
      } else {
        toast.error("Failed to update profile");
      }
    } catch {
      toast.error("Something went wrong");
    } finally {
      setSaving(false);
    }
  };

  if (status === "loading" || loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-600" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      <div className="flex">
        <DashboardSidebar role="COLLEGE" />
        <main className="flex-1 p-6 lg:p-8 max-w-4xl">
          <div className="mb-8">
            <h1 className="text-2xl font-bold text-gray-900">College Profile</h1>
            <p className="text-gray-600 mt-1">Update your institutional information</p>
          </div>

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
            <Card>
              <CardHeader>
                <h2 className="text-lg font-semibold text-gray-900">Institution Details</h2>
              </CardHeader>
              <CardContent className="space-y-4">
                <Input
                  label="College / School Name *"
                  id="collegeName"
                  error={errors.collegeName?.message as string}
                  {...register("collegeName", { required: "Required" })}
                />
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <Input label="Official Email" id="officialEmail" disabled {...register("officialEmail")} />
                  <Input
                    label="Contact Person *"
                    id="contactPerson"
                    error={errors.contactPerson?.message as string}
                    {...register("contactPerson", { required: "Required" })}
                  />
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <Input label="Website" id="website" type="url" {...register("website")} />
                  <Input label="Affiliated University" id="affiliatedUniversity" {...register("affiliatedUniversity")} />
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <Input label="City" id="city" {...register("city")} />
                  <Select
                    label="State"
                    id="state"
                    placeholder="Select state"
                    options={INDIAN_STATES.map((s) => ({ value: s, label: s }))}
                    {...register("state")}
                  />
                </div>
              </CardContent>
            </Card>

            <div className="flex justify-end gap-3">
              <Button type="button" variant="ghost" onClick={() => router.back()}>
                Cancel
              </Button>
              <Button type="submit" isLoading={saving} size="lg">
                Save Changes
              </Button>
            </div>
          </form>
        </main>
      </div>
    </div>
  );
}
