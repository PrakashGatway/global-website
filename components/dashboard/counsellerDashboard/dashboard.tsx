"use client"

import { useEffect, useState } from "react"
import { motion } from "framer-motion"
import {
  Users,
  AlertCircle,
  MessageSquare,
  FileText,
  Sparkles,
  Globe,
  TrendingUp,
  Activity,
  CheckCircle2,
  Clock,
  XCircle,
} from "lucide-react"
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid,
} from "recharts"
import axiosInstance from "@/app/axiosInstance" // Adjust path if needed

// --- INTERFACES ---
interface DashboardData {
  overview: {
    totalAssignedUsers: number;
    activeUsers: number;
    totalApplications: number;
    totalRevenue: number;
    openTickets: number;
    unreadMessages: number;
  };
  users: {
    total: number;
    active: number;
    byStatus: Record<string, number>;
    newUsers: { today: number; thisWeek: number; thisMonth: number };
    activeLast7Days: number;
  };
  applications: {
    total: number;
    byStatus: {
      pending: number;
      inProgress: number;
      offerReceived: number;
      visaProcessing: number;
      completed: number;
      refused: number;
      withdrawn: number;
    };
    rawStatusCounts: Record<string, number>;
    topCountries: { _id: string; count: number }[];
    newApplications: { today: number; thisWeek: number; thisMonth: number };
    recent: any[];
  };
  support: {
    total: number;
    byStatus: { open: number; pending: number; resolved: number; closed: number };
    byPriority: Record<string, number>;
    recent: any[];
  };
  visaProcessing: {
    total: number;
    byCountry: Record<string, number>;
  };
  communications: {
    total: number;
    unread: number;
    recent: any[];
  };
  revenue: {
    total: number;
    today: number;
    thisWeek: number;
    thisMonth: number;
    completedPurchases: number;
    recentPurchases: any[];
  };
  metrics: {
    applicationConversionRate: string;
    offerRate: string;
    completionRate: string;
    supportResolutionRate: string;
    activeUserRate: string;
  };
}

// --- HELPER COMPONENTS (Sharp Borders Only) ---
function StatCard({ title, value, icon: Icon, color }: any) {
  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-white border border-slate-200 p-6 flex items-center justify-between border-2"
    >
      <div>
        <p className="text-sm font-medium text-slate-500">{title}</p>
        <h3 className="text-3xl font-bold text-slate-900 mt-2">{value}</h3>
      </div>
      <div className={`p-3 ${color} text-white`}>
        <Icon className="w-6 h-6" />
      </div>
    </motion.div>
  )
}

function MetricBar({ label, value }: any) {
  const numValue = parseFloat(value) || 0;
  return (
    <div>
      <div className="flex justify-between text-sm mb-2">
        <span className="font-medium text-slate-700">{label}</span>
        <span className="font-bold text-slate-900">{value}%</span>
      </div>
      <div className="w-full bg-slate-100 h-2">
        <motion.div 
          initial={{ width: 0 }}
          animate={{ width: `${Math.min(numValue, 100)}%` }}
          transition={{ duration: 1, ease: "easeOut" }}
          className="bg-orange-600 h-2" 
        />
      </div>
    </div>
  )
}

