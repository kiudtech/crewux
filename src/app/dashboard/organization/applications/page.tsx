"use client";

import { useState, useEffect, useCallback } from "react";
import { useSession } from "next-auth/react";
import { useRouter, useSearchParams } from "next/navigation";
import { Navbar } from "@/components/layout/Navbar";
import { DashboardSidebar } from "@/components/layout/DashboardSidebar";
import { Card, CardContent } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { Select } from "@/components/ui/Select";
import { Textarea } from "@/components/ui/Textarea";
import { APPLICATION_STATUS_LABELS, EVENT_CATEGORY_LABELS } from "@/lib/constants";
import {
  FileText, Calendar, User, Star, TrendingUp,
  CheckCircle2, XCircle, Clock, ChevronDown, ChevronUp,
  GraduationCap, Mail, Award,
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
    status: string;
  };
  applicant: {
    id: string;
    email: string;
    volunteerProfile?: {
      fullName: string;
      college?: string;
      skills: string;
      reputationScore: number;
      completionRate: number;
      totalEvents: number;
    } | null;
  };
  team?: {
    id: string;
    name: string;
    skills: string;
  } | null;
}

const statusVariants: Record<string, "success" | "warning" | "danger" | "info" | "default"> = {
  APPLIED: "info",
  SHORTLISTED: "warning",
  ACCEPTED: "success",
  REJECTED: "danger",
  WITHDRAWN: "default",
};

