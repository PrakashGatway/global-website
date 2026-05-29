"use client"

import Cookies from "js-cookie"
import { useEffect, useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import {
    Globe, DollarSign, Clock, Star, BookOpen,
    Trophy, CheckCircle, Users, Trash2, ArrowLeft,
    TrendingUp, Award, Menu, X, Bell, Settings,
    HelpCircle, CreditCard, FileText, Search, LayoutDashboard,
    GraduationCap, MapPin, Briefcase, LogOut
} from "lucide-react"
import Link from "next/link"
import toast from "react-hot-toast"
import { useRouter } from "next/navigation"

interface Country {
    _id: string
    name: string
    code: string
    flg: string
    image: string
    currency: string
    status: string
    universities: number
    students: number
    isFeatured: string
    extra_content?: {
        tuitionfee: string
        psw: string
        rating: string
        topcourse: string[]
        topuniversity: string[]
        keyHightlights: string[]
    }
}

const ComparePage = () => {
    const router = useRouter()
    const [countries, setCountries] = useState<Country[]>([])
    const [hoveredRow, setHoveredRow] = useState<string | null>(null)
    const [sidebarOpen, setSidebarOpen] = useState(false)

    useEffect(() => {
        const cookieData = Cookies.get("compareCountries")
        if (cookieData) {
            setCountries(JSON.parse(cookieData))
        }
    }, [])

    const removeCountry = (countryId: string) => {
        const updatedCountries = countries.filter(c => c._id !== countryId)
        setCountries(updatedCountries)
        Cookies.set("compareCountries", JSON.stringify(updatedCountries), { expires: 7 })
        toast.success("Removed from comparison")
    }

    const clearAll = () => {
        setCountries([])
        Cookies.remove("compareCountries")
        toast.success("Cleared all countries")
    }

    const navigation = [
        { name: "Dashboard", icon: LayoutDashboard, href: "/dashboard", active: false },
        { name: "Universities", icon: GraduationCap, href: "/dashboard/universities", active: false },
        { name: "Countries", icon: Globe, href: "/dashboard/countries", active: true },
        { name: "Find Programs", icon: Search, href: "/dashboard/programs", active: false },
        { name: "Application", icon: FileText, href: "/dashboard/applications", active: false },
        { name: "Payments", icon: CreditCard, href: "/dashboard/payments", active: false },
        { name: "Offers", icon: Briefcase, href: "/dashboard/offers", active: false },
    ]

    if (countries.length === 0) {
        return (
            <div className="min-h-screen bg-gray-50">
                {/* Header */}
              
                {/* Empty State */}
                <div className="flex items-center justify-center px-4 py-20">
                    <motion.div 
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="text-center max-w-md"
                    >
                        <motion.div 
                            animate={{ scale: [1, 1.05, 1] }}
                            transition={{ duration: 2, repeat: Infinity }}
                            className="w-24 h-24 bg-gradient-to-br from-blue-100 to-indigo-100 rounded-2xl flex items-center justify-center mx-auto mb-6"
                        >
                            <Globe className="w-12 h-12 text-blue-500" />
                        </motion.div>
                        <h2 className="text-2xl font-semibold text-gray-800 mb-2">No countries to compare</h2>
                        <p className="text-gray-500 mb-6">Add countries to see them side by side</p>
                        <Link
                            href="/dashboard/countries"
                            className="inline-flex items-center gap-2 px-5 py-2.5 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-all hover:shadow-md"
                        >
                            <ArrowLeft className="w-4 h-4" />
                            Browse Countries
                        </Link>
                    </motion.div>
                </div>
            </div>
        )
    }

    return (
        <div className="min-h-screen bg-gray-50">
           

            {/* Page Title Bar */}
            <div className="bg-white border-b">
                <div className="max-w-7xl mx-auto px-6 py-6">
                    <div className="flex items-center justify-between flex-wrap gap-4">
                        <div>
                            <h1 className="text-2xl font-bold text-gray-800">Compare Countries</h1>
                            <div className="flex items-center gap-2 mt-1">
                                <p className="text-sm text-gray-500">
                                    Comparing {countries.length} countries
                                </p>
                                {countries.length >= 2 && (
                                    <span className="px-2 py-0.5 bg-green-100 text-green-700 text-xs rounded-full">
                                        Ready to compare
                                    </span>
                                )}
                            </div>
                        </div>
                        <div className="flex gap-3">
                            <Link
                                href="/dashboard/countries"
                                className="px-4 py-2 text-gray-600 hover:bg-gray-100 rounded-lg transition-all text-sm flex items-center gap-2"
                            >
                                <ArrowLeft className="w-4 h-4" />
                                Add More
                            </Link>
                            {countries.length > 1 && (
                                <button
                                    onClick={clearAll}
                                    className="px-4 py-2 text-red-600 hover:bg-red-50 rounded-lg transition-all text-sm flex items-center gap-2"
                                >
                                    <Trash2 className="w-4 h-4" />
                                    Clear All
                                </button>
                            )}
                        </div>
                    </div>
                </div>
            </div>

            {/* Comparison Table */}
            <div className="max-w-7xl mx-auto px-6 py-8">
                <motion.div 
                    initial={{ opacity: 0, scale: 0.98 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="overflow-x-auto bg-white rounded-xl shadow-lg border border-gray-100"
                >
                    <table className="w-full min-w-[800px]">
                        <thead className="bg-gradient-to-r from-gray-50 to-white border-b">
                            <tr>
                                <th className="p-5 text-left text-sm font-semibold text-gray-600 w-48">
                                    Features
                                </th>
                                <AnimatePresence>
                                    {countries.map((country, idx) => (
                                        <th key={country._id} className="p-5 text-center min-w-[260px] relative group">
                                            <motion.button
                                                initial={{ opacity: 0 }}
                                                animate={{ opacity: 1 }}
                                                whileHover={{ scale: 1.1 }}
                                                onClick={() => removeCountry(country._id)}
                                                className="absolute top-2 right-2 p-1.5 rounded-md text-gray-400 hover:text-red-500 hover:bg-red-50 opacity-0 group-hover:opacity-100 transition-all"
                                            >
                                                <Trash2 className="w-3.5 h-3.5" />
                                            </motion.button>
                                            <motion.div 
                                                initial={{ opacity: 0, y: 20 }}
                                                animate={{ opacity: 1, y: 0 }}
                                                transition={{ delay: idx * 0.1 }}
                                                className="flex flex-col items-center"
                                            >
                                                <div className="relative">
                                                    <img
                                                        src={country.image || country.flg}
                                                        alt={country.name}
                                                        className="w-20 h-20 rounded-xl object-cover border-2 border-white shadow-md"
                                                        onError={(e) => {
                                                            (e.target as HTMLImageElement).src = "https://via.placeholder.com/80x80?text=Flag"
                                                        }}
                                                    />
                                                    {country.isFeatured === "Yes" && (
                                                        <div className="absolute -top-1 -right-1">
                                                            <div className="bg-amber-500 text-white p-1 rounded-full shadow-md">
                                                                <Star className="w-3 h-3 fill-current" />
                                                            </div>
                                                        </div>
                                                    )}
                                                </div>
                                                <h3 className="font-semibold text-gray-800 mt-3">{country.name}</h3>
                                                <p className="text-xs text-gray-400">{country.code}</p>
                                                {country.extra_content?.rating && (
                                                    <motion.div 
                                                        whileHover={{ scale: 1.05 }}
                                                        className="flex items-center gap-1 mt-2 px-2 py-1 bg-amber-50 rounded-full"
                                                    >
                                                        <Star className="w-3 h-3 text-amber-500 fill-amber-500" />
                                                        <span className="text-xs font-medium text-amber-700">
                                                            {country.extra_content.rating}
                                                        </span>
                                                        <span className="text-xs text-gray-400">(539)</span>
                                                    </motion.div>
                                                )}
                                            </motion.div>
                                        </th>
                                    ))}
                                </AnimatePresence>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-100">
                            {/* Tuition Fee */}
                            <motion.tr 
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                transition={{ delay: 0.1 }}
                                className="hover:bg-gray-50 transition-colors"
                                onMouseEnter={() => setHoveredRow("tuition")}
                                onMouseLeave={() => setHoveredRow(null)}
                            >
                                <td className="p-5 text-sm font-medium text-gray-700 bg-white sticky left-0">
                                    <div className="flex items-center gap-2">
                                        <div className="p-1.5 bg-green-100 rounded-lg">
                                            <DollarSign className="w-4 h-4 text-green-600" />
                                        </div>
                                        <span>Avg. Tuition Fee</span>
                                    </div>
                                    <p className="text-xs text-gray-400 mt-1">Annual cost of education</p>
                                 </td>
                                {countries.map((country) => (
                                    <td key={country._id} className="p-5 text-center">
                                        <div className="font-semibold text-gray-800">
                                            {country.extra_content?.tuitionfee || "USD 30,000 - 60,000 / year"}
                                        </div>
                                        {country.currency && (
                                            <div className="text-xs text-gray-400 mt-1">
                                                Currency: {country.currency}
                                            </div>
                                        )}
                                     </td>
                                ))}
                            </motion.tr>

                            {/* PSW */}
                            <motion.tr 
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                transition={{ delay: 0.15 }}
                                className="hover:bg-gray-50 transition-colors"
                                onMouseEnter={() => setHoveredRow("psw")}
                                onMouseLeave={() => setHoveredRow(null)}
                            >
                                <td className="p-5 text-sm font-medium text-gray-700 bg-white sticky left-0">
                                    <div className="flex items-center gap-2">
                                        <div className="p-1.5 bg-blue-100 rounded-lg">
                                            <Clock className="w-4 h-4 text-blue-600" />
                                        </div>
                                        <span>PSW Duration</span>
                                    </div>
                                    <p className="text-xs text-gray-400 mt-1">Post-study work permit</p>
                                 </td>
                                {countries.map((country) => (
                                    <td key={country._id} className="p-5 text-center">
                                        <span className="font-semibold text-blue-600">
                                            {country.extra_content?.psw || "3 Years (OPT)"}
                                        </span>
                                     </td>
                                ))}
                            </motion.tr>

                            {/* Top Courses */}
                            <motion.tr 
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                transition={{ delay: 0.2 }}
                                className="hover:bg-gray-50 transition-colors"
                                onMouseEnter={() => setHoveredRow("courses")}
                                onMouseLeave={() => setHoveredRow(null)}
                            >
                                <td className="p-5 text-sm font-medium text-gray-700 bg-white sticky left-0 align-top">
                                    <div className="flex items-center gap-2">
                                        <div className="p-1.5 bg-purple-100 rounded-lg">
                                            <BookOpen className="w-4 h-4 text-purple-600" />
                                        </div>
                                        <span>Top Courses</span>
                                    </div>
                                    <p className="text-xs text-gray-400 mt-1">Popular programs</p>
                                 </td>
                                {countries.map((country) => (
                                    <td key={country._id} className="p-5 align-top">
                                        <div className="space-y-1.5">
                                            {country.extra_content?.topcourse?.length ? (
                                                country.extra_content.topcourse.slice(0, 3).map((course, i) => (
                                                    <motion.div 
                                                        key={i}
                                                        initial={{ opacity: 0, x: -10 }}
                                                        animate={{ opacity: 1, x: 0 }}
                                                        transition={{ delay: i * 0.05 }}
                                                        className="text-sm text-gray-600 flex items-center gap-1"
                                                    >
                                                        <span className="w-1 h-1 bg-purple-400 rounded-full" />
                                                        {course}
                                                    </motion.div>
                                                ))
                                            ) : (
                                                <div className="space-y-1.5">
                                                    <div className="text-sm text-gray-600 flex items-center gap-1">
                                                        <span className="w-1 h-1 bg-purple-400 rounded-full" />
                                                        Data Science
                                                    </div>
                                                    <div className="text-sm text-gray-600 flex items-center gap-1">
                                                        <span className="w-1 h-1 bg-purple-400 rounded-full" />
                                                        Computer Science
                                                    </div>
                                                    <div className="text-sm text-gray-600 flex items-center gap-1">
                                                        <span className="w-1 h-1 bg-purple-400 rounded-full" />
                                                        Business Analytics
                                                    </div>
                                                </div>
                                            )}
                                        </div>
                                     </td>
                                ))}
                            </motion.tr>

                            {/* Top Universities */}
                            <motion.tr 
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                transition={{ delay: 0.25 }}
                                className="hover:bg-gray-50 transition-colors"
                                onMouseEnter={() => setHoveredRow("universities")}
                                onMouseLeave={() => setHoveredRow(null)}
                            >
                                <td className="p-5 text-sm font-medium text-gray-700 bg-white sticky left-0 align-top">
                                    <div className="flex items-center gap-2">
                                        <div className="p-1.5 bg-amber-100 rounded-lg">
                                            <Trophy className="w-4 h-4 text-amber-600" />
                                        </div>
                                        <span>Top Universities</span>
                                    </div>
                                    <p className="text-xs text-gray-400 mt-1">Leading institutions</p>
                                 </td>
                                {countries.map((country) => (
                                    <td key={country._id} className="p-5 align-top">
                                        <div className="space-y-1.5">
                                            {country.extra_content?.topuniversity?.length ? (
                                                country.extra_content.topuniversity.slice(0, 3).map((uni, i) => (
                                                    <motion.div 
                                                        key={i}
                                                        initial={{ opacity: 0, x: -10 }}
                                                        animate={{ opacity: 1, x: 0 }}
                                                        transition={{ delay: i * 0.05 }}
                                                        className="text-sm text-gray-600 flex items-center gap-1"
                                                    >
                                                        <Award className="w-3 h-3 text-amber-500" />
                                                        {uni}
                                                    </motion.div>
                                                ))
                                            ) : (
                                                <div className="space-y-1.5">
                                                    <div className="text-sm text-gray-600 flex items-center gap-1">
                                                        <Award className="w-3 h-3 text-amber-500" />
                                                        MIT
                                                    </div>
                                                    <div className="text-sm text-gray-600 flex items-center gap-1">
                                                        <Award className="w-3 h-3 text-amber-500" />
                                                        Stanford University
                                                    </div>
                                                    <div className="text-sm text-gray-600 flex items-center gap-1">
                                                        <Award className="w-3 h-3 text-amber-500" />
                                                        Harvard University
                                                    </div>
                                                </div>
                                            )}
                                        </div>
                                     </td>
                                ))}
                            </motion.tr>

                            {/* Key Highlights */}
                            <motion.tr 
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                transition={{ delay: 0.3 }}
                                className="hover:bg-gray-50 transition-colors"
                                onMouseEnter={() => setHoveredRow("highlights")}
                                onMouseLeave={() => setHoveredRow(null)}
                            >
                                <td className="p-5 text-sm font-medium text-gray-700 bg-white sticky left-0 align-top">
                                    <div className="flex items-center gap-2">
                                        <div className="p-1.5 bg-emerald-100 rounded-lg">
                                            <CheckCircle className="w-4 h-4 text-emerald-600" />
                                        </div>
                                        <span>Key Highlights</span>
                                    </div>
                                    <p className="text-xs text-gray-400 mt-1">Key advantages</p>
                                 </td>
                                {countries.map((country) => (
                                    <td key={country._id} className="p-5 align-top">
                                        <div className="space-y-1.5">
                                            {country.extra_content?.keyHightlights?.length ? (
                                                country.extra_content.keyHightlights.slice(0, 3).map((highlight, i) => (
                                                    <motion.div 
                                                        key={i}
                                                        initial={{ opacity: 0, x: -10 }}
                                                        animate={{ opacity: 1, x: 0 }}
                                                        transition={{ delay: i * 0.05 }}
                                                        className="text-sm text-gray-600 flex items-start gap-1"
                                                    >
                                                        <CheckCircle className="w-3 h-3 text-emerald-500 mt-0.5 flex-shrink-0" />
                                                        <span>{highlight}</span>
                                                    </motion.div>
                                                ))
                                            ) : (
                                                <div className="space-y-1.5">
                                                    <div className="text-sm text-gray-600 flex items-start gap-1">
                                                        <CheckCircle className="w-3 h-3 text-emerald-500 mt-0.5" />
                                                        Top ranked universities
                                                    </div>
                                                    <div className="text-sm text-gray-600 flex items-start gap-1">
                                                        <CheckCircle className="w-3 h-3 text-emerald-500 mt-0.5" />
                                                        STEM OPT benefits
                                                    </div>
                                                    <div className="text-sm text-gray-600 flex items-start gap-1">
                                                        <CheckCircle className="w-3 h-3 text-emerald-500 mt-0.5" />
                                                        Excellent career opportunities
                                                    </div>
                                                </div>
                                            )}
                                        </div>
                                     </td>
                                ))}
                            </motion.tr>

                            {/* Statistics */}
                            <motion.tr 
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                transition={{ delay: 0.35 }}
                                className="hover:bg-gray-50 transition-colors"
                                onMouseEnter={() => setHoveredRow("stats")}
                                onMouseLeave={() => setHoveredRow(null)}
                            >
                                <td className="p-5 text-sm font-medium text-gray-700 bg-white sticky left-0">
                                    <div className="flex items-center gap-2">
                                        <div className="p-1.5 bg-indigo-100 rounded-lg">
                                            <Users className="w-4 h-4 text-indigo-600" />
                                        </div>
                                        <span>Statistics</span>
                                    </div>
                                    <p className="text-xs text-gray-400 mt-1">Education landscape</p>
                                 </td>
                                {countries.map((country) => (
                                    <td key={country._id} className="p-5 text-center">
                                        <div className="space-y-2">
                                            <div className="text-sm">
                                                <span className="text-gray-500">Universities: </span>
                                                <span className="font-semibold text-gray-800">{country.universities || 0}</span>
                                            </div>
                                            <div className="text-sm">
                                                <span className="text-gray-500">Students: </span>
                                                <span className="font-semibold text-gray-800">{country.students?.toLocaleString() || 0}</span>
                                            </div>
                                        </div>
                                     </td>
                                ))}
                            </motion.tr>
                        </tbody>
                    </table>
                </motion.div>

             
            </div>
        </div>
    )
}

export default ComparePage