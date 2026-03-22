"use client";  

import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { Navbar } from "@/components/layout/Navbar";
import { AdminSidebar } from "@/components/layout/AdminSidebar";
import {
  CheckCircle,
  XCircle,
  Mail,
  Phone,
  Building2,
  User,
  GraduationCap,
  Search,
  Eye
} from "lucide-react";
import toast from "react-hot-toast";

// Card Components
const Card = ({ children, className = "" }: { children: React.ReactNode; className?: string }) => (
  <div className={`bg-white rounded-xl border border-gray-200 shadow-sm ${className}`}>{children}</div>
);

const CardContent = ({ children, className = "" }: { children: React.ReactNode; className?: string }) => (
  <div className={`p-4 ${className}`}>{children}</div>
);

const Badge = ({ children, variant = "default" }: any) => {
  const variants: Record<string, string> = {
    success: "bg-green-100 text-green-700",
    warning: "bg-yellow-100 text-yellow-700",
    danger: "bg-red-100 text-red-700",
    info: "bg-blue-100 text-blue-700",
    default: "bg-gray-100 text-gray-700"
  };
  return <span className={`px-2 py-1 text-xs rounded-full ${variants[variant]}`}>{children}</span>;
};

const Button = ({ children, onClick, variant = "default", size = "md", className = "" }: any) => {
  const variants = {
    default: "bg-white border border-gray-300 text-gray-700 hover:bg-gray-50",
    primary: "bg-indigo-600 text-white hover:bg-indigo-700",
    ghost: "hover:bg-gray-100"
  };
  const sizes = { sm: "px-2 py-1 text-xs", md: "px-3 py-1.5 text-sm" };
  return (
    <button onClick={onClick} className={`inline-flex items-center justify-center gap-2 rounded-lg font-medium transition-colors ${variants[variant]} ${sizes[size]} ${className}`}>
      {children}
    </button>
  );
};

interface PendingItem {
  id: string;
  type: "ORGANIZATION" | "VOLUNTEER" | "COLLEGE";
  name: string;
  email: string;
  contactPerson?: string;
  status: string;
  createdAt: string;
}

