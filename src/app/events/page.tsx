"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { motion, AnimatePresence, Variants } from "framer-motion";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import {
  Search,
  Calendar,
  MapPin,
  Users,
  ArrowRight,
  Filter,
  X,
  Sparkles,
  Loader2,
  ChevronLeft,
  ChevronRight
} from "lucide-react";
import { format } from "date-fns";

// ========== ANIMATION VARIANTS WITH TYPE ==========
const fadeInUp: Variants = {
  hidden: { opacity: 0, y: 30 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.5, ease: "easeOut" } }
};

const staggerContainer: Variants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { staggerChildren: 0.1 } }
};

const categories = [
  { value: "all", label: "All Events" },
  { value: "HACKATHON", label: "Hackathons" },
  { value: "SUMMIT", label: "Summits" },
  { value: "WORKSHOP", label: "Workshops" },
  { value: "CSR_DRIVE", label: "CSR Drives" },
  { value: "TECH_FEST", label: "Tech Fests" },
  { value: "WEBINAR", label: "Webinars" }
];

interface Event {
  id: string;
  title: string;
  description: string;
  category: string;
  eventType: string;
  status: string;
  startDate: string;
  endDate: string;
  city?: string;
  state?: string;
  venue?: string;
  totalSlots: number;
  filledSlots: number;
  organizerName: string;
}

