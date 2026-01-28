"use client"

import React, { useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import {
  Mail,
  User,
  Phone,
  Key,
  ArrowLeft,
  CheckCircle,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import axiosInstance from "../axiosInstance"

type AuthMode = "email" | "register" | "otp" | "success"

export default function LoginPage() {


  const [mode, setMode] = useState<AuthMode>("email")
  const [email, setEmail] = useState("")
  const [otp, setOtp] = useState("")
  const [loading, setLoading] = useState(false)
  const [termsAccepted, setTermsAccepted] = useState(true)

  const [formData, setFormData] = useState({
    name: "",
    phone: "",
  })

  /* ================= EMAIL VERIFY ================= */
  const checkEmail = async () => {
    try {
      setLoading(true)

      const res = await axiosInstance.get(
        `/auth/login?email=${email}`
      )

      if (res.data.isExist) {
        setMode("otp")
      } else {
        setMode("register")
      }
    } catch (err) {
      alert("Email verification failed")
    } finally {
      setLoading(false)
    }
  }

  /* ================= REGISTER ================= */
  const handleRegister = async () => {
    try {
      setLoading(true)

      await axiosInstance.post("/auth/send-otp", {
        email,
        ...formData,
      })

    
      setMode("otp")
    } catch (err) {
      alert("Registration failed")
    } finally {
      setLoading(false)
    }
  }

  /* ================= VERIFY OTP ================= */
  const verifyOtp = async () => {
    try {
      setLoading(true)

      const res = await axiosInstance.post("/auth/verify-otp", {
        email,
        otp,
      })

      if (res.data.token) {
        localStorage.setItem("token", res.data.token)
        setMode("success")

        setTimeout(() => {
          window.location.href = "/dashboard"
        }, 1200)
      }
    } catch (err) {
      alert("Invalid OTP")
    } finally {
      setLoading(false)
    }
  }

  return (
    <main className="min-h-screen flex flex-col lg:flex-row overflow-hidden">

      {/* LEFT IMAGE */}
     <div className="relative w-full lg:w-1/2 min-h-[280px] lg:h-screen overflow-hidden">

  {/* BACKGROUND IMAGE */}
  <div
    className="
      absolute
      inset-0
      lg:-left-80 lg:-top-60
      h-full
      w-full lg:w-[130%]
      lg:rotate-[10deg]
      overflow-hidden
      rounded-none lg:rounded-br-[170px]
    "
  >
    <img
      src="/images/login-img.jpeg"
      className="w-full h-full object-cover"
      alt=""
    />
    <div className="absolute inset-0 bg-black/40 lg:bg-black/25" />
  </div>

  {/* TEXT CONTENT */}
  <div
    className="
      relative
      z-10
      px-6
      pt-20
      lg:absolute
      lg:top-32
      lg:left-16
      text-white
    "
  >
    <p className="text-lg sm:text-xl lg:text-2xl">
      Your Gateway to
    </p>

    <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold leading-tight">
      Global Education
    </h1>
  </div>

</div>


      {/* RIGHT CARD */}
      <div className="w-full lg:w-1/2 flex items-center justify-center px-6 py-12 relative">
      
      <div className="absolute top-5 w-[180px] sm:w-[260px] lg:w-[600px] hidden lg:block">

    <img src="/images/login-aero.png" alt="" />
  </div>

        <div
  className="
    relative
    w-full
    max-w-md
    bg-white
    rounded-tl-[80px] sm:rounded-tl-[100px] lg:rounded-tl-[120px]
    p-5 sm:p-6 lg:p-8
    h-auto lg:h-[520px]
    sm:w-[500px]
    shadow-[0_8px_1px_-6px_rgba(0,0,0,0.16)]
  "
>

  
  <div className="absolute -top-5 left-18 w-[80px] sm:w-[100px] lg:w-[70px] hidden lg:block">
  <img src="/images/login-girl-3.png" alt="" />
</div>

  <div className="absolute -left-40 -top-18  lg:w-[280px] hidden lg:block -z-10 ">

    <img src="/images/login-girl-1.png" alt="" />
    
  </div>
  <div className="absolute -left-40 top-20 lg:w-[260px] hidden lg:block z-10">
  <img src="/images/login-girl-2.png" alt="" />
</div>


          <div className="flex justify-center mb-4">
            <img src="/images/logo.png" className="h-20" />
          </div>

         <div
  className="
    relative
    lg:absolute
    inset-0
    lg:top-28
    bg-white
    rounded-tl-[60px] sm:rounded-tl-[70px] lg:rounded-tl-[90px]
    px-4 sm:px-6
    py-6 sm:py-8
    border border-gray-100
    shadow-[0_-8px_10px_-6px_rgba(0,0,0,0.16)]
  "
>


            <AnimatePresence mode="wait">

              {/* EMAIL */}
              {mode === "email" && (
                <motion.div
                  key="email"
                  initial={{ opacity: 0, x: 40 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -40 }}
                  className="space-y-6 py-10"
                >
                  <h2 className="text-xl text-orange-500 font-bold text-center">
                    Welcome to Gateway Abroad
                  </h2>

                  <p className="text-center text-gray-500">enter your email to get started</p>

                  <div className="flex flex-col gap-3"> <Label>Email Address</Label>
                    <Input
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="Enter your email"
                      className="
    !rounded-bl-[15px] 
    rounded-[0px]
    focus-visible:ring-2
    focus-visible:ring-[#626363]
    focus-visible:border-[#626363]
  "
                    />

                  </div>
                  {/* TERMS & CONDITIONS */}
                  {/* TERMS & CONDITIONS */}
                  <div className="flex items-start gap-3 bg-gray-100 rounded-md px-4 py-3 text-sm">

                    {/* ROUND CHECKBOX */}
                    <button
                      type="button"
                      onClick={() => setTermsAccepted(!termsAccepted)}
                      className={`
      w-5 h-5 mt-1  border-2 flex items-center justify-center
      transition-all duration-200 rounded-full
      ${termsAccepted
                          ? "bg-orange-500 border-orange-500"
                          : "border-gray-400 bg-white"
                        }
    `}
                    >
                      {termsAccepted && (
                        <svg
                          className="w-3 h-3 text-white"
                          fill="none"
                          stroke="currentColor"
                          strokeWidth="3"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            d="M5 13l4 4L19 7"
                          />
                        </svg>
                      )}
                    </button>

                    {/* TEXT */}
                    <p className="text-gray-600 leading-snug">
                      I agree to the{" "}
                      <a href="/terms-condition">
                        <span className="text-orange-500 font-medium cursor-pointer hover:underline">
                          Terms & Conditions
                        </span>
                      </a>
                      {" "}
                      and{" "}
                      <a href="/privacy-policy">
                        <span className="text-orange-500 font-medium cursor-pointer hover:underline">
                          Privacy Policy
                        </span></a>

                    </p>
                  </div>





                  <Button
                    className="
    w-full
    bg-[#626363]
    !rounded-bl-[15px]
    rounded-[0px]
    hover:bg-[#f46c44]
  "
                    onClick={checkEmail}
                    disabled={loading || !termsAccepted}
                  >
                    {loading ? "Checking..." : "Continue"}
                  </Button>


                </motion.div>
              )}

              {/* REGISTER */}
              {mode === "register" && (
                <motion.div
                  key="register"
                  initial={{ opacity: 0, x: 40 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -40 }}
                  className="space-y-4 lg:py-15"
                >
                  <button
                    onClick={() => setMode("email")}
                    className="text-sm flex items-center gap-1 text-gray-500"
                  >
                    <ArrowLeft size={16} /> Back
                  </button>

                  {/* EMAIL (auto-filled) */}
                  <Label>Email Address : <span>{email}</span></Label>


                  {/* FULL NAME */}
                  <Label>Full Name</Label>
                  <Input
                    value={formData.name}
                    onChange={(e) =>
                      setFormData({ ...formData, name: e.target.value })
                    }
                    placeholder="Enter your full name"
                  />

                  {/* PHONE */}
                  <Label>Phone Number</Label>
                  <Input
                    value={formData.phone}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        phone: e.target.value,
                      })
                    }
                    placeholder="Enter phone number"
                  />

                  <Button
                    className="w-full bg-red-600"
                    onClick={handleRegister}
                    disabled={loading}
                  >
                    {loading ? "Sending OTP..." : "Send OTP"}
                  </Button>
                </motion.div>
              )}


              {/* OTP */}
              {mode === "otp" && (
                <motion.div
                  key="otp"
                  initial={{ opacity: 0, x: 40 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -40 }}
                  className="space-y-6 py-30"
                >
                  <Label>Enter OTP</Label>
                  <Input
                    value={otp}
                    onChange={(e) => setOtp(e.target.value)}
                    placeholder="123456"
                  />

                  <Button
                    className="w-full bg-red-600"
                    onClick={verifyOtp}
                    disabled={loading}
                  >
                    {loading ? "Verifying..." : "Verify"}
                  </Button>
                </motion.div>
              )}

              {/* SUCCESS */}
              {mode === "success" && (
                <motion.div
                  key="success"
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="text-center space-y-6"
                >
                  <CheckCircle className="w-16 h-16 text-green-600 mx-auto" />
                  <h2 className="text-xl font-bold">
                    Authentication Successful
                  </h2>
                  <p className="text-gray-600">
                    Redirecting to dashboard...
                  </p>
                </motion.div>
              )}

            </AnimatePresence>
          </div>
        </div>
      </div>
    </main>
  )
}
