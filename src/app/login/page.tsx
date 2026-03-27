"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { useSession, signIn } from "next-auth/react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import {
  ArrowRight,
  Eye,
  EyeOff,
  Mail,
  Lock,
  Sparkles,
  Shield,
  Star,
  Zap,
  CheckCircle,
  AlertCircle,
  Github,
  Twitter,
  Linkedin
} from "lucide-react";
import toast from "react-hot-toast";

// Animation Variants
const fadeInUp = {
  hidden: { opacity: 0, y: 30 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.5, ease: "easeOut" } }
};

const staggerContainer = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { staggerChildren: 0.1 } }
};

const scaleOnHover = {
  scale: 1.02,
  transition: { duration: 0.2 }
};

export default function LoginPage() {
  const router = useRouter();
  const { data: session, status } = useSession();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });

  useEffect(() => {
    if (session?.user) {
      const role = session.user.role;
      if (role === "SUPER_ADMIN") router.push("/dashboard/super-admin");
      else if (role === "ORGANIZATION") router.push("/dashboard/organization");
      else if (role === "COLLEGE") router.push("/dashboard/college");
      else router.push("/dashboard/volunteer");
    }
  }, [session, router]);

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      setMousePosition({ x: e.clientX, y: e.clientY });
    };
    window.addEventListener("mousemove", handleMouseMove);
    return () => window.removeEventListener("mousemove", handleMouseMove);
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    if (!email || !password) {
      setError("Please fill in all fields");
      setLoading(false);
      return;
    }

    try {
      const result = await signIn("credentials", {
        email,
        password,
        redirect: false,
      });

      if (result?.error) {
        setError("Invalid email or password");
        toast.error("Invalid credentials");
      } else {
        toast.success("Login successful!");
      }
    } catch {
      setError("Something went wrong");
      toast.error("Login failed");
    } finally {
      setLoading(false);
    }
  };

  const socialLogins = [
    { name: "Google", icon: null, color: "hover:bg-red-50 hover:border-red-200", textColor: "text-red-600" },
    { name: "GitHub", icon: <Github className="w-5 h-5" />, color: "hover:bg-gray-50 hover:border-gray-300", textColor: "text-gray-700" },
    { name: "LinkedIn", icon: <Linkedin className="w-5 h-5" />, color: "hover:bg-blue-50 hover:border-blue-200", textColor: "text-blue-600" }
  ];

  if (status === "loading") {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-900 to-purple-900">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-500"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-indigo-950 to-purple-950 overflow-hidden relative">
      {/* Animated Background */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {[...Array(30)].map((_, i) => (
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

      <div className="relative min-h-[calc(100vh-4rem)] flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="max-w-md w-full"
        >
          {/* Header */}
          <div className="text-center mb-8">
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-indigo-500/20 backdrop-blur-sm rounded-full text-indigo-300 text-sm font-medium mb-4 border border-indigo-500/30">
              <Sparkles className="w-4 h-4" />
              <span>Welcome Back</span>
            </div>
            <h1 className="text-3xl md:text-4xl font-bold text-white mb-2">
              Sign In to <span className="bg-gradient-to-r from-indigo-400 to-purple-400 bg-clip-text text-transparent">Crewux</span>
            </h1>
            <p className="text-gray-400">Access your account and start making an impact</p>
          </div>

          {/* Login Form Card */}
          <motion.div
            variants={fadeInUp}
            initial="hidden"
            animate="visible"
            className="bg-white/10 backdrop-blur-xl rounded-2xl p-8 border border-white/20 shadow-2xl"
          >
            <form onSubmit={handleSubmit} className="space-y-5">
              {/* Email Field */}
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">Email Address</label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                  <Input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="you@example.com"
                    className="pl-10 bg-white/5 border-white/20 text-white placeholder:text-gray-500 focus:border-indigo-500"
                  />
                </div>
              </div>

              {/* Password Field */}
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">Password</label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                  <Input
                    type={showPassword ? "text" : "password"}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="••••••••"
                    className="pl-10 bg-white/5 border-white/20 text-white placeholder:text-gray-500 focus:border-indigo-500"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-300"
                  >
                    {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                  </button>
                </div>
              </div>

              {/* Forgot Password Link */}
              <div className="flex justify-end">
                <Link href="/forgot-password" className="text-sm text-indigo-400 hover:text-indigo-300 transition">
                  Forgot password?
                </Link>
              </div>

              {/* Error Message */}
              {error && (
                <motion.div
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  className="flex items-center gap-2 p-3 bg-red-500/10 border border-red-500/20 rounded-lg text-red-400 text-sm"
                >
                  <AlertCircle className="w-4 h-4" />
                  {error}
                </motion.div>
              )}

              {/* Submit Button */}
              <motion.div whileHover={scaleOnHover} whileTap={{ scale: 0.98 }}>
                <Button
                  type="submit"
                  isLoading={loading}
                  className="w-full bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white py-3 text-lg font-semibold"
                >
                  {loading ? "Signing in..." : "Sign In"}
                  <ArrowRight className="ml-2 w-4 h-4" />
                </Button>
              </motion.div>
            </form>

            {/* Divider */}
            <div className="relative my-6">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-white/10"></div>
              </div>
              <div className="relative flex justify-center text-sm">
                <span className="px-2 bg-transparent text-gray-500">Or continue with</span>
              </div>
            </div>

            {/* Social Logins */}
            <div className="grid grid-cols-3 gap-3">
              {socialLogins.map((social) => (
                <motion.button
                  key={social.name}
                  whileHover={{ y: -2 }}
                  whileTap={{ scale: 0.98 }}
                  className={`flex items-center justify-center gap-2 px-4 py-2 bg-white/5 border border-white/20 rounded-lg ${social.color} transition-all duration-300`}
                >
                  {social.icon ? social.icon : <span className="text-lg">G</span>}
                  <span className={`text-sm font-medium ${social.textColor}`}>{social.name}</span>
                </motion.button>
              ))}
            </div>

            {/* Register Link */}
            <p className="text-center text-gray-400 mt-6">
              Don't have an account?{" "}
              <Link href="/register" className="text-indigo-400 font-medium hover:text-indigo-300 inline-flex items-center gap-1 group">
                Create one
                <ArrowRight className="w-3 h-3 group-hover:translate-x-1 transition" />
              </Link>
            </p>
          </motion.div>

          {/* Trust Badges */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3 }}
            className="mt-8 flex flex-wrap justify-center gap-6"
          >
            <div className="flex items-center gap-2 text-gray-500 text-sm">
              <Shield className="w-4 h-4 text-green-400" />
              <span>Secure Login</span>
            </div>
            <div className="flex items-center gap-2 text-gray-500 text-sm">
              <Star className="w-4 h-4 text-amber-400" />
              <span>5000+ Trusted Users</span>
            </div>
            <div className="flex items-center gap-2 text-gray-500 text-sm">
              <Zap className="w-4 h-4 text-indigo-400" />
              <span>24/7 Support</span>
            </div>
          </motion.div>
        </motion.div>
      </div>

      <Footer />
    </div>
  );
}