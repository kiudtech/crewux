"use client";

import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/Button";  // ✅ Shared Button
import {
  Users,
  Search,
  Eye,
  CheckCircle,
  XCircle,
  Phone,
  Download,
  Loader2,
  GraduationCap,
  Building2
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

interface User {
  id: string;
  email: string;
  role: string;
  name?: string;
  phone?: string;
  emailVerified: boolean;
  createdAt: string;
  profile?: {
    fullName?: string;
    college?: string;
    organizationName?: string;
  };
}

export default function SuperAdminUsersPage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [roleFilter, setRoleFilter] = useState("all");
  const [statusFilter, setStatusFilter] = useState("all");

  useEffect(() => {
    if (status === "unauthenticated") router.push("/login");
    if (session?.user?.role !== "SUPER_ADMIN") router.push("/dashboard");
  }, [status, session, router]);

  useEffect(() => {
    fetchUsers();
  }, [roleFilter, statusFilter]);

  const fetchUsers = async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams();
      if (roleFilter !== "all") params.append("role", roleFilter);
      if (statusFilter !== "all") params.append("status", statusFilter);
      
      const res = await fetch(`/api/admin/users?${params}`);
      if (res.ok) {
        const data = await res.json();
        setUsers(data.users || []);
      }
    } catch (error) {
      console.error(error);
      toast.error("Failed to fetch users");
    } finally {
      setLoading(false);
    }
  };

  const verifyUser = async (userId: string) => {
    try {
      const res = await fetch(`/api/admin/users/${userId}/verify`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ verified: true })
      });
      if (res.ok) {
        toast.success("User verified");
        fetchUsers();
      }
    } catch {
      toast.error("Failed to verify");
    }
  };

  const rejectUser = async (userId: string) => {
    if (!confirm("Reject this user?")) return;
    try {
      const res = await fetch(`/api/admin/users/${userId}/verify`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ verified: false })
      });
      if (res.ok) {
        toast.success("User rejected");
        fetchUsers();
      }
    } catch {
      toast.error("Failed to reject");
    }
  };

  const exportData = () => {
    const csvData = users.map(user => ({
      "Name": user.profile?.fullName || user.profile?.organizationName || user.email,
      "Email": user.email,
      "Role": user.role,
      "Phone": user.phone || "",
      "Verified": user.emailVerified ? "Yes" : "No",
      "Joined": new Date(user.createdAt).toLocaleDateString()
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
    a.download = `users_${new Date().toISOString().split("T")[0]}.csv`;
    a.click();
    toast.success("Export started");
  };

  const filteredUsers = users.filter(user => 
    user.email.toLowerCase().includes(search.toLowerCase()) ||
    user.profile?.fullName?.toLowerCase().includes(search.toLowerCase()) ||
    user.profile?.organizationName?.toLowerCase().includes(search.toLowerCase())
  );

  const stats = {
    total: users.length,
    volunteers: users.filter(u => u.role === "VOLUNTEER").length,
    organizations: users.filter(u => u.role === "ORGANIZATION").length,
    colleges: users.filter(u => u.role === "COLLEGE").length,
    verified: users.filter(u => u.emailVerified).length,
    pending: users.filter(u => !u.emailVerified).length
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
                <h1 className="text-2xl font-bold text-white">User Management</h1>
                <p className="text-sm text-gray-400 mt-1">Manage all users, verify accounts, and track user activity</p>
              </div>
              <Button variant="outline" onClick={exportData}>
                <Download className="w-4 h-4 mr-2" />
                Export
              </Button>
            </div>

            {/* Stats Cards */}
            <div className="grid grid-cols-2 md:grid-cols-6 gap-4">
              <Card><CardContent className="p-3"><p className="text-sm text-gray-400">Total</p><p className="text-xl font-bold text-white">{stats.total}</p></CardContent></Card>
              <Card><CardContent className="p-3"><p className="text-sm text-gray-400">Volunteers</p><p className="text-xl font-bold text-green-400">{stats.volunteers}</p></CardContent></Card>
              <Card><CardContent className="p-3"><p className="text-sm text-gray-400">Organizations</p><p className="text-xl font-bold text-purple-400">{stats.organizations}</p></CardContent></Card>
              <Card><CardContent className="p-3"><p className="text-sm text-gray-400">Colleges</p><p className="text-xl font-bold text-orange-400">{stats.colleges}</p></CardContent></Card>
              <Card><CardContent className="p-3"><p className="text-sm text-gray-400">Verified</p><p className="text-xl font-bold text-green-400">{stats.verified}</p></CardContent></Card>
              <Card><CardContent className="p-3"><p className="text-sm text-gray-400">Pending</p><p className="text-xl font-bold text-yellow-400">{stats.pending}</p></CardContent></Card>
            </div>

            {/* Filters */}
            <Card>
              <CardContent className="p-4">
                <div className="flex flex-wrap gap-4">
                  <div className="flex-1 relative">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                    <input
                      type="text"
                      placeholder="Search users..."
                      value={search}
                      onChange={(e) => setSearch(e.target.value)}
                      className="w-full pl-9 pr-4 py-2 border rounded-lg bg-white/10 border-white/20 text-white placeholder:text-gray-500 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                    />
                  </div>
                  <select value={roleFilter} onChange={(e) => setRoleFilter(e.target.value)} className="px-3 py-2 border rounded-lg bg-white/10 border-white/20 text-white">
                    <option value="all">All Roles</option>
                    <option value="VOLUNTEER">Volunteers</option>
                    <option value="ORGANIZATION">Organizations</option>
                    <option value="COLLEGE">Colleges</option>
                  </select>
                  <select value={statusFilter} onChange={(e) => setStatusFilter(e.target.value)} className="px-3 py-2 border rounded-lg bg-white/10 border-white/20 text-white">
                    <option value="all">All Status</option>
                    <option value="verified">Verified</option>
                    <option value="pending">Pending</option>
                  </select>
                </div>
              </CardContent>
            </Card>

            {/* Users Table */}
            <Card>
              <CardContent className="p-0">
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead className="bg-white/5 border-b border-white/10">
                      <tr><th className="px-4 py-3 text-left text-xs font-medium text-gray-400 uppercase">User</th><th className="px-4 py-3 text-left text-xs font-medium text-gray-400 uppercase">Role</th><th className="px-4 py-3 text-left text-xs font-medium text-gray-400 uppercase">Contact</th><th className="px-4 py-3 text-left text-xs font-medium text-gray-400 uppercase">Status</th><th className="px-4 py-3 text-left text-xs font-medium text-gray-400 uppercase">Joined</th><th className="px-4 py-3 text-left text-xs font-medium text-gray-400 uppercase">Actions</th></tr>
                    </thead>
                    <tbody className="divide-y divide-white/10">
                      {filteredUsers.map((user) => (
                        <tr key={user.id} className="hover:bg-white/5 transition">
                          <td className="px-4 py-3">
                            <div className="flex items-center gap-3">
                              <div className="w-8 h-8 bg-indigo-500/20 rounded-full flex items-center justify-center text-indigo-400 font-semibold text-sm">
                                {(user.profile?.fullName || user.email).charAt(0).toUpperCase()}
                              </div>
                              <div><p className="font-medium text-white">{user.profile?.fullName || user.profile?.organizationName || "N/A"}</p><p className="text-sm text-gray-400">{user.email}</p></div>
                            </div>
                          </td>
                          <td className="px-4 py-3"><Badge variant={user.role === "VOLUNTEER" ? "success" : user.role === "ORGANIZATION" ? "warning" : "info"}>{user.role}</Badge></td>
                          <td className="px-4 py-3">{user.phone && <div className="flex items-center gap-1 text-sm text-gray-400"><Phone className="w-3 h-3" /><span>{user.phone}</span></div>}</td>
                          <td className="px-4 py-3">{user.emailVerified ? <Badge variant="success">Verified</Badge> : <Badge variant="warning">Pending</Badge>}</td>
                          <td className="px-4 py-3 text-sm text-gray-400">{new Date(user.createdAt).toLocaleDateString()}</td>
                          <td className="px-4 py-3">
                            <div className="flex gap-1">
                              <Link href={`/dashboard/super-admin/users/${user.id}`}><Button variant="ghost" size="sm" className="p-1"><Eye className="w-4 h-4" /></Button></Link>
                              {!user.emailVerified && (<><Button variant="ghost" size="sm" onClick={() => verifyUser(user.id)} className="p-1 text-green-400"><CheckCircle className="w-4 h-4" /></Button><Button variant="ghost" size="sm" onClick={() => rejectUser(user.id)} className="p-1 text-red-400"><XCircle className="w-4 h-4" /></Button></>)}
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
                {filteredUsers.length === 0 && <div className="text-center py-12"><Users className="w-12 h-12 text-gray-500 mx-auto mb-4" /><h3 className="text-lg font-medium text-white">No users found</h3><p className="text-gray-400 mt-1">Try adjusting your filters</p></div>}
              </CardContent>
            </Card>
          </div>
        </main>
      </div>
    </div>
  );
}