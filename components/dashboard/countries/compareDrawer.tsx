"use client"

import { motion, AnimatePresence } from "framer-motion"
import { useRouter } from "next/navigation"
import { useGlobal } from "@/src/statecontext"
import Cookies from "js-cookie"
import { useState, useEffect } from "react"
import toast from "react-hot-toast"

const CompareDrawer = ({
    open,
    setOpen,
    countries,
    currentCountry
}) => {

    const router = useRouter()

    const {
        selectedCountries,
        addCountry,
        removeCountry
    } = useGlobal()

    const [searchCountry, setSearchCountry] = useState("")
    const [isComparing, setIsComparing] = useState(false)

    const filteredCountries = countries.filter((item) => {

        // remove current selected country
        if (item._id === currentCountry?._id) {
            return false
        }

        const isSelected = selectedCountries.find(
            (country) => country._id === item._id
        )

        const limitReached = selectedCountries.length >= 2

        // after limit only show selected countries
        if (limitReached && !isSelected) {
            return false
        }

        // search filter
        const matchesSearch = item.name
            ?.toLowerCase()
            .includes(searchCountry.toLowerCase())

        return matchesSearch
    })

    const handleSelect = (country) => {
        const exists = selectedCountries.find(
            item => item._id === country._id
        )

        if (exists) {
            removeCountry(country._id)
            toast.success(`Removed ${country.name} from comparison`)
        } else {
            if (selectedCountries.length >= 2) {
                toast.error("You can only compare up to 2 countries")
                return
            }
            addCountry(country)
            toast.success(`Added ${country.name} to comparison`)
        }
    }

    const handleCompareNow = async () => {
        if (!currentCountry) {
            toast.error("No country selected to compare")
            return
        }

        setIsComparing(true)

        try {
            // Prepare all countries for comparison
            const allCountries = [
                currentCountry,
                ...selectedCountries
            ]

            // Remove duplicates (just in case)
            const uniqueCountries = allCountries.filter(
                (country, index, self) =>
                    index === self.findIndex((c) => c._id === country._id)
            )

            //console.log("Saving to cookies:", uniqueCountries)
            Cookies.set("test", "hello");

//console.log("Test cookie:", Cookies.get("test"));

const cookieData = JSON.stringify(uniqueCountries);

            // Set cookie with proper options
          Cookies.set("compareCountries", cookieData, {
        expires: 7,
        path: "/",
    });



            // Verify cookie was set
            const savedCookie = Cookies.get("compareCountries")
            //console.log("Saved cookie:", savedCookie)

            if (!savedCookie) {
                throw new Error("Failed to save comparison data")
            }

            toast.success("Redirecting to comparison page...")
            
            // Close drawer and navigate
            setOpen(false)
            
            // Small delay to ensure drawer closes properly
            setTimeout(() => {
                router.push("/dashboard/compare-page")
            }, 100)

        } catch (error) {
            console.error("Error saving comparison:", error)
            toast.error("Failed to save comparison. Please try again.")
        } finally {
            setIsComparing(false)
        }
    }

    // Debug: Log selected countries
    useEffect(() => {
        //console.log("Selected countries in drawer:", selectedCountries)
    }, [selectedCountries])

    return (
        <AnimatePresence>
            {open && (
                <>
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="fixed inset-0 bg-black/40 z-40"
                        onClick={() => setOpen(false)}
                    />

                    <motion.div
                        initial={{ x: "100%" }}
                        animate={{ x: 0 }}
                        exit={{ x: "100%" }}
                        transition={{ duration: 0.4, type: "tween" }}
                        className="
                            fixed right-0 top-0
                            h-screen w-full sm:w-[450px]
                            bg-white z-50
                            shadow-2xl
                            overflow-y-auto
                            flex flex-col
                        "
                    >
                        {/* Header */}
                        <div className="sticky top-0 bg-white border-b border-gray-100 px-6 py-4">
                            <div className="flex justify-between items-center">
                                <h2 className="text-xl font-bold text-gray-800">
                                    Compare Countries
                                </h2>
                                <button
                                    onClick={() => setOpen(false)}
                                    className="p-2 hover:bg-gray-100 rounded-full transition-colors"
                                >
                                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                    </svg>
                                </button>
                            </div>
                        </div>

                        {/* Content */}
                        <div className="flex-1 px-6 py-4">
                            {/* Current Country (Fixed) */}
                            {currentCountry && (
                                <div className="mb-6">
                                    <p className="text-sm font-medium text-gray-500 mb-2">Comparing from:</p>
                                    <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-xl p-4 border border-blue-200">
                                        <div className="flex items-center gap-3">
                                            <img
                                                src={currentCountry.image || currentCountry.flg}
                                                alt={currentCountry.name}
                                                className="w-12 h-12 rounded-lg object-cover border-2 border-white shadow-sm"
                                            />
                                            <div>
                                                <h3 className="font-semibold text-gray-800">
                                                    {currentCountry.name}
                                                </h3>
                                                <p className="text-xs text-gray-500">
                                                    {currentCountry.code}
                                                </p>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            )}

                            {/* Search Input */}
                            <div className="mb-5">
                                <input
                                    type="text"
                                    placeholder="Search countries to compare..."
                                    value={searchCountry}
                                    onChange={(e) => setSearchCountry(e.target.value)}
                                    className="
                                        w-full
                                        border border-gray-200
                                        rounded-xl
                                        px-4 py-3
                                        outline-none
                                        focus:border-[#F26D44]
                                        focus:ring-2 focus:ring-[#F26D44]/20
                                        transition-all
                                    "
                                />
                            </div>

                            {/* Selection Status */}
                            <div className="flex items-center justify-between mb-4">
                                <p className="text-sm text-gray-500">
                                    Add up to 2 countries to compare
                                </p>
                                <div className="
                                    bg-blue-100
                                    text-blue-700
                                    px-3 py-1
                                    rounded-full
                                    text-sm
                                    font-semibold
                                ">
                                    {selectedCountries.length}/2 Selected
                                </div>
                            </div>

                            {/* Countries List */}
                            <div className="space-y-3 max-h-[400px] overflow-y-auto">
                                {filteredCountries.length === 0 ? (
                                    <div className="text-center py-8 text-gray-400">
                                        <p>No countries available to compare</p>
                                        {searchCountry && (
                                            <button
                                                onClick={() => setSearchCountry("")}
                                                className="mt-2 text-[#F26D44] text-sm"
                                            >
                                                Clear search
                                            </button>
                                        )}
                                    </div>
                                ) : (
                                    filteredCountries.map(country => {
                                        const isSelected = selectedCountries.find(
                                            item => item._id === country._id
                                        )

                                        return (
                                            <motion.div
                                                key={country._id}
                                                initial={{ opacity: 0, y: 10 }}
                                                animate={{ opacity: 1, y: 0 }}
                                                className={`
                                                    border rounded-xl p-3
                                                    flex items-center justify-between
                                                    transition-all duration-200
                                                    cursor-pointer
                                                    hover:shadow-md
                                                    ${isSelected
                                                        ? "border-[#F26D44] bg-orange-50"
                                                        : "border-gray-200 hover:border-gray-300"
                                                    }
                                                `}
                                                onClick={() => handleSelect(country)}
                                            >
                                                <div className="flex gap-3 items-center">
                                                    <img
                                                        src={country.image || country.flg}
                                                        alt={country.name}
                                                        className="w-12 h-12 rounded-lg object-cover border border-gray-200"
                                                    />
                                                    <div>
                                                        <h3 className="font-semibold text-gray-800">
                                                            {country.name}
                                                        </h3>
                                                        <p className="text-xs text-gray-500">
                                                            {country.code}
                                                        </p>
                                                    </div>
                                                </div>

                                                <button
                                                    onClick={(e) => {
                                                        e.stopPropagation()
                                                        handleSelect(country)
                                                    }}
                                                    className={`
                                                        px-4 py-1.5
                                                        rounded-lg
                                                        text-sm
                                                        font-medium
                                                        transition-all
                                                        ${isSelected
                                                            ? "bg-red-500 hover:bg-red-600 text-white"
                                                            : "bg-[#F26D44] hover:bg-[#F26D44]/90 text-white"
                                                        }
                                                    `}
                                                >
                                                    {isSelected ? "Remove" : "Add"}
                                                </button>
                                            </motion.div>
                                        )
                                    })
                                )}
                            </div>
                        </div>

                        {/* Footer Button */}
                        <div className="sticky bottom-0 bg-white border-t border-gray-100 p-6">
                            <button
                                onClick={handleCompareNow}
                                disabled={isComparing || selectedCountries.length === 0}
                                className={`
                                    w-full
                                    py-4
                                    rounded-xl
                                    font-semibold
                                    transition-all
                                    ${isComparing || selectedCountries.length === 0
                                        ? "bg-gray-300 cursor-not-allowed"
                                        : "bg-[#F26D44] hover:bg-[#F26D44]/90 text-white shadow-lg hover:shadow-xl"
                                    }
                                `}
                            >
                                {isComparing ? (
                                    <div className="flex items-center justify-center gap-2">
                                        <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                                        Preparing...
                                    </div>
                                ) : (
                                    `Compare Now (${selectedCountries.length + 1} Countries)`
                                )}
                            </button>
                            {selectedCountries.length === 0 && (
                                <p className="text-xs text-center text-gray-400 mt-3">
                                    Please select at least one country to compare
                                </p>
                            )}
                        </div>
                    </motion.div>
                </>
            )}
        </AnimatePresence>
    )
}

export default CompareDrawer