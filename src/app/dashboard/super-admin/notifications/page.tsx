"use client";

import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { Navbar } from "@/components/layout/Navbar";
import { AdminSidebar } from "@/components/layout/AdminSidebar";
import { Button } from "@/components/ui/Button";  
import {
  Bell,
  Send,
  Eye,
  Trash2,
  RefreshCw,
  Loader2,
  CheckCircle,
  AlertCircle,
  XCircle
} from "lucide-react";
import toast from "react-hot-toast";

// Card Components
const Card = ({ children, className = "" }: { children: React.ReactNode; className?: string }) => (
  <div className={`bg-white/10 backdrop-blur-xl rounded-2xl border border-white/20 shadow-sm ${className}`}>{children}</div>
);

const CardContent = ({ children, className = "" }: { children: React.ReactNode; className?: string }) => (
  <div className={`p-4 ${className}`}>{children}</div>
);

const CardHeader = ({ children }: { children: React.ReactNode }) => (
  <div className="p-4 border-b border-white/10">{children}</div>
);

const Badge = ({ children, variant = "default" }: { children: React.ReactNode; variant?: "success" | "warning" | "danger" | "info" | "default" }) => {
  const variants: Record<string, string> = {
    success: "bg-green-500/20 text-green-400",
    warning: "bg-yellow-500/20 text-yellow-400",
    danger: "bg-red-500/20 text-red-400",
    info: "bg-blue-500/20 text-blue-400",
    default: "bg-gray-500/20 text-gray-400"
  };
  return <span className={`px-2 py-1 text-xs rounded-full ${variants[variant]}`}>{children}</span>;
};

interface Notification {
  id: string;
  title: string;
  message: string;
  type: "info" | "success" | "warning" | "error";
  targetType?: "all" | "volunteers" | "organizations" | "colleges";
  sentAt: string;
  status: "sent" | "pending" | "failed";
  recipients: number;
}

