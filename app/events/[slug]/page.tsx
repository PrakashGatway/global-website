import Image from "next/image"
import { serverInstance } from "@/app/axiosInstance"
import { notFound } from "next/navigation"
import Link from "next/link"

// Define types
interface BlogSEO {
    metaTitle: string
    metaDescription: string
    keywords: string[]
}

interface ExtraMetadata {
    location: string
    eventDate: string
    startTime: string
    endTime: string
    eventType: string
}

interface Category {
    _id: string
    name: string
    slug: string
    description: string
    status: string
    createdAt: string
    updatedAt: string
    __v: number
}

interface Event {
    _id: string
    title: string
    blogType: string
    slug: string
    shortDescription: string
    category: Category
    tags: string[]
    coverImage: string
    status: string
    isFeatured: boolean
    views: number
    seo: BlogSEO
    createdAt: string
    updatedAt: string
    __v: number
    extraMetadata: ExtraMetadata
}

// Event destination options
const studyDestinations = [
    { name: "Australia", flag: "🇦🇺" },
    { name: "United Kingdom", flag: "🇬🇧" },
    { name: "United States", flag: "🇺🇸" },
    { name: "Canada", flag: "🇨🇦", featured: true }
]

// Accordion FAQ items
const faqItems = [
    {
        question: "Why attend IDP events?",
        answer: "IDP events provide you with direct access to university representatives, expert counsellors, and valuable information about study abroad opportunities."
    },
    {
        question: "Will I be able to afford it?",
        answer: "Our counsellors can guide you about scholarships, financial aid, and education loans to make studying abroad affordable."
    },
    {
        question: "What can I expect when I attend an IDP event?",
        answer: "One-on-one counselling sessions, university presentations, visa guidance, and scholarship information."
    },
    {
        question: "What other services are available at IDP events?",
        answer: "IELTS registration assistance, application processing, visa documentation help, and pre-departure briefings."
    },
    {
        question: "What should I bring if I am ready to apply?",
        answer: "Bring your academic transcripts, passport, English test scores, statement of purpose, and letters of recommendation."
    }
]

