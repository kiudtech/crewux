"use client";

import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { Navbar } from "@/components/layout/Navbar";
import { DashboardSidebar } from "@/components/layout/DashboardSidebar";
import { Card, CardContent } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import {
  Calendar, FileText, Award, TrendingUp,
  Clock, Star, Zap
} from "lucide-react";

interface VolunteerProfile {
  fullName: string;
  college?: string;
  course?: string;
  reputationScore: number;
  completionRate: number;
  totalEvents: number;
  totalHours: number;
  skills: string;
  bio?: string;
}

interface RecentApplication {
  id: string;
  status: string;
  appliedAt: string;
  event: {
    id: string;
    title: string;
    startDate: string;
    organizer: {
      organizationProfile?: {
        organizationName: string;
      } | null;
    };
  };
}

export default function VolunteerDashboard() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [profile, setProfile] = useState<VolunteerProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [recentApps, setRecentApps] = useState<RecentApplication[]>([]);

  useEffect(() => {
    if (status === "unauthenticated") {
      router.push("/login");
    }
  }, [status, router]);

  useEffect(() => {
    async function fetchData() {
      try {
        const [profileRes, appsRes] = await Promise.all([
          fetch("/api/profile"),
          fetch("/api/applications?limit=5"),
        ]);
        if (profileRes.ok) {
          const data = await profileRes.json();
          setProfile(data.volunteerProfile);
        }
        if (appsRes.ok) {
          const data = await appsRes.json();
          setRecentApps(data.applications);
        }
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    }
    if (session?.user) fetchData();
  }, [session]);

  if (status === "loading" || loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-600" />
      </div>
    );
  }

  const skills = profile?.skills ? JSON.parse(profile.skills) : [];

  const stats = [
    { label: "Events Participated", value: profile?.totalEvents || 0, icon: <Calendar className="w-5 h-5 text-indigo-600" />, bg: "bg-indigo-50" },
    { label: "Total Hours", value: `${profile?.totalHours || 0}h`, icon: <Clock className="w-5 h-5 text-emerald-600" />, bg: "bg-emerald-50" },
    { label: "Completion Rate", value: `${profile?.completionRate || 100}%`, icon: <TrendingUp className="w-5 h-5 text-amber-600" />, bg: "bg-amber-50" },
    { label: "Reputation Score", value: profile?.reputationScore || 0, icon: <Star className="w-5 h-5 text-purple-600" />, bg: "bg-purple-50" },
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      <div className="flex">
        <DashboardSidebar role="VOLUNTEER" />
        <main className="flex-1 p-6 lg:p-8">
          {/* Welcome Section */}
          <div className="mb-8">
            <h1 className="text-2xl font-bold text-gray-900">
              Welcome back, {profile?.fullName || session?.user?.email?.split("@")[0]}! 
            </h1>
            <p className="text-gray-600 mt-1">Here&apos;s your volunteer dashboard overview</p>
          </div>

          {/* Stats Grid */}
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

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Quick Actions */}
            <Card className="lg:col-span-2">
              <CardContent>
                <h2 className="text-lg font-semibold text-gray-900 mb-4">Quick Actions</h2>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <button
                    onClick={() => router.push("/dashboard/volunteer/events")}
                    className="flex items-center gap-3 p-4 rounded-lg border border-gray-200 hover:border-indigo-300 hover:bg-indigo-50 transition-all"
                  >
                    <Calendar className="w-5 h-5 text-indigo-600" />
                    <span className="text-sm font-medium text-gray-700">Browse Events</span>
                  </button>
                  <button
                    onClick={() => router.push("/dashboard/volunteer/applications")}
                    className="flex items-center gap-3 p-4 rounded-lg border border-gray-200 hover:border-indigo-300 hover:bg-indigo-50 transition-all"
                  >
                    <FileText className="w-5 h-5 text-emerald-600" />
                    <span className="text-sm font-medium text-gray-700">My Applications</span>
                  </button>
                  <button
                    onClick={() => router.push("/dashboard/volunteer/certificates")}
                    className="flex items-center gap-3 p-4 rounded-lg border border-gray-200 hover:border-indigo-300 hover:bg-indigo-50 transition-all"
                  >
                    <Award className="w-5 h-5 text-purple-600" />
                    <span className="text-sm font-medium text-gray-700">Certificates</span>
                  </button>
                  <button
                    onClick={() => router.push("/dashboard/volunteer/profile")}
                    className="flex items-center gap-3 p-4 rounded-lg border border-gray-200 hover:border-indigo-300 hover:bg-indigo-50 transition-all"
                  >
                    <Zap className="w-5 h-5 text-amber-600" />
                    <span className="text-sm font-medium text-gray-700">Edit Profile</span>
                  </button>
                </div>
              </CardContent>
            </Card>

            {/* Skills */}
            <Card>
              <CardContent>
                <h2 className="text-lg font-semibold text-gray-900 mb-4">My Skills</h2>
                {skills.length > 0 ? (
                  <div className="flex flex-wrap gap-2">
                    {skills.map((skill: string) => (
                      <Badge key={skill} variant="info">{skill}</Badge>
                    ))}
                  </div>
                ) : (
                  <p className="text-sm text-gray-500">
                    No skills added yet.{" "}
                    <button onClick={() => router.push("/dashboard/volunteer/profile")} className="text-indigo-600 hover:underline">
                      Add skills
                    </button>
                  </p>
                )}
              </CardContent>
            </Card>
          </div>

          {/* Recent Activity */}
          <Card className="mt-6">
            <CardContent>
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-lg font-semibold text-gray-900">Recent Applications</h2>
                <button
                  onClick={() => router.push("/dashboard/volunteer/applications")}
                  className="text-sm text-indigo-600 hover:text-indigo-800"
                >
                  View all →
                </button>
              </div>
              {recentApps.length === 0 ? (
                <div className="text-center py-8 text-gray-500">
                  <Calendar className="w-12 h-12 mx-auto mb-3 text-gray-300" />
                  <p className="text-sm">No recent activity yet.</p>
                  <p className="text-xs text-gray-400 mt-1">Start by browsing and applying to events!</p>
                </div>
              ) : (
                <div className="space-y-3">
                  {recentApps.map((app) => (
                    <button
                      key={app.id}
                      onClick={() => router.push(`/events/${app.event.id}`)}
                      className="w-full flex items-center justify-between p-3 rounded-lg border border-gray-100 hover:border-indigo-200 hover:bg-indigo-50/30 transition-all text-left"
                    >
                      <div className="min-w-0">
                        <p className="font-medium text-gray-900 truncate">{app.event.title}</p>
                        <p className="text-xs text-gray-500">
                          {app.event.organizer?.organizationProfile?.organizationName || "Unknown Org"}
                          {" · "}Applied {new Date(app.appliedAt).toLocaleDateString("en-IN", { day: "numeric", month: "short" })}
                        </p>
                      </div>
                      <span className={`text-xs font-medium px-2 py-1 rounded-full ${
                        app.status === "ACCEPTED" ? "bg-emerald-100 text-emerald-700" :
                        app.status === "SHORTLISTED" ? "bg-amber-100 text-amber-700" :
                        app.status === "REJECTED" ? "bg-red-100 text-red-700" :
                        app.status === "WITHDRAWN" ? "bg-gray-100 text-gray-500" :
                        "bg-blue-100 text-blue-700"
                      }`}>
                        {app.status}
                      </span>
                    </button>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </main>
      </div>
    </div>
  );
}
