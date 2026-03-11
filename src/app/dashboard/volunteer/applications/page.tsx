"use client";

import { useState, useEffect, useCallback } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Navbar } from "@/components/layout/Navbar";
import { DashboardSidebar } from "@/components/layout/DashboardSidebar";
import { Card, CardContent } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { Select } from "@/components/ui/Select";
import { APPLICATION_STATUS_LABELS, EVENT_CATEGORY_LABELS } from "@/lib/constants";
import {
  FileText, Calendar, MapPin, Building2,
  CheckCircle2, XCircle, Clock, AlertCircle, ExternalLink,
} from "lucide-react";
import toast from "react-hot-toast";

interface ApplicationData {
  id: string;
  status: string;
  role?: string;
  message?: string;
  orgNote?: string;
  appliedAt: string;
  event: {
    id: string;
    title: string;
    category: string;
    startDate: string;
    endDate: string;
    city?: string;
    state?: string;
    status: string;
    organizer: {
      organizationProfile?: {
        organizationName: string;
      } | null;
    };
  };
}

const statusVariants: Record<string, "success" | "warning" | "danger" | "info" | "default"> = {
  APPLIED: "info",
  SHORTLISTED: "warning",
  ACCEPTED: "success",
  REJECTED: "danger",
  WITHDRAWN: "default",
};

const statusIcons: Record<string, React.ReactNode> = {
  APPLIED: <Clock className="w-5 h-5 text-blue-500" />,
  SHORTLISTED: <AlertCircle className="w-5 h-5 text-amber-500" />,
  ACCEPTED: <CheckCircle2 className="w-5 h-5 text-emerald-500" />,
  REJECTED: <XCircle className="w-5 h-5 text-red-500" />,
  WITHDRAWN: <XCircle className="w-5 h-5 text-gray-400" />,
};

