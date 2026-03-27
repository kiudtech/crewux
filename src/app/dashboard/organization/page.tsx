"use client";

import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { motion, Variants } from "framer-motion";
import { Navbar } from "@/components/layout/Navbar";
import { DashboardSidebar } from "@/components/layout/DashboardSidebar";
import { Button } from "@/components/ui/Button";
import { Card, CardContent } from "@/components/ui/Card";
import {
  Calendar,
  Users,
  Clock,
  TrendingUp,
  ArrowRight,
  Sparkles,
  Heart,
  CheckCircle,
  Loader2,
  Eye,
  Zap,
  Plus,
  Building2,
  Award,
  Star,
  BarChart3,
  Mail,
  Phone,
  MapPin,
  DollarSign,
  Settings
} from "lucide-react";
import toast from "react-hot-toast";
import Link from "next/link";

// ========== ANIMATION VARIANTS ==========
const fadeInUp: Variants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.5, ease: "easeOut" } }
};

const staggerContainer: Variants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { staggerChildren: 0.1 } }
};

interface OrganizationStats {
  totalEvents: number;
  activeEvents: number;
  totalApplications: number;
  acceptedVolunteers: number;
  totalHours: number;
  totalSpent: number;
  completionRate: number;
  averageRating: number;
  pendingVerifications: number;
  thisMonthEvents: number;
  thisMonthApplications: number;
}

interface UpcomingEvent {
  id: string;
  title: string;
  startDate: string;
  location: string;
  filledSlots: number;
  totalSlots: number;
  status: string;
}

interface RecentApplication {
  id: string;
  eventTitle: string;
  volunteerName: string;
  appliedAt: string;
  status: string;
  avatar: string;
}

