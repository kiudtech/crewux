"use client";

import { useSession } from "next-auth/react";
import { useRouter, useParams } from "next/navigation";
import { useEffect, useState } from "react";
import { Navbar } from "@/components/layout/Navbar";
import { DashboardSidebar } from "@/components/layout/DashboardSidebar";
import { Button } from "@/components/ui/Button";
import {
  ArrowLeft,
  Mail,
  Phone,
  MapPin,
  GraduationCap,
  Calendar,
  Award,
  Clock,
  TrendingUp,
  User,
  BookOpen,
  Briefcase,
  Star,
  Download,
  MessageSquare,
  Edit,
  Trash2,
  CheckCircle,
  XCircle
} from "lucide-react";
import toast from "react-hot-toast";

// Card Components
const Card = ({ children, className = "" }: { children: React.ReactNode; className?: string }) => (
  <div className={`bg-white rounded-xl border border-gray-200 shadow-sm ${className}`}>
    {children}
  </div>
);

const CardHeader = ({ children }: { children: React.ReactNode }) => (
  <div className="p-6 border-b border-gray-200">
    {children}
  </div>
);

const CardContent = ({ children, className = "" }: { children: React.ReactNode; className?: string }) => (
  <div className={`p-6 ${className}`}>
    {children}
  </div>
);

const Badge = ({ children, variant = "default" }: { children: React.ReactNode; variant?: "default" | "success" | "warning" | "danger" }) => {
  const variants = {
    default: "bg-gray-100 text-gray-700",
    success: "bg-green-100 text-green-700",
    warning: "bg-yellow-100 text-yellow-700",
    danger: "bg-red-100 text-red-700"
  };
  return (
    <span className={`px-2 py-1 text-xs rounded-full ${variants[variant]}`}>
      {children}
    </span>
  );
};

interface StudentDetails {
  id: string;
  fullName: string;
  email: string;
  phone?: string;
  profilePhoto?: string;
  college?: string;
  course?: string;
  discipline?: string;
  yearOfStudy?: string;
  city?: string;
  state?: string;
  bio?: string;
  emailVerified: boolean;
  phoneVerified: boolean;
  createdAt: string;
  
  // Stats
  reputationScore: number;
  completionRate: number;
  noShowCount: number;
  totalEvents: number;
  totalHours: number;
  totalEarnings: number;
  
  // Skills
  skills: string[];
  interests: string[];
  
  // Work History
  workHistory: {
    id: string;
    eventName: string;
    organizationName: string;
    date: string;
    role: string;
    hours: number;
    earnings: number;
    status: string;
    rating?: number;
    feedback?: string;
  }[];
}

