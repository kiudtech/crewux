"use client";

import { useState, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import Link from "next/link";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { Button } from "@/components/ui/Button";
import { Users, Building2, GraduationCap } from "lucide-react";
import { VolunteerRegisterForm } from "./VolunteerRegisterForm";
import { OrganizationRegisterForm } from "./OrganizationRegisterForm";
import { CollegeRegisterForm } from "./CollegeRegisterForm";

const roleOptions = [
  { value: "volunteer", label: "Volunteer", icon: <Users className="w-6 h-6" />, desc: "Find events & build your reputation" },
  { value: "organization", label: "Organization", icon: <Building2 className="w-6 h-6" />, desc: "Post events & find volunteers" },
  { value: "college", label: "College / School", icon: <GraduationCap className="w-6 h-6" />, desc: "Track student volunteering" },
];

function RegisterContent() {
  const searchParams = useSearchParams();
  const initialRole = searchParams.get("role") || "";
  const [selectedRole, setSelectedRole] = useState(initialRole);

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      <div className="max-w-2xl mx-auto px-4 py-12">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Create Your Account</h1>
          <p className="text-gray-600">Join India&apos;s largest event & volunteer workforce network</p>
        </div>

        {/* Role Selection */}
        {!selectedRole && (
          <div className="space-y-4">
            <h2 className="text-lg font-semibold text-gray-800 text-center mb-6">I want to register as:</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {roleOptions.map((role) => (
                <button
                  key={role.value}
                  onClick={() => setSelectedRole(role.value)}
                  className="flex flex-col items-center p-6 bg-white rounded-xl border-2 border-gray-200 hover:border-indigo-500 hover:shadow-md transition-all duration-200"
                >
                  <div className="w-14 h-14 bg-indigo-100 rounded-full flex items-center justify-center text-indigo-600 mb-3">
                    {role.icon}
                  </div>
                  <span className="font-semibold text-gray-900">{role.label}</span>
                  <span className="text-xs text-gray-500 mt-1 text-center">{role.desc}</span>
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Forms */}
        {selectedRole && (
          <div>
            <button
              onClick={() => setSelectedRole("")}
              className="text-sm text-indigo-600 hover:text-indigo-700 mb-6 inline-flex items-center gap-1"
            >
              &larr; Choose a different role
            </button>

            {selectedRole === "volunteer" && <VolunteerRegisterForm />}
            {selectedRole === "organization" && <OrganizationRegisterForm />}
            {selectedRole === "college" && <CollegeRegisterForm />}
          </div>
        )}

        <p className="text-center text-sm text-gray-600 mt-8">
          Already have an account?{" "}
          <Link href="/login" className="text-indigo-600 font-medium hover:text-indigo-700">
            Sign in
          </Link>
        </p>
      </div>
      <Footer />
    </div>
  );
}

export default function RegisterPage() {
  return (
    <Suspense fallback={<div className="min-h-screen flex items-center justify-center">Loading...</div>}>
      <RegisterContent />
    </Suspense>
  );
}
