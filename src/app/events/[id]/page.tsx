"use client";

import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import { useSession } from "next-auth/react";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { Button } from "@/components/ui/Button";
import { Badge } from "@/components/ui/Badge";
import { Card, CardContent } from "@/components/ui/Card";
import { Textarea } from "@/components/ui/Textarea";
import { Select } from "@/components/ui/Select";
import {
  EVENT_CATEGORY_LABELS,
  APPLICATION_STATUS_LABELS,
  EVENT_ROLES,
} from "@/lib/constants";
import {
  Calendar, MapPin, Users, Building2, Globe, Mail, Phone,
  ArrowLeft, Clock, CheckCircle2, XCircle, AlertCircle,
  Briefcase, Award, ExternalLink,
} from "lucide-react";
import toast from "react-hot-toast";

interface EventDetail {
  id: string;
  title: string;
  description: string;
  shortDesc?: string;
  category: string;
  eventType: string;
  status: string;
  startDate: string;
  endDate: string;
  registrationDeadline?: string;
  venue?: string;
  address?: string;
  city?: string;
  state?: string;
  virtualLink?: string;
  requiredSkills: string;
  rolesNeeded: string;
  totalSlots: number;
  filledSlots: number;
  bannerImage?: string;
  contactEmail?: string;
  contactPhone?: string;
  perks?: string;
  eligibility?: string;
  organizer: {
    id: string;
    email: string;
    organizationProfile?: {
      organizationName: string;
      logoUrl?: string;
      verificationStatus: string;
      type: string;
      city?: string;
      state?: string;
      website?: string;
    } | null;
  };
  _count: { applications: number };
}

interface UserApplication {
  id: string;
  status: string;
  role?: string;
  message?: string;
  orgNote?: string;
  appliedAt: string;
}

const categoryColors: Record<string, "info" | "success" | "warning" | "danger" | "default"> = {
  HACKATHON: "info",
  SUMMIT: "warning",
  CONFERENCE: "default",
  WORKSHOP: "success",
  CSR_DRIVE: "success",
  TECH_FEST: "info",
  WEBINAR: "danger",
  OTHER: "default",
};

const statusColors: Record<string, "success" | "warning" | "danger" | "info" | "default"> = {
  APPLIED: "info",
  SHORTLISTED: "warning",
  ACCEPTED: "success",
  REJECTED: "danger",
  WITHDRAWN: "default",
};

