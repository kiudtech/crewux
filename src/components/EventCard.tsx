"use client";

import Link from "next/link";
import { Card, CardContent } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import { EVENT_CATEGORY_LABELS } from "@/lib/constants";
import { Calendar, MapPin, Users, Building2 } from "lucide-react";

interface EventCardProps {
  event: {
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
  };
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

export function EventCard({ event }: EventCardProps) {
  const slotsLeft = event.totalSlots - event.filledSlots;
  const startDate = new Date(event.startDate);
  const endDate = new Date(event.endDate);
  const orgName = event.organizer?.organizationProfile?.organizationName || "Unknown Org";
  const isVerified = event.organizer?.organizationProfile?.verificationStatus === "VERIFIED";

  const formatDate = (date: Date) =>
    date.toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" });

  return (
    <Link href={`/events/${event.id}`}>
      <Card className="h-full hover:shadow-lg transition-shadow duration-200 cursor-pointer group">
        {/* Banner */}
        <div className="h-36 bg-linear-to-br from-indigo-500 to-purple-600 rounded-t-xl relative overflow-hidden">
          {event.bannerImage ? (
            <img src={event.bannerImage} alt={event.title} className="w-full h-full object-cover" />
          ) : (
            <div className="absolute inset-0 flex items-center justify-center">
              <span className="text-white/30 text-6xl font-bold">
                {event.title.charAt(0)}
              </span>
            </div>
          )}
          <div className="absolute top-3 left-3">
            <Badge variant={categoryColors[event.category] || "default"}>
              {EVENT_CATEGORY_LABELS[event.category] || event.category}
            </Badge>
          </div>
          <div className="absolute top-3 right-3">
            <span className="text-xs bg-white/90 text-gray-700 px-2 py-1 rounded-full font-medium">
              {event.eventType === "IN_PERSON" ? "In Person" : event.eventType === "VIRTUAL" ? "Virtual" : "Hybrid"}
            </span>
          </div>
        </div>

        <CardContent className="p-4 space-y-3">
          {/* Title */}
          <h3 className="font-semibold text-gray-900 text-lg leading-tight group-hover:text-indigo-600 transition-colors line-clamp-2">
            {event.title}
          </h3>

          {/* Org */}
          <div className="flex items-center gap-2 text-sm text-gray-600">
            <Building2 className="w-4 h-4 shrink-0" />
            <span className="truncate">{orgName}</span>
            {isVerified && (
              <span className="text-emerald-500 text-xs">✓</span>
            )}
          </div>

          {/* Date */}
          <div className="flex items-center gap-2 text-sm text-gray-500">
            <Calendar className="w-4 h-4 shrink-0" />
            <span>{formatDate(startDate)}{startDate.toDateString() !== endDate.toDateString() && ` — ${formatDate(endDate)}`}</span>
          </div>

          {/* Location */}
          {(event.city || event.state) && (
            <div className="flex items-center gap-2 text-sm text-gray-500">
              <MapPin className="w-4 h-4 shrink-0" />
              <span>{[event.city, event.state].filter(Boolean).join(", ")}</span>
            </div>
          )}

          {/* Short Desc */}
          {event.shortDesc && (
            <p className="text-sm text-gray-500 line-clamp-2">{event.shortDesc}</p>
          )}

          {/* Footer */}
          <div className="flex items-center justify-between pt-2 border-t border-gray-100">
            <div className="flex items-center gap-1.5 text-sm">
              <Users className="w-4 h-4 text-gray-400" />
              <span className="text-gray-600">
                {slotsLeft > 0 ? (
                  <><span className="font-medium text-emerald-600">{slotsLeft}</span> slots left</>
                ) : (
                  <span className="text-red-500 font-medium">Full</span>
                )}
              </span>
            </div>
            <span className="text-xs text-gray-400">{event._count.applications} applied</span>
          </div>
        </CardContent>
      </Card>
    </Link>
  );
}
