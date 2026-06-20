"use client"
import React, { useState, useEffect, useRef, useCallback } from "react"
import { motion, AnimatePresence } from "framer-motion"
import {
    Gift, Share2, Users, Copy, Check, Zap, Ticket,
    Award, TrendingUp, Star, Clock, ChevronRight,
    Loader2, Sparkles, GiftIcon, BadgePercent, QrCode,
    Info, X, UserPlus, Wallet, CreditCard, Calendar,
    Eye, EyeOff, AlertCircle, Heart, Percent,
    Send, Mail, Trophy,
    MessageCirclePlus
} from "lucide-react"
import { addDays, format, formatDistanceToNow } from "date-fns"
import { useGlobal } from "@/src/statecontext"
import axiosInstance from "@/app/axiosInstance"
import toast from "react-hot-toast"
import Image from "next/image"


interface Coupon {
    id: string
    code: string
    description: string
    discount: string
    validUntil: string
    minPurchase?: string
    maxDiscount?: string
    isScratched: boolean
    isRedeemed: boolean
    category: 'welcome' | 'special' | 'referral' | 'festive'
}

const ScratchCard = ({ coupon, onScratchComplete }: any) => {
    const [isScratching, setIsScratching] = useState(false)
    const [scratchPercentage, setScratchPercentage] = useState(0)
    const canvasRef = useRef<HTMLCanvasElement>(null)
    const containerRef = useRef<HTMLDivElement>(null)
    const isScratched = scratchPercentage >= 70 || coupon.isScratched
    const [isDrawing, setIsDrawing] = useState(false)

    useEffect(() => {
        if (!canvasRef.current || !containerRef.current || coupon.isScratched) return

        const canvas = canvasRef.current
        const ctx = canvas.getContext('2d', { willReadFrequently: true })
        const container = containerRef.current

        if (!ctx) return

        // Handle High DPI Displays
        const dpr = window.devicePixelRatio || 1
        const rect = container.getBoundingClientRect()

        canvas.width = rect.width * dpr
        canvas.height = rect.height * dpr
        canvas.style.width = `${rect.width}px`
        canvas.style.height = `${rect.height}px`

        ctx.scale(dpr, dpr)

        // Create Scratch Layer
        const gradient = ctx.createLinearGradient(0, 0, rect.width, rect.height)
        gradient.addColorStop(0, '#475569')
        gradient.addColorStop(0.5, '#64748b')
        gradient.addColorStop(1, '#475569')

        ctx.fillStyle = gradient
        ctx.fillRect(0, 0, rect.width, rect.height)

        // Add Pattern
        ctx.strokeStyle = '#94a3b8'
        ctx.lineWidth = 1
        for (let i = 0; i < 30; i++) {
            ctx.beginPath()
            ctx.moveTo(Math.random() * rect.width, Math.random() * rect.height)
            ctx.lineTo(Math.random() * rect.width, Math.random() * rect.height)
            ctx.stroke()
        }

        // Add Text
        ctx.fillStyle = '#ffffff'
        ctx.font = 'bold 18px system-ui'
        ctx.textAlign = 'center'
        ctx.textBaseline = 'middle'
        ctx.fillText('SCRATCH HERE', rect.width / 2, rect.height / 2 - 10)
        ctx.font = '14px system-ui'
        ctx.fillStyle = '#cbd5e1'
        ctx.fillText('to reveal coupon', rect.width / 2, rect.height / 2 + 15)

    }, [coupon._id, coupon.isScratched])

    // Calculate Scratch Percentage (Optimized)
    const calculateScratchPercentage = useCallback(() => {
        if (!canvasRef.current) return 0
        const canvas = canvasRef.current
        const ctx = canvas.getContext('2d')
        if (!ctx) return 0

        const dpr = window.devicePixelRatio || 1
        const width = canvas.width
        const height = canvas.height

        // Sample pixels (step by 4 for performance)
        const imageData = ctx.getImageData(0, 0, width, height)
        const pixels = imageData.data
        let cleared = 0
        const totalPixels = pixels.length / 4

        // Check alpha channel every 4th pixel for speed
        for (let i = 3; i < pixels.length; i += 16) {
            if (pixels[i] === 0) cleared++
        }

        // Adjust calculation based on sampling rate
        const percentage = (cleared / (totalPixels / 4)) * 100
        return percentage
    }, [])

    const handleScratch = useCallback((e: React.MouseEvent<HTMLCanvasElement> | React.TouchEvent<HTMLCanvasElement>) => {
        if (!canvasRef.current || isScratched) return

        if ('touches' in e) {
            // Mobile: Always scratch on touch move
        } else {
            if (!isDrawing) return
            e.preventDefault()
        }

        const canvas = canvasRef.current
        const ctx = canvas.getContext('2d')
        if (!ctx) return

        const dpr = window.devicePixelRatio || 1
        const rect = canvas.getBoundingClientRect()

        let clientX, clientY
        if ('touches' in e) {
            clientX = e.touches[0].clientX
            clientY = e.touches[0].clientY
        } else {
            clientX = (e as React.MouseEvent).clientX
            clientY = (e as React.MouseEvent).clientY
        }

        const x = (clientX - rect.left) * dpr
        const y = (clientY - rect.top) * dpr

        ctx.globalCompositeOperation = 'destination-out'
        ctx.beginPath()
        ctx.arc(x, y, 25 * dpr, 0, Math.PI * 2)
        ctx.fill()

        const percentage = calculateScratchPercentage()
        setScratchPercentage(percentage)

        if (percentage >= 70) {
            onScratchComplete(coupon._id)
        }
    }, [isScratched, isDrawing, coupon._id, onScratchComplete, calculateScratchPercentage])
    const handleScratchEnd = useCallback(() => {
        setIsScratching(false)
    }, [])

    const handleMouseDown = () => setIsDrawing(true)
    const handleMouseUp = () => setIsDrawing(false)
    const handleMouseLeave = () => setIsDrawing(false)
    // Manual Reveal Button for Accessibility
    const handleManualReveal = () => {
        onScratchComplete(coupon._id)
    }

    return (
        <div
            ref={containerRef}
            className="relative w-full h-[240px] rounded-3xl overflow-hidden shadow-lg select-none touch-none"
        >
            <div className={`absolute inset-0 bg-gradient-to-br from-indigo-100 via-indigo-400 to-blue-100 p-6 flex flex-col items-center justify-center text-white transition-opacity duration-500`}>
                <div className="absolute bottom-4 left-4 right-4 text-xs text-white/70 flex justify-between">
                    <span>Valid till {format(new Date(coupon.expiresAt), 'dd MMM')}</span>
                </div>
            </div>

            <canvas
                ref={canvasRef}
                className={`absolute inset-0 w-full h-full cursor-crosshair touch-none transition-opacity duration-500 ${isScratched ? 'opacity-0 pointer-events-none' : 'opacity-100'}`}
                onMouseDown={handleMouseDown}
                onMouseMove={handleScratch}
                onMouseUp={handleMouseUp}
                onMouseLeave={handleMouseLeave}
                onTouchMove={handleScratch}
                onTouchStart={handleScratch}
                onTouchEnd={handleScratchEnd}
            />
        </div>
    )
}

