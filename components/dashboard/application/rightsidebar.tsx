"use client";

import { useEffect, useState } from "react";
import { useGlobal } from "@/src/statecontext";
import {
  AlertTriangle,
  Award,
  Bell,
  Building2,
  Calendar,
  Check,
  ChevronRight,
  Clock,
  ExternalLink,
  FileLock,
  FileText,
  Flag,
  GraduationCap,
  HelpCircle,
  Info,
  Mail,
  MapPin,
  MessageCircle,
  Phone,
  PhoneCall,
  Plane,
  Rocket,
  Shield,
  Sparkles,
  Upload,
  User,
  Wallet,
  X,
} from "lucide-react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import axiosInstance from "@/app/axiosInstance";

// ─── Types ───────────────────────────────────────────────────────────────────

interface DashboardData {
  alerts: {
    total: number;
    critical: number;
    warning: number;
    list: AlertItem[];
    summary: string;
  };
  applications: ApplicationItem[];
  recentActivities: ActivityItem[];
  quickActions: QuickActionItem[];
  user: {
    name: string;
    email: string;
    phone: string;
    profileImage: string;
    assignto?: {
      name: string;
      email: string;
      phone: string;
      profileImage: string;
    };
  };
}

interface AlertItem {
  id: string;
  type: string;
  severity: "critical" | "warning" | "info" | "success";
  title: string;
  message: string;
  impact: string;
  step?: {
    id: number;
    label: string;
    route: string;
  };
  action: {
    label: string;
    route: string;
    type: string;
  };
  timestamp: string;
}

interface ApplicationItem {
  id: string;
  applicationNumber: string;
  country: string;
  course: {
    id: string;
    name: string;
    university: string;
  } | null;
  intake: string;
  primaryStatus: string;
  paymentStatus: string;
  isVisa: boolean;
  hasIssues: boolean;
  createdAt: string;
  updatedAt: string;
}

interface ActivityItem {
  id: string;
  type: string;
  action?: string;
  description?: string;
  content?: string;
  application: {
    id: string;
    applicationNumber: string;
  } | null;
  isRead: boolean;
  createdAt: string;
  userType: string;
}

interface QuickActionItem {
  label: string;
  route: string;
  priority: string;
  type: string;
  alertId?: string;
  reason?: string;
}

// ─── Helpers ─────────────────────────────────────────────────────────────────

const formatTimeAgo = (dateString: string): string => {
  const date = new Date(dateString);
  const now = new Date();
  const diffMs = now.getTime() - date.getTime();
  const diffMins = Math.floor(diffMs / 60000);
  const diffHours = Math.floor(diffMs / 3600000);
  const diffDays = Math.floor(diffMs / 86400000);

  if (diffMins < 1) return "Just now";
  if (diffMins < 60) return `${diffMins} min ago`;
  if (diffHours < 24) return `${diffHours} hour${diffHours > 1 ? "s" : ""} ago`;
  if (diffDays < 7) return `${diffDays} day${diffDays > 1 ? "s" : ""} ago`;
  return date.toLocaleDateString("en-US", { month: "short", day: "numeric" });
};

const getAlertConfig = (severity: string) => {
  switch (severity) {
    case "critical":
      return {
        icon: AlertTriangle,
        bg: "bg-rose-50",
        border: "border-rose-200",
        iconColor: "text-rose-600",
        badge: "bg-rose-100 text-rose-700 border-rose-200",
        badgeText: "Critical",
      };
    case "warning":
      return {
        icon: Bell,
        bg: "bg-amber-50",
        border: "border-amber-200",
        iconColor: "text-amber-600",
        badge: "bg-amber-100 text-amber-700 border-amber-200",
        badgeText: "Warning",
      };
    case "success":
      return {
        icon: Check,
        bg: "bg-emerald-50",
        border: "border-emerald-200",
        iconColor: "text-emerald-600",
        badge: "bg-emerald-100 text-emerald-700 border-emerald-200",
        badgeText: "Success",
      };
    default:
      return {
        icon: Info,
        bg: "bg-blue-50",
        border: "border-blue-200",
        iconColor: "text-blue-600",
        badge: "bg-blue-100 text-blue-700 border-blue-200",
        badgeText: "Info",
      };
  }
};