// --- MAIN DASHBOARD COMPONENT ---
export default function DashboardCounsellor() {
  const [data, setData] = useState<DashboardData | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  const fetchDashboard = async () => {
    try {
      setIsLoading(true)
      const res = await axiosInstance.get("/dashboard/counsellor")
      setData(res?.data?.data)
    } catch (error) {
      console.error("Error fetching dashboard:", error)
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    fetchDashboard()
  }, [])

  if (isLoading || !data) {
    return (
      <div className="min-h-screen p-8 flex items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <div className="w-12 h-12 border-4 border-orange-600 border-t-transparent animate-spin"></div>
          <p className="text-slate-600 font-medium">Loading Dashboard...</p>
        </div>
      </div>
    )
  }

  const statusColors: Record<string, string> = {
    pending: "bg-yellow-500",
    inProgress: "bg-blue-500",
    offerReceived: "bg-purple-500",
    visaProcessing: "bg-indigo-500",
    completed: "bg-emerald-500",
    refused: "bg-red-500",
    withdrawn: "bg-slate-500",
  };

  return (
    <div className="min-h-screen p-4">
      <div className="max-w-[1600px] mx-auto">
    
        {/* Row 1: Overview Stats */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-3 mb-3">
          <StatCard title="Total Students" value={data.overview.totalAssignedUsers} icon={Users} color="bg-blue-600" />
          <StatCard title="Total Applications" value={data.overview.totalApplications} icon={FileText} color="bg-orange-600" />
          <StatCard title="Open Tickets" value={data.overview.openTickets} icon={AlertCircle} color="bg-red-600" />
          <StatCard title="Unread Messages" value={data.overview.unreadMessages} icon={MessageSquare} color="bg-emerald-600" />
        </div>

        {/* Row 2: Chart & Students Overview */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-3 mb-3">
          {/* Applications by Country */}
          <div className="lg:col-span-2 bg-white border border-slate-200 p-6 border-2">
            <div className="flex items-center justify-between mb-6">
              <div>
                <h3 className="text-base font-bold text-slate-900">Applications by Country</h3>
                <p className="text-sm text-slate-500">Top destination countries for your students</p>
              </div>
              <Globe className="w-5 h-5 text-orange-600" />
            </div>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={data.applications.topCountries} margin={{ top: 20, right: 30, left: 0, bottom: 5 }}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" />
                <XAxis dataKey="_id" axisLine={false} tickLine={false} tick={{ fill: '#64748b', fontSize: 12 }} />
                <YAxis axisLine={false} tickLine={false} tick={{ fill: '#64748b', fontSize: 12 }} />
                <Tooltip 
                  cursor={{ fill: '#f1f5f9' }}
                  contentStyle={{ 
                    backgroundColor: '#fff', 
                    border: '1px solid #e2e8f0', 
                    borderRadius: '0px', 
                    boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' 
                  }} 
                />
                <Bar dataKey="count" fill="#ea580c" barSize={40} />
              </BarChart>
            </ResponsiveContainer>
          </div>

          {/* Students Overview */}
          <div className="bg-white border border-slate-200 p-6 border-2">
            <h3 className="text-base font-bold text-slate-900 mb-6">Students Overview</h3>
            <div className="grid grid-cols-2 gap-4">
              <div className="p-4 bg-slate-50 border border-slate-200">
                <p className="text-xs text-slate-500 uppercase font-medium">Total</p>
                <p className="text-2xl font-bold text-slate-900 mt-1">{data.users.total}</p>
              </div>
              <div className="p-4 bg-slate-50 border border-slate-200">
                <p className="text-xs text-slate-500 uppercase font-medium">Active</p>
                <p className="text-2xl font-bold text-slate-900 mt-1">{data.users.active}</p>
              </div>
              <div className="p-4 bg-slate-50 border border-slate-200">
                <p className="text-xs text-slate-500 uppercase font-medium">New (Week)</p>
                <p className="text-2xl font-bold text-slate-900 mt-1">{data.users.newUsers.thisWeek}</p>
              </div>
              <div className="p-4 bg-slate-50 border border-slate-200">
                <p className="text-xs text-slate-500 uppercase font-medium">Active (7D)</p>
                <p className="text-2xl font-bold text-slate-900 mt-1">{data.users.activeLast7Days}</p>
              </div>
            </div>
            
            <div className="mt-6 pt-6 border-t border-slate-200">
              <h4 className="text-sm font-bold text-slate-900 mb-3">New Applications</h4>
              <div className="flex justify-between text-sm">
                <span className="text-slate-600">Today</span>
                <span className="font-bold text-orange-600">{data.applications.newApplications.today}</span>
              </div>
              <div className="flex justify-between text-sm mt-2">
                <span className="text-slate-600">This Week</span>
                <span className="font-bold text-orange-600">{data.applications.newApplications.thisWeek}</span>
              </div>
              <div className="flex justify-between text-sm mt-2">
                <span className="text-slate-600">This Month</span>
                <span className="font-bold text-orange-600">{data.applications.newApplications.thisMonth}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Row 3: Status, Metrics, Revenue & Visa */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-3 mb-3">
          {/* Application Status Breakdown */}
          <div className="bg-white border border-slate-200 p-6 border-2">
            <h3 className="text-base font-bold text-slate-900 mb-6">Application Status</h3>
            <div className="space-y-4">
              {Object.entries(data.applications.byStatus).map(([status, count]) => {
                const percentage = data.applications.total > 0 ? ((count as number / data.applications.total) * 100) : 0;
                return (
                  <div key={status}>
                    <div className="flex justify-between text-sm mb-1">
                      <span className="font-medium text-slate-700 capitalize">{status.replace(/([A-Z])/g, ' $1').trim()}</span>
                      <span className="font-bold text-slate-900">{count as number}</span>
                    </div>
                    <div className="w-full bg-slate-100 h-2">
                      <motion.div 
                        initial={{ width: 0 }}
                        animate={{ width: `${percentage}%` }}
                        transition={{ duration: 1 }}
                        className={`${statusColors[status] || 'bg-orange-500'} h-2`} 
                      />
                    </div>
                  </div>
                )
              })}
            </div>
          </div>

          {/* Performance Metrics */}
          <div className="bg-white border border-slate-200 p-6 border-2">
            <div className="flex items-center gap-2 mb-6">
              <TrendingUp className="w-5 h-5 text-orange-600" />
              <h3 className="text-base font-bold text-slate-900">Performance Metrics</h3>
            </div>
            <div className="space-y-6">
              <MetricBar label="Application Conversion" value={data.metrics.applicationConversionRate} />
              <MetricBar label="Offer Rate" value={data.metrics.offerRate} />
              <MetricBar label="Completion Rate" value={data.metrics.completionRate} />
              <MetricBar label="Support Resolution" value={data.metrics.supportResolutionRate} />
              <MetricBar label="Active User Rate" value={data.metrics.activeUserRate} />
            </div>
          </div>

          {/* Revenue & Visa */}
          <div className="bg-white border border-slate-200 p-6 border-2 flex flex-col justify-between">
            <div>
              <h3 className="text-base font-bold text-slate-900 mb-4">Revenue & Visa</h3>
              <div className="space-y-3 mb-6">
                <div className="flex justify-between items-center p-3 bg-slate-50 border border-slate-200">
                  <span className="text-sm font-medium text-slate-600">Total Revenue</span>
                  <span className="text-base font-bold text-slate-900">₹{data.revenue.total.toLocaleString()}</span>
                </div>
                <div className="grid grid-cols-3 gap-2">
                  <div className="p-2 bg-slate-50 border border-slate-200 text-center">
                    <p className="text-xs text-slate-500">Today</p>
                    <p className="font-bold text-slate-900 text-sm">₹{data.revenue.today.toLocaleString()}</p>
                  </div>
                  <div className="p-2 bg-slate-50 border border-slate-200 text-center">
                    <p className="text-xs text-slate-500">Week</p>
                    <p className="font-bold text-slate-900 text-sm">₹{data.revenue.thisWeek.toLocaleString()}</p>
                  </div>
                  <div className="p-2 bg-slate-50 border border-slate-200 text-center">
                    <p className="text-xs text-slate-500">Month</p>
                    <p className="font-bold text-slate-900 text-sm">₹{data.revenue.thisMonth.toLocaleString()}</p>
                  </div>
                </div>
              </div>
            </div>
            
            <div className="border-t border-slate-200 pt-4">
              <div className="flex items-center gap-2 mb-3">
                <Globe className="w-4 h-4 text-orange-600" />
                <h4 className="font-bold text-slate-900">Visa Processing</h4>
                <span className="ml-auto text-sm font-bold text-slate-900 bg-orange-100 px-2 py-0.5 border border-orange-200">{data.visaProcessing.total}</span>
              </div>
              <div className="flex flex-wrap gap-2">
                {Object.entries(data.visaProcessing.byCountry).length > 0 ? (
                  Object.entries(data.visaProcessing.byCountry).map(([country, count]) => (
                    <span key={country} className="text-xs font-medium px-2 py-1 bg-slate-100 text-slate-700 border border-slate-200">
                      {country}: {count as number}
                    </span>
                  ))
                ) : (
                  <p className="text-xs text-slate-500">No active visa processing</p>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Row 4: Recent Activities */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-3">
          {/* Recent Applications */}
          <div className="bg-white border border-slate-200 p-6 border-2">
            <h3 className="text-base font-bold text-slate-900 mb-4">Recent Applications</h3>
            <div className="space-y-3">
              {data.applications.recent.slice(0, 5).map((app: any) => (
                <div key={app._id} className="flex items-center justify-between p-3 border border-slate-100 hover:bg-slate-50 transition-colors">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-orange-100 text-orange-600 flex items-center justify-center font-bold text-sm border border-orange-200">
                      {app.student.name.charAt(0)}
                    </div>
                    <div>
                      <p className="font-semibold text-slate-900 text-sm">{app.student.name}</p>
                      <p className="text-xs text-slate-500">{app.course.name}</p>
                    </div>
                  </div>
                  <span className="text-xs font-medium px-2 py-1 bg-slate-100 text-slate-700 border border-slate-200">
                    {app.primaryStatus}
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* Recent Support Tickets */}
          <div className="bg-white border border-slate-200 p-6 border-2">
            <h3 className="text-base font-bold text-slate-900 mb-4">Recent Tickets</h3>
            <div className="space-y-3">
              {data.support.recent.slice(0, 5).map((ticket: any) => (
                <div key={ticket._id} className="flex items-center justify-between p-3 border border-slate-100 hover:bg-slate-50 transition-colors">
                  <div className="flex items-center gap-3">
                    <div className={`w-10 h-10 flex items-center justify-center border ${ticket.status === 'open' ? 'bg-red-100 text-red-600 border-red-200' : 'bg-emerald-100 text-emerald-600 border-emerald-200'}`}>
                      {ticket.status === 'open' ? <AlertCircle className="w-5 h-5" /> : <CheckCircle2 className="w-5 h-5" />}
                    </div>
                    <div>
                      <p className="font-semibold text-slate-900 text-sm">{ticket.subject}</p>
                      <p className="text-xs text-slate-500">{ticket.user.name}</p>
                    </div>
                  </div>
                  <span className={`text-xs font-medium px-2 py-1 border ${ticket.status === 'open' ? 'bg-red-50 text-red-700 border-red-200' : 'bg-emerald-50 text-emerald-700 border-emerald-200'}`}>
                    {ticket.status}
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* Recent Communications */}
          <div className="bg-white border border-slate-200 p-6 border-2">
            <h3 className="text-base font-bold text-slate-900 mb-4">Recent Messages</h3>
            <div className="space-y-3">
              {data.communications.recent.slice(0, 5).map((comm: any) => (
                <div key={comm._id} className="flex items-center justify-between p-3 border border-slate-100 hover:bg-slate-50 transition-colors">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-blue-100 text-blue-600 flex items-center justify-center font-bold text-sm border border-blue-200">
                      {comm.user.name.charAt(0)}
                    </div>
                    <div>
                      <p className="font-semibold text-slate-900 text-sm">{comm.user.name}</p>
                      <p className="text-xs text-slate-500 truncate max-w-[150px]">{comm.content || comm.description}</p>
                    </div>
                  </div>
                  <span className="text-xs text-slate-400">
                    {new Date(comm.createdAt).toLocaleDateString()}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>

      </div>
    </div>
  )
}