export default function EventsPage() {
  const [events, setEvents] = useState<Event[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [showFilters, setShowFilters] = useState(false);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  useEffect(() => {
    fetchEvents();
  }, [page, selectedCategory, search]);

  const fetchEvents = async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams({
        page: page.toString(),
        limit: "9",
        category: selectedCategory === "all" ? "" : selectedCategory,
        search: search
      });
      const res = await fetch(`/api/events?${params}`);
      if (res.ok) {
        const data = await res.json();
        setEvents(data.events || []);
        setTotalPages(data.pagination?.totalPages || 1);
      }
    } catch (error) {
      console.error("Error fetching events:", error);
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (date: string) => {
    try {
      return format(new Date(date), "MMM dd, yyyy • hh:mm a");
    } catch {
      return date;
    }
  };

  const getCategoryColor = (category: string) => {
    const colors: Record<string, string> = {
      HACKATHON: "from-purple-500 to-pink-500",
      SUMMIT: "from-blue-500 to-cyan-500",
      WORKSHOP: "from-emerald-500 to-teal-500",
      CSR_DRIVE: "from-rose-500 to-orange-500",
      TECH_FEST: "from-indigo-500 to-purple-500",
      WEBINAR: "from-amber-500 to-yellow-500",
      default: "from-gray-500 to-gray-600"
    };
    return colors[category] || colors.default;
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-indigo-950 to-purple-950">
      <Navbar />

      <div className="relative pt-24 pb-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Header */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="text-center mb-12"
          >
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-indigo-500/20 backdrop-blur-sm rounded-full text-indigo-300 text-sm font-medium mb-4 border border-indigo-500/30">
              <Sparkles className="w-4 h-4" />
              <span>Discover Opportunities</span>
            </div>
            <h1 className="text-4xl md:text-5xl font-bold text-white mb-4">
              Upcoming <span className="bg-gradient-to-r from-indigo-400 to-purple-400 bg-clip-text text-transparent">Events</span>
            </h1>
            <p className="text-lg text-gray-300 max-w-2xl mx-auto">
              Find and register for events that match your interests and skills
            </p>
          </motion.div>

          {/* Search and Filters */}
          <div className="mb-8">
            <div className="flex flex-col md:flex-row gap-4">
              <div className="flex-1 relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                <Input
                  type="text"
                  placeholder="Search events..."
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  className="pl-10 bg-white/10 border-white/20 text-white placeholder:text-gray-500 focus:border-indigo-500"
                />
              </div>
              <Button
                variant="outline"
                onClick={() => setShowFilters(!showFilters)}
                className="border-white/20 text-gray-300 hover:bg-white/10"
              >
                <Filter className="w-4 h-4 mr-2" />
                Filters
                {showFilters ? <X className="w-4 h-4 ml-2" /> : null}
              </Button>
            </div>

            {/* Category Filters */}
            <AnimatePresence>
              {showFilters && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: "auto" }}
                  exit={{ opacity: 0, height: 0 }}
                  className="mt-4 overflow-hidden"
                >
                  <div className="flex flex-wrap gap-2 p-4 bg-white/5 backdrop-blur-sm rounded-xl border border-white/10">
                    {categories.map((cat) => (
                      <button
                        key={cat.value}
                        onClick={() => setSelectedCategory(cat.value)}
                        className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                          selectedCategory === cat.value
                            ? "bg-gradient-to-r from-indigo-600 to-purple-600 text-white shadow-lg"
                            : "bg-white/10 text-gray-300 hover:bg-white/20"
                        }`}
                      >
                        {cat.label}
                      </button>
                    ))}
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* Events Grid */}
          {loading ? (
            <div className="flex justify-center items-center py-20">
              <Loader2 className="w-8 h-8 text-indigo-400 animate-spin" />
            </div>
          ) : events.length === 0 ? (
            <div className="text-center py-20">
              <Calendar className="w-12 h-12 text-gray-400 mx-auto mb-4" />
              <h3 className="text-xl font-semibold text-white mb-2">No events found</h3>
              <p className="text-gray-400">Try adjusting your search or filters</p>
            </div>
          ) : (
            <motion.div
              variants={staggerContainer}
              initial="hidden"
              animate="visible"
              className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
            >
              {events.map((event) => (
                <motion.div
                  key={event.id}
                  variants={fadeInUp}
                  whileHover={{ y: -8 }}
                  className="group"
                >
                  <Link href={`/events/${event.id}`}>
                    <div className="relative bg-white/10 backdrop-blur-xl rounded-2xl overflow-hidden border border-white/20 hover:border-white/40 transition-all duration-300 h-full">
                      {/* Category Badge */}
                      <div className={`absolute top-4 left-4 z-10 px-3 py-1 bg-gradient-to-r ${getCategoryColor(event.category)} rounded-full text-xs font-medium text-white shadow-lg`}>
                        {event.category?.replace("_", " ")}
                      </div>

                      <div className="p-6">
                        <div className="flex items-center gap-2 text-gray-400 text-sm mb-3">
                          <Calendar className="w-4 h-4" />
                          <span>{formatDate(event.startDate)}</span>
                        </div>

                        <h3 className="text-xl font-semibold text-white mb-2 line-clamp-2 group-hover:text-indigo-400 transition">
                          {event.title}
                        </h3>

                        <p className="text-gray-400 text-sm mb-4 line-clamp-2">
                          {event.description}
                        </p>

                        <div className="space-y-2 mb-4">
                          {event.city && (
                            <div className="flex items-center gap-2 text-gray-400 text-sm">
                              <MapPin className="w-4 h-4" />
                              <span>{event.city}, {event.state}</span>
                            </div>
                          )}
                          <div className="flex items-center gap-2 text-gray-400 text-sm">
                            <Users className="w-4 h-4" />
                            <span>{event.filledSlots}/{event.totalSlots} spots filled</span>
                          </div>
                        </div>

                        {/* Progress Bar */}
                        <div className="w-full bg-white/10 rounded-full h-1.5 mb-4">
                          <div
                            className="bg-gradient-to-r from-indigo-500 to-purple-500 h-1.5 rounded-full transition-all duration-500"
                            style={{ width: `${(event.filledSlots / event.totalSlots) * 100}%` }}
                          />
                        </div>

                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-2">
                            <div className="w-8 h-8 bg-white/10 rounded-full flex items-center justify-center">
                              <span className="text-sm font-medium text-gray-300">
                                {event.organizerName?.charAt(0) || "O"}
                              </span>
                            </div>
                            <span className="text-sm text-gray-400">{event.organizerName}</span>
                          </div>
                          <Button
                            size="sm"
                            className="bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white"
                          >
                            Register
                            <ArrowRight className="ml-2 w-4 h-4" />
                          </Button>
                        </div>
                      </div>
                    </div>
                  </Link>
                </motion.div>
              ))}
            </motion.div>
          )}

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="flex justify-center gap-2 mt-12">
              <Button
                variant="outline"
                disabled={page === 1}
                onClick={() => setPage(page - 1)}
                className="border-white/20 text-gray-300 hover:bg-white/10"
              >
                <ChevronLeft className="w-4 h-4 mr-2" />
                Previous
              </Button>
              <div className="flex items-center gap-2">
                {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                  let pageNum;
                  if (totalPages <= 5) pageNum = i + 1;
                  else if (page <= 3) pageNum = i + 1;
                  else if (page >= totalPages - 2) pageNum = totalPages - 4 + i;
                  else pageNum = page - 2 + i;
                  
                  return (
                    <button
                      key={pageNum}
                      onClick={() => setPage(pageNum)}
                      className={`w-10 h-10 rounded-lg font-medium transition-all ${
                        page === pageNum
                          ? "bg-gradient-to-r from-indigo-600 to-purple-600 text-white shadow-lg"
                          : "bg-white/10 text-gray-300 hover:bg-white/20"
                      }`}
                    >
                      {pageNum}
                    </button>
                  );
                })}
              </div>
              <Button
                variant="outline"
                disabled={page === totalPages}
                onClick={() => setPage(page + 1)}
                className="border-white/20 text-gray-300 hover:bg-white/10"
              >
                Next
                <ChevronRight className="w-4 h-4 ml-2" />
              </Button>
            </div>
          )}
        </div>
      </div>

      <Footer />
    </div>
  );
}