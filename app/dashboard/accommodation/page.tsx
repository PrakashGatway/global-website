// app/accommodation/page.tsx
"use client";
import React, { useState } from 'react';
import Image from 'next/image';
import { Search, MapPin, Grid, List, ChevronRight, Star, Wifi, Droplets, Flame, Shield, Home, GraduationCap } from 'lucide-react';

// Dummy accommodation data with images
interface Accommodation {
    id: number;
    name: string;
    city: string;
    country: string;
    price: number;
    currency: string;
    image: string;
    rating: number;
    distance: string;
    amenities: string[];
    availableFrom: string;
    instantBooking: boolean;
}

const accommodations: Accommodation[] = [
    {
        id: 1,
        name: "Charlotte Court",
        city: "Sheffield",
        country: "United Kingdom",
        price: 70,
        currency: "£",
        image: "https://images.unsplash.com/photo-1554995207-c18c203602cb?w=600&h=400&fit=crop",
        rating: 4.6,
        distance: "0.3 miles to campus",
        amenities: ["WiFi", "Bills Included", "Laundry"],
        availableFrom: "Sep 2025",
        instantBooking: true
    },
    {
        id: 2,
        name: "Westhill Hall",
        city: "Sheffield",
        country: "United Kingdom",
        price: 72,
        currency: "£",
        image: "https://images.unsplash.com/photo-1580587771525-78b9dba3b914?w=600&h=400&fit=crop",
        rating: 4.7,
        distance: "0.5 miles to campus",
        amenities: ["WiFi", "Gym", "Study Room"],
        availableFrom: "Sep 2025",
        instantBooking: true
    },
    {
        id: 3,
        name: "Apollo House",
        city: "Coventry",
        country: "United Kingdom",
        price: 75,
        currency: "£",
        image: "https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?w=600&h=400&fit=crop",
        rating: 4.8,
        distance: "0.2 miles to campus",
        amenities: ["WiFi", "Bills Included", "Social Space"],
        availableFrom: "Aug 2025",
        instantBooking: true
    },
    {
        id: 4,
        name: "Borden Court",
        city: "Liverpool",
        country: "United Kingdom",
        price: 75,
        currency: "£",
        image: "https://images.unsplash.com/photo-1560185893-a55cbc8c57e8?w=600&h=400&fit=crop",
        rating: 4.5,
        distance: "0.4 miles to campus",
        amenities: ["WiFi", "Bills Included", "Bike Storage"],
        availableFrom: "Sep 2025",
        instantBooking: true
    },
    {
        id: 5,
        name: "Charlotte House",
        city: "Newcastle",
        country: "United Kingdom",
        price: 75,
        currency: "£",
        image: "https://images.unsplash.com/photo-1560185127-6ed189bf02f4?w=600&h=400&fit=crop",
        rating: 4.6,
        distance: "0.6 miles to campus",
        amenities: ["WiFi", "Bills Included", "Common Room"],
        availableFrom: "Oct 2025",
        instantBooking: true
    },
    {
        id: 6,
        name: "The Green",
        city: "Bradford",
        country: "United Kingdom",
        price: 75,
        currency: "£",
        image: "https://images.unsplash.com/photo-1570129477492-45c003edd2be?w=600&h=400&fit=crop",
        rating: 4.4,
        distance: "0.3 miles to campus",
        amenities: ["WiFi", "Garden", "Parking"],
        availableFrom: "Sep 2025",
        instantBooking: true
    },
    {
        id: 7,
        name: "161 Whitham Road",
        city: "Sheffield",
        country: "United Kingdom",
        price: 75,
        currency: "£",
        image: "https://images.unsplash.com/photo-1560185127-6ed189bf02f4?w=600&h=400&fit=crop",
        rating: 4.7,
        distance: "0.2 miles to campus",
        amenities: ["WiFi", "Bills Included", "En-suite"],
        availableFrom: "Sep 2025",
        instantBooking: true
    },
    {
        id: 8,
        name: "Central Quay",
        city: "Sheffield",
        country: "United Kingdom",
        price: 75,
        currency: "£",
        image: "https://images.unsplash.com/photo-1554995207-c18c203602cb?w=600&h=400&fit=crop",
        rating: 4.8,
        distance: "0.4 miles to campus",
        amenities: ["WiFi", "Gym", "Cinema Room"],
        availableFrom: "Aug 2025",
        instantBooking: true
    },
    {
        id: 9,
        name: "Archways",
        city: "Sheffield",
        country: "United Kingdom",
        price: 76,
        currency: "£",
        image: "https://images.unsplash.com/photo-1580587771525-78b9dba3b914?w=600&h=400&fit=crop",
        rating: 4.5,
        distance: "0.5 miles to campus",
        amenities: ["WiFi", "Bills Included", "Study Area"],
        availableFrom: "Sep 2025",
        instantBooking: true
    },
    {
        id: 10,
        name: "75 Dawlish Road",
        city: "Birmingham",
        country: "United Kingdom",
        price: 78,
        currency: "£",
        image: "https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?w=600&h=400&fit=crop",
        rating: 4.6,
        distance: "0.3 miles to campus",
        amenities: ["WiFi", "Bills Included", "Parking"],
        availableFrom: "Sep 2025",
        instantBooking: true
    },
    {
        id: 11,
        name: "Abbey Lodge Student Village",
        city: "Derby",
        country: "United Kingdom",
        price: 78,
        currency: "£",
        image: "https://images.unsplash.com/photo-1560185893-a55cbc8c57e8?w=600&h=400&fit=crop",
        rating: 4.7,
        distance: "0.4 miles to campus",
        amenities: ["WiFi", "Gym", "Study Room"],
        availableFrom: "Sep 2025",
        instantBooking: true
    },
    {
        id: 12,
        name: "1 Mount Street",
        city: "Lincoln",
        country: "United Kingdom",
        price: 79,
        currency: "£",
        image: "https://images.unsplash.com/photo-1570129477492-45c003edd2be?w=600&h=400&fit=crop",
        rating: 4.5,
        distance: "0.3 miles to campus",
        amenities: ["WiFi", "Bills Included", "Parking"],
        availableFrom: "Sep 2025",
        instantBooking: true
    }
];

