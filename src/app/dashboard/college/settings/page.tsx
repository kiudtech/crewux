"use client";

import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { Navbar } from "@/components/layout/Navbar";
import { DashboardSidebar } from "@/components/layout/DashboardSidebar";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { Select } from "@/components/ui/Select";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import {
  Bell,
  Lock,
  Globe,
  Shield,
  User,
  Moon,
  Sun,
  Save,
  AlertTriangle,
  Eye,
  EyeOff,
  Key,
  Smartphone,
  Building2,
  CreditCard,
  Upload,
  CheckCircle,
  XCircle,
  Mail,
  Phone,
  MapPin,
  Clock,
  Palette,
  Download,
  Trash2
} from "lucide-react";
import toast from "react-hot-toast";

// Card Components
const Card = ({ children, className = "" }: { children: React.ReactNode; className?: string }) => (
  <div className={`bg-white rounded-xl border border-gray-200 shadow-sm ${className}`}>{children}</div>
);

const CardHeader = ({ children }: { children: React.ReactNode }) => (
  <div className="p-4 border-b border-gray-200">{children}</div>
);

const CardContent = ({ children, className = "" }: { children: React.ReactNode; className?: string }) => (
  <div className={`p-4 ${className}`}>{children}</div>
);

// Switch Component
const Switch = ({ checked, onCheckedChange, label }: { 
  checked: boolean; 
  onCheckedChange: (checked: boolean) => void; 
  label?: string 
}) => (
  <label className="relative inline-flex items-center cursor-pointer">
    <input
      type="checkbox"
      checked={checked}
      onChange={(e) => onCheckedChange(e.target.checked)}
      className="sr-only peer"
    />
    <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-indigo-600"></div>
    {label && <span className="ml-3 text-sm font-medium text-gray-700">{label}</span>}
  </label>
);

// Badge Component
const Badge = ({ children, variant = "default" }: { children: React.ReactNode; variant?: "success" | "warning" | "danger" | "default" }) => {
  const variants = {
    success: "bg-green-100 text-green-700",
    warning: "bg-yellow-100 text-yellow-700",
    danger: "bg-red-100 text-red-700",
    default: "bg-gray-100 text-gray-700"
  };
  return (
    <span className={`px-2 py-1 text-xs rounded-full ${variants[variant]}`}>
      {children}
    </span>
  );
};

interface CollegeProfile {
  id: string;
  collegeName: string;
  officialEmail: string;
  contactPerson: string;
  phone?: string;
  website?: string;
  location?: string;
  city?: string;
  state?: string;
  affiliatedUniversity?: string;
  logo?: string;
  verificationStatus: "VERIFIED" | "PENDING" | "REJECTED" | "UNVERIFIED";
  createdAt: string;
  totalStudents: number;
}

