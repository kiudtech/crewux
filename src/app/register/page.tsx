"use client";

import { useState, Suspense, useEffect } from "react";
import { useSearchParams } from "next/navigation";
import Link from "next/link";
import { motion } from "framer-motion";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { Users, Building2, GraduationCap, ArrowRight, Eye, Shield, Star, Zap, TrendingUp, Award, Calendar, Heart, Sparkles, Clock, CheckCircle, Rocket } from "lucide-react";
import { VolunteerRegisterForm } from "./VolunteerRegisterForm";
import { OrganizationRegisterForm } from "./OrganizationRegisterForm";
import { CollegeRegisterForm } from "./CollegeRegisterForm";

// Animation Variants
const fadeInUp = {
  hidden: { opacity: 0, y: 40 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: "easeOut" } }
};

const staggerContainer = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { staggerChildren: 0.1 } }
};

const scaleOnHover = {
  scale: 1.05,
  transition: { duration: 0.2 }
};

const roleOptions = [
  { 
    value: "volunteer", 
    label: "Volunteer", 
    icon: <Users className="w-10 h-10" />, 
    desc: "Find events & build your reputation", 
    gradient: "from-amber-500 to-orange-500",
    bgGradient: "from-amber-500/20 to-orange-500/20",
    textColor: "text-amber-400",
    stats: "5,240+ Active",
    emoji: "🌟"
  },
  { 
    value: "organization", 
    label: "Organization", 
    icon: <Building2 className="w-10 h-10" />, 
    desc: "Post events & find volunteers", 
    gradient: "from-indigo-500 to-purple-500",
    bgGradient: "from-indigo-500/20 to-purple-500/20",
    textColor: "text-indigo-400",
    stats: "568+ Trusted",
    emoji: "🚀"
  },
  { 
    value: "college", 
    label: "College / School", 
    icon: <GraduationCap className="w-10 h-10" />, 
    desc: "Track student volunteering", 
    gradient: "from-emerald-500 to-teal-500",
    bgGradient: "from-emerald-500/20 to-teal-500/20",
    textColor: "text-emerald-400",
    stats: "200+ Partners",
    emoji: "🎓"
  },
];

const benefits = [
  { icon: <Shield className="w-5 h-5" />, title: "Verified Platform", desc: "100% trust & safety" },
  { icon: <Star className="w-5 h-5" />, title: "Reputation Based", desc: "Build your credibility" },
  { icon: <Zap className="w-5 h-5" />, title: "Instant Matching", desc: "Real-time opportunities" },
  { icon: <TrendingUp className="w-5 h-5" />, title: "Track Growth", desc: "Analytics dashboard" },
  { icon: <Award className="w-5 h-5" />, title: "Certificates", desc: "Earn recognition" },
  { icon: <Calendar className="w-5 h-5" />, title: "Flexible Timing", desc: "Work on your schedule" },
  { icon: <Heart className="w-5 h-5" />, title: "Community", desc: "Join 5000+ members" },
  { icon: <Rocket className="w-5 h-5" />, title: "Career Growth", desc: "Build your future" }
];

