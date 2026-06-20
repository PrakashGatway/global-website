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
    MessageCirclePlus, PlusCircle,
    Trash2
} from "lucide-react"
import { addDays, format, formatDistanceToNow } from "date-fns"
import { useGlobal } from "@/src/statecontext"
import axiosInstance from "@/app/axiosInstance"
import toast from "react-hot-toast"
import Image from "next/image"

// --- Types ---
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

interface ReferralUser {
    _id: string
    name: string
    email: string
    profileImage?: string
}

// --- ScratchCard Component (unchanged) ---
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

// --- New Coupon Creation Modal Component ---
interface CreateCouponModalProps {
    isOpen: boolean
    onClose: () => void
    onSuccess: () => void
}

const CreateCouponModal: React.FC<CreateCouponModalProps> = ({ isOpen, onClose, onSuccess }) => {
    const { profile } = useGlobal()

    // User search states
    const [searchQuery, setSearchQuery] = useState('')
    const [debouncedQuery, setDebouncedQuery] = useState('')
    const [referralList, setReferralList] = useState<ReferralUser[]>([])
    const [loadingUsers, setLoadingUsers] = useState(false)
    const [showDropdown, setShowDropdown] = useState(false)
    const [formData, setFormData] = useState({
        assingBy: profile?._id,
        code: '',
        title: '',
        description: '',
        discountType: 'percentage',
        minPurchase: 0,
        applicableTo: 'Courses Only',
        validFrom: '',
        validTo: '',
        usageLimit: '',
        discountValue: '',
        maxDiscount: '',
        status: 'Active',
        userSpecificCoupon: false,
        assignedUserId: ''
    })
    const [isSubmitting, setIsSubmitting] = useState(false)


    // Debounce logic
    useEffect(() => {
        const handler = setTimeout(() => {
            setDebouncedQuery(searchQuery)
        }, 300)
        return () => clearTimeout(handler)
    }, [searchQuery])

    // Fetch users for assignment
    const fetchReferrals = useCallback(async (code: string, id: string) => {
        if (!code) { setReferralList([]); return }
        setLoadingUsers(true)
        try {
            const response = await axiosInstance.get(`/users/code/${code}/${id}`)
            const data: ReferralUser[] = response.data.data ?? []
            setReferralList(Array.isArray(data) ? data : [data])
        } catch (err) {
            console.error("Error fetching referrals:", err)
            setReferralList([])
        } finally {
            setLoadingUsers(false)
        }
    }, [])

    useEffect(() => {
        if (formData.userSpecificCoupon) {
            fetchReferrals(debouncedQuery || profile?.referalCode || "", profile?._id || "")
        } else {
            setReferralList([])
        }
    }, [debouncedQuery, formData.userSpecificCoupon, profile?.referalCode, profile?._id, fetchReferrals])

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
        const { name, value, type } = e.target
        const checked = (e.target as HTMLInputElement).checked

        setFormData(prev => ({
            ...prev,
            [name]: type === 'checkbox' ? checked : value
        }))
    }

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        setIsSubmitting(true)

        try {
            const payload = {
                type: 'coupon', // Required by schema
                code: formData.code,
                title: formData.title,
                description: formData.description,
                validFrom: new Date(formData.validFrom).toISOString(),
                validTo: new Date(formData.validTo).toISOString(),
                usageLimit: formData.usageLimit ? Number(formData.usageLimit) : null,
                status: formData.status,
                assingBy: formData.assingBy || profile?._id || 'admin',

                // Nest coupon-specific fields inside couponData
                couponData: {
                    discountType: formData.discountType,
                    discountValue: Number(formData.discountValue),
                    minPurchaseAmount: Number(formData.minPurchase) || 0,
                    maxDiscountAmount: formData.maxDiscount ? Number(formData.maxDiscount) : null,
                    applicableTo: formData.applicableTo === 'Courses Only' ? 'courses'
                        : formData.applicableTo === 'Programs Only' ? 'programs'
                            : 'all',
                    isUserSpecific: formData.userSpecificCoupon,
                    users: formData.userSpecificCoupon && formData.assignedUserId
                        ? [formData.assignedUserId]
                        : [],
                }
            }

            console.log(payload)

            const response = await axiosInstance.post('/coupons', payload)
            if (response.data?.success) {
                toast.success('Coupon created successfully!')
                onSuccess()
                onClose()
            } else {
                toast.error(response.data?.message || 'Failed to create coupon')
            }
        } catch (error: any) {
            toast.error(error.response?.data?.message || 'Something went wrong')
        } finally {
            setIsSubmitting(false)
        }
    }

    if (!isOpen) return null

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
            <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
                className="bg-white rounded-2xl shadow-xl w-full max-w-2xl max-h-[90vh] overflow-y-auto"
            >
                <div className="sticky top-0 bg-white border-b border-slate-200 p-4 flex justify-between items-center">
                    <h2 className="text-xl font-bold text-slate-900">Create New Coupon</h2>
                    <button
                        onClick={onClose}
                        className="p-2 hover:bg-slate-100 rounded-full transition"
                    >
                        <X className="w-5 h-5 text-slate-500" />
                    </button>
                </div>

                <form onSubmit={handleSubmit} className="p-6 space-y-5">
                    {/* Code */}
                    <div>
                        <label className="block text-sm font-medium text-slate-700 mb-1">
                            Code * <span className="text-xs text-slate-400">e.g., SAVE20</span>
                        </label>
                        <input
                            type="text"
                            name="code"
                            required
                            value={formData.code}
                            onChange={handleChange}
                            className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
                            placeholder="SAVE20"
                        />
                    </div>

                    {/* Title */}
                    <div>
                        <label className="block text-sm font-medium text-slate-700 mb-1">
                            Title * <span className="text-xs text-slate-400">e.g., Summer Sale</span>
                        </label>
                        <input
                            type="text"
                            name="title"
                            required
                            value={formData.title}
                            onChange={handleChange}
                            className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-purple-500"
                            placeholder="Summer Sale"
                        />
                    </div>

                    {/* Description */}
                    <div>
                        <label className="block text-sm font-medium text-slate-700 mb-1">Description</label>
                        <textarea
                            name="description"
                            rows={2}
                            value={formData.description}
                            onChange={handleChange}
                            className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-purple-500"
                            placeholder="Enter description"
                        />
                    </div>

                    {/* Discount Type & Value Row */}
                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <label className="block text-sm font-medium text-slate-700 mb-1">Discount Type *</label>
                            <select
                                name="discountType"
                                value={formData.discountType}
                                onChange={handleChange}
                                className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-purple-500"
                            >
                                <option value="percentage">Percentage (%)</option>
                                <option value="fixed">Fixed Amount</option>
                            </select>
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-slate-700 mb-1">Discount Value *</label>
                            <input
                                type="number"
                                name="discountValue"
                                required
                                value={formData.discountValue}
                                onChange={handleChange}
                                className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-purple-500"
                                placeholder="e.g., 20"
                            />
                        </div>
                    </div>

                    {/* Min Purchase & Max Discount Row */}
                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <label className="block text-sm font-medium text-slate-700 mb-1">Minimum Purchase (₱)</label>
                            <input
                                type="number"
                                name="minPurchase"
                                value={formData.minPurchase}
                                onChange={handleChange}
                                className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-purple-500"
                                placeholder="0"
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-slate-700 mb-1">Max Discount (₱)</label>
                            <input
                                type="number"
                                name="maxDiscount"
                                value={formData.maxDiscount}
                                onChange={handleChange}
                                className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-purple-500"
                                placeholder="No limit"
                            />
                        </div>
                    </div>

                    {/* Applicable To */}
                    <div>
                        <label className="block text-sm font-medium text-slate-700 mb-1">Applicable To</label>
                        <select
                            name="applicableTo"
                            value={formData.applicableTo}
                            onChange={handleChange}
                            className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-purple-500"
                        >
                            <option value="Courses Only">Courses Only</option>
                            <option value="All Products">All Products</option>
                            <option value="Specific Category">Specific Category</option>
                        </select>
                    </div>

                    {/* Valid From & Valid To Row */}
                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <label className="block text-sm font-medium text-slate-700 mb-1">Valid From *</label>
                            <input
                                type="date"
                                name="validFrom"
                                required
                                value={formData.validFrom}
                                onChange={handleChange}
                                className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-purple-500"
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-slate-700 mb-1">Valid To *</label>
                            <input
                                type="date"
                                name="validTo"
                                required
                                value={formData.validTo}
                                onChange={handleChange}
                                className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-purple-500"
                            />
                        </div>
                    </div>

                    {/* Usage Limit & Status Row */}
                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <label className="block text-sm font-medium text-slate-700 mb-1">
                                Usage Limit <span className="text-xs text-slate-400">(Leave empty for unlimited)</span>
                            </label>
                            <input
                                type="number"
                                name="usageLimit"
                                value={formData.usageLimit}
                                onChange={handleChange}
                                className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-purple-500"
                                placeholder="Unlimited"
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-slate-700 mb-1">Status</label>
                            <select
                                name="status"
                                value={formData.status}
                                onChange={handleChange}
                                className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-purple-500"
                            >
                                <option value="Active">Active</option>
                                <option value="Inactive">Inactive</option>
                            </select>
                        </div>
                    </div>

                    {/* User Specific Coupon Checkbox */}
                    <div className="flex items-center gap-3">
                        <input
                            type="checkbox"
                            name="userSpecificCoupon"
                            id="userSpecificCoupon"
                            checked={formData.userSpecificCoupon}
                            onChange={handleChange}
                            className="w-4 h-4 text-purple-600 rounded focus:ring-purple-500"
                        />
                        <label htmlFor="userSpecificCoupon" className="text-sm font-medium text-slate-700">
                            User Specific Coupon
                        </label>
                    </div>

                    {/* User Search Dropdown (conditional) */}
                    {formData.userSpecificCoupon && (
                        <div className="relative">
                            <label className="block text-sm font-medium text-slate-700 mb-1">
                                Assign to User
                            </label>
                            <div className="relative">
                                <input
                                    type="text"
                                    value={searchQuery}
                                    onChange={(e) => {
                                        setSearchQuery(e.target.value)
                                        setShowDropdown(true)
                                    }}
                                    onFocus={() => setShowDropdown(true)}
                                    placeholder="Search by name or email..."
                                    className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-purple-500"
                                />
                                {loadingUsers && (
                                    <div className="absolute right-3 top-1/2 -translate-y-1/2">
                                        <Loader2 className="w-4 h-4 animate-spin text-slate-400" />
                                    </div>
                                )}
                            </div>

                            {showDropdown && (referralList.length > 0 || searchQuery) && (
                                <div className="absolute z-20 w-full mt-1 bg-white border border-slate-200 rounded-lg shadow-lg max-h-60 overflow-y-auto">
                                    {referralList.length === 0 ? (
                                        <div className="px-4 py-3 text-sm text-slate-500">No users found</div>
                                    ) : (
                                        referralList.map((user) => (
                                            <button
                                                key={user._id}
                                                type="button"
                                                onClick={() => {
                                                    setFormData(prev => ({ ...prev, assignedUserId: user._id }))
                                                    setSearchQuery(`${user.name} (${user.email})`)
                                                    setShowDropdown(false)
                                                }}
                                                className="w-full text-left px-4 py-2 hover:bg-slate-50 transition flex items-center gap-3"
                                            >
                                                <div className="w-8 h-8 rounded-full bg-gradient-to-br from-purple-500 to-indigo-600 flex items-center justify-center text-white text-xs font-bold">
                                                    {user.name?.charAt(0) || 'U'}
                                                </div>
                                                <div>
                                                    <p className="text-sm font-medium text-slate-900">{user.name}</p>
                                                    <p className="text-xs text-slate-500">{user.email}</p>
                                                </div>
                                            </button>
                                        ))
                                    )}
                                </div>
                            )}
                            {formData.assignedUserId && (
                                <p className="text-xs text-green-600 mt-1">✓ User selected</p>
                            )}
                        </div>
                    )}

                    {/* Form Actions */}
                    <div className="flex justify-end gap-3 pt-4 border-t border-slate-200">
                        <button
                            type="button"
                            onClick={onClose}
                            className="px-4 py-2 text-sm font-medium text-slate-700 hover:bg-slate-100 rounded-lg transition"
                        >
                            Cancel
                        </button>
                        <button
                            type="submit"
                            // disabled={isSubmitting}
                            className="px-4 py-2 text-sm font-medium text-white bg-purple-600 hover:bg-purple-700 rounded-lg transition disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
                        >
                            {isSubmitting ? (
                                <>
                                    <Loader2 className="w-4 h-4 animate-spin" />
                                    Creating...
                                </>
                            ) : (
                                'Create Coupon'
                            )}
                        </button>
                    </div>
                </form>
            </motion.div>
        </div>
    )
}