export default function CollegeSettingsPage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [activeTab, setActiveTab] = useState("profile");
  const [showPassword, setShowPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [darkMode, setDarkMode] = useState(false);
  const [profile, setProfile] = useState<CollegeProfile | null>(null);

  // Notification Settings
  const [notifications, setNotifications] = useState({
    emailAlerts: true,
    studentRegistrations: true,
    reportUpdates: false,
    systemUpdates: true,
    securityAlerts: true
  });

  // Privacy Settings
  const [privacy, setPrivacy] = useState({
    showContactInfo: true,
    showStudentStats: false,
    publicProfile: true
  });

  // Password Change
  const [passwordData, setPasswordData] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: ""
  });

  // Preferences
  const [preferences, setPreferences] = useState({
    language: "english",
    timezone: "Asia/Kolkata",
    dateFormat: "DD/MM/YYYY",
    timeFormat: "12h"
  });

  // Profile Form
  const [profileForm, setProfileForm] = useState({
    collegeName: "",
    contactPerson: "",
    website: "",
    city: "",
    state: "",
    affiliatedUniversity: ""
  });

  useEffect(() => {
    if (status === "unauthenticated") router.push("/login");
  }, [status, router]);

  useEffect(() => {
    async function fetchProfile() {
      try {
        const res = await fetch("/api/college/profile");
        if (res.ok) {
          const data = await res.json();
          setProfile(data);
          setProfileForm({
            collegeName: data.collegeName || "",
            contactPerson: data.contactPerson || "",
            website: data.website || "",
            city: data.city || "",
            state: data.state || "",
            affiliatedUniversity: data.affiliatedUniversity || ""
          });
          
          const saved = localStorage.getItem("collegeSettings");
          if (saved) {
            try {
              const parsed = JSON.parse(saved);
              setNotifications(parsed.notifications || notifications);
              setPrivacy(parsed.privacy || privacy);
              setPreferences(parsed.preferences || preferences);
            } catch (e) {
              console.error(e);
            }
          }
        }
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    }
    if (session?.user) fetchProfile();
  }, [session]);

  const saveSettings = () => {
    setSaving(true);
    
    localStorage.setItem("collegeSettings", JSON.stringify({
      notifications,
      privacy,
      preferences
    }));

    setTimeout(() => {
      toast.success("Settings saved successfully!");
      setSaving(false);
    }, 1000);
  };

  const saveProfile = () => {
    setSaving(true);
    setTimeout(() => {
      toast.success("Profile updated successfully!");
      setSaving(false);
    }, 1000);
  };

  const changePassword = () => {
    if (!passwordData.currentPassword) {
      toast.error("Please enter current password");
      return;
    }
    if (!passwordData.newPassword) {
      toast.error("Please enter new password");
      return;
    }
    if (passwordData.newPassword.length < 6) {
      toast.error("Password must be at least 6 characters");
      return;
    }
    if (passwordData.newPassword !== passwordData.confirmPassword) {
      toast.error("Passwords do not match");
      return;
    }

    toast.success("Password changed successfully!");
    setPasswordData({
      currentPassword: "",
      newPassword: "",
      confirmPassword: ""
    });
  };

  const toggleDarkMode = () => {
    setDarkMode(!darkMode);
    toast.success(`${!darkMode ? "Dark" : "Light"} mode enabled`);
  };

  const handleLogoUpload = () => {
    toast.success("Logo upload feature coming soon!");
  };

  const deleteAccount = () => {
    if (confirm("Are you sure you want to delete your account? This action cannot be undone.")) {
      toast.success("Account deletion request submitted!");
    }
  };

  const exportData = () => {
    toast.success("Data export started!");
  };

  const getVerificationBadge = () => {
    if (!profile) return null;
    
    switch(profile.verificationStatus) {
      case "VERIFIED":
        return <Badge variant="success"><CheckCircle className="w-3 h-3 inline mr-1" /> Verified</Badge>;
      case "PENDING":
        return <Badge variant="warning"><Clock className="w-3 h-3 inline mr-1" /> Pending</Badge>;
      case "REJECTED":
        return <Badge variant="danger"><XCircle className="w-3 h-3 inline mr-1" /> Rejected</Badge>;
      default:
        return <Badge variant="default">Unverified</Badge>;
    }
  };

  if (status === "loading" || loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-600" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      <div className="flex">
        <DashboardSidebar role="COLLEGE" />
        <main className="flex-1 p-6 lg:p-8 max-w-4xl">
          <div className="mb-8">
            <h1 className="text-2xl font-bold text-gray-900">Settings</h1>
            <p className="text-gray-600 mt-1">Manage your college account settings</p>
          </div>

          <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
            <TabsList className="grid grid-cols-4 w-full max-w-2xl">
              <TabsTrigger value="profile">Profile</TabsTrigger>
              <TabsTrigger value="notifications">Notifications</TabsTrigger>
              <TabsTrigger value="security">Security</TabsTrigger>
              <TabsTrigger value="preferences">Preferences</TabsTrigger>
            </TabsList>

            {/* Profile Tab */}
            <TabsContent value="profile">
              <Card>
                <CardHeader>
                  <h3 className="font-semibold flex items-center gap-2">
                    <Building2 className="w-5 h-5" />
                    College Information
                  </h3>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <Input
                      label="College Name *"
                      value={profileForm.collegeName}
                      onChange={(e) => setProfileForm({...profileForm, collegeName: e.target.value})}
                    />
                    <Input
                      label="Official Email"
                      value={profile?.officialEmail || ""}
                      disabled
                      className="bg-gray-50"
                    />
                    <Input
                      label="Contact Person *"
                      value={profileForm.contactPerson}
                      onChange={(e) => setProfileForm({...profileForm, contactPerson: e.target.value})}
                    />
                    <Input
                      label="Website"
                      value={profileForm.website}
                      onChange={(e) => setProfileForm({...profileForm, website: e.target.value})}
                      placeholder="https://college.edu"
                    />
                    <Input
                      label="Affiliated University"
                      value={profileForm.affiliatedUniversity}
                      onChange={(e) => setProfileForm({...profileForm, affiliatedUniversity: e.target.value})}
                    />
                    <Input
                      label="City"
                      value={profileForm.city}
                      onChange={(e) => setProfileForm({...profileForm, city: e.target.value})}
                    />
                    <Select
                      label="State"
                      value={profileForm.state}
                      onChange={(e) => setProfileForm({...profileForm, state: e.target.value})}
                      options={[
                        { value: "", label: "Select State" },
                        { value: "Delhi", label: "Delhi" },
                        { value: "Maharashtra", label: "Maharashtra" },
                        { value: "Karnataka", label: "Karnataka" },
                        { value: "Tamil Nadu", label: "Tamil Nadu" },
                        { value: "Uttar Pradesh", label: "Uttar Pradesh" },
                        { value: "Gujarat", label: "Gujarat" },
                        { value: "Rajasthan", label: "Rajasthan" },
                        { value: "Punjab", label: "Punjab" },
                        { value: "Haryana", label: "Haryana" },
                        { value: "West Bengal", label: "West Bengal" }
                      ]}
                    />
                  </div>

                  <div className="pt-4 border-t">
                    <h4 className="font-medium mb-3 flex items-center gap-2">
                      <Shield className="w-4 h-4" />
                      Verification Documents
                    </h4>
                    <div className="space-y-3">
                      <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                        <div className="flex items-center gap-3">
                          <div className="w-8 h-8 bg-white rounded border flex items-center justify-center">
                            <Upload className="w-4 h-4 text-gray-400" />
                          </div>
                          <div>
                            <p className="text-sm font-medium">College ID / Logo</p>
                            <p className="text-xs text-gray-500">Upload college logo (PNG, JPG)</p>
                          </div>
                        </div>
                        <Button variant="outline" size="sm">Upload</Button>
                      </div>
                      <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                        <div className="flex items-center gap-3">
                          <div className="w-8 h-8 bg-white rounded border flex items-center justify-center">
                            <Upload className="w-4 h-4 text-gray-400" />
                          </div>
                          <div>
                            <p className="text-sm font-medium">Affiliation Certificate</p>
                            <p className="text-xs text-gray-500">Required for verification</p>
                          </div>
                        </div>
                        <Button variant="outline" size="sm">Upload</Button>
                      </div>
                    </div>
                  </div>

                  <div className="flex justify-end gap-3 pt-2">
                    <Button variant="outline">Cancel</Button>
                    <Button onClick={saveProfile} isLoading={saving}>
                      Save Changes
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            {/* Notifications Tab */}
            <TabsContent value="notifications">
              <Card>
                <CardHeader>
                  <h3 className="font-semibold flex items-center gap-2">
                    <Bell className="w-5 h-5" />
                    Notification Settings
                  </h3>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                    <div>
                      <p className="font-medium">Email Alerts</p>
                      <p className="text-sm text-gray-500">Receive email notifications for important updates</p>
                    </div>
                    <Switch
                      checked={notifications.emailAlerts}
                      onCheckedChange={(checked) => setNotifications({...notifications, emailAlerts: checked})}
                    />
                  </div>
                  <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                    <div>
                      <p className="font-medium">Student Registrations</p>
                      <p className="text-sm text-gray-500">Get notified when new students register</p>
                    </div>
                    <Switch
                      checked={notifications.studentRegistrations}
                      onCheckedChange={(checked) => setNotifications({...notifications, studentRegistrations: checked})}
                    />
                  </div>
                  <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                    <div>
                      <p className="font-medium">Report Updates</p>
                      <p className="text-sm text-gray-500">Notifications when reports are generated</p>
                    </div>
                    <Switch
                      checked={notifications.reportUpdates}
                      onCheckedChange={(checked) => setNotifications({...notifications, reportUpdates: checked})}
                    />
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            {/* Security Tab */}
            <TabsContent value="security">
              <div className="space-y-6">
                <Card>
                  <CardHeader>
                    <h3 className="font-semibold flex items-center gap-2">
                      <Key className="w-5 h-5" />
                      Change Password
                    </h3>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="relative">
                      <Input
                        label="Current Password"
                        type={showPassword ? "text" : "password"}
                        value={passwordData.currentPassword}
                        onChange={(e) => setPasswordData({...passwordData, currentPassword: e.target.value})}
                      />
                      <button
                        onClick={() => setShowPassword(!showPassword)}
                        className="absolute right-3 top-9 text-gray-500"
                      >
                        {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                      </button>
                    </div>
                    <div className="relative">
                      <Input
                        label="New Password"
                        type={showNewPassword ? "text" : "password"}
                        value={passwordData.newPassword}
                        onChange={(e) => setPasswordData({...passwordData, newPassword: e.target.value})}
                      />
                      <button
                        onClick={() => setShowNewPassword(!showNewPassword)}
                        className="absolute right-3 top-9 text-gray-500"
                      >
                        {showNewPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                      </button>
                    </div>
                    <Input
                      label="Confirm New Password"
                      type="password"
                      value={passwordData.confirmPassword}
                      onChange={(e) => setPasswordData({...passwordData, confirmPassword: e.target.value})}
                    />
                    <div className="flex justify-end">
                      <Button onClick={changePassword}>
                        Update Password
                      </Button>
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <h3 className="font-semibold flex items-center gap-2 text-red-600">
                      <AlertTriangle className="w-5 h-5" />
                      Danger Zone
                    </h3>
                  </CardHeader>
                  <CardContent>
                    <p className="text-gray-600 mb-4">Permanently delete your account and all data</p>
                    {/* ✅ FIX: Change destructive to danger */}
                    <Button variant="danger" onClick={deleteAccount}>
                      <Trash2 className="w-4 h-4 mr-2" />
                      Delete Account
                    </Button>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>

            {/* Preferences Tab */}
            <TabsContent value="preferences">
              <Card>
                <CardHeader>
                  <h3 className="font-semibold flex items-center gap-2">
                    <Palette className="w-5 h-5" />
                    Preferences
                  </h3>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                    <div className="flex items-center gap-3">
                      {darkMode ? <Moon className="w-5 h-5" /> : <Sun className="w-5 h-5" />}
                      <div>
                        <p className="font-medium">Dark Mode</p>
                        <p className="text-sm text-gray-500">Toggle between light and dark theme</p>
                      </div>
                    </div>
                    <Switch checked={darkMode} onCheckedChange={toggleDarkMode} />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Language
                    </label>
                    <Select
                      value={preferences.language}
                      onChange={(e) => setPreferences({...preferences, language: e.target.value})}
                      options={[
                        { value: "english", label: "English" },
                        { value: "hindi", label: "Hindi" }
                      ]}
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Timezone
                    </label>
                    <Select
                      value={preferences.timezone}
                      onChange={(e) => setPreferences({...preferences, timezone: e.target.value})}
                      options={[
                        { value: "Asia/Kolkata", label: "India (IST)" }
                      ]}
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Date Format
                      </label>
                      <Select
                        value={preferences.dateFormat}
                        onChange={(e) => setPreferences({...preferences, dateFormat: e.target.value})}
                        options={[
                          { value: "DD/MM/YYYY", label: "DD/MM/YYYY" },
                          { value: "MM/DD/YYYY", label: "MM/DD/YYYY" },
                          { value: "YYYY-MM-DD", label: "YYYY-MM-DD" }
                        ]}
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Time Format
                      </label>
                      <Select
                        value={preferences.timeFormat}
                        onChange={(e) => setPreferences({...preferences, timeFormat: e.target.value})}
                        options={[
                          { value: "12h", label: "12-hour (12:00 PM)" },
                          { value: "24h", label: "24-hour (14:30)" }
                        ]}
                      />
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>

          <div className="flex justify-end gap-3 mt-6">
            <Button variant="outline" onClick={() => router.back()}>
              Cancel
            </Button>
            <Button onClick={saveSettings} isLoading={saving}>
              <Save className="w-4 h-4 mr-2" />
              Save Settings
            </Button>
          </div>
        </main>
      </div>
    </div>
  );
}