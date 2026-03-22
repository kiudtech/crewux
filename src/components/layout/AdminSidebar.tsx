"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  Users,
  Building2,
  Calendar,
  CheckCircle,
  DollarSign,
  FileText,
  Settings,
  Bell,
  Shield,
  LogOut
} from "lucide-react";
import { cn } from "@/lib/utils";
import { signOut } from "next-auth/react";

// ✅ CHANGE: /dashboard/admin to /dashboard/super-admin
const menuItems = [
  { href: "/dashboard/super-admin", label: "Dashboard", icon: LayoutDashboard },
  { href: "/dashboard/super-admin/users", label: "Users", icon: Users },
  { href: "/dashboard/super-admin/organizations", label: "Organizations", icon: Building2 },
  { href: "/dashboard/super-admin/events", label: "Events", icon: Calendar },
  { href: "/dashboard/super-admin/verifications", label: "Verifications", icon: CheckCircle },
  { href: "/dashboard/super-admin/earnings", label: "Earnings", icon: DollarSign },
  { href: "/dashboard/super-admin/reports", label: "Reports", icon: FileText },
  { href: "/dashboard/super-admin/notifications", label: "Notifications", icon: Bell },
  { href: "/dashboard/super-admin/settings", label: "Settings", icon: Settings },
];

export function AdminSidebar() {
  const pathname = usePathname();

  const isActive = (href: string) => {
    if (href === "/dashboard/super-admin") {
      return pathname === href;
    }
    return pathname.startsWith(href);
  };

  const handleSignOut = async () => {
    await signOut({ callbackUrl: "/login" });
  };

  return (
    <aside className="w-64 bg-white border-r border-gray-200 min-h-screen sticky top-0">
      {/* Logo */}
      <div className="p-4 border-b border-gray-200">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 bg-indigo-600 rounded-lg flex items-center justify-center">
            <Shield className="w-4 h-4 text-white" />
          </div>
          <span className="font-semibold text-gray-900">Admin Panel</span>
        </div>
      </div>

      {/* Navigation */}
      <nav className="p-4 space-y-1">
        {menuItems.map((item) => {
          const active = isActive(item.href);
          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "flex items-center gap-3 px-3 py-2 rounded-lg text-sm transition-colors",
                active
                  ? "bg-indigo-50 text-indigo-600"
                  : "text-gray-600 hover:bg-gray-100"
              )}
            >
              <item.icon className={cn("w-5 h-5", active ? "text-indigo-600" : "text-gray-400")} />
              <span>{item.label}</span>
            </Link>
          );
        })}
      </nav>

      {/* Footer */}
      <div className="absolute bottom-0 left-0 right-0 p-4 border-t border-gray-200">
        <button
          onClick={handleSignOut}
          className="flex items-center gap-3 w-full px-3 py-2 rounded-lg text-sm text-red-600 hover:bg-red-50 transition-colors"
        >
          <LogOut className="w-5 h-5" />
          <span>Sign Out</span>
        </button>
        <p className="text-xs text-gray-400 text-center mt-4">
          Crewux Admin Panel
        </p>
      </div>
    </aside>
  );
}