"use client"

import { useGlobal } from "../../src/statecontext"
import MultiStepForm from "../../components/dashboard/stepForm/multiform"
import RewardSlider, { StepProgress } from "../../components/dashboard/sliderbanner/bannerslider"
import axiosInstance from "../axiosInstance"
import { useEffect, useState } from "react"
import OfferSlider from "@/components/dashboard/sliderbanner/offerSlider"
import ApplicationHistoryPage from "./application/page"
import { Mail, Phone } from "lucide-react"

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
      console.error('Error fetching offers:', error);
    }
  };

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

      {/* Top Section */}
      <div className="flex flex-col lg:flex-row gap-4">

        {/* Left (Universities Slider) */}
        <div className="w-full lg:w-3/4">
          {universities?.length > 0 && (
            <RewardSlider universities={universities} />
          )}
        </div>

        {/* Right (Offers Slider) */}
        <div className="hidden sm:block w-full lg:w-1/4">
          {offers?.length > 0 && (
            <OfferSlider offers={offers} />
          )}
        </div>
      </div>

      {/* Progress */}
      <StepProgress />
      <ApplicationHistoryPage heading="Recent Applications" subheading="" limit={3} viewAll={true} />
      <div className="block sm:hidden w-full lg:w-1/4">
        {offers?.length > 0 && (
          <OfferSlider offers={offers} />
        )}
      </div>

      <div className="bg-gray-100 rounded-xl p-5 sm:p-6 md:p-8">

        {/* Title */}
        <h2 className="text-lg sm:text-xl md:text-2xl font-semibold text-gray-800">
          Need Help Applying?
        </h2>

        <p className="text-sm sm:text-base text-gray-600 mt-2">
          Contact your advisor at ApplyBoard.
        </p>

        {/* Content */}
        <div className="flex flex-col md:flex-row md:items-center gap-6 mt-6">

          {/* Left Logo Section */}
          <div className="flex items-center gap-3 md:w-1/3">
            <div className="bg-blue-100 p-3 rounded-full">
              🎓
            </div>
            <span className="text-lg font-medium text-gray-800">
              Ooshas Global
            </span>
          </div>

          {/* Divider (only desktop) */}
          <div className="hidden md:block h-12 w-px bg-gray-300"></div>

          {/* Contact Info */}
          <div className="space-y-3 md:w-2/3">

            <div className="flex items-center gap-3 text-gray-700">
              <Mail size={18} />
              <span className="text-sm sm:text-base">
                info@ooshasglobal.com
              </span>
            </div>

            <div className="flex items-center gap-3 text-gray-700">
              <Phone size={18} />
              <span className="text-sm sm:text-base">
                +91 9875863347
              </span>
            </div>

          </div>
        </div>

        {/* Footer */}
        <div className="text-center mt-6">
          <a
            href="#"
            className="text-purple-600 text-sm hover:underline"
          >
            © 2026 ApplyBoard.com
          </a>
        </div>
      </div>

    </main>
  )
}