"use client";

import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { Navbar } from "@/components/layout/Navbar";
import { DashboardSidebar } from "@/components/layout/DashboardSidebar";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { Select } from "@/components/ui/Select";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/Tabs";
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
  <div className={`bg-white rounded-xl border border-gray-200 shadow-sm ${className}`}>
    {children}
  </div>
);

const CardHeader = ({ children }: { children: React.ReactNode }) => (
  <div className="p-4 border-b border-gray-200">
    {children}
  </div>
);

const CardContent = ({ children, className = "" }: { children: React.ReactNode; className?: string }) => (
  <div className={`p-4 ${className}`}>
    {children}
  </div>
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

interface OrganizationProfile {
  id: string;
  organizationName: string;
  type: string;
  officialEmail: string;
  contactPerson: string;
  phone?: string;
  website?: string;
  linkedin?: string;
  location?: string;
  city?: string;
  state?: string;
  logo?: string;
  verificationStatus: "VERIFIED" | "PENDING" | "REJECTED" | "UNVERIFIED";
  createdAt: string;
  totalEvents: number;
  totalVolunteers: number;
}

export default function OrganizationSettingsPage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [activeTab, setActiveTab] = useState("profile");
  const [showPassword, setShowPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [darkMode, setDarkMode] = useState(false);
  const [profile, setProfile] = useState<OrganizationProfile | null>(null);

  // Notification Settings
  const [notifications, setNotifications] = useState({
    emailAlerts: true,
    applicationUpdates: true,
    eventReminders: true,
    marketingEmails: false,
    securityAlerts: true,
    weeklyReports: false,
    volunteerMessages: true
  });

  // Privacy Settings
  const [privacy, setPrivacy] = useState({
    showContactInfo: true,
    showEmail: false,
    showPhone: false,
    publicProfile: true,
    showEvents: true,
    showStats: true
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
    timeFormat: "12h",
    currency: "INR"
  });

  // Bank Details
  const [bankDetails, setBankDetails] = useState({
    accountHolder: "",
    accountNumber: "",
    confirmAccountNumber: "",
    ifscCode: "",
    bankName: "",
    upiId: ""
  });

  // Profile Form
  const [profileForm, setProfileForm] = useState({
    organizationName: "",
    type: "",
    contactPerson: "",
    phone: "",
    website: "",
    linkedin: "",
    city: "",
    state: "",
    location: ""
  });

  useEffect(() => {
    if (status === "unauthenticated") {
      router.push("/login");
    }
  }, [status, router]);

  useEffect(() => {
    async function fetchProfile() {
      try {
        const res = await fetch("/api/organization/profile");
        if (res.ok) {
          const data = await res.json();
          setProfile(data);
          setProfileForm({
            organizationName: data.organizationName || "",
            type: data.type || "",
            contactPerson: data.contactPerson || "",
            phone: data.phone || "",
            website: data.website || "",
            linkedin: data.linkedin || "",
            city: data.city || "",
            state: data.state || "",
            location: data.location || ""
          });
          
          // Load saved settings from localStorage
          const saved = localStorage.getItem("orgSettings");
          if (saved) {
            try {
              const parsed = JSON.parse(saved);
              setNotifications(parsed.notifications || notifications);
              setPrivacy(parsed.privacy || privacy);
              setPreferences(parsed.preferences || preferences);
              setBankDetails(parsed.bankDetails || bankDetails);
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
    
    // Save to localStorage
    localStorage.setItem("orgSettings", JSON.stringify({
      notifications,
      privacy,
      preferences,
      bankDetails
    }));

    // Simulate API call
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

  const verifyBankDetails = () => {
    toast.success("Bank details verification initiated!");
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
        <DashboardSidebar role="ORGANIZATION" />
        <main className="flex-1 p-6 lg:p-8 max-w-5xl">
          {/* Header */}
          <div className="mb-6">
            <h1 className="text-2xl font-bold text-gray-900">Settings</h1>
            <p className="text-sm text-gray-500 mt-1">
              Manage your organization settings, preferences, and account details
            </p>
          </div>

          {/* Profile Summary Card */}
          {profile && (
            <Card className="mb-6">
              <CardContent className="p-4">
                <div className="flex items-center gap-4">
                  <div className="w-16 h-16 bg-indigo-100 rounded-full flex items-center justify-center text-indigo-600 font-bold text-2xl">
                    {profile.logo ? (
                      <img src={profile.logo} alt={profile.organizationName} className="w-16 h-16 rounded-full object-cover" />
                    ) : (
                      profile.organizationName.charAt(0).toUpperCase()
                    )}
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center gap-3">
                      <h2 className="text-xl font-semibold text-gray-900">{profile.organizationName}</h2>
                      {getVerificationBadge()}
                    </div>
                    <p className="text-sm text-gray-500 mt-1">
                      {profile.type} • Member since {new Date(profile.createdAt).toLocaleDateString()}
                    </p>
                    <div className="flex gap-4 mt-2 text-sm">
                      <span><span className="font-medium">{profile.totalEvents || 0}</span> Events</span>
                      <span><span className="font-medium">{profile.totalVolunteers || 0}</span> Volunteers</span>
                    </div>
                  </div>
                  <Button variant="outline" size="sm" onClick={handleLogoUpload}>
                    <Upload className="w-4 h-4 mr-2" />
                    Change Logo
                  </Button>
                </div>
              </CardContent>
            </Card>
          )}

          {/* Tabs Navigation */}
          <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
            <TabsList className="grid grid-cols-6 w-full max-w-3xl">
              <TabsTrigger value="profile">Profile</TabsTrigger>
              <TabsTrigger value="notifications">Notifications</TabsTrigger>
              <TabsTrigger value="security">Security</TabsTrigger>
              <TabsTrigger value="preferences">Preferences</TabsTrigger>
              <TabsTrigger value="payments">Payments</TabsTrigger>
              <TabsTrigger value="advanced">Advanced</TabsTrigger>
            </TabsList>

            {/* Profile Tab */}
            <TabsContent value="profile">
              <Card>
                <CardHeader>
                  <h3 className="font-semibold flex items-center gap-2">
                    <Building2 className="w-5 h-5" />
                    Organization Information
                  </h3>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <Input
                      label="Organization Name *"
                      value={profileForm.organizationName}
                      onChange={(e) => setProfileForm({...profileForm, organizationName: e.target.value})}
                    />
                    <Select
                      label="Organization Type *"
                      value={profileForm.type}
                      onChange={(e) => setProfileForm({...profileForm, type: e.target.value})}
                      options={[
                        { value: "NGO", label: "NGO" },
                        { value: "Events", label: "Events Company" },
                        { value: "Brand", label: "Brand" },
                        { value: "Agency", label: "Agency" },
                        { value: "Startup", label: "Startup" },
                        { value: "Other", label: "Other" }
                      ]}
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
                      label="Phone Number"
                      value={profileForm.phone}
                      onChange={(e) => setProfileForm({...profileForm, phone: e.target.value})}
                      placeholder="+91 98765 43210"
                    />
                    <Input
                      label="Website"
                      value={profileForm.website}
                      onChange={(e) => setProfileForm({...profileForm, website: e.target.value})}
                      placeholder="https://example.com"
                    />
                    <Input
                      label="LinkedIn"
                      value={profileForm.linkedin}
                      onChange={(e) => setProfileForm({...profileForm, linkedin: e.target.value})}
                      placeholder="https://linkedin.com/company/..."
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
                            <p className="text-sm font-medium">GST Certificate</p>
                            <p className="text-xs text-gray-500">Upload your GST certificate (PDF, JPG)</p>
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
                            <p className="text-sm font-medium">Company Registration</p>
                            <p className="text-xs text-gray-500">Upload registration certificate</p>
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
                      onCheckedChange={(checked) => 
                        setNotifications({...notifications, emailAlerts: checked})
                      }
                    />
                  </div>

                  <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                    <div>
                      <p className="font-medium">Application Updates</p>
                      <p className="text-sm text-gray-500">Get notified when volunteers apply to your events</p>
                    </div>
                    <Switch
                      checked={notifications.applicationUpdates}
                      onCheckedChange={(checked) => 
                        setNotifications({...notifications, applicationUpdates: checked})
                      }
                    />
                  </div>

                  <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                    <div>
                      <p className="font-medium">Event Reminders</p>
                      <p className="text-sm text-gray-500">Reminders for upcoming events and deadlines</p>
                    </div>
                    <Switch
                      checked={notifications.eventReminders}
                      onCheckedChange={(checked) => 
                        setNotifications({...notifications, eventReminders: checked})
                      }
                    />
                  </div>

                  <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                    <div>
                      <p className="font-medium">Volunteer Messages</p>
                      <p className="text-sm text-gray-500">Get notified when volunteers message you</p>
                    </div>
                    <Switch
                      checked={notifications.volunteerMessages}
                      onCheckedChange={(checked) => 
                        setNotifications({...notifications, volunteerMessages: checked})
                      }
                    />
                  </div>

                  <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                    <div>
                      <p className="font-medium">Weekly Reports</p>
                      <p className="text-sm text-gray-500">Receive weekly summary reports via email</p>
                    </div>
                    <Switch
                      checked={notifications.weeklyReports}
                      onCheckedChange={(checked) => 
                        setNotifications({...notifications, weeklyReports: checked})
                      }
                    />
                  </div>

                  <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                    <div>
                      <p className="font-medium">Security Alerts</p>
                      <p className="text-sm text-gray-500">Important security notifications</p>
                    </div>
                    <Switch
                      checked={notifications.securityAlerts}
                      onCheckedChange={(checked) => 
                        setNotifications({...notifications, securityAlerts: checked})
                      }
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
                        type="button"
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
                        type="button"
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
                    <h3 className="font-semibold flex items-center gap-2">
                      <Smartphone className="w-5 h-5" />
                      Two-Factor Authentication
                    </h3>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm text-gray-600 mb-4">
                      Add an extra layer of security to your account with 2FA
                    </p>
                    <Button variant="outline">Enable 2FA</Button>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <h3 className="font-semibold flex items-center gap-2">
                      <Mail className="w-5 h-5" />
                      Email Verification
                    </h3>
                  </CardHeader>
                  <CardContent>
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm text-gray-600">
                          Your email {profile?.officialEmail} is verified
                        </p>
                      </div>
                      <Badge variant="success">Verified</Badge>
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <h3 className="font-semibold flex items-center gap-2">
                      <Phone className="w-5 h-5" />
                      Phone Verification
                    </h3>
                  </CardHeader>
                  <CardContent>
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm text-gray-600">
                          {profile?.phone ? `Your phone ${profile.phone} is not verified` : "No phone number added"}
                        </p>
                      </div>
                      <Button variant="outline" size="sm">Verify Now</Button>
                    </div>
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
                        { value: "hindi", label: "Hindi" },
                        { value: "gujarati", label: "Gujarati" },
                        { value: "marathi", label: "Marathi" },
                        { value: "tamil", label: "Tamil" },
                        { value: "telugu", label: "Telugu" },
                        { value: "bengali", label: "Bengali" }
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
                        { value: "Asia/Kolkata", label: "India (IST)" },
                        { value: "Asia/Dubai", label: "Dubai (GST)" },
                        { value: "Asia/Singapore", label: "Singapore (SGT)" },
                        { value: "America/New_York", label: "New York (EST)" },
                        { value: "Europe/London", label: "London (GMT)" },
                        { value: "Australia/Sydney", label: "Sydney (AEST)" }
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

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Currency
                    </label>
                    <Select
                      value={preferences.currency}
                      onChange={(e) => setPreferences({...preferences, currency: e.target.value})}
                      options={[
                        { value: "INR", label: "Indian Rupee (₹)" },
                        { value: "USD", label: "US Dollar ($)" },
                        { value: "EUR", label: "Euro (€)" },
                        { value: "GBP", label: "British Pound (£)" },
                        { value: "AED", label: "Dirham (د.إ)" }
                      ]}
                    />
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            {/* Payments Tab */}
            <TabsContent value="payments">
              <Card>
                <CardHeader>
                  <h3 className="font-semibold flex items-center gap-2">
                    <CreditCard className="w-5 h-5" />
                    Bank Account Details
                  </h3>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <Input
                      label="Account Holder Name *"
                      value={bankDetails.accountHolder}
                      onChange={(e) => setBankDetails({...bankDetails, accountHolder: e.target.value})}
                    />
                    <Input
                      label="Bank Name *"
                      value={bankDetails.bankName}
                      onChange={(e) => setBankDetails({...bankDetails, bankName: e.target.value})}
                    />
                    <Input
                      label="Account Number *"
                      type="password"
                      value={bankDetails.accountNumber}
                      onChange={(e) => setBankDetails({...bankDetails, accountNumber: e.target.value})}
                    />
                    <Input
                      label="Confirm Account Number *"
                      type="password"
                      value={bankDetails.confirmAccountNumber}
                      onChange={(e) => setBankDetails({...bankDetails, confirmAccountNumber: e.target.value})}
                    />
                    <Input
                      label="IFSC Code *"
                      value={bankDetails.ifscCode}
                      onChange={(e) => setBankDetails({...bankDetails, ifscCode: e.target.value})}
                      placeholder="SBIN0001234"
                    />
                    <Input
                      label="UPI ID"
                      value={bankDetails.upiId}
                      onChange={(e) => setBankDetails({...bankDetails, upiId: e.target.value})}
                      placeholder="organization@okhdfcbank"
                    />
                  </div>

                  <div className="flex justify-end">
                    <Button variant="outline" onClick={verifyBankDetails}>
                      Verify Bank Details
                    </Button>
                  </div>

                  <div className="pt-4 border-t">
                    <h4 className="font-medium mb-3">Payout Settings</h4>
                    <div className="space-y-3">
                      <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                        <div>
                          <p className="text-sm font-medium">Auto Payout</p>
                          <p className="text-xs text-gray-500">Automatically process payments every week</p>
                        </div>
                        <Switch checked={false} onCheckedChange={() => {}} />
                      </div>
                      <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                        <div>
                          <p className="text-sm font-medium">Minimum Payout</p>
                          <p className="text-xs text-gray-500">Minimum amount for auto payout</p>
                        </div>
                        <Select
                          value="1000"
                          onChange={() => {}}
                          options={[
                            { value: "500", label: "₹500" },
                            { value: "1000", label: "₹1000" },
                            { value: "2000", label: "₹2000" },
                            { value: "5000", label: "₹5000" }
                          ]}
                        />
                      </div>
                    </div>
                  </div>

                  <div className="pt-4 border-t">
                    <h4 className="font-medium mb-3">Recent Transactions</h4>
                    <div className="space-y-2">
                      <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                        <div>
                          <p className="text-sm font-medium">March 15, 2026</p>
                          <p className="text-xs text-gray-500">Event: Tech Workshop</p>
                        </div>
                        <div className="text-right">
                          <p className="font-semibold text-green-600">+₹12,500</p>
                          <p className="text-xs text-gray-500">Completed</p>
                        </div>
                      </div>
                      <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                        <div>
                          <p className="text-sm font-medium">March 10, 2026</p>
                          <p className="text-xs text-gray-500">Event: CSR Drive</p>
                        </div>
                        <div className="text-right">
                          <p className="font-semibold text-green-600">+₹8,200</p>
                          <p className="text-xs text-gray-500">Completed</p>
                        </div>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            {/* Advanced Tab */}
            <TabsContent value="advanced">
              <div className="space-y-6">
                <Card>
                  <CardHeader>
                    <h3 className="font-semibold flex items-center gap-2">
                      <Globe className="w-5 h-5" />
                      API Access
                    </h3>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="p-4 bg-gray-50 rounded-lg">
                      <p className="text-sm font-medium mb-2">API Key</p>
                      <div className="flex gap-2">
                        <code className="flex-1 p-2 bg-white border rounded text-sm font-mono">
                          sk_live_xxxxxxxxxxxxxx
                        </code>
                        <Button variant="outline" size="sm">Regenerate</Button>
                      </div>
                      <p className="text-xs text-gray-500 mt-2">
                        Use this key to integrate with external applications
                      </p>
                    </div>

                    <div className="p-4 bg-gray-50 rounded-lg">
                      <p className="text-sm font-medium mb-2">Webhook URL</p>
                      <Input
                        placeholder="https://your-organization.com/webhook"
                        value="https://api.gigbharat.com/webhook/org_123"
                      />
                      <p className="text-xs text-gray-500 mt-1">
                        Receive real-time updates about applications and events
                      </p>
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <h3 className="font-semibold flex items-center gap-2">
                      <Download className="w-5 h-5" />
                      Data Management
                    </h3>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                      <div>
                        <p className="font-medium">Export All Data</p>
                        <p className="text-sm text-gray-500">Download all your organization data</p>
                      </div>
                      <Button variant="outline" onClick={exportData}>
                        Export JSON
                      </Button>
                    </div>

                    <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                      <div>
                        <p className="font-medium">Export Events</p>
                        <p className="text-sm text-gray-500">Download events data as CSV</p>
                      </div>
                      <Button variant="outline">Export CSV</Button>
                    </div>

                    <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                      <div>
                        <p className="font-medium">Export Volunteers</p>
                        <p className="text-sm text-gray-500">Download volunteers list</p>
                      </div>
                      <Button variant="outline">Export CSV</Button>
                    </div>
                  </CardContent>
                </Card>

                <Card className="border-red-200">
                  <CardHeader>
                    <h3 className="font-semibold flex items-center gap-2 text-red-600">
                      <AlertTriangle className="w-5 h-5" />
                      Danger Zone
                    </h3>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm text-gray-600 mb-4">
                      Permanently delete your organization account and all associated data. 
                      This action cannot be undone.
                    </p>
                    <Button variant="danger" onClick={deleteAccount}>
                      <Trash2 className="w-4 h-4 mr-2" />
                      Delete Account
                    </Button>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>
          </Tabs>

          {/* Save Button */}
          <div className="flex justify-end gap-3 mt-6">
            <Button variant="outline" onClick={() => router.back()}>
              Cancel
            </Button>
            <Button onClick={saveSettings} isLoading={saving} size="lg">
              <Save className="w-4 h-4 mr-2" />
              Save Settings
            </Button>
          </div>
        </main>
      </div>
    </div>
  );
}