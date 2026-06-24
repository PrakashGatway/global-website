'use client';

import { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import Image from 'next/image';
import Link from 'next/link';
import { 
  FaStar, FaRegStar, FaMapMarkerAlt, FaWifi, FaUtensils, 
  FaDumbbell, FaSpa, FaConciergeBell, FaParking, FaSnowflake, 
  FaTv, FaClock, FaPhone, FaEnvelope, FaGlobe, FaBed, 
  FaBath, FaHome, FaCar, FaCheckCircle, FaShieldAlt, 
  FaUsers, FaBuilding, FaRegClock, FaArrowRight, FaHeart, 
  FaShare, FaBookmark, FaRegHeart, FaRegBookmark, FaChevronLeft, 
  FaChevronRight, FaExpand, FaWhatsapp, FaInstagram, FaFacebook
} from 'react-icons/fa';
import { MdAccessTime, MdPeople, MdKingBed, MdAttachMoney, MdLocalLaundryService, MdGarage } from 'react-icons/md';
import { GiBookshelf, GiKickScooter } from 'react-icons/gi';
import axios from 'axios';
import { toast } from 'react-hot-toast';

// Types
interface Hotel {
  _id: string;
  name: string;
  code: string;
  description: string;
  starRating: number;
  pricePerNight: number;
  currency: string;
  status: string;
  isFeatured: boolean;
  isPopular: boolean;
  thumbnail: string;
  images: string[];
  address: {
    street: string;
    area: string;
    landmark: string;
    pincode: string;
    latitude: number;
    longitude: number;
  };
  amenities: string[];
  roomTypes: Array<{
    name: string;
    capacity: number;
    price: number;
    quantity: number;
    description: string;
  }>;
  rating: {
    average: number;
    count: number;
  };
  checkInTime: string;
  checkOutTime: string;
  contactInfo: {
    phone: string;
    email: string;
    website: string;
  };
  countryId: {
    _id: string;
    name: string;
    code: string;
    currency: string;
  };
  cityId: {
    _id: string;
    name: string;
    code: string;
  };
  reviews: Array<{
    user: string;
    rating: number;
    comment: string;
    date: string;
  }>;
  createdAt: string;
  updatedAt: string;
}

// Property Features Interface
interface PropertyFeature {
  icon: any;
  label: string;
  value: string | number;
}

// Amenity icons mapping
const amenityIcons: { [key: string]: any } = {
  'WiFi': FaWifi,
  'Pool': FaConciergeBell,
  'Spa': FaSpa,
  'Gym': FaDumbbell,
  'Restaurant': FaUtensils,
  'Bar': FaUtensils,
  'Parking': FaParking,
  'Room Service': FaConciergeBell,
  'Air Conditioning': FaSnowflake,
  'TV': FaTv,
  '24/7 Front Desk': FaClock,
};

// Axios instance
const apiClient = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api',
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
});

