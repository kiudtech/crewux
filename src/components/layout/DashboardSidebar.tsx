"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import {
  LayoutDashboard, User, Calendar, Users, Settings,
  BarChart3, Shield, Building2, GraduationCap, Award,
  FileText, Bell, Heart, CheckCircle, DollarSign, TrendingUp
} from "lucide-react";

interface SidebarItem {
  label: string;
  href: string;
  icon: React.ReactNode;
}

const sidebarItems: Record<string, SidebarItem[]> = {
  VOLUNTEER: [
    { label: "Dashboard", href: "/dashboard/volunteer", icon: <LayoutDashboard className="w-5 h-5" /> },
    { label: "My Profile", href: "/dashboard/volunteer/profile", icon: <User className="w-5 h-5" /> },
    { label: "Browse Events", href: "/dashboard/volunteer/events", icon: <Calendar className="w-5 h-5" /> },
    { label: "My Applications", href: "/dashboard/volunteer/applications", icon: <FileText className="w-5 h-5" /> },
    { label: "Earnings", href: "/dashboard/volunteer/earnings", icon: <DollarSign className="w-5 h-5" /> },
    { label: "Analytics", href: "/dashboard/volunteer/analytics", icon: <BarChart3 className="w-5 h-5" /> },
    { label: "Settings", href: "/dashboard/volunteer/settings", icon: <Settings className="w-5 h-5" /> },
  ],
  ORGANIZATION: [
    { label: "Dashboard", href: "/dashboard/organization", icon: <LayoutDashboard className="w-5 h-5" /> },
    { label: "Profile", href: "/dashboard/organization/profile", icon: <Building2 className="w-5 h-5" /> },
    { label: "My Events", href: "/dashboard/organization/events", icon: <Calendar className="w-5 h-5" /> },
    { label: "Applications", href: "/dashboard/organization/applications", icon: <FileText className="w-5 h-5" /> },
    { label: "Analytics", href: "/dashboard/organization/analytics", icon: <BarChart3 className="w-5 h-5" /> },
    { label: "Payments", href: "/dashboard/organization/payments", icon: <DollarSign className="w-5 h-5" /> },
    { label: "Settings", href: "/dashboard/organization/settings", icon: <Settings className="w-5 h-5" /> },
  ],
  COLLEGE: [
    { label: "Dashboard", href: "/dashboard/college", icon: <LayoutDashboard className="w-5 h-5" /> },
    { label: "Profile", href: "/dashboard/college/profile", icon: <GraduationCap className="w-5 h-5" /> },
    { label: "Students", href: "/dashboard/college/students", icon: <Users className="w-5 h-5" /> },
    { label: "Reports", href: "/dashboard/college/reports", icon: <BarChart3 className="w-5 h-5" /> },
    { label: "Settings", href: "/dashboard/college/settings", icon: <Settings className="w-5 h-5" /> },
  ],
  SUPER_ADMIN: [
    { label: "Dashboard", href: "/dashboard/super-admin", icon: <LayoutDashboard className="w-5 h-5" /> },
    { label: "Users", href: "/dashboard/super-admin/users", icon: <Users className="w-5 h-5" /> },
    { label: "Organizations", href: "/dashboard/super-admin/organizations", icon: <Building2 className="w-5 h-5" /> },
    { label: "Events", href: "/dashboard/super-admin/events", icon: <Calendar className="w-5 h-5" /> },
    { label: "Verifications", href: "/dashboard/super-admin/verifications", icon: <Shield className="w-5 h-5" /> },
    { label: "Earnings", href: "/dashboard/super-admin/earnings", icon: <DollarSign className="w-5 h-5" /> },
    { label: "Reports", href: "/dashboard/super-admin/reports", icon: <FileText className="w-5 h-5" /> },
    { label: "Notifications", href: "/dashboard/super-admin/notifications", icon: <Bell className="w-5 h-5" /> },
    { label: "Analytics", href: "/dashboard/super-admin/analytics", icon: <BarChart3 className="w-5 h-5" /> },
    { label: "Settings", href: "/dashboard/super-admin/settings", icon: <Settings className="w-5 h-5" /> },
  ],
};

export function DashboardSidebar({ role }: { role: string }) {
  const pathname = usePathname();
  const items = sidebarItems[role] || sidebarItems.VOLUNTEER;

  return (
    <aside className="w-64 bg-white/10 backdrop-blur-xl border-r border-white/20 min-h-[calc(100vh-4rem)] hidden lg:block">
      <div className="p-4">
        <div className="space-y-1">
          {items.map((item) => {
            const isActive = pathname === item.href || pathname?.startsWith(item.href + "/");
            return (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  "flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all duration-200",
                  isActive
                    ? "bg-indigo-600/20 text-indigo-400 border-l-4 border-indigo-500"
                    : "text-gray-400 hover:bg-white/10 hover:text-white"
                )}
              >
                {item.icon}
                {item.label}
              </Link>
            );
          })}
        </div>
      </div>
    </aside>
  );
}