"use client"
import React, { useState, useEffect, useRef, useCallback } from "react"
import { motion, AnimatePresence } from "framer-motion"
import {
    Gift, Share2, Users, Copy, Check, Zap, Ticket,
    Award, TrendingUp, Star, Clock, ChevronRight,
    Loader2, Sparkles, GiftIcon, BadgePercent, QrCode,
    Info, X, UserPlus, Wallet, CreditCard, Calendar,
    Eye, EyeOff, AlertCircle, Heart, Percent,
    Send, Mail, Trophy
} from "lucide-react"
import { addDays, format, formatDistanceToNow } from "date-fns"

// --- Types ---
interface Referral {
    id: string
    friendName: string
    friendEmail: string
    status: 'pending' | 'joined' | 'earned'
    date: string
    pointsEarned: number
    avatar?: string
}

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

// --- Constants & Config ---
const categoryConfig = {
    welcome: {
        label: 'Welcome',
        gradient: 'from-purple-500 to-indigo-600',
        bgColor: 'bg-purple-50',
        textColor: 'text-purple-700',
        borderColor: 'border-purple-200',
        icon: <Gift className="w-4 h-4" />
    },
    special: {
        label: 'Special',
        gradient: 'from-blue-500 to-cyan-600',
        bgColor: 'bg-blue-50',
        textColor: 'text-blue-700',
        borderColor: 'border-blue-200',
        icon: <Star className="w-4 h-4" />
    },
    referral: {
        label: 'Referral',
        gradient: 'from-emerald-500 to-green-600',
        bgColor: 'bg-emerald-50',
        textColor: 'text-emerald-700',
        borderColor: 'border-emerald-200',
        icon: <Users className="w-4 h-4" />
    },
    festive: {
        label: 'Festive',
        gradient: 'from-orange-500 to-red-600',
        bgColor: 'bg-orange-50',
        textColor: 'text-orange-700',
        borderColor: 'border-orange-200',
        icon: <Sparkles className="w-4 h-4" />
    }
}

const statusConfig = {
    pending: {
        label: 'Pending',
        color: 'bg-yellow-100 text-yellow-700',
        icon: <Clock className="w-3 h-3" />
    },
    joined: {
        label: 'Joined',
        color: 'bg-blue-100 text-blue-700',
        icon: <Users className="w-3 h-3" />
    },
    earned: {
        label: 'Earned',
        color: 'bg-green-100 text-green-700',
        icon: <Award className="w-3 h-3" />
    }
}

// --- Dummy Data ---
const initialReferrals: Referral[] = [
    {
        id: 'ref_001',
        friendName: 'Sarah Johnson',
        friendEmail: 'sarah.j@example.com',
        status: 'earned',
        date: '2026-02-15T10:30:00Z',
        pointsEarned: 50,
        avatar: 'SJ'
    },
    {
        id: 'ref_002',
        friendName: 'Michael Chen',
        friendEmail: 'michael.c@example.com',
        status: 'joined',
        date: '2026-02-14T15:45:00Z',
        pointsEarned: 0,
        avatar: 'MC'
    },
    {
        id: 'ref_003',
        friendName: 'Priya Patel',
        friendEmail: 'priya.p@example.com',
        status: 'pending',
        date: '2026-02-13T09:15:00Z',
        pointsEarned: 0,
        avatar: 'PP'
    },
    {
        id: 'ref_004',
        friendName: 'David Kim',
        friendEmail: 'david.k@example.com',
        status: 'earned',
        date: '2026-02-12T14:20:00Z',
        pointsEarned: 50,
        avatar: 'DK'
    }
]

const initialCoupons: Coupon[] = [
    {
        id: 'cpn_001',
        code: 'WELCOME50',
        description: 'Get 50% off on your first purchase',
        discount: '50% OFF',
        validUntil: '2026-03-31',
        minPurchase: '1000',
        maxDiscount: '500',
        isScratched: false,
        isRedeemed: false,
        category: 'welcome'
    },
    {
        id: 'cpn_002',
        code: 'FLAT200',
        description: 'Flat ₹200 off on orders above ₹2000',
        discount: '₹200 OFF',
        validUntil: '2026-02-28',
        minPurchase: '2000',
        isScratched: true,
        isRedeemed: false,
        category: 'special'
    },
    {
        id: 'cpn_003',
        code: 'REFER50',
        description: 'Special reward for successful referrals',
        discount: '50% OFF',
        validUntil: '2026-04-15',
        minPurchase: '1500',
        maxDiscount: '750',
        isScratched: false,
        isRedeemed: false,
        category: 'referral'
    },
    {
        id: 'cpn_004',
        code: 'FESTIVE25',
        description: 'Festive season special discount',
        discount: '25% OFF',
        validUntil: '2026-03-15',
        minPurchase: '500',
        maxDiscount: '300',
        isScratched: true,
        isRedeemed: true,
        category: 'festive'
    },
    {
        id: 'cpn_005',
        code: 'STUDENT15',
        description: 'Student discount on all products',
        discount: '15% OFF',
        validUntil: '2026-05-30',
        minPurchase: '800',
        maxDiscount: '400',
        isScratched: false,
        isRedeemed: false,
        category: 'special'
    }
]