export default function EventDetailPage() {
  const { id } = useParams();
  const router = useRouter();
  const { data: session } = useSession();
  const [event, setEvent] = useState<EventDetail | null>(null);
  const [userApplication, setUserApplication] = useState<UserApplication | null>(null);
  const [loading, setLoading] = useState(true);
  const [applying, setApplying] = useState(false);
  const [showApplyForm, setShowApplyForm] = useState(false);
  const [applyRole, setApplyRole] = useState("");
  const [applyMessage, setApplyMessage] = useState("");

  useEffect(() => {
    async function fetchEvent() {
      try {
        const res = await fetch(`/api/events/${id}`);
        if (res.ok) {
          const data = await res.json();
          setEvent(data.event);
          setUserApplication(data.userApplication);
        } else {
          toast.error("Event not found");
          router.push("/events");
        }
      } catch {
        toast.error("Failed to load event");
      } finally {
        setLoading(false);
      }
    }
    if (id) fetchEvent();
  }, [id, router]);

  const handleApply = async () => {
    if (!session?.user) {
      router.push("/login");
      return;
    }
    setApplying(true);
    try {
      const res = await fetch("/api/applications", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          eventId: id,
          role: applyRole || undefined,
          message: applyMessage || undefined,
        }),
      });
      const data = await res.json();
      if (res.ok) {
        toast.success("Application submitted successfully!");
        setUserApplication(data.application);
        setShowApplyForm(false);
      } else {
        toast.error(data.error || "Failed to apply");
      }
    } catch {
      toast.error("Something went wrong");
    } finally {
      setApplying(false);
    }
  };

  const handleWithdraw = async () => {
    if (!userApplication) return;
    try {
      const res = await fetch(`/api/applications/${userApplication.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status: "WITHDRAWN" }),
      });
      if (res.ok) {
        toast.success("Application withdrawn");
        setUserApplication({ ...userApplication, status: "WITHDRAWN" });
      } else {
        const data = await res.json();
        toast.error(data.error || "Failed to withdraw");
      }
    } catch {
      toast.error("Something went wrong");
    }
  };

  const formatDate = (date: string) =>
    new Date(date).toLocaleDateString("en-IN", {
      weekday: "long",
      day: "numeric",
      month: "long",
      year: "numeric",
    });

  const formatTime = (date: string) =>
    new Date(date).toLocaleTimeString("en-IN", {
      hour: "2-digit",
      minute: "2-digit",
    });

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Navbar />
        <div className="flex items-center justify-center py-32">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-600" />
        </div>
      </div>
    );
  }

  if (!event) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Navbar />
        <div className="max-w-7xl mx-auto px-4 py-20 text-center">
          <h1 className="text-2xl font-bold text-gray-900">Event not found</h1>
          <Button className="mt-4" onClick={() => router.push("/events")}>
            Browse Events
          </Button>
        </div>
        <Footer />
      </div>
    );
  }

  const slotsLeft = event.totalSlots - event.filledSlots;
  const skills = (() => { try { return JSON.parse(event.requiredSkills); } catch { return []; } })();
  const roles: { role: string; count: number; description?: string }[] = (() => { try { return JSON.parse(event.rolesNeeded); } catch { return []; } })();
  const isDeadlinePassed = event.registrationDeadline && new Date(event.registrationDeadline) < new Date();
  const isFull = slotsLeft <= 0;
  const isEventOpen = ["PUBLISHED", "ACTIVE"].includes(event.status);
  const canApply = session?.user?.role === "VOLUNTEER" && !userApplication && isEventOpen && !isDeadlinePassed && !isFull;
  const isOwner = session?.user?.id === event.organizer.id;

  // Get available roles for the apply form
  const roleOptions = [
    { value: "", label: "Any role / General Volunteer" },
    ...roles.map((r) => ({ value: r.role, label: `${r.role} (${r.count} needed)` })),
    ...EVENT_ROLES.filter((r) => !roles.find((rn) => rn.role === r)).map((r) => ({ value: r, label: r })),
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />

      {/* Banner */}
      <div className="h-48 sm:h-64 bg-linear-to-br from-indigo-600 via-purple-600 to-pink-500 relative">
        {event.bannerImage && (
          <img src={event.bannerImage} alt={event.title} className="w-full h-full object-cover absolute inset-0" />
        )}
        <div className="absolute inset-0 bg-black/20" />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-full flex items-end pb-6 relative">
          <button
            onClick={() => router.back()}
            className="absolute top-4 left-4 sm:left-6 lg:left-8 flex items-center gap-2 text-white/90 hover:text-white text-sm bg-black/20 px-3 py-1.5 rounded-lg backdrop-blur-sm"
          >
            <ArrowLeft className="w-4 h-4" /> Back
          </button>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 -mt-8 relative z-10 pb-16">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-6">
            {/* Title Card */}
            <Card>
              <CardContent className="p-6">
                <div className="flex flex-wrap items-center gap-2 mb-3">
                  <Badge variant={categoryColors[event.category] || "default"}>
                    {EVENT_CATEGORY_LABELS[event.category] || event.category}
                  </Badge>
                  <span className="text-xs bg-gray-100 text-gray-600 px-2 py-1 rounded-full">
                    {event.eventType === "IN_PERSON" ? "In Person" : event.eventType === "VIRTUAL" ? "Virtual" : "Hybrid"}
                  </span>
                  {event.status === "COMPLETED" && <Badge variant="default">Completed</Badge>}
                  {event.status === "CANCELLED" && <Badge variant="danger">Cancelled</Badge>}
                </div>

                <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-4">{event.title}</h1>

                {event.shortDesc && (
                  <p className="text-gray-600 text-lg mb-4">{event.shortDesc}</p>
                )}

                {/* Key Info */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 py-4 border-y border-gray-100">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-indigo-50 rounded-lg flex items-center justify-center">
                      <Calendar className="w-5 h-5 text-indigo-600" />
                    </div>
                    <div>
                      <p className="text-sm font-medium text-gray-900">{formatDate(event.startDate)}</p>
                      {event.startDate !== event.endDate && (
                        <p className="text-xs text-gray-500">to {formatDate(event.endDate)}</p>
                      )}
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-emerald-50 rounded-lg flex items-center justify-center">
                      <Clock className="w-5 h-5 text-emerald-600" />
                    </div>
                    <div>
                      <p className="text-sm font-medium text-gray-900">{formatTime(event.startDate)}</p>
                      <p className="text-xs text-gray-500">Start Time</p>
                    </div>
                  </div>
                  {(event.venue || event.city) && (
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-purple-50 rounded-lg flex items-center justify-center">
                        <MapPin className="w-5 h-5 text-purple-600" />
                      </div>
                      <div>
                        <p className="text-sm font-medium text-gray-900">{event.venue || event.city}</p>
                        {event.address && <p className="text-xs text-gray-500">{event.address}</p>}
                        <p className="text-xs text-gray-500">{[event.city, event.state].filter(Boolean).join(", ")}</p>
                      </div>
                    </div>
                  )}
                  {event.virtualLink && (
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-blue-50 rounded-lg flex items-center justify-center">
                        <Globe className="w-5 h-5 text-blue-600" />
                      </div>
                      <div>
                        <a href={event.virtualLink} target="_blank" rel="noopener" className="text-sm font-medium text-indigo-600 hover:underline flex items-center gap-1">
                          Virtual Event Link <ExternalLink className="w-3 h-3" />
                        </a>
                      </div>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>

            {/* Description */}
            <Card>
              <CardContent className="p-6">
                <h2 className="text-lg font-semibold text-gray-900 mb-4">About This Event</h2>
                <div className="prose prose-sm max-w-none text-gray-700 whitespace-pre-wrap">
                  {event.description}
                </div>
              </CardContent>
            </Card>

            {/* Roles Needed */}
            {roles.length > 0 && (
              <Card>
                <CardContent className="p-6">
                  <h2 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
                    <Briefcase className="w-5 h-5 text-indigo-600" /> Roles Needed
                  </h2>
                  <div className="space-y-3">
                    {roles.map((r, i) => (
                      <div key={i} className="flex items-start gap-3 p-3 bg-gray-50 rounded-lg">
                        <div className="w-8 h-8 bg-indigo-100 rounded-lg flex items-center justify-center text-sm font-bold text-indigo-600 shrink-0">
                          {r.count}
                        </div>
                        <div>
                          <p className="font-medium text-gray-900">{r.role}</p>
                          {r.description && <p className="text-sm text-gray-500 mt-0.5">{r.description}</p>}
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Required Skills */}
            {skills.length > 0 && (
              <Card>
                <CardContent className="p-6">
                  <h2 className="text-lg font-semibold text-gray-900 mb-4">Required Skills</h2>
                  <div className="flex flex-wrap gap-2">
                    {skills.map((skill: string) => (
                      <Badge key={skill} variant="info">{skill}</Badge>
                    ))}
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Eligibility & Perks */}
            {(event.eligibility || event.perks) && (
              <Card>
                <CardContent className="p-6 space-y-4">
                  {event.eligibility && (
                    <div>
                      <h2 className="text-lg font-semibold text-gray-900 mb-2">Eligibility</h2>
                      <p className="text-gray-700 text-sm whitespace-pre-wrap">{event.eligibility}</p>
                    </div>
                  )}
                  {event.perks && (
                    <div>
                      <h2 className="text-lg font-semibold text-gray-900 mb-2 flex items-center gap-2">
                        <Award className="w-5 h-5 text-amber-500" /> Perks & Benefits
                      </h2>
                      <p className="text-gray-700 text-sm whitespace-pre-wrap">{event.perks}</p>
                    </div>
                  )}
                </CardContent>
              </Card>
            )}
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Apply Card */}
            <Card>
              <CardContent className="p-6">
                <div className="text-center mb-4">
                  <div className="flex items-center justify-center gap-2 mb-2">
                    <Users className="w-5 h-5 text-gray-500" />
                    <span className="text-2xl font-bold text-gray-900">{slotsLeft}</span>
                    <span className="text-gray-500">/ {event.totalSlots}</span>
                  </div>
                  <p className="text-sm text-gray-500">slots remaining</p>
                  <div className="w-full bg-gray-200 rounded-full h-2 mt-2">
                    <div
                      className="bg-indigo-600 h-2 rounded-full transition-all"
                      style={{ width: `${Math.min((event.filledSlots / event.totalSlots) * 100, 100)}%` }}
                    />
                  </div>
                  <p className="text-xs text-gray-400 mt-1">{event._count.applications} applications received</p>
                </div>

                {event.registrationDeadline && (
                  <div className="flex items-center gap-2 text-sm mb-4 p-2 bg-amber-50 rounded-lg">
                    <AlertCircle className="w-4 h-4 text-amber-600 shrink-0" />
                    <span className="text-amber-700">
                      Deadline: {new Date(event.registrationDeadline).toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" })}
                    </span>
                  </div>
                )}

                {/* Application Status */}
                {userApplication && userApplication.status !== "WITHDRAWN" ? (
                  <div className="space-y-3">
                    <div className="p-3 bg-gray-50 rounded-lg">
                      <div className="flex items-center gap-2 mb-1">
                        {userApplication.status === "ACCEPTED" ? (
                          <CheckCircle2 className="w-5 h-5 text-emerald-500" />
                        ) : userApplication.status === "REJECTED" ? (
                          <XCircle className="w-5 h-5 text-red-500" />
                        ) : (
                          <Clock className="w-5 h-5 text-amber-500" />
                        )}
                        <span className="font-medium">Your Application</span>
                      </div>
                      <Badge variant={statusColors[userApplication.status] || "default"}>
                        {APPLICATION_STATUS_LABELS[userApplication.status] || userApplication.status}
                      </Badge>
                      {userApplication.role && (
                        <p className="text-xs text-gray-500 mt-1">Role: {userApplication.role}</p>
                      )}
                      {userApplication.orgNote && (
                        <p className="text-xs text-gray-600 mt-2 italic">Note: {userApplication.orgNote}</p>
                      )}
                    </div>
                    {["APPLIED", "SHORTLISTED"].includes(userApplication.status) && (
                      <Button variant="outline" size="sm" className="w-full" onClick={handleWithdraw}>
                        Withdraw Application
                      </Button>
                    )}
                  </div>
                ) : canApply ? (
                  <>
                    {!showApplyForm ? (
                      <Button className="w-full" size="lg" onClick={() => setShowApplyForm(true)}>
                        Apply Now
                      </Button>
                    ) : (
                      <div className="space-y-3">
                        <Select
                          label="Preferred Role"
                          options={roleOptions}
                          value={applyRole}
                          onChange={(e) => setApplyRole(e.target.value)}
                        />
                        <Textarea
                          label="Message (optional)"
                          placeholder="Tell the organizer why you'd like to volunteer..."
                          value={applyMessage}
                          onChange={(e) => setApplyMessage(e.target.value)}
                          rows={3}
                        />
                        <div className="flex gap-2">
                          <Button
                            className="flex-1"
                            onClick={handleApply}
                            isLoading={applying}
                          >
                            Submit
                          </Button>
                          <Button variant="ghost" onClick={() => setShowApplyForm(false)}>
                            Cancel
                          </Button>
                        </div>
                      </div>
                    )}
                  </>
                ) : !session?.user ? (
                  <Button className="w-full" onClick={() => router.push("/login")}>
                    Login to Apply
                  </Button>
                ) : isDeadlinePassed ? (
                  <p className="text-sm text-center text-red-500 font-medium">Registration deadline has passed</p>
                ) : isFull ? (
                  <p className="text-sm text-center text-red-500 font-medium">Event is full</p>
                ) : !isEventOpen ? (
                  <p className="text-sm text-center text-gray-500">Event is not accepting applications</p>
                ) : null}

                {isOwner && (
                  <Button
                    variant="outline"
                    className="w-full mt-3"
                    onClick={() => router.push(`/dashboard/organization/events/${event.id}/edit`)}
                  >
                    Edit This Event
                  </Button>
                )}
              </CardContent>
            </Card>

            {/* Organizer Card */}
            <Card>
              <CardContent className="p-6">
                <h3 className="font-semibold text-gray-900 mb-3 flex items-center gap-2">
                  <Building2 className="w-5 h-5 text-indigo-600" /> Organized By
                </h3>
                <div className="space-y-2">
                  <p className="font-medium text-gray-900">
                    {event.organizer.organizationProfile?.organizationName || "Unknown"}
                    {event.organizer.organizationProfile?.verificationStatus === "VERIFIED" && (
                      <span className="text-emerald-500 ml-1">✓</span>
                    )}
                  </p>
                  {event.organizer.organizationProfile?.type && (
                    <p className="text-sm text-gray-500">{event.organizer.organizationProfile.type.replace("_", " ")}</p>
                  )}
                  {(event.organizer.organizationProfile?.city || event.organizer.organizationProfile?.state) && (
                    <p className="text-sm text-gray-500 flex items-center gap-1">
                      <MapPin className="w-3 h-3" />
                      {[event.organizer.organizationProfile?.city, event.organizer.organizationProfile?.state].filter(Boolean).join(", ")}
                    </p>
                  )}
                  {event.organizer.organizationProfile?.website && (
                    <a
                      href={event.organizer.organizationProfile.website}
                      target="_blank"
                      rel="noopener"
                      className="text-sm text-indigo-600 hover:underline flex items-center gap-1"
                    >
                      <Globe className="w-3 h-3" /> Website
                    </a>
                  )}
                </div>
              </CardContent>
            </Card>

            {/* Contact Card */}
            {(event.contactEmail || event.contactPhone) && (
              <Card>
                <CardContent className="p-6">
                  <h3 className="font-semibold text-gray-900 mb-3">Contact</h3>
                  <div className="space-y-2">
                    {event.contactEmail && (
                      <a href={`mailto:${event.contactEmail}`} className="flex items-center gap-2 text-sm text-gray-600 hover:text-indigo-600">
                        <Mail className="w-4 h-4" /> {event.contactEmail}
                      </a>
                    )}
                    {event.contactPhone && (
                      <a href={`tel:${event.contactPhone}`} className="flex items-center gap-2 text-sm text-gray-600 hover:text-indigo-600">
                        <Phone className="w-4 h-4" /> {event.contactPhone}
                      </a>
                    )}
                  </div>
                </CardContent>
              </Card>
            )}
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
}