export default function OrganizationDashboard() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const [stats, setStats] = useState<OrganizationStats>({
    totalEvents: 0,
    activeEvents: 0,
    totalApplications: 0,
    acceptedVolunteers: 0,
    totalHours: 0,
    totalSpent: 0,
    completionRate: 0,
    averageRating: 0,
    pendingVerifications: 0,
    thisMonthEvents: 0,
    thisMonthApplications: 0
  });
  const [upcomingEvents, setUpcomingEvents] = useState<UpcomingEvent[]>([]);
  const [recentApplications, setRecentApplications] = useState<RecentApplication[]>([]);

  useEffect(() => {
    if (status === "unauthenticated") router.push("/login");
    if (session?.user?.role !== "ORGANIZATION") router.push("/dashboard");
  }, [status, session, router]);

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      setMousePosition({ x: e.clientX, y: e.clientY });
    };
    window.addEventListener("mousemove", handleMouseMove);
    return () => window.removeEventListener("mousemove", handleMouseMove);
  }, []);

  useEffect(() => {
    if (session?.user?.role === "ORGANIZATION") {
      fetchDashboardData();
    }
  }, [session]);

  const fetchDashboardData = async () => {
    try {
      const statsRes = await fetch("/api/organization/stats");
      if (statsRes.ok) {
        const data = await statsRes.json();
        setStats(data);
      }

      const eventsRes = await fetch("/api/organization/events?limit=5");
      if (eventsRes.ok) {
        const data = await eventsRes.json();
        setUpcomingEvents(data.events || []);
      }

      const appsRes = await fetch("/api/organization/applications?limit=5");
      if (appsRes.ok) {
        const data = await appsRes.json();
        setRecentApplications(data.applications || []);
      }
    } catch (error) {
      console.error("Error fetching dashboard data:", error);
      toast.error("Failed to load dashboard data");
    } finally {
      setLoading(false);
    }
  };

  const statsCards = [
    { 
      title: "Total Events", 
      value: stats.totalEvents, 
      icon: Calendar, 
      color: "from-blue-500 to-cyan-500",
      change: `+${stats.thisMonthEvents} this month`,
      link: "/dashboard/organization/events"
    },
    { 
      title: "Active Events", 
      value: stats.activeEvents, 
      icon: Zap, 
      color: "from-emerald-500 to-teal-500",
      change: "Currently running",
      link: "/dashboard/organization/events?status=active"
    },
    { 
      title: "Applications", 
      value: stats.totalApplications, 
      icon: Users, 
      color: "from-purple-500 to-pink-500",
      change: `+${stats.thisMonthApplications} this month`,
      link: "/dashboard/organization/applications"
    },
    { 
      title: "Accepted", 
      value: stats.acceptedVolunteers, 
      icon: Heart, 
      color: "from-rose-500 to-orange-500",
      change: `${Math.round((stats.acceptedVolunteers / stats.totalApplications) * 100) || 0}% acceptance`,
      link: "/dashboard/organization/applications?status=accepted"
    },
    { 
      title: "Total Hours", 
      value: stats.totalHours, 
      icon: Clock, 
      color: "from-amber-500 to-orange-500",
      change: "Volunteer hours",
      link: "/dashboard/organization/reports"
    },
    { 
      title: "Total Spent", 
      value: `₹${stats.totalSpent.toLocaleString()}`, 
      icon: DollarSign, 
      color: "from-green-500 to-emerald-500",
      change: "Total payments",
      link: "/dashboard/organization/payments"
    }
  ];

  const quickActions = [
    { title: "Create Event", icon: Plus, color: "from-indigo-500 to-purple-500", link: "/dashboard/organization/events/create", desc: "Post new opportunity" },
    { title: "View Applications", icon: Users, color: "from-blue-500 to-cyan-500", link: "/dashboard/organization/applications", desc: "Review applicants" },
    { title: "Analytics", icon: BarChart3, color: "from-emerald-500 to-teal-500", link: "/dashboard/organization/analytics", desc: "View insights" },
    { title: "Settings", icon: Settings, color: "from-gray-500 to-gray-600", link: "/dashboard/organization/settings", desc: "Manage account" }
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
            initial={{
              x: Math.random() * (typeof window !== "undefined" ? window.innerWidth : 1200),
              y: Math.random() * (typeof window !== "undefined" ? window.innerHeight : 800),
            }}
            animate={{
              y: [null, -100, -200],
              opacity: [0.5, 0.3, 0]
            }}
            transition={{
              duration: 8 + Math.random() * 7,
              repeat: Infinity,
              delay: Math.random() * 5
            }}
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
        animate={{
          background: `radial-gradient(600px at ${mousePosition.x}px ${mousePosition.y}px, rgba(99, 102, 241, 0.12), transparent 70%)`
        }}
        transition={{ type: "tween", ease: "backOut", duration: 0.3 }}
      />

      <div className="absolute inset-0 bg-[linear-gradient(to_right,#ffffff08_1px,transparent_1px),linear-gradient(to_bottom,#ffffff08_1px,transparent_1px)] bg-[size:64px_64px]" />

      <Navbar />
      
      <div className="flex">
        <DashboardSidebar role="ORGANIZATION" />
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
                    <span>Organization Dashboard</span>
                  </div>
                  <h1 className="text-3xl md:text-4xl font-bold text-white">
                    Welcome back, <span className="bg-gradient-to-r from-indigo-400 to-purple-400 bg-clip-text text-transparent">{session?.user?.name || "Organization"}</span>
                  </h1>
                  <p className="text-gray-400 mt-1">Manage your events and connect with volunteers</p>
                </div>
                <Link href="/dashboard/organization/events/create">
                  <Button className="bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700">
                    <Plus className="w-4 h-4 mr-2" />
                    Create Event
                  </Button>
                </Link>
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
                  <p className="text-2xl font-bold text-white">{stat.value}</p>
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

                {/* Organization Stats */}
                <div className="mt-6 bg-white/10 backdrop-blur-xl rounded-2xl border border-white/20 p-6">
                  <h2 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
                    <Award className="w-5 h-5 text-amber-400" />
                    Organization Stats
                  </h2>
                  <div className="space-y-4">
                    <div>
                      <div className="flex justify-between text-sm text-gray-400 mb-1">
                        <span>Completion Rate</span>
                        <span>{stats.completionRate}%</span>
                      </div>
                      <div className="w-full bg-white/10 rounded-full h-2">
                        <div className="bg-gradient-to-r from-emerald-500 to-teal-500 h-2 rounded-full" style={{ width: `${stats.completionRate}%` }} />
                      </div>
                    </div>
                    <div>
                      <div className="flex justify-between text-sm text-gray-400 mb-1">
                        <span>Average Rating</span>
                        <div className="flex items-center gap-1">
                          <Star className="w-3 h-3 fill-amber-400 text-amber-400" />
                          <span>{stats.averageRating}/5</span>
                        </div>
                      </div>
                      <div className="w-full bg-white/10 rounded-full h-2">
                        <div className="bg-gradient-to-r from-amber-500 to-orange-500 h-2 rounded-full" style={{ width: `${(stats.averageRating / 5) * 100}%` }} />
                      </div>
                    </div>
                    {stats.pendingVerifications > 0 && (
                      <div className="mt-4 p-3 bg-amber-500/20 rounded-xl border border-amber-500/30">
                        <p className="text-sm text-amber-300">{stats.pendingVerifications} documents pending verification</p>
                        <Button variant="ghost" size="sm" className="mt-2 text-amber-300 hover:text-amber-200" onClick={() => router.push("/dashboard/organization/verification")}>
                          Complete Profile
                          <ArrowRight className="w-4 h-4 ml-1" />
                        </Button>
                      </div>
                    )}
                  </div>
                </div>
              </motion.div>

              {/* Upcoming Events */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
                className="lg:col-span-2"
              >
                <div className="bg-white/10 backdrop-blur-xl rounded-2xl border border-white/20 p-6">
                  <div className="flex justify-between items-center mb-4">
                    <h2 className="text-lg font-semibold text-white flex items-center gap-2">
                      <Calendar className="w-5 h-5 text-indigo-400" />
                      Upcoming Events
                    </h2>
                    <Link href="/dashboard/organization/events" className="text-sm text-indigo-400 hover:text-indigo-300">
                      View All
                    </Link>
                  </div>
                  <div className="space-y-3">
                    {upcomingEvents.length > 0 ? (
                      upcomingEvents.map((event, idx) => (
                        <motion.div
                          key={event.id}
                          initial={{ opacity: 0, x: -20 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{ delay: 0.4 + idx * 0.05 }}
                          className="flex items-center justify-between p-3 bg-white/5 rounded-xl hover:bg-white/10 transition-all"
                        >
                          <div className="flex-1">
                            <p className="font-medium text-white">{event.title}</p>
                            <div className="flex items-center gap-4 mt-1 text-xs text-gray-400">
                              <span className="flex items-center gap-1">
                                <Calendar className="w-3 h-3" />
                                {new Date(event.startDate).toLocaleDateString()}
                              </span>
                              {event.location && (
                                <span className="flex items-center gap-1">
                                  <MapPin className="w-3 h-3" />
                                  {event.location}
                                </span>
                              )}
                              <span className="flex items-center gap-1">
                                <Users className="w-3 h-3" />
                                {event.filledSlots}/{event.totalSlots} filled
                              </span>
                            </div>
                          </div>
                          <Link href={`/dashboard/organization/events/${event.id}`}>
                            <Button variant="ghost" size="sm" className="text-gray-400 hover:text-white">
                              <Eye className="w-4 h-4" />
                            </Button>
                          </Link>
                        </motion.div>
                      ))
                    ) : (
                      <div className="text-center py-8">
                        <Calendar className="w-12 h-12 text-gray-500 mx-auto mb-3" />
                        <p className="text-gray-400">No upcoming events</p>
                        <Link href="/dashboard/organization/events/create">
                          <Button variant="outline" size="sm" className="mt-2 border-white/20 text-gray-300">
                            Create your first event
                          </Button>
                        </Link>
                      </div>
                    )}
                  </div>
                </div>

                {/* Recent Applications */}
                <div className="mt-6 bg-white/10 backdrop-blur-xl rounded-2xl border border-white/20 p-6">
                  <div className="flex justify-between items-center mb-4">
                    <h2 className="text-lg font-semibold text-white flex items-center gap-2">
                      <Users className="w-5 h-5 text-emerald-400" />
                      Recent Applications
                    </h2>
                    <Link href="/dashboard/organization/applications" className="text-sm text-indigo-400 hover:text-indigo-300">
                      View All
                    </Link>
                  </div>
                  <div className="space-y-3">
                    {recentApplications.length > 0 ? (
                      recentApplications.map((app, idx) => (
                        <motion.div
                          key={app.id}
                          initial={{ opacity: 0, x: -20 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{ delay: 0.5 + idx * 0.05 }}
                          className="flex items-center gap-3 p-3 bg-white/5 rounded-xl hover:bg-white/10 transition-all"
                        >
                          <div className="w-10 h-10 bg-gradient-to-br from-indigo-500 to-purple-500 rounded-full flex items-center justify-center text-white font-medium">
                            {app.volunteerName?.charAt(0) || "V"}
                          </div>
                          <div className="flex-1">
                            <p className="font-medium text-white">{app.volunteerName}</p>
                            <p className="text-sm text-gray-400">Applied for: {app.eventTitle}</p>
                            <p className="text-xs text-gray-500 mt-1">{new Date(app.appliedAt).toLocaleDateString()}</p>
                          </div>
                          <div className="flex gap-2">
                            <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                              app.status === "ACCEPTED" ? "bg-green-500/20 text-green-300" :
                              app.status === "REJECTED" ? "bg-red-500/20 text-red-300" :
                              "bg-yellow-500/20 text-yellow-300"
                            }`}>
                              {app.status}
                            </span>
                            <Link href={`/dashboard/organization/applications/${app.id}`}>
                              <Button variant="ghost" size="sm" className="text-gray-400 hover:text-white">
                                <Eye className="w-4 h-4" />
                              </Button>
                            </Link>
                          </div>
                        </motion.div>
                      ))
                    ) : (
                      <div className="text-center py-8">
                        <Users className="w-12 h-12 text-gray-500 mx-auto mb-3" />
                        <p className="text-gray-400">No applications yet</p>
                        <p className="text-xs text-gray-500 mt-1">Create events to start receiving applications</p>
                      </div>
                    )}
                  </div>
                </div>
              </motion.div>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}