export default function SuperAdminVerificationsPage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [pending, setPending] = useState<PendingItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [typeFilter, setTypeFilter] = useState("all");

  useEffect(() => {
    if (status === "unauthenticated") router.push("/login");
    if (session?.user?.role !== "SUPER_ADMIN") router.push("/dashboard");
  }, [status, session, router]);

  useEffect(() => {
    fetchPendingVerifications();
  }, []);

  const fetchPendingVerifications = async () => {
    try {
      const res = await fetch("/api/admin/verifications");
      if (res.ok) {
        const data = await res.json();
        setPending(data.pending || []);
      }
    } catch (error) {
      console.error(error);
      toast.error("Failed to fetch pending verifications");
    } finally {
      setLoading(false);
    }
  };

  const verifyItem = async (id: string, type: string) => {
    try {
      let url = "";
      if (type === "ORGANIZATION") {
        url = `/api/admin/organizations/${id}/verify`;
        await fetch(url, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ action: "approve" })
        });
      } else if (type === "VOLUNTEER" || type === "COLLEGE") {
        url = `/api/admin/users/${id}/verify`;
        await fetch(url, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ verified: true })
        });
      }
      toast.success(`${type} verified successfully`);
      fetchPendingVerifications();
    } catch {
      toast.error("Failed to verify");
    }
  };

  const rejectItem = async (id: string, type: string) => {
    if (!confirm(`Are you sure you want to reject this ${type}?`)) return;
    
    try {
      let url = "";
      if (type === "ORGANIZATION") {
        url = `/api/admin/organizations/${id}/verify`;
        await fetch(url, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ action: "reject" })
        });
      } else if (type === "VOLUNTEER" || type === "COLLEGE") {
        url = `/api/admin/users/${id}/verify`;
        await fetch(url, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ verified: false })
        });
      }
      toast.success(`${type} rejected`);
      fetchPendingVerifications();
    } catch {
      toast.error("Failed to reject");
    }
  };

  const getTypeIcon = (type: string) => {
    switch(type) {
      case "ORGANIZATION": return <Building2 className="w-5 h-5 text-purple-600" />;
      case "VOLUNTEER": return <User className="w-5 h-5 text-green-600" />;
      case "COLLEGE": return <GraduationCap className="w-5 h-5 text-blue-600" />;
      default: return <User className="w-5 h-5 text-gray-600" />;
    }
  };

  const filteredItems = pending.filter(item => {
    const matchesSearch = item.name.toLowerCase().includes(search.toLowerCase()) ||
                          item.email.toLowerCase().includes(search.toLowerCase());
    const matchesType = typeFilter === "all" || item.type === typeFilter;
    return matchesSearch && matchesType;
  });

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      <div className="flex">
        <AdminSidebar />
        <main className="flex-1 p-6 lg:p-8">
          <div className="space-y-6">
            {/* Header */}
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Verifications</h1>
              <p className="text-sm text-gray-500 mt-1">
                Review and verify pending organizations, colleges, and volunteers
              </p>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-3 gap-4">
              <Card>
                <CardContent className="p-3">
                  <p className="text-sm text-gray-500">Total Pending</p>
                  <p className="text-2xl font-bold text-yellow-600">{pending.length}</p>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="p-3">
                  <p className="text-sm text-gray-500">Organizations</p>
                  <p className="text-2xl font-bold text-purple-600">
                    {pending.filter(p => p.type === "ORGANIZATION").length}
                  </p>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="p-3">
                  <p className="text-sm text-gray-500">Users</p>
                  <p className="text-2xl font-bold text-blue-600">
                    {pending.filter(p => p.type === "VOLUNTEER" || p.type === "COLLEGE").length}
                  </p>
                </CardContent>
              </Card>
            </div>

            {/* Filters */}
            <Card>
              <CardContent className="p-4">
                <div className="flex gap-4">
                  <div className="flex-1 relative">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                    <input
                      type="text"
                      placeholder="Search by name or email..."
                      value={search}
                      onChange={(e) => setSearch(e.target.value)}
                      className="w-full pl-9 pr-4 py-2 border rounded-lg"
                    />
                  </div>
                  <select
                    value={typeFilter}
                    onChange={(e) => setTypeFilter(e.target.value)}
                    className="px-3 py-2 border rounded-lg bg-white"
                  >
                    <option value="all">All Types</option>
                    <option value="ORGANIZATION">Organizations</option>
                    <option value="VOLUNTEER">Volunteers</option>
                    <option value="COLLEGE">Colleges</option>
                  </select>
                </div>
              </CardContent>
            </Card>

            {/* Pending List */}
            <Card>
              <CardContent className="p-0">
                <div className="divide-y divide-gray-200">
                  {filteredItems.map((item) => (
                    <div key={item.id} className="flex items-center justify-between p-4 hover:bg-gray-50">
                      <div className="flex items-center gap-4">
                        <div className="w-10 h-10 bg-gray-100 rounded-full flex items-center justify-center">
                          {getTypeIcon(item.type)}
                        </div>
                        <div>
                          <p className="font-medium text-gray-900">{item.name}</p>
                          <div className="flex items-center gap-2 text-sm text-gray-500">
                            <Mail className="w-3 h-3" />
                            <span>{item.email}</span>
                            {item.contactPerson && (
                              <>
                                <Phone className="w-3 h-3 ml-2" />
                                <span>{item.contactPerson}</span>
                              </>
                            )}
                          </div>
                          <p className="text-xs text-gray-400 mt-1">
                            {item.type} • {new Date(item.createdAt).toLocaleDateString()}
                          </p>
                        </div>
                      </div>
                      <div className="flex gap-2">
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => verifyItem(item.id, item.type)}
                          className="p-2 text-green-600 hover:text-green-700"
                        >
                          <CheckCircle className="w-5 h-5" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => rejectItem(item.id, item.type)}
                          className="p-2 text-red-600 hover:text-red-700"
                        >
                          <XCircle className="w-5 h-5" />
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>

                {filteredItems.length === 0 && (
                  <div className="text-center py-12">
                    <CheckCircle className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                    <h3 className="text-lg font-medium text-gray-900">No pending verifications</h3>
                    <p className="text-gray-500 mt-1">
                      All organizations and users are verified
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