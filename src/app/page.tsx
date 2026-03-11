"use client";

import Link from "next/link";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { Button } from "@/components/ui/Button";
import {
  Users, Calendar, Award, Shield, TrendingUp,
  Building2, GraduationCap, Zap, ArrowRight,
  CheckCircle2, MapPin
} from "lucide-react";

const stats = [
  { label: "Volunteers", value: "10,000+", icon: <Users className="w-5 h-5" /> },
  { label: "Events Hosted", value: "500+", icon: <Calendar className="w-5 h-5" /> },
  { label: "Cities Covered", value: "100+", icon: <MapPin className="w-5 h-5" /> },
  { label: "Certificates Issued", value: "8,000+", icon: <Award className="w-5 h-5" /> },
];

const features = [
  {
    icon: <Calendar className="w-8 h-8 text-indigo-600" />,
    title: "Structured Event Listings",
    description: "Hackathons, summits, conferences, CSR drives, workshops — all in one place with detailed role requirements.",
  },
  {
    icon: <Users className="w-8 h-8 text-emerald-600" />,
    title: "Smart Volunteer Matching",
    description: "Skill-based matching connects the right volunteers with the right events. Apply individually or as a team.",
  },
  {
    icon: <Shield className="w-8 h-8 text-amber-600" />,
    title: "Verified & Trustworthy",
    description: "Organization verification, reputation scores, attendance tracking, and completion ratings build trust.",
  },
  {
    icon: <Award className="w-8 h-8 text-purple-600" />,
    title: "Digital Certificates",
    description: "Auto-generated certificates with QR verification. Build a verified portfolio of your volunteering experience.",
  },
  {
    icon: <TrendingUp className="w-8 h-8 text-blue-600" />,
    title: "Reputation System",
    description: "Earn ratings, build your reputation score, and unlock premium opportunities through consistent participation.",
  },
  {
    icon: <GraduationCap className="w-8 h-8 text-rose-600" />,
    title: "College Dashboard",
    description: "Institutional accounts to track student volunteering, approve participation, and generate reports.",
  },
];

const roles = [
  {
    icon: <Users className="w-10 h-10 text-indigo-600" />,
    title: "Volunteers",
    description: "Find events, build skills, earn certificates, and grow your reputation.",
    cta: "Join as Volunteer",
    href: "/register?role=volunteer",
    color: "bg-indigo-50 border-indigo-200",
  },
  {
    icon: <Building2 className="w-10 h-10 text-emerald-600" />,
    title: "Organizations",
    description: "Post events, find verified volunteers, manage applications, and track engagement.",
    cta: "Register Organization",
    href: "/register?role=organization",
    color: "bg-emerald-50 border-emerald-200",
  },
  {
    icon: <GraduationCap className="w-10 h-10 text-purple-600" />,
    title: "Colleges",
    description: "Track student volunteering records, approve participation, and generate reports.",
    cta: "Register College",
    href: "/register?role=college",
    color: "bg-purple-50 border-purple-200",
  },
];

export default function HomePage() {
  return (
    <div className="min-h-screen bg-white">
      <Navbar />

      {/* Hero Section */}
      <section className="relative overflow-hidden">
        <div className="absolute inset-0 bg-linear-to-br from-indigo-50 via-white to-emerald-50" />
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 md:py-32">
          <div className="text-center max-w-4xl mx-auto">
            <div className="inline-flex items-center gap-2 bg-indigo-100 text-indigo-700 px-4 py-1.5 rounded-full text-sm font-medium mb-6">
              <Zap className="w-4 h-4" />
              India&apos;s Event & Volunteer Workforce Network
            </div>
            <h1 className="text-4xl md:text-6xl font-bold text-gray-900 leading-tight mb-6">
              Connecting <span className="text-indigo-600">Talent</span> with{" "}
              <span className="text-emerald-600">Opportunity</span>
            </h1>
            <p className="text-lg md:text-xl text-gray-600 mb-8 max-w-2xl mx-auto">
              A structured, verified, reputation-based platform connecting organizations with 
              volunteers, students, and teams for events, summits, hackathons, and CSR drives across India.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link href="/register">
                <Button size="lg" className="gap-2 text-base px-8">
                  Get Started Free
                  <ArrowRight className="w-5 h-5" />
                </Button>
              </Link>
              <Link href="/events">
                <Button variant="outline" size="lg" className="text-base px-8">
                  Browse Events
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="bg-white border-y border-gray-200 py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {stats.map((stat) => (
              <div key={stat.label} className="text-center">
                <div className="inline-flex items-center justify-center w-12 h-12 bg-indigo-100 rounded-lg mb-3">
                  <span className="text-indigo-600">{stat.icon}</span>
                </div>
                <p className="text-2xl md:text-3xl font-bold text-gray-900">{stat.value}</p>
                <p className="text-sm text-gray-500">{stat.label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Everything You Need to Volunteer & Organize
            </h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              A complete ecosystem for event workforce management — from discovery to certification.
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {features.map((feature) => (
              <div
                key={feature.title}
                className="bg-white p-6 rounded-xl border border-gray-200 hover:shadow-lg hover:border-gray-300 transition-all duration-300"
              >
                <div className="mb-4">{feature.icon}</div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">{feature.title}</h3>
                <p className="text-sm text-gray-600 leading-relaxed">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Roles Section */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Who Is This For?
            </h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Whether you&apos;re a student, organization, or college — there&apos;s a place for you on Gig Bharat.
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {roles.map((role) => (
              <div
                key={role.title}
                className={`p-8 rounded-xl border-2 ${role.color} hover:shadow-lg transition-all duration-300`}
              >
                <div className="mb-4">{role.icon}</div>
                <h3 className="text-xl font-bold text-gray-900 mb-3">{role.title}</h3>
                <p className="text-gray-600 mb-6">{role.description}</p>
                <Link href={role.href}>
                  <Button variant="outline" className="gap-2">
                    {role.cta}
                    <ArrowRight className="w-4 h-4" />
                  </Button>
                </Link>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              How It Works
            </h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            {[
              { step: "01", title: "Register", desc: "Create your account as a volunteer, organization, or college." },
              { step: "02", title: "Discover", desc: "Browse events, filter by skills, location, and category." },
              { step: "03", title: "Apply & Connect", desc: "Apply to events, get approved, and connect with organizers." },
              { step: "04", title: "Grow", desc: "Earn certificates, build reputation, and unlock more opportunities." },
            ].map((item) => (
              <div key={item.step} className="text-center">
                <div className="inline-flex items-center justify-center w-14 h-14 bg-indigo-600 text-white rounded-full text-lg font-bold mb-4">
                  {item.step}
                </div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">{item.title}</h3>
                <p className="text-sm text-gray-600">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-indigo-600">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
            Ready to Make an Impact?
          </h2>
          <p className="text-lg text-indigo-100 mb-8 max-w-2xl mx-auto">
            Join thousands of volunteers and organizations building India&apos;s largest event workforce network.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/register">
              <Button size="lg" className="bg-white text-indigo-600 hover:bg-indigo-50 text-base px-8 gap-2">
                <CheckCircle2 className="w-5 h-5" />
                Join Gig Bharat
              </Button>
            </Link>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}