const getActivityConfig = (activity: ActivityItem) => {
  const action = activity.action || "";
  const type = activity.type || "";

  if (action.includes("CREATED"))
    return {
      icon: Rocket,
      bg: "bg-blue-50",
      iconColor: "text-blue-600",
      border: "border-blue-200",
    };
  if (action.includes("UPDATED"))
    return {
      icon: FileText,
      bg: "bg-purple-50",
      iconColor: "text-purple-600",
      border: "border-purple-200",
    };
  if (type === "message")
    return {
      icon: MessageCircle,
      bg: "bg-emerald-50",
      iconColor: "text-emerald-600",
      border: "border-emerald-200",
    };
  return {
    icon: Sparkles,
    bg: "bg-gray-50",
    iconColor: "text-gray-500",
    border: "border-gray-200",
  };
};

const getStatusBadge = (status: string) => {
  const s = status.toLowerCase();
  if (s.includes("offer") || s.includes("approved"))
    return "bg-emerald-50 text-emerald-700 border-emerald-200";
  if (s.includes("pending") || s.includes("progress"))
    return "bg-amber-50 text-amber-700 border-amber-200";
  if (s.includes("rejected") || s.includes("refused"))
    return "bg-rose-50 text-rose-700 border-rose-200";
  return "bg-blue-50 text-blue-700 border-blue-200";
};

const getQuickActionConfig = (type: string, priority: string) => {
  if (type === "danger" || priority === "critical")
    return {
      bg: "bg-rose-50 hover:bg-rose-100",
      border: "border-rose-200",
      iconBg: "bg-rose-100",
      iconColor: "text-rose-600",
      arrowColor: "text-rose-400",
    };
  if (type === "primary" || priority === "high")
    return {
      bg: "bg-blue-50 hover:bg-blue-100",
      border: "border-blue-200",
      iconBg: "bg-blue-100",
      iconColor: "text-blue-600",
      arrowColor: "text-blue-400",
    };
  return {
    bg: "bg-gray-50 hover:bg-gray-100",
    border: "border-gray-200",
    iconBg: "bg-gray-100",
    iconColor: "text-gray-600",
    arrowColor: "text-gray-400",
  };
};

const getQuickActionIcon = (label: string) => {
  const l = label.toLowerCase();
  if (l.includes("document") || l.includes("upload")) return Upload;
  if (l.includes("profile")) return User;
  if (l.includes("application")) return Building2;
  if (l.includes("support") || l.includes("contact")) return HelpCircle;
  if (l.includes("visa")) return Shield;
  if (l.includes("payment")) return Wallet;
  return ChevronRight;
};

// ─── Component ───────────────────────────────────────────────────────────────

