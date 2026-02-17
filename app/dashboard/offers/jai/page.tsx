"use client"
import { useState, useEffect, useRef, useCallback } from "react"
import { motion, AnimatePresence, useMotionValue, useTransform, PanInfo } from "framer-motion"
import {
  Gift, Share2, Users, Copy, Check, Zap, Ticket,
  Award, TrendingUp, Star, Clock, ChevronRight,
  Loader2, Sparkles, GiftIcon, BadgePercent, QrCode,
  Info, X, UserPlus, Wallet, CreditCard, Calendar,
  Eye, EyeOff, AlertCircle, Heart, Facebook, Twitter,
  Linkedin, Mail, MessageCircle, ChevronDown, Percent,
  Coins, Gem, Crown, Shield, ZapOff,
  SearchIcon
} from "lucide-react"
import { formatDistanceToNow, format, isAfter, isBefore, addDays } from "date-fns"

// Types
interface Referral {
  id: string
  friendName: string
  friendEmail: string
  status: 'pending' | 'joined' | 'earned'
  date: string
  pointsEarned: number
  avatar?: string
  referralCode: string
}

interface Coupon {
  id: string
  code: string
  description: string
  discount: string
  discountType: 'percentage' | 'fixed' | 'bogo'
  validFrom: string
  validUntil: string
  minPurchase?: number
  maxDiscount?: number
  isScratched: boolean
  isRedeemed: boolean
  category: 'welcome' | 'special' | 'referral' | 'festive' | 'vip'
  scratchPercentage: number
  usageLimit?: number
  usedCount?: number
  termsAndConditions: string[]
}

interface UserStats {
  totalReferrals: number
  pointsEarned: number
  pointsRedeemed: number
  couponsAvailable: number
  couponsRedeemed: number
  referralRank: 'bronze' | 'silver' | 'gold' | 'platinum'
  nextRankPoints: number
}

// Dummy Data
const referralData: Referral[] = [
  {
    id: 'ref_001',
    friendName: 'Sarah Johnson',
    friendEmail: 'sarah.j@example.com',
    status: 'earned',
    date: '2026-02-15T10:30:00Z',
    pointsEarned: 50,
    avatar: 'https://i.pravatar.cc/150?img=1',
    referralCode: 'SARAH50'
  },
  {
    id: 'ref_002',
    friendName: 'Michael Chen',
    friendEmail: 'michael.c@example.com',
    status: 'joined',
    date: '2026-02-14T15:45:00Z',
    pointsEarned: 50,
    avatar: 'https://i.pravatar.cc/150?img=2',
    referralCode: 'MICHAEL50'
  },
  {
    id: 'ref_003',
    friendName: 'Priya Patel',
    friendEmail: 'priya.p@example.com',
    status: 'pending',
    date: '2026-02-13T09:15:00Z',
    pointsEarned: 0,
    avatar: 'https://i.pravatar.cc/150?img=3',
    referralCode: 'PRIYA25'
  },
  {
    id: 'ref_004',
    friendName: 'David Kim',
    friendEmail: 'david.k@example.com',
    status: 'earned',
    date: '2026-02-12T14:20:00Z',
    pointsEarned: 50,
    avatar: 'https://i.pravatar.cc/150?img=4',
    referralCode: 'DAVID50'
  }
]

const couponsData: Coupon[] = [
  {
    id: 'cpn_001',
    code: 'WELCOME50',
    description: 'Get 50% off on your first purchase',
    discount: '50% OFF',
    discountType: 'percentage',
    validFrom: '2026-01-01',
    validUntil: '2026-03-31',
    minPurchase: 1000,
    maxDiscount: 500,
    isScratched: false,
    isRedeemed: false,
    category: 'welcome',
    scratchPercentage: 0,
    usageLimit: 1,
    usedCount: 0,
    termsAndConditions: [
      'Valid on first purchase only',
      'Minimum order value ₹1000',
      'Maximum discount ₹500',
      'Cannot be clubbed with other offers'
    ]
  },
  {
    id: 'cpn_002',
    code: 'FLAT200',
    description: 'Flat ₹200 off on orders above ₹2000',
    discount: '₹200 OFF',
    discountType: 'fixed',
    validFrom: '2026-02-01',
    validUntil: '2026-02-28',
    minPurchase: 2000,
    isScratched: true,
    isRedeemed: false,
    category: 'special',
    scratchPercentage: 100,
    usageLimit: 2,
    usedCount: 1,
    termsAndConditions: [
      'Valid on all products',
      'Minimum order value ₹2000',
      'Use code at checkout'
    ]
  },
  {
    id: 'cpn_003',
    code: 'BOGO50',
    description: 'Buy 1 Get 1 Free on selected items',
    discount: 'BOGO',
    discountType: 'bogo',
    validFrom: '2026-02-01',
    validUntil: '2026-04-15',
    minPurchase: 1500,
    isScratched: false,
    isRedeemed: false,
    category: 'referral',
    scratchPercentage: 0,
    termsAndConditions: [
      'Valid on selected items only',
      'Free item of equal or lesser value',
      'Cannot be exchanged for cash'
    ]
  },
  {
    id: 'cpn_004',
    code: 'VIP100',
    description: 'Exclusive VIP offer - ₹1000 off',
    discount: '₹1000 OFF',
    discountType: 'fixed',
    validFrom: '2026-02-01',
    validUntil: '2026-03-15',
    minPurchase: 5000,
    maxDiscount: 1000,
    isScratched: true,
    isRedeemed: true,
    category: 'vip',
    scratchPercentage: 100,
    usageLimit: 1,
    usedCount: 1,
    termsAndConditions: [
      'Exclusive for VIP members',
      'Minimum order value ₹5000',
      'One time use only'
    ]
  },
  {
    id: 'cpn_005',
    code: 'FESTIVE25',
    description: 'Festive season special - 25% off',
    discount: '25% OFF',
    discountType: 'percentage',
    validFrom: '2026-02-15',
    validUntil: '2026-03-30',
    minPurchase: 800,
    maxDiscount: 400,
    isScratched: false,
    isRedeemed: false,
    category: 'festive',
    scratchPercentage: 0,
    usageLimit: 3,
    usedCount: 0,
    termsAndConditions: [
      'Valid on festive collection',
      'Maximum discount ₹400',
      'Limited period offer'
    ]
  }
]

