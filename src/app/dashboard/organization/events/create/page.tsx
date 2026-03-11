"use client";

import { useState } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { Navbar } from "@/components/layout/Navbar";
import { DashboardSidebar } from "@/components/layout/DashboardSidebar";
import { Card, CardContent } from "@/components/ui/Card";
import { Input } from "@/components/ui/Input";
import { Textarea } from "@/components/ui/Textarea";
import { Select } from "@/components/ui/Select";
import { Button } from "@/components/ui/Button";
import { Badge } from "@/components/ui/Badge";
import {
  EVENT_CATEGORIES,
  EVENT_TYPES,
  INDIAN_STATES,
  SKILLS,
  EVENT_ROLES,
} from "@/lib/constants";
import { ArrowLeft, Plus, X, Trash2 } from "lucide-react";
import toast from "react-hot-toast";

interface RoleNeeded {
  role: string;
  count: number;
  description: string;
}

export default function CreateEventPage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [saving, setSaving] = useState(false);

  const [form, setForm] = useState({
    title: "",
    description: "",
    shortDesc: "",
    category: "HACKATHON",
    eventType: "IN_PERSON",
    startDate: "",
    endDate: "",
    registrationDeadline: "",
    venue: "",
    address: "",
    city: "",
    state: "",
    virtualLink: "",
    totalSlots: 10,
    contactEmail: "",
    contactPhone: "",
    perks: "",
    eligibility: "",
    status: "DRAFT",
  });

  const [selectedSkills, setSelectedSkills] = useState<string[]>([]);
  const [rolesNeeded, setRolesNeeded] = useState<RoleNeeded[]>([]);
  const [newRole, setNewRole] = useState({ role: "", count: 1, description: "" });

  if (status === "loading") {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-600" />
      </div>
    );
  }

  const updateField = (field: string, value: string | number) => {
    setForm((prev) => ({ ...prev, [field]: value }));
  };

  const toggleSkill = (skill: string) => {
    setSelectedSkills((prev) =>
      prev.includes(skill) ? prev.filter((s) => s !== skill) : [...prev, skill]
    );
  };

  const addRole = () => {
    if (!newRole.role) return;
    setRolesNeeded((prev) => [...prev, { ...newRole }]);
    setNewRole({ role: "", count: 1, description: "" });
  };

  const removeRole = (index: number) => {
    setRolesNeeded((prev) => prev.filter((_, i) => i !== index));
  };

  const handleSubmit = async (publishStatus: "DRAFT" | "PUBLISHED") => {
    if (!form.title || !form.description || !form.startDate || !form.endDate) {
      toast.error("Please fill in title, description, start date, and end date");
      return;
    }
    if (new Date(form.endDate) < new Date(form.startDate)) {
      toast.error("End date must be after start date");
      return;
    }

    setSaving(true);
    try {
      const res = await fetch("/api/events", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...form,
          status: publishStatus,
          requiredSkills: selectedSkills,
          rolesNeeded,
          totalSlots: Number(form.totalSlots),
        }),
      });
      const data = await res.json();
      if (res.ok) {
        toast.success(publishStatus === "PUBLISHED" ? "Event published!" : "Event saved as draft");
        router.push("/dashboard/organization/events");
      } else {
        toast.error(data.error || "Failed to create event");
      }
    } catch {
      toast.error("Something went wrong");
    } finally {
      setSaving(false);
    }
  };

  const categoryOptions = EVENT_CATEGORIES.map((c) => ({ value: c.value, label: c.label }));
  const typeOptions = EVENT_TYPES.map((t) => ({ value: t.value, label: t.label }));
  const stateOptions = [{ value: "", label: "Select State" }, ...INDIAN_STATES.map((s) => ({ value: s, label: s }))];
  const roleSelectOptions = [{ value: "", label: "Select a role" }, ...EVENT_ROLES.map((r) => ({ value: r, label: r }))];

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      <div className="flex">
        <DashboardSidebar role="ORGANIZATION" />
        <main className="flex-1 p-6 lg:p-8 max-w-4xl">
          {/* Header */}
          <div className="flex items-center gap-4 mb-6">
            <button
              onClick={() => router.back()}
              className="p-2 hover:bg-gray-100 rounded-lg"
            >
              <ArrowLeft className="w-5 h-5 text-gray-600" />
            </button>
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Create New Event</h1>
              <p className="text-sm text-gray-500">Fill in the event details to start receiving applications</p>
            </div>
          </div>

          <div className="space-y-6">
            {/* Basic Info */}
            <Card>
              <CardContent className="p-6 space-y-4">
                <h2 className="text-lg font-semibold text-gray-900">Basic Information</h2>
                <Input
                  label="Event Title *"
                  placeholder="e.g., National Innovation Hackathon 2025"
                  value={form.title}
                  onChange={(e) => updateField("title", e.target.value)}
                />
                <Textarea
                  label="Description *"
                  placeholder="Describe the event in detail — what it is, what volunteers will do, goals, etc."
                  value={form.description}
                  onChange={(e) => updateField("description", e.target.value)}
                  rows={6}
                />
                <Input
                  label="Short Description"
                  placeholder="A brief 1-2 line summary (max 200 chars)"
                  value={form.shortDesc}
                  onChange={(e) => updateField("shortDesc", e.target.value)}
                  maxLength={200}
                />
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <Select
                    label="Category *"
                    options={categoryOptions}
                    value={form.category}
                    onChange={(e) => updateField("category", e.target.value)}
                  />
                  <Select
                    label="Event Type *"
                    options={typeOptions}
                    value={form.eventType}
                    onChange={(e) => updateField("eventType", e.target.value)}
                  />
                </div>
              </CardContent>
            </Card>

            {/* Date & Time */}
            <Card>
              <CardContent className="p-6 space-y-4">
                <h2 className="text-lg font-semibold text-gray-900">Date & Time</h2>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <Input
                    label="Start Date & Time *"
                    type="datetime-local"
                    value={form.startDate}
                    onChange={(e) => updateField("startDate", e.target.value)}
                  />
                  <Input
                    label="End Date & Time *"
                    type="datetime-local"
                    value={form.endDate}
                    onChange={(e) => updateField("endDate", e.target.value)}
                  />
                </div>
                <Input
                  label="Registration Deadline"
                  type="datetime-local"
                  value={form.registrationDeadline}
                  onChange={(e) => updateField("registrationDeadline", e.target.value)}
                  helperText="Leave empty if there's no deadline"
                />
              </CardContent>
            </Card>

            {/* Location */}
            <Card>
              <CardContent className="p-6 space-y-4">
                <h2 className="text-lg font-semibold text-gray-900">Location</h2>
                {(form.eventType === "IN_PERSON" || form.eventType === "HYBRID") && (
                  <>
                    <Input
                      label="Venue Name"
                      placeholder="e.g., IIT Delhi Auditorium"
                      value={form.venue}
                      onChange={(e) => updateField("venue", e.target.value)}
                    />
                    <Input
                      label="Address"
                      placeholder="Full address"
                      value={form.address}
                      onChange={(e) => updateField("address", e.target.value)}
                    />
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <Input
                        label="City"
                        placeholder="e.g., New Delhi"
                        value={form.city}
                        onChange={(e) => updateField("city", e.target.value)}
                      />
                      <Select
                        label="State"
                        options={stateOptions}
                        value={form.state}
                        onChange={(e) => updateField("state", e.target.value)}
                      />
                    </div>
                  </>
                )}
                {(form.eventType === "VIRTUAL" || form.eventType === "HYBRID") && (
                  <Input
                    label="Virtual Event Link"
                    placeholder="https://meet.google.com/... or https://zoom.us/..."
                    value={form.virtualLink}
                    onChange={(e) => updateField("virtualLink", e.target.value)}
                  />
                )}
              </CardContent>
            </Card>

            {/* Slots & Roles */}
            <Card>
              <CardContent className="p-6 space-y-4">
                <h2 className="text-lg font-semibold text-gray-900">Slots & Volunteer Roles</h2>
                <Input
                  label="Total Volunteer Slots *"
                  type="number"
                  min={1}
                  value={form.totalSlots}
                  onChange={(e) => updateField("totalSlots", parseInt(e.target.value) || 1)}
                />

                <div>
                  <p className="text-sm font-medium text-gray-700 mb-2">Specific Roles Needed</p>
                  {rolesNeeded.length > 0 && (
                    <div className="space-y-2 mb-3">
                      {rolesNeeded.map((r, i) => (
                        <div key={i} className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                          <div className="flex-1">
                            <span className="font-medium text-gray-900">{r.role}</span>
                            <span className="text-sm text-gray-500 ml-2">({r.count} needed)</span>
                            {r.description && <p className="text-xs text-gray-500">{r.description}</p>}
                          </div>
                          <button onClick={() => removeRole(i)} className="text-red-400 hover:text-red-600">
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      ))}
                    </div>
                  )}
                  <div className="grid grid-cols-1 sm:grid-cols-[1fr_80px_1fr_auto] gap-2 items-end">
                    <Select
                      label="Role"
                      options={roleSelectOptions}
                      value={newRole.role}
                      onChange={(e) => setNewRole((p) => ({ ...p, role: e.target.value }))}
                    />
                    <Input
                      label="Count"
                      type="number"
                      min={1}
                      value={newRole.count}
                      onChange={(e) => setNewRole((p) => ({ ...p, count: parseInt(e.target.value) || 1 }))}
                    />
                    <Input
                      label="Description"
                      placeholder="Brief description"
                      value={newRole.description}
                      onChange={(e) => setNewRole((p) => ({ ...p, description: e.target.value }))}
                    />
                    <Button variant="outline" size="sm" onClick={addRole} className="mb-0.5">
                      <Plus className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Skills */}
            <Card>
              <CardContent className="p-6 space-y-4">
                <h2 className="text-lg font-semibold text-gray-900">Required Skills</h2>
                <p className="text-sm text-gray-500">Select skills that volunteers should ideally have</p>
                <div className="flex flex-wrap gap-2">
                  {SKILLS.map((skill) => (
                    <button
                      key={skill}
                      onClick={() => toggleSkill(skill)}
                      className={`px-3 py-1.5 text-sm rounded-full border transition-colors ${
                        selectedSkills.includes(skill)
                          ? "bg-indigo-600 text-white border-indigo-600"
                          : "bg-white text-gray-600 border-gray-300 hover:border-indigo-300"
                      }`}
                    >
                      {skill}
                      {selectedSkills.includes(skill) && <X className="w-3 h-3 inline ml-1" />}
                    </button>
                  ))}
                </div>
                {selectedSkills.length > 0 && (
                  <p className="text-xs text-gray-500">{selectedSkills.length} skill(s) selected</p>
                )}
              </CardContent>
            </Card>

            {/* Additional Info */}
            <Card>
              <CardContent className="p-6 space-y-4">
                <h2 className="text-lg font-semibold text-gray-900">Additional Information</h2>
                <Textarea
                  label="Eligibility Criteria"
                  placeholder="e.g., Open to all college students, Must be 18+, etc."
                  value={form.eligibility}
                  onChange={(e) => updateField("eligibility", e.target.value)}
                  rows={3}
                />
                <Textarea
                  label="Perks & Benefits"
                  placeholder="e.g., Certificate, Swag Kit, Networking, Food & Accommodation, etc."
                  value={form.perks}
                  onChange={(e) => updateField("perks", e.target.value)}
                  rows={3}
                />
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <Input
                    label="Contact Email"
                    type="email"
                    placeholder="events@yourorg.com"
                    value={form.contactEmail}
                    onChange={(e) => updateField("contactEmail", e.target.value)}
                  />
                  <Input
                    label="Contact Phone"
                    placeholder="+91 98765 43210"
                    value={form.contactPhone}
                    onChange={(e) => updateField("contactPhone", e.target.value)}
                  />
                </div>
              </CardContent>
            </Card>

            {/* Actions */}
            <div className="flex flex-wrap gap-3 pb-8">
              <Button
                size="lg"
                onClick={() => handleSubmit("PUBLISHED")}
                isLoading={saving}
              >
                Publish Event
              </Button>
              <Button
                variant="outline"
                size="lg"
                onClick={() => handleSubmit("DRAFT")}
                isLoading={saving}
              >
                Save as Draft
              </Button>
              <Button
                variant="ghost"
                size="lg"
                onClick={() => router.back()}
              >
                Cancel
              </Button>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}
