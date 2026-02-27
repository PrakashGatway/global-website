"use client"

import { useState, useEffect } from "react"
import { motion, AnimatePresence } from "framer-motion"
import {
  CreditCard, Wallet, Gift, Tag, Shield, CheckCircle,
  AlertCircle, Lock, ArrowLeft, Sparkles, Coins, Zap,
  BadgePercent, Ticket, Award, Star, Truck, ShieldCheck,
  Clock, ChevronRight, X, Info, Plus, Minus, Heart,
  Share2, Bookmark, Copy, Check,
  CreditCardIcon
} from "lucide-react"
import Image from "next/image"
import Link from "next/link"
import { useRouter } from "next/navigation"
import toast from "react-hot-toast"
import axiosInstance from "@/app/axiosInstance"

// Types
interface CheckoutItem {
  id: string
  type: 'application_fee' | 'program_fee'
  name: string
  description?: string
  amount: number
  currency: string
  university?: {
    name: string
    logo?: string
  }
  applicationNumber?: string
  programName?: string
  intake?: string
}

interface WalletInfo {
  balance: number
  currency: string
  points: number
  pointsValue: number
}

interface PromoCode {
  code: string
  discountType: 'percentage' | 'fixed'
  discountValue: number
  maxDiscount?: number
  minPurchase?: number
  valid: boolean
  message?: string
}

interface PaymentMethod {
  id: string
  name: string
  icon: React.ReactNode
  description: string
}

const paymentMethods: PaymentMethod[] = [
  {
    id: 'card',
    name: 'Credit / Debit Card',
    icon: <CreditCard className="w-6 h-6" />,
    description: 'Pay securely with your card'
  },
  {
    id: 'wallet',
    name: 'Wallet Balance',
    icon: <Wallet className="w-6 h-6" />,
    description: 'Use your available wallet balance'
  }
]

// Confetti effect component
const Confetti = ({ active }: { active: boolean }) => {
  if (!active) return null

  return (
    <div className="fixed inset-0 pointer-events-none z-50">
      {[...Array(100)].map((_, i) => (
        <motion.div
          key={i}
          initial={{
            top: -20,
            left: Math.random() * 100 + "%",
            scale: Math.random() * 0.5 + 0.5
          }}
          animate={{
            top: "100%",
            rotate: Math.random() * 360
          }}
          transition={{
            duration: Math.random() * 2 + 1,
            ease: "linear",
            repeat: Infinity,
            delay: Math.random() * 2
          }}
          className="absolute w-2 h-2 rounded-full"
          style={{
            background: `hsl(${Math.random() * 360}, 70%, 50%)`,
            boxShadow: "0 0 5px currentColor"
          }}
        />
      ))}
    </div>
  )
}

// Price breakdown component
const PriceBreakdown = ({
  subtotal,
  discount,
  walletUsed,
  walletDiscount,
  total,
  currency,
  onClose
}: {
  subtotal: number
  discount: number
  walletUsed: number
  walletDiscount: number
  total: number
  currency: string
  onClose: () => void
}) => {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.95 }}
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm"
      onClick={onClose}
    >
      <motion.div
        className="bg-white rounded-2xl max-w-md w-full p-6 shadow-2xl"
        onClick={e => e.stopPropagation()}
      >
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-xl font-bold text-gray-900">Price Breakdown</h3>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 rounded-full transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="space-y-3">
          <div className="flex justify-between text-gray-600">
            <span>Subtotal</span>
            <span>{currency} {subtotal.toLocaleString()}</span>
          </div>

          {discount > 0 && (
            <div className="flex justify-between text-green-600">
              <span>Promo Discount</span>
              <span>-{currency} {discount.toLocaleString()}</span>
            </div>
          )}

          {walletUsed > 0 && (
            <>
              <div className="flex justify-between text-blue-600">
                <span>Wallet Points Used</span>
                <span>-{currency} {walletUsed.toLocaleString()}</span>
              </div>
              {walletDiscount > 0 && (
                <div className="flex justify-between text-purple-600">
                  <span>Wallet Bonus Discount</span>
                  <span>-{currency} {walletDiscount.toLocaleString()}</span>
                </div>
              )}
            </>
          )}

          <div className="border-t border-gray-200 my-3 pt-3">
            <div className="flex justify-between font-bold text-lg">
              <span>Total</span>
              <span className="text-[#F26D44]">{currency} {total.toLocaleString()}</span>
            </div>
          </div>
        </div>

        <button
          onClick={onClose}
          className="w-full mt-4 py-3 bg-gray-100 hover:bg-gray-200 rounded-xl font-medium transition-colors"
        >
          Close
        </button>
      </motion.div>
    </motion.div>
  )
}

