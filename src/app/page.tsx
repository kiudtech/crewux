"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useSession } from "next-auth/react";
import { motion, Variants } from "framer-motion";
import { Button } from "@/components/ui/Button";
import {
  ArrowRight,
  Users,
  Building2,
  Calendar,
  Clock,
  Shield,
  Star,
  Zap,
  TrendingUp,
  Award,
  Globe,
  Heart,
  Sparkles,
  ChevronRight,
  Rocket,
  Menu,
  X,
  LogIn,
  UserPlus
} from "lucide-react";

// ========== ANIMATION VARIANTS ==========
const fadeInUp: Variants = {
  hidden: { opacity: 0, y: 50 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: "easeOut" } }
};

const staggerContainer: Variants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { staggerChildren: 0.1 } }
};

const scaleOnHover = {
  scale: 1.05,
  transition: { duration: 0.2 }
};

// ========== NAVBAR COMPONENT ==========
const Navbar = () => {
  const { data: session } = useSession();
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <motion.nav
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      transition={{ duration: 0.5 }}
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        scrolled ? "bg-white/90 backdrop-blur-md shadow-sm" : "bg-transparent"
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <Link href="/" className="flex items-center gap-2">
            <div className="w-8 h-8 bg-gradient-to-r from-indigo-600 to-purple-600 rounded-lg flex items-center justify-center">
              <span className="text-white font-bold text-lg">C</span>
            </div>
            <span className="text-xl font-bold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
              Crewux
            </span>
          </Link>

          <div className="hidden md:flex items-center gap-8">
            <Link href="/events" className="text-gray-600 hover:text-indigo-600 transition">Events</Link>
            <Link href="/about" className="text-gray-600 hover:text-indigo-600 transition">About</Link>
            <Link href="/impact" className="text-gray-600 hover:text-indigo-600 transition">Impact</Link>
            {session ? (
              <Link href="/dashboard">
                <Button size="sm" className="bg-indigo-600 text-white hover:bg-indigo-700">
                  Dashboard
                </Button>
              </Link>
            ) : (
              <div className="flex items-center gap-3">
                <Link href="/login">
                  <Button variant="ghost" size="sm" className="flex items-center gap-1">
                    <LogIn className="w-4 h-4" /> Sign In
                  </Button>
                </Link>
                <Link href="/register">
                  <Button size="sm" className="bg-gradient-to-r from-indigo-600 to-purple-600 text-white">
                    <UserPlus className="w-4 h-4 mr-1" /> Get Started
                  </Button>
                </Link>
              </div>
            )}
          </div>

          <button onClick={() => setIsOpen(!isOpen)} className="md:hidden p-2">
            {isOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>

        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="md:hidden py-4 border-t border-gray-100"
          >
            <div className="flex flex-col gap-3">
              <Link href="/events" className="px-3 py-2 text-gray-600 hover:bg-gray-50 rounded-lg">Events</Link>
              <Link href="/about" className="px-3 py-2 text-gray-600 hover:bg-gray-50 rounded-lg">About</Link>
              <Link href="/impact" className="px-3 py-2 text-gray-600 hover:bg-gray-50 rounded-lg">Impact</Link>
              {session ? (
                <Link href="/dashboard" className="px-3 py-2 bg-indigo-600 text-white rounded-lg text-center">Dashboard</Link>
              ) : (
                <div className="flex flex-col gap-2">
                  <Link href="/login" className="px-3 py-2 border border-gray-200 rounded-lg text-center">Sign In</Link>
                  <Link href="/register" className="px-3 py-2 bg-indigo-600 text-white rounded-lg text-center">Get Started</Link>
                </div>
              )}
            </div>
          </motion.div>
        )}
      </div>
    </motion.nav>
  );
};

// ========== FEATURES DATA ==========
const features = [
  { icon: <Shield className="w-6 h-6" />, title: "Verified Profiles", desc: "100% verified organizations and volunteers", color: "from-blue-500 to-cyan-500" },
  { icon: <Star className="w-6 h-6" />, title: "Reputation System", desc: "Build trust with ratings & reviews", color: "from-amber-500 to-orange-500" },
  { icon: <Zap className="w-6 h-6" />, title: "Instant Matching", desc: "AI-powered opportunity matching", color: "from-yellow-500 to-amber-500" },
  { icon: <TrendingUp className="w-6 h-6" />, title: "Analytics Dashboard", desc: "Track your impact in real-time", color: "from-emerald-500 to-teal-500" },
  { icon: <Award className="w-6 h-6" />, title: "Certificates", desc: "Earn verified credentials", color: "from-purple-500 to-pink-500" },
  { icon: <Globe className="w-6 h-6" />, title: "Pan India", desc: "Opportunities across 28 states", color: "from-indigo-500 to-purple-500" }
];