export default function StudentDetailsPage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const params = useParams();
  const studentId = params.id as string;
  
  const [student, setStudent] = useState<StudentDetails | null>(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("overview");

  useEffect(() => {
    if (status === "unauthenticated") {
      router.push("/login");
    }
  }, [status, router]);

  useEffect(() => {
    if (studentId) {
      fetchStudentDetails();
    }
  }, [studentId]);

  const fetchStudentDetails = async () => {
    try {
      const res = await fetch(`/api/college/students/${studentId}`);
      if (res.ok) {
        const data = await res.json();
        setStudent(data);
      } else {
        toast.error("Student not found");
        router.push("/college/students");
      }
    } catch (error) {
      console.error("Error fetching student details:", error);
      toast.error("Failed to load student details");
    } finally {
      setLoading(false);
    }
  };

  const downloadReport = () => {
    if (!student) return;
    
    const reportData = {
      "Student Name": student.fullName,
      "Email": student.email,
      "Phone": student.phone || "N/A",
      "College": student.college || "N/A",
      "Course": student.course || "N/A",
      "Discipline": student.discipline || "N/A",
      "Year": student.yearOfStudy || "N/A",
      "Total Events": student.totalEvents,
      "Total Hours": student.totalHours,
      "Total Earnings": `₹${student.totalEarnings}`,
      "Reputation Score": `${student.reputationScore}/100`,
      "Completion Rate": `${student.completionRate}%`,
      "No Shows": student.noShowCount,
      "Joined Date": new Date(student.createdAt).toLocaleDateString()
    };
    
    const report = Object.entries(reportData)
      .map(([key, value]) => `${key}: ${value}`)
      .join("\n");
    
    const blob = new Blob([report], { type: "text/plain" });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `${student.fullName.replace(/\s+/g, '_')}_report.txt`;
    a.click();
    
    toast.success("Report downloaded successfully!");
  };

  const sendMessage = () => {
    toast.success("Message feature coming soon!");
  };

  const verifyStudent = () => {
    toast.success("Student verified successfully!");
  };

  if (status === "loading" || loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div>
      </div>
    );
  }

  if (!student) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-900">Student not found</h2>
          <Button onClick={() => router.push("/college/students")} className="mt-4">
            Back to Students
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      <div className="flex">
        <DashboardSidebar role="COLLEGE" />
        <main className="flex-1 p-6 lg:p-8">
          
          {/* Header with Back Button */}
          <div className="flex items-center justify-between mb-6">
            <Button 
              variant="outline" 
              onClick={() => router.push("/college/students")}
              className="flex items-center gap-2"
            >
              <ArrowLeft className="w-4 h-4" />
              Back to Students
            </Button>
            
            <div className="flex gap-2">
              <Button variant="outline" onClick={sendMessage}>
                <MessageSquare className="w-4 h-4 mr-2" />
                Message
              </Button>
              <Button variant="outline" onClick={downloadReport}>
                <Download className="w-4 h-4 mr-2" />
                Download Report
              </Button>
              {!student.emailVerified && (
                <Button onClick={verifyStudent}>
                  <CheckCircle className="w-4 h-4 mr-2" />
                  Verify Student
                </Button>
              )}
            </div>
          </div>

          {/* Student Profile Header */}
          <Card className="mb-6">
            <CardContent className="p-6">
              <div className="flex flex-col md:flex-row items-start gap-6">
                {/* Profile Photo */}
                <div className="w-24 h-24 md:w-32 md:h-32 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-full flex items-center justify-center text-white text-4xl md:text-5xl font-bold shadow-lg">
                  {student.profilePhoto ? (
                    <img 
                      src={student.profilePhoto} 
                      alt={student.fullName}
                      className="w-full h-full rounded-full object-cover"
                    />
                  ) : (
                    student.fullName.charAt(0).toUpperCase()
                  )}
                </div>

                {/* Basic Info */}
                <div className="flex-1">
                  <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                    <div>
                      <h1 className="text-2xl md:text-3xl font-bold text-gray-900">
                        {student.fullName}
                      </h1>
                      <p className="text-gray-500 text-lg">{student.college || "College not specified"}</p>
                    </div>
                    
                    {/* Status Badges */}
                    <div className="flex gap-2">
                      {student.emailVerified ? (
                        <Badge variant="success">Email Verified</Badge>
                      ) : (
                        <Badge variant="warning">Email Pending</Badge>
                      )}
                      {student.phoneVerified ? (
                        <Badge variant="success">Phone Verified</Badge>
                      ) : (
                        <Badge variant="warning">Phone Pending</Badge>
                      )}
                    </div>
                  </div>

                  {/* Contact Info */}
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-4">
                    <div className="flex items-center gap-2 text-sm text-gray-600">
                      <Mail className="w-4 h-4 text-gray-400" />
                      <span>{student.email}</span>
                    </div>
                    {student.phone && (
                      <div className="flex items-center gap-2 text-sm text-gray-600">
                        <Phone className="w-4 h-4 text-gray-400" />
                        <span>{student.phone}</span>
                      </div>
                    )}
                    <div className="flex items-center gap-2 text-sm text-gray-600">
                      <MapPin className="w-4 h-4 text-gray-400" />
                      <span>{student.city || "N/A"}, {student.state || "N/A"}</span>
                    </div>
                    <div className="flex items-center gap-2 text-sm text-gray-600">
                      <Calendar className="w-4 h-4 text-gray-400" />
                      <span>Joined {new Date(student.createdAt).toLocaleDateString()}</span>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Stats Cards */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
            <Card>
              <CardContent className="p-4">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-blue-100 rounded-lg">
                    <Award className="w-5 h-5 text-blue-600" />
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Reputation</p>
                    <p className="text-xl font-bold text-blue-600">{student.reputationScore}</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-4">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-green-100 rounded-lg">
                    <CheckCircle className="w-5 h-5 text-green-600" />
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Completion</p>
                    <p className="text-xl font-bold text-green-600">{student.completionRate}%</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-4">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-red-100 rounded-lg">
                    <XCircle className="w-5 h-5 text-red-600" />
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">No Shows</p>
                    <p className="text-xl font-bold text-red-600">{student.noShowCount}</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-4">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-purple-100 rounded-lg">
                    <Briefcase className="w-5 h-5 text-purple-600" />
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Total Events</p>
                    <p className="text-xl font-bold text-purple-600">{student.totalEvents}</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Tabs Navigation */}
          <div className="border-b border-gray-200 mb-6">
            <nav className="flex gap-6">
              <button
                onClick={() => setActiveTab("overview")}
                className={`pb-3 px-1 text-sm font-medium transition-colors relative ${
                  activeTab === "overview"
                    ? "text-indigo-600 border-b-2 border-indigo-600"
                    : "text-gray-500 hover:text-gray-700"
                }`}
              >
                Overview
              </button>
              <button
                onClick={() => setActiveTab("academics")}
                className={`pb-3 px-1 text-sm font-medium transition-colors relative ${
                  activeTab === "academics"
                    ? "text-indigo-600 border-b-2 border-indigo-600"
                    : "text-gray-500 hover:text-gray-700"
                }`}
              >
                Academics
              </button>
              <button
                onClick={() => setActiveTab("work")}
                className={`pb-3 px-1 text-sm font-medium transition-colors relative ${
                  activeTab === "work"
                    ? "text-indigo-600 border-b-2 border-indigo-600"
                    : "text-gray-500 hover:text-gray-700"
                }`}
              >
                Work History
              </button>
              <button
                onClick={() => setActiveTab("skills")}
                className={`pb-3 px-1 text-sm font-medium transition-colors relative ${
                  activeTab === "skills"
                    ? "text-indigo-600 border-b-2 border-indigo-600"
                    : "text-gray-500 hover:text-gray-700"
                }`}
              >
                Skills & Interests
              </button>
            </nav>
          </div>

          {/* Tab Content */}
          <div className="space-y-6">
            {/* Overview Tab */}
            {activeTab === "overview" && (
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <Card>
                  <CardHeader>
                    <h3 className="text-lg font-semibold">Performance Summary</h3>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div>
                      <div className="flex justify-between text-sm mb-1">
                        <span className="text-gray-600">Event Completion</span>
                        <span className="font-medium">{student.completionRate}%</span>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-2">
                        <div 
                          className="bg-green-600 h-2 rounded-full" 
                          style={{ width: `${student.completionRate}%` }}
                        ></div>
                      </div>
                    </div>
                    
                    <div className="grid grid-cols-2 gap-4 pt-4">
                      <div className="text-center p-3 bg-gray-50 rounded-lg">
                        <p className="text-2xl font-bold text-indigo-600">{student.totalHours}</p>
                        <p className="text-xs text-gray-500">Total Hours</p>
                      </div>
                      <div className="text-center p-3 bg-gray-50 rounded-lg">
                        <p className="text-2xl font-bold text-green-600">₹{student.totalEarnings}</p>
                        <p className="text-xs text-gray-500">Total Earnings</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <h3 className="text-lg font-semibold">Recent Activity</h3>
                  </CardHeader>
                  <CardContent>
                    {student.workHistory && student.workHistory.length > 0 ? (
                      <div className="space-y-3">
                        {student.workHistory.slice(0, 3).map((work) => (
                          <div key={work.id} className="flex items-start gap-3 p-3 bg-gray-50 rounded-lg">
                            <div className="w-2 h-2 mt-2 bg-green-500 rounded-full"></div>
                            <div className="flex-1">
                              <p className="font-medium text-sm">{work.eventName}</p>
                              <p className="text-xs text-gray-500">{work.organizationName} • {work.hours}h</p>
                            </div>
                            <span className="text-xs text-gray-400">
                              {new Date(work.date).toLocaleDateString()}
                            </span>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <p className="text-gray-500 text-center py-4">No recent activity</p>
                    )}
                  </CardContent>
                </Card>
              </div>
            )}

            {/* Academics Tab */}
            {activeTab === "academics" && (
              <Card>
                <CardHeader>
                  <h3 className="text-lg font-semibold flex items-center gap-2">
                    <GraduationCap className="w-5 h-5" />
                    Academic Information
                  </h3>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <p className="text-sm text-gray-500">College</p>
                      <p className="font-medium text-gray-900">{student.college || "N/A"}</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-500">Course</p>
                      <p className="font-medium text-gray-900">{student.course || "N/A"}</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-500">Discipline/Branch</p>
                      <p className="font-medium text-gray-900">{student.discipline || "N/A"}</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-500">Year of Study</p>
                      <p className="font-medium text-gray-900">{student.yearOfStudy || "N/A"}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Work History Tab */}
            {activeTab === "work" && (
              <Card>
                <CardHeader>
                  <h3 className="text-lg font-semibold flex items-center gap-2">
                    <Briefcase className="w-5 h-5" />
                    Work History
                  </h3>
                </CardHeader>
                <CardContent>
                  {student.workHistory && student.workHistory.length > 0 ? (
                    <div className="space-y-4">
                      {student.workHistory.map((work) => (
                        <div key={work.id} className="border rounded-lg p-4 hover:shadow-sm transition">
                          <div className="flex justify-between items-start mb-3">
                            <div>
                              <h4 className="font-semibold text-gray-900">{work.eventName}</h4>
                              <p className="text-sm text-gray-600">{work.organizationName}</p>
                            </div>
                            <Badge variant={
                              work.status === "completed" ? "success" :
                              work.status === "ongoing" ? "warning" : "default"
                            }>
                              {work.status}
                            </Badge>
                          </div>
                          
                          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                            <div>
                              <p className="text-gray-500">Role</p>
                              <p className="font-medium">{work.role}</p>
                            </div>
                            <div>
                              <p className="text-gray-500">Date</p>
                              <p className="font-medium">{new Date(work.date).toLocaleDateString()}</p>
                            </div>
                            <div>
                              <p className="text-gray-500">Hours</p>
                              <p className="font-medium">{work.hours}h</p>
                            </div>
                            <div>
                              <p className="text-gray-500">Earnings</p>
                              <p className="font-medium text-green-600">₹{work.earnings}</p>
                            </div>
                          </div>

                          {work.rating && (
                            <div className="mt-3 flex items-center gap-2">
                              <div className="flex">
                                {[...Array(5)].map((_, i) => (
                                  <Star
                                    key={i}
                                    className={`w-4 h-4 ${
                                      i < work.rating! 
                                        ? "text-yellow-400 fill-yellow-400" 
                                        : "text-gray-300"
                                    }`}
                                  />
                                ))}
                              </div>
                              {work.feedback && (
                                <p className="text-sm text-gray-600 ml-2">"{work.feedback}"</p>
                              )}
                            </div>
                          )}
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="text-center py-12">
                      <Briefcase className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                      <h3 className="text-lg font-medium text-gray-900">No work history</h3>
                      <p className="text-gray-500 mt-1">This student hasn't participated in any events yet</p>
                    </div>
                  )}
                </CardContent>
              </Card>
            )}

            {/* Skills Tab */}
            {activeTab === "skills" && (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <Card>
                  <CardHeader>
                    <h3 className="text-lg font-semibold">Skills</h3>
                  </CardHeader>
                  <CardContent>
                    {student.skills && student.skills.length > 0 ? (
                      <div className="flex flex-wrap gap-2">
                        {student.skills.map((skill, index) => (
                          <span
                            key={index}
                            className="px-3 py-1 bg-indigo-100 text-indigo-700 rounded-full text-sm"
                          >
                            {skill}
                          </span>
                        ))}
                      </div>
                    ) : (
                      <p className="text-gray-500 text-center py-4">No skills added</p>
                    )}
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <h3 className="text-lg font-semibold">Interests</h3>
                  </CardHeader>
                  <CardContent>
                    {student.interests && student.interests.length > 0 ? (
                      <div className="flex flex-wrap gap-2">
                        {student.interests.map((interest, index) => (
                          <span
                            key={index}
                            className="px-3 py-1 bg-purple-100 text-purple-700 rounded-full text-sm"
                          >
                            {interest}
                          </span>
                        ))}
                      </div>
                    ) : (
                      <p className="text-gray-500 text-center py-4">No interests added</p>
                    )}
                  </CardContent>
                </Card>
              </div>
            )}
          </div>
        </main>
      </div>
    </div>
  );
}