// Main Checkout Component
export default function CheckoutPage() {
  const router = useRouter()
  const [loading, setLoading] = useState(true)
  const [processing, setProcessing] = useState(false)
  const [checkoutItem, setCheckoutItem] = useState<CheckoutItem | null>(null)
  const [showConfetti, setShowConfetti] = useState(false)
  const [showBreakdown, setShowBreakdown] = useState(false)

  const [promoCode, setPromoCode] = useState('')
  const [appliedPromo, setAppliedPromo] = useState<PromoCode | null>(null)
  const [promoLoading, setPromoLoading] = useState(false)
  const [promoError, setPromoError] = useState('')

  // Wallet states
  const [wallet, setWallet] = useState<WalletInfo>({
    balance: 2500,
    currency: 'USD',
    points: 5000,
    pointsValue: 50
  })
  const [useWallet, setUseWallet] = useState(false)
  const [walletAmount, setWalletAmount] = useState(0)

  // Calculated values
  const [subtotal, setSubtotal] = useState(0)
  const [discount, setDiscount] = useState(0)
  const [walletUsed, setWalletUsed] = useState(0)
  const [walletDiscount, setWalletDiscount] = useState(0)
  const [total, setTotal] = useState(0)

  // Card payment states
  const [cardDetails, setCardDetails] = useState({
    number: '',
    name: '',
    expiry: '',
    cvv: ''
  })

  // Fetch checkout item details
  useEffect(() => {
    const fetchCheckoutDetails = async () => {
      try {
        // Get application ID from URL or context
        const params = new URLSearchParams(window.location.search)
        const applicationId = params.get('application')

        if (!applicationId) {
          toast.error('No application specified')
          //   router.push('/dashboard/applications')
          return
        }

        // Fetch application details
        const response = await axiosInstance.get(`/applications/${applicationId}`)
        const application = response.data?.data

        // Create checkout item based on type
        const item: CheckoutItem = {
          id: application._id,
          type: 'application_fee', // or 'program_fee' based on your logic
          name: application.course.name,
          description: `For ${application.course.name} at ${application.course.university.name}`,
          amount: application.course.applicationFee || 100,
          currency: application.course.currency || 'USD',
          university: {
            name: application.course.university.name,
            logo: application.course.university.uni_logo
          },
          applicationNumber: application.applicationNumber,
          programName: application.course.name,
          intake: application.intake
        }

        setCheckoutItem(item)
        setSubtotal(item.amount)
        setTotal(item.amount)

        // Fetch wallet details
        // const walletResponse = await axiosInstance.get('/wallet')
        // setWallet(walletResponse.data)

      } catch (error) {
        console.log(error)
        toast.error('Failed to load checkout details')
        // router.push('/dashboard/applications')
      } finally {
        setLoading(false)
      }
    }

    fetchCheckoutDetails()
  }, [router])

  // Recalculate total when dependencies change
  useEffect(() => {
    let newTotal = subtotal - discount

    if (useWallet) {
      const maxWalletUse = Math.min(wallet.balance, newTotal)
      setWalletAmount(maxWalletUse)
      setWalletUsed(maxWalletUse)
      newTotal -= maxWalletUse

      // Additional discount for using wallet
      if (wallet.points >= 1000) {
        const bonus = maxWalletUse * 0.05 // 5% bonus
        setWalletDiscount(bonus)
        newTotal -= bonus
      } else {
        setWalletDiscount(0)
      }
    } else {
      setWalletUsed(0)
      setWalletDiscount(0)
    }

    setTotal(Math.max(0, newTotal))
  }, [subtotal, discount, useWallet, wallet.balance, wallet.points])

  // Apply promo code
  const applyPromoCode = async () => {
    if (!promoCode.trim()) {
      setPromoError('Please enter a promo code')
      return
    }

    setPromoLoading(true)
    setPromoError('')

    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1500))

      // Mock promo code validation
      if (promoCode.toUpperCase() === 'SAVE20') {
        const discountAmount = subtotal * 0.2 // 20% off
        setAppliedPromo({
          code: promoCode,
          discountType: 'percentage',
          discountValue: 20,
          maxDiscount: 500,
          valid: true,
          message: '20% discount applied!'
        })
        setDiscount(Math.min(discountAmount, 500))
        toast.success('Promo code applied successfully!')
      } else if (promoCode.toUpperCase() === 'WELCOME50') {
        setAppliedPromo({
          code: promoCode,
          discountType: 'fixed',
          discountValue: 50,
          valid: true,
          message: '$50 discount applied!'
        })
        setDiscount(50)
        toast.success('Promo code applied successfully!')
      } else {
        setPromoError('Invalid promo code')
        toast.error('Invalid promo code')
      }
    } catch (error) {
      setPromoError('Failed to apply promo code')
    } finally {
      setPromoLoading(false)
    }
  }

  // Remove promo code
  const removePromoCode = () => {
    setAppliedPromo(null)
    setDiscount(0)
    setPromoCode('')
    toast.success('Promo code removed')
  }

  // Handle payment
  const handlePayment = async () => {
    setProcessing(true)
    try {
      // await axiosInstance.post('/applications/payment/complete', {
      //   applicationId: checkoutItem?.id,
      //   amount: 0,
      //   method: 'wallet'
      // })

      setShowConfetti(true)
      toast.success('Payment completed successfully!')

      setTimeout(() => {
        //   router.push('/dashboard/applications')
      }, 3000)
    } catch (error) {
      toast.error('Payment failed')
    } finally {
      setProcessing(false)
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 flex items-center justify-center">
        <div className="text-center">
          <div className="w-20 h-20 border-4 border-[#F26D44] border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600 text-lg">Loading checkout...</p>
        </div>
      </div>
    )
  }

  if (!checkoutItem) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 flex items-center justify-center">
        <div className="text-center">
          <AlertCircle className="w-16 h-16 text-red-500 mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Checkout Not Available</h2>
          <p className="text-gray-600 mb-6">Unable to load checkout details</p>
          <Link
            href="/dashboard/application"
            className="inline-flex items-center gap-2 px-6 py-3 bg-[#1C3058] text-white rounded-xl hover:bg-[#1C3058]/90 transition-colors"
          >
            <ArrowLeft className="w-5 h-5" />
            Back to Applications
          </Link>
        </div>
      </div>
    )
  }

  return (
    <>
      <Confetti active={showConfetti} />

      <AnimatePresence>
        {showBreakdown && (
          <PriceBreakdown
            subtotal={subtotal}
            discount={discount}
            walletUsed={walletUsed}
            walletDiscount={walletDiscount}
            total={total}
            currency={checkoutItem.currency}
            onClose={() => setShowBreakdown(false)}
          />
        )}
      </AnimatePresence>

      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="min-h-screen max-w-6xl mx-auto"
      >
        {/* Header */}
        <header className="bg-white fixed left-0 right-0 max-w-6xl mx-auto top-0 z-10">
          <div className="mx-auto px-2 py-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <Link
                  href="/dashboard/application"
                  className="p-2 bg-gray-50 hover:bg-gray-100 rounded-xl transition-colors"
                >
                  <ArrowLeft className="w-7 h-7 stroke-[1.5px]" />
                </Link>
                <div>
                  <h1 className="text-xl font-bold text-gray-900">Checkout</h1>
                  <p className="text-sm text-gray-500">Complete your payment securely</p>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <div className="flex items-center gap-2 px-4 py-2 bg-blue-50 rounded-xl">
                  <Shield className="w-5 h-5 text-blue-600" />
                  <span className="text-xs font-medium text-blue-700">Secure Payment</span>
                </div>
                <div className="flex items-center gap-2 px-4 py-2 bg-green-50 rounded-xl">
                  <Lock className="w-5 h-5 text-green-600" />
                  <span className="text-xs font-medium text-green-700">SSL Encrypted</span>
                </div>
              </div>
            </div>
          </div>
        </header>

        <div className="mx-auto px-4 py-8 mt-14">
          <div className="grid lg:grid-cols-3 gap-4">
            <div className="lg:col-span-2 space-y-6">
              <motion.div
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                className="bg-white rounded-2xl border overflow-hidden"
              >
                <div className="p-6 border-b border-gray-200 bg-gradient-to-r from-[#1C3058] to-[#2a3f6e]/60">
                  <div className="flex items-center gap-4">
                    {checkoutItem.university?.logo ? (
                      <div className="w-24 h-20 bg-white rounded-xl p-2">
                        <Image
                          src={checkoutItem.university.logo}
                          alt={checkoutItem.university.name}
                          width={64}
                          height={64}
                          className="h-full w-full object-contain"
                        />
                      </div>
                    ) : (
                      <div className="w-16 h-16 bg-white/20 rounded-xl flex items-center justify-center">
                        <Award className="w-8 h-8 text-white" />
                      </div>
                    )}
                    <div className="flex-1">
                      <h2 className="text-xl font-bold text-white mb-1">
                        {checkoutItem.name}
                      </h2>
                      <p className="text-white/90 text-sm">
                        {checkoutItem.description}
                      </p>
                      {checkoutItem.applicationNumber && (
                        <p className="text-white/80 text-sm mt-1">
                          Application #{checkoutItem.applicationNumber}
                        </p>
                      )}
                    </div>
                  </div>
                </div>

                <div className="p-6">
                  <div className="grid grid-cols-3 gap-4 mb-3">
                    <div className="p-4 bg-gray-50 rounded-xl">
                      <p className="text-sm text-gray-500 mb-1">Program</p>
                      <p className="font-semibold text-gray-900">{checkoutItem.programName}</p>
                    </div>
                    <div className="p-4 bg-gray-50 rounded-xl">
                      <p className="text-sm text-gray-500 mb-1">Selected Intake</p>
                      <p className="font-semibold text-gray-900">{checkoutItem.intake}</p>
                    </div>
                    <div className="p-4 bg-gray-50 rounded-xl">
                      <p className="text-sm text-gray-500 mb-1">Application fee</p>
                      <p className="font-semibold text-gray-900">{checkoutItem.amount} {checkoutItem.currency}</p>
                    </div>
                  </div>
                </div>
              </motion.div>
            </div>

            {/* Right Column - Order Summary */}
            <div className="lg:col-span-1">
              <motion.div
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.2 }}
                className="bg-white rounded-2xl border overflow-hidden flex flex-col h-full !font-medium"
              >
                <div className="p-4 py-3 bg-gradient-to-r from-[#1C3058] to-[#2a3f6e]/60 border-b border-gray-200">
                  <h2 className="font-bold text-gray-100">Order Summary</h2>
                </div>

                <div className="p-4 px-6 space-y-3">
                  <div className="flex justify-between text-gray-700">
                    <span>Subtotal</span>
                    <span>{checkoutItem.currency} {subtotal.toLocaleString()}</span>
                  </div>

                  {discount > 0 && (
                    <motion.div
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      className="flex justify-between text-green-600"
                    >
                      <span>Promo Discount</span>
                      <span>-{checkoutItem.currency} {discount.toLocaleString()}</span>
                    </motion.div>
                  )}

                  {walletUsed > 0 && (
                    <motion.div
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      className="flex justify-between text-gray-600"
                    >
                      <span>Wallet Used</span>
                      <span>-{checkoutItem.currency} {walletUsed.toLocaleString()}</span>
                    </motion.div>
                  )}

                  <div className="border-t border-gray-200 pt-4">
                    <div className="flex justify-between items-center">
                      <span className="text-lg font-semibold text-gray-900">Total</span>
                      <div className="text-right">
                        <span className="text-2xl font-bold text-[#F26D44]">
                          {checkoutItem.currency} {total.toLocaleString()}
                        </span>
                        {total < subtotal && (
                          <p className="text-sm text-green-600 mt-1">
                            You save {(subtotal - total).toLocaleString()}
                          </p>
                        )}
                      </div>
                    </div>
                  </div>

                  <div className="mb-6">
                    <div className="flex items-center justify-between mb-3">
                      <div className="flex items-center gap-2">
                        <Wallet className="w-5 h-5 text-[#1C3058]" />
                        <span className="font-medium text-sm text-gray-900">Your Wallet</span>
                      </div>
                      <span className="text-sm text-gray-600">
                        Available Points: {wallet.balance.toLocaleString()}
                      </span>
                    </div>

                    <div className="p-4 bg-gradient-to-r from-blue-50 to-purple-50 text-sm rounded-xl">


                      <div className="flex items-center gap-3">
                        <button
                          onClick={() => setUseWallet(!useWallet)}
                          className={`flex-1 py-3 px-4 rounded-xl font-medium transition-all ${useWallet
                            ? 'bg-[#1C3058] text-white shadow-lg shadow-[#1C3058]/30'
                            : 'bg-white text-gray-700 hover:bg-gray-50 border border-gray-200'
                            }`}
                        >
                          {useWallet ? <span>Using {checkoutItem.currency} {walletAmount.toLocaleString()} from wallet</span> : 'Use Wallet Points'}
                        </button>
                      </div>
                    </div>
                  </div>

                  <div className="mb-1">
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Have a promo code?
                    </label>
                    <div className="flex gap-2">
                      <div className="flex-1 relative">
                        <Tag className="absolute left-3 top-[50%] -translate-y-1/2 w-4 h-4 text-gray-400" />
                        <input
                          type="text"
                          value={promoCode}
                          onChange={(e) => setPromoCode(e.target.value.toUpperCase())}
                          placeholder="Enter promo code"
                          className="w-full pl-9 pr-4 py-2 border border-gray-300 text-sm rounded-lg focus:ring-2 focus:ring-[#F26D44] focus:border-transparent transition-all"
                          disabled={!!appliedPromo || promoLoading}
                        />
                      </div>
                      {appliedPromo ? (
                        <button
                          onClick={removePromoCode}
                          className="p-2 px-3 bg-red-500 text-white text-sm rounded-lg hover:bg-red-600 transition-colors font-medium"
                        >
                          Remove
                        </button>
                      ) : (
                        <button
                          onClick={applyPromoCode}
                          disabled={promoLoading || !promoCode}
                          className="p-2 px-3 bg-[#1C3058] text-white rounded-lg hover:bg-[#1C3058]/90 transition-colors font-medium disabled:opacity-50 disabled:cursor-not-allowed min-w-[100px]"
                        >
                          {promoLoading ? (
                            <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin mx-auto" />
                          ) : (
                            'Apply'
                          )}
                        </button>
                      )}
                    </div>
                    {promoError && (
                      <p className="text-red-500 text-sm mt-2">{promoError}</p>
                    )}
                    {appliedPromo && (
                      <motion.div
                        initial={{ opacity: 0, y: -10 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="mt-2 p-3 bg-green-50 rounded-lg flex items-center gap-2"
                      >
                        <CheckCircle className="w-5 h-5 text-green-600" />
                        <span className="text-xs text-green-700">{appliedPromo.message}</span>
                      </motion.div>
                    )}
                  </div>

                  <button
                    onClick={handlePayment}
                    disabled={processing}
                    className="w-full mt-4 py-2.5 bg-gradient-to-r from-[#F26D44] to-[#ff8b5c] text-white rounded-xl font-semibold text-lg hover:shadow-lg hover:shadow-[#F26D44]/30 transition-all disabled:opacity-50 disabled:cursor-not-allowed relative overflow-hidden group"
                  >
                    <span className="relative z-10 flex items-center justify-center gap-2">
                      {processing ? (
                        <>
                          <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                          Processing...
                        </>
                      ) : (
                        <>
                          <Lock className="w-5 h-5" />
                          Pay {total.toLocaleString()} {checkoutItem.currency == "INR" ? "₹" : "$"}
                        </>
                      )}
                    </span>
                    <motion.div
                      className="absolute inset-0 bg-gradient-to-r from-[#ff8b5c] to-[#F26D44] opacity-0 group-hover:opacity-100 transition-opacity"
                      style={{ filter: 'blur(20px)' }}
                    />
                  </button>

                  <div className="flex items-center justify-center gap-2 text-sm text-gray-500 mt-4">
                    <ShieldCheck className="w-4 h-4" />
                    <span>Secured by industry-standard encryption</span>
                  </div>
                </div>
              </motion.div>
            </div>
          </div>
        </div>

        {/* Footer */}

      </motion.div>
      <footer className="border-t border-gray-200 bg-white/50 backdrop-blur-sm mt-6">
        <div className="container mx-auto px-4 py-4">
          <div className="flex flex-wrap items-center justify-between gap-4">
            <p className="text-sm text-gray-500">
              © {new Date().getFullYear()} Ooshas Global. All rights reserved.
            </p>
          </div>
        </div>
      </footer>
    </>
  )
}