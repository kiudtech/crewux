"use client";

import { useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import {
  Users,
  Search,
  Eye,
  CheckCircle,
  XCircle,
  Mail,
  Phone,
  Filter,
  Download,
  AlertCircle,
  Calendar,
  GraduationCap,
  Building2,
  UserCheck
} from "lucide-react";
import toast from "react-hot-toast";

// Components
const Card = ({ children, className = "" }: { children: React.ReactNode; className?: string }) => (
  <div className={`bg-white rounded-xl border border-gray-200 shadow-sm ${className}`}>{children}</div>
);

const CardContent = ({ children, className = "" }: { children: React.ReactNode; className?: string }) => (
  <div className={`p-4 ${className}`}>{children}</div>
);

const Badge = ({ children, variant = "default" }: { children: React.ReactNode; variant?: "success" | "warning" | "danger" | "info" | "default" }) => {
  const variants = {
    success: "bg-green-100 text-green-700",
    warning: "bg-yellow-100 text-yellow-700",
    danger: "bg-red-100 text-red-700",
    info: "bg-blue-100 text-blue-700",
    default: "bg-gray-100 text-gray-700"
  };
  return <span className={`px-2 py-1 text-xs rounded-full ${variants[variant]}`}>{children}</span>;
};

const Button = ({ children, onClick, variant = "default", size = "md", className = "", disabled = false }: any) => {
  const variants = {
    default: "bg-white border border-gray-300 text-gray-700 hover:bg-gray-50",
    primary: "bg-indigo-600 text-white hover:bg-indigo-700",
    danger: "bg-red-600 text-white hover:bg-red-700",
    ghost: "hover:bg-gray-100"
  };
  const sizes = { sm: "px-2 py-1 text-xs", md: "px-3 py-1.5 text-sm", lg: "px-4 py-2 text-base" };
  return (
    <button onClick={onClick} disabled={disabled} className={`inline-flex items-center justify-center gap-2 rounded-lg font-medium transition-colors ${variants[variant]} ${sizes[size]} ${className} ${disabled ? "opacity-50 cursor-not-allowed" : ""}`}>
      {children}
    </button>
  );
};

interface User {
  id: string;
  name: string;
  email: string;
  role: string;
  phone?: string;
  emailVerified: boolean;
  createdAt: string;
  profile?: {
    fullName?: string;
    college?: string;
    organizationName?: string;
    course?: string;
    yearOfStudy?: string;
  };
}

export default function AdminUsersPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const roleFilter = searchParams.get("role") || "all";
  const statusFilter = searchParams.get("status") || "all";
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");

  useEffect(() => {
    fetchUsers();
  }, [roleFilter, statusFilter]);

  const fetchUsers = async () => {
    try {
      const params = new URLSearchParams();
      if (roleFilter !== "all") params.append("role", roleFilter);
      if (statusFilter !== "all") params.append("status", statusFilter);
      
      const res = await fetch(`/api/admin/users?${params}`);
      if (res.ok) {
        const data = await res.json();
        setUsers(data.users);
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
        toast.success("User verified successfully");
        fetchUsers();
      }
    } catch {
      toast.error("Failed to verify user");
    }
  };

  const rejectUser = async (userId: string) => {
    if (!confirm("Are you sure you want to reject this user?")) return;
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
      toast.error("Failed to reject user");
    }
  };

  const exportData = () => {
    const csvData = users.map(user => ({
      "Name": user.profile?.fullName || user.name || "N/A",
      "Email": user.email,
      "Role": user.role,
      "Phone": user.phone || "",
      "Verified": user.emailVerified ? "Yes" : "No",
      "Joined": new Date(user.createdAt).toLocaleDateString()
    }));
    
    const headers = Object.keys(csvData[0] || {});
    const csv = [headers.join(","), ...csvData.map(row => headers.map(h => JSON.stringify(row[h as keyof typeof row] || "")).join(","))].join("\n");
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
    user.profile?.college?.toLowerCase().includes(search.toLowerCase())
  );

  const stats = {
    total: users.length,
    volunteers: users.filter(u => u.role === "VOLUNTEER").length,
    organizations: users.filter(u => u.role === "ORGANIZATION").length,
    colleges: users.filter(u => u.role === "COLLEGE").length,
    verified: users.filter(u => u.emailVerified).length,
    pending: users.filter(u => !u.emailVerified).length
  };

  const getRoleIcon = (role: string) => {
    switch(role) {
      case "VOLUNTEER": return <GraduationCap className="w-4 h-4" />;
      case "ORGANIZATION": return <Building2 className="w-4 h-4" />;
      case "COLLEGE": return <GraduationCap className="w-4 h-4" />;
      default: return <Users className="w-4 h-4" />;
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">User Management</h1>
          <p className="text-sm text-gray-500 mt-1">Manage all users, verify accounts, and track user activity</p>
        </div>
        <Button variant="outline" onClick={exportData}>
          <Download className="w-4 h-4 mr-2" /> Export
        </Button>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-6 gap-4">
        <Card><CardContent className="p-3"><p className="text-sm text-gray-500">Total</p><p className="text-xl font-bold">{stats.total}</p></CardContent></Card>
        <Card><CardContent className="p-3"><p className="text-sm text-gray-500">Volunteers</p><p className="text-xl font-bold text-green-600">{stats.volunteers}</p></CardContent></Card>
        <Card><CardContent className="p-3"><p className="text-sm text-gray-500">Organizations</p><p className="text-xl font-bold text-purple-600">{stats.organizations}</p></CardContent></Card>
        <Card><CardContent className="p-3"><p className="text-sm text-gray-500">Colleges</p><p className="text-xl font-bold text-orange-600">{stats.colleges}</p></CardContent></Card>
        <Card><CardContent className="p-3"><p className="text-sm text-gray-500">Verified</p><p className="text-xl font-bold text-green-600">{stats.verified}</p></CardContent></Card>
        <Card><CardContent className="p-3"><p className="text-sm text-gray-500">Pending</p><p className="text-xl font-bold text-yellow-600">{stats.pending}</p></CardContent></Card>
      </div>

      <Card>
        <CardContent className="p-4">
          <div className="flex flex-wrap gap-4">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
              <input type="text" placeholder="Search users..." value={search} onChange={(e) => setSearch(e.target.value)} className="w-full pl-9 pr-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500" />
            </div>
            <select value={roleFilter} onChange={(e) => router.push(`/dashboard/admin/users?role=${e.target.value}`)} className="px-3 py-2 border rounded-lg bg-white">
              <option value="all">All Roles</option>
              <option value="VOLUNTEER">Volunteers</option>
              <option value="ORGANIZATION">Organizations</option>
              <option value="COLLEGE">Colleges</option>
            </select>
            <select value={statusFilter} onChange={(e) => router.push(`/dashboard/admin/users?status=${e.target.value}`)} className="px-3 py-2 border rounded-lg bg-white">
              <option value="all">All Status</option>
              <option value="verified">Verified</option>
              <option value="pending">Pending</option>
            </select>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50 border-b">
                <tr><th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">User</th><th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Role</th><th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Contact</th><th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Status</th><th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Joined</th><th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Actions</th></tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {filteredUsers.map((user) => (
                  <tr key={user.id} className="hover:bg-gray-50">
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 bg-indigo-100 rounded-full flex items-center justify-center text-indigo-600 font-semibold text-sm">
                          {(user.profile?.fullName || user.email).charAt(0).toUpperCase()}
                        </div>
                        <div><p className="font-medium text-gray-900">{user.profile?.fullName || user.profile?.organizationName || "N/A"}</p><p className="text-sm text-gray-500">{user.email}</p></div>
                      </div>
                    </td>
                    <td className="px-4 py-3"><Badge variant={user.role === "VOLUNTEER" ? "success" : user.role === "ORGANIZATION" ? "warning" : "info"}>{user.role}</Badge></td>
                    <td className="px-4 py-3">{user.phone && <div className="flex items-center gap-1 text-sm"><Phone className="w-3 h-3 text-gray-400" /><span>{user.phone}</span></div>}</td>
                    <td className="px-4 py-3">{user.emailVerified ? <Badge variant="success">Verified</Badge> : <Badge variant="warning">Pending</Badge>}</td>
                    <td className="px-4 py-3 text-sm text-gray-500">{new Date(user.createdAt).toLocaleDateString()}</td>
                    <td className="px-4 py-3">
                      <div className="flex gap-1">
                        <Link href={`/dashboard/admin/users/${user.id}`}><Button variant="ghost" size="sm" className="p-1"><Eye className="w-4 h-4" /></Button></Link>
                        {!user.emailVerified && (<><Button variant="ghost" size="sm" onClick={() => verifyUser(user.id)} className="p-1 text-green-600"><CheckCircle className="w-4 h-4" /></Button><Button variant="ghost" size="sm" onClick={() => rejectUser(user.id)} className="p-1 text-red-600"><XCircle className="w-4 h-4" /></Button></>)}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          {filteredUsers.length === 0 && <div className="text-center py-12"><Users className="w-12 h-12 text-gray-400 mx-auto mb-4" /><h3 className="text-lg font-medium text-gray-900">No users found</h3><p className="text-gray-500 mt-1">Try adjusting your filters</p></div>}
        </CardContent>
      </Card>
    </div>
  );
}