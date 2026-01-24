"use client"

import type React from "react"
import { useState } from "react"
import Link from "next/link"
import { motion } from "framer-motion"
import { User, Mail, Lock, ArrowRight } from "lucide-react"
import { Button } from "@/components/ui/button"

export default function SignupPage() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
  })

  const [loading, setLoading] = useState(false)

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    })
  }

  const handleSignup = (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)

    setTimeout(() => {
      window.location.href = "/dashboard"
    }, 1000)
  }

  return (
    <main className="min-h-screen flex flex-col lg:flex-row bg-[#f8f9fb] overflow-hidden">

      {/* ================= LEFT IMAGE ================= */}
      <div className="relative w-full lg:w-1/2 h-[320px] lg:h-screen">
        <img
          src="/images/login-bg.jpg"
          alt="education"
          className="w-full h-full object-cover"
        />

        <div className="absolute inset-0 bg-black/40" />

        <div className="absolute top-1/2 -translate-y-1/2 left-6 lg:left-16 text-white max-w-md z-10">
          <p className="text-lg mb-2">Start Your Journey</p>
          <h1 className="text-3xl lg:text-5xl font-bold leading-tight">
            Global Education
          </h1>
        </div>

        {/* curve */}
        <div className="hidden lg:block absolute right-0 top-0 h-full w-32 bg-[#f8f9fb] rounded-l-[120px]" />
      </div>

      {/* ================= RIGHT FORM ================= */}
      <div className="w-full lg:w-1/2 flex items-center justify-center px-6 py-12">

        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="w-full max-w-md bg-white rounded-2xl shadow-xl p-8"
        >
          {/* Logo */}
          <div className="flex justify-center mb-6">
            <img src="/images/logo.png" alt="logo" className="h-10" />
          </div>

          <h2 className="text-center text-xl font-semibold text-orange-500">
            Create Your Account
          </h2>

          <p className="text-center text-gray-500 text-sm mt-1 mb-6">
            Join Gaway Global today
          </p>

          {/* ================= FORM ================= */}
          <form onSubmit={handleSignup} className="space-y-5">

            {/* NAME */}
            <div>
              <label className="text-sm text-gray-600 block mb-1">
                Full Name
              </label>
              <div className="relative">
                <User className="absolute left-3 top-3.5 w-5 h-5 text-white" />
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  placeholder="John Doe"
                  required
                  className="w-full bg-orange-500 text-white placeholder-white pl-10 pr-4 py-3 rounded-md outline-none"
                />
              </div>
            </div>

            {/* EMAIL */}
            <div>
              <label className="text-sm text-gray-600 block mb-1">
                Email Address
              </label>
              <div className="relative">
                <Mail className="absolute left-3 top-3.5 w-5 h-5 text-white" />
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  placeholder="you@example.com"
                  required
                  className="w-full bg-orange-500 text-white placeholder-white pl-10 pr-4 py-3 rounded-md outline-none"
                />
              </div>
            </div>

            {/* PASSWORD */}
            <div>
              <label className="text-sm text-gray-600 block mb-1">
                Password
              </label>
              <div className="relative">
                <Lock className="absolute left-3 top-3.5 w-5 h-5 text-white" />
                <input
                  type="password"
                  name="password"
                  value={formData.password}
                  onChange={handleChange}
                  placeholder="••••••••"
                  required
                  className="w-full bg-orange-500 text-white placeholder-white pl-10 pr-4 py-3 rounded-md outline-none"
                />
              </div>
            </div>

            {/* CONFIRM PASSWORD */}
            <div>
              <label className="text-sm text-gray-600 block mb-1">
                Confirm Password
              </label>
              <div className="relative">
                <Lock className="absolute left-3 top-3.5 w-5 h-5 text-white" />
                <input
                  type="password"
                  name="confirmPassword"
                  value={formData.confirmPassword}
                  onChange={handleChange}
                  placeholder="••••••••"
                  required
                  className="w-full bg-orange-500 text-white placeholder-white pl-10 pr-4 py-3 rounded-md outline-none"
                />
              </div>
            </div>

            {/* TERMS */}
            <div className="flex gap-2 text-sm text-gray-600">
              <input
                type="checkbox"
                className="accent-orange-500 mt-1"
                required
              />
              <p>
                I agree to the{" "}
                <Link href="#" className="font-medium hover:underline">
                  Terms & Conditions
                </Link>{" "}
                and{" "}
                <Link href="#" className="font-medium hover:underline">
                  Privacy Policy
                </Link>
              </p>
            </div>

            {/* BUTTON */}
            <Button
              type="submit"
              disabled={loading}
              className="w-full bg-gray-600 hover:bg-gray-700 gap-2"
            >
              {loading ? "Creating account..." : "Create Account"}
              {!loading && <ArrowRight className="w-4 h-4" />}
            </Button>
          </form>

          {/* LOGIN LINK */}
          <p className="text-center text-sm mt-6">
            Already have an account?{" "}
            <Link
              href="/login"
              className="text-orange-500 font-medium hover:underline"
            >
              Sign in
            </Link>
          </p>
        </motion.div>
      </div>
    </main>
  )
}