// Rank Config
const rankConfig = {
  bronze: {
    label: 'Bronze',
    color: 'from-amber-600 to-amber-700',
    bgColor: 'bg-amber-100',
    textColor: 'text-amber-700',
    icon: <Gem className="w-5 h-5" />,
    minPoints: 0,
    benefits: ['Basic referrals', 'Standard coupons']
  },
  silver: {
    label: 'Silver',
    color: 'from-gray-400 to-gray-500',
    bgColor: 'bg-gray-100',
    textColor: 'text-gray-600',
    icon: <Gem className="w-5 h-5" />,
    minPoints: 500,
    benefits: ['5% bonus points', 'Early access to offers']
  },
  gold: {
    label: 'Gold',
    color: 'from-yellow-400 to-yellow-500',
    bgColor: 'bg-yellow-100',
    textColor: 'text-yellow-600',
    icon: <Crown className="w-5 h-5" />,
    minPoints: 1000,
    benefits: ['10% bonus points', 'Exclusive gold coupons']
  },
  platinum: {
    label: 'Platinum',
    color: 'from-purple-400 to-purple-500',
    bgColor: 'bg-purple-100',
    textColor: 'text-purple-600',
    icon: <Shield className="w-5 h-5" />,
    minPoints: 2500,
    benefits: ['20% bonus points', 'Priority support', 'Platinum events']
  }
}

// Category Config
const categoryConfig = {
  welcome: {
    label: 'Welcome',
    gradient: 'from-green-400 to-emerald-600',
    bgColor: 'bg-emerald-50',
    textColor: 'text-emerald-600',
    borderColor: 'border-emerald-200',
    icon: <Gift className="w-5 h-5" />
  },
  special: {
    label: 'Special',
    gradient: 'from-blue-400 to-indigo-600',
    bgColor: 'bg-blue-50',
    textColor: 'text-blue-600',
    borderColor: 'border-blue-200',
    icon: <Star className="w-5 h-5" />
  },
  referral: {
    label: 'Referral',
    gradient: 'from-purple-400 to-purple-600',
    bgColor: 'bg-purple-50',
    textColor: 'text-purple-600',
    borderColor: 'border-purple-200',
    icon: <Users className="w-5 h-5" />
  },
  festive: {
    label: 'Festive',
    gradient: 'from-red-400 to-rose-600',
    bgColor: 'bg-red-50',
    textColor: 'text-red-600',
    borderColor: 'border-red-200',
    icon: <Sparkles className="w-5 h-5" />
  },
  vip: {
    label: 'VIP',
    gradient: 'from-amber-400 to-orange-600',
    bgColor: 'bg-amber-50',
    textColor: 'text-amber-600',
    borderColor: 'border-amber-200',
    icon: <Crown className="w-5 h-5" />
  }
}

