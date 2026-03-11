"use client";

import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { Navbar } from "@/components/layout/Navbar";
import { DashboardSidebar } from "@/components/layout/DashboardSidebar";
import { Card, CardContent } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import {
  Users, GraduationCap, Clock, BarChart3, FileText
} from "lucide-react";

interface CollegeProfileData {
  collegeName: string;
  contactPerson: string;
  verificationStatus: string;
  totalStudents: number;
  affiliatedUniversity?: string;
}

export default function CollegeDashboard() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [profile, setProfile] = useState<CollegeProfileData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (status === "unauthenticated") router.push("/login");
  }, [status, router]);

  useEffect(() => {
    async function fetchProfile() {
      try {
        const res = await fetch("/api/profile");
        if (res.ok) {
          const data = await res.json();
          setProfile(data.collegeProfile);
        }
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    }
    if (session?.user) fetchProfile();
  }, [session]);

  if (status === "loading" || loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-600" />
      </div>
    );
  }

  const verificationBadge = {
    VERIFIED: { variant: "success" as const, label: "Verified" },
    PENDING: { variant: "warning" as const, label: "Pending" },
    UNVERIFIED: { variant: "danger" as const, label: "Unverified" },
  };

  const badge = verificationBadge[profile?.verificationStatus as keyof typeof verificationBadge] || verificationBadge.UNVERIFIED;

  const stats = [
    { label: "Students Registered", value: profile?.totalStudents || 0, icon: <Users className="w-5 h-5 text-indigo-600" />, bg: "bg-indigo-50" },
    { label: "Active Volunteers", value: 0, icon: <GraduationCap className="w-5 h-5 text-emerald-600" />, bg: "bg-emerald-50" },
    { label: "Total Hours", value: "0h", icon: <Clock className="w-5 h-5 text-amber-600" />, bg: "bg-amber-50" },
    { label: "Events Participated", value: 0, icon: <BarChart3 className="w-5 h-5 text-purple-600" />, bg: "bg-purple-50" },
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      <div className="flex">
        <DashboardSidebar role="COLLEGE" />
        <main className="flex-1 p-6 lg:p-8">
          <div className="mb-8">
            <div className="flex items-center gap-3">
              <h1 className="text-2xl font-bold text-gray-900">
                {profile?.collegeName || "College Dashboard"}
              </h1>
              <Badge variant={badge.variant}>{badge.label}</Badge>
            </div>
            <p className="text-gray-600 mt-1">
              {profile?.affiliatedUniversity ? `Affiliated to ${profile.affiliatedUniversity}` : "Manage students and track volunteering records"}
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
            {stats.map((stat) => (
              <Card key={stat.label}>
                <CardContent className="flex items-center gap-4">
                  <div className={`w-12 h-12 ${stat.bg} rounded-lg flex items-center justify-center`}>
                    {stat.icon}
                  </div>
                  <div>
                    <p className="text-2xl font-bold text-gray-900">{stat.value}</p>
                    <p className="text-sm text-gray-500">{stat.label}</p>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card>
              <CardContent>
                <h2 className="text-lg font-semibold text-gray-900 mb-4">Quick Actions</h2>
                <div className="space-y-3">
                  <button
                    onClick={() => router.push("/dashboard/college/students")}
                    className="flex items-center gap-3 p-4 rounded-lg border border-gray-200 hover:border-indigo-300 hover:bg-indigo-50 transition-all w-full"
                  >
                    <Users className="w-5 h-5 text-indigo-600" />
                    <span className="text-sm font-medium text-gray-700">Manage Students</span>
                  </button>
                  <button
                    onClick={() => router.push("/dashboard/college/reports")}
                    className="flex items-center gap-3 p-4 rounded-lg border border-gray-200 hover:border-indigo-300 hover:bg-indigo-50 transition-all w-full"
                  >
                    <FileText className="w-5 h-5 text-emerald-600" />
                    <span className="text-sm font-medium text-gray-700">Generate Reports</span>
                  </button>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent>
                <h2 className="text-lg font-semibold text-gray-900 mb-4">College Info</h2>
                <div className="space-y-3">
                  <div>
                    <p className="text-xs text-gray-500">Contact Person</p>
                    <p className="text-sm font-medium text-gray-900">{profile?.contactPerson || "—"}</p>
                  </div>
                  <div>
                    <p className="text-xs text-gray-500">Affiliated University</p>
                    <p className="text-sm font-medium text-gray-900">{profile?.affiliatedUniversity || "—"}</p>
                  </div>
                  <div>
                    <p className="text-xs text-gray-500">Total Students</p>
                    <p className="text-sm font-medium text-gray-900">{profile?.totalStudents || 0}</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </main>
      </div>
    </div>
  );
}
