"use client";

import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { Navbar } from "@/components/layout/Navbar";
import { AdminSidebar } from "@/components/layout/AdminSidebar";
import {
  DollarSign,
  TrendingUp,
  Users,
  Award,
  Download,
  Search,
  Calendar,
  Loader2
} from "lucide-react";
import toast from "react-hot-toast";

// Card Components
const Card = ({ children, className = "" }: { children: React.ReactNode; className?: string }) => (
  <div className={`bg-white rounded-xl border border-gray-200 shadow-sm ${className}`}>{children}</div>
);

const CardContent = ({ children, className = "" }: { children: React.ReactNode; className?: string }) => (
  <div className={`p-4 ${className}`}>{children}</div>
);

const Badge = ({ children, variant = "default" }: { children: React.ReactNode; variant?: "success" | "warning" | "danger" | "info" | "default" }) => {
  const variants: Record<string, string> = {
    success: "bg-green-100 text-green-700",
    warning: "bg-yellow-100 text-yellow-700",
    danger: "bg-red-100 text-red-700",
    info: "bg-blue-100 text-blue-700",
    default: "bg-gray-100 text-gray-700"
  };
  return <span className={`px-2 py-1 text-xs rounded-full ${variants[variant]}`}>{children}</span>;
};

// ✅ FIX: Add proper typing for variant
type ButtonVariant = "default" | "primary" | "ghost";

const Button = ({ 
  children, 
  onClick, 
  variant = "default" as ButtonVariant, 
  size = "md", 
  className = "", 
  isLoading = false 
}: { 
  children: React.ReactNode; 
  onClick?: () => void; 
  variant?: ButtonVariant; 
  size?: "sm" | "md" | "lg"; 
  className?: string; 
  isLoading?: boolean;
}) => {
  const variants: Record<ButtonVariant, string> = {
    default: "bg-white border border-gray-300 text-gray-700 hover:bg-gray-50",
    primary: "bg-indigo-600 text-white hover:bg-indigo-700",
    ghost: "hover:bg-gray-100"
  };
  const sizes = { sm: "px-2 py-1 text-xs", md: "px-3 py-1.5 text-sm", lg: "px-4 py-2 text-base" };
  return (
    <button
      onClick={onClick}
      disabled={isLoading}
      className={`inline-flex items-center justify-center gap-2 rounded-lg font-medium transition-colors ${variants[variant]} ${sizes[size]} ${className} ${isLoading ? "opacity-50 cursor-not-allowed" : ""}`}
    >
      {isLoading && <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>}
      {children}
    </button>
  );
};

interface EarningData {
  userId: string;
  name: string;
  totalEvents: number;
  totalHours: number;
  earnings: number;
  reputationScore: number;
}

