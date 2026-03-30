"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useSession } from "next-auth/react";
import { motion, Variants, useScroll, useTransform } from "framer-motion";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
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
  Sparkles,
  ChevronRight,
  Rocket,
  CheckCircle,
  Target,
  Play,
  Quote,
  Crown
} from "lucide-react";

// Animation Variants
const fadeInUp: Variants = {
  hidden: { opacity: 0, y: 40 },
  visible: { 
    opacity: 1, 
    y: 0, 
    transition: { duration: 0.6, ease: [0.21, 0.45, 0.27, 0.9] }
  }
};

const staggerContainer: Variants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { staggerChildren: 0.1 } }
};

// Stats Data
const statsData = [
  { value: 5240, label: "Active Volunteers", icon: Users, suffix: "+", color: "from-blue-500 to-indigo-500", description: "Making impact daily" },
  { value: 568, label: "Organizations", icon: Building2, suffix: "+", color: "from-purple-500 to-pink-500", description: "Trusted partners" },
  { value: 1320, label: "Events Hosted", icon: Calendar, suffix: "+", color: "from-emerald-500 to-teal-500", description: "And counting" },
  { value: 18750, label: "Hours Contributed", icon: Clock, suffix: "+", color: "from-amber-500 to-orange-500", description: "Community impact" }
];

// Features Data
const features = [
  { icon: <Shield className="w-6 h-6" />, title: "Verified Profiles", desc: "100% verified organizations and volunteers", gradient: "from-blue-500 to-indigo-500", benefit: "Trust & Safety" },
  { icon: <Star className="w-6 h-6" />, title: "Reputation System", desc: "Build trust with ratings & reviews", gradient: "from-amber-500 to-orange-500", benefit: "Credibility" },
  { icon: <Zap className="w-6 h-6" />, title: "Instant Matching", desc: "AI-powered opportunity matching", gradient: "from-yellow-500 to-amber-500", benefit: "Efficiency" },
  { icon: <TrendingUp className="w-6 h-6" />, title: "Analytics Dashboard", desc: "Track your impact in real-time", gradient: "from-emerald-500 to-teal-500", benefit: "Insights" },
  { icon: <Award className="w-6 h-6" />, title: "Certificates", desc: "Earn verified credentials", gradient: "from-purple-500 to-pink-500", benefit: "Recognition" },
  { icon: <Globe className="w-6 h-6" />, title: "Pan India Reach", desc: "Opportunities across 28 states", gradient: "from-cyan-500 to-blue-500", benefit: "Nationwide" }
];

// Journey Steps
const journeySteps = [
  { step: "01", title: "Create Account", desc: "Sign up in 2 minutes", icon: Users, color: "from-blue-500 to-indigo-500", details: "Free forever" },
  { step: "02", title: "Get Verified", desc: "Complete verification", icon: CheckCircle, color: "from-emerald-500 to-teal-500", details: "Quick process" },
  { step: "03", title: "Find Opportunities", desc: "Browse & apply", icon: Target, color: "from-amber-500 to-orange-500", details: "AI matched" },
  { step: "04", title: "Make Impact", desc: "Start volunteering", icon: Award, color: "from-purple-500 to-pink-500", details: "Earn rewards" }
];

// Testimonials
const testimonials = [
  { name: "Priya Sharma", role: "Volunteer", content: "Crewux helped me find amazing opportunities to give back to the community. The platform is so easy to use!", avatar: "P", rating: 5, company: "Active Volunteer" },
  { name: "Amit Singh", role: "Organization Head", content: "Finding reliable volunteers has never been easier. Crewux is a game-changer for event organizers.", avatar: "A", rating: 5, company: "Tech Events India" },
  { name: "Dr. Meera Reddy", role: "College Dean", content: "Our students have benefited immensely from the volunteering opportunities on Crewux.", avatar: "M", rating: 5, company: "Delhi University" }
];