function RegisterContent() {
  const searchParams = useSearchParams();
  const initialRole = searchParams.get("role") || "";
  const [selectedRole, setSelectedRole] = useState(initialRole);
  const [hoveredCard, setHoveredCard] = useState<string | null>(null);
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const [stats, setStats] = useState({ volunteers: 0, organizations: 0, events: 0, hours: 0 });

  useEffect(() => {
    const target = { volunteers: 5240, organizations: 568, events: 1320, hours: 18750 };
    const duration = 2000;
    const stepTime = 20;
    const steps = duration / stepTime;
    let currentStep = 0;
    const interval = setInterval(() => {
      currentStep++;
      setStats({
        volunteers: Math.min(target.volunteers, Math.floor((currentStep / steps) * target.volunteers)),
        organizations: Math.min(target.organizations, Math.floor((currentStep / steps) * target.organizations)),
        events: Math.min(target.events, Math.floor((currentStep / steps) * target.events)),
        hours: Math.min(target.hours, Math.floor((currentStep / steps) * target.hours))
      });
      if (currentStep >= steps) clearInterval(interval);
    }, stepTime);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      setMousePosition({ x: e.clientX, y: e.clientY });
    };
    window.addEventListener("mousemove", handleMouseMove);
    return () => window.removeEventListener("mousemove", handleMouseMove);
  }, []);

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
              scale: Math.random() * 0.5 + 0.3
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
          background: `radial-gradient(800px at ${mousePosition.x}px ${mousePosition.y}px, rgba(99, 102, 241, 0.15), transparent 70%)`
        }}
        transition={{ type: "tween", ease: "backOut", duration: 0.3 }}
      />

      <div className="absolute inset-0 bg-[linear-gradient(to_right,#ffffff08_1px,transparent_1px),linear-gradient(to_bottom,#ffffff08_1px,transparent_1px)] bg-[size:64px_64px]" />

      <Navbar />

      <div className="relative max-w-7xl mx-auto px-4 py-12 md:py-20 z-10">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-center mb-12 md:mb-16"
        >
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-indigo-500/20 backdrop-blur-sm rounded-full text-indigo-300 text-sm font-medium mb-4 border border-indigo-500/30">
            <Sparkles className="w-4 h-4" />
            <span>✨ Join India's Largest Network ✨</span>
          </div>
          <h1 className="text-4xl md:text-6xl font-bold text-white mb-4">
            Create Your{" "}
            <span className="bg-gradient-to-r from-indigo-400 via-purple-400 to-pink-400 bg-clip-text text-transparent">
              Account
            </span>
          </h1>
          <p className="text-lg text-gray-300 max-w-2xl mx-auto">
            Join India's largest event & volunteer workforce network
          </p>
        </motion.div>

        {!selectedRole ? (
          <>
            {/* Role Selection Cards */}
            <motion.div
              variants={staggerContainer}
              initial="hidden"
              animate="visible"
              className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-16"
            >
              {roleOptions.map((role) => (
                <motion.div
                  key={role.value}
                  variants={fadeInUp}
                  whileHover={{ y: -8 }}
                  onHoverStart={() => setHoveredCard(role.value)}
                  onHoverEnd={() => setHoveredCard(null)}
                >
                  <div
                    onClick={() => setSelectedRole(role.value)}
                    className="relative group cursor-pointer"
                  >
                    <div className={`absolute -inset-0.5 bg-gradient-to-r ${role.gradient} rounded-2xl blur-xl opacity-0 group-hover:opacity-60 transition duration-500`} />
                    <div className="relative bg-white/10 backdrop-blur-xl rounded-2xl p-8 border border-white/20 hover:border-white/40 transition-all duration-300">
                      <div className={`absolute inset-0 bg-gradient-to-br ${role.bgGradient} opacity-0 group-hover:opacity-100 transition-opacity duration-500 rounded-2xl`} />
                      <div className="relative">
                        <div className={`w-20 h-20 bg-gradient-to-br ${role.gradient} rounded-2xl flex items-center justify-center mx-auto mb-5 shadow-lg group-hover:scale-110 transition-transform`}>
                          <div className="text-white">{role.icon}</div>
                        </div>
                        <h3 className="text-2xl font-bold text-white text-center mb-2">
                          {role.label}
                          <span className="ml-2">{role.emoji}</span>
                        </h3>
                        <p className="text-gray-300 text-center mb-4">{role.desc}</p>
                        <div className="text-center mb-6">
                          <span className={`inline-flex items-center gap-2 px-4 py-2 bg-gradient-to-r ${role.gradient} text-white rounded-full text-sm font-semibold shadow-md`}>
                            <Eye className="w-3 h-3" /> {role.stats}
                          </span>
                        </div>
                        <div className="flex justify-center">
                          <span className={`inline-flex items-center gap-2 ${role.textColor} font-medium group-hover:gap-3 transition-all`}>
                            Join as {role.label}
                            <ArrowRight className="w-4 h-4" />
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                </motion.div>
              ))}
            </motion.div>

            {/* Stats Section */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5 }}
              className="relative mb-16"
            >
              <div className="absolute inset-0 bg-gradient-to-r from-indigo-600 to-purple-600 rounded-2xl blur-2xl opacity-30" />
              <div className="relative bg-gradient-to-r from-indigo-600 to-purple-600 rounded-2xl p-8 shadow-2xl overflow-hidden">
                <div className="grid grid-cols-2 md:grid-cols-4 gap-6 text-center">
                  {[
                    { value: stats.volunteers, label: "Active Volunteers", icon: Users },
                    { value: stats.organizations, label: "Organizations", icon: Building2 },
                    { value: stats.events, label: "Events Hosted", icon: Calendar },
                    { value: stats.hours, label: "Hours Contributed", icon: Clock }
                  ].map((stat, idx) => (
                    <motion.div
                      key={idx}
                      initial={{ scale: 0.5, opacity: 0 }}
                      animate={{ scale: 1, opacity: 1 }}
                      transition={{ delay: 0.7 + idx * 0.1, type: "spring", stiffness: 200 }}
                      className="space-y-2"
                    >
                      <stat.icon className="w-8 h-8 mx-auto text-white/80" />
                      <p className="text-3xl md:text-4xl font-bold text-white">
                        {stat.value.toLocaleString()}+
                      </p>
                      <p className="text-sm text-indigo-100">{stat.label}</p>
                    </motion.div>
                  ))}
                </div>
              </div>
            </motion.div>

            {/* Benefits Section */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.9 }}
              className="bg-white/10 backdrop-blur-xl rounded-2xl p-8 border border-white/20"
            >
              <h3 className="text-2xl font-bold text-center text-white mb-8">
                Why Join <span className="text-indigo-400">Crewux</span>?
              </h3>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
                {benefits.map((benefit, idx) => (
                  <motion.div
                    key={idx}
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: 1 + idx * 0.05 }}
                    whileHover={{ scale: 1.05, y: -5 }}
                    className="text-center group"
                  >
                    <div className="w-12 h-12 bg-gradient-to-br from-indigo-500/20 to-purple-500/20 rounded-xl flex items-center justify-center mx-auto mb-3 text-indigo-400 group-hover:bg-gradient-to-r group-hover:from-indigo-500 group-hover:to-purple-500 group-hover:text-white transition-all duration-300">
                      {benefit.icon}
                    </div>
                    <p className="font-semibold text-white text-sm">{benefit.title}</p>
                    <p className="text-xs text-gray-400 mt-1">{benefit.desc}</p>
                  </motion.div>
                ))}
              </div>
            </motion.div>
          </>
        ) : (
          <motion.div
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -50 }}
            transition={{ type: "spring", stiffness: 200 }}
            className="max-w-2xl mx-auto bg-white/10 backdrop-blur-xl rounded-2xl p-8 border border-white/20 shadow-2xl"
          >
            <button
              onClick={() => setSelectedRole("")}
              className="text-sm text-indigo-400 hover:text-indigo-300 mb-6 inline-flex items-center gap-2 group"
            >
              <ArrowRight className="w-4 h-4 rotate-180 group-hover:-translate-x-1 transition" />
              Choose a different role
            </button>
            {selectedRole === "volunteer" && <VolunteerRegisterForm />}
            {selectedRole === "organization" && <OrganizationRegisterForm />}
            {selectedRole === "college" && <CollegeRegisterForm />}
          </motion.div>
        )}

        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.2 }}
          className="text-center text-gray-400 mt-8"
        >
          Already have an account?{" "}
          <Link href="/login" className="text-indigo-400 font-medium hover:text-indigo-300 inline-flex items-center gap-1 group">
            Sign in
            <ArrowRight className="w-3 h-3 group-hover:translate-x-1 transition" />
          </Link>
        </motion.p>
      </div>

      <Footer />
    </div>
  );
}

export default function RegisterPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-900 to-purple-900">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-500"></div>
      </div>
    }>
      <RegisterContent />
    </Suspense>
  );
}