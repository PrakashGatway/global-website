"use client"

import { useGlobal } from "../../src/statecontext"
import MultiStepForm from "../../components/dashboard/stepForm/multiform"
import RewardSlider, { StepProgress } from "../../components/dashboard/sliderbanner/bannerslider"
import axiosInstance from "../axiosInstance"
import { useEffect, useState } from "react"
import OfferSlider from "@/components/dashboard/sliderbanner/offerSlider"
import ApplicationHistoryPage from "./application/page"
import { Mail, Phone } from "lucide-react"
import Dashboardcounsellor from "@/components/dashboard/counsellerDashboard/dashboard"

export default function DashboardPage() {
  const { profile, loading,allProfile } = useGlobal()
  const [universities, setUniversities] = useState([])
  const [offers, setOffers] = useState([])

  const fetchUniversities = async () => {
    try {
      const response = await axiosInstance.get('/universities/flat?limit=10');
      setUniversities(response.data?.data);
    } catch (error) {
      console.error('Error fetching universities:', error);
    }
  };

  const fetchOffer = async () => {
    try {
      const response = await axiosInstance.get('/coupons/available/list');
      setOffers(response.data?.data);
    } catch (error) {
      console.error('Error fetching offers:', error);
    }
  };

  console.log(allProfile)

  useEffect(() => {
    fetchUniversities();
    fetchOffer();
  }, [])

  if (!loading && !profile) {
    if (typeof window !== "undefined") {
      window.location.replace("/login")
    }
    return null
  }

  return (
  <main className="flex-1 sm:px-4 max-w-7xl mx-auto space-y-4 overflow-y-auto">

  {allProfile?.data?.role === "counsellor" ? (
    

    <Dashboardcounsellor />

  ) : (

    <>
      {/* Student Dashboard */}

      <div className="flex flex-col lg:flex-row gap-4">

        <div className="w-full lg:w-3/4">
          {universities?.length > 0 && (
            <RewardSlider universities={universities} />
          )}
        </div>

        <div className="hidden sm:block w-full lg:w-1/4">
          {offers?.length > 0 && (
            <OfferSlider offers={offers} />
          )}
        </div>
      </div>

      <StepProgress />

      <ApplicationHistoryPage
        heading="Recent Applications"
        subheading=""
        limit={3}
        viewAll={true}
      />

      {/* More Student Components */}
    </>

  )}

</main>
  )
}