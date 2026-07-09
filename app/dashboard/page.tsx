// app/dashboard/page.tsx or wherever your DashboardPage is
"use client";

import { useGlobal } from "@/src/statecontext";
import DashboardCounsellor from "@/components/dashboard/counsellerDashboard/dashboard";
import { Rigthsidebar } from "@/components/dashboard/application/rightsidebar";
import UserDashboard from "@/components/dashboard/userDashboard/userDashboard";
import Blogs from "@/components/Blogs/blogs";

export default function DashboardPage() {
  const { allProfile } = useGlobal();

  if (!allProfile) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-blue-500 border-t-transparent rounded-full animate-spin mx-auto mb-4" />
          <p className="text-gray-500">Loading...</p>
        </div>
      </div>
    );
  }

  // If counsellor, show counsellor dashboard
  if (allProfile?.data?.role === "counsellor") {
    return <DashboardCounsellor />;
  }

    if (allProfile?.data?.role === "manager") {
    return < Blogs/>;
  }

  // If user/student, show the new dynamic dashboard
  return (
    <div className="min-h-screen">
      <div className="max-w-[1600px] mx-auto">
        <UserDashboard />
      </div>
    </div>
  );
}