const countries = [
    { name: "United Kingdom", flag: "🇬🇧" },
    { name: "Canada", flag: "🇨🇦" },
    { name: "Ireland", flag: "🇮🇪" },
    { name: "United States", flag: "🇺🇸" },
    { name: "New Zealand", flag: "🇳🇿" },
    { name: "UAE", flag: "🇦🇪" }
];

const cities = [
    { name: "Sheffield", image: "https://images.unsplash.com/photo-1548625149-fc4a29cf7092?w=300&h=200&fit=crop" },
    { name: "Bradford", image: "https://images.unsplash.com/photo-1572917718849-706086847c7f?w=300&h=200&fit=crop" },
    { name: "Liverpool", image: "https://images.unsplash.com/photo-1562569633-622303bafef5?w=300&h=200&fit=crop" },
    { name: "Edinburgh", image: "https://images.unsplash.com/photo-1529335764857-3f121e912e6e?w=300&h=200&fit=crop" },
    { name: "Bristol", image: "https://images.unsplash.com/photo-1529634597503-139d3726fed5?w=300&h=200&fit=crop" },
    { name: "Southampton", image: "https://images.unsplash.com/photo-1513635269975-59663e0ac1ad?w=300&h=200&fit=crop" },
    { name: "Newcastle", image: "https://images.unsplash.com/photo-1572917718849-706086847c7f?w=300&h=200&fit=crop" },
    { name: "Coventry", image: "https://images.unsplash.com/photo-1524230375108-923040281b9e?w=300&h=200&fit=crop" }
];

const cityList = ["All Cities", "Sheffield", "Manchester", "London", "Birmingham", "Liverpool", "Leeds", "Newcastle", "Coventry", "Bradford", "Edinburgh", "Bristol"];

