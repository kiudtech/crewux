"use client";

import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { Select } from "@/components/ui/Select";
import { Input } from "@/components/ui/Input";
import {
  FileText,
  Download,
  Users,
  Building2,
  Calendar,
  DollarSign,
  TrendingUp,
  Eye,
  Mail,
  Printer
} from "lucide-react";
import toast from "react-hot-toast";

export default function SuperAdminReportsPage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [reportType, setReportType] = useState("users");
  const [dateRange, setDateRange] = useState("month");
  const [format, setFormat] = useState("json");
  const [generating, setGenerating] = useState(false);

  useEffect(() => {
    if (status === "unauthenticated") {
      router.push("/login");
    }
    if (session?.user?.role !== "SUPER_ADMIN") {
      router.push("/dashboard");
    }
    setLoading(false);
  }, [status, session, router]);

  const generateReport = async () => {
    setGenerating(true);
    try {
      const res = await fetch(`/api/admin/reports?type=${reportType}&format=${format}`);
      
      if (format === "csv") {
        const blob = await res.blob();
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement("a");
        a.href = url;
        a.download = `${reportType}_report_${new Date().toISOString().split("T")[0]}.csv`;
        a.click();
        toast.success("Report downloaded!");
      } else {
        const data = await res.json();
        console.log(data);
        toast.success("Report generated!");
      }
    } catch (error) {
      toast.error("Failed to generate report");
    } finally {
      setGenerating(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div>
      </div>
    );
  }

  const reportTypes = [
    { value: "users", label: "Users Report", icon: Users, color: "bg-blue-100 text-blue-600" },
    { value: "organizations", label: "Organizations Report", icon: Building2, color: "bg-purple-100 text-purple-600" },
    { value: "events", label: "Events Report", icon: Calendar, color: "bg-green-100 text-green-600" },
    { value: "earnings", label: "Earnings Report", icon: DollarSign, color: "bg-orange-100 text-orange-600" }
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Reports</h1>
        <p className="text-sm text-gray-500 mt-1">
          Generate and download reports for all platform activities
        </p>
      </div>

      {/* Report Type Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        {reportTypes.map((type) => (
          <Card
            key={type.value}
            className={`cursor-pointer transition-all hover:shadow-md ${
              reportType === type.value ? "ring-2 ring-indigo-500" : ""
            }`}
            onClick={() => setReportType(type.value)}
          >
            <CardContent className="p-4 text-center">
              <div className={`w-12 h-12 ${type.color} rounded-lg flex items-center justify-center mx-auto mb-3`}>
                <type.icon className="w-6 h-6" />
              </div>
              <h3 className="font-medium text-gray-900">{type.label}</h3>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Generate Report Form */}
      <Card>
        <CardHeader>
          <h2 className="text-lg font-semibold">Generate Custom Report</h2>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Report Type
              </label>
              <select
                value={reportType}
                onChange={(e) => setReportType(e.target.value)}
                className="w-full px-3 py-2 border rounded-lg bg-white"
              >
                <option value="users">Users Report</option>
                <option value="organizations">Organizations Report</option>
                <option value="events">Events Report</option>
                <option value="earnings">Earnings Report</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Date Range
              </label>
              <select
                value={dateRange}
                onChange={(e) => setDateRange(e.target.value)}
                className="w-full px-3 py-2 border rounded-lg bg-white"
              >
                <option value="week">Last 7 Days</option>
                <option value="month">Last 30 Days</option>
                <option value="quarter">Last 3 Months</option>
                <option value="year">Last 12 Months</option>
                <option value="all">All Time</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Format
              </label>
              <select
                value={format}
                onChange={(e) => setFormat(e.target.value)}
                className="w-full px-3 py-2 border rounded-lg bg-white"
              >
                <option value="json">JSON</option>
                <option value="csv">CSV</option>
              </select>
            </div>
          </div>

          <div className="flex justify-end gap-3 pt-4">
            <Button variant="outline">
              <Eye className="w-4 h-4 mr-2" />
              Preview
            </Button>
            <Button onClick={generateReport} isLoading={generating}>
              <Download className="w-4 h-4 mr-2" />
              Generate Report
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Recent Reports */}
      <Card>
        <CardHeader>
          <h2 className="text-lg font-semibold">Recent Reports</h2>
        </CardHeader>
        <CardContent className="p-0">
          <div className="divide-y divide-gray-200">
            {[
              { name: "Users_Report_March_2026", type: "Users", date: "15 Mar 2026", size: "245 KB" },
              { name: "Organizations_Report_March_2026", type: "Organizations", date: "14 Mar 2026", size: "189 KB" },
              { name: "Events_Report_Feb_2026", type: "Events", date: "28 Feb 2026", size: "312 KB" }
            ].map((report, i) => (
              <div key={i} className="flex items-center justify-between p-4 hover:bg-gray-50">
                <div className="flex items-center gap-3">
                  <FileText className="w-5 h-5 text-gray-400" />
                  <div>
                    <p className="font-medium text-gray-900">{report.name}</p>
                    <p className="text-xs text-gray-500">{report.type} • {report.date} • {report.size}</p>
                  </div>
                </div>
                <div className="flex gap-1">
                  <Button variant="ghost" size="sm">
                    <Download className="w-4 h-4" />
                  </Button>
                  <Button variant="ghost" size="sm">
                    <Mail className="w-4 h-4" />
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}