// --- Main OffersPage Component ---
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
    const [showCreateModal, setShowCreateModal] = useState(false)

    useEffect(() => {
        if (profile?.referalCode) {
            const address = `https://www.ooshasglobal.com?code=${profile?.referalCode}`
            setLink(address)
        }
    }, [profile])

    // Actions
    const copyReferralLink = () => {
        navigator.clipboard.writeText(link)
        setCopiedCode('referral')
        setTimeout(() => setCopiedCode(null), 2000)
    }


    const deleteCoupon = async (code: string, e: React.MouseEvent) => {
        try {
            const res = await axiosInstance.delete(`/coupons/${code}`)
            if (res.data.success) {
                toast.success(res.data.message)
                myReferrals()
            }
        } catch (error) {
            toast.error('Error deleting coupon')
        }
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
    console.log(profile)

    const myReferrals = async () => {
        try {
            if (!profile?._id) return;
            const [response, coupouns, rewardsRes] = await Promise.all([
                await axiosInstance.get('/auth/my-referrals'),
                await axiosInstance.get(`/coupons/assign/${profile?._id}`),
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
    }, [profile?.id, profile])

    return (
        <main className="flex-1 overflow-y-auto min-h-[70vh]">
            <div className="max-w-7xl mx-auto px-4 sm:p-4 space-y-6">

                {/* Header */}
                <motion.div
                    initial={{ opacity: 0, y: -20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="flex flex-col sm:flex-row sm:items-center justify-between gap-4"
                >
                    <div>
                        <h1 className="text-xl font-bold text-slate-900">Offers & Rewards</h1>
                        <p className="text-slate-500 text-sm">Earn points, unlock coupons, and enjoy exclusive benefits</p>
                    </div>
                    <div className="flex items-center gap-3">
                        <div className="flex font-semibold items-center gap-2 border-2 border-slate-500 rounded-full px-4 py-1 shadow-xl ">
                            <p className="">Wallet: {profile?.wallet}</p>
                            <Image src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQd6RT3_38mLmgDzUAuy2ZcS0ERldqSXpTdQw&s" alt="wallet" width={30} height={30} loading="lazy"/>
                        </div>
                        {/* Create Coupon Button - Admin only? You can add role check */}
                        <button
                            onClick={() => setShowCreateModal(true)}
                            className="flex items-center gap-2 px-4 py-2 bg-purple-600 hover:bg-purple-700 text-white rounded-full text-sm font-medium transition shadow-md"
                        >
                            <PlusCircle className="w-4 h-4" />
                            Create Coupon
                        </button>
                    </div>
                </motion.div>

                {/* Tabs */}
                <div className="flex gap-2 border-b border-slate-200 bg-white sticky top-0 z-10 px-4 sm:px-0 pt-4 sm:pt-0">
                    {['refer', 'coupons'].map((tab) => (
                        <motion.button
                            key={tab}
                            onClick={() => setActiveTab(tab as 'refer' | 'coupons' | 'rewards')}
                            className={`pb-3 px-3 font-semibold text-sm flex items-center gap-2 transition-all relative ${activeTab === tab ? 'text-slate-900' : 'text-slate-500 hover:text-slate-700'
                                }`}
                        >
                            {tab === 'refer' ? <UserPlus className="w-5 h-5" /> : <Ticket className="w-5 h-5" />}
                            {tab === 'refer' ? 'Refer & Earn' : 'Coupons'}

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
                                            value={link}
                                            className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-slate-700 font-medium text-sm focus:outline-none focus:ring-2 focus:ring-purple-500"
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
                                            { id: 'whatsapp', icon: MessageCirclePlus, color: 'bg-green-500 hover:bg-green-600' },
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
                                    {referrals?.data?.length === 0 && (
                                        <div className="flex items-center gap-2 px-4 py-2 rounded-lg bg-white/10 backdrop-blur border border-white/10">
                                            <Users className="w-4 h-4 text-amber-400" />
                                            <span className="text-sm font-medium">No referrals yet</span>
                                        </div>
                                    )}
                                    {referrals?.data?.map((referral, index) => (
                                        <motion.div
                                            key={index}
                                            initial={{ opacity: 0, y: 20 }}
                                            animate={{ opacity: 1, y: 0 }}
                                            transition={{ delay: index * 0.05 }}
                                            className="rounded-lg hover:shadow-lg p-4 bg-gray-50 border border-slate-200 flex items-center justify-between"
                                        >
                                            <div className="flex items-center gap-4">
                                                <div className="w-12 h-12 rounded-full shadow-lg bg-gradient-to-br from-purple-500 to-indigo-600 flex items-center justify-center text-white font-bold shadow-md">
                                                    <Image loading="lazy" src={referral?.profileImage || "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRI9lRck6miglY0SZF_BZ_sK829yiNskgYRUg&s"} alt="Profile" width={32} height={32} className="w-full h-full object-cover rounded-full" />
                                                </div>
                                                <div>
                                                    <h4 className="font-semibold text-slate-900 capitalize">{referral?.name || "Unknown"}</h4>
                                                    <p className="text-sm text-slate-500 mask">{referral?.email || "__"}</p>
                                                    <div className="flex items-center gap-2 mt-1">

                                                        <span className="text-xs text-slate-400">
                                                            {formatDistanceToNow(new Date(referral?.createdAt), { addSuffix: true })}
                                                        </span>
                                                    </div>
                                                </div>
                                            </div>
                                            <div className="text-right">
                                                <p className="text-xs text-slate-500">Points Earned</p>
                                                <p className="text-lg font-bold text-green-600"> + 50</p>
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
                            className="space-y-6 max-w-6xl mx-auto"
                        >
                            {
                                coupons?.data?.length === 0 && (
                                    <div className="flex flex-col items-center justify-center h-100 w-full">
                                        <Image loading="lazy" src="https://assets-v2.lottiefiles.com/a/0953d504-117d-11ee-aa49-1f149204cb5f/9uZcoEJaoF.gif" alt="No rewards" width={250} height={250} className="mx-auto max-w-full max-h-full" />
                                        <p className="font-medium text-lg">No coupons found</p>
                                    </div>
                                )
                            }
                            <div className="flex flex-col gap-4">
                                {coupons?.data?.map((coupon, index) => (
                                    <motion.div
                                        key={coupon._id}
                                        initial={{ opacity: 0, y: 20 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        transition={{ delay: index * 0.05 }}
                                    >
                                        <div
                                            onClick={() => setSelectedCoupon(coupon)}
                                            className={`relative group cursor-pointer rounded-2xl overflow-hidden bg-white border border-slate-200 hover:border-purple-300 hover:shadow-md transition-all duration-300 flex flex-col md:flex-row`}
                                        >
                                            {/* Left Banner */}
                                            <div className={`p-6 md:w-64 bg-gradient-to-br from-[#F26D44] to-indigo-600 text-white flex flex-col items-center justify-center`}>
                                                <p className="text-3xl font-extrabold tracking-tight drop-shadow-md">
                                                    {coupon?.couponData?.discountValue} {coupon?.couponData?.discountType == 'percentage' ? '%' : 'OFF'}
                                                </p>
                                                <p className="text-sm text-white/90 mt-1 line-clamp-1 text-center">
                                                    {coupon.description}
                                                </p>
                                            </div>

                                            {/* Right Content */}
                                            <div className="p-5 flex-1 flex flex-col md:flex-row items-center justify-between gap-4">
                                                <div className="space-y-1 text-center md:text-left">
                                                    <div className="flex flex-col md:flex-row md:items-center gap-2 md:gap-4">
                                                        <code className="text-xl font-bold px-3 py-1 bg-slate-100 rounded-lg text-slate-800 border border-dashed border-slate-300">
                                                            {coupon.code}
                                                        </code>
                                                        <span className="text-sm font-medium text-slate-500">
                                                            Min. Purchase: ₹{coupon?.couponData?.minPurchaseAmount}
                                                        </span>
                                                    </div>
                                                </div>

                                                <div className="flex items-center gap-3">
                                                    <div className="flex items-center gap-1.5 px-3 py-1.5 bg-slate-50 rounded-full border border-slate-100 text-sm text-slate-600">
                                                        <Calendar className="w-4 h-4" />
                                                        {format(new Date(coupon.validTo), 'dd MMM yyyy')}
                                                    </div>

                                                    <button
                                                        onClick={(e) => deleteCoupon(coupon._id, e)}
                                                        className="p-2.5 rounded-full bg-slate-50 border border-slate-200 hover:bg-white hover:shadow hover:scale-105 transition-all"
                                                    >
                                                        <Trash2 className="w-5 h-5 text-red-600" />
                                                    </button>
                                                </div>
                                            </div>

                                            {/* Expiring Soon Badge */}
                                            {new Date(coupon.validTo) < addDays(new Date(), 7) && (
                                                <div className="absolute top-0 right-0 bg-red-500 text-white text-xs px-4 py-1 rounded-bl-xl shadow-sm animate-pulse font-medium">
                                                    Expiring Soon
                                                </div>
                                            )}
                                        </div>
                                    </motion.div>
                                ))}
                            </div>
                        </motion.div>
                    )}

                </AnimatePresence>
            </div>

            {/* Create Coupon Modal */}
            <CreateCouponModal
                isOpen={showCreateModal}
                onClose={() => setShowCreateModal(false)}
                onSuccess={myReferrals}
            />
        </main>
    )
}