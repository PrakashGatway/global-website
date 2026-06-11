"use client"

import React, { useEffect, useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import {
  Mail,
  ArrowLeft,
  CheckCircle,
  Loader2,
} from "lucide-react"
import axiosInstance from "../../app/axiosInstance"

type AuthMode = "email" | "register" | "otp" | "success"

export default function LoginPage() {
  const [mode, setMode] = useState<AuthMode>("email")
  const [email, setEmail] = useState("")
  const [otp, setOtp] = useState("")
  const [loading, setLoading] = useState(false)
  const [termsAccepted, setTermsAccepted] = useState(true)
  const [referralCode, setReferralCode] = useState("")

  const [formData, setFormData] = useState({
    name: "",
    phone: "",
  })

  useEffect(() => {
    const params = new URLSearchParams(window.location.search)
    const code = params.get("code")

    if (code) {
      setReferralCode(code.toUpperCase())
    }
  }, [])

  /* ================= EMAIL VERIFY ================= */
  const checkEmail = async () => {
    if (!email.match(/^[^\s@]+@[^\s@]+\.[^\s@]+$/)) {
      alert("Please enter a valid email address")
      return
    }

    try {
      setLoading(true)
      const res = await axiosInstance.get(`/auth/login?email=${email}`)

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
    if (!formData.name.trim()) {
      alert("Please enter your full name")
      return
    }
    if (!formData.phone.match(/^[0-9]{10}$/)) {
      alert("Please enter a valid 10-digit phone number")
      return
    }

    try {
      setLoading(true)
      await axiosInstance.post("/auth/send-otp", {
        email,
        ...formData,
        referalby: referralCode.trim() || null,
      })

      setMode("otp")
    } catch (err: any) {
      alert(err.response?.data?.message || "Registration failed")
    } finally {
      setLoading(false)
    }
  }

  const verifyOtp = async () => {
    if (!otp.match(/^[0-9]{6}$/)) {
      alert("Please enter a valid 6-digit OTP")
      return
    }

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
          console.log(res.data)
        if(res.data.role === "user"){
          window.location.href = !res.data.hasPreference ? "/onboarding" : "/dashboard"
        } else {
          window.location.href =  "/dashboard"
        }
        }, 1000)
      }
    } catch (err) {
      alert("Invalid OTP")
    } finally {
      setLoading(false)
    }
  }

  const countries = [
    { code: "DE", name: "Germany" },
    { code: "GB", name: "UK" },
    { code: "IT", name: "Italy" },
    { code: "AU", name: "Australia" },
    { code: "CA", name: "Canada" },
    { code: "US", name: "USA" },
    { code: "FR", name: "France" },
    { code: "IE", name: "Ireland" },
  ]

  return (
    <main className="min-h-screen bg-white ">
      <div className="bg-white lg:p-[4vh]">

        <div className="bg-[#fff0eb] flex flex-col lg:flex-row overflow-hidden">
          <div
            className="relative w-full hidden lg:block lg:w-1/2 min-h-[400px] lg:h-[92vh] overflow-hidden bg-cover bg-center bg-no-repeat"
            style={{
              backgroundImage: "url('/login/lg.png')",
            }}
          >
            <div className="absolute top-1/3 right-0">
              <img
                src="/login/pg.png"
                alt="login airplane"
                className="w-80 object-cover"
              />
            </div>
            <div className="relative z-10 px-8 pt-16 lg:pt-24 lg:px-16">
              <motion.div
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6 }}
              >
                <p className="text-white/90 text-xl lg:text-3xl font-light italic mb-1">
                  Your Gateway to
                </p>
                <h1 className="text-white text-4xl lg:text-5xl font-semibold italic leading-tight">
                  Global Education
                </h1>
              </motion.div>
            </div>
          </div>

          {/* RIGHT SECTION - Form Card */}
          <div
            // style={{
            //   backgroundImage: "url('/login/lg.png')",
            // }} 
            className="w-full lg:w-1/2 bg-cover bg-center bg-no-repeat flex items-center h-[92vh] justify-center p-4 bg-[#fff0eb]">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className="w-full max-w-lg"
            >
              <div className="bg-white p-8 overflow-hidden">
                <AnimatePresence mode="wait">
                  {/* EMAIL MODE */}
                  {mode === "email" && (
                    <motion.div
                      key="email"
                      initial={{ opacity: 0, x: 20 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: -20 }}
                      className="space-y-4"
                    >
                      {/* Logo */}
                      <div className="text-center mb-8">
                        <img
                          src="/images/newlogo3.png"
                          alt="Ooshas Global"
                          className="h-20 mx-auto"
                        />
                        <h2 className="text-2xl font-bold text-[#FF6B4A] mt-2 mb-2">
                          Welcome to Ooshas Global
                        </h2>
                        <p className="text-gray-500 font-medium text-sm lg:text-base">
                          Enter your email to get started
                        </p>
                      </div>

                      {/* Email Input */}
                      <div className="space-y-2">
                        <label className="text-sm font-semibold text-gray-700 block">
                          Email Address
                        </label>
                        <div className="relative">
                          <input
                            type="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            placeholder="Email Address Email Address"
                            className="w-full px-4 py-2.5 rounded-full border border-gray-200 bg-[#f3f3f3] focus:bg-white focus:border-[#FF6B4A] focus:ring-2 focus:ring-[#FF6B4A]/20 outline-none transition-all duration-300 text-gray-700 placeholder:text-gray-400"
                            onKeyPress={(e) => e.key === "Enter" && checkEmail()}
                          />
                          <Mail className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5" />
                        </div>
                      </div>

                      {/* Terms Checkbox */}
                      <div className="flex items-center gap-3 bg-gray-50 rounded-xl px-4 py-3 border border-gray-100">
                        <button
                          type="button"
                          onClick={() => setTermsAccepted(!termsAccepted)}
                          className={`
                        w-5 h-5 rounded-full border-2 flex items-center justify-center
                        transition-all duration-200 flex-shrink-0
                        ${termsAccepted
                              ? "bg-[#FF6B4A] border-[#FF6B4A] shadow-md"
                              : "border-gray-300 bg-white"
                            }
                      `}
                        >
                          {termsAccepted && (
                            <CheckCircle className="w-3 h-3 text-white" />
                          )}
                        </button>
                        <p className="text-xs text-gray-600 leading-relaxed">
                          I agree to the{" "}
                          <a href="/terms-condition" className="text-[#FF6B4A] font-semibold hover:underline">
                            Terms & Conditions
                          </a>{" "}
                          and{" "}
                          <a href="/privacy-policy" className="text-[#FF6B4A] font-semibold hover:underline">
                            Privacy Policy
                          </a>
                        </p>
                      </div>

                      {/* Continue Button */}
                      <button
                        onClick={checkEmail}
                        disabled={loading || !termsAccepted || !email}
                        className="w-full py-3 rounded-full bg-gradient-to-r from-[#FF8C6A] to-[#FF6B4A] hover:from-[#FF6B4A] hover:to-[#FF5733] text-white font-semibold shadow-lg shadow-[#FF6B4A]/30 transition-all duration-300 transform hover:scale-[1.02] disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
                      >
                        {loading ? (
                          <span className="flex items-center justify-center gap-2">
                            <Loader2 className="w-5 h-5 animate-spin" />
                            Wait...
                          </span>
                        ) : (
                          "Continue"
                        )}
                      </button>

                      {/* Country Flags */}
                      <div className="pt-4">
                        <div className="flex items-center justify-center gap-2 flex-wrap">
                          {countries.map((country) => (
                            <div
                              key={country.code}
                              className="w-8 h-6 overflow-hidden"
                              title={country.name}
                            >
                              <img
                                src={`https://flagcdn.com/w40/${country.code.toLowerCase()}.png`}
                                alt={country.name}
                                className="w-full h-full object-cover"
                              />
                            </div>
                          ))}
                        </div>
                      </div>
                    </motion.div>
                  )}

                  {/* REGISTER MODE */}
                  {mode === "register" && (
                    <motion.div
                      key="register"
                      initial={{ opacity: 0, x: 20 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: -20 }}
                      className="space-y-4"
                    >
                      <button
                        onClick={() => setMode("email")}
                        className="font-medium flex items-center gap-1 text-gray-500 hover:text-[#FF6B4A] transition-colors mb-2"
                      >
                        <ArrowLeft size={16} /> Back
                      </button>

                      {/* Logo */}
                      <div className="text-center mb-6">
                        <img
                          src="/images/newlogo3.png"
                          alt="Ooshas Global"
                          className="h-16 mx-auto mb-2"
                        />
                        <h2 className="text-lg font-bold text-[#FF6B4A]">
                          Complete Registration
                        </h2>
                      </div>

                      <p className="text-sm font-medium text-gray-600">
                        Email: <span className="font-semibold text-gray-800">{email}</span>
                      </p>

                      {/* Full Name */}
                      <div className="space-y-1.5">
                        <label className="text-sm font-semibold text-gray-700 block">
                          Full Name
                        </label>
                        <input
                          type="text"
                          value={formData.name}
                          onChange={(e) =>
                            setFormData({ ...formData, name: e.target.value })
                          }
                          placeholder="full name"
                          className="w-full px-4 py-2.5 rounded-full border border-gray-200 bg-gray-50 focus:bg-white focus:border-[#FF6B4A] focus:ring-2 focus:ring-[#FF6B4A]/20 outline-none transition-all duration-300 text-gray-700 placeholder:text-gray-400"
                        />
                      </div>

                      {/* Phone */}
                      <div className="space-y-1.5">
                        <label className="text-sm font-semibold text-gray-700 block">
                          Phone Number
                        </label>
                        <input
                          type="tel"
                          value={formData.phone}
                          onChange={(e) =>
                            setFormData({
                              ...formData,
                              phone: e.target.value.replace(/[^0-9]/g, "").slice(0, 10),
                            })
                          }
                          placeholder="9876543210"
                          maxLength={10}
                          className="w-full px-4 py-2.5 rounded-full border border-gray-200 bg-gray-50 focus:bg-white focus:border-[#FF6B4A] focus:ring-2 focus:ring-[#FF6B4A]/20 outline-none transition-all duration-300 text-gray-700 placeholder:text-gray-400"
                        />
                      </div>

                      {/* Referral Code */}
                      <div className="space-y-1.5">
                        <label className="text-sm font-semibold text-gray-700 block">
                          Referral Code <span className="text-gray-400 font-normal">(Optional)</span>
                        </label>
                        <input
                          type="text"
                          value={referralCode}
                          onChange={(e) => setReferralCode(e.target.value.toUpperCase())}
                          placeholder="Enter referral code"
                          className="w-full px-4 py-2.5 rounded-full border border-gray-200 bg-gray-50 focus:bg-white focus:border-[#FF6B4A] focus:ring-2 focus:ring-[#FF6B4A]/20 outline-none transition-all duration-300 text-gray-700 placeholder:text-gray-400 uppercase tracking-wide"
                        />
                      </div>

                      {/* Send OTP Button */}
                      <button
                        onClick={handleRegister}
                        disabled={loading}
                        className="w-full py-3 rounded-full bg-gradient-to-r from-[#FF8C6A] to-[#FF6B4A] hover:from-[#FF6B4A] hover:to-[#FF5733] text-white font-semibold shadow-lg shadow-[#FF6B4A]/30 transition-all duration-300 transform hover:scale-[1.02] disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none mt-2"
                      >
                        {loading ? (
                          <span className="flex items-center justify-center gap-2">
                            <Loader2 className="w-5 h-5 animate-spin" />
                            Sending OTP...
                          </span>
                        ) : (
                          "Send OTP"
                        )}
                      </button>
                    </motion.div>
                  )}

                  {/* OTP MODE */}
                  {mode === "otp" && (
                    <motion.div
                      key="otp"
                      initial={{ opacity: 0, x: 20 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: -20 }}
                      className="space-y-6"
                    >
                      <button
                        onClick={() => setMode("email")}
                        className="font-medium flex items-center gap-1 text-gray-500 hover:text-[#FF6B4A] transition-colors mb-2"
                      >
                        <ArrowLeft size={16} /> Back
                      </button>
                      {/* Logo */}
                      <div className="text-center mb-6">
                        <img
                          src="/images/newlogo3.png"
                          alt="Ooshas Global"
                          className="h-16 mx-auto mb-2"
                        />
                        <h2 className="text-xl font-bold text-[#FF6B4A]">
                          Verify OTP
                        </h2>
                        <p className="text-sm text-gray-500 mt-1">
                          Enter the code sent to {email}
                        </p>
                      </div>

                      {/* OTP Input */}
                      <div className="space-y-2">
                        <label className="text-sm font-semibold text-gray-700 block text-center">
                          Enter 6-Digit OTP
                        </label>
                        <input
                          type="text"
                          value={otp}
                          onChange={(e) => setOtp(e.target.value.replace(/[^0-9]/g, "").slice(0, 6))}
                          placeholder="000000"
                          maxLength={6}
                          className="w-full px-4 py-3 rounded-full border border-gray-200 bg-gray-50 focus:bg-white focus:border-[#FF6B4A] focus:ring-2 focus:ring-[#FF6B4A]/20 outline-none transition-all duration-300 text-center text-2xl tracking-[0.5em] font-mono text-gray-700 placeholder:text-gray-400"
                        />
                      </div>

                      {/* Verify Button */}
                      <button
                        onClick={verifyOtp}
                        disabled={loading || otp.length !== 6}
                        className="w-full py-3 rounded-full bg-gradient-to-r from-[#FF8C6A] to-[#FF6B4A] hover:from-[#FF6B4A] hover:to-[#FF5733] text-white font-semibold shadow-lg shadow-[#FF6B4A]/30 transition-all duration-300 transform hover:scale-[1.02] disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
                      >
                        {loading ? (
                          <span className="flex items-center justify-center gap-2">
                            <Loader2 className="w-5 h-5 animate-spin" />
                            Verifying...
                          </span>
                        ) : (
                          "Verify OTP"
                        )}
                      </button>

                      <button
                        onClick={() => setMode("register")}
                        className="w-full text-sm text-[#FF6B4A] hover:underline mt-2 font-medium"
                      >
                        Didn't receive OTP? Resend
                      </button>
                    </motion.div>
                  )}

                  {/* SUCCESS MODE */}
                  {mode === "success" && (
                    <motion.div
                      key="success"
                      initial={{ opacity: 0, scale: 0.9 }}
                      animate={{ opacity: 1, scale: 1 }}
                      className="text-center space-y-6 py-4"
                    >
                      {/* Logo */}
                      <div className="text-center mb-6">
                        <img
                          src="/images/newlogo3.png"
                          alt="Ooshas Global"
                          className="h-12 mx-auto mb-3"
                        />
                      </div>

                      <motion.div
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        transition={{ type: "spring", stiffness: 200, damping: 20 }}
                        className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto"
                      >
                        <CheckCircle className="w-10 h-10 text-green-500" />
                      </motion.div>

                      <div>
                        <h2 className="text-2xl font-bold text-gray-800">
                          Welcome! 🎉
                        </h2>
                        <p className="text-gray-600 mt-2">
                          Authentication Successful
                        </p>
                        <p className="text-sm text-gray-500 mt-1">
                          Redirecting to dashboard...
                        </p>
                      </div>

                      <div className="flex justify-center gap-1">
                        <div className="w-2 h-2 bg-[#FF6B4A] rounded-full animate-bounce" />
                        <div className="w-2 h-2 bg-[#FF6B4A] rounded-full animate-bounce delay-100" />
                        <div className="w-2 h-2 bg-[#FF6B4A] rounded-full animate-bounce delay-200" />
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
              <p className="text-center text-gray-400 text-xs mt-6">
                © 2026 Ooshas Global. All rights reserved.
              </p>
            </motion.div>
          </div>
        </div>
      </div>


    </main>
  )
}