// Scratch Card Component with real scratch effect
const ScratchCard = ({ coupon, onScratch }: { coupon: Coupon; onScratch: (id: string) => void }) => {
  const [isScratching, setIsScratching] = useState(false)
  const [scratchPercentage, setScratchPercentage] = useState(coupon.scratchPercentage)
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const containerRef = useRef<HTMLDivElement>(null)
  const isScratched = scratchPercentage >= 70
  const category = categoryConfig[coupon.category]

  // Initialize canvas with scratch layer
  useEffect(() => {
    if (!canvasRef.current || !containerRef.current || isScratched) return

    const canvas = canvasRef.current
    const ctx = canvas.getContext('2d')
    const container = containerRef.current

    // Set canvas dimensions
    canvas.width = container.offsetWidth
    canvas.height = container.offsetHeight

    if (ctx) {
      // Create scratch layer with metallic effect
      const gradient = ctx.createLinearGradient(0, 0, canvas.width, canvas.height)
      gradient.addColorStop(0, '#4a5568')
      gradient.addColorStop(0.5, '#718096')
      gradient.addColorStop(1, '#4a5568')

      // Fill with gradient
      ctx.fillStyle = gradient
      ctx.fillRect(0, 0, canvas.width, canvas.height)

      // Add scratch pattern
      ctx.strokeStyle = '#a0aec0'
      ctx.lineWidth = 2
      for (let i = 0; i < 20; i++) {
        ctx.beginPath()
        ctx.moveTo(Math.random() * canvas.width, Math.random() * canvas.height)
        ctx.lineTo(Math.random() * canvas.width, Math.random() * canvas.height)
        ctx.strokeStyle = `rgba(160, 174, 192, ${Math.random() * 0.3})`
        ctx.stroke()
      }

      // Add text
      ctx.fillStyle = '#e2e8f0'
      ctx.font = 'bold 16px system-ui'
      ctx.textAlign = 'center'
      ctx.fillText('SCRATCH HERE', canvas.width / 2, canvas.height / 2)
      
      ctx.font = '12px system-ui'
      ctx.fillStyle = '#cbd5e0'
      ctx.fillText('to reveal your coupon', canvas.width / 2, canvas.height / 2 + 30)
    }
  }, [coupon.id, isScratched])

  // Handle scratching
  const handleScratch = useCallback((e: React.MouseEvent<HTMLCanvasElement> | React.TouchEvent<HTMLCanvasElement>) => {
    if (!canvasRef.current || isScratched) return

    setIsScratching(true)
    const canvas = canvasRef.current
    const ctx = canvas.getContext('2d')
    if (!ctx) return

    // Get coordinates
    let clientX: number, clientY: number
    if ('touches' in e) {
      clientX = e.touches[0].clientX
      clientY = e.touches[0].clientY
    } else {
      clientX = e.clientX
      clientY = e.clientY
    }

    const rect = canvas.getBoundingClientRect()
    const x = clientX - rect.left
    const y = clientY - rect.top

    // Scratch with brush
    ctx.globalCompositeOperation = 'destination-out'
    ctx.beginPath()
    ctx.arc(x, y, 20, 0, Math.PI * 2)
    ctx.fill()

    // Calculate scratch percentage
    const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height)
    const pixels = imageData.data
    let cleared = 0

    for (let i = 3; i < pixels.length; i += 4) {
      if (pixels[i] === 0) cleared++
    }

    const percentage = (cleared / (canvas.width * canvas.height)) * 100
    setScratchPercentage(percentage)

    // Auto-reveal at 70%
    if (percentage >= 70) {
      onScratch(coupon.id)
    }
  }, [isScratched, coupon.id, onScratch])

  // Stop scratching
  const handleScratchEnd = useCallback(() => {
    setIsScratching(false)
  }, [])

  return (
    <div 
      ref={containerRef}
      className="relative w-full h-[300px] rounded-2xl overflow-hidden shadow-2xl"
    >
      {/* Revealed Content */}
      <div className={`absolute inset-0 bg-gradient-to-br ${category.gradient} p-6`}>
        <div className="absolute top-4 left-4">
          <span className={`px-3 py-1 rounded-full text-xs font-medium bg-white/20 text-white backdrop-blur-sm`}>
            {category.label}
          </span>
        </div>
        
        <div className="h-full flex flex-col items-center justify-center text-white">
          <div className="w-20 h-20 rounded-full bg-white/20 flex items-center justify-center mb-4 backdrop-blur-sm">
            <Percent className="w-10 h-10" />
          </div>
          <h3 className="text-3xl font-bold mb-2">{coupon.discount}</h3>
          <p className="text-sm text-white/80 text-center max-w-[200px] mb-4">
            {coupon.description}
          </p>
          
          <div className="absolute bottom-4 left-4 right-4 text-xs text-white/60">
            <div className="flex items-center justify-between">
              <span>Min. ₹{coupon.minPurchase}</span>
              <span>Valid till {format(new Date(coupon.validUntil), 'dd MMM')}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Scratch Layer */}
      <canvas
        ref={canvasRef}
        className={`absolute inset-0 w-full h-full cursor-cell touch-none transition-opacity duration-300 ${
          isScratched ? 'opacity-0 pointer-events-none' : 'opacity-100'
        }`}
        onMouseMove={handleScratch}
        onMouseDown={handleScratch}
        onMouseUp={handleScratchEnd}
        onMouseLeave={handleScratchEnd}
        onTouchMove={handleScratch}
        onTouchStart={handleScratch}
        onTouchEnd={handleScratchEnd}
        onTouchCancel={handleScratchEnd}
      />

      {/* Scratch Progress */}
      {!isScratched && (
        <div className="absolute bottom-4 left-4 right-4">
          <div className="bg-black/50 backdrop-blur-sm rounded-full h-2 overflow-hidden">
            <motion.div
              className="h-full bg-white"
              initial={{ width: 0 }}
              animate={{ width: `${scratchPercentage}%` }}
              transition={{ duration: 0.1 }}
            />
          </div>
          <p className="text-center text-white text-xs mt-2">
            Scratch {Math.round(scratchPercentage)}% - Need 70% to reveal
          </p>
        </div>
      )}
    </div>
  )
}