export default function SuperAdminEarningsPage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [earnings, setEarnings] = useState<EarningData[]>([]);
  const [totalEarnings, setTotalEarnings] = useState(0);
  const [totalVolunteers, setTotalVolunteers] = useState(0);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");

  useEffect(() => {
    if (status === "unauthenticated") router.push("/login");
    if (session?.user?.role !== "SUPER_ADMIN") router.push("/dashboard");
  }, [status, session, router]);

  useEffect(() => {
    fetchEarnings();
  }, []);

  const fetchEarnings = async () => {
    try {
      const res = await fetch("/api/admin/earnings");
      if (res.ok) {
        const data = await res.json();
        setEarnings(data.earnings || []);
        setTotalEarnings(data.totalEarnings || 0);
        setTotalVolunteers(data.totalVolunteers || 0);
      } else {
        toast.error("Failed to fetch earnings data");
      }
    } catch (error) {
      console.error(error);
      toast.error("Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  const exportData = () => {
    const csvData = earnings.map(e => ({
      "Name": e.name,
      "Total Events": e.totalEvents,
      "Total Hours": e.totalHours,
      "Earnings (₹)": e.earnings,
      "Reputation Score": e.reputationScore
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
    a.download = `earnings_report_${new Date().toISOString().split("T")[0]}.csv`;
    a.click();
    toast.success("Export started");
  };

  const filteredEarnings = earnings.filter(e =>
    e.name.toLowerCase().includes(search.toLowerCase())
  );

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 to-purple-900 flex items-center justify-center">
        <Loader2 className="w-8 h-8 text-indigo-400 animate-spin" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-indigo-950 to-purple-950">
      <Navbar />
      <div className="flex">
        <AdminSidebar />
        <main className="flex-1 p-6 lg:p-8">
          <div className="space-y-6">
            {/* Header */}
            <div className="flex justify-between items-center">
              <div>
                <h1 className="text-2xl font-bold text-white">Earnings</h1>
                <p className="text-sm text-gray-400 mt-1">
                  Track volunteer earnings and platform payouts
                </p>
              </div>
              <Button onClick={exportData}>
                <Download className="w-4 h-4 mr-2" />
                Export Report
              </Button>
            </div>

            {/* Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <Card>
                <CardContent className="p-4">
                  <div className="flex items-center gap-3">
                    <div className="p-2 bg-green-100 rounded-lg">
                      <DollarSign className="w-5 h-5 text-green-600" />
                    </div>
                    <div>
                      <p className="text-sm text-gray-500">Total Earnings</p>
                      <p className="text-2xl font-bold text-green-600">₹{totalEarnings.toLocaleString()}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="p-4">
                  <div className="flex items-center gap-3">
                    <div className="p-2 bg-blue-100 rounded-lg">
                      <Users className="w-5 h-5 text-blue-600" />
                    </div>
                    <div>
                      <p className="text-sm text-gray-500">Total Volunteers</p>
                      <p className="text-2xl font-bold">{totalVolunteers}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="p-4">
                  <div className="flex items-center gap-3">
                    <div className="p-2 bg-purple-100 rounded-lg">
                      <TrendingUp className="w-5 h-5 text-purple-600" />
                    </div>
                    <div>
                      <p className="text-sm text-gray-500">Average Earnings</p>
                      <p className="text-2xl font-bold">
                        ₹{totalVolunteers > 0 ? Math.round(totalEarnings / totalVolunteers).toLocaleString() : 0}
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="p-4">
                  <div className="flex items-center gap-3">
                    <div className="p-2 bg-orange-100 rounded-lg">
                      <Award className="w-5 h-5 text-orange-600" />
                    </div>
                    <div>
                      <p className="text-sm text-gray-500">Top Earner</p>
                      <p className="text-xl font-bold truncate">
                        {earnings.length > 0 ? earnings[0].name : "N/A"}
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Search */}
            <Card>
              <CardContent className="p-4">
                <div className="flex gap-4">
                  <div className="flex-1 relative">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                    <input
                      type="text"
                      placeholder="Search volunteers..."
                      value={search}
                      onChange={(e) => setSearch(e.target.value)}
                      className="w-full pl-9 pr-4 py-2 border rounded-lg bg-white/10 border-white/20 text-white placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                    />
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Earnings Table */}
            <Card>
              <CardContent className="p-0">
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead className="bg-gray-50 border-b">
                      <tr>
                        <th className="px-4 py-3 text-left text-xs font-medium text-gray-500">Volunteer</th>
                        <th className="px-4 py-3 text-left text-xs font-medium text-gray-500">Events</th>
                        <th className="px-4 py-3 text-left text-xs font-medium text-gray-500">Hours</th>
                        <th className="px-4 py-3 text-left text-xs font-medium text-gray-500">Earnings</th>
                        <th className="px-4 py-3 text-left text-xs font-medium text-gray-500">Rating</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-200">
                      {filteredEarnings.map((earning) => (
                        <tr key={earning.userId} className="hover:bg-gray-50">
                          <td className="px-4 py-3">
                            <p className="font-medium text-gray-900">{earning.name}</p>
                          </td>
                          <td className="px-4 py-3">
                            <span className="text-sm">{earning.totalEvents}</span>
                          </td>
                          <td className="px-4 py-3">
                            <span className="text-sm">{earning.totalHours}h</span>
                          </td>
                          <td className="px-4 py-3">
                            <span className="font-semibold text-green-600">₹{earning.earnings.toLocaleString()}</span>
                          </td>
                          <td className="px-4 py-3">
                            <Badge variant={earning.reputationScore >= 80 ? "success" : earning.reputationScore >= 60 ? "warning" : "default"}>
                              {earning.reputationScore}
                            </Badge>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>

                {filteredEarnings.length === 0 && (
                  <div className="text-center py-12">
                    <DollarSign className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                    <h3 className="text-lg font-medium text-gray-900">No earnings data found</h3>
                    <p className="text-gray-500 mt-1">
                      {search ? "Try different search terms" : "No volunteers have earned yet"}
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