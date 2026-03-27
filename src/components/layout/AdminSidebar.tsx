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
    <aside className="w-64 bg-slate-900/80 backdrop-blur-xl border-r border-white/10 min-h-screen sticky top-0">
      {/* Logo */}
      <div className="p-4 border-b border-white/10">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 bg-gradient-to-r from-indigo-600 to-purple-600 rounded-lg flex items-center justify-center">
            <Shield className="w-4 h-4 text-white" />
          </div>
          <span className="font-semibold text-white">Admin Panel</span>
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
                "flex items-center gap-3 px-3 py-2 rounded-lg text-sm transition-all duration-200",
                active
                  ? "bg-indigo-600/20 text-indigo-400 border-l-2 border-indigo-500"
                  : "text-gray-400 hover:bg-white/10 hover:text-white"
              )}
            >
              <item.icon className={cn("w-5 h-5", active ? "text-indigo-400" : "text-gray-500")} />
              <span>{item.label}</span>
            </Link>
          );
        })}
      </nav>

      {/* Footer */}
      <div className="absolute bottom-0 left-0 right-0 p-4 border-t border-white/10">
        <button
          onClick={handleSignOut}
          className="flex items-center gap-3 w-full px-3 py-2 rounded-lg text-sm text-red-400 hover:bg-red-500/10 transition-colors"
        >
          <LogOut className="w-5 h-5" />
          <span>Sign Out</span>
        </button>
        <p className="text-xs text-gray-500 text-center mt-4">
          Crewux Admin Panel
        </p>
      </div>
    </aside>
  );
}