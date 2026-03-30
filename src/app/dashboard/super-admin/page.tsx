"use client";

import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import {
  Users,
  Building2,
  Calendar,
  Clock,
  Shield,
  TrendingUp,
  ArrowRight,
  Sparkles,
  Heart,
  CheckCircle,
  Loader2,
  Download,
  Eye,
  Zap,
  Award,
  BarChart3,
  Activity,
  ChevronRight,
  MoreHorizontal,
  PlusCircle,
  Settings,
  Bell,
  Search,
  Filter,
  LayoutDashboard,
  FileText,
  Wallet,
  MessageSquare,
} from "lucide-react";

interface DashboardStats {
  totalUsers: number;
  totalOrganizations: number;
  totalVolunteers: number;
  totalColleges: number;
  totalEvents: number;
  totalApplications: number;
  pendingVerifications: number;
  pendingOrganizations: number;
  activeEvents: number;
  totalEarnings: number;
  thisMonthUsers: number;
  thisMonthEvents: number;
  growthRate: number;
}

interface RecentActivity {
  id: string;
  type: "user" | "organization" | "event" | "application";
  action: string;
  user: string;
  timestamp: string;
}

export default function SuperAdminDashboard() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState<DashboardStats>({
    totalUsers: 0,
    totalOrganizations: 0,
    totalVolunteers: 0,
    totalColleges: 0,
    totalEvents: 0,
    totalApplications: 0,
    pendingVerifications: 0,
    pendingOrganizations: 0,
    activeEvents: 0,
    totalEarnings: 0,
    thisMonthUsers: 0,
    thisMonthEvents: 0,
    growthRate: 12
  });
  const [recentActivities, setRecentActivities] = useState<RecentActivity[]>([]);

  useEffect(() => {
    if (status === "unauthenticated") router.push("/login");
    if (session?.user?.role !== "SUPER_ADMIN") router.push("/dashboard");
  }, [status, session, router]);

  useEffect(() => {
    if (session?.user?.role === "SUPER_ADMIN") {
      fetchDashboardData();
    }
  }, [session]);

  const fetchDashboardData = async () => {
    try {
      const statsRes = await fetch("/api/admin/stats");
      if (statsRes.ok) {
        const data = await statsRes.json();
        setStats({
          totalUsers: data.totalUsers || 0,
          totalOrganizations: data.totalOrganizations || 0,
          totalVolunteers: data.totalVolunteers || 0,
          totalColleges: data.totalColleges || 0,
          totalEvents: data.totalEvents || 0,
          totalApplications: data.totalApplications || 0,
          pendingVerifications: data.pendingVerifications || 0,
          pendingOrganizations: data.pendingOrganizations || 0,
          activeEvents: data.activeEvents || 0,
          totalEarnings: data.totalEarnings || 0,
          thisMonthUsers: data.thisMonthUsers || 0,
          thisMonthEvents: data.thisMonthEvents || 0,
          growthRate: data.growthRate || 12
        });
      }

      const activitiesRes = await fetch("/api/admin/activities");
      if (activitiesRes.ok) {
        const data = await activitiesRes.json();
        setRecentActivities(data || []);
      }
    } catch (error) {
      console.error("Error fetching dashboard data:", error);
    } finally {
      setLoading(false);
    }
  };

  const formatNumber = (value: number | undefined): string => {
    if (value === undefined || value === null) return "0";
    if (value >= 1000000) return `${(value / 1000000).toFixed(1)}M`;
    if (value >= 1000) return `${(value / 1000).toFixed(1)}K`;
    return value.toLocaleString();
  };

  const statsCards = [
    { 
      title: "Total Users", 
      value: stats.totalUsers, 
      icon: Users, 
      change: `+${stats.thisMonthUsers}`,
      trend: "up",
      link: "/dashboard/super-admin/users",
      bgColor: "bg-blue-50",
      iconColor: "text-blue-600"
    },
    { 
      title: "Organizations", 
      value: stats.totalOrganizations, 
      icon: Building2, 
      change: `${stats.pendingOrganizations} pending`,
      trend: "neutral",
      link: "/dashboard/super-admin/organizations",
      bgColor: "bg-purple-50",
      iconColor: "text-purple-600"
    },
    { 
      title: "Volunteers", 
      value: stats.totalVolunteers, 
      icon: Heart, 
      change: "Active",
      trend: "neutral",
      link: "/dashboard/super-admin/users?role=volunteer",
      bgColor: "bg-rose-50",
      iconColor: "text-rose-600"
    },
    { 
      title: "Active Events", 
      value: stats.activeEvents, 
      icon: Calendar, 
      change: `+${stats.thisMonthEvents}`,
      trend: "up",
      link: "/dashboard/super-admin/events",
      bgColor: "bg-emerald-50",
      iconColor: "text-emerald-600"
    },
    { 
      title: "Pending Verifications", 
      value: stats.pendingVerifications, 
      icon: Shield, 
      change: "Needs review",
      trend: "warning",
      link: "/dashboard/super-admin/verifications",
      bgColor: "bg-amber-50",
      iconColor: "text-amber-600"
    },
    { 
      title: "Applications", 
      value: stats.totalApplications, 
      icon: FileText, 
      change: "Total",
      trend: "neutral",
      link: "/dashboard/super-admin/applications",
      bgColor: "bg-indigo-50",
      iconColor: "text-indigo-600"
    }
  ];

  const quickActions = [
    { title: "Manage Organizations", icon: Building2, link: "/dashboard/super-admin/organizations", desc: "Review and verify new organizations" },
    { title: "Verification Queue", icon: Shield, link: "/dashboard/super-admin/verifications", desc: `${stats.pendingVerifications} items waiting` },
    { title: "Manage Users", icon: Users, link: "/dashboard/super-admin/users", desc: "View and manage all platform users" },
    { title: "Platform Analytics", icon: TrendingUp, link: "/dashboard/super-admin/analytics", desc: "View insights and growth metrics" }
  ];

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <Loader2 className="w-8 h-8 text-indigo-600 animate-spin" />
      </div>
    );
  }

  return (
    <div className="bg-gray-50 min-h-screen">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
            <div>
              <div className="flex items-center gap-2 text-sm text-gray-600 mb-2">
                <LayoutDashboard className="w-4 h-4" />
                <span>Dashboard</span>
                <ChevronRight className="w-3 h-3" />
                <span className="text-gray-900 font-medium">Overview</span>
              </div>
              <h1 className="text-2xl lg:text-3xl font-bold text-gray-900">
                Welcome back, {session?.user?.name?.split(' ')[0] || "Admin"}
              </h1>
              <p className="text-gray-500 mt-1">Here's what's happening on your platform today</p>
            </div>
            <div className="flex items-center gap-3">
              <Button variant="outline" className="border-gray-200 text-gray-700 hover:bg-gray-50">
                <Download className="w-4 h-4 mr-2" />
                Export
              </Button>
              <Button className="bg-indigo-600 hover:bg-indigo-700 text-white shadow-sm">
                <PlusCircle className="w-4 h-4 mr-2" />
                New Action
              </Button>
            </div>
          </div>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-4 mb-8">
          {statsCards.map((stat, idx) => (
            <div
              key={idx}
              onClick={() => router.push(stat.link)}
              className="group cursor-pointer"
            >
              <Card className="p-5 border border-gray-100 shadow-sm hover:shadow-md transition-all duration-200 bg-white hover:border-gray-200">
                <div className="flex items-center justify-between mb-3">
                  <div className={`w-10 h-10 ${stat.bgColor} rounded-xl flex items-center justify-center`}>
                    <stat.icon className={`w-5 h-5 ${stat.iconColor}`} />
                  </div>
                  <span className={`text-xs font-medium px-2 py-1 rounded-full ${
                    stat.trend === "up" ? "bg-green-50 text-green-700" :
                    stat.trend === "warning" ? "bg-amber-50 text-amber-700" :
                    "bg-gray-50 text-gray-600"
                  }`}>
                    {stat.change}
                  </span>
                </div>
                <p className="text-2xl font-bold text-gray-900">{formatNumber(stat.value)}</p>
                <p className="text-sm text-gray-500 mt-0.5">{stat.title}</p>
              </Card>
            </div>
          ))}
        </div>

        {/* Main Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Quick Actions */}
          <div className="lg:col-span-1">
            <Card className="p-6 border border-gray-100 shadow-sm bg-white">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-lg font-semibold text-gray-900 flex items-center gap-2">
                  <Zap className="w-5 h-5 text-amber-500" />
                  Quick Actions
                </h2>
                <MoreHorizontal className="w-4 h-4 text-gray-400" />
              </div>
              <div className="space-y-2">
                {quickActions.map((action, idx) => (
                  <button
                    key={idx}
                    onClick={() => router.push(action.link)}
                    className="w-full flex items-center justify-between p-3 rounded-lg hover:bg-gray-50 transition-all group text-left"
                  >
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 bg-gray-100 rounded-lg flex items-center justify-center group-hover:bg-white transition-colors">
                        <action.icon className="w-4 h-4 text-gray-600" />
                      </div>
                      <div>
                        <p className="text-sm font-medium text-gray-900">{action.title}</p>
                        <p className="text-xs text-gray-500">{action.desc}</p>
                      </div>
                    </div>
                    <ChevronRight className="w-4 h-4 text-gray-400 group-hover:text-gray-600 group-hover:translate-x-0.5 transition-all" />
                  </button>
                ))}
              </div>
            </Card>
          </div>

          {/* Recent Activity */}
          <div className="lg:col-span-2">
            <Card className="p-6 border border-gray-100 shadow-sm bg-white">
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-lg font-semibold text-gray-900 flex items-center gap-2">
                  <Activity className="w-5 h-5 text-gray-500" />
                  Recent Activity
                </h2>
                <Button variant="ghost" size="sm" className="text-indigo-600 hover:text-indigo-700 hover:bg-indigo-50">
                  View All
                  <ArrowRight className="w-4 h-4 ml-1" />
                </Button>
              </div>
              <div className="space-y-3">
                {recentActivities.length > 0 ? (
                  recentActivities.slice(0, 5).map((activity, idx) => (
                    <div
                      key={activity.id}
                      className="flex items-start gap-3 p-3 rounded-lg hover:bg-gray-50 transition-all"
                    >
                      <div className={`w-2 h-2 rounded-full mt-2 flex-shrink-0 ${
                        activity.type === "user" ? "bg-green-500" :
                        activity.type === "organization" ? "bg-blue-500" :
                        activity.type === "event" ? "bg-amber-500" : "bg-purple-500"
                      }`} />
                      <div className="flex-1 min-w-0">
                        <p className="text-sm text-gray-700">
                          <span className="font-medium text-gray-900">{activity.user}</span>
                          <span className="text-gray-500"> {activity.action}</span>
                        </p>
                        <p className="text-xs text-gray-400 mt-1">
                          {new Date(activity.timestamp).toLocaleString('en-IN', {
                            day: 'numeric',
                            month: 'short',
                            year: 'numeric',
                            hour: '2-digit',
                            minute: '2-digit'
                          })}
                        </p>
                      </div>
                      <Button variant="ghost" size="sm" className="text-gray-400 hover:text-gray-600">
                        <Eye className="w-4 h-4" />
                      </Button>
                    </div>
                  ))
                ) : (
                  <div className="text-center py-8">
                    <Activity className="w-12 h-12 text-gray-200 mx-auto mb-3" />
                    <p className="text-gray-500 text-sm">No recent activities</p>
                  </div>
                )}
              </div>
            </Card>
          </div>
        </div>

        {/* Bottom Stats Row */}
        <div className="mt-6 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <Card className="p-4 border border-gray-100 shadow-sm bg-white">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-emerald-50 rounded-lg flex items-center justify-center">
                <TrendingUp className="w-5 h-5 text-emerald-600" />
              </div>
              <div>
                <p className="text-xl font-bold text-gray-900">{stats.growthRate}%</p>
                <p className="text-xs text-gray-500">Growth Rate</p>
              </div>
            </div>
          </Card>
          <Card className="p-4 border border-gray-100 shadow-sm bg-white">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-blue-50 rounded-lg flex items-center justify-center">
                <Calendar className="w-5 h-5 text-blue-600" />
              </div>
              <div>
                <p className="text-xl font-bold text-gray-900">{formatNumber(stats.totalEvents)}</p>
                <p className="text-xs text-gray-500">Total Events</p>
              </div>
            </div>
          </Card>
          <Card className="p-4 border border-gray-100 shadow-sm bg-white">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-purple-50 rounded-lg flex items-center justify-center">
                <BarChart3 className="w-5 h-5 text-purple-600" />
              </div>
              <div>
                <p className="text-xl font-bold text-gray-900">{formatNumber(stats.totalApplications)}</p>
                <p className="text-xs text-gray-500">Applications</p>
              </div>
            </div>
          </Card>
          <Card className="p-4 border border-gray-100 shadow-sm bg-white">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-green-50 rounded-lg flex items-center justify-center">
                <Wallet className="w-5 h-5 text-green-600" />
              </div>
              <div>
                <p className="text-xl font-bold text-gray-900">₹{formatNumber(stats.totalEarnings)}</p>
                <p className="text-xs text-gray-500">Total Earnings</p>
              </div>
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
}