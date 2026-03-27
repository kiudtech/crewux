"use client";

import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/Button";  // ✅ Use shared Button
import {
  Building2,
  Search,
  Eye,
  CheckCircle,
  XCircle,
  Phone,
  MapPin,
  Download,
  AlertCircle,
  Loader2
} from "lucide-react";
import toast from "react-hot-toast";

// Card Components
const Card = ({ children, className = "" }: { children: React.ReactNode; className?: string }) => (
  <div className={`bg-white/10 backdrop-blur-xl rounded-2xl border border-white/20 shadow-sm ${className}`}>{children}</div>
);

const CardContent = ({ children, className = "" }: { children: React.ReactNode; className?: string }) => (
  <div className={`p-4 ${className}`}>{children}</div>
);

const Badge = ({ children, variant = "default" }: { children: React.ReactNode; variant?: "success" | "warning" | "danger" | "info" | "default" }) => {
  const variants: Record<string, string> = {
    success: "bg-green-500/20 text-green-400",
    warning: "bg-yellow-500/20 text-yellow-400",
    danger: "bg-red-500/20 text-red-400",
    info: "bg-blue-500/20 text-blue-400",
    default: "bg-gray-500/20 text-gray-400"
  };
  return <span className={`px-2 py-1 text-xs rounded-full ${variants[variant]}`}>{children}</span>;
};

interface Organization {
  id: string;
  organizationName: string;
  officialEmail: string;
  contactPerson: string;
  phone?: string;
  type: string;
  city?: string;
  state?: string;
  verificationStatus: "VERIFIED" | "PENDING" | "REJECTED" | "UNVERIFIED";
  emailVerified: boolean;
  createdAt: string;
  totalEvents: number;
  totalVolunteers: number;
  logo?: string;
}

