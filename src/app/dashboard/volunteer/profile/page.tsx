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
import { Textarea } from "@/components/ui/Textarea";
import { Button } from "@/components/ui/Button";
import { Card, CardContent, CardHeader } from "@/components/ui/Card";
import { INDIAN_STATES, DISCIPLINES, SKILLS } from "@/lib/constants";

interface ProfileData {
  phone?: string;
  volunteerProfile: {
    fullName: string;
    college?: string;
    course?: string;
    discipline?: string;
    yearOfStudy?: string;
    skills: string;
    interests: string;
    availability?: string;
    experience?: string;
    portfolio?: string;
    location?: string;
    city?: string;
    state?: string;
    bio?: string;
  };
}

export default function VolunteerProfilePage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [selectedSkills, setSelectedSkills] = useState<string[]>([]);

  const { register, handleSubmit, reset, formState: { errors } } = useForm();

  useEffect(() => {
    if (status === "unauthenticated") router.push("/login");
  }, [status, router]);

  useEffect(() => {
    async function fetchProfile() {
      try {
        const res = await fetch("/api/profile");
        if (res.ok) {
          const data: ProfileData = await res.json();
          const profile = data.volunteerProfile;
          if (profile) {
            reset({
              fullName: profile.fullName,
              college: profile.college || "",
              course: profile.course || "",
              discipline: profile.discipline || "",
              yearOfStudy: profile.yearOfStudy || "",
              availability: profile.availability || "",
              experience: profile.experience || "",
              portfolio: profile.portfolio || "",
              city: profile.city || "",
              state: profile.state || "",
              bio: profile.bio || "",
              phone: data.phone || "",
            });
            setSelectedSkills(JSON.parse(profile.skills || "[]"));
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

  const toggleSkill = (skill: string) => {
    setSelectedSkills((prev) =>
      prev.includes(skill) ? prev.filter((s) => s !== skill) : [...prev, skill]
    );
  };

  const onSubmit = async (data: Record<string, string>) => {
    setSaving(true);
    try {
      const res = await fetch("/api/profile", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          phone: data.phone,
          volunteerProfile: {
            fullName: data.fullName,
            college: data.college || null,
            course: data.course || null,
            discipline: data.discipline || null,
            yearOfStudy: data.yearOfStudy || null,
            skills: JSON.stringify(selectedSkills),
            availability: data.availability || null,
            experience: data.experience || null,
            portfolio: data.portfolio || null,
            city: data.city || null,
            state: data.state || null,
            bio: data.bio || null,
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
        <DashboardSidebar role="VOLUNTEER" />
        <main className="flex-1 p-6 lg:p-8 max-w-4xl">
          <div className="mb-8">
            <h1 className="text-2xl font-bold text-gray-900">Edit Profile</h1>
            <p className="text-gray-600 mt-1">Update your volunteer profile information</p>
          </div>

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
            {/* Personal Information */}
            <Card>
              <CardHeader>
                <h2 className="text-lg font-semibold text-gray-900">Personal Information</h2>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <Input
                    label="Full Name *"
                    id="fullName"
                    error={errors.fullName?.message as string}
                    {...register("fullName", { required: "Name is required" })}
                  />
                  <Input label="Phone" id="phone" type="tel" {...register("phone")} />
                </div>
                <Textarea
                  label="Bio"
                  id="bio"
                  placeholder="Tell us about yourself..."
                  {...register("bio")}
                />
              </CardContent>
            </Card>

            {/* Education */}
            <Card>
              <CardHeader>
                <h2 className="text-lg font-semibold text-gray-900">Education</h2>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <Input label="College / School" id="college" {...register("college")} />
                  <Input label="Course" id="course" placeholder="e.g., B.Tech" {...register("course")} />
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <Select
                    label="Discipline"
                    id="discipline"
                    placeholder="Select"
                    options={DISCIPLINES.map((d) => ({ value: d, label: d }))}
                    {...register("discipline")}
                  />
                  <Select
                    label="Year of Study"
                    id="yearOfStudy"
                    placeholder="Select"
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
              </CardContent>
            </Card>

            {/* Skills */}
            <Card>
              <CardHeader>
                <h2 className="text-lg font-semibold text-gray-900">Skills</h2>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-gray-600 mb-3">Select your skills (used for event matching)</p>
                <div className="flex flex-wrap gap-2">
                  {SKILLS.map((skill) => (
                    <button
                      key={skill}
                      type="button"
                      onClick={() => toggleSkill(skill)}
                      className={`px-3 py-1.5 rounded-full text-xs font-medium transition-all ${
                        selectedSkills.includes(skill)
                          ? "bg-indigo-600 text-white"
                          : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                      }`}
                    >
                      {skill}
                    </button>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Additional */}
            <Card>
              <CardHeader>
                <h2 className="text-lg font-semibold text-gray-900">Additional Details</h2>
              </CardHeader>
              <CardContent className="space-y-4">
                <Select
                  label="Availability"
                  id="availability"
                  placeholder="Select availability"
                  options={[
                    { value: "WEEKENDS", label: "Weekends Only" },
                    { value: "FULL_TIME", label: "Full-time" },
                    { value: "ONLINE_ONLY", label: "Online Only" },
                    { value: "FLEXIBLE", label: "Flexible" },
                  ]}
                  {...register("availability")}
                />
                <Input label="Portfolio / Website" id="portfolio" type="url" placeholder="https://" {...register("portfolio")} />
                <Textarea
                  label="Past Experience"
                  id="experience"
                  placeholder="Brief description of your volunteering experience..."
                  {...register("experience")}
                />
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
