"use client";

import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { motion, Variants } from "framer-motion";
// import { Navbar } from "@/components/layout/Navbar";
import { AdminSidebar } from "@/components/layout/AdminSidebar";
import { Button } from "@/components/ui/Button";
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
  Filter,
  Eye,
  Zap
} from "lucide-react";
import toast from "react-hot-toast";

// ========== ANIMATION VARIANTS ==========
const fadeInUp: Variants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.5, ease: "easeOut" } }
};

const staggerContainer: Variants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { staggerChildren: 0.1 } }
};

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
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });

  useEffect(() => {
    if (status === "unauthenticated") router.push("/login");
    if (session?.user?.role !== "SUPER_ADMIN") router.push("/dashboard");
  }, [status, session, router]);

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      setMousePosition({ x: e.clientX, y: e.clientY });
    };
    window.addEventListener("mousemove", handleMouseMove);
    return () => window.removeEventListener("mousemove", handleMouseMove);
  }, []);

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
      } else {
        console.error("Failed to fetch stats");
      }

      const activitiesRes = await fetch("/api/admin/activities");
      if (activitiesRes.ok) {
        const data = await activitiesRes.json();
        setRecentActivities(data || []);
      }
    } catch (error) {
      console.error("Error fetching dashboard data:", error);
      toast.error("Failed to load dashboard data");
    } finally {
      setLoading(false);
    }
  };

  const formatNumber = (value: number | undefined): string => {
    if (value === undefined || value === null) return "0";
    return value.toLocaleString();
  };

  const statsCards = [
    { title: "Total Users", value: stats.totalUsers, icon: Users, color: "from-blue-500 to-cyan-500", change: `+${stats.thisMonthUsers} this month`, link: "/dashboard/super-admin/users" },
    { title: "Organizations", value: stats.totalOrganizations, icon: Building2, color: "from-purple-500 to-pink-500", change: `${stats.pendingOrganizations} pending`, link: "/dashboard/super-admin/organizations" },
    { title: "Volunteers", value: stats.totalVolunteers, icon: Heart, color: "from-rose-500 to-orange-500", change: "Active volunteers", link: "/dashboard/super-admin/users?role=volunteer" },
    { title: "Active Events", value: stats.activeEvents, icon: Calendar, color: "from-emerald-500 to-teal-500", change: `+${stats.thisMonthEvents} this month`, link: "/dashboard/super-admin/events" },
    { title: "Pending Verifications", value: stats.pendingVerifications, icon: Shield, color: "from-amber-500 to-orange-500", change: "Needs attention", link: "/dashboard/super-admin/verifications" },
    { title: "Total Applications", value: stats.totalApplications, icon: CheckCircle, color: "from-indigo-500 to-purple-500", change: "Volunteer applications", link: "/dashboard/super-admin/applications" }
  ];

  const quickActions = [
    { title: "Manage Organizations", icon: Building2, color: "from-purple-500 to-pink-500", link: "/dashboard/super-admin/organizations", desc: "Review and verify organizations" },
    { title: "Verification Queue", icon: Shield, color: "from-amber-500 to-orange-500", link: "/dashboard/super-admin/verifications", desc: `${stats.pendingVerifications} pending verifications` },
    { title: "Manage Users", icon: Users, color: "from-blue-500 to-cyan-500", link: "/dashboard/super-admin/users", desc: "View and manage all users" },
    { title: "Platform Analytics", icon: TrendingUp, color: "from-emerald-500 to-teal-500", link: "/dashboard/super-admin/analytics", desc: "View platform insights" }
  ];

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-900 to-purple-900">
        <Loader2 className="w-8 h-8 text-indigo-400 animate-spin" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-indigo-950 to-purple-950 overflow-hidden relative">
      {/* Animated Background */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {[...Array(40)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute w-1 h-1 bg-white/20 rounded-full"
            initial={{ x: Math.random() * (typeof window !== "undefined" ? window.innerWidth : 1200), y: Math.random() * (typeof window !== "undefined" ? window.innerHeight : 800) }}
            animate={{ y: [null, -100, -200], opacity: [0.5, 0.3, 0] }}
            transition={{ duration: 8 + Math.random() * 7, repeat: Infinity, delay: Math.random() * 5 }}
          />
        ))}
      </div>

      {/* Gradient Orbs */}
      <motion.div
        animate={{ scale: [1, 1.2, 1], x: [0, 50, 0], y: [0, 30, 0] }}
        transition={{ duration: 15, repeat: Infinity, ease: "easeInOut" }}
        className="absolute top-20 left-1/4 w-[500px] h-[500px] bg-indigo-500/30 rounded-full blur-3xl"
      />
      <motion.div
        animate={{ scale: [1, 1.3, 1], x: [0, -70, 0], y: [0, -40, 0] }}
        transition={{ duration: 18, repeat: Infinity, ease: "easeInOut", delay: 2 }}
        className="absolute bottom-20 right-1/4 w-[600px] h-[600px] bg-purple-500/30 rounded-full blur-3xl"
      />

      {/* Mouse Follow Glow */}
      <motion.div
        className="fixed inset-0 pointer-events-none z-0"
        animate={{ background: `radial-gradient(600px at ${mousePosition.x}px ${mousePosition.y}px, rgba(99, 102, 241, 0.12), transparent 70%)` }}
        transition={{ type: "tween", ease: "backOut", duration: 0.3 }}
      />

      <div className="absolute inset-0 bg-[linear-gradient(to_right,#ffffff08_1px,transparent_1px),linear-gradient(to_bottom,#ffffff08_1px,transparent_1px)] bg-[size:64px_64px]" />

      {/* <Navbar /> */}
      
      <div className="flex">
        <AdminSidebar />
        <main className="flex-1 p-6 lg:p-8 relative z-10">
          <div className="max-w-7xl mx-auto">
            {/* Header */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className="mb-8"
            >
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                  <div className="inline-flex items-center gap-2 px-3 py-1 bg-indigo-500/20 rounded-full text-indigo-300 text-sm mb-3">
                    <Sparkles className="w-4 h-4" />
                    <span>Admin Dashboard</span>
                  </div>
                  <h1 className="text-3xl md:text-4xl font-bold text-white">
                    Welcome back, <span className="bg-gradient-to-r from-indigo-400 to-purple-400 bg-clip-text text-transparent">{session?.user?.name || "Admin"}</span>
                  </h1>
                  <p className="text-gray-400 mt-1">Here's what's happening on your platform today</p>
                </div>
                <div className="flex gap-3">
                  <Button variant="outline" className="border-white/20 text-gray-300 hover:bg-white/10">
                    <Download className="w-4 h-4 mr-2" />
                    Export Report
                  </Button>
                  <Button className="bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700">
                    <Filter className="w-4 h-4 mr-2" />
                    Filter
                  </Button>
                </div>
              </div>
            </motion.div>

            {/* Stats Grid */}
            <motion.div
              variants={staggerContainer}
              initial="hidden"
              animate="visible"
              className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-4 mb-8"
            >
              {statsCards.map((stat, idx) => (
                <motion.div
                  key={idx}
                  variants={fadeInUp}
                  whileHover={{ y: -4 }}
                  className="bg-white/10 backdrop-blur-xl rounded-xl border border-white/20 p-4 hover:border-white/40 transition-all cursor-pointer"
                  onClick={() => router.push(stat.link)}
                >
                  <div className="flex items-center justify-between mb-2">
                    <div className={`w-10 h-10 bg-gradient-to-br ${stat.color} rounded-lg flex items-center justify-center`}>
                      <stat.icon className="w-5 h-5 text-white" />
                    </div>
                    <span className="text-xs text-green-400 flex items-center gap-1">
                      <TrendingUp className="w-3 h-3" />
                      {stat.change}
                    </span>
                  </div>
                  <p className="text-2xl font-bold text-white">{formatNumber(stat.value)}</p>
                  <p className="text-xs text-gray-400">{stat.title}</p>
                </motion.div>
              ))}
            </motion.div>

            {/* Main Content Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              {/* Quick Actions */}
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.2 }}
                className="lg:col-span-1"
              >
                <div className="bg-white/10 backdrop-blur-xl rounded-2xl border border-white/20 p-6">
                  <h2 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
                    <Zap className="w-5 h-5 text-amber-400" />
                    Quick Actions
                  </h2>
                  <div className="space-y-3">
                    {quickActions.map((action, idx) => (
                      <motion.button
                        key={idx}
                        whileHover={{ x: 4 }}
                        onClick={() => router.push(action.link)}
                        className="w-full flex items-center gap-3 p-3 bg-white/5 rounded-xl hover:bg-white/10 transition-all text-left"
                      >
                        <div className={`w-10 h-10 bg-gradient-to-br ${action.color} rounded-lg flex items-center justify-center`}>
                          <action.icon className="w-5 h-5 text-white" />
                        </div>
                        <div className="flex-1">
                          <p className="text-white font-medium">{action.title}</p>
                          <p className="text-xs text-gray-400">{action.desc}</p>
                        </div>
                        <ArrowRight className="w-4 h-4 text-gray-400" />
                      </motion.button>
                    ))}
                  </div>
                </div>
              </motion.div>

              {/* Recent Activity */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
                className="lg:col-span-2"
              >
                <div className="bg-white/10 backdrop-blur-xl rounded-2xl border border-white/20 p-6">
                  <h2 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
                    <Clock className="w-5 h-5 text-indigo-400" />
                    Recent Activity
                  </h2>
                  <div className="space-y-3">
                    {recentActivities.length > 0 ? (
                      recentActivities.slice(0, 5).map((activity, idx) => (
                        <motion.div
                          key={activity.id}
                          initial={{ opacity: 0, x: -20 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{ delay: 0.4 + idx * 0.05 }}
                          className="flex items-center gap-3 p-3 bg-white/5 rounded-xl hover:bg-white/10 transition-all"
                        >
                          <div className={`w-2 h-2 rounded-full ${
                            activity.type === "user" ? "bg-green-400" :
                            activity.type === "organization" ? "bg-blue-400" :
                            activity.type === "event" ? "bg-amber-400" : "bg-purple-400"
                          }`} />
                          <div className="flex-1">
                            <p className="text-sm text-gray-300">
                              <span className="font-medium text-white">{activity.user}</span> {activity.action}
                            </p>
                            <p className="text-xs text-gray-500 mt-1">
                              {new Date(activity.timestamp).toLocaleString()}
                            </p>
                          </div>
                          <Button variant="ghost" size="sm" className="text-gray-400 hover:text-white">
                            <Eye className="w-4 h-4" />
                          </Button>
                        </motion.div>
                      ))
                    ) : (
                      <div className="text-center py-8">
                        <Clock className="w-12 h-12 text-gray-500 mx-auto mb-3" />
                        <p className="text-gray-400">No recent activities</p>
                      </div>
                    )}
                  </div>
                </div>
              </motion.div>
            </div>

            {/* Platform Stats */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5 }}
              className="mt-6 bg-white/10 backdrop-blur-xl rounded-2xl border border-white/20 p-6"
            >
              <h2 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
                <TrendingUp className="w-5 h-5 text-emerald-400" />
                Platform Overview
              </h2>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div className="text-center p-3 bg-white/5 rounded-xl">
                  <p className="text-2xl font-bold text-white">{formatNumber(stats.growthRate)}%</p>
                  <p className="text-xs text-gray-400">Growth Rate</p>
                </div>
                <div className="text-center p-3 bg-white/5 rounded-xl">
                  <p className="text-2xl font-bold text-white">{formatNumber(stats.totalEvents)}</p>
                  <p className="text-xs text-gray-400">Total Events</p>
                </div>
                <div className="text-center p-3 bg-white/5 rounded-xl">
                  <p className="text-2xl font-bold text-white">{formatNumber(stats.totalApplications)}</p>
                  <p className="text-xs text-gray-400">Applications</p>
                </div>
                <div className="text-center p-3 bg-white/5 rounded-xl">
                  <p className="text-2xl font-bold text-white">₹{formatNumber(stats.totalEarnings)}</p>
                  <p className="text-xs text-gray-400">Total Earnings</p>
                </div>
              </div>
            </motion.div>
          </div>
        </main>
      </div>
    </div>
  );
}