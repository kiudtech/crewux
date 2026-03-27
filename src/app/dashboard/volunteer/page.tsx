"use client";

import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { motion, Variants } from "framer-motion";
import { Navbar } from "@/components/layout/Navbar";
import { DashboardSidebar } from "@/components/layout/DashboardSidebar";
import { Button } from "@/components/ui/Button";
import {
  Calendar,
  Users,
  Clock,
  TrendingUp,
  ArrowRight,
  Sparkles,
  Heart,
  Loader2,
  Eye,
  Zap,
  Award,
  Star,
  MapPin,
  DollarSign,
  Briefcase,
  CheckCircle,
  User,
  Settings,
  BarChart3
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

interface VolunteerStats {
  totalEvents: number;
  totalHours: number;
  totalEarnings: number;
  reputationScore: number;
  completionRate: number;
  upcomingEvents: number;
  certificates: number;
  thisMonthHours: number;
  rank: number;
}

interface UpcomingEvent {
  id: string;
  title: string;
  date: string;
  location: string;
  organizer: string;
  status: string;
  image?: string;
}

interface RecentActivity {
  id: string;
  type: "event" | "certificate" | "earning" | "rating";
  title: string;
  date: string;
  value?: string;
}

export default function VolunteerDashboard() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const [stats, setStats] = useState<VolunteerStats>({
    totalEvents: 0,
    totalHours: 0,
    totalEarnings: 0,
    reputationScore: 0,
    completionRate: 0,
    upcomingEvents: 0,
    certificates: 0,
    thisMonthHours: 0,
    rank: 0
  });
  const [upcomingEvents, setUpcomingEvents] = useState<UpcomingEvent[]>([]);
  const [recentActivities, setRecentActivities] = useState<RecentActivity[]>([]);

  useEffect(() => {
    if (status === "unauthenticated") router.push("/login");
    if (session?.user?.role !== "VOLUNTEER") router.push("/dashboard");
  }, [status, session, router]);

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      setMousePosition({ x: e.clientX, y: e.clientY });
    };
    window.addEventListener("mousemove", handleMouseMove);
    return () => window.removeEventListener("mousemove", handleMouseMove);
  }, []);

  useEffect(() => {
    if (session?.user?.role === "VOLUNTEER") {
      fetchDashboardData();
    }
  }, [session]);

  const fetchDashboardData = async () => {
    try {
      const statsRes = await fetch("/api/volunteer/stats");
      if (statsRes.ok) {
        const data = await statsRes.json();
        setStats({
          totalEvents: data.totalEvents || 0,
          totalHours: data.totalHours || 0,
          totalEarnings: data.totalEarnings || 0,
          reputationScore: data.reputationScore || 0,
          completionRate: data.completionRate || 0,
          upcomingEvents: data.upcomingEvents || 0,
          certificates: data.certificates || 0,
          thisMonthHours: data.thisMonthHours || 0,
          rank: data.rank || 0
        });
      }

      const eventsRes = await fetch("/api/volunteer/events?limit=5");
      if (eventsRes.ok) {
        const data = await eventsRes.json();
        setUpcomingEvents(data.events || []);
      }

      const activitiesRes = await fetch("/api/volunteer/activities?limit=5");
      if (activitiesRes.ok) {
        const data = await activitiesRes.json();
        setRecentActivities(data.activities || []);
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

  const formatDate = (date: string) => {
    try {
      return new Date(date).toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" });
    } catch {
      return date;
    }
  };

  const statsCards = [
    { 
      title: "Total Events", 
      value: stats.totalEvents, 
      icon: Calendar, 
      color: "from-blue-500 to-cyan-500",
      change: "Events participated",
      link: "/dashboard/volunteer/events"
    },
    { 
      title: "Total Hours", 
      value: `${formatNumber(stats.totalHours)}h`, 
      icon: Clock, 
      color: "from-purple-500 to-pink-500",
      change: `+${stats.thisMonthHours}h this month`,
      link: "/dashboard/volunteer/analytics"
    },
    { 
      title: "Earnings", 
      value: `₹${formatNumber(stats.totalEarnings)}`, 
      icon: DollarSign, 
      color: "from-emerald-500 to-teal-500",
      change: "Total earned",
      link: "/dashboard/volunteer/earnings"
    },
    { 
      title: "Reputation", 
      value: stats.reputationScore, 
      icon: Star, 
      color: "from-amber-500 to-orange-500",
      change: "Top 10%",
      link: "/dashboard/volunteer/profile"
    },
    { 
      title: "Completion", 
      value: `${stats.completionRate}%`, 
      icon: CheckCircle, 
      color: "from-green-500 to-emerald-500",
      change: "Reliability score",
      link: "/dashboard/volunteer/analytics"
    },
    { 
      title: "Rank", 
      value: `#${stats.rank}`, 
      icon: Award, 
      color: "from-rose-500 to-orange-500",
      change: "Among volunteers",
      link: "/dashboard/volunteer/leaderboard"
    }
  ];

  const quickActions = [
    { title: "Browse Events", icon: Calendar, color: "from-blue-500 to-cyan-500", link: "/events", desc: "Find new opportunities" },
    { title: "My Applications", icon: Briefcase, color: "from-purple-500 to-pink-500", link: "/dashboard/volunteer/applications", desc: "Track your applications" },
    { title: "View Profile", icon: User, color: "from-emerald-500 to-teal-500", link: "/dashboard/volunteer/profile", desc: "Update your info" },
    { title: "Settings", icon: Settings, color: "from-gray-500 to-gray-600", link: "/dashboard/volunteer/settings", desc: "Account preferences" }
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
        <DashboardSidebar role="VOLUNTEER" />
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
                    <span>Volunteer Dashboard</span>
                  </div>
                  <h1 className="text-3xl md:text-4xl font-bold text-white">
                    Welcome back, <span className="bg-gradient-to-r from-indigo-400 to-purple-400 bg-clip-text text-transparent">{session?.user?.name || "Volunteer"}</span>
                  </h1>
                  <p className="text-gray-400 mt-1">Track your impact and discover new opportunities</p>
                </div>
                <Link href="/events">
                  <Button className="bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700">
                    <Calendar className="w-4 h-4 mr-2" />
                    Find Events
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

                {/* Volunteer Stats */}
                <div className="mt-6 bg-white/10 backdrop-blur-xl rounded-2xl border border-white/20 p-6">
                  <h2 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
                    <Award className="w-5 h-5 text-emerald-400" />
                    Your Impact
                  </h2>
                  <div className="space-y-4">
                    <div>
                      <div className="flex justify-between text-sm text-gray-400 mb-1">
                        <span>Profile Completion</span>
                        <span>{stats.completionRate}%</span>
                      </div>
                      <div className="w-full bg-white/10 rounded-full h-2">
                        <div className="bg-gradient-to-r from-emerald-500 to-teal-500 h-2 rounded-full" style={{ width: `${stats.completionRate}%` }} />
                      </div>
                    </div>
                    <div>
                      <div className="flex justify-between text-sm text-gray-400 mb-1">
                        <span>Reputation Score</span>
                        <div className="flex items-center gap-1">
                          <Star className="w-3 h-3 fill-amber-400 text-amber-400" />
                          <span>{stats.reputationScore}/100</span>
                        </div>
                      </div>
                      <div className="w-full bg-white/10 rounded-full h-2">
                        <div className="bg-gradient-to-r from-amber-500 to-orange-500 h-2 rounded-full" style={{ width: `${stats.reputationScore}%` }} />
                      </div>
                    </div>
                    {stats.certificates > 0 && (
                      <div className="mt-4 p-3 bg-emerald-500/20 rounded-xl border border-emerald-500/30">
                        <p className="text-sm text-emerald-300">🏆 You've earned {stats.certificates} certificates!</p>
                        <Link href="/dashboard/volunteer/certificates" className="text-xs text-emerald-400 hover:text-emerald-300 mt-1 inline-block">
                          View certificates →
                        </Link>
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
                    <Link href="/events" className="text-sm text-indigo-400 hover:text-indigo-300">
                      View All
                    </Link>
                  </div>
                  <div className="space-y-3">
                    {upcomingEvents.length > 0 ? (
                      upcomingEvents.slice(0, 4).map((event, idx) => (
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
                                {formatDate(event.date)}
                              </span>
                              {event.location && (
                                <span className="flex items-center gap-1">
                                  <MapPin className="w-3 h-3" />
                                  {event.location}
                                </span>
                              )}
                              <span className="flex items-center gap-1">
                                <Users className="w-3 h-3" />
                                {event.organizer}
                              </span>
                            </div>
                          </div>
                          <Link href={`/events/${event.id}`}>
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
                        <Link href="/events">
                          <Button variant="outline" size="sm" className="mt-2 border-white/20 text-gray-300">
                            Browse Events
                          </Button>
                        </Link>
                      </div>
                    )}
                  </div>
                </div>

                {/* Recent Activity */}
                <div className="mt-6 bg-white/10 backdrop-blur-xl rounded-2xl border border-white/20 p-6">
                  <div className="flex justify-between items-center mb-4">
                    <h2 className="text-lg font-semibold text-white flex items-center gap-2">
                      <Clock className="w-5 h-5 text-emerald-400" />
                      Recent Activity
                    </h2>
                    <Link href="/dashboard/volunteer/activities" className="text-sm text-indigo-400 hover:text-indigo-300">
                      View All
                    </Link>
                  </div>
                  <div className="space-y-3">
                    {recentActivities.length > 0 ? (
                      recentActivities.slice(0, 4).map((activity, idx) => (
                        <motion.div
                          key={activity.id}
                          initial={{ opacity: 0, x: -20 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{ delay: 0.5 + idx * 0.05 }}
                          className="flex items-center gap-3 p-3 bg-white/5 rounded-xl hover:bg-white/10 transition-all"
                        >
                          <div className={`w-10 h-10 rounded-full flex items-center justify-center ${
                            activity.type === "event" ? "bg-blue-500/20 text-blue-400" :
                            activity.type === "certificate" ? "bg-emerald-500/20 text-emerald-400" :
                            activity.type === "earning" ? "bg-green-500/20 text-green-400" :
                            "bg-amber-500/20 text-amber-400"
                          }`}>
                            {activity.type === "event" ? <Calendar className="w-5 h-5" /> :
                             activity.type === "certificate" ? <Award className="w-5 h-5" /> :
                             activity.type === "earning" ? <DollarSign className="w-5 h-5" /> :
                             <Star className="w-5 h-5" />}
                          </div>
                          <div className="flex-1">
                            <p className="text-sm text-white">{activity.title}</p>
                            <p className="text-xs text-gray-400 mt-1">{formatDate(activity.date)}</p>
                          </div>
                          {activity.value && (
                            <span className="text-xs font-medium text-green-400">{activity.value}</span>
                          )}
                        </motion.div>
                      ))
                    ) : (
                      <div className="text-center py-8">
                        <Heart className="w-12 h-12 text-gray-500 mx-auto mb-3" />
                        <p className="text-gray-400">No recent activities</p>
                        <p className="text-xs text-gray-500 mt-1">Start volunteering to see your impact!</p>
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