export default function VolunteerApplicationsPage() {
  const { data: session, status: authStatus } = useSession();
  const router = useRouter();
  const [applications, setApplications] = useState<ApplicationData[]>([]);
  const [loading, setLoading] = useState(true);
  const [statusFilter, setStatusFilter] = useState("ALL");
  const [totalPages, setTotalPages] = useState(1);
  const [page, setPage] = useState(1);

  useEffect(() => {
    if (authStatus === "unauthenticated") router.push("/login");
  }, [authStatus, router]);

  const fetchApplications = useCallback(async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams({
        page: page.toString(),
        limit: "20",
      });
      if (statusFilter !== "ALL") params.set("status", statusFilter);

      const res = await fetch(`/api/applications?${params}`);
      if (res.ok) {
        const data = await res.json();
        setApplications(data.applications);
        setTotalPages(data.pagination.totalPages);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  }, [statusFilter, page]);

  useEffect(() => {
    fetchApplications();
  }, [fetchApplications]);

  const handleWithdraw = async (appId: string) => {
    try {
      const res = await fetch(`/api/applications/${appId}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status: "WITHDRAWN" }),
      });
      if (res.ok) {
        toast.success("Application withdrawn");
        fetchApplications();
      } else {
        const data = await res.json();
        toast.error(data.error || "Failed to withdraw");
      }
    } catch {
      toast.error("Something went wrong");
    }
  };

  const formatDate = (d: string) =>
    new Date(d).toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" });

  const statusFilterOptions = [
    { value: "ALL", label: "All Applications" },
    { value: "APPLIED", label: "Applied" },
    { value: "SHORTLISTED", label: "Shortlisted" },
    { value: "ACCEPTED", label: "Accepted" },
    { value: "REJECTED", label: "Rejected" },
    { value: "WITHDRAWN", label: "Withdrawn" },
  ];

  // Summary stats
  const counts = applications.reduce(
    (acc, app) => {
      acc[app.status] = (acc[app.status] || 0) + 1;
      return acc;
    },
    {} as Record<string, number>
  );

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      <div className="flex">
        <DashboardSidebar role="VOLUNTEER" />
        <main className="flex-1 p-6 lg:p-8">
          {/* Header */}
          <div className="mb-6">
            <h1 className="text-2xl font-bold text-gray-900">My Applications</h1>
            <p className="text-sm text-gray-500">Track the status of your event applications</p>
          </div>

          {/* Quick Stats */}
          {applications.length > 0 && statusFilter === "ALL" && (
            <div className="grid grid-cols-2 sm:grid-cols-5 gap-3 mb-6">
              {["APPLIED", "SHORTLISTED", "ACCEPTED", "REJECTED", "WITHDRAWN"].map((s) => (
                <button
                  key={s}
                  onClick={() => { setStatusFilter(s); setPage(1); }}
                  className="p-3 bg-white rounded-lg border border-gray-200 hover:border-indigo-300 transition-colors text-center"
                >
                  <p className="text-xl font-bold text-gray-900">{counts[s] || 0}</p>
                  <p className="text-xs text-gray-500">{APPLICATION_STATUS_LABELS[s]}</p>
                </button>
              ))}
            </div>
          )}

          {/* Filter */}
          <div className="mb-6 max-w-xs">
            <Select
              label=""
              options={statusFilterOptions}
              value={statusFilter}
              onChange={(e) => { setStatusFilter(e.target.value); setPage(1); }}
            />
          </div>

          {/* Applications List */}
          {loading ? (
            <div className="flex justify-center py-16">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-600" />
            </div>
          ) : applications.length === 0 ? (
            <Card>
              <CardContent className="text-center py-16">
                <FileText className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-gray-900 mb-2">No applications yet</h3>
                <p className="text-gray-500 mb-4">Browse events and apply to start volunteering!</p>
                <Button onClick={() => router.push("/dashboard/volunteer/events")}>
                  Browse Events
                </Button>
              </CardContent>
            </Card>
          ) : (
            <div className="space-y-3">
              {applications.map((app) => {
                const orgName = app.event.organizer?.organizationProfile?.organizationName || "Unknown Organization";

                return (
                  <Card key={app.id} hover>
                    <CardContent className="p-5">
                      <div className="flex flex-col sm:flex-row gap-4">
                        {/* Status indicator */}
                        <div className="shrink-0 pt-1">
                          {statusIcons[app.status] || statusIcons.APPLIED}
                        </div>

                        {/* Main info */}
                        <div className="flex-1 min-w-0">
                          <div className="flex flex-wrap items-center gap-2 mb-1">
                            <Link href={`/events/${app.event.id}`} className="font-semibold text-gray-900 hover:text-indigo-600 transition-colors truncate">
                              {app.event.title}
                            </Link>
                            <Badge variant={statusVariants[app.status] || "default"}>
                              {APPLICATION_STATUS_LABELS[app.status] || app.status}
                            </Badge>
                          </div>

                          <div className="flex flex-wrap gap-3 text-sm text-gray-500 mb-2">
                            <span className="flex items-center gap-1.5">
                              <Building2 className="w-3.5 h-3.5" /> {orgName}
                            </span>
                            <span className="flex items-center gap-1.5">
                              <Calendar className="w-3.5 h-3.5" /> {formatDate(app.event.startDate)}
                            </span>
                            {(app.event.city || app.event.state) && (
                              <span className="flex items-center gap-1.5">
                                <MapPin className="w-3.5 h-3.5" />
                                {[app.event.city, app.event.state].filter(Boolean).join(", ")}
                              </span>
                            )}
                          </div>

                          {app.role && (
                            <p className="text-sm text-gray-600 mb-1">
                              <span className="font-medium">Role:</span> {app.role}
                            </p>
                          )}

                          {app.orgNote && (
                            <div className="mt-2 p-2 bg-amber-50 border border-amber-100 rounded text-sm text-amber-800">
                              <span className="font-medium">Organizer Note:</span> {app.orgNote}
                            </div>
                          )}

                          <p className="text-xs text-gray-400 mt-2">Applied on {formatDate(app.appliedAt)}</p>
                        </div>

                        {/* Actions */}
                        <div className="shrink-0 flex items-start gap-2">
                          <Link href={`/events/${app.event.id}`}>
                            <Button variant="ghost" size="sm" className="gap-1">
                              <ExternalLink className="w-3.5 h-3.5" /> View Event
                            </Button>
                          </Link>
                          {["APPLIED", "SHORTLISTED"].includes(app.status) && (
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => handleWithdraw(app.id)}
                              className="text-red-600 border-red-200 hover:bg-red-50"
                            >
                              Withdraw
                            </Button>
                          )}
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                );
              })}

              {/* Pagination */}
              {totalPages > 1 && (
                <div className="flex justify-center gap-2 mt-6">
                  <Button variant="outline" size="sm" disabled={page === 1} onClick={() => setPage(page - 1)}>Previous</Button>
                  <span className="flex items-center px-4 text-sm text-gray-600">Page {page} of {totalPages}</span>
                  <Button variant="outline" size="sm" disabled={page === totalPages} onClick={() => setPage(page + 1)}>Next</Button>
                </div>
              )}
            </div>
          )}
        </main>
      </div>
    </div>
  );
}
