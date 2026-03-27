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
  Heart,
  Globe,
  TrendingUp,
  Award,
  Sparkles,
  ArrowRight,
  CheckCircle,
  Rocket,
  Target,
  BarChart3,
  Leaf,
  HandHeart,
  School,
  Briefcase
} from "lucide-react";

// Animation Variants
const fadeInUp: Variants = {
  hidden: { opacity: 0, y: 30 },
  visible: { 
    opacity: 1, 
    y: 0, 
    transition: { duration: 0.5, ease: [0.21, 0.45, 0.27, 0.9] }
  }
};

export default function ImpactPage() {
  const [stats, setStats] = useState({ volunteers: 0, organizations: 0, events: 0, hours: 0 });
  const [particles, setParticles] = useState<Array<{ x: number; y: number }>>([]);
  const [isMounted, setIsMounted] = useState(false);

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

    // Animated counter
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

  const impactStats = [
    { value: stats.volunteers, label: "Active Volunteers", icon: Users, color: "from-blue-500 to-cyan-500", suffix: "+" },
    { value: stats.organizations, label: "Partner Organizations", icon: Building2, color: "from-purple-500 to-pink-500", suffix: "+" },
    { value: stats.events, label: "Events Hosted", icon: Calendar, color: "from-emerald-500 to-teal-500", suffix: "+" },
    { value: stats.hours, label: "Hours Contributed", icon: Clock, color: "from-amber-500 to-orange-500", suffix: "+" }
  ];

  const impactAreas = [
    { icon: <School className="w-8 h-8" />, title: "Education", desc: "Supporting educational initiatives and skill development", impact: "500+ students benefited", color: "from-blue-500 to-cyan-500" },
    { icon: <HandHeart className="w-8 h-8" />, title: "Community Service", desc: "Building stronger communities through volunteerism", impact: "100+ community projects", color: "from-rose-500 to-orange-500" },
    { icon: <Leaf className="w-8 h-8" />, title: "Environment", desc: "Promoting sustainability and green initiatives", impact: "10,000+ trees planted", color: "from-emerald-500 to-teal-500" },
    { icon: <Briefcase className="w-8 h-8" />, title: "Skill Development", desc: "Enhancing employability through practical experience", impact: "2,000+ skills certified", color: "from-purple-500 to-pink-500" }
  ];

  const testimonials = [
    { name: "Priya Sharma", role: "Volunteer", content: "Crewux gave me the opportunity to give back to my community while building valuable skills.", avatar: "P", rating: 5 },
    { name: "Rajesh Kumar", role: "Organization Lead", content: "Finding dedicated volunteers has never been easier. Crewux is a game-changer!", avatar: "R", rating: 5 },
    { name: "Dr. Meera Singh", role: "College Dean", content: "Our students have benefited immensely from the volunteering opportunities on Crewux.", avatar: "M", rating: 5 }
  ];

  if (!isMounted) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 to-purple-900 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-500"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-indigo-950 to-purple-950 overflow-hidden relative">
      {/* Animated Background */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {particles.map((particle, i) => (
          <motion.div
            key={i}
            className="absolute w-1 h-1 bg-white/20 rounded-full"
            initial={{ x: particle.x, y: particle.y }}
            animate={{ y: [particle.y, particle.y - 100, particle.y - 200], opacity: [0.5, 0.3, 0] }}
            transition={{ duration: 8 + Math.random() * 7, repeat: Infinity, delay: Math.random() * 5 }}
          />
        ))}
      </div>

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
          <motion.div initial="hidden" animate="visible" variants={fadeInUp} className="text-center">
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-indigo-500/20 backdrop-blur-sm rounded-full text-indigo-300 text-sm font-medium mb-6 border border-indigo-500/30">
              <Sparkles className="w-4 h-4" />
              <span>Our Impact</span>
            </div>
            <h1 className="text-4xl md:text-6xl font-bold text-white mb-6">
              Making a Difference,
              <br />
              <span className="bg-gradient-to-r from-indigo-400 to-purple-400 bg-clip-text text-transparent">Together</span>
            </h1>
            <p className="text-xl text-gray-300 max-w-3xl mx-auto leading-relaxed">
              See how Crewux is creating positive change across India through the power of volunteering and community engagement.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {impactStats.map((stat, idx) => (
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
                <p className="text-3xl md:text-4xl font-bold text-white">{stat.value.toLocaleString()}{stat.suffix}</p>
                <p className="text-sm text-gray-400">{stat.label}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Impact Areas */}
      <section className="py-20 bg-black/20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">Where We Make an Impact</h2>
            <p className="text-lg text-gray-300 max-w-2xl mx-auto">Focus areas where Crewux is creating meaningful change</p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {impactAreas.map((area, idx) => (
              <motion.div
                key={idx}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: idx * 0.1 }}
                className="bg-white/10 backdrop-blur-xl rounded-2xl p-6 border border-white/20 hover:border-white/40 transition-all group"
              >
                <div className={`w-14 h-14 bg-gradient-to-br ${area.color} rounded-xl flex items-center justify-center mb-4 text-white group-hover:scale-110 transition-transform`}>
                  {area.icon}
                </div>
                <h3 className="text-xl font-semibold text-white mb-2">{area.title}</h3>
                <p className="text-gray-400 text-sm mb-3">{area.desc}</p>
                <p className="text-indigo-400 text-sm font-medium">{area.impact}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">Voices of Impact</h2>
            <p className="text-lg text-gray-300 max-w-2xl mx-auto">Real stories from our community</p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {testimonials.map((testimonial, idx) => (
              <motion.div
                key={idx}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: idx * 0.1 }}
                className="bg-white/10 backdrop-blur-xl rounded-2xl p-6 border border-white/20"
              >
                <div className="flex items-center gap-4 mb-4">
                  <div className="w-12 h-12 bg-gradient-to-br from-indigo-500 to-purple-500 rounded-full flex items-center justify-center text-white font-bold text-lg">
                    {testimonial.avatar}
                  </div>
                  <div>
                    <h4 className="font-semibold text-white">{testimonial.name}</h4>
                    <p className="text-sm text-gray-400">{testimonial.role}</p>
                  </div>
                </div>
                <div className="flex mb-3">
                  {[...Array(testimonial.rating)].map((_, i) => (
                    <Star key={i} className="w-4 h-4 fill-amber-400 text-amber-400" />
                  ))}
                </div>
                <p className="text-gray-300 italic">"{testimonial.content}"</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-gradient-to-r from-indigo-600 to-purple-600">
        <div className="max-w-4xl mx-auto text-center px-4 sm:px-6 lg:px-8">
          <motion.div initial={{ opacity: 0, scale: 0.95 }} whileInView={{ opacity: 1, scale: 1 }} viewport={{ once: true }}>
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">Be Part of the Change</h2>
            <p className="text-xl text-indigo-100 mb-8">Join thousands of volunteers making a difference every day</p>
            <Link href="/register">
              <Button size="lg" className="bg-white text-indigo-600 hover:bg-gray-100 px-8 py-6 text-lg shadow-xl">
                Start Your Journey
                <Rocket className="ml-2 w-5 h-5" />
              </Button>
            </Link>
          </motion.div>
        </div>
      </section>

      <Footer />
    </div>
  );
}

function Star({ className }: { className?: string }) {
  return (
    <svg className={className} fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
      <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
    </svg>
  );
}