// --- Sub-Components ---

// 1. Scratch Card Component (Optimized)
interface ScratchCardProps {
    coupon: Coupon
    onScratchComplete: (id: string) => void
}

const ScratchCard = ({ coupon, onScratchComplete }: ScratchCardProps) => {
    const [isScratching, setIsScratching] = useState(false)
    const [scratchPercentage, setScratchPercentage] = useState(0)
    const canvasRef = useRef<HTMLCanvasElement>(null)
    const containerRef = useRef<HTMLDivElement>(null)
    const isScratched = scratchPercentage >= 70 || coupon.isScratched
    const [isDrawing, setIsDrawing] = useState(false)
    const category = categoryConfig[coupon.category]

    // Initialize Canvas
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

    }, [coupon.id, coupon.isScratched])

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

        // Desktop: Only scratch if mouse is down
        if ('touches' in e) {
            // Mobile: Always scratch on touch move
        } else {
            // Desktop: Check isDrawing state
            if (!isDrawing) return
            // Prevent text selection while dragging
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

        // Throttle percentage calculation slightly
        const percentage = calculateScratchPercentage()
        setScratchPercentage(percentage)

        if (percentage >= 70) {
            onScratchComplete(coupon.id)
        }
    }, [isScratched, isDrawing, coupon.id, onScratchComplete, calculateScratchPercentage])
    const handleScratchEnd = useCallback(() => {
        setIsScratching(false)
    }, [])

    const handleMouseDown = () => setIsDrawing(true)
    const handleMouseUp = () => setIsDrawing(false)
    const handleMouseLeave = () => setIsDrawing(false)
    // Manual Reveal Button for Accessibility
    const handleManualReveal = () => {
        onScratchComplete(coupon.id)
    }

    return (
        <div
            ref={containerRef}
            className="relative w-full h-[240px] rounded-3xl overflow-hidden shadow-lg select-none touch-none"
        >
            {/* Revealed Content */}
            <div className={`absolute inset-0 bg-gradient-to-br ${category.gradient} p-6 flex flex-col items-center justify-center text-white transition-opacity duration-500`}>
                <div className="absolute top-4 left-4">
                    <span className="px-3 py-1 rounded-full text-xs font-medium bg-white/20 text-white backdrop-blur-sm flex items-center gap-1">
                        {category.icon}
                        {category.label}
                    </span>
                </div>

                <div className="absolute bottom-4 left-4 right-4 text-xs text-white/70 flex justify-between">
                    <span>Min. ₹{coupon.minPurchase}</span>
                    <span>Valid till {format(new Date(coupon.validUntil), 'dd MMM')}</span>
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
            {/* 
      {!isScratched && (
        <div className="absolute bottom-4 left-4 right-4 pointer-events-none">
          <div className="bg-black/40 backdrop-blur-sm rounded-full h-1.5 overflow-hidden">
            <motion.div
              className="h-full bg-white"
              initial={{ width: 0 }}
              animate={{ width: `${Math.min(scratchPercentage, 70)}%` }}
            />
          </div>
          <p className="text-center text-white text-[10px] mt-1 font-medium opacity-80">
            {Math.round(scratchPercentage)}% Scratched
          </p>
        </div>
      )} */}

            {/* Reveal Button (Fallback) */}
            {/* {!isScratched && (
        <button
          onClick={handleManualReveal}
          className="absolute top-4 right-4 p-2 bg-white/20 hover:bg-white/30 rounded-full text-white backdrop-blur-sm transition-colors pointer-events-auto"
          title="Reveal instantly"
        >
          <Eye className="w-4 h-4" />
        </button>
      )} */}
        </div>
    )
}

