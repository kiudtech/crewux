"use client";

import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { Navbar } from "@/components/layout/Navbar";
import { DashboardSidebar } from "@/components/layout/DashboardSidebar";
import { Card, CardContent } from "@/components/ui/Card";
import {
  Users, Building2, Calendar, Shield,
  BarChart3, AlertTriangle, CheckCircle, XCircle
} from "lucide-react";

interface PlatformStats {
  totalUsers: number;
  totalOrganizations: number;
  totalVolunteers: number;
  totalColleges: number;
  pendingVerifications: number;
}

export default function SuperAdminDashboard() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [stats, setStats] = useState<PlatformStats | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (status === "unauthenticated") router.push("/login");
    if (status === "authenticated" && session?.user?.role !== "SUPER_ADMIN") {
      router.push("/dashboard");
    }
  }, [status, session, router]);

  useEffect(() => {
    async function fetchStats() {
      try {
        const res = await fetch("/api/admin/stats");
        if (res.ok) {
          const data = await res.json();
          setStats(data);
        }
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    }
    if (session?.user?.role === "SUPER_ADMIN") fetchStats();
  }, [session]);

  if (status === "loading" || loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-600" />
      </div>
    );
  }

  const statCards = [
    { label: "Total Users", value: stats?.totalUsers || 0, icon: <Users className="w-5 h-5 text-indigo-600" />, bg: "bg-indigo-50" },
    { label: "Organizations", value: stats?.totalOrganizations || 0, icon: <Building2 className="w-5 h-5 text-emerald-600" />, bg: "bg-emerald-50" },
    { label: "Volunteers", value: stats?.totalVolunteers || 0, icon: <Users className="w-5 h-5 text-blue-600" />, bg: "bg-blue-50" },
    { label: "Colleges", value: stats?.totalColleges || 0, icon: <Calendar className="w-5 h-5 text-purple-600" />, bg: "bg-purple-50" },
    { label: "Pending Verifications", value: stats?.pendingVerifications || 0, icon: <Shield className="w-5 h-5 text-amber-600" />, bg: "bg-amber-50" },
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      <div className="flex">
        <DashboardSidebar role="SUPER_ADMIN" />
        <main className="flex-1 p-6 lg:p-8">
          <div className="mb-8">
            <h1 className="text-2xl font-bold text-gray-900">Admin Control Panel</h1>
            <p className="text-gray-600 mt-1">Platform overview and management</p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4 mb-8">
            {statCards.map((stat) => (
              <Card key={stat.label}>
                <CardContent className="text-center py-4">
                  <div className={`w-10 h-10 ${stat.bg} rounded-lg flex items-center justify-center mx-auto mb-2`}>
                    {stat.icon}
                  </div>
                  <p className="text-2xl font-bold text-gray-900">{stat.value}</p>
                  <p className="text-xs text-gray-500">{stat.label}</p>
                </CardContent>
              </Card>
            ))}
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card>
              <CardContent>
                <h2 className="text-lg font-semibold text-gray-900 mb-4">Admin Actions</h2>
                <div className="space-y-3">
                  <button
                    onClick={() => router.push("/dashboard/super-admin/organizations")}
                    className="flex items-center gap-3 p-4 rounded-lg border border-gray-200 hover:border-indigo-300 hover:bg-indigo-50 transition-all w-full"
                  >
                    <Building2 className="w-5 h-5 text-indigo-600" />
                    <span className="text-sm font-medium text-gray-700">Manage Organizations</span>
                  </button>
                  <button
                    onClick={() => router.push("/dashboard/super-admin/verification")}
                    className="flex items-center gap-3 p-4 rounded-lg border border-gray-200 hover:border-amber-300 hover:bg-amber-50 transition-all w-full"
                  >
                    <Shield className="w-5 h-5 text-amber-600" />
                    <span className="text-sm font-medium text-gray-700">Verification Queue</span>
                  </button>
                  <button
                    onClick={() => router.push("/dashboard/super-admin/users")}
                    className="flex items-center gap-3 p-4 rounded-lg border border-gray-200 hover:border-emerald-300 hover:bg-emerald-50 transition-all w-full"
                  >
                    <Users className="w-5 h-5 text-emerald-600" />
                    <span className="text-sm font-medium text-gray-700">Manage Users</span>
                  </button>
                  <button
                    onClick={() => router.push("/dashboard/super-admin/analytics")}
                    className="flex items-center gap-3 p-4 rounded-lg border border-gray-200 hover:border-purple-300 hover:bg-purple-50 transition-all w-full"
                  >
                    <BarChart3 className="w-5 h-5 text-purple-600" />
                    <span className="text-sm font-medium text-gray-700">Platform Analytics</span>
                  </button>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent>
                <h2 className="text-lg font-semibold text-gray-900 mb-4">Recent Activity</h2>
                <div className="space-y-3">
                  <div className="flex items-center gap-3 p-3 bg-emerald-50 rounded-lg">
                    <CheckCircle className="w-5 h-5 text-emerald-600" />
                    <span className="text-sm text-gray-700">Platform initialized successfully</span>
                  </div>
                  <div className="flex items-center gap-3 p-3 bg-amber-50 rounded-lg">
                    <AlertTriangle className="w-5 h-5 text-amber-600" />
                    <span className="text-sm text-gray-700">Review pending organization verifications</span>
                  </div>
                  <div className="flex items-center gap-3 p-3 bg-blue-50 rounded-lg">
                    <XCircle className="w-5 h-5 text-blue-600" />
                    <span className="text-sm text-gray-700">No disputes reported</span>
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