export default function HomePage() {
  const { data: session } = useSession();
  const [stats, setStats] = useState({ organizations: 0, volunteers: 0, events: 0, hours: 0 });
  const { scrollYProgress } = useScroll();

  useEffect(() => {
    const target = { organizations: 568, volunteers: 5240, events: 1320, hours: 18750 };
    const duration = 2500;
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

  return (
    <div className="min-h-screen bg-white overflow-x-hidden">
      <Navbar />

      {/* Hero Section */}
      <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-blue-50/50 via-white to-indigo-50/30" />
        
        <motion.div
          animate={{ scale: [1, 1.2, 1], x: [0, 50, 0], y: [0, 30, 0] }}
          transition={{ duration: 20, repeat: Infinity, ease: "easeInOut" }}
          className="absolute top-20 left-1/4 w-[500px] h-[500px] bg-blue-200/30 rounded-full blur-3xl"
        />
        <motion.div
          animate={{ scale: [1, 1.3, 1], x: [0, -70, 0], y: [0, -40, 0] }}
          transition={{ duration: 18, repeat: Infinity, ease: "easeInOut", delay: 2 }}
          className="absolute bottom-20 right-1/4 w-[600px] h-[600px] bg-indigo-200/30 rounded-full blur-3xl"
        />

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
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
              className="inline-flex items-center gap-2 px-4 py-2 bg-blue-50 rounded-full text-blue-600 text-sm font-medium mb-6 shadow-sm"
            >
              <Sparkles className="w-4 h-4" />
              <span>✨ India's Largest Event & Volunteer Network ✨</span>
            </motion.div>

            <h1 className="text-5xl md:text-7xl lg:text-8xl font-bold text-gray-900 mb-6 leading-[1.1] tracking-tight">
              Connecting{" "}
              <span className="bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 bg-clip-text text-transparent">
                Talent
              </span>
              <br />
              with{" "}
              <span className="bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 bg-clip-text text-transparent">
                Opportunity
              </span>
            </h1>

            <p className="text-xl text-gray-500 max-w-3xl mx-auto mb-10 leading-relaxed">
              A structured, verified, reputation-based platform connecting organizations with volunteers, 
              students, and teams for events, summits, hackathons, and CSR drives across India.
            </p>

            <div className="flex flex-col sm:flex-row gap-4 justify-center mb-20">
              <Link href={session ? "/dashboard" : "/register"}>
                <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.98 }}>
                  <Button size="lg" className="bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 px-8 py-6 text-lg shadow-lg hover:shadow-xl transition-all group">
                    <Rocket className="w-5 h-5 mr-2 group-hover:animate-pulse" />
                    Get Started Free
                    <ArrowRight className="ml-2 w-5 h-5 group-hover:translate-x-1 transition-transform" />
                  </Button>
                </motion.div>
              </Link>
              <Link href="/events">
                <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.98 }}>
                  <Button variant="outline" size="lg" className="border-2 border-gray-300 text-gray-700 hover:bg-gray-50 px-8 py-6 text-lg">
                    <Play className="w-5 h-5 mr-2" />
                    Browse Events
                    <ChevronRight className="ml-2 w-5 h-5" />
                  </Button>
                </motion.div>
              </Link>
            </div>

            {/* Stats Grid */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6 max-w-5xl mx-auto">
              {statsData.map((stat, idx) => (
                <motion.div
                  key={idx}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.5 + idx * 0.1 }}
                >
                  <Card hover className="p-6 text-center border-0 shadow-xl hover:shadow-2xl bg-white/80 backdrop-blur-sm">
                    <div className={`w-14 h-14 bg-gradient-to-br ${stat.color} rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-lg`}>
                      <stat.icon className="w-7 h-7 text-white" />
                    </div>
                    <p className="text-3xl md:text-4xl font-bold text-gray-900">
                      {idx === 0 ? stats.organizations : idx === 1 ? stats.volunteers : idx === 2 ? stats.events : stats.hours}
                      {stat.suffix}
                    </p>
                    <p className="text-sm font-medium text-gray-600 mt-1">{stat.label}</p>
                    <p className="text-xs text-gray-400 mt-1">{stat.description}</p>
                  </Card>
                </motion.div>
              ))}
            </div>

            {/* Scroll Indicator */}
            <motion.div
              animate={{ y: [0, 10, 0] }}
              transition={{ duration: 1.5, repeat: Infinity }}
              className="absolute bottom-8 left-1/2 transform -translate-x-1/2"
            >
              <div className="w-6 h-10 border-2 border-gray-400 rounded-full flex justify-center">
                <div className="w-1 h-2 bg-gray-400 rounded-full mt-2 animate-pulse" />
              </div>
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-24 bg-gradient-to-b from-white to-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-blue-50 rounded-full text-blue-600 text-sm font-medium mb-4">
              <Crown className="w-4 h-4" />
              <span>Why Choose Us</span>
            </div>
            <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
              Built for <span className="bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">Trust & Impact</span>
            </h2>
            <p className="text-xl text-gray-500 max-w-2xl mx-auto">
              A platform designed to create meaningful connections and lasting impact
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {features.map((feature, idx) => (
              <motion.div
                key={idx}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: idx * 0.1 }}
              >
                <Card hover className="p-8 h-full border-0 shadow-lg hover:shadow-2xl group bg-white">
                  <div className={`w-14 h-14 bg-gradient-to-br ${feature.gradient} rounded-2xl flex items-center justify-center mb-6 text-white shadow-md group-hover:scale-110 transition-transform`}>
                    {feature.icon}
                  </div>
                  <div className="flex items-center gap-2 mb-3">
                    <h3 className="text-xl font-semibold text-gray-900">{feature.title}</h3>
                    <span className="text-xs px-2 py-1 bg-green-50 text-green-600 rounded-full">{feature.benefit}</span>
                  </div>
                  <p className="text-gray-500">{feature.desc}</p>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Journey Section */}
      <section className="py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-blue-50 rounded-full text-blue-600 text-sm font-medium mb-4">
              <Target className="w-4 h-4" />
              <span>Simple Process</span>
            </div>
            <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
              Your Journey to <span className="bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">Impact</span>
            </h2>
            <p className="text-xl text-gray-500 max-w-2xl mx-auto">
              Start making a difference in just 4 simple steps
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {journeySteps.map((step, idx) => (
              <motion.div
                key={idx}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: idx * 0.1 }}
                className="relative"
              >
                {idx < journeySteps.length - 1 && (
                  <div className="hidden lg:block absolute top-1/3 left-full w-full h-0.5 bg-gradient-to-r from-blue-200 to-indigo-200" />
                )}
                <Card className="p-6 text-center border-0 shadow-lg hover:shadow-xl bg-white">
                  <div className={`w-20 h-20 bg-gradient-to-br ${step.color} rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-lg`}>
                    <step.icon className="w-10 h-10 text-white" />
                  </div>
                  <div className="text-4xl font-bold text-blue-600 mb-2">{step.step}</div>
                  <h3 className="text-xl font-semibold text-gray-900 mb-2">{step.title}</h3>
                  <p className="text-sm text-gray-500 mb-2">{step.desc}</p>
                  <p className="text-xs text-gray-400">{step.details}</p>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section className="py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-blue-50 rounded-full text-blue-600 text-sm font-medium mb-4">
              <Quote className="w-4 h-4" />
              <span>Testimonials</span>
            </div>
            <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
              What Our <span className="bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">Community</span> Says
            </h2>
            <p className="text-xl text-gray-500 max-w-2xl mx-auto">
              Trusted by thousands of volunteers and organizations across India
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {testimonials.map((testimonial, idx) => (
              <motion.div
                key={idx}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: idx * 0.1 }}
              >
                <Card hover className="p-8 h-full border-0 shadow-lg hover:shadow-2xl bg-white">
                  <Quote className="w-10 h-10 text-blue-200 mb-4" />
                  <p className="text-gray-600 mb-6 leading-relaxed">"{testimonial.content}"</p>
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-indigo-500 rounded-full flex items-center justify-center text-white font-bold text-lg">
                      {testimonial.avatar}
                    </div>
                    <div>
                      <h4 className="font-semibold text-gray-900">{testimonial.name}</h4>
                      <p className="text-sm text-gray-500">{testimonial.role}</p>
                      <p className="text-xs text-blue-600">{testimonial.company}</p>
                    </div>
                  </div>
                  <div className="flex mt-3">
                    {[...Array(testimonial.rating)].map((_, i) => (
                      <Star key={i} className="w-4 h-4 fill-amber-400 text-amber-400" />
                    ))}
                  </div>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-24 bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 relative overflow-hidden">
        <div className="relative max-w-4xl mx-auto text-center px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
          >
            <h2 className="text-4xl md:text-5xl font-bold text-white mb-4">
              Ready to Make an Impact?
            </h2>
            <p className="text-xl text-blue-100 mb-8">
              Join 5000+ volunteers and organizations already making a difference
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link href={session ? "/dashboard" : "/register"}>
                <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.98 }}>
                  <Button size="lg" className="bg-white text-blue-600 hover:bg-gray-100 px-8 py-6 text-lg shadow-xl hover:shadow-2xl transition-all group">
                    Get Started Today
                    <Rocket className="ml-2 w-5 h-5 group-hover:translate-x-1 transition-transform" />
                  </Button>
                </motion.div>
              </Link>
              <Link href="/events">
                <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.98 }}>
                  <Button variant="outline" size="lg" className="border-white text-white hover:bg-white/10 px-8 py-6 text-lg">
                    Browse Events
                    <ChevronRight className="ml-2 w-5 h-5" />
                  </Button>
                </motion.div>
              </Link>
            </div>
          </motion.div>
        </div>
      </section>

      <Footer />
    </div>
  );
}