export default function OffersPage() {
    const [activeTab, setActiveTab] = useState<any>('refer')
    const [referrals, setReferrals] = useState<[]>([])
    const [coupons, setCoupons] = useState<any>()
    const [copiedCode, setCopiedCode] = useState<string | null>(null)
    const [rewards, setRewards] = useState<[]>([])
    const [showReferModal, setShowReferModal] = useState(false)
    const { profile, loading, updateProfile } = useGlobal()
    const [selectedCoupon, setSelectedCoupon] = useState<Coupon | null>(null)
    const [link, setLink] = useState('')

    useEffect(() => {
        if (profile?.referalCode) {
            const address = `https://www.ooshasglobal.com?code=${profile?.referalCode}`
            setLink(address)
        }
    })
    // Actions
    const copyReferralLink = () => {
        navigator.clipboard.writeText(link)
        setCopiedCode('referral')
        setTimeout(() => setCopiedCode(null), 2000)
    }

    const handleScratchComplete = useCallback(async (couponId: string) => {
        const rewardsRes = await axiosInstance.post(`/coupons/scratch/use/${couponId}`);
        if (rewardsRes.data?.success) {
            updateProfile()
            toast.success(rewardsRes.data?.message
            )
        }
        setRewards(prev => prev.map(coupon =>
            coupon._id === couponId ? rewardsRes.data?.updatedCard : coupon
        ))
    }, [rewards])

    const copyCouponCode = (code: string, e: React.MouseEvent) => {
        e.stopPropagation()
        navigator.clipboard.writeText(code)
        setCopiedCode(code)
        setTimeout(() => setCopiedCode(null), 2000)
    }

    const shareViaSocial = (platform: string) => {
        const text = "Join me on this amazing platform and get 50 points! Use my referral link:"
        let shareUrl = ''
        switch (platform) {
            case 'whatsapp':
                shareUrl = `https://wa.me/?text=${encodeURIComponent(text + '\n' + link)}`
                break
            case 'telegram':
                shareUrl = `https://t.me/share/url?url=${encodeURIComponent(link)}&text=${encodeURIComponent(text)}`
                break
            case 'email':
                shareUrl = `mailto:?subject=${encodeURIComponent('Join me on this platform')}&body=${encodeURIComponent(text + '\n' + link)}`
                break
        }
        window.open(shareUrl, '_blank')
    }

    const myReferrals = async () => {
        try {
            const [response, coupouns, rewardsRes] = await Promise.all([
                await axiosInstance.get('/auth/my-referrals'),
                await axiosInstance.get('/coupons/available/list'),
                await axiosInstance.get('/coupons/scratch/my')
            ])
            setCoupons(coupouns.data)
            setReferrals(response.data);
            setRewards(rewardsRes.data?.data)
            if (response?.data?.success) {
                toast.success("Referrals Refresh successfully")
            }
        } catch (error) {
            toast.error('Error fetching referrals')
        }
    }

    useEffect(() => {
        myReferrals()
    }, [])

    return (
       <main className="flex-1 overflow-y-auto min-h-[70vh]">
  <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6">

    {/* Header */}
    <motion.div
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      className="flex flex-col sm:flex-row sm:items-center justify-between gap-4"
    >
      <div>
        {/* Minimum font size: text-base on mobile, text-xl on desktop */}
        <h1 className="text-base sm:text-lg md:text-xl font-bold text-slate-900 leading-tight">
          Offers & Rewards
        </h1>
        {/* Minimum font size: text-xs */}
        <p className="text-xs sm:text-sm text-slate-500">
          Earn points, unlock coupons, and enjoy exclusive benefits
        </p>
      </div>
      {/* Wallet badge - compact on mobile */}
      <div className="flex font-semibold items-center gap-1.5 sm:gap-2 border-2 border-slate-500 rounded-full px-3 sm:px-4 py-1.5 sm:py-1 shadow-xl">
        {/* Minimum font size: text-xs */}
        <p className="text-xs sm:text-sm whitespace-nowrap">Wallet: {profile?.wallet}</p>
        <Image 
          src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQd6RT3_38mLmgDzUAuy2ZcS0ERldqSXpTdQw&s" 
          alt="wallet" 
          width={24} 
          height={24}
          loading="lazy"
          className="w-5 h-5 sm:w-6 sm:h-6"
        />
      </div>
    </motion.div>

    {/* Tabs - horizontal scroll on mobile */}
    <div className="flex gap-1 sm:gap-2 border-b border-slate-200 bg-white sticky top-0 z-10 -mx-4 sm:mx-0 px-4 sm:px-0 pt-2 sm:pt-0 overflow-x-auto scrollbar-hide">
      {['refer', 'coupons', "rewards"].map((tab) => (
        <motion.button
          key={tab}
          onClick={() => setActiveTab(tab as 'refer' | 'coupons' | 'rewards')}
          // Minimum touch target: 44px height, minimum font: text-xs
          className={`pb-2.5 sm:pb-3 px-2.5 sm:px-3 font-semibold text-xs sm:text-sm whitespace-nowrap flex items-center gap-1.5 sm:gap-2 transition-all relative ${
            activeTab === tab ? 'text-slate-900' : 'text-slate-500 hover:text-slate-700'
          }`}
        >
          {/* Icons scale down on mobile */}
          {tab === 'refer' ? <UserPlus className="w-4 h-4 sm:w-5 sm:h-5" /> : 
           tab === "rewards" ? <Gift className="w-4 h-4 sm:w-5 sm:h-5" /> : 
           <Ticket className="w-4 h-4 sm:w-5 sm:h-5" />}
          {tab === 'refer' ? 'Refer & Earn' : tab === "rewards" ? 'Rewards' : 'My Coupons'}

          {activeTab === tab && (
            <motion.div
              layoutId="activeTab"
              className="absolute bottom-0 left-0 right-0 h-0.5 bg-slate-900"
            />
          )}
        </motion.button>
      ))}
    </div>

    <AnimatePresence mode="wait">
      {activeTab === 'refer' && (
        <motion.div
          key="refer"
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: 20 }}
          className="space-y-4 sm:space-y-6"
        >
          {/* Hero Card - compact padding on mobile */}
          <div className="relative overflow-hidden rounded-2xl sm:rounded-3xl bg-slate-900 p-5 sm:p-8 text-white shadow-xl">
            <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-20" />
            <div className="relative z-10 flex flex-col md:flex-row items-center justify-between gap-6 sm:gap-8">
              <div className="space-y-3 sm:space-y-4 flex-1 text-center md:text-left">
                <div className="inline-flex items-center gap-1.5 sm:gap-2 px-2.5 sm:px-3 py-1 sm:py-1.5 rounded-full bg-amber-500/20 text-amber-400 text-[10px] sm:text-sm font-medium border border-amber-500/30">
                  <Sparkles className="w-3 h-3 sm:w-4 sm:h-4" /> Limited Time Offer
                </div>
                {/* Minimum heading size: text-lg */}
                <h2 className="text-lg sm:text-2xl md:text-3xl font-bold tracking-tight leading-tight">
                  Refer a Friend & Earn
                </h2>
                {/* Minimum body text: text-xs */}
                <p className="text-xs sm:text-base text-slate-300 max-w-xl leading-relaxed">
                  Share your unique referral link with friends. When they join, you both get 50 points instantly. No limits on earnings!
                </p>
                <div className="flex flex-wrap justify-center md:justify-start gap-2 sm:gap-3 pt-1 sm:pt-2">
                  <div className="flex items-center gap-1.5 sm:gap-2 px-3 sm:px-4 py-1.5 sm:py-2 rounded-lg bg-white/10 backdrop-blur border border-white/10">
                    <Gift className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-amber-400" />
                    <span className="text-[10px] sm:text-sm font-medium">50 Points per referral</span>
                  </div>
                  <div className="flex items-center gap-1.5 sm:gap-2 px-3 sm:px-4 py-1.5 sm:py-2 rounded-lg bg-white/10 backdrop-blur border border-white/10">
                    <Users className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-amber-400" />
                    <span className="text-[10px] sm:text-sm font-medium">Unlimited earnings</span>
                  </div>
                </div>
              </div>
              {/* Button - full width on mobile */}
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => setShowReferModal(true)}
                className="w-full sm:w-auto px-4 sm:px-6 py-2.5 sm:py-3 bg-amber-500 hover:bg-amber-600 text-slate-900 rounded-xl font-bold text-sm sm:text-base shadow-lg shadow-amber-500/20 transition-all flex items-center justify-center gap-2 whitespace-nowrap min-h-[44px]"
              >
                Refer Now
              </motion.button>
            </div>
          </div>

          {/* Referral Link Section */}
          <div className="bg-white rounded-2xl p-4 sm:p-6 border border-slate-200 shadow-sm">
            <h3 className="text-sm sm:text-lg font-semibold mb-3 sm:mb-4 flex items-center gap-2 text-slate-900">
              <Share2 className="w-4 h-4 sm:w-5 sm:h-5 text-purple-600" />
              Your Referral Link
            </h3>
            <div className="flex flex-col sm:flex-row gap-3">
              <div className="flex-1 relative">
                <input
                  type="text"
                  readOnly
                  value={link}
                  // Minimum input text size: text-xs
                  className="w-full px-3 sm:px-4 py-2.5 sm:py-3 bg-slate-50 border border-slate-200 rounded-xl text-xs sm:text-sm text-slate-700 font-medium focus:outline-none focus:ring-2 focus:ring-purple-500"
                />
                <button
                  onClick={copyReferralLink}
                  className="absolute right-2 top-1/2 -translate-y-1/2 p-2 hover:bg-slate-200 rounded-lg transition-colors min-w-[44px] min-h-[44px] flex items-center justify-center"
                >
                  {copiedCode === 'referral' ? (
                    <Check className="w-4 h-4 sm:w-5 sm:h-5 text-green-600" />
                  ) : (
                    <Copy className="w-4 h-4 sm:w-5 sm:h-5 text-slate-500" />
                  )}
                </button>
              </div>
              {/* Social buttons - wrap on mobile */}
              <div className="flex gap-2 flex-wrap sm:flex-nowrap">
                {[
                  { id: 'whatsapp', icon: MessageCirclePlus, color: 'bg-green-500 hover:bg-green-600' },
                  { id: 'telegram', icon: Send, color: 'bg-blue-500 hover:bg-blue-600' },
                  { id: 'email', icon: Mail, color: 'bg-slate-700 hover:bg-slate-800' }
                ].map((platform) => (
                  <motion.button
                    key={platform.id}
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.9 }}
                    onClick={() => shareViaSocial(platform.id)}
                    // Minimum touch target: 44x44px
                    className={`p-2.5 sm:p-3 text-white rounded-xl transition-colors ${platform.color} min-w-[44px] min-h-[44px] flex items-center justify-center`}
                  >
                    <platform.icon className="w-4 h-4 sm:w-5 sm:h-5" />
                  </motion.button>
                ))}
              </div>
            </div>
          </div>

          {/* Recent Referrals */}
          <div className="space-y-3 sm:space-y-4">
            <h3 className="text-sm sm:text-lg font-semibold text-slate-900">Recent Referrals</h3>
            <div className="space-y-3">
              {referrals?.data?.length === 0 && (
                <div className="flex items-center gap-2 px-3 sm:px-4 py-2.5 sm:py-3 rounded-lg bg-slate-50 border border-slate-200">
                  <Users className="w-4 h-4 text-amber-400" />
                  <span className="text-xs font-medium text-slate-600">No referrals yet</span>
                </div>
              )}
              {referrals?.data?.map((referral, index) => (
                <motion.div
                  key={referral.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.05 }}
                  className="rounded-xl sm:rounded-lg p-3 sm:p-4 bg-gray-50 border border-slate-200 flex flex-col sm:flex-row sm:items-center justify-between gap-3"
                >
                  <div className="flex items-center gap-3 sm:gap-4">
                    <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-full shadow-lg bg-gradient-to-br from-purple-500 to-indigo-600 flex items-center justify-center text-white font-bold">
                      <Image 
                        src={referral?.profileImage || "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRI9lRck6miglY0SZF_BZ_sK829yiNskgYRUg&s"} 
                        alt="Profile" 
                        width={32} 
                        height={32} 
                        loading="lazy"
                        className="w-full h-full object-cover rounded-full" 
                      />
                    </div>
                    <div className="min-w-0 flex-1">
                      {/* Minimum name size: text-sm */}
                      <h4 className="font-semibold text-sm sm:text-base text-slate-900 capitalize truncate">
                        {referral?.name || "Unknown"}
                      </h4>
                      {/* Minimum email size: text-xs */}
                      <p className="text-xs text-slate-500 truncate">{referral?.email || "__"}</p>
                      <div className="flex items-center gap-2 mt-0.5 sm:mt-1">
                        <span className="text-[10px] sm:text-xs text-slate-400">
                          {formatDistanceToNow(new Date(referral?.createdAt), { addSuffix: true })}
                        </span>
                      </div>
                    </div>
                  </div>
                  <div className="text-right sm:text-right">
                    <p className="text-[10px] sm:text-xs text-slate-500">Points Earned</p>
                    <p className="text-base sm:text-lg font-bold text-green-600">+50</p>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </motion.div>
      )}

      {activeTab === 'coupons' && (
        <motion.div
          key="coupons"
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: -20 }}
          className="space-y-4 sm:space-y-6"
        >
          {coupons?.data?.length === 0 && (
            <div className="flex flex-col items-center justify-center py-8 sm:py-16 w-full">
              <Image 
                src="https://assets-v2.lottiefiles.com/a/0953d504-117d-11ee-aa49-1f149204cb5f/9uZcoEJaoF.gif" 
                alt="No rewards" 
                width={180} 
                loading="lazy"
                height={180} 
                className="w-44 h-44 sm:w-60 sm:h-60 mx-auto" 
              />
              <p className="font-medium text-sm sm:text-lg mt-3 text-center px-4">No rewards found</p>
            </div>
          )}
          {/* Grid: 1 col mobile, 2 tablet, 4 desktop */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
            {coupons?.data?.map((coupon, index) => (
              <motion.div
                key={coupon._id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.05 }}
              >
                <div
                  onClick={() => setSelectedCoupon(coupon)}
                  className="relative group cursor-pointer rounded-2xl sm:rounded-3xl overflow-hidden bg-gradient-to-r from-[#F26D44] via-purple-500 to-indigo-800 hover:scale-[1.01] transition-all duration-300 shadow-lg hover:shadow-2xl"
                >
                  <div className="relative bg-white/90 backdrop-blur-xl rounded-2xl sm:rounded-3xl">
                    {new Date(coupon.validTo) < addDays(new Date(), 7) && (
                      <div className="absolute top-3 sm:top-4 right-[-35px] sm:right-[-40px] rotate-45 bg-red-500 text-white text-[10px] sm:text-xs px-8 sm:px-10 py-1 shadow-lg animate-pulse">
                        Expiring Soon
                      </div>
                    )}

                    <div className="p-4 sm:p-6 bg-gradient-to-br from-[#F26D44] to-indigo-600 text-white">
                      <div className="mt-1 sm:mt-2 text-center">
                        {/* Minimum discount text: text-lg */}
                        <p className="text-lg sm:text-2xl font-extrabold tracking-tight drop-shadow-xl">
                          {coupon?.couponData?.discountValue} {coupon?.couponData?.discountType == 'percentage' ? '%' : 'OFF'}
                        </p>
                        {/* Minimum description: text-xs */}
                        <p className="text-[10px] sm:text-sm text-white/90 mt-1 line-clamp-2 px-1">
                          {coupon.description}
                        </p>
                      </div>
                    </div>

                    <div className="p-3 sm:p-4 space-y-2 sm:space-y-3 mb-1">
                      {/* Coupon Code */}
                      <div className="bg-slate-100 rounded-lg sm:rounded-xl px-2 py-1.5 flex items-center justify-between border border-dashed border-slate-300 hover:border-slate-400 transition">
                        {/* Minimum code text: text-xs */}
                        <code className="font-medium px-1.5 sm:px-2 text-[10px] sm:text-sm text-slate-800 truncate max-w-[120px] sm:max-w-none">
                          {coupon.code}
                        </code>
                        <button
                          onClick={(e) => { e.stopPropagation(); copyCouponCode(coupon.code, e); }}
                          className="p-1.5 sm:p-2 rounded-full bg-white shadow hover:scale-110 transition min-w-[32px] min-h-[32px] sm:min-w-[36px] sm:min-h-[36px] flex items-center justify-center"
                        >
                          {copiedCode === coupon.code ? (
                            <Check className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-green-600" />
                          ) : (
                            <Copy className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-slate-600" />
                          )}
                        </button>
                      </div>

                      {/* Info Row */}
                      <div className="flex items-center justify-between text-[10px] sm:text-xs text-slate-500">
                        <span className="font-medium">Min. ₹{coupon?.couponData?.minPurchaseAmount}</span>
                        <span className="flex items-center gap-1">
                          <Calendar className="w-2.5 h-2.5 sm:w-3 sm:h-3" />
                          {format(new Date(coupon.validTo), 'dd MMM yyyy')}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </motion.div>
      )}

      {activeTab === 'rewards' && (
        <motion.div
          key="rewards"
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: -20 }}
          className="space-y-4 sm:space-y-6"
        >
          {rewards?.length === 0 && (
            <div className="flex flex-col items-center justify-center py-8 sm:py-16 w-full">
              <Image 
                src="https://assets-v2.lottiefiles.com/a/0953d504-117d-11ee-aa49-1f149204cb5f/9uZcoEJaoF.gif" 
                alt="No rewards" 
                width={180} 
                height={180} 
                loading="lazy"
                className="w-44 h-44 sm:w-60 sm:h-60 mx-auto" 
              />
              <p className="font-medium text-sm sm:text-lg mt-3 text-center px-4">No rewards found</p>
            </div>
          )}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
            {rewards?.map((coupon, index) => (
              <motion.div
                key={coupon._id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.05 }}
              >
                {!coupon.isScratched ? (
                  <div className="min-h-[180px] sm:min-h-[240px]">
                    <ScratchCard coupon={coupon} onScratchComplete={handleScratchComplete} />
                  </div>
                ) : (
                  <div
                    onClick={() => setSelectedCoupon(coupon)}
                    className="flex flex-col items-center justify-center group cursor-pointer rounded-2xl sm:rounded-3xl min-h-[180px] sm:min-h-[240px] bg-gradient-to-r from-pink-200 via-purple-400 to-indigo-100 hover:scale-[1.01] transition-all duration-300 shadow-lg hover:shadow-2xl p-2 sm:p-0"
                  >
                    <div className="backdrop-blur-sm rounded-2xl sm:rounded-3xl overflow-hidden w-full">
                      <div className="text-center flex p-3 sm:p-4 flex-col items-center justify-center">
                        {/* Minimum points text: text-lg */}
                        <p className="text-lg sm:text-2xl font-extrabold tracking-tight drop-shadow-lg">
                          + {coupon?.rewardId?.rewardData?.rewardValue || '0'} Points
                        </p>
                        {/* Minimum title/desc: text-xs */}
                        <p className="text-xs sm:text-lg text-slate-800 sm:text-white/90 mt-1 line-clamp-2 font-medium">
                          {coupon?.rewardId?.title || "__"}
                        </p>
                        <p className="text-[10px] sm:text-sm text-slate-600 sm:text-white/90 mt-0.5 line-clamp-2 px-1">
                          {coupon?.rewardId?.description || "__"}
                        </p>
                      </div>
                    </div>
                  </div>
                )}
              </motion.div>
            ))}
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  </div>
</main>
    )
}