export default function SuperAdminNotificationsPage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [notifications, setNotifications] = useState<Notification[]>([
    {
      id: "1",
      title: "Welcome to Admin Panel",
      message: "You have successfully logged in as Super Admin",
      type: "success",
      sentAt: new Date().toISOString(),
      status: "sent",
      recipients: 1
    },
    {
      id: "2",
      title: "New Organization Registered",
      message: "Tech Events Pvt Ltd has registered and pending verification",
      type: "info",
      sentAt: new Date(Date.now() - 3600000).toISOString(),
      status: "sent",
      recipients: 1
    }
  ]);

  const [newNotification, setNewNotification] = useState({
    title: "",
    message: "",
    type: "info" as "info" | "success" | "warning" | "error",
    target: "all" as "all" | "volunteers" | "organizations" | "colleges"
  });
  const [sending, setSending] = useState(false);

  useEffect(() => {
    if (status === "unauthenticated") router.push("/login");
    if (session?.user?.role !== "SUPER_ADMIN") router.push("/dashboard");
    setLoading(false);
  }, [status, session, router]);

  const sendNotification = async () => {
    if (!newNotification.title || !newNotification.message) {
      toast.error("Please fill title and message");
      return;
    }

    setSending(true);
    try {
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      const newNotif: Notification = {
        id: Date.now().toString(),
        title: newNotification.title,
        message: newNotification.message,
        type: newNotification.type,
        targetType: newNotification.target,
        sentAt: new Date().toISOString(),
        status: "sent",
        recipients: 0
      };
      
      setNotifications([newNotif, ...notifications]);
      toast.success("Notification sent successfully!");
      setNewNotification({
        title: "",
        message: "",
        type: "info",
        target: "all"
      });
    } catch (error) {
      toast.error("Failed to send notification");
    } finally {
      setSending(false);
    }
  };

  const deleteNotification = (id: string) => {
    setNotifications(notifications.filter(n => n.id !== id));
    toast.success("Notification deleted");
  };

  const getTypeIcon = (type: string) => {
    switch(type) {
      case "success": return <CheckCircle className="w-5 h-5 text-green-400" />;
      case "warning": return <AlertCircle className="w-5 h-5 text-yellow-400" />;
      case "error": return <XCircle className="w-5 h-5 text-red-400" />;
      default: return <Bell className="w-5 h-5 text-blue-400" />;
    }
  };

  const getTypeBadge = (type: string) => {
    switch(type) {
      case "success": return <Badge variant="success">Success</Badge>;
      case "warning": return <Badge variant="warning">Warning</Badge>;
      case "error": return <Badge variant="danger">Error</Badge>;
      default: return <Badge variant="info">Info</Badge>;
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 to-purple-900 flex items-center justify-center">
        <Loader2 className="w-8 h-8 text-indigo-400 animate-spin" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-indigo-950 to-purple-950">
      <Navbar />
      <div className="flex">
        <AdminSidebar />
        <main className="flex-1 p-6 lg:p-8">
          <div className="space-y-6">
            {/* Header */}
            <div className="flex justify-between items-center">
              <div>
                <h1 className="text-2xl font-bold text-white">Notifications</h1>
                <p className="text-sm text-gray-400 mt-1">
                  Send and manage platform notifications
                </p>
              </div>
              <Button variant="outline" onClick={() => window.location.reload()}>
                <RefreshCw className="w-4 h-4 mr-2" />
                Refresh
              </Button>
            </div>

            {/* Send Notification Card */}
            <Card>
              <CardHeader>
                <h2 className="text-lg font-semibold flex items-center gap-2 text-white">
                  <Send className="w-5 h-5" />
                  Send New Notification
                </h2>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-1">
                      Notification Title *
                    </label>
                    <input
                      type="text"
                      value={newNotification.title}
                      onChange={(e) => setNewNotification({...newNotification, title: e.target.value})}
                      placeholder="Enter title"
                      className="w-full px-3 py-2 border rounded-lg bg-white/10 border-white/20 text-white placeholder:text-gray-500 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-1">
                      Target Audience
                    </label>
                    <select
                      value={newNotification.target}
                      onChange={(e) => setNewNotification({...newNotification, target: e.target.value as any})}
                      className="w-full px-3 py-2 border rounded-lg bg-white/10 border-white/20 text-white"
                    >
                      <option value="all">All Users</option>
                      <option value="volunteers">Volunteers Only</option>
                      <option value="organizations">Organizations Only</option>
                      <option value="colleges">Colleges Only</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-1">
                      Notification Type
                    </label>
                    <select
                      value={newNotification.type}
                      onChange={(e) => setNewNotification({...newNotification, type: e.target.value as any})}
                      className="w-full px-3 py-2 border rounded-lg bg-white/10 border-white/20 text-white"
                    >
                      <option value="info">Information</option>
                      <option value="success">Success</option>
                      <option value="warning">Warning</option>
                      <option value="error">Error</option>
                    </select>
                  </div>
                  <div className="md:col-span-2">
                    <label className="block text-sm font-medium text-gray-300 mb-1">
                      Message *
                    </label>
                    <textarea
                      value={newNotification.message}
                      onChange={(e) => setNewNotification({...newNotification, message: e.target.value})}
                      placeholder="Enter notification message"
                      rows={3}
                      className="w-full px-3 py-2 border rounded-lg bg-white/10 border-white/20 text-white placeholder:text-gray-500 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                    />
                  </div>
                </div>
                <div className="flex justify-end">
                  <Button onClick={sendNotification} isLoading={sending} variant="primary">
                    <Send className="w-4 h-4 mr-2" />
                    Send Notification
                  </Button>
                </div>
              </CardContent>
            </Card>

            {/* Notification History */}
            <Card>
              <CardHeader>
                <div className="flex justify-between items-center">
                  <h2 className="text-lg font-semibold flex items-center gap-2 text-white">
                    <Bell className="w-5 h-5" />
                    Notification History
                  </h2>
                  <Badge variant="info">{notifications.length} Total</Badge>
                </div>
              </CardHeader>
              <CardContent className="p-0">
                <div className="divide-y divide-white/10">
                  {notifications.map((notif) => (
                    <div key={notif.id} className="p-4 hover:bg-white/5 transition">
                      <div className="flex items-start gap-3">
                        <div className="mt-1">
                          {getTypeIcon(notif.type)}
                        </div>
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-1">
                            <h3 className="font-semibold text-white">{notif.title}</h3>
                            {getTypeBadge(notif.type)}
                          </div>
                          <p className="text-sm text-gray-300 mb-2">{notif.message}</p>
                          <div className="flex items-center gap-4 text-xs text-gray-400">
                            <span className="flex items-center gap-1">
                              <Send className="w-3 h-3" />
                              {notif.recipients} recipients
                            </span>
                            <span>
                              {new Date(notif.sentAt).toLocaleString()}
                            </span>
                            {notif.targetType && notif.targetType !== "all" && (
                              <Badge variant="default">{notif.targetType}</Badge>
                            )}
                          </div>
                        </div>
                        <div className="flex gap-1">
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => deleteNotification(notif.id)}
                            className="p-1 text-red-400 hover:text-red-300"
                          >
                            <Trash2 className="w-4 h-4" />
                          </Button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>

                {notifications.length === 0 && (
                  <div className="text-center py-12">
                    <Bell className="w-12 h-12 text-gray-500 mx-auto mb-4" />
                    <h3 className="text-lg font-medium text-white">No notifications</h3>
                    <p className="text-gray-400 mt-1">
                      Send your first notification to users
                    </p>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        </main>
      </div>
    </div>
  );
}