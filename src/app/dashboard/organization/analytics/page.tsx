"use client";

import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { Navbar } from "@/components/layout/Navbar";
import { DashboardSidebar } from "@/components/layout/DashboardSidebar";
import { Card, CardContent, CardHeader } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { Select } from "@/components/ui/Select";
import {
  TrendingUp, Users, Calendar, DollarSign,
  Download, Filter, BarChart3, PieChart,
  Activity, Clock, Award, Target
} from "lucide-react";
import toast from "react-hot-toast";

// Simple Card Components
const CardComponent = ({ children, className = "" }: { children: React.ReactNode; className?: string }) => (
  <div className={`bg-white rounded-xl border border-gray-200 shadow-sm ${className}`}>
    {children}
  </div>
);

export default function OrganizationAnalyticsPage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [timeframe, setTimeframe] = useState("month");
  const [analytics, setAnalytics] = useState({
    totalEvents: 24,
    activeEvents: 8,
    totalApplications: 156,
    acceptedVolunteers: 89,
    totalHours: 1245,
    totalSpent: 45600,
    averageRating: 4.5,
    completionRate: 87
  });

  useEffect(() => {
    if (status === "unauthenticated") router.push("/login");
  }, [status, router]);

  useEffect(() => {
    // Fetch analytics data
    setTimeout(() => setLoading(false), 1000);
  }, [timeframe]);

  const exportReport = () => {
    toast.success("Analytics report downloaded!");
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
        <DashboardSidebar role="ORGANIZATION" />
        <main className="flex-1 p-6 lg:p-8">
          {/* Header */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Analytics</h1>
              <p className="text-sm text-gray-500">Track your organization's performance and impact</p>
            </div>
            <div className="flex gap-2">
              <Select
                label=""
                value={timeframe}
                onChange={(e) => setTimeframe(e.target.value)}
                options={[
                  { value: "week", label: "Last 7 Days" },
                  { value: "month", label: "Last 30 Days" },
                  { value: "quarter", label: "Last 3 Months" },
                  { value: "year", label: "Last 12 Months" }
                ]}
              />
              <Button variant="outline" onClick={exportReport}>
                <Download className="w-4 h-4 mr-2" />
                Export
              </Button>
            </div>
          </div>

          {/* Stats Grid */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
            <CardComponent>
              <CardContent className="p-4">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-blue-100 rounded-lg">
                    <Calendar className="w-5 h-5 text-blue-600" />
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Total Events</p>
                    <p className="text-2xl font-bold">{analytics.totalEvents}</p>
                  </div>
                </div>
              </CardContent>
            </CardComponent>

            <CardComponent>
              <CardContent className="p-4">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-green-100 rounded-lg">
                    <Activity className="w-5 h-5 text-green-600" />
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Active Events</p>
                    <p className="text-2xl font-bold">{analytics.activeEvents}</p>
                  </div>
                </div>
              </CardContent>
            </CardComponent>

            <CardComponent>
              <CardContent className="p-4">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-purple-100 rounded-lg">
                    <Users className="w-5 h-5 text-purple-600" />
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Applications</p>
                    <p className="text-2xl font-bold">{analytics.totalApplications}</p>
                  </div>
                </div>
              </CardContent>
            </CardComponent>

            <CardComponent>
              <CardContent className="p-4">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-orange-100 rounded-lg">
                    <DollarSign className="w-5 h-5 text-orange-600" />
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Total Spent</p>
                    <p className="text-2xl font-bold">₹{analytics.totalSpent}</p>
                  </div>
                </div>
              </CardContent>
            </CardComponent>
          </div>

          {/* Charts Row */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
            <CardComponent>
              <CardHeader className="p-4 border-b">
                <h3 className="font-semibold">Event Performance</h3>
              </CardHeader>
              <CardContent className="p-4">
                <div className="space-y-3">
                  <div>
                    <div className="flex justify-between text-sm mb-1">
                      <span>Applications Received</span>
                      <span className="font-medium">{analytics.totalApplications}</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div className="bg-indigo-600 h-2 rounded-full" style={{ width: "75%" }}></div>
                    </div>
                  </div>
                  <div>
                    <div className="flex justify-between text-sm mb-1">
                      <span>Accepted Volunteers</span>
                      <span className="font-medium">{analytics.acceptedVolunteers}</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div className="bg-green-600 h-2 rounded-full" style={{ width: "60%" }}></div>
                    </div>
                  </div>
                  <div>
                    <div className="flex justify-between text-sm mb-1">
                      <span>Completion Rate</span>
                      <span className="font-medium">{analytics.completionRate}%</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div className="bg-purple-600 h-2 rounded-full" style={{ width: `${analytics.completionRate}%` }}></div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </CardComponent>

            <CardComponent>
              <CardHeader className="p-4 border-b">
                <h3 className="font-semibold">Volunteer Metrics</h3>
              </CardHeader>
              <CardContent className="p-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="text-center p-3 bg-gray-50 rounded-lg">
                    <Clock className="w-5 h-5 text-indigo-600 mx-auto mb-2" />
                    <p className="text-2xl font-bold">{analytics.totalHours}</p>
                    <p className="text-xs text-gray-500">Total Hours</p>
                  </div>
                  <div className="text-center p-3 bg-gray-50 rounded-lg">
                    <Award className="w-5 h-5 text-yellow-600 mx-auto mb-2" />
                    <p className="text-2xl font-bold">{analytics.averageRating}</p>
                    <p className="text-xs text-gray-500">Avg Rating</p>
                  </div>
                  <div className="text-center p-3 bg-gray-50 rounded-lg">
                    <Target className="w-5 h-5 text-green-600 mx-auto mb-2" />
                    <p className="text-2xl font-bold">{analytics.acceptedVolunteers}</p>
                    <p className="text-xs text-gray-500">Active</p>
                  </div>
                  <div className="text-center p-3 bg-gray-50 rounded-lg">
                    <Users className="w-5 h-5 text-purple-600 mx-auto mb-2" />
                    <p className="text-2xl font-bold">12</p>
                    <p className="text-xs text-gray-500">New</p>
                  </div>
                </div>
              </CardContent>
            </CardComponent>
          </div>

          {/* Recent Activity */}
          <CardComponent>
            <CardHeader className="p-4 border-b">
              <h3 className="font-semibold">Recent Activity</h3>
            </CardHeader>
            <CardContent className="p-0">
              <div className="divide-y divide-gray-200">
                {[1, 2, 3, 4, 5].map((i) => (
                  <div key={i} className="flex items-center gap-3 p-4 hover:bg-gray-50">
                    <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                    <div className="flex-1">
                      <p className="text-sm font-medium">New application received for Tech Workshop</p>
                      <p className="text-xs text-gray-500">2 hours ago</p>
                    </div>
                    <Button variant="ghost" size="sm">View</Button>
                  </div>
                ))}
              </div>
            </CardContent>
          </CardComponent>
        </main>
      </div>
    </div>
  );
}