export default function HotelDetailsPage() {
  const params = useParams();
  const id = params?.id as string;
  
  const [hotel, setHotel] = useState<Hotel | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedImage, setSelectedImage] = useState(0);
  const [selectedRoom, setSelectedRoom] = useState<number | null>(null);
  const [isLiked, setIsLiked] = useState(false);
  const [isSaved, setIsSaved] = useState(false);
  const [showAllReviews, setShowAllReviews] = useState(false);
  const [showMap, setShowMap] = useState(false);
  const [activeImageIndex, setActiveImageIndex] = useState(0);

  useEffect(() => {
    if (id) {
      fetchHotelDetails();
    }
  }, [id]);

  const fetchHotelDetails = async () => {
    try {
      setLoading(true);
      setError(null);
      
      const response = await apiClient.get(`/accommodation/hotels/${id}`);
      
      if (response.data.success) {
        setHotel(response.data.data);
        if (response.data.data.roomTypes.length > 0) {
          setSelectedRoom(0);
        }
      } else {
        setError('Failed to fetch hotel details');
        toast.error('Failed to load hotel details');
      }
    } catch (err: any) {
      console.error('Error fetching hotel:', err);
      setError(err.response?.data?.message || 'Failed to load hotel details');
      toast.error('Failed to load hotel details');
    } finally {
      setLoading(false);
    }
  };

  const renderStars = (rating: number) => {
    const fullStars = Math.floor(rating);
    const hasHalfStar = rating % 1 >= 0.5;
    const emptyStars = 5 - fullStars - (hasHalfStar ? 1 : 0);
    
    return (
      <div className="flex items-center gap-1">
        {[...Array(fullStars)].map((_, i) => (
          <FaStar key={`full-${i}`} className="text-yellow-400" />
        ))}
        {hasHalfStar && <FaStar className="text-yellow-400" />}
        {[...Array(emptyStars)].map((_, i) => (
          <FaRegStar key={`empty-${i}`} className="text-yellow-400" />
        ))}
      </div>
    );
  };

  // Generate property features based on hotel data
  const getPropertyFeatures = (): PropertyFeature[] => {
    const features: PropertyFeature[] = [];
    
    if (hotel?.roomTypes) {
      features.push({
        icon: FaBed,
        label: 'Bedrooms',
        value: hotel.roomTypes.reduce((acc, room) => acc + room.quantity, 0)
      });
    }
    
    features.push(
      { icon: FaBath, label: 'Bathrooms', value: 2 },
      { icon: GiKickScooter, label: 'Kitchen', value: 1 },
      { icon: GiBookshelf, label: 'Study', value: 1 },
      { icon: FaHome, label: 'Family Room', value: 1 },
      { icon: FaDumbbell, label: 'Gym', value: 1 },
      { icon: MdLocalLaundryService, label: 'Laundry', value: 1 },
      { icon: MdGarage, label: 'Garage', value: 1 },
      { icon: FaCar, label: 'Parking', value: 1 }
    );
    
    return features;
  };

  // Navigation for images
  const nextImage = () => {
    if (allImages.length > 0) {
      setActiveImageIndex((prev) => (prev + 1) % allImages.length);
    }
  };

  const prevImage = () => {
    if (allImages.length > 0) {
      setActiveImageIndex((prev) => (prev - 1 + allImages.length) % allImages.length);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin h-16 w-16 border-t-2 border-b-2 border-orange-600 mx-auto mb-4"></div>
          <p className="text-gray-600 text-lg">Loading property details...</p>
        </div>
      </div>
    );
  }

  if (error || !hotel) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center bg-white p-12 max-w-md shadow-xl">
          <div className="text-6xl mb-4">🏨</div>
          <h2 className="text-2xl font-bold text-gray-800 mb-2">Property Not Found</h2>
          <p className="text-gray-600 mb-6">{error || 'The property you are looking for does not exist.'}</p>
          <Link
            href="/accommodation/hotels"
            className="inline-block bg-orange-600 text-white px-8 py-3 hover:bg-orange-700 transition-colors"
          >
            Back to Properties
          </Link>
        </div>
      </div>
    );
  }

  const allImages = [hotel.thumbnail, ...hotel.images].filter(Boolean);
  const propertyFeatures = getPropertyFeatures();
  const displayedReviews = showAllReviews ? hotel.reviews : hotel.reviews.slice(0, 3);

  return (
    <div className="min-h-screen bg-gray-50">
      {/* ====== HERO SECTION ====== */}
      <div className="relative bg-gradient-to-r from-gray-900 to-gray-700 text-white">
        {/* Background Image with Overlay */}
        <div className="absolute inset-0">
          <Image
            src={allImages[activeImageIndex] || '/placeholder-hotel.jpg'}
            alt={hotel.name}
            fill
            className="object-cover opacity-40"
            priority
          />
          <div className="absolute inset-0 bg-gradient-to-b from-black/60 via-black/40 to-black/70"></div>
        </div>

        {/* Navigation Arrows */}
        {allImages.length > 1 && (
          <>
            <button
              onClick={prevImage}
              className="absolute left-4 top-1/2 -translate-y-1/2 z-10 bg-black/30 hover:bg-black/50 text-white p-3 rounded-full backdrop-blur-sm transition-all hover:scale-110"
            >
              <FaChevronLeft className="text-xl" />
            </button>
            <button
              onClick={nextImage}
              className="absolute right-4 top-1/2 -translate-y-1/2 z-10 bg-black/30 hover:bg-black/50 text-white p-3 rounded-full backdrop-blur-sm transition-all hover:scale-110"
            >
              <FaChevronRight className="text-xl" />
            </button>
          </>
        )}

        {/* Image Counter */}
        {allImages.length > 1 && (
          <div className="absolute bottom-4 left-1/2 -translate-x-1/2 z-10 bg-black/50 backdrop-blur-sm px-4 py-1.5 rounded-full text-sm">
            {activeImageIndex + 1} / {allImages.length}
          </div>
        )}

        {/* Content */}
        <div className="relative z-8 container mx-auto px-4 sm:px-12 lg:px-16 py-24 md:py-32">
          <div className="max-w-4xl">
            {/* Badges */}
            <div className="flex flex-wrap gap-2 mb-4">
              {hotel.isFeatured && (
                <span className="bg-yellow-500 text-black text-xs font-semibold px-3 py-1 rounded-full flex items-center gap-1">
                  ⭐ Featured
                </span>
              )}
              {hotel.isPopular && (
                <span className="bg-red-500 text-white text-xs font-semibold px-3 py-1 rounded-full flex items-center gap-1">
                  🔥 Popular
                </span>
              )}
              <span className="bg-green-500 text-white text-xs font-semibold px-3 py-1 rounded-full">
                {hotel.status}
              </span>
            </div>

            {/* Title */}
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-4 leading-tight">
              {hotel.name}
            </h1>

            {/* Location */}
            <div className="flex items-center gap-2 text-gray-300 mb-4">
              <FaMapMarkerAlt className="text-orange-400" />
              <span>{hotel.address.area}, {hotel.cityId.name}, {hotel.countryId.name}</span>
            </div>

            {/* Rating & Stars */}
            <div className="flex flex-wrap items-center gap-4 mb-6">
              <div className="flex items-center gap-2">
                {renderStars(hotel.starRating)}
                <span className="text-sm text-gray-300">({hotel.starRating} Star)</span>
              </div>
              {hotel.rating.count > 0 && (
                <>
                  <span className="w-px h-6 bg-gray-600"></span>
                  <div className="flex items-center gap-2">
                    <span className="text-2xl font-bold text-orange-400">{hotel.rating.average.toFixed(1)}</span>
                    <span className="text-gray-400 text-sm">/ 5.0</span>
                    <span className="text-gray-400 text-sm">({hotel.rating.count} reviews)</span>
                  </div>
                </>
              )}
            </div>

            {/* Action Buttons */}
            <div className="flex flex-wrap gap-3">
              <button className="bg-orange-500 hover:bg-orange-600 text-white px-8 py-3 rounded-lg font-semibold transition-all hover:scale-105 flex items-center gap-2">
                <FaCheckCircle /> Book Now
              </button>
              <button className="bg-white/10 hover:bg-white/20 backdrop-blur-sm text-white px-6 py-3 rounded-lg font-semibold transition-all flex items-center gap-2">
                <FaHeart className={isLiked ? 'text-red-500' : ''} /> {isLiked ? 'Liked' : 'Like'}
              </button>
              <button className="bg-white/10 hover:bg-white/20 backdrop-blur-sm text-white px-6 py-3 rounded-lg font-semibold transition-all flex items-center gap-2">
                <FaShare /> Share
              </button>
            </div>

            {/* Quick Info */}
            <div className="mt-6 flex flex-wrap items-center gap-6 text-sm text-gray-300">
              <div className="flex items-center gap-2">
                <FaRegClock className="text-orange-400" />
                <span>Check-in: <span className="text-white font-medium">{hotel.checkInTime}</span></span>
              </div>
              <div className="flex items-center gap-2">
                <FaRegClock className="text-orange-400" />
                <span>Check-out: <span className="text-white font-medium">{hotel.checkOutTime}</span></span>
              </div>
              <div className="flex items-center gap-2">
                <MdPeople className="text-orange-400" />
                <span>Max Guests: <span className="text-white font-medium">{Math.max(...hotel.roomTypes.map(r => r.capacity))}</span></span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* ====== MAIN CONTENT ====== */}
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left Column - Main Content */}
          <div className="lg:col-span-2 space-y-8">
            {/* Quick Info Bar */}
            <div className="bg-white shadow-sm p-4 flex flex-wrap items-center justify-between gap-4 rounded-lg">
              <div className="flex items-center gap-6">
                <div className="flex items-center gap-2 text-sm">
                  <FaRegClock className="text-orange-500" />
                  <span className="text-gray-600">Check-in: <span className="font-medium text-gray-900">{hotel.checkInTime}</span></span>
                </div>
                <div className="flex items-center gap-2 text-sm">
                  <FaRegClock className="text-orange-500" />
                  <span className="text-gray-600">Check-out: <span className="font-medium text-gray-900">{hotel.checkOutTime}</span></span>
                </div>
              </div>
              <div className="flex items-center gap-4 text-sm">
                <span className="text-gray-600">📍 {hotel.address.landmark}</span>
              </div>
            </div>

            {/* About the Property */}
            <div className="bg-white p-8 shadow-sm rounded-lg">
              <h2 className="text-2xl font-bold text-gray-900 mb-4 flex items-center gap-3">
                <span className="w-1 h-8 bg-orange-500"></span>
                About the Property
              </h2>
              <p className="text-gray-700 leading-relaxed text-base">{hotel.description}</p>
              
              {/* Location Details */}
              <div className="mt-6 p-4 bg-gray-50 rounded-lg">
                <h4 className="font-semibold text-gray-900 mb-2">📍 Where is {hotel.name} located?</h4>
                <p className="text-gray-700 text-sm leading-relaxed">
                  {hotel.name} is located in the heart of {hotel.cityId.name}, just a few minutes walk from the city centre. 
                  The property is within walking distance of the city centre, making it easy to explore the area. 
                  The property is also close to the {hotel.address.landmark}, providing easy access to the city's landmarks.
                </p>
              </div>
            </div>

            {/* Why Choose This Property */}
            <div className="bg-white p-8 shadow-sm rounded-lg">
              <h3 className="text-2xl font-bold text-gray-900 mb-6 flex items-center gap-3">
                <span className="w-1 h-8 bg-orange-500"></span>
                Why is {hotel.name} a great choice?
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {[
                  { icon: FaCheckCircle, text: 'Convenient location' },
                  { icon: FaCheckCircle, text: 'Close proximity to city centre' },
                  { icon: FaCheckCircle, text: 'Various amenities and facilities' },
                  { icon: FaCheckCircle, text: 'Well-maintained property' },
                  { icon: FaCheckCircle, text: 'Comfortable and modern living space' },
                  { icon: FaCheckCircle, text: 'Easy access to transport links' },
                ].map((item, index) => (
                  <div key={index} className="flex items-center gap-3 p-3 bg-gray-50 hover:bg-orange-50 transition-colors rounded-lg">
                    <div className="w-6 h-6 bg-orange-100 flex items-center justify-center flex-shrink-0 rounded-full">
                      <item.icon className="text-orange-500 text-sm" />
                    </div>
                    <span className="text-gray-700 text-sm">{item.text}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* ====== MAP SECTION ====== */}
            <div className="bg-white p-6 shadow-sm rounded-lg">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-bold text-gray-900 flex items-center gap-2">
                  <FaMapMarkerAlt className="text-orange-500" /> Location
                </h3>
                <button 
                  onClick={() => setShowMap(!showMap)}
                  className="text-orange-500 hover:text-orange-600 text-sm font-medium flex items-center gap-1"
                >
                  {showMap ? 'Hide Map' : 'View Map'} <FaExpand className="text-xs" />
                </button>
              </div>

              {/* Map Container */}
              <div className={`overflow-hidden transition-all duration-500 ${showMap ? 'h-[24rem]' : 'h-[20rem]'}`}>
                <div className="w-full h-full bg-gray-200 relative rounded-lg">
                  <iframe
                    src={`https://www.google.com/maps/embed?pb=!1m14!1m12!1m3!1d136!2d${hotel.address.longitude}!3d${hotel.address.latitude}!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!5e1!3m2!1sen!2sin!4v1781693269829!5m2!1sen!2sin`}
                    width="100%"
                    height="100%"
                    style={{ border: 0 }}
                    allowFullScreen
                    loading="lazy"
                    referrerPolicy="no-referrer-when-downgrade"
                    className="rounded-lg"
                  ></iframe>
                </div>
              </div>

              {/* Address Details */}
              <div className="mt-4 space-y-1">
                <p className="text-sm text-gray-800 font-medium">{hotel.address.street}</p>
                <p className="text-sm text-gray-600">{hotel.address.area}, {hotel.cityId.name}</p>
                <p className="text-sm text-gray-600">{hotel.countryId.name} - {hotel.address.pincode}</p>
                <p className="text-xs text-gray-500 mt-1 flex items-center gap-1">
                  <FaMapMarkerAlt className="text-orange-500" /> {hotel.address.landmark}
                </p>
                
                {/* Directions Button */}
                <a
                  href={`https://www.google.com/maps/dir/?api=1&destination=${hotel.address.latitude},${hotel.address.longitude}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="mt-3 inline-block w-full text-center bg-orange-50 hover:bg-orange-100 text-orange-600 font-medium py-2 rounded-lg transition-colors text-sm"
                >
                  Get Directions
                </a>
              </div>
            </div>

            {/* Room Types */}
            <div className="bg-white p-8 shadow-sm rounded-lg">
              <div className="flex items-center justify-between mb-6">
                <div className="flex items-center gap-3">
                  <span className="w-1 h-8 bg-orange-500"></span>
                  <h2 className="text-2xl font-bold text-gray-900">Room Types</h2>
                </div>
                <span className="bg-orange-100 text-orange-600 px-4 py-1.5 text-sm font-semibold rounded-full">
                  {hotel.roomTypes.length} Available
                </span>
              </div>
              
              <div className="space-y-4">
                {hotel.roomTypes.map((room, index) => (
                  <div
                    key={index}
                    className={`border-2 p-6 cursor-pointer transition-all rounded-lg ${
                      selectedRoom === index 
                        ? 'border-orange-500 bg-orange-50 shadow-md' 
                        : 'border-gray-200 hover:border-orange-300 hover:bg-gray-50'
                    }`}
                    onClick={() => setSelectedRoom(index)}
                  >
                    <div className="flex flex-wrap justify-between items-start gap-4">
                      <div className="flex-1">
                        <div className="flex items-center gap-4">
                          <div className={`p-3 rounded-lg ${selectedRoom === index ? 'bg-orange-500' : 'bg-orange-100'}`}>
                            <MdKingBed className={`text-2xl ${selectedRoom === index ? 'text-white' : 'text-orange-600'}`} />
                          </div>
                          <div>
                            <h3 className="text-xl font-bold text-gray-900">{room.name}</h3>
                            <div className="flex flex-wrap items-center gap-3 mt-1 text-sm">
                              <span className="flex items-center gap-1 text-gray-600">
                                <MdPeople className="text-orange-500" />
                                {room.capacity} Guests
                              </span>
                              <span className="w-px h-4 bg-gray-300 hidden sm:block"></span>
                              <span className="flex items-center gap-1 text-gray-600">
                                <FaBed className="text-orange-500" />
                                {room.quantity} Available
                              </span>
                            </div>
                          </div>
                        </div>
                        <p className="text-sm text-gray-600 mt-3 ml-16">{room.description}</p>
                      </div>
                      
                      <div className="text-right min-w-[140px]">
                        <div className="text-2xl font-bold text-orange-600">
                          {hotel.currency}{room.price}
                        </div>
                        <div className="text-xs text-gray-500 uppercase tracking-wider">Per Night</div>
                        <button 
                          className={`mt-3 px-8 py-2.5 text-sm font-medium transition-colors w-full rounded-lg ${
                            selectedRoom === index 
                              ? 'bg-orange-500 text-white hover:bg-orange-600' 
                              : 'bg-gray-200 text-gray-700 hover:bg-orange-500 hover:text-white'
                          }`}
                          onClick={(e) => {
                            e.stopPropagation();
                            setSelectedRoom(index);
                          }}
                        >
                          {selectedRoom === index ? '✓ Selected' : 'Select'}
                        </button>
                      </div>
                    </div>
                    
                    {/* Room Inclusions */}
                    <div className="mt-4 pt-4 border-t border-gray-200 flex flex-wrap gap-3">
                      <span className="text-xs bg-gray-100 px-3 py-1.5 text-gray-600 flex items-center gap-1.5 rounded-full">
                        <FaCheckCircle className="text-green-500" /> Free Cancellation
                      </span>
                      <span className="text-xs bg-gray-100 px-3 py-1.5 text-gray-600 flex items-center gap-1.5 rounded-full">
                        <FaCheckCircle className="text-green-500" /> Breakfast Included
                      </span>
                      <span className="text-xs bg-gray-100 px-3 py-1.5 text-gray-600 flex items-center gap-1.5 rounded-full">
                        <FaCheckCircle className="text-green-500" /> Free WiFi
                      </span>
                      <span className="text-xs bg-gray-100 px-3 py-1.5 text-gray-600 flex items-center gap-1.5 rounded-full">
                        <FaCheckCircle className="text-green-500" /> 24/7 Support
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Reviews */}
            <div className="bg-white p-8 shadow-sm rounded-lg">
              <div className="flex flex-wrap items-center justify-between gap-4 mb-6">
                <div className="flex items-center gap-3">
                  <span className="w-1 h-8 bg-orange-500"></span>
                  <h2 className="text-2xl font-bold text-gray-900">Guest Reviews</h2>
                </div>
                {hotel.rating.count > 0 && (
                  <div className="flex items-center gap-4 bg-gray-50 p-3 rounded-lg">
                    <div className="text-3xl font-bold text-orange-500">
                      {hotel.rating.average.toFixed(1)}
                    </div>
                    <div>
                      <div>{renderStars(hotel.rating.average)}</div>
                      <div className="text-sm text-gray-500">{hotel.rating.count} Reviews</div>
                    </div>
                  </div>
                )}
              </div>
              
              {hotel.reviews.length > 0 ? (
                <>
                  <div className="space-y-6">
                    {displayedReviews.map((review, index) => (
                      <div key={index} className="border-b border-gray-200 last:border-0 pb-6 last:pb-0">
                        <div className="flex items-start gap-4">
                          <div className="w-12 h-12 bg-orange-500 flex items-center justify-center text-white font-bold text-lg flex-shrink-0 rounded-full">
                            {review.user.charAt(0).toUpperCase()}
                          </div>
                          <div className="flex-1">
                            <div className="flex flex-wrap items-center justify-between gap-2 mb-2">
                              <div>
                                <div className="font-semibold text-gray-900">{review.user}</div>
                                <div className="text-xs text-gray-500">
                                  {new Date(review.date).toLocaleDateString('en-US', {
                                    year: 'numeric',
                                    month: 'long',
                                    day: 'numeric'
                                  })}
                                </div>
                              </div>
                              <div className="bg-orange-100 px-3 py-1 rounded-full">
                                <span className="font-bold text-orange-600">{review.rating}</span>
                                <span className="text-orange-400">/5</span>
                              </div>
                            </div>
                            <p className="text-gray-700 leading-relaxed text-sm">{review.comment}</p>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                  
                  {hotel.reviews.length > 3 && (
                    <button
                      onClick={() => setShowAllReviews(!showAllReviews)}
                      className="w-full mt-6 py-3 bg-gray-50 hover:bg-orange-50 text-orange-600 font-medium transition-colors rounded-lg flex items-center justify-center gap-2"
                    >
                      {showAllReviews ? 'Show Less' : `View All ${hotel.reviews.length} Reviews`}
                      <FaArrowRight className="text-sm" />
                    </button>
                  )}
                </>
              ) : (
                <div className="text-center py-8">
                  <div className="text-4xl mb-3">📝</div>
                  <p className="text-gray-500">No reviews yet. Be the first to review!</p>
                </div>
              )}
            </div>
          </div>

          {/* Right Column - Sidebar */}
          <div className="space-y-6">
            {/* Price & Booking Card */}
            <div className="bg-white p-6 shadow-sm rounded-lg">
              <div className="text-center">
                <div className="text-4xl font-bold text-orange-600">
                  {hotel.currency}{hotel.pricePerNight}
                </div>
                <div className="text-sm text-gray-500">per night</div>
                
                <div className="mt-4 pt-4 border-t border-gray-200 space-y-2">
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">Total Nights (3)</span>
                    <span className="font-medium text-gray-900">{hotel.currency}{hotel.pricePerNight * 3}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">Taxes & Fees</span>
                    <span className="font-medium text-gray-900">{hotel.currency}45</span>
                  </div>
                  <div className="flex justify-between text-base font-bold pt-2 border-t border-gray-200">
                    <span className="text-gray-900">Total</span>
                    <span className="text-orange-600">{hotel.currency}{(hotel.pricePerNight * 3) + 45}</span>
                  </div>
                </div>
                
                <button className="w-full mt-4 bg-orange-500 text-white py-4 font-bold text-lg hover:bg-orange-600 transition-colors rounded-lg">
                  Book Now
                </button>
                <p className="text-xs text-gray-500 mt-3 flex items-center justify-center gap-2">
                  <FaShieldAlt className="text-green-500" /> No booking fees • Free cancellation
                </p>
              </div>
            </div>

            {/* Property Details */}
            <div className="bg-white p-6 shadow-sm rounded-lg">
              <h3 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2">
                <FaBuilding className="text-orange-500" /> Property Details
              </h3>
              <div className="space-y-3">
                <div className="flex justify-between text-sm py-2 border-b border-gray-100">
                  <span className="text-gray-600">Check-in</span>
                  <span className="font-medium text-gray-900">{hotel.checkInTime}</span>
                </div>
                <div className="flex justify-between text-sm py-2 border-b border-gray-100">
                  <span className="text-gray-600">Check-out</span>
                  <span className="font-medium text-gray-900">{hotel.checkOutTime}</span>
                </div>
                <div className="flex justify-between text-sm py-2 border-b border-gray-100">
                  <span className="text-gray-600">Status</span>
                  <span className="font-medium text-green-600">{hotel.status}</span>
                </div>
                <div className="flex justify-between text-sm py-2 border-b border-gray-100">
                  <span className="text-gray-600">Property Code</span>
                  <span className="font-medium text-gray-900">{hotel.code}</span>
                </div>
                <div className="flex justify-between text-sm py-2">
                  <span className="text-gray-600">Star Rating</span>
                  <span className="font-medium text-gray-900">{hotel.starRating} ⭐</span>
                </div>
              </div>
            </div>

            {/* Contact Info */}
            <div className="bg-white p-6 shadow-sm rounded-lg">
              <h3 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2">
                <FaPhone className="text-orange-500" /> Contact
              </h3>
              <div className="space-y-3">
                {hotel.contactInfo.phone && (
                  <div className="flex items-center gap-3 p-3 bg-gray-50 hover:bg-orange-50 transition-colors rounded-lg group">
                    <div className="w-8 h-8 bg-orange-100 group-hover:bg-orange-200 transition-colors flex items-center justify-center rounded-lg">
                      <FaPhone className="text-orange-500 text-sm" />
                    </div>
                    <a href={`tel:${hotel.contactInfo.phone}`} className="text-sm text-gray-700 hover:text-orange-600">
                      {hotel.contactInfo.phone}
                    </a>
                  </div>
                )}
                {hotel.contactInfo.email && (
                  <div className="flex items-center gap-3 p-3 bg-gray-50 hover:bg-orange-50 transition-colors rounded-lg group">
                    <div className="w-8 h-8 bg-orange-100 group-hover:bg-orange-200 transition-colors flex items-center justify-center rounded-lg">
                      <FaEnvelope className="text-orange-500 text-sm" />
                    </div>
                    <a href={`mailto:${hotel.contactInfo.email}`} className="text-sm text-gray-700 hover:text-orange-600 truncate">
                      {hotel.contactInfo.email}
                    </a>
                  </div>
                )}
                {hotel.contactInfo.website && (
                  <div className="flex items-center gap-3 p-3 bg-gray-50 hover:bg-orange-50 transition-colors rounded-lg group">
                    <div className="w-8 h-8 bg-orange-100 group-hover:bg-orange-200 transition-colors flex items-center justify-center rounded-lg">
                      <FaGlobe className="text-orange-500 text-sm" />
                    </div>
                    <a href={hotel.contactInfo.website} target="_blank" rel="noopener noreferrer" className="text-sm text-gray-700 hover:text-orange-600">
                      Visit Website
                    </a>
                  </div>
                )}
              </div>
            </div>

          

            {/* Property Features */}
            <div className="bg-white p-8 shadow-sm rounded-lg">
              <h3 className="text-2xl font-bold text-gray-900 mb-6 flex items-center gap-3">
                <span className="w-1 h-8 bg-orange-500"></span>
                Property Features
              </h3>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                {propertyFeatures.map((feature, index) => (
                  <div key={index} className="flex items-center flex-col py-1 gap-3 bg-gray-50 hover:bg-orange-50 transition-colors rounded-lg group">
                    
                      <div className="text-xs text-gray-500 uppercase tracking-wider">{feature.label}</div>
                    <div className='flex gap-4 items-center justify-start'>
                      <div className="w-10 h-10 bg-orange-100 group-hover:bg-orange-200 transition-colors flex items-center justify-center rounded-lg">
                      <feature.icon className="text-orange-500 text-lg" />
                    </div>
                      <div className="font-bold text-gray-900 text-lg">{feature.value}</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Amenities */}
            <div className="bg-white p-8 shadow-sm rounded-lg">
              <h3 className="text-2xl font-bold text-gray-900 mb-6 flex items-center gap-3">
                <span className="w-1 h-8 bg-orange-500"></span>
                Amenities & Services
              </h3>
              <div className="grid grid-cols-2 md:grid-cols-2 gap-3">
                {hotel.amenities.map((amenity, index) => {
                  const Icon = amenityIcons[amenity] || FaConciergeBell;
                  return (
                    <div
                      key={index}
                      className="flex items-center gap-3 p-3 bg-gray-50 hover:bg-orange-50 transition-colors rounded-lg group"
                    >
                      <div className="w-8 h-8 bg-orange-100 group-hover:bg-orange-200 transition-colors flex items-center justify-center rounded-lg">
                        <Icon className="text-orange-600 text-sm" />
                      </div>
                      <span className="text-sm font-medium text-gray-700 group-hover:text-orange-600 transition-colors">
                        {amenity}
                      </span>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Trust Badges */}
            <div className="bg-white p-6 shadow-sm rounded-lg">
              <div className="grid grid-cols-2 gap-3">
                <div className="text-center p-3 bg-gray-50 rounded-lg">
                  <FaShieldAlt className="text-orange-500 text-2xl mx-auto mb-1" />
                  <div className="text-xs font-medium text-gray-700">Best Price</div>
                  <div className="text-xs text-gray-500">Guarantee</div>
                </div>
                <div className="text-center p-3 bg-gray-50 rounded-lg">
                  <FaCheckCircle className="text-orange-500 text-2xl mx-auto mb-1" />
                  <div className="text-xs font-medium text-gray-700">Free</div>
                  <div className="text-xs text-gray-500">Cancellation</div>
                </div>
                <div className="text-center p-3 bg-gray-50 rounded-lg">
                  <FaUsers className="text-orange-500 text-2xl mx-auto mb-1" />
                  <div className="text-xs font-medium text-gray-700">Trusted by</div>
                  <div className="text-xs text-gray-500">1000+ Guests</div>
                </div>
                <div className="text-center p-3 bg-gray-50 rounded-lg">
                  <FaRegClock className="text-orange-500 text-2xl mx-auto mb-1" />
                  <div className="text-xs font-medium text-gray-700">24/7</div>
                  <div className="text-xs text-gray-500">Support</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}