// ========== MAIN COMPONENT ==========
export default function HomePage() {
  const { data: session } = useSession();
  const [stats, setStats] = useState({ organizations: 0, volunteers: 0, events: 0, hours: 0 });
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const [particles, setParticles] = useState<Array<{ x: number; y: number; scale: number }>>([]);
  const [isMounted, setIsMounted] = useState(false);

  // Stats counter effect
  useEffect(() => {
    const target = { organizations: 150, volunteers: 5240, events: 320, hours: 18750 };
    const duration = 2000;
    const stepTime = 20;
    const steps = duration / stepTime;
    let currentStep = 0;
    const interval = setInterval(() => {
      currentStep++;
      setStats({
        organizations: Math.min(target.organizations, Math.floor((currentStep / steps) * target.organizations)),
        volunteers: Math.min(target.volunteers, Math.floor((currentStep / steps) * target.volunteers)),
        events: Math.min(target.events, Math.floor((currentStep / steps) * target.events)),
        hours: Math.min(target.hours, Math.floor((currentStep / steps) * target.hours))
      });
      if (currentStep >= steps) clearInterval(interval);
    }, stepTime);
    return () => clearInterval(interval);
  }, []);

  // Mouse move effect
  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      setMousePosition({ x: e.clientX, y: e.clientY });
    };
    window.addEventListener("mousemove", handleMouseMove);
    return () => window.removeEventListener("mousemove", handleMouseMove);
  }, []);

  // Generate particles only on client side to avoid hydration mismatch
  useEffect(() => {
    setIsMounted(true);
    const particlesArray = [];
    for (let i = 0; i < 50; i++) {
      particlesArray.push({
        x: Math.random() * (typeof window !== "undefined" ? window.innerWidth : 1200),
        y: Math.random() * (typeof window !== "undefined" ? window.innerHeight : 800),
        scale: Math.random() * 0.5 + 0.3
      });
    }
    setParticles(particlesArray);
  }, []);

  if (!isMounted) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-indigo-950 to-purple-950 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-500"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-indigo-950 to-purple-950 overflow-x-hidden relative">
      {/* Animated Particle Background */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {particles.map((particle, i) => (
          <motion.div
            key={i}
            className="absolute w-1 h-1 bg-white/20 rounded-full"
            initial={{
              x: particle.x,
              y: particle.y,
              scale: particle.scale
            }}
            animate={{
              y: [particle.y, particle.y - 100, particle.y - 200],
              x: [particle.x, particle.x + (Math.random() * 100 - 50), particle.x + (Math.random() * 200 - 100)],
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
          background: `radial-gradient(800px at ${mousePosition.x}px ${mousePosition.y}px, rgba(99, 102, 241, 0.15), transparent 70%)`
        }}
        transition={{ type: "tween", ease: "backOut", duration: 0.3 }}
      />

      {/* Grid Pattern */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#ffffff08_1px,transparent_1px),linear-gradient(to_bottom,#ffffff08_1px,transparent_1px)] bg-[size:64px_64px]" />

      <Navbar />

      {/* Hero Section */}
      <section className="relative pt-32 pb-20 md:pt-40 md:pb-28 overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial="hidden"
            animate="visible"
            variants={fadeInUp}
            className="text-center"
          >
            <motion.div
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ delay: 0.2, type: "spring" }}
              className="inline-flex items-center gap-2 px-4 py-2 bg-indigo-500/20 backdrop-blur-sm rounded-full text-indigo-300 text-sm font-medium mb-6 border border-indigo-500/30"
            >
              <Sparkles className="w-4 h-4" />
              <span>✨ India's Largest Event & Volunteer Network ✨</span>
            </motion.div>

            <motion.h1
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="text-5xl md:text-7xl font-bold text-white mb-6"
            >
              Connecting{" "}
              <span className="bg-gradient-to-r from-indigo-400 via-purple-400 to-pink-400 bg-clip-text text-transparent">
                Talent
              </span>
              <br />
              with{" "}
              <span className="bg-gradient-to-r from-amber-400 to-orange-400 bg-clip-text text-transparent">
                Opportunity
              </span>
            </motion.h1>

            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.4 }}
              className="text-xl text-gray-300 max-w-3xl mx-auto mb-10 leading-relaxed"
            >
              A structured, verified, reputation-based platform connecting organizations with volunteers, 
              students, and teams for events, summits, hackathons, and CSR drives across India.
            </motion.p>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5 }}
              className="flex flex-col sm:flex-row gap-4 justify-center mb-20"
            >
              <Link href={session ? "/dashboard" : "/register"}>
                <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.98 }}>
                  <Button size="lg" className="bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white px-8 py-6 text-lg shadow-lg hover:shadow-xl transition-all duration-300 group">
                    Get Started Free
                    <ArrowRight className="ml-2 w-5 h-5 group-hover:translate-x-1 transition-transform" />
                  </Button>
                </motion.div>
              </Link>
              <Link href="/events">
                <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.98 }}>
                  <Button variant="outline" size="lg" className="border-gray-600 text-gray-300 hover:bg-white/10 px-8 py-6 text-lg">
                    Browse Events
                    <ChevronRight className="ml-2 w-5 h-5" />
                  </Button>
                </motion.div>
              </Link>
            </motion.div>

            {/* Stats Cards */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6 max-w-4xl mx-auto">
              {[
                { value: stats.organizations, label: "Organizations", icon: Building2, gradient: "from-blue-500 to-cyan-500" },
                { value: stats.volunteers, label: "Volunteers", icon: Users, gradient: "from-purple-500 to-pink-500" },
                { value: stats.events, label: "Events Hosted", icon: Calendar, gradient: "from-emerald-500 to-teal-500" },
                { value: stats.hours, label: "Hours Contributed", icon: Clock, gradient: "from-amber-500 to-orange-500" }
              ].map((stat, idx) => (
                <motion.div
                  key={idx}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.6 + idx * 0.1 }}
                  whileHover={{ scale: 1.05 }}
                  className="bg-white/10 backdrop-blur-xl rounded-2xl p-6 border border-white/20 shadow-xl"
                >
                  <div className={`w-12 h-12 bg-gradient-to-br ${stat.gradient} rounded-xl flex items-center justify-center mx-auto mb-3 shadow-md`}>
                    <stat.icon className="w-6 h-6 text-white" />
                  </div>
                  <p className="text-3xl font-bold text-white">{stat.value.toLocaleString()}+</p>
                  <p className="text-sm text-gray-300">{stat.label}</p>
                </motion.div>
              ))}
            </div>
          </motion.div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-12"
          >
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
              Why Choose <span className="text-indigo-400">Crewux</span>?
            </h2>
            <p className="text-lg text-gray-300 max-w-2xl mx-auto">
              A platform built for trust, transparency, and meaningful connections
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {features.map((feature, idx) => (
              <motion.div
                key={idx}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: idx * 0.1 }}
                whileHover={{ y: -8 }}
                className="bg-white/10 backdrop-blur-xl rounded-2xl p-6 border border-white/20 hover:border-white/40 transition-all duration-300 group"
              >
                <div className={`w-12 h-12 bg-gradient-to-br ${feature.color} rounded-xl flex items-center justify-center mb-4 text-white shadow-md group-hover:scale-110 transition-transform`}>
                  {feature.icon}
                </div>
                <h3 className="text-xl font-semibold text-white mb-2">{feature.title}</h3>
                <p className="text-gray-300">{feature.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 relative overflow-hidden">
        <div className="relative max-w-4xl mx-auto text-center px-4 sm:px-6 lg:px-8">
          <motion.h2
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-3xl md:text-4xl font-bold text-white mb-4"
          >
            Ready to Make an Impact?
          </motion.h2>
          <motion.p
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2 }}
            className="text-xl text-indigo-100 mb-8"
          >
            Join thousands of volunteers and organizations already using Crewux
          </motion.p>
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.98 }}
          >
            <Link href={session ? "/dashboard" : "/register"}>
              <Button size="lg" className="bg-white text-indigo-600 hover:bg-gray-100 px-8 py-6 text-lg shadow-xl hover:shadow-2xl transition-all group">
                Get Started Today
                <Rocket className="ml-2 w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </Button>
            </Link>
          </motion.div>
        </div>
      </section>
    </div>
  );
}