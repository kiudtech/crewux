"use client";

import { useState, useEffect, useCallback } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { Navbar } from "@/components/layout/Navbar";
import { DashboardSidebar } from "@/components/layout/DashboardSidebar";
import { Card, CardContent } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { Select } from "@/components/ui/Select";
import { EVENT_CATEGORY_LABELS, EVENT_STATUS_LABELS } from "@/lib/constants";
import {
  Calendar, Plus, Users, Edit2, Eye, MoreVertical,
  MapPin, Clock,
} from "lucide-react";

interface OrgEvent {
  id: string;
  title: string;
  category: string;
  eventType: string;
  status: string;
  startDate: string;
  endDate: string;
  city?: string;
  state?: string;
  totalSlots: number;
  filledSlots: number;
  _count: { applications: number };
}

const statusVariants: Record<string, "success" | "warning" | "danger" | "info" | "default"> = {
  DRAFT: "default",
  PUBLISHED: "info",
  ACTIVE: "success",
  COMPLETED: "warning",
  CANCELLED: "danger",
  ARCHIVED: "default",
};

export default function OrgEventsPage() {
  const { data: session, status: authStatus } = useSession();
  const router = useRouter();
  const [events, setEvents] = useState<OrgEvent[]>([]);
  const [loading, setLoading] = useState(true);
  const [statusFilter, setStatusFilter] = useState("ALL");
  const [totalPages, setTotalPages] = useState(1);
  const [page, setPage] = useState(1);

  const fetchEvents = useCallback(async () => {
    if (!session?.user?.id) return;
    setLoading(true);
    try {
      const params = new URLSearchParams({
        organizerId: session.user.id,
        status: statusFilter,
        page: page.toString(),
        limit: "10",
      });
      const res = await fetch(`/api/events?${params}`);
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
  }, [session?.user?.id, statusFilter, page]);

  useEffect(() => {
    if (authStatus === "unauthenticated") router.push("/login");
  }, [authStatus, router]);

  useEffect(() => {
    fetchEvents();
  }, [fetchEvents]);

  const formatDate = (d: string) =>
    new Date(d).toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" });

  const statusFilterOptions = [
    { value: "ALL", label: "All Statuses" },
    { value: "DRAFT", label: "Drafts" },
    { value: "PUBLISHED", label: "Published" },
    { value: "ACTIVE", label: "Active" },
    { value: "COMPLETED", label: "Completed" },
    { value: "CANCELLED", label: "Cancelled" },
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      <div className="flex">
        <DashboardSidebar role="ORGANIZATION" />
        <main className="flex-1 p-6 lg:p-8">
          {/* Header */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">My Events</h1>
              <p className="text-sm text-gray-500">Manage all your events and track applications</p>
            </div>
            <Button onClick={() => router.push("/dashboard/organization/events/create")} className="gap-2">
              <Plus className="w-4 h-4" /> Create Event
            </Button>
          </div>

          {/* Filter */}
          <div className="mb-6 max-w-xs">
            <Select
              label=""
              options={statusFilterOptions}
              value={statusFilter}
              onChange={(e) => { setStatusFilter(e.target.value); setPage(1); }}
            />
          </div>

          {/* Events List */}
          {loading ? (
            <div className="flex justify-center py-16">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-600" />
            </div>
          ) : events.length === 0 ? (
            <Card>
              <CardContent className="text-center py-16">
                <Calendar className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-gray-900 mb-2">No events yet</h3>
                <p className="text-gray-500 mb-4">Create your first event to start receiving volunteer applications</p>
                <Button onClick={() => router.push("/dashboard/organization/events/create")}>
                  <Plus className="w-4 h-4 mr-2" /> Create Event
                </Button>
              </CardContent>
            </Card>
          ) : (
            <div className="space-y-4">
              {events.map((event) => {
                const slotsLeft = event.totalSlots - event.filledSlots;
                return (
                  <Card key={event.id} hover>
                    <CardContent className="p-5">
                      <div className="flex flex-col sm:flex-row sm:items-center gap-4">
                        {/* Info */}
                        <div className="flex-1 min-w-0">
                          <div className="flex flex-wrap items-center gap-2 mb-1">
                            <Badge variant={statusVariants[event.status] || "default"}>
                              {EVENT_STATUS_LABELS[event.status] || event.status}
                            </Badge>
                            <span className="text-xs text-gray-400">
                              {EVENT_CATEGORY_LABELS[event.category] || event.category}
                            </span>
                          </div>
                          <h3 className="font-semibold text-gray-900 text-lg truncate">{event.title}</h3>
                          <div className="flex flex-wrap gap-4 mt-2 text-sm text-gray-500">
                            <span className="flex items-center gap-1.5">
                              <Calendar className="w-4 h-4" />
                              {formatDate(event.startDate)}
                            </span>
                            {(event.city || event.state) && (
                              <span className="flex items-center gap-1.5">
                                <MapPin className="w-4 h-4" />
                                {[event.city, event.state].filter(Boolean).join(", ")}
                              </span>
                            )}
                            <span className="flex items-center gap-1.5">
                              <Users className="w-4 h-4" />
                              {event._count.applications} applications
                            </span>
                            <span className={`flex items-center gap-1.5 ${slotsLeft <= 0 ? "text-red-500" : "text-emerald-600"}`}>
                              {slotsLeft > 0 ? `${slotsLeft} slots left` : "Full"}
                            </span>
                          </div>
                        </div>

                        {/* Actions */}
                        <div className="flex items-center gap-2 shrink-0">
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => router.push(`/events/${event.id}`)}
                            title="View"
                          >
                            <Eye className="w-4 h-4" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => router.push(`/dashboard/organization/events/${event.id}/edit`)}
                            title="Edit"
                          >
                            <Edit2 className="w-4 h-4" />
                          </Button>
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => router.push(`/dashboard/organization/applications?eventId=${event.id}`)}
                          >
                            View Applications
                          </Button>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                );
              })}

              {/* Pagination */}
              {totalPages > 1 && (
                <div className="flex justify-center gap-2 mt-6">
                  <Button variant="outline" size="sm" disabled={page === 1} onClick={() => setPage(page - 1)}>
                    Previous
                  </Button>
                  <span className="flex items-center px-4 text-sm text-gray-600">
                    Page {page} of {totalPages}
                  </span>
                  <Button variant="outline" size="sm" disabled={page === totalPages} onClick={() => setPage(page + 1)}>
                    Next
                  </Button>
                </div>
              )}
            </div>
          )}
        </main>
      </div>
    </div>
  );
}
