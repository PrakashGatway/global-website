"use client"

import { useGlobal } from "../../src/statecontext"
import MultiStepForm from "../../components/dashboard/stepForm/multiform"
import RewardSlider from "../../components/dashboard/sliderbanner/bannerslider"
import Loading from "../loading"



export default function DashboardPage() {
  const { profile, loading } = useGlobal()

  if (loading) {
    <Loading />
  }
  if (!loading && !profile) {
    window.location.replace("/login")
  }

  return (
    <main className="flex-1 overflow-y-auto">
      <RewardSlider />
      <div className="p-4 md:p-8 space-y-6">
        <MultiStepForm />
      </div>
    </main>
  )
}
