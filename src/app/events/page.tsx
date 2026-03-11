"use client";

import { useState, useEffect, useCallback } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { EventCard } from "@/components/EventCard";
import { Input } from "@/components/ui/Input";
import { Select } from "@/components/ui/Select";
import { Button } from "@/components/ui/Button";
import { EVENT_CATEGORIES, EVENT_TYPES, INDIAN_STATES } from "@/lib/constants";
import { Search, SlidersHorizontal, X } from "lucide-react";

interface EventData {
  id: string;
  title: string;
  shortDesc?: string;
  category: string;
  eventType: string;
  status: string;
  startDate: string;
  endDate: string;
  city?: string;
  state?: string;
  totalSlots: number;
  filledSlots: number;
  bannerImage?: string;
  organizer: {
    id: string;
    organizationProfile?: {
      organizationName: string;
      logoUrl?: string;
      verificationStatus: string;
    } | null;
  };
  _count: { applications: number };
}

export default function EventsPage() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const [events, setEvents] = useState<EventData[]>([]);
  const [loading, setLoading] = useState(true);
  const [totalPages, setTotalPages] = useState(1);
  const [page, setPage] = useState(1);
  const [showFilters, setShowFilters] = useState(false);

  const [search, setSearch] = useState(searchParams.get("search") || "");
  const [category, setCategory] = useState(searchParams.get("category") || "");
  const [eventType, setEventType] = useState(searchParams.get("eventType") || "");
  const [state, setState] = useState(searchParams.get("state") || "");

  const fetchEvents = useCallback(async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams();
      if (search) params.set("search", search);
      if (category) params.set("category", category);
      if (eventType) params.set("eventType", eventType);
      if (state) params.set("state", state);
      params.set("page", page.toString());

      const res = await fetch(`/api/events?${params.toString()}`);
      if (res.ok) {
        const data = await res.json();
        setEvents(data.events);
        setTotalPages(data.pagination.totalPages);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  }, [search, category, eventType, state, page]);

  useEffect(() => {
    fetchEvents();
  }, [fetchEvents]);

  const clearFilters = () => {
    setSearch("");
    setCategory("");
    setEventType("");
    setState("");
    setPage(1);
  };

  const hasFilters = search || category || eventType || state;

  const categoryOptions = [{ value: "", label: "All Categories" }, ...EVENT_CATEGORIES.map((c) => ({ value: c.value, label: c.label }))];
  const typeOptions = [{ value: "", label: "All Types" }, ...EVENT_TYPES.map((t) => ({ value: t.value, label: t.label }))];
  const stateOptions = [{ value: "", label: "All States" }, ...INDIAN_STATES.map((s) => ({ value: s, label: s }))];

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />

      {/* Hero */}
      <div className="bg-white border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Browse Events</h1>
          <p className="text-gray-600 mb-6">
            Discover volunteering opportunities — hackathons, summits, workshops, CSR drives, and more across India.
          </p>

          {/* Search Bar */}
          <div className="flex gap-3">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
              <input
                type="text"
                placeholder="Search events by name, description, or city..."
                value={search}
                onChange={(e) => { setSearch(e.target.value); setPage(1); }}
                className="w-full pl-10 pr-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none text-sm"
              />
            </div>
            <Button
              variant="outline"
              onClick={() => setShowFilters(!showFilters)}
              className="gap-2"
            >
              <SlidersHorizontal className="w-4 h-4" />
              Filters
              {hasFilters && (
                <span className="w-2 h-2 rounded-full bg-indigo-600" />
              )}
            </Button>
          </div>

          {/* Filters */}
          {showFilters && (
            <div className="mt-4 grid grid-cols-1 sm:grid-cols-3 gap-3">
              <Select
                label=""
                options={categoryOptions}
                value={category}
                onChange={(e) => { setCategory(e.target.value); setPage(1); }}
              />
              <Select
                label=""
                options={typeOptions}
                value={eventType}
                onChange={(e) => { setEventType(e.target.value); setPage(1); }}
              />
              <Select
                label=""
                options={stateOptions}
                value={state}
                onChange={(e) => { setState(e.target.value); setPage(1); }}
              />
            </div>
          )}

          {hasFilters && (
            <button
              onClick={clearFilters}
              className="mt-3 flex items-center gap-1.5 text-sm text-indigo-600 hover:text-indigo-800"
            >
              <X className="w-4 h-4" /> Clear all filters
            </button>
          )}
        </div>
      </div>

      {/* Events Grid */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {loading ? (
          <div className="flex justify-center py-20">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-600" />
          </div>
        ) : events.length === 0 ? (
          <div className="text-center py-20">
            <Calendar className="w-16 h-16 text-gray-300 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">No events found</h3>
            <p className="text-gray-500">
              {hasFilters
                ? "Try adjusting your filters or search query."
                : "No events are currently listed. Check back soon!"}
            </p>
          </div>
        ) : (
          <>
            <div className="flex items-center justify-between mb-6">
              <p className="text-sm text-gray-500">
                Showing {events.length} event{events.length !== 1 && "s"}
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {events.map((event) => (
                <EventCard key={event.id} event={event} />
              ))}
            </div>

            {/* Pagination */}
            {totalPages > 1 && (
              <div className="flex justify-center gap-2 mt-10">
                <Button
                  variant="outline"
                  size="sm"
                  disabled={page === 1}
                  onClick={() => setPage(page - 1)}
                >
                  Previous
                </Button>
                <span className="flex items-center px-4 text-sm text-gray-600">
                  Page {page} of {totalPages}
                </span>
                <Button
                  variant="outline"
                  size="sm"
                  disabled={page === totalPages}
                  onClick={() => setPage(page + 1)}
                >
                  Next
                </Button>
              </div>
            )}
          </>
        )}
      </div>

      <Footer />
    </div>
  );
}