// --- Main Component ---
export default function OffersPage() {
    const [activeTab, setActiveTab] = useState<'refer' | 'coupons'>('refer')
    const [referrals, setReferrals] = useState<Referral[]>(initialReferrals)
    const [coupons, setCoupons] = useState<Coupon[]>(initialCoupons)
    const [copiedCode, setCopiedCode] = useState<string | null>(null)
    const [showReferModal, setShowReferModal] = useState(false)
    const [referEmail, setReferEmail] = useState('')
    const [referMessage, setReferMessage] = useState('')
    const [isSubmitting, setIsSubmitting] = useState(false)
    const [selectedCoupon, setSelectedCoupon] = useState<Coupon | null>(null)

    // Stats Calculation
    const stats = {
        totalReferrals: referrals.length,
        pointsEarned: referrals.reduce((acc, ref) => acc + ref.pointsEarned, 0),
        couponsAvailable: coupons.filter(c => !c.isRedeemed).length
    }

    // Actions
    const copyReferralLink = () => {
        const link = 'https://yourapp.com/refer?code=USER123'
        navigator.clipboard.writeText(link)
        setCopiedCode('referral')
        setTimeout(() => setCopiedCode(null), 2000)
    }

    const handleScratchComplete = useCallback((couponId: string) => {
        setCoupons(prev => prev.map(coupon =>
            coupon.id === couponId ? { ...coupon, isScratched: true } : coupon
        ))
        const coupon = coupons.find(c => c.id === couponId)
        if (coupon) {
            // Small delay to allow state update before showing modal
            setTimeout(() => setSelectedCoupon({ ...coupon, isScratched: true }), 300)
        }
    }, [coupons])

    const copyCouponCode = (code: string, e: React.MouseEvent) => {
        e.stopPropagation()
        navigator.clipboard.writeText(code)
        setCopiedCode(code)
        setTimeout(() => setCopiedCode(null), 2000)
    }

    const redeemCoupon = (couponId: string, e: React.MouseEvent) => {
        e.stopPropagation()
        setCoupons(prev => prev.map(coupon =>
            coupon.id === couponId ? { ...coupon, isRedeemed: true } : coupon
        ))
        setSelectedCoupon(null)
    }

    const sendReferral = (e: React.FormEvent) => {
        e.preventDefault()
        setIsSubmitting(true)
        setTimeout(() => {
            const newReferral: Referral = {
                id: `ref_${Date.now()}`,
                friendName: referEmail.split('@')[0],
                friendEmail: referEmail,
                status: 'pending',
                date: new Date().toISOString(),
                pointsEarned: 0,
                avatar: referEmail.substring(0, 2).toUpperCase()
            }
            setReferrals(prev => [newReferral, ...prev])
            setShowReferModal(false)
            setReferEmail('')
            setReferMessage('')
            setIsSubmitting(false)
        }, 1500)
    }

    const shareViaSocial = (platform: string) => {
        const text = "Join me on this amazing platform and get 50 points! Use my referral link:"
        const link = "https://yourapp.com/refer?code=USER123"
        let shareUrl = ''
        switch (platform) {
            //   case 'whatsapp':
            //     shareUrl = `https://wa.me/?text=${encodeURIComponent(text + ' ' + link)}`
            //     break
            case 'telegram':
                shareUrl = `https://t.me/share/url?url=${encodeURIComponent(link)}&text=${encodeURIComponent(text)}`
                break
            case 'email':
                shareUrl = `mailto:?subject=${encodeURIComponent('Join me on this platform')}&body=${encodeURIComponent(text + '\n' + link)}`
                break
        }
        window.open(shareUrl, '_blank')
    }

    return (
        <main className="flex-1 overflow-y-auto bg-slate-50 min-h-screen">
            <div className=" mx-auto sm:p-4 space-y-6">

                {/* Header */}
                <motion.div
                    initial={{ opacity: 0, y: -20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="flex flex-col sm:flex-row sm:items-center justify-between gap-4"
                >
                    <div>
                        <h1 className="text-2xl font-bold text-slate-900">Offers & Rewards</h1>
                        <p className="text-slate-500 text-sm mt-1">Earn points, unlock coupons, and enjoy exclusive benefits</p>
                    </div>
                    <div className="flex gap-4">
                        <div className="bg-white px-4 py-2 rounded-xl shadow-sm border border-slate-100 flex items-center gap-2">
                            <Trophy className="w-5 h-5 text-amber-500" />
                            <div>
                                <p className="text-xs text-slate-500 font-medium">Points</p>
                                <p className="text-lg font-bold text-slate-900">{stats.pointsEarned}</p>
                            </div>
                        </div>
                    </div>
                </motion.div>

                {/* Tabs */}
                <div className="flex gap-2 border-b border-slate-200 bg-white sticky top-0 z-30 px-4 sm:px-0 pt-4 sm:pt-0">
                    {['refer', 'coupons', "rewards"].map((tab) => (
                        <motion.button
                            key={tab}
                            whileHover={{ y: -2 }}
                            whileTap={{ scale: 0.95 }}
                            onClick={() => setActiveTab(tab as 'refer' | 'coupons')}
                            className={`pb-4 px-4 font-semibold text-sm flex items-center gap-2 transition-all relative ${activeTab === tab ? 'text-slate-900' : 'text-slate-500 hover:text-slate-700'
                                }`}
                        >
                            {tab === 'refer' ? <UserPlus className="w-5 h-5" /> : tab == "rewards" ? <Gift className="w-5 h-5" /> : <Ticket className="w-5 h-5" />}
                            {tab === 'refer' ? 'Refer & Earn' : tab == "rewards" ? 'Rewards' : 'My Coupons'}

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
                            className="space-y-6"
                        >
                            {/* Referral Banner */}
                            <div className="relative overflow-hidden rounded-3xl bg-slate-900 p-8 text-white shadow-xl">
                                <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-20" />
                                <div className="relative z-10 flex flex-col md:flex-row items-center justify-between gap-8">
                                    <div className="space-y-4 flex-1">
                                        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-500/20 text-amber-400 text-sm font-medium border border-amber-500/30">
                                            <Sparkles className="w-4 h-4" /> Limited Time Offer
                                        </div>
                                        <h2 className="text-3xl font-bold tracking-tight">Refer a Friend & Earn</h2>
                                        <p className="text-slate-300 text-base max-w-xl leading-relaxed">
                                            Share your unique referral link with friends. When they join, you both get 50 points instantly. No limits on earnings!
                                        </p>
                                        <div className="flex flex-wrap gap-3 pt-2">
                                            <div className="flex items-center gap-2 px-4 py-2 rounded-lg bg-white/10 backdrop-blur border border-white/10">
                                                <Gift className="w-4 h-4 text-amber-400" />
                                                <span className="text-sm font-medium">50 Points per referral</span>
                                            </div>
                                            <div className="flex items-center gap-2 px-4 py-2 rounded-lg bg-white/10 backdrop-blur border border-white/10">
                                                <Users className="w-4 h-4 text-amber-400" />
                                                <span className="text-sm font-medium">Unlimited earnings</span>
                                            </div>
                                        </div>
                                    </div>
                                    <motion.button
                                        whileHover={{ scale: 1.05 }}
                                        whileTap={{ scale: 0.95 }}
                                        onClick={() => setShowReferModal(true)}
                                        className="px-8 py-4 bg-amber-500 hover:bg-amber-600 text-slate-900 rounded-xl font-bold shadow-lg shadow-amber-500/20 transition-all flex items-center gap-2 whitespace-nowrap"
                                    >
                                        <UserPlus className="w-5 h-5" />
                                        Refer Now
                                    </motion.button>
                                </div>
                            </div>

                            {/* Referral Link Section */}
                            <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm">
                                <h3 className="text-lg font-semibold mb-4 flex items-center gap-2 text-slate-900">
                                    <Share2 className="w-5 h-5 text-purple-600" />
                                    Your Referral Link
                                </h3>
                                <div className="flex flex-col sm:flex-row gap-3">
                                    <div className="flex-1 relative">
                                        <input
                                            type="text"
                                            readOnly
                                            value="https://yourapp.com/refer?code=USER123"
                                            className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-slate-700 font-mono text-sm focus:outline-none focus:ring-2 focus:ring-purple-500"
                                        />
                                        <button
                                            onClick={copyReferralLink}
                                            className="absolute right-2 top-1/2 -translate-y-1/2 p-2 hover:bg-slate-200 rounded-lg transition-colors"
                                        >
                                            {copiedCode === 'referral' ? (
                                                <Check className="w-5 h-5 text-green-600" />
                                            ) : (
                                                <Copy className="w-5 h-5 text-slate-500" />
                                            )}
                                        </button>
                                    </div>
                                    <div className="flex gap-2">
                                        {[
                                            //   { id: 'whatsapp', icon: Whatsapp, color: 'bg-green-500 hover:bg-green-600' },
                                            { id: 'telegram', icon: Send, color: 'bg-blue-500 hover:bg-blue-600' },
                                            { id: 'email', icon: Mail, color: 'bg-slate-700 hover:bg-slate-800' }
                                        ].map((platform) => (
                                            <motion.button
                                                key={platform.id}
                                                whileHover={{ scale: 1.1 }}
                                                whileTap={{ scale: 0.9 }}
                                                onClick={() => shareViaSocial(platform.id)}
                                                className={`p-3 text-white rounded-xl transition-colors ${platform.color}`}
                                            >
                                                <platform.icon className="w-5 h-5" />
                                            </motion.button>
                                        ))}
                                    </div>
                                </div>
                            </div>

                            {/* Recent Referrals */}
                            <div className="space-y-4">
                                <h3 className="text-lg font-semibold text-slate-900">Recent Referrals</h3>
                                <div className="space-y-3">
                                    {referrals.map((referral, index) => (
                                        <motion.div
                                            key={referral.id}
                                            initial={{ opacity: 0, y: 20 }}
                                            animate={{ opacity: 1, y: 0 }}
                                            transition={{ delay: index * 0.05 }}
                                            className="rounded-xl p-4 bg-white border border-slate-200 shadow-sm flex items-center justify-between"
                                        >
                                            <div className="flex items-center gap-4">
                                                <div className="w-12 h-12 rounded-full bg-gradient-to-br from-purple-500 to-indigo-600 flex items-center justify-center text-white font-bold shadow-md">
                                                    {referral.avatar}
                                                </div>
                                                <div>
                                                    <h4 className="font-semibold text-slate-900">{referral.friendName}</h4>
                                                    <p className="text-sm text-slate-500">{referral.friendEmail}</p>
                                                    <div className="flex items-center gap-2 mt-1">
                                                        <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-medium ${statusConfig[referral.status].color}`}>
                                                            {statusConfig[referral.status].icon}
                                                            {statusConfig[referral.status].label}
                                                        </span>
                                                        <span className="text-xs text-slate-400">
                                                            {formatDistanceToNow(new Date(referral.date), { addSuffix: true })}
                                                        </span>
                                                    </div>
                                                </div>
                                            </div>
                                            {referral.pointsEarned > 0 && (
                                                <div className="text-right">
                                                    <p className="text-xs text-slate-500">Points Earned</p>
                                                    <p className="text-lg font-bold text-green-600">+{referral.pointsEarned}</p>
                                                </div>
                                            )}
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
                            className="space-y-6 max-w-6xl mx-auto"
                        >
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                                {coupons.map((coupon, index) => (
                                    <motion.div
                                        key={coupon.id}
                                        initial={{ opacity: 0, y: 20 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        transition={{ delay: index * 0.05 }}
                                    >
                                        {!coupon.isScratched ? (
                                            <ScratchCard coupon={coupon} onScratchComplete={handleScratchComplete} />
                                        ) : (
                                            <div
                                                onClick={() => setSelectedCoupon(coupon)}
                                                className={`relative group cursor-pointer rounded-3xl p-[1px] 
  bg-gradient-to-r from-pink-500 via-purple-500 to-indigo-500 
  hover:scale-[1.01] transition-all duration-300 shadow-lg hover:shadow-2xl`}
                                            >

                                                {/* Glass Card */}
                                                <div className="relative bg-white/90 backdrop-blur-xl rounded-3xl overflow-hidden">

                                                    {/* Shine Effect */}
                                                    <div className="absolute inset-0 bg-gradient-to-tr from-white/10 via-white/30 to-transparent opacity-0 group-hover:opacity-100 transition duration-500" />

                                                    {/* <div className={`absolute top-4 left-4 z-20 px-3 py-1 rounded-full text-xs font-semibold shadow-md flex items-center gap-1 
      ${categoryConfig[coupon.category].bgColor} ${categoryConfig[coupon.category].textColor}`}>
                                                        {categoryConfig[coupon.category].icon}
                                                        {categoryConfig[coupon.category].label}
                                                    </div> */}

                                                    {/* Expiring Soon Ribbon */}
                                                    {new Date(coupon.validUntil) < addDays(new Date(), 7) && !coupon.isRedeemed && (
                                                        <div className="absolute top-4 right-[-40px] rotate-45 bg-red-500 text-white text-xs px-10 py-1 shadow-lg animate-pulse">
                                                            Expiring Soon
                                                        </div>
                                                    )}

                                                    {/* Gradient Header */}
                                                    <div className={`p-6 bg-gradient-to-br ${categoryConfig[coupon.category].gradient} text-white`}>
                                                        <div className="mt-2 text-center">
                                                            <p className="text-2xl font-extrabold tracking-tight drop-shadow-lg">
                                                                {coupon.discount}
                                                            </p>
                                                            <p className="text-sm text-white/90 mt-1 line-clamp-2">
                                                                {coupon.description}
                                                            </p>
                                                        </div>
                                                    </div>

                                                    {/* Body */}
                                                    <div className="p-3 space-y-3 mb-4">

                                                        {/* Coupon Code */}
                                                        <div className="bg-slate-100 rounded-xl px-2 py-1 flex items-center justify-between border border-dashed border-slate-300 hover:border-slate-400 transition">
                                                            <code className="font-medium text-slate-800">
                                                                {coupon.code}
                                                            </code>

                                                            <button
                                                                onClick={(e) => copyCouponCode(coupon.code, e)}
                                                                className="p-2 rounded-full bg-white shadow hover:scale-110 transition"
                                                            >
                                                                {copiedCode === coupon.code ? (
                                                                    <Check className="w-4 h-4 text-green-600" />
                                                                ) : (
                                                                    <Copy className="w-4 h-4 text-slate-600" />
                                                                )}
                                                            </button>
                                                        </div>

                                                        {/* Info Row */}
                                                        <div className="flex items-center justify-between text-xs text-slate-500">
                                                            <span className="font-medium">Min. ₹{coupon.minPurchase}</span>
                                                            <span className="flex items-center gap-1">
                                                                <Calendar className="w-3 h-3" />
                                                                {format(new Date(coupon.validUntil), 'dd MMM yyyy')}
                                                            </span>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>

                                        )}
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
                            className="space-y-6 max-w-6xl mx-auto"
                        >
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                                {coupons.map((coupon, index) => (
                                    <motion.div
                                        key={coupon.id}
                                        initial={{ opacity: 0, y: 20 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        transition={{ delay: index * 0.05 }}
                                    >
                                        {!coupon.isScratched ? (
                                            <ScratchCard coupon={coupon} onScratchComplete={handleScratchComplete} />
                                        ) : (
                                            <div
                                                onClick={() => setSelectedCoupon(coupon)}
                                                className={`relative group cursor-pointer rounded-3xl p-[1px] 
  bg-gradient-to-r from-pink-500 via-purple-500 to-indigo-500 
  hover:scale-[1.01] transition-all duration-300 shadow-lg hover:shadow-2xl`}
                                            >

                                                {/* Glass Card */}
                                                <div className="relative bg-white/90 backdrop-blur-xl rounded-3xl overflow-hidden">

                                                    {/* Shine Effect */}
                                                    <div className="absolute inset-0 bg-gradient-to-tr from-white/10 via-white/30 to-transparent opacity-0 group-hover:opacity-100 transition duration-500" />

                                                    {/* <div className={`absolute top-4 left-4 z-20 px-3 py-1 rounded-full text-xs font-semibold shadow-md flex items-center gap-1 
      ${categoryConfig[coupon.category].bgColor} ${categoryConfig[coupon.category].textColor}`}>
                                                        {categoryConfig[coupon.category].icon}
                                                        {categoryConfig[coupon.category].label}
                                                    </div> */}

                                                    {/* Expiring Soon Ribbon */}
                                                    {new Date(coupon.validUntil) < addDays(new Date(), 7) && !coupon.isRedeemed && (
                                                        <div className="absolute top-4 right-[-40px] rotate-45 bg-red-500 text-white text-xs px-10 py-1 shadow-lg animate-pulse">
                                                            Expiring Soon
                                                        </div>
                                                    )}

                                                    {/* Gradient Header */}
                                                    <div className={`p-6 bg-gradient-to-br ${categoryConfig[coupon.category].gradient} text-white`}>
                                                        <div className="mt-2 text-center">
                                                            <p className="text-2xl font-extrabold tracking-tight drop-shadow-lg">
                                                                {coupon.discount}
                                                            </p>
                                                            <p className="text-sm text-white/90 mt-1 line-clamp-2">
                                                                {coupon.description}
                                                            </p>
                                                        </div>
                                                    </div>

                                                    {/* Body */}
                                                    <div className="p-3 space-y-3 mb-4">

                                                        {/* Coupon Code */}
                                                        <div className="bg-slate-100 rounded-xl px-2 py-1 flex items-center justify-between border border-dashed border-slate-300 hover:border-slate-400 transition">
                                                            <code className="font-medium text-slate-800">
                                                                {coupon.code}
                                                            </code>

                                                            <button
                                                                onClick={(e) => copyCouponCode(coupon.code, e)}
                                                                className="p-2 rounded-full bg-white shadow hover:scale-110 transition"
                                                            >
                                                                {copiedCode === coupon.code ? (
                                                                    <Check className="w-4 h-4 text-green-600" />
                                                                ) : (
                                                                    <Copy className="w-4 h-4 text-slate-600" />
                                                                )}
                                                            </button>
                                                        </div>

                                                        {/* Info Row */}
                                                        <div className="flex items-center justify-between text-xs text-slate-500">
                                                            <span className="font-medium">Min. ₹{coupon.minPurchase}</span>
                                                            <span className="flex items-center gap-1">
                                                                <Calendar className="w-3 h-3" />
                                                                {format(new Date(coupon.validUntil), 'dd MMM yyyy')}
                                                            </span>
                                                        </div>
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
            <AnimatePresence>
                {showReferModal && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm"
                        onClick={() => setShowReferModal(false)}
                    >
                        <motion.div
                            initial={{ scale: 0.9, y: 20 }}
                            animate={{ scale: 1, y: 0 }}
                            exit={{ scale: 0.9, y: 20 }}
                            onClick={(e) => e.stopPropagation()}
                            className="bg-white rounded-2xl max-w-md w-full p-8 shadow-2xl border border-slate-200"
                        >
                            <div className="flex items-center justify-between mb-6">
                                <h2 className="text-2xl font-bold flex items-center gap-2 text-slate-900">
                                    <UserPlus className="w-6 h-6 text-amber-500" />
                                    Refer a Friend
                                </h2>
                                <button
                                    onClick={() => setShowReferModal(false)}
                                    className="p-2 hover:bg-slate-100 rounded-lg transition-colors"
                                >
                                    <X className="w-5 h-5 text-slate-500" />
                                </button>
                            </div>
                            <form onSubmit={sendReferral} className="space-y-5">
                                <div>
                                    <label className="block text-sm font-semibold text-slate-900 mb-2">
                                        Friend's Email
                                    </label>
                                    <input
                                        type="email"
                                        required
                                        value={referEmail}
                                        onChange={(e) => setReferEmail(e.target.value)}
                                        placeholder="friend@example.com"
                                        className="w-full px-4 py-3 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-transparent bg-slate-50 text-slate-900 placeholder-slate-400 transition-all"
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-semibold text-slate-900 mb-2">
                                        Personal Message (Optional)
                                    </label>
                                    <textarea
                                        value={referMessage}
                                        onChange={(e) => setReferMessage(e.target.value)}
                                        placeholder="Hey! I thought you might like this platform..."
                                        rows={4}
                                        className="w-full px-4 py-3 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-transparent bg-slate-50 text-slate-900 placeholder-slate-400 resize-none transition-all"
                                    />
                                </div>
                                <motion.button
                                    type="submit"
                                    disabled={isSubmitting}
                                    whileHover={{ scale: 1.02 }}
                                    whileTap={{ scale: 0.98 }}
                                    className="w-full py-3.5 bg-slate-900 hover:bg-slate-800 text-white rounded-xl font-semibold transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 shadow-lg shadow-slate-900/20"
                                >
                                    {isSubmitting ? (
                                        <>
                                            <Loader2 className="w-5 h-5 animate-spin" />
                                            <span>Sending...</span>
                                        </>
                                    ) : (
                                        <>
                                            <Send className="w-5 h-5" />
                                            <span>Send Invitation</span>
                                        </>
                                    )}
                                </motion.button>
                            </form>
                            <div className="mt-6 pt-6 border-t border-slate-100">
                                <p className="text-sm text-slate-500 text-center font-medium">
                                    Both of you get <span className="text-amber-600 font-bold">50 points</span> when they join!
                                </p>
                            </div>
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>
        </main>
    )
}