export default function SuperAdminOrganizationsPage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [organizations, setOrganizations] = useState<Organization[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [typeFilter, setTypeFilter] = useState("all");
  const [selectedOrgs, setSelectedOrgs] = useState<string[]>([]);

  useEffect(() => {
    if (status === "unauthenticated") router.push("/login");
    if (session?.user?.role !== "SUPER_ADMIN") router.push("/dashboard");
  }, [status, session, router]);

  useEffect(() => {
    fetchOrganizations();
  }, [statusFilter, typeFilter]);

  const fetchOrganizations = async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams();
      if (statusFilter !== "all") params.append("status", statusFilter);
      if (typeFilter !== "all") params.append("type", typeFilter);
      
      const res = await fetch(`/api/admin/organizations?${params}`);
      if (res.ok) {
        const data = await res.json();
        setOrganizations(data.organizations || []);
      } else {
        toast.error("Failed to fetch organizations");
      }
    } catch (error) {
      console.error(error);
      toast.error("Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  const verifyOrganization = async (orgId: string) => {
    try {
      const res = await fetch(`/api/admin/organizations/${orgId}/verify`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action: "approve" })
      });
      if (res.ok) {
        toast.success("Organization verified");
        fetchOrganizations();
      }
    } catch {
      toast.error("Failed to verify");
    }
  };

  const rejectOrganization = async (orgId: string) => {
    if (!confirm("Reject this organization?")) return;
    try {
      const res = await fetch(`/api/admin/organizations/${orgId}/verify`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action: "reject" })
      });
      if (res.ok) {
        toast.success("Organization rejected");
        fetchOrganizations();
      }
    } catch {
      toast.error("Failed to reject");
    }
  };

  const bulkVerify = async () => {
    if (selectedOrgs.length === 0) {
      toast.error("No organizations selected");
      return;
    }
    if (!confirm(`Verify ${selectedOrgs.length} organizations?`)) return;
    
    try {
      const res = await fetch("/api/admin/organizations/bulk-verify", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ids: selectedOrgs })
      });
      if (res.ok) {
        toast.success(`${selectedOrgs.length} organizations verified`);
        setSelectedOrgs([]);
        fetchOrganizations();
      }
    } catch {
      toast.error("Failed to verify");
    }
  };

  const exportData = () => {
    const csvData = organizations.map(org => ({
      "Organization Name": org.organizationName,
      "Email": org.officialEmail,
      "Contact Person": org.contactPerson,
      "Phone": org.phone || "",
      "Type": org.type,
      "Location": `${org.city || ""} ${org.state || ""}`.trim(),
      "Status": org.verificationStatus,
      "Events": org.totalEvents,
      "Joined": new Date(org.createdAt).toLocaleDateString()
    }));
    
    const headers = Object.keys(csvData[0] || {});
    const csv = [
      headers.join(","),
      ...csvData.map(row => headers.map(h => JSON.stringify(row[h as keyof typeof row] || "")).join(","))
    ].join("\n");
    
    const blob = new Blob([csv], { type: "text/csv" });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `organizations_${new Date().toISOString().split("T")[0]}.csv`;
    a.click();
    toast.success("Export started");
  };

  const filteredOrgs = organizations.filter(org =>
    org.organizationName.toLowerCase().includes(search.toLowerCase()) ||
    org.officialEmail.toLowerCase().includes(search.toLowerCase()) ||
    org.contactPerson.toLowerCase().includes(search.toLowerCase())
  );

  const stats = {
    total: organizations.length,
    verified: organizations.filter(o => o.verificationStatus === "VERIFIED").length,
    pending: organizations.filter(o => o.verificationStatus === "PENDING").length,
    rejected: organizations.filter(o => o.verificationStatus === "REJECTED").length
  };

  const getStatusBadge = (status: string) => {
    switch(status) {
      case "VERIFIED":
        return <Badge variant="success">Verified</Badge>;
      case "PENDING":
        return <Badge variant="warning">Pending</Badge>;
      case "REJECTED":
        return <Badge variant="danger">Rejected</Badge>;
      default:
        return <Badge variant="default">Unverified</Badge>;
    }
  };

  const toggleSelectAll = () => {
    if (selectedOrgs.length === filteredOrgs.length) {
      setSelectedOrgs([]);
    } else {
      setSelectedOrgs(filteredOrgs.map(o => o.id));
    }
  };

  const toggleSelect = (id: string) => {
    if (selectedOrgs.includes(id)) {
      setSelectedOrgs(selectedOrgs.filter(s => s !== id));
    } else {
      setSelectedOrgs([...selectedOrgs, id]);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 to-purple-900 flex items-center justify-center">
        <Loader2 className="w-8 h-8 text-indigo-400 animate-spin" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-indigo-950 to-purple-950">
      <div className="flex">
        <main className="flex-1 p-6 lg:p-8">
          <div className="space-y-6">
            {/* Header */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <h1 className="text-2xl font-bold text-white">Organizations</h1>
                <p className="text-sm text-gray-400 mt-1">
                  Manage and verify organizations on the platform
                </p>
              </div>
              <div className="flex gap-2">
                {selectedOrgs.length > 0 && (
                  <Button variant="primary" onClick={bulkVerify}>
                    <CheckCircle className="w-4 h-4 mr-2" />
                    Verify Selected ({selectedOrgs.length})
                  </Button>
                )}
                <Button variant="outline" onClick={exportData}>
                  <Download className="w-4 h-4 mr-2" />
                  Export
                </Button>
              </div>
            </div>

            {/* Stats Cards */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <Card>
                <CardContent className="p-4">
                  <p className="text-sm text-gray-400">Total</p>
                  <p className="text-2xl font-bold text-white">{stats.total}</p>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="p-4">
                  <p className="text-sm text-gray-400">Verified</p>
                  <p className="text-2xl font-bold text-green-400">{stats.verified}</p>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="p-4">
                  <p className="text-sm text-gray-400">Pending</p>
                  <p className="text-2xl font-bold text-yellow-400">{stats.pending}</p>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="p-4">
                  <p className="text-sm text-gray-400">Rejected</p>
                  <p className="text-2xl font-bold text-red-400">{stats.rejected}</p>
                </CardContent>
              </Card>
            </div>

            {/* Filters */}
            <Card>
              <CardContent className="p-4">
                <div className="flex flex-wrap gap-4">
                  <div className="flex-1 relative">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                    <input
                      type="text"
                      placeholder="Search by name, email, contact person..."
                      value={search}
                      onChange={(e) => setSearch(e.target.value)}
                      className="w-full pl-9 pr-4 py-2 border rounded-lg bg-white/10 border-white/20 text-white placeholder:text-gray-500 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                    />
                  </div>
                  <select
                    value={statusFilter}
                    onChange={(e) => setStatusFilter(e.target.value)}
                    className="px-3 py-2 border rounded-lg bg-white/10 border-white/20 text-white"
                  >
                    <option value="all">All Status</option>
                    <option value="VERIFIED">Verified</option>
                    <option value="PENDING">Pending</option>
                    <option value="REJECTED">Rejected</option>
                  </select>
                  <select
                    value={typeFilter}
                    onChange={(e) => setTypeFilter(e.target.value)}
                    className="px-3 py-2 border rounded-lg bg-white/10 border-white/20 text-white"
                  >
                    <option value="all">All Types</option>
                    <option value="NGO">NGO</option>
                    <option value="Events">Events Company</option>
                    <option value="Brand">Brand</option>
                    <option value="Agency">Agency</option>
                    <option value="Startup">Startup</option>
                  </select>
                </div>
              </CardContent>
            </Card>

            {/* Organizations Table */}
            <Card>
              <CardContent className="p-0">
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead className="bg-white/5 border-b border-white/10">
                      <tr>
                        <th className="px-4 py-3 text-left">
                          <input
                            type="checkbox"
                            checked={selectedOrgs.length === filteredOrgs.length && filteredOrgs.length > 0}
                            onChange={toggleSelectAll}
                            className="rounded border-gray-300"
                          />
                        </th>
                        <th className="px-4 py-3 text-left text-xs font-medium text-gray-400 uppercase">Organization</th>
                        <th className="px-4 py-3 text-left text-xs font-medium text-gray-400 uppercase">Contact</th>
                        <th className="px-4 py-3 text-left text-xs font-medium text-gray-400 uppercase">Location</th>
                        <th className="px-4 py-3 text-left text-xs font-medium text-gray-400 uppercase">Type</th>
                        <th className="px-4 py-3 text-left text-xs font-medium text-gray-400 uppercase">Stats</th>
                        <th className="px-4 py-3 text-left text-xs font-medium text-gray-400 uppercase">Status</th>
                        <th className="px-4 py-3 text-left text-xs font-medium text-gray-400 uppercase">Joined</th>
                        <th className="px-4 py-3 text-left text-xs font-medium text-gray-400 uppercase">Actions</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-white/10">
                      {filteredOrgs.map((org) => (
                        <tr key={org.id} className="hover:bg-white/5 transition">
                          <td className="px-4 py-3">
                            <input
                              type="checkbox"
                              checked={selectedOrgs.includes(org.id)}
                              onChange={() => toggleSelect(org.id)}
                              className="rounded border-gray-300"
                            />
                          </td>
                          <td className="px-4 py-3">
                            <div className="flex items-center gap-3">
                              <div className="w-10 h-10 bg-indigo-500/20 rounded-full flex items-center justify-center text-indigo-400 font-semibold">
                                {org.logo ? (
                                  <img src={org.logo} alt={org.organizationName} className="w-10 h-10 rounded-full object-cover" />
                                ) : (
                                  org.organizationName.charAt(0).toUpperCase()
                                )}
                              </div>
                              <div>
                                <p className="font-medium text-white">{org.organizationName}</p>
                                <p className="text-sm text-gray-400">{org.officialEmail}</p>
                              </div>
                            </div>
                          </td>
                          <td className="px-4 py-3">
                            <div className="space-y-1">
                              <p className="text-sm font-medium text-gray-300">{org.contactPerson}</p>
                              {org.phone && (
                                <div className="flex items-center gap-1 text-sm text-gray-400">
                                  <Phone className="w-3 h-3" />
                                  <span>{org.phone}</span>
                                </div>
                              )}
                            </div>
                          </td>
                          <td className="px-4 py-3">
                            {org.city || org.state ? (
                              <div className="flex items-center gap-1 text-sm text-gray-400">
                                <MapPin className="w-3 h-3" />
                                <span>{[org.city, org.state].filter(Boolean).join(", ")}</span>
                              </div>
                            ) : (
                              <span className="text-sm text-gray-500">—</span>
                            )}
                          </td>
                          <td className="px-4 py-3">
                            <Badge variant="info">{org.type}</Badge>
                          </td>
                          <td className="px-4 py-3">
                            <div className="text-sm text-gray-300">
                              <p>Events: {org.totalEvents || 0}</p>
                            </div>
                          </td>
                          <td className="px-4 py-3">
                            {getStatusBadge(org.verificationStatus)}
                            {!org.emailVerified && (
                              <div className="mt-1 flex items-center gap-1 text-xs text-yellow-400">
                                <AlertCircle className="w-3 h-3" />
                                Email pending
                              </div>
                            )}
                          </td>
                          <td className="px-4 py-3 text-sm text-gray-400">
                            {new Date(org.createdAt).toLocaleDateString()}
                          </td>
                          <td className="px-4 py-3">
                            <div className="flex gap-1">
                              <Link href={`/dashboard/super-admin/organizations/${org.id}`}>
                                <Button variant="ghost" size="sm" className="p-1">
                                  <Eye className="w-4 h-4" />
                                </Button>
                              </Link>
                              {org.verificationStatus === "PENDING" && (
                                <>
                                  <Button
                                    variant="ghost"
                                    size="sm"
                                    onClick={() => verifyOrganization(org.id)}
                                    className="p-1 text-green-400 hover:text-green-300"
                                  >
                                    <CheckCircle className="w-4 h-4" />
                                  </Button>
                                  <Button
                                    variant="ghost"
                                    size="sm"
                                    onClick={() => rejectOrganization(org.id)}
                                    className="p-1 text-red-400 hover:text-red-300"
                                  >
                                    <XCircle className="w-4 h-4" />
                                  </Button>
                                </>
                              )}
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>

                {filteredOrgs.length === 0 && (
                  <div className="text-center py-12">
                    <Building2 className="w-12 h-12 text-gray-500 mx-auto mb-4" />
                    <h3 className="text-lg font-medium text-white">No organizations found</h3>
                    <p className="text-gray-400 mt-1">
                      {search ? "Try different search terms" : "No organizations registered yet"}
                    </p>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        </main>
      </div>
    </div>
  );
}