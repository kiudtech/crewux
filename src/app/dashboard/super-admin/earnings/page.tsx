// app/dashboard/super-admin/earnings/page.tsx
"use client";

import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import {
  DollarSign,
  Users,
  TrendingUp,
  Award,
  Search,
  Calendar,
  Download,
  Filter,
  Loader2,
  Star,
  Clock,
  ChevronRight
} from "lucide-react";
import toast from "react-hot-toast";

interface EarningRecord {
  id: string;
  volunteerName: string;
  volunteerEmail: string;
  totalEarnings: number;
  totalEvents: number;
  totalHours: number;
  rating: number;
  lastPayout: string;
}

export default function SuperAdminEarningsPage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [earnings, setEarnings] = useState<EarningRecord[]>([]);
  const [search, setSearch] = useState("");
  const [dateRange, setDateRange] = useState("all");

  useEffect(() => {
    if (status === "unauthenticated") router.push("/login");
    if (session?.user?.role !== "SUPER_ADMIN") router.push("/dashboard");
  }, [status, session, router]);

  useEffect(() => {
    if (session?.user?.role === "SUPER_ADMIN") {
      fetchEarningsData();
    }
  }, [session]);

  const fetchEarningsData = async () => {
    try {
      const res = await fetch("/api/admin/earnings");
      if (res.ok) {
        const data = await res.json();
        setEarnings(data.earnings || []);
      } else {
        toast.error("Failed to fetch earnings data");
      }
    } catch (error) {
      console.error("Error fetching earnings:", error);
      toast.error("Failed to fetch earnings data");
    } finally {
      setLoading(false);
    }
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    }).format(amount);
  };

  const stats = {
    totalEarnings: earnings.reduce((sum, e) => sum + e.totalEarnings, 0),
    totalVolunteers: earnings.length,
    averageEarnings: earnings.length > 0 ? earnings.reduce((sum, e) => sum + e.totalEarnings, 0) / earnings.length : 0,
    topEarner: earnings.length > 0 ? earnings.reduce((max, e) => e.totalEarnings > max.totalEarnings ? e : max, earnings[0]) : null
  };

  const filteredEarnings = earnings.filter(earning => 
    earning.volunteerName.toLowerCase().includes(search.toLowerCase()) ||
    earning.volunteerEmail.toLowerCase().includes(search.toLowerCase())
  );

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
                <span className="text-gray-900 font-medium">Earnings</span>
              </div>
              <h1 className="text-2xl lg:text-3xl font-bold text-gray-900">Earnings</h1>
              <p className="text-gray-500 mt-1">Track volunteer earnings and platform payouts</p>
            </div>
            <div className="flex gap-3">
              <Button variant="outline" className="border-gray-200 text-gray-700 hover:bg-gray-50">
                <Download className="w-4 h-4 mr-2" />
                Export Report
              </Button>
              <Button className="bg-indigo-600 hover:bg-indigo-700 text-white shadow-sm">
                <Calendar className="w-4 h-4 mr-2" />
                This Month
              </Button>
            </div>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
          <Card className="p-5 border border-gray-100 shadow-sm bg-white">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-500">Total Earnings</p>
                <p className="text-2xl font-bold text-gray-900">{formatCurrency(stats.totalEarnings)}</p>
                <p className="text-xs text-green-600 mt-1">+12% from last month</p>
              </div>
              <div className="w-10 h-10 bg-green-50 rounded-lg flex items-center justify-center">
                <DollarSign className="w-5 h-5 text-green-600" />
              </div>
            </div>
          </Card>
          
          <Card className="p-5 border border-gray-100 shadow-sm bg-white">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-500">Total Volunteers</p>
                <p className="text-2xl font-bold text-gray-900">{stats.totalVolunteers}</p>
                <p className="text-xs text-gray-500 mt-1">Active earners</p>
              </div>
              <div className="w-10 h-10 bg-blue-50 rounded-lg flex items-center justify-center">
                <Users className="w-5 h-5 text-blue-600" />
              </div>
            </div>
          </Card>
          
          <Card className="p-5 border border-gray-100 shadow-sm bg-white">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-500">Average Earnings</p>
                <p className="text-2xl font-bold text-gray-900">{formatCurrency(stats.averageEarnings)}</p>
                <p className="text-xs text-gray-500 mt-1">Per volunteer</p>
              </div>
              <div className="w-10 h-10 bg-purple-50 rounded-lg flex items-center justify-center">
                <TrendingUp className="w-5 h-5 text-purple-600" />
              </div>
            </div>
          </Card>
          
          <Card className="p-5 border border-gray-100 shadow-sm bg-white">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-500">Top Earner</p>
                <p className="text-lg font-bold text-gray-900 truncate">
                  {stats.topEarner ? stats.topEarner.volunteerName.split(' ')[0] : 'N/A'}
                </p>
                <p className="text-xs font-medium text-green-600 mt-1">
                  {stats.topEarner ? formatCurrency(stats.topEarner.totalEarnings) : 'No data'}
                </p>
              </div>
              <div className="w-10 h-10 bg-amber-50 rounded-lg flex items-center justify-center">
                <Award className="w-5 h-5 text-amber-600" />
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
                placeholder="Search volunteers by name or email..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-full pl-9 pr-4 py-2 border border-gray-200 rounded-lg text-gray-900 placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
              />
            </div>
            <div className="flex gap-2">
              <div className="relative">
                <Filter className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                <select
                  value={dateRange}
                  onChange={(e) => setDateRange(e.target.value)}
                  className="pl-9 pr-8 py-2 border border-gray-200 rounded-lg text-gray-700 bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
                >
                  <option value="all">All Time</option>
                  <option value="month">This Month</option>
                  <option value="quarter">Last 3 Months</option>
                  <option value="year">This Year</option>
                </select>
              </div>
            </div>
          </div>
        </Card>

        {/* Earnings Table */}
        <Card className="border border-gray-100 shadow-sm bg-white overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50 border-b border-gray-200">
                <tr>
                  <th className="text-left py-4 px-5 text-sm font-semibold text-gray-700">Volunteer</th>
                  <th className="text-left py-4 px-5 text-sm font-semibold text-gray-700">Events</th>
                  <th className="text-left py-4 px-5 text-sm font-semibold text-gray-700">Hours</th>
                  <th className="text-left py-4 px-5 text-sm font-semibold text-gray-700">Earnings</th>
                  <th className="text-left py-4 px-5 text-sm font-semibold text-gray-700">Rating</th>
                  <th className="text-left py-4 px-5 text-sm font-semibold text-gray-700">Last Payout</th>
                  <th className="text-left py-4 px-5 text-sm font-semibold text-gray-700"></th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {filteredEarnings.length > 0 ? (
                  filteredEarnings.map((earning) => (
                    <tr key={earning.id} className="hover:bg-gray-50 transition-all">
                      <td className="py-4 px-5">
                        <div>
                          <p className="font-medium text-gray-900">{earning.volunteerName}</p>
                          <p className="text-sm text-gray-500">{earning.volunteerEmail}</p>
                        </div>
                      </td>
                      <td className="py-4 px-5">
                        <div className="flex items-center gap-1">
                          <Calendar className="w-4 h-4 text-gray-400" />
                          <span className="text-gray-700">{earning.totalEvents}</span>
                        </div>
                      </td>
                      <td className="py-4 px-5">
                        <div className="flex items-center gap-1">
                          <Clock className="w-4 h-4 text-gray-400" />
                          <span className="text-gray-700">{earning.totalHours}</span>
                        </div>
                      </td>
                      <td className="py-4 px-5">
                        <p className="font-semibold text-green-600">{formatCurrency(earning.totalEarnings)}</p>
                      </td>
                      <td className="py-4 px-5">
                        <div className="flex items-center gap-1">
                          <Star className="w-4 h-4 text-amber-400 fill-amber-400" />
                          <span className="text-gray-700 font-medium">{earning.rating.toFixed(1)}</span>
                        </div>
                      </td>
                      <td className="py-4 px-5">
                        <p className="text-sm text-gray-500">
                          {new Date(earning.lastPayout).toLocaleDateString('en-IN', {
                            day: 'numeric',
                            month: 'short',
                            year: 'numeric'
                          })}
                        </p>
                      </td>
                      <td className="py-4 px-5">
                        <Button
                          variant="ghost"
                          size="sm"
                          className="text-indigo-600 hover:text-indigo-700"
                          onClick={() => router.push(`/dashboard/super-admin/users/${earning.id}`)}
                        >
                          View Details
                          <ChevronRight className="w-4 h-4 ml-1" />
                        </Button>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan={7} className="py-12 text-center">
                      <div className="flex flex-col items-center">
                        <DollarSign className="w-12 h-12 text-gray-300 mb-4" />
                        <h3 className="text-lg font-medium text-gray-900">No earnings data found</h3>
                        <p className="text-gray-500 mt-1">No volunteers have earned yet</p>
                      </div>
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </Card>

        {/* Summary Section */}
        {filteredEarnings.length > 0 && (
          <Card className="mt-6 p-5 border border-gray-100 shadow-sm bg-white">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <h3 className="font-semibold text-gray-900">Payout Summary</h3>
                <p className="text-sm text-gray-500 mt-1">Total payable amount to volunteers</p>
              </div>
              <div className="flex gap-4">
                <div className="text-right">
                  <p className="text-sm text-gray-500">Total Pending</p>
                  <p className="text-xl font-bold text-amber-600">{formatCurrency(stats.totalEarnings)}</p>
                </div>
                <Button className="bg-green-600 hover:bg-green-700 text-white">
                  Process Payouts
                </Button>
              </div>
            </div>
          </Card>
        )}
      </div>
    </div>
  );
}