export default function AccommodationPage() {
    const [selectedCountry, setSelectedCountry] = useState("United Kingdom");
    const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');

    return (
        <div className="min-h-screen mx-auto px-2">
            <div className=" pb-4 pt-4">
                <div className="">
                    <h1 className="text-2xl font-bold text-gray-900 mb-1">
                        Popular Cities Across The Globe
                    </h1>
                    <p className="text-gray-600 text-sm max-w-2xl">
                        Book student accommodations near top cities and universities around the world.
                    </p>
                </div>
            </div>

            {/* Country Filter Pills */}
            <div className="bg-white sticky top-0 z-20">
                <div className=" mx-auto">
                    <div className="flex gap-3 overflow-x-auto py-2 scrollbar-hide">
                        {countries.map((country) => (
                            <button
                                key={country.name}
                                onClick={() => setSelectedCountry(country.name)}
                                className={`flex items-center gap-2 px-3 py-1 rounded-full border-2 whitespace-nowrap transition-all ${selectedCountry === country.name
                                    ? 'border-[#ff6b35] bg-orange-50 text-[#ff6b35]'
                                    : 'border-gray-200 hover:border-[#ff6b35] hover:text-[#ff6b35]'
                                    }`}
                            >
                                <span className="text-lg">{country.flag}</span>
                                <span className="text-sm font-medium">{country.name}</span>
                            </button>
                        ))}
                    </div>
                </div>
            </div>

            {/* City Cards - Horizontal Scroll */}
            <div className="bg-white pt-6">
                <div className="">
                    <div className="flex gap-4 overflow-x-auto pb-4 scrollbar-hide">
                        {cities.map((city) => (
                            <div
                                key={city.name}
                                className="relative flex-shrink-0 w-40 h-28 rounded-xl overflow-hidden cursor-pointer group"
                            >
                                <Image
                                    src={city.image}
                                    alt={city.name}
                                    fill
                                    className="object-cover group-hover:scale-110 transition-transform duration-300"
                                />
                                <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />
                                <div className="absolute bottom-0 left-0 right-0 p-3">
                                    <h3 className="text-white font-semibold text-sm">{city.name}</h3>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>

            {/* Search Bar */}
            <div className="bg-white py-6">
                <div className="">
                    <div className="flex flex-col md:flex-row gap-3">
                        <div className="flex-1 relative">
                            <Search className="absolute left-3 top-[45%] -translate-y-1/2 w-4 h-4 text-gray-600" />
                            <input
                                type="text"
                                placeholder="Search by Name"
                                className="w-full pl-10 pr-4 py-2.5 border border-gray-200 rounded-lg focus:outline-none focus:border-[#ff6b35] focus:ring-2 focus:ring-orange-100"
                            />
                        </div>
                        <select className="px-4 py-2.5 border border-gray-200 rounded-lg bg-white focus:outline-none focus:border-[#ff6b35] focus:ring-2 focus:ring-orange-100 min-w-[200px]">
                            {cityList.map(city => (
                                <option key={city}>{city}</option>
                            ))}
                        </select>
                        <div className="flex gap-2">
                            <button
                                onClick={() => setViewMode('grid')}
                                className={`p-2.5 px-3 border rounded-lg transition ${viewMode === 'grid'
                                    ? 'border-[#ff6b35] bg-orange-50 text-[#ff6b35]'
                                    : 'border-gray-200 hover:border-gray-300'
                                    }`}
                            >
                                <Grid className="w-5 h-5" />
                            </button>
                            <button
                                onClick={() => setViewMode('list')}
                                className={`p-2.5 px-3 border rounded-lg transition ${viewMode === 'list'
                                    ? 'border-[#ff6b35] bg-orange-50 text-[#ff6b35]'
                                    : 'border-gray-200 hover:border-gray-300'
                                    }`}
                            >
                                <List className="w-5 h-5" />
                            </button>
                            <button className="bg-[#ff6b35] text-white px-6 py-2.5 rounded-lg hover:bg-[#e55a2b] transition font-medium flex items-center gap-2">
                                <Search className="w-4 h-4" />
                                Search
                            </button>
                        </div>
                    </div>
                </div>
            </div>

            {/* Results Count */}
            <div className="">
                <p className="text-gray-500 text-sm">
                    Showing <span className="font-semibold text-gray-700">{accommodations.length}</span> properties
                </p>
            </div>

            {/* Property Grid */}
            <div className=" py-6 pb-12">
                <div className={`grid gap-6 ${viewMode === 'grid'
                    ? 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4'
                    : 'grid-cols-1'
                    }`}>
                    {accommodations.map((item) => (
                        <div
                            key={item.id}
                            className={`bg-white rounded-xl overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300 border border-gray-100 group ${viewMode === 'list' ? 'flex' : ''
                                }`}
                        >
                            {/* Image Container */}
                            <div className={`relative bg-gray-200 ${viewMode === 'list' ? 'w-72' : 'h-42'}`}>
                                <Image
                                    src={item.image}
                                    alt={item.name}
                                    fill
                                    className="object-cover group-hover:scale-105 transition-transform duration-300"
                                    sizes={viewMode === 'list' ? "288px" : "(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"}
                                />
                            </div>

                            {/* Content */}
                            <div className={`p-4 ${viewMode === 'list' ? 'flex-1 flex flex-col justify-between' : ''}`}>
                                <div>
                                    <h3 className="font-bold text-gray-900 text-lg mb-1">{item.name}</h3>
                                    <p className="text-sm text-gray-500 mb-3 flex items-center gap-1">
                                        <MapPin className="w-3.5 h-3.5" />
                                        {item.city}, {item.country}
                                    </p>

                                    {viewMode === 'grid' && (
                                        <div className="flex flex-wrap gap-1.5 mb-4">
                                            {item.amenities.slice(0, 2).map((amenity, idx) => (
                                                <span key={idx} className="text-xs bg-gray-100 text-gray-600 px-2 py-1 rounded">
                                                    {amenity}
                                                </span>
                                            ))}
                                        </div>
                                    )}
                                </div>

                                <div className="flex items-center justify-between mt-4">
                                    <div>
                                        <span className="text-2xl font-bold text-gray-900">{item.currency}{item.price}</span>
                                        <span className="text-gray-500 text-sm">/week</span>
                                    </div>
                                    <button className="bg-[#ff6b35] text-white px-5 py-2.5 rounded-lg text-sm font-semibold hover:bg-[#e55a2b] transition shadow-sm hover:shadow-md">
                                        Enquire Now
                                    </button>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>

                {/* Load More */}
                <div className="flex justify-center mt-12">
                    <button className="border-2 border-gray-300 text-gray-600 px-8 py-3 rounded-lg hover:border-[#ff6b35] hover:text-[#ff6b35] transition font-medium">
                        Load More Properties
                    </button>
                </div>
            </div>
        </div>
    );
}