export default function OffersPage() {
  const [activeTab, setActiveTab] = useState<'refer' | 'coupons'>('refer')
  const [referrals, setReferrals] = useState<Referral[]>(referralData)
  const [coupons, setCoupons] = useState<Coupon[]>(couponsData)
  const [copiedCode, setCopiedCode] = useState<string | null>(null)
  const [showReferModal, setShowReferModal] = useState(false)
  const [showCouponModal, setShowCouponModal] = useState<Coupon | null>(null)
  const [referEmail, setReferEmail] = useState('')
  const [referMessage, setReferMessage] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedCategory, setSelectedCategory] = useState<string>('all')
  const [sortBy, setSortBy] = useState<'newest' | 'expiry' | 'value'>('newest')
  const [showFilters, setShowFilters] = useState(false)
  const [stats, setStats] = useState<UserStats>({
    totalReferrals: 0,
    pointsEarned: 0,
    pointsRedeemed: 0,
    couponsAvailable: 0,
    couponsRedeemed: 0,
    referralRank: 'bronze',
    nextRankPoints: 500
  })

  // Calculate stats
  useEffect(() => {
    const totalReferrals = referrals.length
    const pointsEarned = referrals.reduce((acc, ref) => acc + ref.pointsEarned, 0)
    const pointsRedeemed = 150 // This would come from actual redemptions
    const couponsAvailable = coupons.filter(c => !c.isRedeemed && c.isScratched).length
    const couponsRedeemed = coupons.filter(c => c.isRedeemed).length
    
    let referralRank: 'bronze' | 'silver' | 'gold' | 'platinum' = 'bronze'
    let nextRankPoints = 500
    
    if (pointsEarned >= 2500) {
      referralRank = 'platinum'
      nextRankPoints = 0
    } else if (pointsEarned >= 1000) {
      referralRank = 'gold'
      nextRankPoints = 2500 - pointsEarned
    } else if (pointsEarned >= 500) {
      referralRank = 'silver'
      nextRankPoints = 1000 - pointsEarned
    } else {
      nextRankPoints = 500 - pointsEarned
    }

    setStats({
      totalReferrals,
      pointsEarned,
      pointsRedeemed,
      couponsAvailable,
      couponsRedeemed,
      referralRank,
      nextRankPoints
    })
  }, [referrals, coupons])

  // Copy referral link
  const copyReferralLink = useCallback(() => {
    const link = 'https://yourapp.com/ref/USER123'
    navigator.clipboard.writeText(link)
    setCopiedCode('referral')
    setTimeout(() => setCopiedCode(null), 2000)
  }, [])

  // Handle scratch completion
  const handleScratchComplete = useCallback((couponId: string) => {
    setCoupons(prev => prev.map(coupon => 
      coupon.id === couponId 
        ? { ...coupon, isScratched: true, scratchPercentage: 100 }
        : coupon
    ))
    
    // Show success toast/notification
    const coupon = coupons.find(c => c.id === couponId)
    if (coupon) {
      setShowCouponModal({ ...coupon, isScratched: true })
    }
  }, [coupons])

  // Copy coupon code
  const copyCouponCode = useCallback((code: string, e: React.MouseEvent) => {
    e.stopPropagation()
    navigator.clipboard.writeText(code)
    setCopiedCode(code)
    setTimeout(() => setCopiedCode(null), 2000)
  }, [])

  // Redeem coupon
  const redeemCoupon = useCallback((couponId: string) => {
    setCoupons(prev => prev.map(coupon => 
      coupon.id === couponId 
        ? { ...coupon, isRedeemed: true, usedCount: (coupon.usedCount || 0) + 1 }
        : coupon
    ))
    setShowCouponModal(null)
  }, [])

  // Send referral
  const sendReferral = useCallback((e: React.FormEvent) => {
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
        avatar: `https://i.pravatar.cc/150?u=${referEmail}`,
        referralCode: `${referEmail.substring(0, 3).toUpperCase()}${Math.floor(Math.random() * 100)}`
      }
      
      setReferrals(prev => [newReferral, ...prev])
      setShowReferModal(false)
      setReferEmail('')
      setReferMessage('')
      setIsSubmitting(false)
    }, 1500)
  }, [referEmail, referMessage])

  // Filter and sort coupons
  const filteredCoupons = coupons
    .filter(coupon => {
      if (selectedCategory !== 'all' && coupon.category !== selectedCategory) return false
      if (searchQuery) {
        const query = searchQuery.toLowerCase()
        return (
          coupon.code.toLowerCase().includes(query) ||
          coupon.description.toLowerCase().includes(query)
        )
      }
      return true
    })
    .sort((a, b) => {
      switch (sortBy) {
        case 'newest':
          return new Date(b.validFrom).getTime() - new Date(a.validFrom).getTime()
        case 'expiry':
          return new Date(a.validUntil).getTime() - new Date(b.validUntil).getTime()
        case 'value':
          if (a.discountType === 'percentage' && b.discountType === 'percentage') {
            return parseInt(b.discount) - parseInt(a.discount)
          }
          return 0
        default:
          return 0
      }
    })

  return (
    <main className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-slate-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="relative"
        >
          <div className="flex items-center justify-between flex-wrap gap-6">
            <div>
              <h1 className="text-4xl lg:text-5xl font-bold bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 bg-clip-text text-transparent">
                Offers & Rewards
              </h1>
              <p className="text-muted-foreground text-lg mt-2 max-w-2xl">
                Earn points, unlock exclusive coupons, and enjoy premium benefits. 
                The more you refer, the more you earn!
              </p>
            </div>
            
            {/* Rank Badge */}
            <motion.div
              whileHover={{ scale: 1.05 }}
              className={`px-6 py-3 rounded-2xl bg-gradient-to-r ${rankConfig[stats.referralRank].color} text-white shadow-lg`}
            >
              <div className="flex items-center gap-3">
                {rankConfig[stats.referralRank].icon}
                <div>
                  <p className="text-sm opacity-90">Your Rank</p>
                  <p className="text-xl font-bold">{rankConfig[stats.referralRank].label}</p>
                </div>
              </div>
            </motion.div>
          </div>
        </motion.div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            whileHover={{ y: -5 }}
            className="bg-white rounded-2xl p-6 shadow-xl border border-indigo-100"
          >
            <div className="flex items-center gap-4">
              <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-indigo-400 to-indigo-600 flex items-center justify-center shadow-lg">
                <Users className="w-7 h-7 text-white" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Total Referrals</p>
                <p className="text-3xl font-bold text-indigo-600">{stats.totalReferrals}</p>
              </div>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            whileHover={{ y: -5 }}
            className="bg-white rounded-2xl p-6 shadow-xl border border-purple-100"
          >
            <div className="flex items-center gap-4">
              <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-purple-400 to-purple-600 flex items-center justify-center shadow-lg">
                <Coins className="w-7 h-7 text-white" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Points Earned</p>
                <p className="text-3xl font-bold text-purple-600">{stats.pointsEarned}</p>
              </div>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            whileHover={{ y: -5 }}
            className="bg-white rounded-2xl p-6 shadow-xl border border-pink-100"
          >
            <div className="flex items-center gap-4">
              <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-pink-400 to-pink-600 flex items-center justify-center shadow-lg">
                <Ticket className="w-7 h-7 text-white" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Coupons Available</p>
                <p className="text-3xl font-bold text-pink-600">{stats.couponsAvailable}</p>
              </div>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            whileHover={{ y: -5 }}
            className="bg-white rounded-2xl p-6 shadow-xl border border-amber-100"
          >
            <div className="flex items-center gap-4">
              <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-amber-400 to-amber-600 flex items-center justify-center shadow-lg">
                <TrendingUp className="w-7 h-7 text-white" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Next Rank</p>
                <p className="text-3xl font-bold text-amber-600">{stats.nextRankPoints} pts</p>
              </div>
            </div>
          </motion.div>
        </div>

        {/* Progress to next rank */}
        {stats.nextRankPoints > 0 && (
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-white rounded-xl p-4 shadow-lg border border-gray-100"
          >
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm font-medium text-muted-foreground">
                Progress to {rankConfig[stats.referralRank === 'bronze' ? 'silver' : 
                                      stats.referralRank === 'silver' ? 'gold' : 'platinum'].label}
              </span>
              <span className="text-sm font-bold text-indigo-600">
                {stats.pointsEarned} / {stats.pointsEarned + stats.nextRankPoints}
              </span>
            </div>
            <div className="h-3 bg-gray-100 rounded-full overflow-hidden">
              <motion.div
                className="h-full bg-gradient-to-r from-indigo-500 to-purple-500"
                initial={{ width: 0 }}
                animate={{ width: `${(stats.pointsEarned / (stats.pointsEarned + stats.nextRankPoints)) * 100}%` }}
                transition={{ duration: 1, delay: 0.5 }}
              />
            </div>
          </motion.div>
        )}

        {/* Tabs */}
        <div className="flex gap-2 border-b border-gray-200">
          <motion.button
            whileHover={{ y: -2 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => setActiveTab('refer')}
            className={`pb-4 px-6 font-medium text-lg flex items-center gap-2 transition-all relative ${
              activeTab === 'refer'
                ? 'text-indigo-600'
                : 'text-muted-foreground hover:text-foreground'
            }`}
          >
            <UserPlus className="w-5 h-5" />
            Refer & Earn
            {stats.totalReferrals > 0 && (
              <span className="ml-2 px-2 py-0.5 bg-indigo-100 text-indigo-600 rounded-full text-sm">
                {stats.totalReferrals}
              </span>
            )}
            {activeTab === 'refer' && (
              <motion.div
                layoutId="activeTab"
                className="absolute bottom-0 left-0 right-0 h-0.5 bg-gradient-to-r from-indigo-500 to-purple-500"
              />
            )}
          </motion.button>
          
          <motion.button
            whileHover={{ y: -2 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => setActiveTab('coupons')}
            className={`pb-4 px-6 font-medium text-lg flex items-center gap-2 transition-all relative ${
              activeTab === 'coupons'
                ? 'text-indigo-600'
                : 'text-muted-foreground hover:text-foreground'
            }`}
          >
            <Ticket className="w-5 h-5" />
            Coupons
            {stats.couponsAvailable > 0 && (
              <span className="ml-2 px-2 py-0.5 bg-indigo-100 text-indigo-600 rounded-full text-sm">
                {stats.couponsAvailable}
              </span>
            )}
            {activeTab === 'coupons' && (
              <motion.div
                layoutId="activeTab"
                className="absolute bottom-0 left-0 right-0 h-0.5 bg-gradient-to-r from-indigo-500 to-purple-500"
              />
            )}
          </motion.button>
        </div>

        {/* Refer & Earn Tab */}
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
              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 p-8 text-white"
              >
                <div className="absolute inset-0 bg-grid-white/10 [mask-image:linear-gradient(0deg,transparent,black)]" />
                <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent" />
                
                <div className="relative z-10 flex flex-col lg:flex-row items-center justify-between gap-8">
                  <div className="space-y-4 max-w-2xl">
                    <div className="flex items-center gap-3">
                      <div className="p-2 bg-white/20 rounded-xl backdrop-blur">
                        <Sparkles className="w-6 h-6" />
                      </div>
                      <h2 className="text-3xl font-bold">Refer a Friend, Earn 50 Points!</h2>
                    </div>
                    
                    <p className="text-white/90 text-lg">
                      Share your unique referral link with friends. When they join using your link,
                      you both get 50 points instantly! Points can be redeemed for exclusive coupons.
                    </p>
                    
                    <div className="flex flex-wrap items-center gap-4 pt-4">
                      <div className="flex items-center gap-2 bg-white/20 backdrop-blur rounded-xl px-4 py-2">
                        <Gift className="w-5 h-5" />
                        <span>50 Points per referral</span>
                      </div>
                      <div className="flex items-center gap-2 bg-white/20 backdrop-blur rounded-xl px-4 py-2">
                        <Users className="w-5 h-5" />
                        <span>No limit on referrals</span>
                      </div>
                      <div className="flex items-center gap-2 bg-white/20 backdrop-blur rounded-xl px-4 py-2">
                        <Zap className="w-5 h-5" />
                        <span>Instant points credit</span>
                      </div>
                    </div>
                  </div>
                  
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => setShowReferModal(true)}
                    className="px-8 py-4 bg-white text-indigo-600 rounded-xl font-bold text-lg shadow-2xl hover:shadow-3xl transition-all flex items-center gap-2 whitespace-nowrap group"
                  >
                    <UserPlus className="w-5 h-5 group-hover:rotate-12 transition-transform" />
                    Refer Now
                  </motion.button>
                </div>
              </motion.div>

              {/* Referral Link Section */}
              <div className="bg-white rounded-2xl p-6 shadow-xl border border-indigo-100">
                <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
                  <Share2 className="w-5 h-5 text-indigo-600" />
                  Your Referral Link
                </h3>
                
                <div className="flex flex-col sm:flex-row gap-3">
                  <div className="flex-1 relative group">
                    <input
                      type="text"
                      readOnly
                      value="https://yourapp.com/ref/USER123"
                      className="w-full px-4 py-3 bg-indigo-50 border border-indigo-200 rounded-xl text-indigo-900 font-mono focus:outline-none focus:ring-2 focus:ring-indigo-500"
                    />
                    <button
                      onClick={copyReferralLink}
                      className="absolute right-2 top-1/2 -translate-y-1/2 p-2 hover:bg-indigo-200 rounded-lg transition-all group-hover:scale-110"
                    >
                      {copiedCode === 'referral' ? (
                        <Check className="w-5 h-5 text-green-600" />
                      ) : (
                        <Copy className="w-5 h-5 text-indigo-600" />
                      )}
                    </button>
                  </div>
                  
                  <div className="flex gap-2">
                    <motion.button
                      whileHover={{ scale: 1.1, rotate: 5 }}
                      whileTap={{ scale: 0.9 }}
                      onClick={() => window.open('https://wa.me/?text=Join%20me%20on%20this%20amazing%20platform%20https://yourapp.com/ref/USER123', '_blank')}
                      className="p-3 bg-green-500 text-white rounded-xl hover:bg-green-600 transition-all shadow-lg"
                      title="Share on WhatsApp"
                    >
                      <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                        <path d="M12.04 2C6.58 2 2.13 6.45 2.13 11.91C2.13 13.76 2.65 15.5 3.58 17L2.04 22L7.15 20.51C8.69 21.34 10.4 21.8 12.04 21.8C17.5 21.8 21.95 17.35 21.95 11.89C21.95 6.43 17.5 2 12.04 2ZM12.04 20.09C10.5 20.09 9 19.64 7.71 18.82L7.4 18.62L4.44 19.55L5.4 16.7L5.18 16.37C4.27 15.01 3.84 13.47 3.84 11.91C3.84 7.42 7.55 3.71 12.04 3.71C16.53 3.71 20.24 7.42 20.24 11.91C20.24 16.4 16.53 20.09 12.04 20.09ZM16.09 13.7C15.8 13.55 14.73 13.02 14.46 12.91C14.19 12.8 13.98 12.75 13.78 13.05C13.58 13.35 12.99 13.85 12.82 14.03C12.65 14.21 12.48 14.24 12.19 14.09C11.9 13.94 11.2 13.67 10.38 12.93C9.74 12.35 9.3 11.63 9.13 11.33C8.96 11.03 9.12 10.87 9.27 10.72C9.4 10.59 9.56 10.38 9.71 10.2C9.86 10.02 9.93 9.88 10.05 9.66C10.17 9.44 10.11 9.25 10.02 9.1C9.93 8.95 9.49 7.88 9.3 7.43C9.11 6.99 8.92 7 8.76 7H8.21C8.04 7 7.77 7.06 7.54 7.31C7.31 7.56 6.66 8.16 6.66 9.4C6.66 10.64 7.54 11.83 7.66 11.99C7.78 12.15 9.28 14.56 11.63 15.57C12.21 15.81 12.65 15.95 12.99 16.05C13.57 16.22 14.1 16.19 14.53 16.12C15.01 16.04 16.02 15.57 16.2 15.06C16.38 14.55 16.38 14.11 16.29 13.98C16.2 13.85 16.09 13.7 16.09 13.7Z"/>
                      </svg>
                    </motion.button>
                    
                    <motion.button
                      whileHover={{ scale: 1.1, rotate: -5 }}
                      whileTap={{ scale: 0.9 }}
                      onClick={() => window.open('https://t.me/share/url?url=https://yourapp.com/ref/USER123&text=Join%20me%20on%20this%20platform', '_blank')}
                      className="p-3 bg-blue-500 text-white rounded-xl hover:bg-blue-600 transition-all shadow-lg"
                      title="Share on Telegram"
                    >
                      <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                        <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm4.64 6.8c-.15 1.58-.8 5.42-1.13 7.19-.14.75-.42 1-.68 1.03-.58.05-1.02-.38-1.58-.75-.88-.58-1.38-.94-2.23-1.5-.99-.65-.35-1.01.22-1.59.15-.15 2.71-2.48 2.76-2.69a.2.2 0 00-.05-.18c-.06-.05-.14-.03-.21-.02-.09.02-1.49.95-4.22 2.79-.4.27-.76.41-1.08.4-.36-.01-1.04-.2-1.55-.37-.63-.2-1.12-.31-1.08-.66.02-.18.27-.36.74-.55 2.92-1.27 4.86-2.11 5.83-2.51 2.78-1.16 3.35-1.36 3.73-1.36.08 0 .27.02.39.12.1.08.13.19.14.27-.01.06.01.24 0 .24z"/>
                      </svg>
                    </motion.button>
                    
                    <motion.button
                      whileHover={{ scale: 1.1 }}
                      whileTap={{ scale: 0.9 }}
                      onClick={() => window.open(`mailto:?subject=${encodeURIComponent('Join me on this platform')}&body=${encodeURIComponent('Hey! Join me on this amazing platform using my referral link: https://yourapp.com/ref/USER123')}`)}
                      className="p-3 bg-gray-600 text-white rounded-xl hover:bg-gray-700 transition-all shadow-lg"
                      title="Share via Email"
                    >
                      <Mail className="w-5 h-5" />
                    </motion.button>
                    
                    <motion.button
                      whileHover={{ scale: 1.1 }}
                      whileTap={{ scale: 0.9 }}
                      onClick={() => {
                        if (navigator.share) {
                          navigator.share({
                            title: 'Join me on this platform',
                            text: 'Hey! Join me on this amazing platform using my referral link',
                            url: 'https://yourapp.com/ref/USER123'
                          })
                        }
                      }}
                      className="p-3 bg-indigo-500 text-white rounded-xl hover:bg-indigo-600 transition-all shadow-lg"
                      title="Share"
                    >
                      <Share2 className="w-5 h-5" />
                    </motion.button>
                  </div>
                </div>
              </div>

              {/* Recent Referrals */}
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <h3 className="text-lg font-semibold flex items-center gap-2">
                    <Users className="w-5 h-5 text-indigo-600" />
                    Recent Referrals
                  </h3>
                  <button className="text-sm text-indigo-600 hover:text-indigo-700 font-medium">
                    View All
                  </button>
                </div>
                
                <div className="space-y-3">
                  {referrals.map((referral, index) => (
                    <motion.div
                      key={referral.id}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: index * 0.1 }}
                      whileHover={{ scale: 1.02, x: 5 }}
                      className="bg-white rounded-2xl p-4 shadow-lg border border-gray-100 hover:shadow-xl transition-all"
                    >
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-4">
                          <img
                            src={referral.avatar}
                            alt={'Referral Avatar'}
                            className="w-14 h-14 rounded-full object-cover ring-2 ring-indigo-100"
                          />
                          <div>
                            <h4 className="font-semibold text-lg">{referral.friendName}</h4>
                            <p className="text-sm text-muted-foreground">{referral.friendEmail}</p>
                            <div className="flex items-center gap-3 mt-2">
                              <span className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-medium ${
                                referral.status === 'earned' ? 'bg-green-100 text-green-700' :
                                referral.status === 'joined' ? 'bg-blue-100 text-blue-700' :
                                'bg-yellow-100 text-yellow-700'
                              }`}>
                                {referral.status === 'earned' && <Award className="w-3 h-3" />}
                                {referral.status === 'joined' && <Users className="w-3 h-3" />}
                                {referral.status === 'pending' && <Clock className="w-3 h-3" />}
                                {statusConfig[referral.status].label}
                              </span>
                              <span className="text-xs text-muted-foreground flex items-center gap-1">
                                <Clock className="w-3 h-3" />
                                {formatDistanceToNow(new Date(referral.date), { addSuffix: true })}
                              </span>
                            </div>
                          </div>
                        </div>
                        
                        {referral.pointsEarned > 0 && (
                          <motion.div
                            initial={{ scale: 0 }}
                            animate={{ scale: 1 }}
                            className="text-right bg-gradient-to-br from-green-400 to-green-600 text-white px-4 py-2 rounded-xl"
                          >
                            <p className="text-xs opacity-90">Points Earned</p>
                            <p className="text-xl font-bold">+{referral.pointsEarned}</p>
                          </motion.div>
                        )}
                      </div>
                    </motion.div>
                  ))}
                </div>
              </div>
            </motion.div>
          )}

          {/* Coupons Tab */}
          {activeTab === 'coupons' && (
            <motion.div
              key="coupons"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              className="space-y-6"
            >
              {/* Filters and Search */}
              <div className="bg-white rounded-2xl p-4 shadow-lg border border-gray-100">
                <div className="flex flex-col sm:flex-row gap-4">
                  <div className="flex-1 relative">
                    <input
                      type="text"
                      placeholder="Search coupons by code or description..."
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      className="w-full px-4 py-2 pl-10 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500"
                    />
                    <SearchIcon className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                  </div>
                  
                  <div className="flex gap-2">
                    <select
                      value={selectedCategory}
                      onChange={(e) => setSelectedCategory(e.target.value)}
                      className="px-4 py-2 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 bg-white"
                    >
                      <option value="all">All Categories</option>
                      <option value="welcome">Welcome</option>
                      <option value="special">Special</option>
                      <option value="referral">Referral</option>
                      <option value="festive">Festive</option>
                      <option value="vip">VIP</option>
                    </select>
                    
                    <select
                      value={sortBy}
                      onChange={(e) => setSortBy(e.target.value as any)}
                      className="px-4 py-2 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 bg-white"
                    >
                      <option value="newest">Newest First</option>
                      <option value="expiry">Expiring Soon</option>
                      <option value="value">Highest Value</option>
                    </select>
                  </div>
                </div>
              </div>

              {/* Coupons Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredCoupons.map((coupon, index) => (
                  <motion.div
                    key={coupon.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.1 }}
                  >
                    {!coupon.isScratched ? (
                      <ScratchCard coupon={coupon} onScratch={handleScratchComplete} />
                    ) : (
                      <div className={`relative bg-white rounded-2xl shadow-xl border-2 ${categoryConfig[coupon.category].borderColor} overflow-hidden group`}>
                        {/* Category Badge */}
                        <div className={`absolute top-4 left-4 z-10 px-3 py-1 rounded-full text-xs font-medium ${categoryConfig[coupon.category].bgColor} ${categoryConfig[coupon.category].textColor} flex items-center gap-1`}>
                          {categoryConfig[coupon.category].icon}
                          {categoryConfig[coupon.category].label}
                        </div>
                        
                        {/* Expiry Badge */}
                        {new Date(coupon.validUntil) < addDays(new Date(), 7) && !coupon.isRedeemed && (
                          <div className="absolute top-4 right-4 z-10 px-3 py-1 bg-red-500 text-white rounded-full text-xs font-medium animate-pulse">
                            Expiring Soon
                          </div>
                        )}
                        
                        {/* Content */}
                        <div className={`p-6 bg-gradient-to-br ${categoryConfig[coupon.category].gradient} text-white`}>
                          <div className="mt-8 mb-4 text-center">
                            <p className="text-4xl font-bold mb-2">{coupon.discount}</p>
                            <p className="text-sm text-white/80">{coupon.description}</p>
                          </div>
                        </div>
                        
                        <div className="p-6 space-y-4">
                          {/* Code */}
                          <div className="bg-gray-50 rounded-xl p-3">
                            <div className="flex items-center justify-between">
                              <code className="font-mono font-bold text-lg">{coupon.code}</code>
                              <motion.button
                                whileHover={{ scale: 1.1 }}
                                whileTap={{ scale: 0.9 }}
                                onClick={(e) => copyCouponCode(coupon.code, e)}
                                className="p-2 hover:bg-gray-200 rounded-lg transition-colors"
                                disabled={coupon.isRedeemed}
                              >
                                {copiedCode === coupon.code ? (
                                  <Check className="w-5 h-5 text-green-600" />
                                ) : (
                                  <Copy className="w-5 h-5 text-gray-600" />
                                )}
                              </motion.button>
                            </div>
                          </div>
                          
                          {/* Details */}
                          <div className="space-y-2 text-sm">
                            {coupon.minPurchase && (
                              <div className="flex items-center justify-between">
                                <span className="text-muted-foreground">Min. Purchase</span>
                                <span className="font-medium">₹{coupon.minPurchase}</span>
                              </div>
                            )}
                            {coupon.maxDiscount && (
                              <div className="flex items-center justify-between">
                                <span className="text-muted-foreground">Max Discount</span>
                                <span className="font-medium">₹{coupon.maxDiscount}</span>
                              </div>
                            )}
                            <div className="flex items-center justify-between">
                              <span className="text-muted-foreground">Valid Until</span>
                              <span className="font-medium flex items-center gap-1">
                                <Calendar className="w-4 h-4" />
                                {format(new Date(coupon.validUntil), 'MMM dd, yyyy')}
                              </span>
                            </div>
                            {coupon.usageLimit && (
                              <div className="flex items-center justify-between">
                                <span className="text-muted-foreground">Usage Left</span>
                                <span className="font-medium">
                                  {coupon.usageLimit - (coupon.usedCount || 0)} / {coupon.usageLimit}
                                </span>
                              </div>
                            )}
                          </div>
                          
                          {/* Action Button */}
                          {coupon.isRedeemed ? (
                            <div className="px-4 py-2 bg-red-100 text-red-600 rounded-xl text-center font-medium">
                              Already Redeemed
                            </div>
                          ) : (
                            <motion.button
                              whileHover={{ scale: 1.02 }}
                              whileTap={{ scale: 0.98 }}
                              onClick={() => setShowCouponModal(coupon)}
                              className="w-full px-4 py-2 bg-gradient-to-r from-indigo-600 to-purple-600 text-white rounded-xl font-medium hover:shadow-lg transition-all"
                            >
                              View Details & Redeem
                            </motion.button>
                          )}
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

      {/* Referral Modal */}
      <AnimatePresence>
        {showReferModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm"
            onClick={() => setShowReferModal(false)}
          >
            <motion.div
              initial={{ scale: 0.9, y: 20 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.9, y: 20 }}
              onClick={(e) => e.stopPropagation()}
              className="bg-white rounded-2xl max-w-md w-full p-6 shadow-2xl"
            >
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-2xl font-bold flex items-center gap-2">
                  <UserPlus className="w-6 h-6 text-indigo-600" />
                  Refer a Friend
                </h2>
                <button
                  onClick={() => setShowReferModal(false)}
                  className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
              
              <form onSubmit={sendReferral} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium mb-2">
                    Friend's Email <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="email"
                    required
                    value={referEmail}
                    onChange={(e) => setReferEmail(e.target.value)}
                    placeholder="friend@example.com"
                    className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium mb-2">
                    Personal Message
                  </label>
                  <textarea
                    value={referMessage}
                    onChange={(e) => setReferMessage(e.target.value)}
                    placeholder="Hey! I thought you might like this platform. Join using my link and we both get 50 points!"
                    rows={4}
                    className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  />
                </div>
                
                <div className="bg-gradient-to-r from-indigo-50 to-purple-50 p-4 rounded-xl">
                  <p className="text-sm text-indigo-700 flex items-center gap-2">
                    <Info className="w-4 h-4" />
                    Your friend will also get 50 points when they join!
                  </p>
                </div>
                
                <motion.button
                  type="submit"
                  disabled={isSubmitting}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  className="w-full py-3 bg-gradient-to-r from-indigo-600 to-purple-600 text-white rounded-xl font-medium hover:shadow-lg transition-all disabled:opacity-50"
                >
                  {isSubmitting ? (
                    <Loader2 className="w-5 h-5 animate-spin mx-auto" />
                  ) : (
                    'Send Invitation'
                  )}
                </motion.button>
              </form>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Coupon Details Modal */}
      <AnimatePresence>
        {showCouponModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm"
            onClick={() => setShowCouponModal(null)}
          >
            <motion.div
              initial={{ scale: 0.9, y: 20 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.9, y: 20 }}
              onClick={(e) => e.stopPropagation()}
              className="bg-white rounded-2xl max-w-lg w-full p-6 shadow-2xl"
            >
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-2xl font-bold flex items-center gap-2">
                  <Ticket className="w-6 h-6 text-indigo-600" />
                  Coupon Details
                </h2>
                <button
                  onClick={() => setShowCouponModal(null)}
                  className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
              
              <div className={`p-6 rounded-xl bg-gradient-to-br ${categoryConfig[showCouponModal.category].gradient} text-white mb-6`}>
                <div className="text-center">
                  <p className="text-5xl font-bold mb-3">{showCouponModal.discount}</p>
                  <p className="text-white/90">{showCouponModal.description}</p>
                </div>
              </div>
              
              <div className="space-y-4">
                <div className="bg-gray-50 rounded-xl p-4">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm text-muted-foreground">Coupon Code</span>
                    <div className="flex items-center gap-2">
                      <code className="font-mono font-bold text-lg">{showCouponModal.code}</code>
                      <button
                        onClick={(e) => copyCouponCode(showCouponModal.code, e)}
                        className="p-1 hover:bg-gray-200 rounded"
                      >
                        {copiedCode === showCouponModal.code ? (
                          <Check className="w-4 h-4 text-green-600" />
                        ) : (
                          <Copy className="w-4 h-4" />
                        )}
                      </button>
                    </div>
                  </div>
                </div>
                
                <div className="grid grid-cols-2 gap-4">
                  {showCouponModal.minPurchase && (
                    <div className="bg-gray-50 rounded-xl p-3">
                      <p className="text-xs text-muted-foreground mb-1">Min. Purchase</p>
                      <p className="font-bold">₹{showCouponModal.minPurchase}</p>
                    </div>
                  )}
                  {showCouponModal.maxDiscount && (
                    <div className="bg-gray-50 rounded-xl p-3">
                      <p className="text-xs text-muted-foreground mb-1">Max Discount</p>
                      <p className="font-bold">₹{showCouponModal.maxDiscount}</p>
                    </div>
                  )}
                  <div className="bg-gray-50 rounded-xl p-3">
                    <p className="text-xs text-muted-foreground mb-1">Valid From</p>
                    <p className="font-bold text-sm">
                      {format(new Date(showCouponModal.validFrom), 'dd MMM yyyy')}
                    </p>
                  </div>
                  <div className="bg-gray-50 rounded-xl p-3">
                    <p className="text-xs text-muted-foreground mb-1">Valid Until</p>
                    <p className="font-bold text-sm">
                      {format(new Date(showCouponModal.validUntil), 'dd MMM yyyy')}
                    </p>
                  </div>
                </div>
                
                <div className="bg-gray-50 rounded-xl p-4">
                  <p className="text-sm font-medium mb-2">Terms & Conditions</p>
                  <ul className="space-y-1">
                    {showCouponModal.termsAndConditions.map((term, index) => (
                      <li key={index} className="text-xs text-muted-foreground flex items-start gap-2">
                        <span className="text-indigo-500">•</span>
                        {term}
                      </li>
                    ))}
                  </ul>
                </div>
                
                {!showCouponModal.isRedeemed && (
                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={() => redeemCoupon(showCouponModal.id)}
                    className="w-full py-3 bg-gradient-to-r from-indigo-600 to-purple-600 text-white rounded-xl font-medium hover:shadow-lg transition-all"
                  >
                    Redeem Coupon
                  </motion.button>
                )}
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </main>
  )
}

// Status Config
const statusConfig = {
  pending: {
    label: 'Pending',
    color: 'bg-yellow-100 text-yellow-700',
    icon: <Clock className="w-4 h-4" />
  },
  joined: {
    label: 'Joined',
    color: 'bg-blue-100 text-blue-700',
    icon: <Users className="w-4 h-4" />
  },
  earned: {
    label: 'Earned',
    color: 'bg-green-100 text-green-700',
    icon: <Award className="w-4 h-4" />
  }
}