export default async function EventDetailPage({
    params,
}: {
    params: { slug: string }
}) {
    const { slug } = await params

    let event: Event

    try {
        const res = await serverInstance.get(`/blogs/${slug}?type=event/`)
        console.log("Event Data:", res.data)
        event = res.data.data
    } catch (error) {
        console.error("Error fetching event:", error)
        return notFound()
    }

    // Format date
    const formatEventDate = (dateString: string) => {
        const date = new Date(dateString)
        return date.toLocaleDateString("en-IN", {
            day: "numeric",
            month: "long",
            year: "numeric"
        })
    }

    // Format time (assuming time is in HH:mm format)
    const formatTime = (time: string) => {
        const [hours, minutes] = time.split(':')
        const hour = parseInt(hours)
        const ampm = hour >= 12 ? 'PM' : 'AM'
        const displayHour = hour % 12 || 12
        return `${displayHour}:${minutes} ${ampm}`
    }

    return (
        <div className="min-h-screen bg-gray-50">
           
            {/* ================= BREADCRUMB ================= */}
            <div className="bg-gray-100">
                <div className="max-w-7xl mx-auto px-4 py-3">
                    <nav className="flex items-center space-x-2 text-sm">
                        <Link href="/" className="text-gray-600 hover:text-orange-600">
                            Home
                        </Link>
                        <span className="text-gray-400">/</span>
                        <Link href="/events" className="text-gray-600 hover:text-orange-600">
                            Events
                        </Link>
                        <span className="text-gray-400">/</span>
                        <span className="text-gray-900 font-medium truncate max-w-xs">
                            {event.title}
                        </span>
                    </nav>
                </div>
            </div>

            <div className="relative w-full h-[420px]">
                            <Image
                                src={
                                    event?.coverImage && event.coverImage.trim() !== ""
                                        ? event.coverImage
                                        : "https://static-cse.canva.com/blob/1134734/Thepowerofheroimagedesignfeaturedimage.jpg"
                                }
                                alt={event.title}
                                fill
                                className="object-cover"
                                priority
                                sizes="100vw"
                            />
            
                            <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/40 to-transparent flex items-end">
                                <div className="max-w-7xl mx-auto px-4 pb-12 w-full">
                                    <div className="text-white">
                                        {/* Blog title and meta */}
                                        <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold leading-tight mb-4">
                                            {event.title}
                                        </h1>
            
                                        {/* Last updated date */}
                                        <div className="flex items-center gap-4 text-sm opacity-90">
                                            <span>Last updated: </span>
                                            <span>
                                                {new Date(event.updatedAt).toLocaleDateString("en-IN", {
                                                    day: "2-digit",
                                                    month: "short",
                                                    year: "numeric",
                                                })}
                                            </span>
                                            <span className="px-1">|</span>
                                            <span>{event.views} views</span>
                                            {event.isFeatured && (
                                                <>
            
                                                    <span className="px-3 py-1 bg-orange-500 text-white text-xs rounded-full">Featured</span>
                                                </>
                                            )}
            
                                            <span className="px-3 py-1 bg-orange-500 text-white text-xs rounded-full">{event.blogType}</span>
                                        </div>
            
                                        {/* Tags */}
                                        {event.tags && event.tags.length > 0 && (
                                            <div className="flex flex-wrap gap-2 mt-4">
                                                {event.tags.map((tag, index) => (
                                                    <span
                                                        key={index}
                                                        className="px-3 py-1 bg-white/20 backdrop-blur-sm rounded-full text-xs font-medium"
                                                    >
                                                        {tag}
                                                    </span>
                                                ))}
                                            </div>
                                        )}
                                    </div>
                                </div>
                            </div>
                        </div>

            {/* ================= MAIN CONTENT ================= */}
            <div className="max-w-7xl mx-auto px-4 py-8">
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    {/* ================= LEFT COLUMN (2/3) ================= */}
                    <div className="lg:col-span-2">
                        {/* Event Type Badge */}
                        <div className="mb-6">
                            <span className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${event.extraMetadata.eventType === 'physical' ? 'bg-orange-100 text-orange-800' : 'bg-purple-100 text-purple-800'}`}>
                                {event.extraMetadata.eventType === 'physical' ? '📍 Physical' : '💻 Virtual'}
                            </span>
                        </div>

                        {/* Event Title */}
                        <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-6">
                            {event.title}
                        </h1>

                        {/* Event Details Card */}
                        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 mb-8">
                            <h2 className="text-2xl font-bold text-gray-900 mb-6">Event Details</h2>

                            {/* Where & When Section */}
                            <div className="mb-8">
                                <h3 className="text-lg font-semibold text-gray-800 mb-4">Where & When</h3>
                                <div className="space-y-4">
                                    <div className="flex items-start">
                                        <div className="w-6 h-6 bg-orange-100 rounded-full flex items-center justify-center mr-3 mt-1">
                                            <span className="text-orange-600 text-sm">📅</span>
                                        </div>
                                        <div>
                                            <p className="font-medium text-gray-700">Date & Time</p>
                                            <p className="text-gray-600">
                                                {formatEventDate(event.extraMetadata.eventDate)}, {formatTime(event.extraMetadata.startTime)} to {formatTime(event.extraMetadata.endTime)} India Local Time
                                            </p>
                                        </div>
                                    </div>
                                    <div className="flex items-start">
                                        <div className="w-6 h-6 bg-orange-100 rounded-full flex items-center justify-center mr-3 mt-1">
                                            <span className="text-orange-600 text-sm">📍</span>
                                        </div>
                                        <div>
                                            <p className="font-medium text-gray-700">Location</p>
                                            <p className="text-gray-600">{event.extraMetadata.location}</p>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* Featured Study Levels */}
                            <div className="mb-8">
                                <h3 className="text-lg font-semibold text-gray-800 mb-4">Featured study levels</h3>
                                <div className="flex flex-wrap gap-2">
                                    {["Postgraduate", "Undergraduate", "Doctorate"].map((level) => (
                                        <span
                                            key={level}
                                            className="px-4 py-2 bg-gray-100 text-gray-700 rounded-full text-sm font-medium"
                                        >
                                            {level}
                                        </span>
                                    ))}
                                </div>
                            </div>

                            {/* About this event */}
                            <div>
                                <h3 className="text-lg font-semibold text-gray-800 mb-4">About this event</h3>
                                <p className="text-gray-600 leading-relaxed">
                                    {event.shortDescription || "Are you planning to study abroad? but confused where to go? which course will give you more advantage? how to fund your studies? what all documents are required? Don't worry, IDP has every answer for all your queries. Register today for one-to-one counselling with our expert Visa counsellors at IDP Anand branch."}
                                </p>
                            </div>
                        </div>

                        {/* Study Destinations */}
                        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 mb-8">
                            <h2 className="text-2xl font-bold text-gray-900 mb-6">Study destinations</h2>
                            <h3 className="text-lg font-semibold text-gray-800 mb-4">Study destinations at this event</h3>
                            
                            <div className="space-y-3">
                                {studyDestinations.map((destination) => (
                                    <div 
                                        key={destination.name}
                                        className={`flex items-center justify-between p-4 rounded-lg ${destination.featured ? 'bg-red-50 border border-red-100' : 'bg-gray-50 hover:bg-gray-100'}`}
                                    >
                                        <div className="flex items-center">
                                            <span className="text-xl mr-3">{destination.flag}</span>
                                            <span className={`font-medium ${destination.featured ? 'text-red-700' : 'text-gray-700'}`}>
                                                {destination.name}
                                            </span>
                                            {destination.featured && (
                                                <span className="ml-3 px-2 py-1 bg-red-100 text-red-700 text-xs font-bold rounded">
                                                    I ❤️ Canada
                                                </span>
                                            )}
                                        </div>
                                        <Link 
                                            href={`#${destination.name.toLowerCase().replace(' ', '-')}`}
                                            className="text-orange-600 hover:text-orange-800 font-medium"
                                        >
                                            View details →
                                        </Link>
                                    </div>
                                ))}
                            </div>
                        </div>

                        {/* More Information Accordion */}
                        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                            <h2 className="text-2xl font-bold text-gray-900 mb-6">More information</h2>
                            <div className="space-y-4">
                                {faqItems.map((item, index) => (
                                    <div key={index} className="border-b border-gray-100 last:border-b-0">
                                        <button className="flex items-center justify-between w-full py-4 text-left">
                                            <span className="font-medium text-gray-800">{item.question}</span>
                                            <span className="text-gray-500 text-xl">+</span>
                                        </button>
                                        <div className="hidden pb-4 text-gray-600">
                                            {item.answer}
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>

                    {/* ================= RIGHT COLUMN (1/3) ================= */}
                    <div className="space-y-6">
                        {/* Registration Form - Sticky */}
                        <div className="sticky top-6">
                            <div className="bg-white rounded-xl shadow-lg border border-gray-200 p-6">
                                <h2 className="text-2xl font-bold text-gray-900 mb-6">Register for this event</h2>
                                
                                <form className="space-y-4">
                                    {/* First Name */}
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1">
                                            First name
                                        </label>
                                        <input
                                            type="text"
                                            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500 outline-none transition"
                                            placeholder="Enter your first name"
                                        />
                                    </div>

                                    {/* Last Name */}
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1">
                                            Last name
                                        </label>
                                        <input
                                            type="text"
                                            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500 outline-none transition"
                                            placeholder="Enter your last name"
                                        />
                                    </div>

                                    {/* Email */}
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1">
                                            Email address
                                        </label>
                                        <input
                                            type="email"
                                            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500 outline-none transition"
                                            placeholder="Enter your email"
                                        />
                                    </div>

                                    {/* Mobile Number */}
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1">
                                            Mobile Number
                                        </label>
                                        <div className="flex">
                                            <div className="w-24 mr-2">
                                                <select className="w-full px-3 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500 outline-none">
                                                    <option value="+91">+91 IN</option>
                                                    <option value="+1">+1 US</option>
                                                    <option value="+44">+44 UK</option>
                                                    <option value="+61">+61 AU</option>
                                                    <option value="+1">+1 CA</option>
                                                </select>
                                            </div>
                                            <input
                                                type="tel"
                                                className="flex-1 px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500 outline-none transition"
                                                placeholder="Enter mobile number"
                                            />
                                        </div>
                                    </div>

                                    {/* Nearest IDP Office */}
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1">
                                            Nearest Office
                                        </label>
                                        <select className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500 outline-none">
                                            <option value="">Select nearest office</option>
                                            <option value="mumbai">Mumbai</option>
                                            <option value="delhi">Delhi</option>
                                            <option value="bangalore">Bangalore</option>
                                            <option value="chennai">Chennai</option>
                                            <option value="hyderabad">Hyderabad</option>
                                            <option value="kolkata">Kolkata</option>
                                            <option value="pune">Pune</option>
                                        </select>
                                    </div>

                                    {/* How did you hear about IDP event? */}
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1">
                                            How did you hear about IDP event?
                                        </label>
                                        <select className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500 outline-none">
                                            <option value="">Select option</option>
                                            <option value="friend">Friend</option>
                                            <option value="social-media">Social Media</option>
                                            <option value="website">Website</option>
                                            <option value="email">Email</option>
                                            <option value="other">Other</option>
                                        </select>
                                    </div>

                                    {/* Checkboxes */}
                                    <div className="space-y-3 pt-2">
                                        <div className="flex items-start">
                                            <input
                                                type="checkbox"
                                                id="terms"
                                                className="mt-1 mr-3 h-4 w-4 text-orange-600 focus:ring-orange-500 border-gray-300 rounded"
                                            />
                                            <label htmlFor="terms" className="text-sm text-gray-700">
                                                I agree to IDP <Link href="#" className="text-orange-600 hover:underline">Terms and privacy policy</Link>
                                            </label>
                                        </div>
                                        <div className="flex items-start">
                                            <input
                                                type="checkbox"
                                                id="contact"
                                                className="mt-1 mr-3 h-4 w-4 text-orange-600 focus:ring-orange-500 border-gray-300 rounded"
                                            />
                                            <label htmlFor="contact" className="text-sm text-gray-700">
                                                By registering, I agree to IDP contacting me by phone, email or SMS about my enquiry.
                                            </label>
                                        </div>
                                        <div className="flex items-start">
                                            <input
                                                type="checkbox"
                                                id="communication"
                                                className="mt-1 mr-3 h-4 w-4 text-orange-600 focus:ring-orange-500 border-gray-300 rounded"
                                            />
                                            <label htmlFor="communication" className="text-sm text-gray-700">
                                                I'd love to get useful communication from IDP or our institution partners, about study abroad, scholarships and IELTS.
                                            </label>
                                        </div>
                                    </div>

                                    {/* Register Button */}
                                    <button
                                        type="submit"
                                        className="w-full bg-orange-600 hover:bg-orange-700 text-white font-bold py-3 px-4 rounded-lg transition duration-200 mt-4"
                                    >
                                        Register now
                                    </button>
                                </form>
                            </div>

                            {/* IDP Live App Card */}
                            <div className="bg-gradient-to-br from-orange-50 to-orange-100 border border-orange-200 rounded-xl p-6 mt-6">
                                <h3 className="text-lg font-bold text-gray-800 mb-3">Events are now in Live App</h3>
                                <p className="text-gray-600 mb-4">Download the app, and we'll guide you through your next exhibition event.</p>
                                <ul className="space-y-2 mb-4">
                                    <li className="flex items-center text-gray-700">
                                        <span className="text-green-500 mr-2">✓</span>
                                        Get counsellor recommendations for you
                                    </li>
                                    <li className="flex items-center text-gray-700">
                                        <span className="text-green-500 mr-2">✓</span>
                                        Access event materials
                                    </li>
                                    <li className="flex items-center text-gray-700">
                                        <span className="text-green-500 mr-2">✓</span>
                                        Schedule meetings with universities
                                    </li>
                                </ul>
                                <button className="w-full bg-black hover:bg-gray-800 text-white font-medium py-2.5 rounded-lg transition duration-200">
                                    Download App
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* ================= FOOTER ================= */}
            <div className="bg-gray-900 text-white py-8">
                <div className="max-w-7xl mx-auto px-4">
                    <div className="text-center">
                        <h3 className="text-xl font-bold mb-4">Search for events</h3>
                        <div className="flex flex-col md:flex-row gap-4 justify-center">
                            <select className="px-4 py-3 rounded-lg bg-gray-800 text-white border border-gray-700">
                                <option value="">City</option>
                                <option value="mumbai">Mumbai</option>
                                <option value="delhi">Delhi</option>
                                <option value="bangalore">Bangalore</option>
                                <option value="chennai">Chennai</option>
                            </select>
                            <select className="px-4 py-3 rounded-lg bg-gray-800 text-white border border-gray-700">
                                <option value="">Month</option>
                                <option value="january">January</option>
                                <option value="february">February</option>
                                <option value="march">March</option>
                                <option value="april">April</option>
                            </select>
                            <select className="px-4 py-3 rounded-lg bg-gray-800 text-white border border-gray-700">
                                <option value="">Study destinations</option>
                                <option value="australia">Australia</option>
                                <option value="uk">United Kingdom</option>
                                <option value="usa">United States</option>
                                <option value="canada">Canada</option>
                            </select>
                            <button className="bg-orange-600 hover:bg-orange-700 px-6 py-3 rounded-lg font-medium transition duration-200">
                                SEARCH
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}