export default function OrgApplicationsPage() {
  const { data: session, status: authStatus } = useSession();
  const router = useRouter();
  const searchParams = useSearchParams();
  const eventIdFilter = searchParams.get("eventId") || "";

  const [applications, setApplications] = useState<ApplicationData[]>([]);
  const [loading, setLoading] = useState(true);
  const [statusFilter, setStatusFilter] = useState("ALL");
  const [totalPages, setTotalPages] = useState(1);
  const [page, setPage] = useState(1);
  const [expandedId, setExpandedId] = useState<string | null>(null);
  const [orgNotes, setOrgNotes] = useState<Record<string, string>>({});

  const fetchApplications = useCallback(async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams({
        page: page.toString(),
        limit: "20",
      });
      if (statusFilter !== "ALL") params.set("status", statusFilter);
      if (eventIdFilter) params.set("eventId", eventIdFilter);

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
  }, [statusFilter, page, eventIdFilter]);

  useEffect(() => {
    if (authStatus === "unauthenticated") router.push("/login");
  }, [authStatus, router]);

  useEffect(() => {
    fetchApplications();
  }, [fetchApplications]);

  const updateApplicationStatus = async (appId: string, status: string) => {
    try {
      const body: Record<string, string> = { status };
      if (orgNotes[appId]) body.orgNote = orgNotes[appId];

      const res = await fetch(`/api/applications/${appId}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      });
      if (res.ok) {
        toast.success(`Application ${status.toLowerCase()}`);
        fetchApplications();
      } else {
        const data = await res.json();
        toast.error(data.error || "Failed to update");
      }
    } catch {
      toast.error("Something went wrong");
    }
  };

  const formatDate = (d: string) =>
    new Date(d).toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" });

  const statusFilterOptions = [
    { value: "ALL", label: "All Applications" },
    { value: "APPLIED", label: "New (Applied)" },
    { value: "SHORTLISTED", label: "Shortlisted" },
    { value: "ACCEPTED", label: "Accepted" },
    { value: "REJECTED", label: "Rejected" },
    { value: "WITHDRAWN", label: "Withdrawn" },
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      <div className="flex">
        <DashboardSidebar role="ORGANIZATION" />
        <main className="flex-1 p-6 lg:p-8">
          {/* Header */}
          <div className="mb-6">
            <h1 className="text-2xl font-bold text-gray-900">Applications</h1>
            <p className="text-sm text-gray-500">
              Review and manage volunteer applications for your events
            </p>
          </div>

          {/* Filter */}
          <div className="flex flex-wrap gap-3 mb-6">
            <div className="w-56">
              <Select
                label=""
                options={statusFilterOptions}
                value={statusFilter}
                onChange={(e) => { setStatusFilter(e.target.value); setPage(1); }}
              />
            </div>
            {eventIdFilter && (
              <Button
                variant="ghost"
                size="sm"
                onClick={() => router.push("/dashboard/organization/applications")}
                className="self-end"
              >
                Clear event filter
              </Button>
            )}
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
                <p className="text-gray-500">Applications will appear here when volunteers apply to your events</p>
              </CardContent>
            </Card>
          ) : (
            <div className="space-y-3">
              {applications.map((app) => {
                const isExpanded = expandedId === app.id;
                const profile = app.applicant.volunteerProfile;
                const skills = (() => { try { return JSON.parse(profile?.skills || "[]"); } catch { return []; } })();

                return (
                  <Card key={app.id}>
                    <CardContent className="p-0">
                      {/* Header row */}
                      <button
                        onClick={() => setExpandedId(isExpanded ? null : app.id)}
                        className="w-full flex items-center gap-4 p-4 hover:bg-gray-50 transition-colors text-left"
                      >
                        {/* Avatar */}
                        <div className="w-10 h-10 bg-indigo-100 rounded-full flex items-center justify-center text-indigo-600 font-bold text-sm shrink-0">
                          {(profile?.fullName || app.applicant.email).charAt(0).toUpperCase()}
                        </div>

                        {/* Info */}
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2">
                            <p className="font-medium text-gray-900 truncate">
                              {profile?.fullName || app.applicant.email}
                            </p>
                            <Badge variant={statusVariants[app.status] || "default"}>
                              {APPLICATION_STATUS_LABELS[app.status] || app.status}
                            </Badge>
                          </div>
                          <p className="text-sm text-gray-500 truncate">
                            Applied to: {app.event.title}
                            {app.role && ` • Role: ${app.role}`}
                          </p>
                        </div>

                        {/* Date & expand */}
                        <div className="text-right shrink-0 flex items-center gap-3">
                          <span className="text-xs text-gray-400 hidden sm:block">{formatDate(app.appliedAt)}</span>
                          {isExpanded ? <ChevronUp className="w-4 h-4 text-gray-400" /> : <ChevronDown className="w-4 h-4 text-gray-400" />}
                        </div>
                      </button>

                      {/* Expanded details */}
                      {isExpanded && (
                        <div className="px-4 pb-4 border-t border-gray-100 pt-4 space-y-4">
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            {/* Applicant Info */}
                            <div className="space-y-3">
                              <h4 className="font-semibold text-gray-900 text-sm flex items-center gap-2">
                                <User className="w-4 h-4 text-indigo-600" /> Applicant Details
                              </h4>
                              <div className="text-sm space-y-1.5">
                                <p className="flex items-center gap-2">
                                  <Mail className="w-3.5 h-3.5 text-gray-400" />
                                  {app.applicant.email}
                                </p>
                                {profile?.college && (
                                  <p className="flex items-center gap-2">
                                    <GraduationCap className="w-3.5 h-3.5 text-gray-400" />
                                    {profile.college}
                                  </p>
                                )}
                                <div className="flex gap-4 text-xs text-gray-500 mt-1">
                                  <span className="flex items-center gap-1">
                                    <Star className="w-3 h-3 text-amber-500" />
                                    Score: {profile?.reputationScore || 0}
                                  </span>
                                  <span className="flex items-center gap-1">
                                    <TrendingUp className="w-3 h-3 text-emerald-500" />
                                    Completion: {profile?.completionRate || 100}%
                                  </span>
                                  <span className="flex items-center gap-1">
                                    <Award className="w-3 h-3 text-indigo-500" />
                                    {profile?.totalEvents || 0} events
                                  </span>
                                </div>
                              </div>

                              {/* Skills */}
                              {skills.length > 0 && (
                                <div>
                                  <p className="text-xs font-medium text-gray-500 mb-1">Skills</p>
                                  <div className="flex flex-wrap gap-1">
                                    {skills.slice(0, 8).map((skill: string) => (
                                      <span key={skill} className="text-xs bg-gray-100 text-gray-600 px-2 py-0.5 rounded-full">
                                        {skill}
                                      </span>
                                    ))}
                                    {skills.length > 8 && (
                                      <span className="text-xs text-gray-400">+{skills.length - 8} more</span>
                                    )}
                                  </div>
                                </div>
                              )}

                              {/* Message */}
                              {app.message && (
                                <div>
                                  <p className="text-xs font-medium text-gray-500 mb-1">Message</p>
                                  <p className="text-sm text-gray-700 bg-gray-50 p-2 rounded">{app.message}</p>
                                </div>
                              )}

                              {/* Team */}
                              {app.team && (
                                <div>
                                  <p className="text-xs font-medium text-gray-500 mb-1">Team</p>
                                  <p className="text-sm font-medium text-gray-900">{app.team.name}</p>
                                </div>
                              )}
                            </div>

                            {/* Actions */}
                            <div className="space-y-3">
                              <h4 className="font-semibold text-gray-900 text-sm">Actions</h4>

                              <Textarea
                                label="Note to Applicant"
                                placeholder="Add a note (visible to applicant after status update)"
                                value={orgNotes[app.id] || app.orgNote || ""}
                                onChange={(e) => setOrgNotes((prev) => ({ ...prev, [app.id]: e.target.value }))}
                                rows={2}
                              />

                              <div className="flex flex-wrap gap-2">
                                {app.status === "APPLIED" && (
                                  <>
                                    <Button
                                      size="sm"
                                      variant="outline"
                                      onClick={() => updateApplicationStatus(app.id, "SHORTLISTED")}
                                      className="gap-1"
                                    >
                                      <Clock className="w-3.5 h-3.5" /> Shortlist
                                    </Button>
                                    <Button
                                      size="sm"
                                      onClick={() => updateApplicationStatus(app.id, "ACCEPTED")}
                                      className="gap-1"
                                    >
                                      <CheckCircle2 className="w-3.5 h-3.5" /> Accept
                                    </Button>
                                    <Button
                                      size="sm"
                                      variant="danger"
                                      onClick={() => updateApplicationStatus(app.id, "REJECTED")}
                                      className="gap-1"
                                    >
                                      <XCircle className="w-3.5 h-3.5" /> Reject
                                    </Button>
                                  </>
                                )}
                                {app.status === "SHORTLISTED" && (
                                  <>
                                    <Button
                                      size="sm"
                                      onClick={() => updateApplicationStatus(app.id, "ACCEPTED")}
                                      className="gap-1"
                                    >
                                      <CheckCircle2 className="w-3.5 h-3.5" /> Accept
                                    </Button>
                                    <Button
                                      size="sm"
                                      variant="danger"
                                      onClick={() => updateApplicationStatus(app.id, "REJECTED")}
                                      className="gap-1"
                                    >
                                      <XCircle className="w-3.5 h-3.5" /> Reject
                                    </Button>
                                  </>
                                )}
                                {app.status === "ACCEPTED" && (
                                  <Button
                                    size="sm"
                                    variant="danger"
                                    onClick={() => updateApplicationStatus(app.id, "REJECTED")}
                                    className="gap-1"
                                  >
                                    <XCircle className="w-3.5 h-3.5" /> Revoke Acceptance
                                  </Button>
                                )}
                                {app.status === "REJECTED" && (
                                  <Button
                                    size="sm"
                                    onClick={() => updateApplicationStatus(app.id, "ACCEPTED")}
                                    className="gap-1"
                                  >
                                    <CheckCircle2 className="w-3.5 h-3.5" /> Re-accept
                                  </Button>
                                )}
                              </div>
                            </div>
                          </div>
                        </div>
                      )}
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
