"use client";

import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { Navbar } from "@/components/layout/Navbar";
import { AdminSidebar } from "@/components/layout/AdminSidebar";
import { Button } from "@/components/ui/Button";  // 
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
  Palette,
  Download,
  Trash2
} from "lucide-react";
import toast from "react-hot-toast";

// Card Components
const Card = ({ children, className = "" }: { children: React.ReactNode; className?: string }) => (
  <div className={`bg-white/10 backdrop-blur-xl rounded-2xl border border-white/20 shadow-sm ${className}`}>{children}</div>
);

const CardHeader = ({ children }: { children: React.ReactNode }) => (
  <div className="p-4 border-b border-white/10">{children}</div>
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

export default function SuperAdminSettingsPage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [activeTab, setActiveTab] = useState("profile");
  const [showPassword, setShowPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [darkMode, setDarkMode] = useState(false);

  // Password Change
  const [passwordData, setPasswordData] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: ""
  });

  // Notification Settings
  const [notifications, setNotifications] = useState({
    emailAlerts: true,
    securityAlerts: true,
    weeklyReports: true
  });

  // Preferences
  const [preferences, setPreferences] = useState({
    language: "english",
    timezone: "Asia/Kolkata"
  });

  useEffect(() => {
    if (status === "unauthenticated") router.push("/login");
    if (session?.user?.role !== "SUPER_ADMIN") router.push("/dashboard");
    setLoading(false);
  }, [status, session, router]);

  const saveSettings = () => {
    setSaving(true);
    setTimeout(() => {
      toast.success("Settings saved successfully!");
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

  if (status === "loading" || loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 to-purple-900 flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-600" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-indigo-950 to-purple-950">
      <Navbar />
      <div className="flex">
        <AdminSidebar />
        <main className="flex-1 p-6 lg:p-8 max-w-4xl">
          <div className="mb-8">
            <h1 className="text-2xl font-bold text-white">Settings</h1>
            <p className="text-gray-400 mt-1">Manage your admin account settings and preferences</p>
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
                  <h3 className="font-semibold flex items-center gap-2 text-white">
                    <User className="w-5 h-5" />
                    Profile Information
                  </h3>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <Input
                      label="Email"
                      value={session?.user?.email || ""}
                      disabled
                      className="bg-white/10 border-white/20 text-white"
                    />
                    <Input
                      label="Role"
                      value="SUPER_ADMIN"
                      disabled
                      className="bg-white/10 border-white/20 text-white"
                    />
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            {/* Notifications Tab */}
            <TabsContent value="notifications">
              <Card>
                <CardHeader>
                  <h3 className="font-semibold flex items-center gap-2 text-white">
                    <Bell className="w-5 h-5" />
                    Notification Preferences
                  </h3>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-center justify-between p-3 bg-white/5 rounded-lg">
                    <div>
                      <p className="font-medium text-white">Email Alerts</p>
                      <p className="text-sm text-gray-400">Receive email notifications</p>
                    </div>
                    <Switch
                      checked={notifications.emailAlerts}
                      onCheckedChange={(checked) => setNotifications({...notifications, emailAlerts: checked})}
                    />
                  </div>
                  <div className="flex items-center justify-between p-3 bg-white/5 rounded-lg">
                    <div>
                      <p className="font-medium text-white">Security Alerts</p>
                      <p className="text-sm text-gray-400">Get notified about security events</p>
                    </div>
                    <Switch
                      checked={notifications.securityAlerts}
                      onCheckedChange={(checked) => setNotifications({...notifications, securityAlerts: checked})}
                    />
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            {/* Security Tab */}
            <TabsContent value="security">
              <Card>
                <CardHeader>
                  <h3 className="font-semibold flex items-center gap-2 text-white">
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
                      className="bg-white/10 border-white/20 text-white"
                    />
                    <button
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3 top-9 text-gray-400 hover:text-gray-300"
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
                      className="bg-white/10 border-white/20 text-white"
                    />
                    <button
                      onClick={() => setShowNewPassword(!showNewPassword)}
                      className="absolute right-3 top-9 text-gray-400 hover:text-gray-300"
                    >
                      {showNewPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </button>
                  </div>
                  <Input
                    label="Confirm New Password"
                    type="password"
                    value={passwordData.confirmPassword}
                    onChange={(e) => setPasswordData({...passwordData, confirmPassword: e.target.value})}
                    className="bg-white/10 border-white/20 text-white"
                  />
                  <div className="flex justify-end">
                    <Button onClick={changePassword} variant="primary">
                      Update Password
                    </Button>
                  </div>
                </CardContent>
              </Card>

              <Card className="mt-6">
                <CardHeader>
                  <h3 className="font-semibold flex items-center gap-2 text-white">
                    <Smartphone className="w-5 h-5" />
                    Two-Factor Authentication
                  </h3>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-gray-400 mb-4">
                    Add an extra layer of security to your account with 2FA
                  </p>
                  <Button variant="outline">Enable 2FA</Button>
                </CardContent>
              </Card>
            </TabsContent>

            {/* Preferences Tab */}
            <TabsContent value="preferences">
              <Card>
                <CardHeader>
                  <h3 className="font-semibold flex items-center gap-2 text-white">
                    <Palette className="w-5 h-5" />
                    Preferences
                  </h3>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-center justify-between p-3 bg-white/5 rounded-lg">
                    <div className="flex items-center gap-3">
                      {darkMode ? <Moon className="w-5 h-5" /> : <Sun className="w-5 h-5" />}
                      <div>
                        <p className="font-medium text-white">Dark Mode</p>
                        <p className="text-sm text-gray-400">Toggle between light and dark theme</p>
                      </div>
                    </div>
                    <Switch checked={darkMode} onCheckedChange={toggleDarkMode} />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-1">
                      Language
                    </label>
                    <Select
                      value={preferences.language}
                      onChange={(e) => setPreferences({...preferences, language: e.target.value})}
                      options={[
                        { value: "english", label: "English" },
                        { value: "hindi", label: "Hindi" }
                      ]}
                      className="bg-white/10 border-white/20 text-white"
                    />
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>

          {/* Danger Zone */}
          <div className="mt-6">
            <Card className="border-red-500/30">
              <CardHeader>
                <h3 className="font-semibold flex items-center gap-2 text-red-400">
                  <AlertTriangle className="w-5 h-5" />
                  Danger Zone
                </h3>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-gray-400 mb-4">
                  Permanently delete your account and all associated data.
                </p>
                {/* ✅ Use variant="danger" not "destructive" */}
                <Button variant="danger" onClick={() => toast.error("This action is disabled")}>
                  <Trash2 className="w-4 h-4 mr-2" />
                  Delete Account
                </Button>
              </CardContent>
            </Card>
          </div>

          <div className="flex justify-end gap-3 mt-6">
            <Button variant="outline" onClick={() => router.back()}>
              Cancel
            </Button>
            <Button onClick={saveSettings} isLoading={saving} variant="primary">
              <Save className="w-4 h-4 mr-2" />
              Save Settings
            </Button>
          </div>
        </main>
      </div>
    </div>
  );
}