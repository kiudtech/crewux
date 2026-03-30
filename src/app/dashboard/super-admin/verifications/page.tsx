"use client";

import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import {
  CheckCircle,
  XCircle,
  Mail,
  Phone,
  Building2,
  User,
  GraduationCap,
  Search,
  Loader2,
  Filter,
  Clock,
  AlertCircle
} from "lucide-react";
import toast from "react-hot-toast";

interface PendingItem {
  id: string;
  type: "ORGANIZATION" | "VOLUNTEER" | "COLLEGE";
  name: string;
  email: string;
  contactPerson?: string;
  status: string;
  createdAt: string;
  phone?: string;
  description?: string;
}

export default function SuperAdminVerificationsPage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [pending, setPending] = useState<PendingItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [typeFilter, setTypeFilter] = useState("all");
  const [verifyingId, setVerifyingId] = useState<string | null>(null);

  useEffect(() => {
    if (status === "unauthenticated") router.push("/login");
    if (session?.user?.role !== "SUPER_ADMIN") router.push("/dashboard");
  }, [status, session, router]);

  useEffect(() => {
    if (session?.user?.role === "SUPER_ADMIN") {
      fetchPendingVerifications();
    }
  }, [session]);

  const fetchPendingVerifications = async () => {
    try {
      const res = await fetch("/api/admin/verifications");
      if (res.ok) {
        const data = await res.json();
        setPending(data.pending || []);
      } else {
        toast.error("Failed to fetch pending verifications");
      }
    } catch (error) {
      console.error(error);
      toast.error("Failed to fetch pending verifications");
    } finally {
      setLoading(false);
    }
  };

  const verifyItem = async (id: string, type: string) => {
    setVerifyingId(id);
    try {
      let url = "";
      let body = {};

      if (type === "ORGANIZATION") {
        url = `/api/admin/organizations/${id}/verify`;
        body = { action: "approve" };
      } else if (type === "VOLUNTEER") {
        url = `/api/admin/users/${id}/verify`;
        body = { role: "VOLUNTEER", verified: true };
      } else if (type === "COLLEGE") {
        url = `/api/admin/users/${id}/verify`;
        body = { role: "COLLEGE", verified: true };
      }

      const response = await fetch(url, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body)
      });

      if (response.ok) {
        toast.success(`${type} verified successfully`);
        fetchPendingVerifications();
      } else {
        const error = await response.json();
        toast.error(error.message || "Failed to verify");
      }
    } catch (error) {
      console.error("Verification error:", error);
      toast.error("Failed to verify");
    } finally {
      setVerifyingId(null);
    }
  };

  const rejectItem = async (id: string, type: string) => {
    if (!confirm(`Are you sure you want to reject this ${type.toLowerCase()}?`)) return;
    
    setVerifyingId(id);
    try {
      let url = "";
      let body = {};

      if (type === "ORGANIZATION") {
        url = `/api/admin/organizations/${id}/verify`;
        body = { action: "reject" };
      } else if (type === "VOLUNTEER") {
        url = `/api/admin/users/${id}/verify`;
        body = { role: "VOLUNTEER", verified: false, reject: true };
      } else if (type === "COLLEGE") {
        url = `/api/admin/users/${id}/verify`;
        body = { role: "COLLEGE", verified: false, reject: true };
      }

      const response = await fetch(url, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body)
      });

      if (response.ok) {
        toast.success(`${type} rejected`);
        fetchPendingVerifications();
      } else {
        const error = await response.json();
        toast.error(error.message || "Failed to reject");
      }
    } catch (error) {
      console.error("Rejection error:", error);
      toast.error("Failed to reject");
    } finally {
      setVerifyingId(null);
    }
  };

  const getTypeIcon = (type: string) => {
    switch(type) {
      case "ORGANIZATION": return <Building2 className="w-5 h-5 text-purple-600" />;
      case "VOLUNTEER": return <User className="w-5 h-5 text-green-600" />;
      case "COLLEGE": return <GraduationCap className="w-5 h-5 text-blue-600" />;
      default: return <User className="w-5 h-5 text-gray-400" />;
    }
  };

  const getTypeBgColor = (type: string) => {
    switch(type) {
      case "ORGANIZATION": return "bg-purple-50";
      case "VOLUNTEER": return "bg-green-50";
      case "COLLEGE": return "bg-blue-50";
      default: return "bg-gray-50";
    }
  };

  const filteredItems = pending.filter(item => {
    const matchesSearch = item.name?.toLowerCase().includes(search.toLowerCase()) || 
                          item.email?.toLowerCase().includes(search.toLowerCase());
    const matchesType = typeFilter === "all" || item.type === typeFilter;
    return matchesSearch && matchesType;
  });

  const stats = {
    total: pending.length,
    organizations: pending.filter(p => p.type === "ORGANIZATION").length,
    volunteers: pending.filter(p => p.type === "VOLUNTEER").length,
    colleges: pending.filter(p => p.type === "COLLEGE").length
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <Loader2 className="w-8 h-8 text-indigo-600 animate-spin" />
      </div>
    );
  }

  return (
    <div className="bg-gray-50 min-h-screen">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
            <div>
              <div className="flex items-center gap-2 text-sm text-gray-600 mb-2">
                <span>Admin</span>
                <span>/</span>
                <span className="text-gray-900 font-medium">Verifications</span>
              </div>
              <h1 className="text-2xl lg:text-3xl font-bold text-gray-900">Verifications</h1>
              <p className="text-gray-500 mt-1">Review and verify pending organizations, colleges, and volunteers</p>
            </div>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
          <Card className="p-5 border border-gray-100 shadow-sm bg-white">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-500">Total Pending</p>
                <p className="text-2xl font-bold text-gray-900">{stats.total}</p>
              </div>
              <div className="w-10 h-10 bg-amber-50 rounded-lg flex items-center justify-center">
                <Clock className="w-5 h-5 text-amber-600" />
              </div>
            </div>
          </Card>
          <Card className="p-5 border border-gray-100 shadow-sm bg-white">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-500">Organizations</p>
                <p className="text-2xl font-bold text-gray-900">{stats.organizations}</p>
              </div>
              <div className="w-10 h-10 bg-purple-50 rounded-lg flex items-center justify-center">
                <Building2 className="w-5 h-5 text-purple-600" />
              </div>
            </div>
          </Card>
          <Card className="p-5 border border-gray-100 shadow-sm bg-white">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-500">Volunteers</p>
                <p className="text-2xl font-bold text-gray-900">{stats.volunteers}</p>
              </div>
              <div className="w-10 h-10 bg-green-50 rounded-lg flex items-center justify-center">
                <User className="w-5 h-5 text-green-600" />
              </div>
            </div>
          </Card>
          <Card className="p-5 border border-gray-100 shadow-sm bg-white">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-500">Colleges</p>
                <p className="text-2xl font-bold text-gray-900">{stats.colleges}</p>
              </div>
              <div className="w-10 h-10 bg-blue-50 rounded-lg flex items-center justify-center">
                <GraduationCap className="w-5 h-5 text-blue-600" />
              </div>
            </div>
          </Card>
        </div>

        {/* Search and Filter */}
        <Card className="p-4 border border-gray-100 shadow-sm bg-white mb-6">
          <div className="flex flex-col sm:flex-row gap-3">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
              <input
                type="text"
                placeholder="Search by name or email..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-full pl-9 pr-4 py-2 border border-gray-200 rounded-lg text-gray-900 placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
              />
            </div>
            <div className="flex gap-2">
              <div className="relative">
                <Filter className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                <select
                  value={typeFilter}
                  onChange={(e) => setTypeFilter(e.target.value)}
                  className="pl-9 pr-8 py-2 border border-gray-200 rounded-lg text-gray-700 bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
                >
                  <option value="all">All Types</option>
                  <option value="ORGANIZATION">Organizations</option>
                  <option value="VOLUNTEER">Volunteers</option>
                  <option value="COLLEGE">Colleges</option>
                </select>
              </div>
            </div>
          </div>
        </Card>

        {/* Pending Items List */}
        <Card className="border border-gray-100 shadow-sm bg-white overflow-hidden">
          <div className="divide-y divide-gray-100">
            {filteredItems.length > 0 ? (
              filteredItems.map((item) => (
                <div key={item.id} className="flex flex-col sm:flex-row sm:items-center justify-between p-5 hover:bg-gray-50 transition-all">
                  <div className="flex items-start gap-4 mb-3 sm:mb-0">
                    <div className={`w-12 h-12 ${getTypeBgColor(item.type)} rounded-xl flex items-center justify-center flex-shrink-0`}>
                      {getTypeIcon(item.type)}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 flex-wrap mb-1">
                        <p className="font-semibold text-gray-900">{item.name}</p>
                        <span className="text-xs px-2 py-0.5 rounded-full bg-gray-100 text-gray-600">
                          {item.type}
                        </span>
                      </div>
                      <div className="flex flex-wrap items-center gap-3 text-sm text-gray-500">
                        <div className="flex items-center gap-1">
                          <Mail className="w-3 h-3" />
                          <span className="truncate">{item.email}</span>
                        </div>
                        {item.contactPerson && (
                          <div className="flex items-center gap-1">
                            <Phone className="w-3 h-3" />
                            <span>{item.contactPerson}</span>
                          </div>
                        )}
                      </div>
                      <p className="text-xs text-gray-400 mt-1">
                        Requested on {new Date(item.createdAt).toLocaleDateString('en-IN', {
                          day: 'numeric',
                          month: 'short',
                          year: 'numeric'
                        })}
                      </p>
                    </div>
                  </div>
                  <div className="flex gap-2 ml-16 sm:ml-0">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => verifyItem(item.id, item.type)}
                      disabled={verifyingId === item.id}
                      className="border-green-200 text-green-700 hover:bg-green-50 hover:border-green-300"
                    >
                      {verifyingId === item.id ? (
                        <Loader2 className="w-4 h-4 animate-spin" />
                      ) : (
                        <>
                          <CheckCircle className="w-4 h-4 mr-1" />
                          Approve
                        </>
                      )}
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => rejectItem(item.id, item.type)}
                      disabled={verifyingId === item.id}
                      className="border-red-200 text-red-700 hover:bg-red-50 hover:border-red-300"
                    >
                      <XCircle className="w-4 h-4 mr-1" />
                      Reject
                    </Button>
                  </div>
                </div>
              ))
            ) : (
              <div className="text-center py-12">
                <CheckCircle className="w-12 h-12 text-gray-300 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-gray-900">No pending verifications</h3>
                <p className="text-gray-500 mt-1">All organizations and users are verified</p>
              </div>
            )}
          </div>
        </Card>
      </div>
    </div>
  );
}