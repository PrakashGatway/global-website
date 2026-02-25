"use client"

import { useGlobal } from "../../src/statecontext"
import MultiStepForm from "../../components/dashboard/stepForm/multiform"
import RewardSlider, { StepProgress } from "../../components/dashboard/sliderbanner/bannerslider"
import Loading from "../loading"
import axiosInstance from "../axiosInstance"
import { useEffect, useState } from "react"
import OfferSlider from "@/components/dashboard/sliderbanner/offerSlider"



export default function DashboardPage() {
  const { profile, loading } = useGlobal()
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
      console.error('Error fetching universities:', error);
    }
  };



  useEffect(() => {
    fetchUniversities();
    fetchOffer();
  }, [])

  if (loading) {
    return <Loading />;
  }
  if (!loading && !profile) {
    window.location.replace("/login")
  }



  return (
    <main className="flex-1 px-6  max-w-7xl mx-auto space-y-4 overflow-y-auto">
      <div className="flex gap-2">
        <div className="w-[75%]">
          {universities && universities.length > 0 &&
          <RewardSlider universities={universities && universities} />}
        </div>
        <div className="w-[25%]">
          {offers && offers.length > 0 &&
          <OfferSlider offers={offers} />}
        </div>

      </div>

      <StepProgress currentStep={4} />
      <div className="p-4 md:p-8 space-y-6">
        {/* <MultiStepForm /> */}
      </div>
    </main>
  )
}