export const Rigthsidebar = () => {
  const router = useRouter();
  const { profile } = useGlobal();

  const [data, setData] = useState<DashboardData | null>(null);
  const [loading, setLoading] = useState(true);
  const [dismissedAlerts, setDismissedAlerts] = useState<Set<string>>(new Set());

  useEffect(() => {
    const fetchDashboard = async () => {
      try {
        setLoading(true);
        const response = await axiosInstance.get("/dashboard/user");
        if (response.data.success) {
          setData(response.data.data);
        }
      } catch (err) {
        console.error("Sidebar fetch error:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchDashboard();
  }, []);

  const handleDismissAlert = (alertId: string) => {
    setDismissedAlerts((prev) => new Set(prev).add(alertId));
  };

  const visibleAlerts =
    data?.alerts.list.filter((a) => !dismissedAlerts.has(a.id)) || [];

  if (loading) {
    return (
      <div className="space-y-6">
        {[1, 2, 3].map((i) => (
          <div
            key={i}
            className="bg-white rounded-2xl border border-gray-100 p-5 animate-pulse"
          >
            <div className="h-4 bg-gray-100 rounded w-1/3 mb-4" />
            <div className="space-y-3">
              <div className="h-12 bg-gray-50 rounded-xl" />
              <div className="h-12 bg-gray-50 rounded-xl" />
            </div>
          </div>
        ))}
      </div>
    );
  }

  const counselor = profile?.assignto || data?.user?.assignto;

  return (
    <div className="space-y-6">
      {/* ═══════════════════════════════════════════════════════════════
          COUNSELOR CARD
         ═══════════════════════════════════════════════════════════════ */}
      {counselor?.name && (
        <div className=" bg-white rounded-2xl border border-gray-100 overflow-hidden hover:shadow-xl transition-all duration-300">
          {/* Header */}
          <div className="bg-orange-600 px-5 py-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs font-medium text-orange-100 mb-0.5">
                  Your Dedicated
                </p>
                <h3 className="text-base font-bold text-white">
                  Study Counselor
                </h3>
              </div>
            </div>
          </div>

          {/* Body */}
          <div className="p-5">
            <div className="flex items-center gap-4">
              <div className="relative">
                <Image
                  src={
                    counselor.profileImage ||
                    "https://cdn.pixabay.com/photo/2023/02/18/11/00/icon-7797704_1280.png"
                  }
                  alt={counselor.name}
                  width={56}
                  height={56}
                  loading="lazy"
                  className="rounded-full border-2 border-orange-100 object-cover shadow-md"
                />
                <div className="absolute -bottom-0.5 -right-0.5 w-4 h-4 bg-emerald-500 border-2 border-white rounded-full" />
              </div>

              <div className="flex-1 min-w-0">
                <h4 className="font-bold capitalize text-gray-900 truncate">
                  {counselor.name}
                </h4>
                <p className="text-xs text-gray-500 font-medium">
                  Senior Study Abroad Expert
                </p>
                <span className="inline-flex items-center gap-1 mt-1.5 px-2.5 py-0.5 rounded-full bg-orange-50 text-orange-600 text-[10px] font-bold border border-orange-100">
                  Free Consultation
                </span>
              </div>
            </div>

            {/* Contact Actions */}
            <div className="mt-5 grid grid-cols-3 gap-2">
              {[
                {
                  icon: MessageCircle,
                  label: "WhatsApp",
                  link: `https://wa.me/${counselor.phone?.replace(/\D/g, "")}`,
                  color: "hover:bg-emerald-500 hover:border-emerald-500 hover:text-white",
                  iconHover: "group-hover:text-white",
                },
                {
                  icon: Mail,
                  label: "Email",
                  link: `mailto:${counselor.email}`,
                  color: "hover:bg-blue-500 hover:border-blue-500 hover:text-white",
                  iconHover: "group-hover:text-white",
                },
                {
                  icon: Phone,
                  label: "Call",
                  link: `tel:${counselor.phone}`,
                  color: "hover:bg-orange-500 hover:border-orange-500 hover:text-white",
                  iconHover: "group-hover:text-white",
                },
              ].map((item, i) => (
                <a
                  key={i}
                  href={item.link}
                  target="_blank"
                  rel="noopener noreferrer"
                  className={`group flex flex-col items-center gap-1.5 rounded-xl border border-gray-100 bg-gray-50 py-3 transition-all duration-300 ${item.color}`}
                >
                  <item.icon
                    className={`w-4 h-4 text-gray-500 transition-colors ${item.iconHover}`}
                  />
                  <span className="text-[11px] font-semibold text-gray-600 group-hover:text-white transition-colors">
                    {item.label}
                  </span>
                </a>
              ))}
            </div>
          </div>
        </div>
      )}

            {data?.applications && data.applications.length > 0 && (
        <div className="bg-white rounded-2xl border border-gray-100 overflow-hidden">
          <div className="px-5 py-4 border-b border-gray-50 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Building2 className="w-5 h-5 text-gray-700" />
              <h3 className="text-base font-bold text-gray-900">
                My Applications
              </h3>
              <span className="px-2 py-0.5 rounded-full bg-gray-100 text-gray-600 text-[10px] font-bold">
                {data.applications.length}
              </span>
            </div>
            <button
              onClick={() => router.push("/dashboard/application")}
              className="text-xs font-medium text-blue-600 hover:text-blue-700 flex items-center gap-1 transition-colors"
            >
              View All
              <ChevronRight className="w-3.5 h-3.5" />
            </button>
          </div>

          <div className="divide-y divide-gray-50">
            {data.applications.map((app) => (
              <div
                key={app.id}
                onClick={() => router.push(`/dashboard/application/${app.id}`)}
                className="group p-4 hover:bg-gray-50/50 transition-all cursor-pointer"
              >
                <div className="flex items-start justify-between mb-2">
                  <div className="flex items-center gap-2">
                   
                    <div>
                      <p className="text-xs text-gray-400 font-medium">
                        {app.applicationNumber}
                      </p>
                      <p className="text-sm font-bold text-gray-900">
                        {app.course?.name || "Application"}
                      </p>
                    </div>
                  </div>
                  <ChevronRight className="w-4 h-4 text-gray-300 group-hover:text-gray-500 group-hover:translate-x-0.5 transition-all" />
                </div>

                <div className="flex items-center gap-2 flex-wrap">
                  <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md bg-gray-50 text-gray-600 text-[10px] font-medium border border-gray-100">
                    <MapPin className="w-3 h-3" />
                    {app.country}
                  </span>
                  <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md bg-gray-50 text-gray-600 text-[10px] font-medium border border-gray-100">
                    <Calendar className="w-3 h-3" />
                    {app.intake}
                  </span>
                  <span
                    className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-md text-[10px] font-bold border ${getStatusBadge(
                      app.primaryStatus
                    )}`}
                  >
                    {app.primaryStatus}
                  </span>
                  {app.hasIssues && (
                    <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md bg-rose-50 text-rose-600 text-[10px] font-bold border border-rose-100">
                      <AlertTriangle className="w-3 h-3" />
                      Issues
                    </span>
                  )}
                </div>

                <p className="text-[10px] text-gray-400 mt-2">
                  Updated {formatTimeAgo(app.updatedAt)}
                </p>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ═══════════════════════════════════════════════════════════════
          ALERTS SECTION
         ═══════════════════════════════════════════════════════════════ */}
      {data?.alerts && data.alerts.total > 0 && (
        <div className="bg-white rounded-2xl border border-gray-100 overflow-hidden">
          {/* Header */}
          <div className="px-5 py-4 border-b border-gray-50 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="relative">
                <Bell className="w-5 h-5 text-gray-700" />
                {data.alerts.critical > 0 && (
                  <span className="absolute -top-1 -right-1 w-2.5 h-2.5 bg-rose-500 rounded-full border-2 border-white" />
                )}
              </div>
              <h3 className="text-base font-bold text-gray-900">
                Alerts
              </h3>
              <span className="px-2 py-0.5 rounded-full bg-gray-100 text-gray-600 text-[10px] font-bold">
                {visibleAlerts.length}
              </span>
            </div>
            {data.alerts.critical > 0 && (
              <span className="px-2 py-0.5 rounded-full bg-rose-50 text-rose-600 text-[10px] font-bold border border-rose-100">
                {data.alerts.critical} Critical
              </span>
            )}
          </div>

          {/* Alert Items */}
          <div className="divide-y divide-gray-50">
            {visibleAlerts.map((alert) => {
              const config = getAlertConfig(alert.severity);
              const AlertIcon = config.icon;

              return (
                <div
                  key={alert.id}
                  className={`relative p-4 ${config.bg} border-l-4 ${config.border.replace("border", "border-l")} transition-all hover:brightness-[0.98]`}
                >
                  <div className="flex items-start gap-3">
                    
                    <div onClick={() => router.push("/dashboard/settings")} className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 flex-wrap mb-1">
                        <h4 className="text-sm font-semibold text-gray-900 leading-tight">
                          {alert.title}
                        </h4>
                        <span
                          className={`px-1.5 py-0.5 rounded text-[10px] font-bold border ${config.badge}`}
                        >
                          {config.badgeText}
                        </span>
                      </div>

                      <p className="text-xs text-gray-500 leading-relaxed mb-1">
                        {alert.message}
                      </p>

                      {alert.impact && (
                        <p className="text-[11px] text-gray-400 italic mb-2">
                          Impact: {alert.impact}
                        </p>
                      )}
                    </div>
                  </div>

                </div>
              );
            })}
          </div>

          {visibleAlerts.length === 0 && (
            <div className="p-8 text-center">
              <Check className="w-8 h-8 text-emerald-400 mx-auto mb-2" />
              <p className="text-sm text-gray-500 font-medium">
                All caught up!
              </p>
              <p className="text-xs text-gray-400">No pending alerts</p>
            </div>
          )}
        </div>
      )}

      {/* ═══════════════════════════════════════════════════════════════
          APPLICATIONS SECTION
         ═══════════════════════════════════════════════════════════════ */}


      {/* ═══════════════════════════════════════════════════════════════
          RECENT ACTIVITIES SECTION
         ═══════════════════════════════════════════════════════════════ */}
      {data?.recentActivities && data.recentActivities.length > 0 && (
        <div className="bg-white rounded-2xl border border-gray-100 overflow-hidden">
          <div className="px-5 py-4 border-b border-gray-50 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Clock className="w-5 h-5 text-gray-700" />
              <h3 className="text-base font-bold text-gray-900">
                Recent Activity
              </h3>
            </div>
          </div>

          <div className="p-3 space-y-1">
            {data.recentActivities.slice(0, 5).map((activity) => {
              const config = getActivityConfig(activity);

              return (
                <div
                  key={activity.id}
                  onClick={() => router.push(`/dashboard/application/${activity.application?.applicationNumber}`)}
                  className={`group flex items-start gap-3 p-3 rounded-xl transition-all duration-200 hover:bg-gray-50 ${
                    !activity.isRead ? "bg-blue-50/30" : ""
                  }`}
                >
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-gray-900 leading-tight">
                      {activity.description ||
                        activity.content ||
                        activity.action}
                    </p>
                    {activity.application && (
                      <p className="text-[11px] text-gray-400 mt-0.5">
                        App: {activity.application.applicationNumber}
                      </p>
                    )}
                    <div className="flex items-center gap-2 mt-1.5">
                      <span className="text-[11px] text-gray-400 font-medium">
                        {formatTimeAgo(activity.createdAt)}
                      </span>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* ═══════════════════════════════════════════════════════════════
          QUICK ACTIONS SECTION
         ═══════════════════════════════════════════════════════════════ */}
      {/* {data?.quickActions && data.quickActions.length > 0 && (
        <div className="bg-white rounded-2xl border border-gray-100 p-5">
          <div className="flex items-center gap-2 mb-4">
            <Rocket className="w-5 h-5 text-gray-700" />
            <h3 className="text-base font-bold text-gray-900">
              Quick Actions
            </h3>
          </div>

          <div className="space-y-2.5">
            {data.quickActions.map((action, i) => {
              const config = getQuickActionConfig(action.type, action.priority);
              const ActionIcon = getQuickActionIcon(action.label);

              return (
                <button
                  key={i}
                  onClick={() => router.push(action.route)}
                  className={`w-full flex items-center justify-between px-4 py-3 rounded-xl border transition-all duration-200 group ${config.bg} ${config.border} hover:shadow-sm hover:scale-[1.01]`}
                >
                  <div className="flex items-center gap-3">
                    <div
                      className={`w-9 h-9 rounded-lg flex items-center justify-center ${config.iconBg}`}
                    >
                      <ActionIcon className={`w-4 h-4 ${config.iconColor}`} />
                    </div>
                    <div className="text-left">
                      <span className="text-sm font-semibold text-gray-800 block">
                        {action.label}
                      </span>
                      {action.reason && (
                        <span className="text-[11px] text-gray-400">
                          {action.reason}
                        </span>
                      )}
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    {action.priority === "critical" && (
                      <span className="px-2 py-0.5 rounded-full bg-rose-100 text-rose-600 text-[10px] font-bold">
                        Urgent
                      </span>
                    )}
                    <ChevronRight
                      className={`w-4 h-4 transition-all group-hover:translate-x-0.5 ${config.arrowColor}`}
                    />
                  </div>
                </button>
              );
            })}
          </div>
        </div>
      )} */}
    </div>
  );
};