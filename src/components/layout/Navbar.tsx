"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";  // ✅ ADD THIS
import { useSession, signOut } from "next-auth/react";
import { useState } from "react";
import { Menu, X, ChevronDown, User, LogOut, LayoutDashboard } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { ROLE_LABELS } from "@/lib/constants";

export function Navbar() {
  const { data: session, status } = useSession();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const pathname = usePathname();  // ✅ GET CURRENT PATH

  // ✅ HIDE NAVBAR ON SUPER-ADMIN PAGES
  const isSuperAdminPage = pathname?.startsWith("/dashboard/super-admin");
  
  if (isSuperAdminPage) {
    return null;  // ✅ NO NAVBAR ON ADMIN PAGES
  }

  const getDashboardLink = () => {
    if (!session?.user?.role) return "/dashboard";
    const role = session.user.role.toLowerCase().replace("_", "-");
    return `/dashboard/${role}`;
  };

  return (
    <nav className="bg-white border-b border-gray-200 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          {/* Logo */}
          <div className="flex items-center">
            <Link href="/" className="flex items-center gap-2">
              <div className="w-8 h-8 bg-indigo-600 rounded-lg flex items-center justify-center">
                <span className="text-white font-bold text-sm">CW</span>
              </div>
              <span className="text-xl font-bold text-gray-900">
                <span className="text-indigo-600"> Crewux</span>
              </span>
            </Link>
          </div>

          {/* Desktop Nav */}
          <div className="hidden md:flex items-center gap-6">
            <Link href="/about" className="text-sm text-gray-600 hover:text-indigo-600 transition-colors">
              About
            </Link>
            <Link href="/events" className="text-sm text-gray-600 hover:text-indigo-600 transition-colors">
              Events
            </Link>
            <Link href="/impact" className="text-sm text-gray-600 hover:text-indigo-600 transition-colors">
              Impact
            </Link>

            {status === "authenticated" && session?.user ? (
              <div className="relative">
                <button
                  onClick={() => setDropdownOpen(!dropdownOpen)}
                  className="flex items-center gap-2 px-3 py-2 rounded-lg hover:bg-gray-100 transition-colors"
                >
                  <div className="w-8 h-8 bg-indigo-100 rounded-full flex items-center justify-center">
                    <User className="w-4 h-4 text-indigo-600" />
                  </div>
                  <span className="text-sm font-medium text-gray-700">
                    {session.user.name || session.user.email?.split("@")[0]}
                  </span>
                  <ChevronDown className="w-4 h-4 text-gray-400" />
                </button>

                {dropdownOpen && (
                  <div className="absolute right-0 mt-2 w-56 bg-white rounded-lg shadow-lg border border-gray-200 py-1 z-50">
                    <div className="px-4 py-2 border-b border-gray-100">
                      <p className="text-sm font-medium text-gray-900">{session.user.email}</p>
                      <p className="text-xs text-indigo-600">{ROLE_LABELS[session.user.role] || session.user.role}</p>
                    </div>
                    <Link
                      href={getDashboardLink()}
                      className="flex items-center gap-2 px-4 py-2 text-sm text-gray-700 hover:bg-gray-50"
                      onClick={() => setDropdownOpen(false)}
                    >
                      <LayoutDashboard className="w-4 h-4" />
                      Dashboard
                    </Link>
                    <Link
                      href="/profile"
                      className="flex items-center gap-2 px-4 py-2 text-sm text-gray-700 hover:bg-gray-50"
                      onClick={() => setDropdownOpen(false)}
                    >
                      <User className="w-4 h-4" />
                      Profile
                    </Link>
                    <button
                      onClick={() => signOut({ callbackUrl: "/" })}
                      className="flex items-center gap-2 w-full px-4 py-2 text-sm text-red-600 hover:bg-red-50"
                    >
                      <LogOut className="w-4 h-4" />
                      Sign Out
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <div className="flex items-center gap-3">
                <Link href="/login">
                  <Button variant="ghost" size="sm">Log In</Button>
                </Link>
                <Link href="/register">
                  <Button size="sm">Get Started</Button>
                </Link>
              </div>
            )}
          </div>

          {/* Mobile Hamburger */}
          <div className="md:hidden flex items-center">
            <button onClick={() => setMobileOpen(!mobileOpen)} className="p-2 text-gray-600">
              {mobileOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      {mobileOpen && (
        <div className="md:hidden bg-white border-t border-gray-200 px-4 py-4 space-y-3">
          <Link href="/about" className="block text-sm text-gray-600 hover:text-indigo-600">About</Link>
          <Link href="/events" className="block text-sm text-gray-600 hover:text-indigo-600">Events</Link>
          <Link href="/impact" className="block text-sm text-gray-600 hover:text-indigo-600">Impact</Link>
          {status === "authenticated" ? (
            <>
              <Link href={getDashboardLink()} className="block text-sm text-gray-600 hover:text-indigo-600">Dashboard</Link>
              <button onClick={() => signOut({ callbackUrl: "/" })} className="block text-sm text-red-600">Sign Out</button>
            </>
          ) : (
            <div className="flex gap-3 pt-2">
              <Link href="/login"><Button variant="outline" size="sm">Log In</Button></Link>
              <Link href="/register"><Button size="sm">Get Started</Button></Link>
            </div>
          )}
        </div>
      )}
    </nav>
  );
}