"use client";

import { useState, useEffect } from "react";
import { motion, Variants } from "framer-motion";
import Link from "next/link";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { Button } from "@/components/ui/Button";
import {
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
  ArrowRight,
  CheckCircle,
  Rocket,
  Target,
  Eye,
  Lightbulb
} from "lucide-react";

// Animation Variants
const fadeInUp: Variants = {
  hidden: { opacity: 0, y: 30 },
  visible: { 
    opacity: 1, 
    y: 0, 
    transition: { 
      duration: 0.5, 
      ease: [0.21, 0.45, 0.27, 0.9]
    } 
  }
};

export default function AboutPage() {
  // ✅ State for particles (client-side only)
  const [particles, setParticles] = useState<Array<{ x: number; y: number }>>([]);
  const [isMounted, setIsMounted] = useState(false);

  // ✅ Generate particles only on client side
  useEffect(() => {
    setIsMounted(true);
    const particlesArray = [];
    for (let i = 0; i < 40; i++) {
      particlesArray.push({
        x: Math.random() * (typeof window !== "undefined" ? window.innerWidth : 1200),
        y: Math.random() * (typeof window !== "undefined" ? window.innerHeight : 800),
      });
    }
    setParticles(particlesArray);
  }, []);

  const stats = [
    { value: "5000+", label: "Active Volunteers", icon: Users, color: "from-blue-500 to-cyan-500" },
    { value: "500+", label: "Organizations", icon: Building2, color: "from-purple-500 to-pink-500" },
    { value: "320+", label: "Events Hosted", icon: Calendar, color: "from-emerald-500 to-teal-500" },
    { value: "12.5K+", label: "Hours Contributed", icon: Clock, color: "from-amber-500 to-orange-500" }
  ];

  const values = [
    { icon: <Shield className="w-8 h-8" />, title: "Trust & Transparency", desc: "All users are verified, ensuring a safe and reliable platform." },
    { icon: <Star className="w-8 h-8" />, title: "Reputation Based", desc: "Build your credibility through ratings and reviews." },
    { icon: <Zap className="w-8 h-8" />, title: "Instant Matching", desc: "AI-powered matching connects you with the right opportunities." },
    { icon: <TrendingUp className="w-8 h-8" />, title: "Track Impact", desc: "Real-time analytics to monitor your contributions." }
  ];

  const journey = [
    { step: "01", title: "Create Account", desc: "Sign up as volunteer, organization, or college", icon: Users },
    { step: "02", title: "Get Verified", desc: "Complete verification process", icon: CheckCircle },
    { step: "03", title: "Find Opportunities", desc: "Browse events that match your interests", icon: Eye },
    { step: "04", title: "Make Impact", desc: "Participate and earn recognition", icon: Award }
  ];

  // ✅ Show loading while particles generate
  if (!isMounted) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 to-purple-900 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-500"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-indigo-950 to-purple-950 overflow-hidden relative">
      {/* Animated Background - Fixed */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {particles.map((particle, i) => (
          <motion.div
            key={i}
            className="absolute w-1 h-1 bg-white/20 rounded-full"
            initial={{
              x: particle.x,
              y: particle.y,
            }}
            animate={{
              y: [particle.y, particle.y - 100, particle.y - 200],
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

      <div className="absolute inset-0 bg-[linear-gradient(to_right,#ffffff08_1px,transparent_1px),linear-gradient(to_bottom,#ffffff08_1px,transparent_1px)] bg-[size:64px_64px]" />

      <Navbar />

      {/* Hero Section */}
      <section className="relative pt-32 pb-20 md:pt-40 md:pb-28">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial="hidden"
            animate="visible"
            variants={fadeInUp}
            className="text-center"
          >
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-indigo-500/20 backdrop-blur-sm rounded-full text-indigo-300 text-sm font-medium mb-6 border border-indigo-500/30">
              <Sparkles className="w-4 h-4" />
              <span>About Crewux</span>
            </div>
            <h1 className="text-4xl md:text-6xl font-bold text-white mb-6">
              Connecting{" "}
              <span className="bg-gradient-to-r from-indigo-400 to-purple-400 bg-clip-text text-transparent">
                Talent
              </span>
              <br />
              with{" "}
              <span className="bg-gradient-to-r from-amber-400 to-orange-400 bg-clip-text text-transparent">
                Opportunity
              </span>
            </h1>
            <p className="text-xl text-gray-300 max-w-3xl mx-auto leading-relaxed">
              Crewux is India's largest verified event and volunteer workforce network, 
              building trust and creating meaningful connections across the country.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {stats.map((stat, idx) => (
              <motion.div
                key={idx}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: idx * 0.1 }}
                className="text-center"
              >
                <div className={`w-16 h-16 mx-auto bg-gradient-to-br ${stat.color} rounded-2xl flex items-center justify-center mb-4 shadow-lg`}>
                  <stat.icon className="w-8 h-8 text-white" />
                </div>
                <p className="text-3xl md:text-4xl font-bold text-white">{stat.value}</p>
                <p className="text-sm text-gray-400">{stat.label}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Rest of your sections (Mission, Values, Journey, CTA) remain the same */}
      {/* ... */}

      <Footer />
    </div>
  );
}