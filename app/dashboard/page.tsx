"use client"

import { useEffect, useState } from "react"
import { motion } from "framer-motion"
import { useGlobal } from "../../src/statecontext"
import MultiStepForm from "./stepForm/multiform"
import RewardSlider from "./sliderbanner/bannerslider"





export default function DashboardPage() {
const {profile, loading} = useGlobal()

  // const [sidebarOpen, setSidebarOpen] = useState(useIsMobile()? false : true)

  
  

  return (
        <main className="flex-1 overflow-y-auto">
          <RewardSlider/>
          <div className="p-4 md:p-8 space-y-6">
          
         

    <MultiStepForm/>
      
          </div>
        </main>
  )
}
