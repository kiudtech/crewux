"use client";

import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { Navbar } from "@/components/layout/Navbar";
import { DashboardSidebar } from "@/components/layout/DashboardSidebar";
import { Card, CardContent } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import {
  Calendar, Users, BarChart3, Plus,
  Star, Shield, FileText
} from "lucide-react";

interface OrgProfile {
  organizationName: string;
  type: string;
  contactPerson: string;
  verificationStatus: string;
  organizationRating: number;
  reliabilityScore: number;
  totalEventsHosted: number;
  shortDescription?: string;
}

interface RecentEvent {
  id: string;
  title: string;
  category: string;
  status: string;
  startDate: string;
  totalSlots: number;
  filledSlots: number;
  _count: { applications: number };
}

export default function OrganizationDashboard() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [profile, setProfile] = useState<OrgProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [recentEvents, setRecentEvents] = useState<RecentEvent[]>([]);
  const [totalApplicants, setTotalApplicants] = useState(0);

  useEffect(() => {
    if (status === "unauthenticated") {
      router.push("/login");
    }
  }, [status, router]);

  useEffect(() => {
    async function fetchData() {
      try {
        const [profileRes, eventsRes, appsRes] = await Promise.all([
          fetch("/api/profile"),
          fetch(`/api/events?organizerId=${session?.user?.id}&status=ALL&limit=5`),
          fetch("/api/applications?limit=1"),
        ]);
        if (profileRes.ok) {
          const data = await profileRes.json();
          setProfile(data.organizationProfile);
        }
        if (eventsRes.ok) {
          const data = await eventsRes.json();
          setRecentEvents(data.events);
        }
        if (appsRes.ok) {
          const data = await appsRes.json();
          setTotalApplicants(data.pagination.total);
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

  const verificationBadge = {
    VERIFIED: { variant: "success" as const, label: "Verified" },
    PENDING: { variant: "warning" as const, label: "Pending Verification" },
    UNVERIFIED: { variant: "danger" as const, label: "Unverified" },
  };

  const badge = verificationBadge[profile?.verificationStatus as keyof typeof verificationBadge] || verificationBadge.UNVERIFIED;

  const stats = [
    { label: "Events Hosted", value: profile?.totalEventsHosted || 0, icon: <Calendar className="w-5 h-5 text-indigo-600" />, bg: "bg-indigo-50" },
    { label: "Organization Rating", value: profile?.organizationRating || 0, icon: <Star className="w-5 h-5 text-amber-600" />, bg: "bg-amber-50" },
    { label: "Reliability Score", value: `${profile?.reliabilityScore || 100}%`, icon: <Shield className="w-5 h-5 text-emerald-600" />, bg: "bg-emerald-50" },
    { label: "Total Applicants", value: totalApplicants, icon: <Users className="w-5 h-5 text-purple-600" />, bg: "bg-purple-50" },
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      <div className="flex">
        <DashboardSidebar role="ORGANIZATION" />
        <main className="flex-1 p-6 lg:p-8">
          {/* Welcome */}
          <div className="flex items-center justify-between mb-8">
            <div>
              <div className="flex items-center gap-3">
                <h1 className="text-2xl font-bold text-gray-900">
                  {profile?.organizationName || "Organization Dashboard"}
                </h1>
                <Badge variant={badge.variant}>{badge.label}</Badge>
              </div>
              <p className="text-gray-600 mt-1">Manage your events and volunteer applications</p>
            </div>
            <button
              onClick={() => router.push("/dashboard/organization/events/create")}
              className="hidden sm:flex items-center gap-2 px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors text-sm font-medium"
            >
              <Plus className="w-4 h-4" />
              Create Event
            </button>
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
                    onClick={() => router.push("/dashboard/organization/events/create")}
                    className="flex items-center gap-3 p-4 rounded-lg border border-gray-200 hover:border-indigo-300 hover:bg-indigo-50 transition-all"
                  >
                    <Plus className="w-5 h-5 text-indigo-600" />
                    <span className="text-sm font-medium text-gray-700">Create New Event</span>
                  </button>
                  <button
                    onClick={() => router.push("/dashboard/organization/events")}
                    className="flex items-center gap-3 p-4 rounded-lg border border-gray-200 hover:border-indigo-300 hover:bg-indigo-50 transition-all"
                  >
                    <Calendar className="w-5 h-5 text-emerald-600" />
                    <span className="text-sm font-medium text-gray-700">Manage Events</span>
                  </button>
                  <button
                    onClick={() => router.push("/dashboard/organization/applications")}
                    className="flex items-center gap-3 p-4 rounded-lg border border-gray-200 hover:border-indigo-300 hover:bg-indigo-50 transition-all"
                  >
                    <FileText className="w-5 h-5 text-purple-600" />
                    <span className="text-sm font-medium text-gray-700">View Applications</span>
                  </button>
                  <button
                    onClick={() => router.push("/dashboard/organization/analytics")}
                    className="flex items-center gap-3 p-4 rounded-lg border border-gray-200 hover:border-indigo-300 hover:bg-indigo-50 transition-all"
                  >
                    <BarChart3 className="w-5 h-5 text-amber-600" />
                    <span className="text-sm font-medium text-gray-700">View Analytics</span>
                  </button>
                </div>
              </CardContent>
            </Card>

            {/* Organization Info */}
            <Card>
              <CardContent>
                <h2 className="text-lg font-semibold text-gray-900 mb-4">Organization Info</h2>
                <div className="space-y-3">
                  <div>
                    <p className="text-xs text-gray-500">Type</p>
                    <p className="text-sm font-medium text-gray-900">{profile?.type?.replace("_", " ") || "—"}</p>
                  </div>
                  <div>
                    <p className="text-xs text-gray-500">Contact Person</p>
                    <p className="text-sm font-medium text-gray-900">{profile?.contactPerson || "—"}</p>
                  </div>
                  <div>
                    <p className="text-xs text-gray-500">Description</p>
                    <p className="text-sm text-gray-700">{profile?.shortDescription || "No description yet."}</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Recent Events */}
          <Card className="mt-6">
            <CardContent>
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-lg font-semibold text-gray-900">Recent Events</h2>
                <button
                  onClick={() => router.push("/dashboard/organization/events")}
                  className="text-sm text-indigo-600 hover:text-indigo-800"
                >
                  View all →
                </button>
              </div>
              {recentEvents.length === 0 ? (
                <div className="text-center py-8 text-gray-500">
                  <Calendar className="w-12 h-12 mx-auto mb-3 text-gray-300" />
                  <p className="text-sm">No events created yet.</p>
                  <p className="text-xs text-gray-400 mt-1">Create your first event to start receiving applications!</p>
                </div>
              ) : (
                <div className="space-y-3">
                  {recentEvents.map((event) => (
                    <button
                      key={event.id}
                      onClick={() => router.push(`/dashboard/organization/events/${event.id}/edit`)}
                      className="w-full flex items-center justify-between p-3 rounded-lg border border-gray-100 hover:border-indigo-200 hover:bg-indigo-50/30 transition-all text-left"
                    >
                      <div className="min-w-0">
                        <p className="font-medium text-gray-900 truncate">{event.title}</p>
                        <p className="text-xs text-gray-500">
                          {new Date(event.startDate).toLocaleDateString("en-IN", { day: "numeric", month: "short" })}
                          {" · "}{event._count.applications} applicants
                          {" · "}{event.totalSlots - event.filledSlots} slots left
                        </p>
                      </div>
                      <Badge
                        variant={event.status === "PUBLISHED" ? "info" : event.status === "ACTIVE" ? "success" : event.status === "DRAFT" ? "default" : "warning"}
                      >
                        {event.status}
                      </Badge>
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
