// app/accommodation/page.js
'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import {
  Search, Filter, Eye, Edit3, Download, ChevronDown, ChevronUp,
  User, FileText, Calendar, Building2, Globe, Briefcase, Clock,
  CreditCard, CheckCircle, AlertCircle, Clock as ClockIcon,
  MapPin, Phone, Mail, MessageCircle, Shield, Award, BookOpen,
  HelpCircle, X, Check, AlertTriangle, FileCheck, GraduationCap,
  TrendingUp, Users, CheckSquare, FileSignature, Home, ArrowRight,
  ExternalLink, MoreVertical, RefreshCw, Plus, Hotel ,
  Bed, Bath, Wifi, Car, Utensils, Dumbbell, Sparkles, Image as ImageIcon,
  DollarSign, Star, Map, Navigation, Phone as PhoneIcon, Mail as MailIcon,
  Globe as GlobeIcon, Check as CheckIcon, AlertCircle as AlertCircleIcon
} from 'lucide-react';
import Link from 'next/link';
import axiosInstance from '@/app/axiosInstance';
import toast from 'react-hot-toast';

export default function AccommodationManagementPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('hotels'); // 'hotels' or 'cities'
  const [showAddModal, setShowAddModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [selectedItem, setSelectedItem] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [featuredFilter, setFeaturedFilter] = useState('all');
  const [countryFilter, setCountryFilter] = useState('all');
  
  // Data states
  const [hotels, setHotels] = useState([]);
  const [cities, setCities] = useState([]);
  const [countries, setCountries] = useState([]);
  const [filteredHotels, setFilteredHotels] = useState([]);
  const [filteredCities, setFilteredCities] = useState([]);
  
  // Form states
  const [formData, setFormData] = useState({
    // Hotel fields
    name: '',
    countryId: '',
    cityId: '',
    address: {
      street: '',
      area: '',
      landmark: '',
      pincode: '',
      latitude: '',
      longitude: ''
    },
    code: '',
    description: '',
    starRating: 3,
    pricePerNight: 0,
    currency: '',
    amenities: [],
    roomTypes: [
      {
        name: '',
        capacity: 1,
        price: 0,
        quantity: 1,
        description: ''
      }
    ],
    images: [],
    thumbnail: '',
    status: 'Active',
    isFeatured: false,
    isPopular: 'No',
    checkInTime: '2:00 PM',
    checkOutTime: '12:00 PM',
    contactInfo: {
      phone: '',
      email: '',
      website: ''
    },
    // City fields
    cityName: '',
    cityCode: '',
    cityStatus: 'Active',
    cityIsFeatured: false,
    cityImage: '',
    cityDescription: ''
  });

  const [amenitiesList] = useState([
    'WiFi', 'Pool', 'Spa', 'Gym', 'Restaurant', 'Bar', 'Parking',
    'Room Service', 'Air Conditioning', 'TV', 'Kitchen', 'Pet Friendly',
    'Business Center', 'Conference Room', 'Airport Shuttle', 'Laundry',
    '24/7 Front Desk', 'Elevator'
  ]);

  const statusOptions = ['Active', 'Inactive', 'Under Maintenance'];

  useEffect(() => {
    fetchData();
  }, []);

  useEffect(() => {
    filterData();
  }, [hotels, cities, searchTerm, statusFilter, featuredFilter, countryFilter]);

  const fetchData = async () => {
    try {
      setLoading(true);
      const [hotelsRes, citiesRes, countriesRes] = await Promise.all([
        axiosInstance.get('/accommodation/hotels'),
        axiosInstance.get('/accommodation/cities'),
        axiosInstance.get('/accommodation/countries?limit=30')
      ]);

      if (hotelsRes.data.success) setHotels(hotelsRes.data.data || []);
      if (citiesRes.data.success) setCities(citiesRes.data.data || []);
      if (countriesRes.data.success) setCountries(countriesRes.data.data || []);
    } catch (error) {
      console.error('Error fetching data:', error);
      toast.error('Failed to load data');
    } finally {
      setLoading(false);
    }
  };

  const filterData = () => {
    // Filter Hotels
    let filteredHotelsData = [...hotels];
    if (searchTerm) {
      filteredHotelsData = filteredHotelsData.filter(h => 
        h.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        h.code?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        h.cityId?.name?.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }
    if (statusFilter !== 'all') {
      filteredHotelsData = filteredHotelsData.filter(h => h.status === statusFilter);
    }
    if (featuredFilter !== 'all') {
      filteredHotelsData = filteredHotelsData.filter(h => h.isFeatured === featuredFilter);
    }
    if (countryFilter !== 'all') {
      filteredHotelsData = filteredHotelsData.filter(h => h.countryId?._id === countryFilter);
    }
    setFilteredHotels(filteredHotelsData);

    // Filter Cities
    let filteredCitiesData = [...cities];
    if (searchTerm) {
      filteredCitiesData = filteredCitiesData.filter(c => 
        c.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        c.code?.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }
    if (statusFilter !== 'all') {
      filteredCitiesData = filteredCitiesData.filter(c => c.status === statusFilter);
    }
    if (featuredFilter !== 'all') {
      filteredCitiesData = filteredCitiesData.filter(c => c.isFeatured === featuredFilter);
    }
    if (countryFilter !== 'all') {
      filteredCitiesData = filteredCitiesData.filter(c => c.countryId?._id === countryFilter);
    }
    setFilteredCities(filteredCitiesData);
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    if (name.includes('.')) {
      const [parent, child] = name.split('.');
      setFormData(prev => ({
        ...prev,
        [parent]: {
          ...prev[parent],
          [child]: value
        }
      }));
    } else {
      setFormData(prev => ({ ...prev, [name]: value }));
    }
  };

  const handleAddressChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      address: {
        ...prev.address,
        [name]: value
      }
    }));
  };

  const handleContactChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      contactInfo: {
        ...prev.contactInfo,
        [name]: value
      }
    }));
  };

  const handleAmenitiesChange = (amenity) => {
    setFormData(prev => {
      const current = prev.amenities || [];
      if (current.includes(amenity)) {
        return { ...prev, amenities: current.filter(a => a !== amenity) };
      } else {
        return { ...prev, amenities: [...current, amenity] };
      }
    });
  };

  const handleRoomTypeChange = (index, field, value) => {
    setFormData(prev => {
      const roomTypes = [...prev.roomTypes];
      roomTypes[index] = { ...roomTypes[index], [field]: value };
      return { ...prev, roomTypes };
    });
  };

  const addRoomType = () => {
    setFormData(prev => ({
      ...prev,
      roomTypes: [
        ...prev.roomTypes,
        { name: '', capacity: 1, price: 0, quantity: 1, description: '' }
      ]
    }));
  };

  const removeRoomType = (index) => {
    setFormData(prev => ({
      ...prev,
      roomTypes: prev.roomTypes.filter((_, i) => i !== index)
    }));
  };

  const handleImageChange = (e) => {
    const files = Array.from(e.target.files);
    // In a real app, you would upload these files to a server
    // For now, we'll just store the file names
    setFormData(prev => ({
      ...prev,
      images: files.map(f => f.name)
    }));
  };

  const resetForm = () => {
    setFormData({
      name: '',
      countryId: '',
      cityId: '',
      address: {
        street: '',
        area: '',
        landmark: '',
        pincode: '',
        latitude: '',
        longitude: ''
      },
      code: '',
      description: '',
      starRating: 3,
      pricePerNight: 0,
      currency: '',
      amenities: [],
      roomTypes: [
        { name: '', capacity: 1, price: 0, quantity: 1, description: '' }
      ],
      images: [],
      thumbnail: '',
      status: 'Active',
      isFeatured: false,
      isPopular: 'No',
      checkInTime: '2:00 PM',
      checkOutTime: '12:00 PM',
      contactInfo: {
        phone: '',
        email: '',
        website: ''
      },
      cityName: '',
      cityCode: '',
      cityStatus: 'Active',
      cityIsFeatured: false,
      cityImage: '',
      cityDescription: ''
    });
  };

  const handleSubmitHotel = async (e) => {
    e.preventDefault();
    try {
      const submitData = {
        name: formData.name,
        countryId: formData.countryId,
        cityId: formData.cityId,
        address: formData.address,
        code: formData.code,
        description: formData.description,
        starRating: parseInt(formData.starRating),
        pricePerNight: parseFloat(formData.pricePerNight),
        currency: formData.currency,
        amenities: formData.amenities,
        roomTypes: formData.roomTypes.map(rt => ({
          ...rt,
          capacity: parseInt(rt.capacity),
          price: parseFloat(rt.price),
          quantity: parseInt(rt.quantity)
        })),
        images: formData.images,
        thumbnail: formData.thumbnail,
        status: formData.status,
        isFeatured: formData.isFeatured,
        isPopular: formData.isPopular,
        checkInTime: formData.checkInTime,
        checkOutTime: formData.checkOutTime,
        contactInfo: formData.contactInfo
      };

      const response = await axiosInstance.post('/accommodation/hotels', submitData);
      
      if (response.data.success) {
        toast.success('Hotel added successfully!');
        setShowAddModal(false);
        resetForm();
        fetchData();
      }
    } catch (error) {
      console.error('Error adding hotel:', error);
      toast.error(error.response?.data?.message || 'Failed to add hotel');
    }
  };

  const handleSubmitCity = async (e) => {
    e.preventDefault();
    try {
      const submitData = {
        name: formData.cityName,
        countryId: formData.countryId,
        code: formData.cityCode,
        status: formData.cityStatus,
        isFeatured: formData.cityIsFeatured,
        image: formData.cityImage,
        description: formData.cityDescription
      };

      const response = await axiosInstance.post('/accommodation/cities', submitData);
      
      if (response.data.success) {
        toast.success('City added successfully!');
        setShowAddModal(false);
        resetForm();
        fetchData();
      }
    } catch (error) {
      console.error('Error adding city:', error);
      toast.error(error.response?.data?.message || 'Failed to add city');
    }
  };

  const handleEdit = (item) => {
    setSelectedItem(item);
    setShowEditModal(true);
  };

  const handleDelete = async (id, type) => {
    if (!confirm(`Are you sure you want to delete this ${type}?`)) return;
    try {
      const endpoint = type === 'hotel' ? '/accommodation/hotels' : '/accommodation/cities';
      const response = await axiosInstance.delete(`${endpoint}/${id}`);
      
      if (response.data.success) {
        toast.success(`${type} deleted successfully!`);
        fetchData();
      }
    } catch (error) {
      console.error(`Error deleting ${type}:`, error);
      toast.error(`Failed to delete ${type}`);
    }
  };

  const getCountryName = (countryId) => {
    const country = countries.find(c => c._id === countryId);
    return country?.name || 'N/A';
  };

  const getCityName = (cityId) => {
    const city = cities.find(c => c._id === cityId);
    return city?.name || 'N/A';
  };

  const renderStars = (rating) => {
    return '⭐'.repeat(Math.floor(rating)) + '☆'.repeat(5 - Math.floor(rating));
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin h-12 w-12 border-b-2 border-orange-500 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading accommodation data...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen ">
      <main className="max-w-8xl mx-auto p-4">
        {/* Header */}
        <div className="mb-6">
          <div className="flex flex-wrap justify-between items-center gap-4">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Accommodation Management</h1>
              <p className="text-sm text-gray-500 mt-1">Manage hotels, cities, and accommodations</p>
            </div>
            <div className="flex gap-3">
              <button
                onClick={() => {
                  resetForm();
                  setShowAddModal(true);
                }}
                className="flex items-center gap-2 px-4 py-2 bg-orange-500 text-white hover:bg-orange-600 transition-colors"
              >
                <Plus size={18} />
                Add {activeTab}
              </button>
              <button
                onClick={fetchData}
                className="flex items-center gap-2 px-4 py-2 bg-white border border-gray-300 text-gray-700 hover:bg-gray-50 transition-colors"
              >
                <RefreshCw size={16} />
                Refresh
              </button>
            </div>
          </div>
        </div>

        {/* Tabs */}
        <div className="flex gap-0 mb-6 border-b border-gray-200 bg-white">
          <button
            onClick={() => setActiveTab('hotels')}
            className={`px-6 py-3 font-medium text-sm transition-colors flex items-center gap-2 ${
              activeTab === 'hotels'
                ? 'text-orange-600 border-b-2 border-orange-600'
                : 'text-gray-600 hover:text-orange-600'
            }`}
          >
            <Hotel size={18} />
            Hotels ({filteredHotels.length})
          </button>
          <button
            onClick={() => setActiveTab('cities')}
            className={`px-6 py-3 font-medium text-sm transition-colors flex items-center gap-2 ${
              activeTab === 'cities'
                ? 'text-orange-600 border-b-2 border-orange-600'
                : 'text-gray-600 hover:text-orange-600'
            }`}
          >
            <Building2 size={18} />
            Cities ({filteredCities.length})
          </button>
        </div>

        {/* Filters */}
        <div className="bg-white border border-gray-200 shadow-sm p-4 mb-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="relative">
              <Search size={16} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
              <input
                type="text"
                placeholder="Search by name, code, city..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-9 pr-3 py-2 border border-gray-300 text-sm focus:ring-orange-500 focus:border-orange-500"
              />
            </div>
            <div>
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 text-sm focus:ring-orange-500 focus:border-orange-500"
              >
                <option value="all">All Status</option>
                <option value="Active">Active</option>
                <option value="Inactive">Inactive</option>
                <option value="Under Maintenance">Under Maintenance</option>
              </select>
            </div>
            {/* <div>
              <select
                value={featuredFilter}
                onChange={(e) => setFeaturedFilter(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 text-sm focus:ring-orange-500 focus:border-orange-500"
              >
                <option value="all">All Featured</option>
                <option value={true}>Featured</option>
                <option value={false}>Not Featured</option>
              </select>
            </div> */}
            <div>
              <select
                value={countryFilter}
                onChange={(e) => setCountryFilter(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 text-sm focus:ring-orange-500 focus:border-orange-500"
              >
                <option value="all">All Countries</option>
                {countries.map(country => (
                  <option key={country._id} value={country._id}>{country.name}</option>
                ))}
              </select>
            </div>
          </div>
        </div>

        {/* Content */}
        {activeTab === 'hotels' ? (
          <HotelList
            hotels={filteredHotels}
            countries={countries}
            cities={cities}
            onEdit={handleEdit}
            onDelete={handleDelete}
            renderStars={renderStars}
            getCountryName={getCountryName}
            getCityName={getCityName}
          />
        ) : (
          <CityList
            cities={filteredCities}
            countries={countries}
            onEdit={handleEdit}
            onDelete={handleDelete}
            getCountryName={getCountryName}
          />
        )}
      </main>

      {/* Add Modal */}
      {showAddModal && (
        <AddModal
          activeTab={activeTab}
          formData={formData}
          setFormData={setFormData}
          handleInputChange={handleInputChange}
          handleAddressChange={handleAddressChange}
          handleContactChange={handleContactChange}
          handleAmenitiesChange={handleAmenitiesChange}
          handleRoomTypeChange={handleRoomTypeChange}
          addRoomType={addRoomType}
          removeRoomType={removeRoomType}
          handleImageChange={handleImageChange}
          handleSubmitHotel={handleSubmitHotel}
          handleSubmitCity={handleSubmitCity}
          onClose={() => {
            setShowAddModal(false);
            resetForm();
          }}
          countries={countries}
          cities={cities}
          amenitiesList={amenitiesList}
          statusOptions={statusOptions}
        />
      )}

      {/* Edit Modal */}
      {showEditModal && selectedItem && (
        <EditModal
          item={selectedItem}
          type={activeTab}
          onClose={() => {
            setShowEditModal(false);
            setSelectedItem(null);
          }}
          onUpdate={fetchData}
          countries={countries}
          cities={cities}
          amenitiesList={amenitiesList}
          statusOptions={statusOptions}
        />
      )}
    </div>
  );
}

// Hotel List Component
function HotelList({ hotels, countries, cities, onEdit, onDelete, renderStars, getCountryName, getCityName }) {
  if (hotels.length === 0) {
    return (
      <div className="bg-white border border-gray-200 shadow-sm p-12 text-center">
        <Hotel size={48} className="text-gray-300 mx-auto mb-4" />
        <h3 className="text-lg font-medium text-gray-600 mb-2">No Hotels Found</h3>
        <p className="text-sm text-gray-400">Add your first hotel to get started</p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {hotels.map((hotel) => (
        <div key={hotel._id} className="bg-white border border-gray-200 shadow-sm overflow-hidden hover:shadow-md transition-shadow">
          <div className="relative h-48 bg-gray-200">
            {hotel.thumbnail ? (
              <img src={hotel.thumbnail} alt={hotel.name} className="w-full h-full object-cover" />
            ) : (
              <div className="w-full h-full flex items-center justify-center bg-gray-100">
                <Hotel size={48} className="text-gray-400" />
              </div>
            )}
            <div className="absolute top-2 right-2 flex gap-1">
              {hotel.isFeatured === true && (
                <span className="bg-yellow-500 text-white text-xs px-2 py-1">Featured</span>
              )}
              {hotel.isPopular === 'Yes' && (
                <span className="bg-red-500 text-white text-xs px-2 py-1">Popular</span>
              )}
            </div>
            <div className="absolute bottom-2 left-2">
              <span className={`text-xs px-2 py-1 ${
                hotel.status === 'Active' ? 'bg-green-500' :
                hotel.status === 'Inactive' ? 'bg-gray-500' : 'bg-yellow-500'
              } text-white`}>
                {hotel.status}
              </span>
            </div>
          </div>
          
          <div className="p-4">
            <div className="flex justify-between items-start mb-2">
              <h3 className="font-semibold text-gray-900 truncate">{hotel.name}</h3>
              <span className="text-sm font-bold text-orange-600">
                {hotel.currency}{hotel.pricePerNight}
              </span>
            </div>
              {console.log(hotel,"hotel")}
            <div className="flex items-center gap-2 text-sm text-gray-500 mb-2">
              <MapPin size={14} className="text-orange-500" />
              <span>{hotel.cityId.name}</span>
              <span className="text-gray-300">|</span>
              <span>{hotel.countryId.name}</span>
            </div>
            
            <div className="flex items-center gap-2 text-sm text-gray-500 mb-3">
              <span>{renderStars(hotel.starRating)}</span>
              <span className="text-gray-300">|</span>
              <span>{hotel.amenities?.length || 0} amenities</span>
            </div>
            
            <div className="flex items-center justify-between pt-3 border-t border-gray-100">
              <span className="text-xs text-gray-400">Code: {hotel.code || 'N/A'}</span>
              <div className="flex gap-2">
                <button
                  onClick={() => onEdit(hotel)}
                  className="p-1.5 text-orange-600 hover:bg-orange-50 transition-colors"
                >
                  <Edit3 size={16} />
                </button>
                <button
                  onClick={() => onDelete(hotel._id, 'hotel')}
                  className="p-1.5 text-red-600 hover:bg-red-50 transition-colors"
                >
                  <X size={16} />
                </button>
              </div>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}

// City List Component
function CityList({ cities, countries, onEdit, onDelete, getCountryName }) {
  if (cities.length === 0) {
    return (
      <div className="bg-white border border-gray-200 shadow-sm p-12 text-center">
        <Building2 size={48} className="text-gray-300 mx-auto mb-4" />
        <h3 className="text-lg font-medium text-gray-600 mb-2">No Cities Found</h3>
        <p className="text-sm text-gray-400">Add your first city to get started</p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {cities.map((city) => (
        <div key={city._id} className="bg-white border border-gray-200 shadow-sm overflow-hidden hover:shadow-md transition-shadow">
          <div className="relative h-40 bg-gray-200">
            {city.image ? (
              <img src={city.image} alt={city.name} className="w-full h-full object-cover" />
            ) : (
              <div className="w-full h-full flex items-center justify-center bg-gray-100">
                <Building2 size={48} className="text-gray-400" />
              </div>
            )}
            {city.isFeatured === true && (
              <div className="absolute top-2 right-2">
                <span className="bg-yellow-500 text-white text-xs px-2 py-1">Featured</span>
              </div>
            )}
          </div>
          
          <div className="p-4">
            <div className="flex justify-between items-start mb-2">
              <div>
                <h3 className="font-semibold text-gray-900">{city.name}</h3>
                <p className="text-sm text-gray-500">{getCountryName(city.countryId)}</p>
              </div>
              <span className={`text-xs px-2 py-1 ${
                city.status === 'Active' ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-700'
              }`}>
                {city.status}
              </span>
            </div>
            
            {city.description && (
              <p className="text-sm text-gray-600 line-clamp-2 mb-3">{city.description}</p>
            )}
            
            <div className="flex items-center justify-between pt-3 border-t border-gray-100">
              <span className="text-xs text-gray-400">Code: {city.code || 'N/A'}</span>
              <div className="flex gap-2">
                <button
                  onClick={() => onEdit(city)}
                  className="p-1.5 text-orange-600 hover:bg-orange-50 transition-colors"
                >
                  <Edit3 size={16} />
                </button>
                <button
                  onClick={() => onDelete(city._id, 'city')}
                  className="p-1.5 text-red-600 hover:bg-red-50 transition-colors"
                >
                  <X size={16} />
                </button>
              </div>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}

// Add Modal Component
function AddModal({
  activeTab,
  formData,
  setFormData,
  handleInputChange,
  handleAddressChange,
  handleContactChange,
  handleAmenitiesChange,
  handleRoomTypeChange,
  addRoomType,
  removeRoomType,
  handleImageChange,
  handleSubmitHotel,
  handleSubmitCity,
  onClose,
  countries,
  cities,
  amenitiesList,
  statusOptions
}) {
  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4 overflow-y-auto">
      <div className="bg-white shadow-xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
        <div className="sticky top-0 bg-white border-b border-gray-200 px-6 py-4 flex justify-between items-center z-10">
          <h2 className="text-xl font-bold text-gray-800">
            Add New {activeTab === 'hotels' ? 'Hotel' : 'City'}
          </h2>
          <button onClick={onClose} className="p-1 hover:bg-gray-100">
            <X size={20} />
          </button>
        </div>

        <div className="p-6">
          {activeTab === 'hotels' ? (
            <HotelForm
              formData={formData}
              handleInputChange={handleInputChange}
              handleAddressChange={handleAddressChange}
              handleContactChange={handleContactChange}
              handleAmenitiesChange={handleAmenitiesChange}
              handleRoomTypeChange={handleRoomTypeChange}
              addRoomType={addRoomType}
              removeRoomType={removeRoomType}
              handleImageChange={handleImageChange}
              handleSubmit={handleSubmitHotel}
              countries={countries}
              cities={cities}
              amenitiesList={amenitiesList}
              statusOptions={statusOptions}
            />
          ) : (
            <CityForm
              formData={formData}
              handleInputChange={handleInputChange}
              handleSubmit={handleSubmitCity}
              countries={countries}
              statusOptions={statusOptions}
            />
          )}
        </div>
      </div>
    </div>
  );
}

// Hotel Form Component
function HotelForm({
  formData,
  handleInputChange,
  handleAddressChange,
  handleContactChange,
  handleAmenitiesChange,
  handleRoomTypeChange,
  addRoomType,
  removeRoomType,
  handleImageChange,
  handleSubmit,
  countries,
  cities,
  amenitiesList,
  statusOptions
}) {
  const filteredCities = cities.filter(c => c.countryId === formData.countryId);

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* Basic Information */}
      <div className="border-b border-gray-200 pb-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Basic Information</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Hotel Name *</label>
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleInputChange}
              required
              className="w-full px-3 py-2 border border-gray-300 text-sm focus:ring-orange-500 focus:border-orange-500"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Country *</label>
            <select
              name="countryId"
              value={formData.countryId}
              onChange={handleInputChange}
              required
              className="w-full px-3 py-2 border border-gray-300 text-sm focus:ring-orange-500 focus:border-orange-500"
            >
              <option value="">Select Country</option>
              {countries.map(c => (
                <option key={c._id} value={c._id}>{c.name}</option>
              ))}
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">City *</label>
            <select
              name="cityId"
              value={formData.cityId}
              onChange={handleInputChange}
              required
              className="w-full px-3 py-2 border border-gray-300 text-sm focus:ring-orange-500 focus:border-orange-500"
            >
              <option value="">Select City</option>
              {filteredCities.map(c => (
                <option key={c._id} value={c._id}>{c.name}</option>
              ))}
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Currency</label>
            <input
              type="text"
              name="currency"
              value={formData.currency}
              onChange={handleInputChange}
              placeholder="USD, EUR, GBP, etc."
              className="w-full px-3 py-2 border border-gray-300 text-sm focus:ring-orange-500 focus:border-orange-500"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Star Rating</label>
            <select
              name="starRating"
              value={formData.starRating}
              onChange={handleInputChange}
              className="w-full px-3 py-2 border border-gray-300 text-sm focus:ring-orange-500 focus:border-orange-500"
            >
              {[1,2,3,4,5,6,7].map(r => (
                <option key={r} value={r}>{r} Star{r > 1 ? 's' : ''}</option>
              ))}
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Price Per Night</label>
            <input
              type="number"
              name="pricePerNight"
              value={formData.pricePerNight}
              onChange={handleInputChange}
              min="0"
              step="0.01"
              className="w-full px-3 py-2 border border-gray-300 text-sm focus:ring-orange-500 focus:border-orange-500"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Status</label>
            <select
              name="status"
              value={formData.status}
              onChange={handleInputChange}
              className="w-full px-3 py-2 border border-gray-300 text-sm focus:ring-orange-500 focus:border-orange-500"
            >
              {statusOptions.map(s => (
                <option key={s} value={s}>{s}</option>
              ))}
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Featured</label>
            <select
              name="isFeatured"
              value={formData.isFeatured}
              onChange={handleInputChange}
              className="w-full px-3 py-2 border border-gray-300 text-sm focus:ring-orange-500 focus:border-orange-500"
            >
              <option value={true}>No</option>
              <option value={false}>Yes</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Popular</label>
            <select
              name="isPopular"
              value={formData.isPopular}
              onChange={handleInputChange}
              className="w-full px-3 py-2 border border-gray-300 text-sm focus:ring-orange-500 focus:border-orange-500"
            >
              <option value="No">No</option>
              <option value="Yes">Yes</option>
            </select>
          </div>
        </div>
      </div>

      {/* Address */}
      <div className="border-b border-gray-200 pb-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Address</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="md:col-span-2">
            <label className="block text-sm font-medium text-gray-700 mb-1">Street</label>
            <input
              type="text"
              name="street"
              value={formData.address.street}
              onChange={handleAddressChange}
              className="w-full px-3 py-2 border border-gray-300 text-sm focus:ring-orange-500 focus:border-orange-500"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Area</label>
            <input
              type="text"
              name="area"
              value={formData.address.area}
              onChange={handleAddressChange}
              className="w-full px-3 py-2 border border-gray-300 text-sm focus:ring-orange-500 focus:border-orange-500"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Landmark</label>
            <input
              type="text"
              name="landmark"
              value={formData.address.landmark}
              onChange={handleAddressChange}
              className="w-full px-3 py-2 border border-gray-300 text-sm focus:ring-orange-500 focus:border-orange-500"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Pincode</label>
            <input
              type="text"
              name="pincode"
              value={formData.address.pincode}
              onChange={handleAddressChange}
              className="w-full px-3 py-2 border border-gray-300 text-sm focus:ring-orange-500 focus:border-orange-500"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Latitude</label>
            <input
              type="text"
              name="latitude"
              value={formData.address.latitude}
              onChange={handleAddressChange}
              className="w-full px-3 py-2 border border-gray-300 text-sm focus:ring-orange-500 focus:border-orange-500"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Longitude</label>
            <input
              type="text"
              name="longitude"
              value={formData.address.longitude}
              onChange={handleAddressChange}
              className="w-full px-3 py-2 border border-gray-300 text-sm focus:ring-orange-500 focus:border-orange-500"
            />
          </div>
        </div>
      </div>

      {/* Description */}
      <div className="border-b border-gray-200 pb-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Description</h3>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
          <textarea
            name="description"
            value={formData.description}
            onChange={handleInputChange}
            rows="4"
            className="w-full px-3 py-2 border border-gray-300 text-sm focus:ring-orange-500 focus:border-orange-500"
            placeholder="Describe the hotel..."
          />
        </div>
      </div>

      {/* Amenities */}
      <div className="border-b border-gray-200 pb-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Amenities</h3>
        <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
          {amenitiesList.map(amenity => (
            <label key={amenity} className="flex items-center gap-2 text-sm">
              <input
                type="checkbox"
                checked={formData.amenities.includes(amenity)}
                onChange={() => handleAmenitiesChange(amenity)}
                className="w-4 h-4 text-orange-500 border-gray-300 focus:ring-orange-500"
              />
              {amenity}
            </label>
          ))}
        </div>
      </div>

      {/* Room Types */}
      <div className="border-b border-gray-200 pb-6">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-lg font-semibold text-gray-900">Room Types</h3>
          <button
            type="button"
            onClick={addRoomType}
            className="flex items-center gap-1 px-3 py-1.5 bg-orange-500 text-white text-sm hover:bg-orange-600 transition-colors"
          >
            <Plus size={14} /> Add Room
          </button>
        </div>
        
        {formData.roomTypes.map((room, index) => (
          <div key={index} className="border border-gray-200 p-4 mb-4 relative">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-medium text-gray-700 mb-1">Room Name</label>
                <input
                  type="text"
                  value={room.name}
                  onChange={(e) => handleRoomTypeChange(index, 'name', e.target.value)}
                  className="w-full px-3 py-1.5 border border-gray-300 text-sm"
                  placeholder="e.g., Deluxe Suite"
                />
              </div>
              <div>
                <label className="block text-xs font-medium text-gray-700 mb-1">Capacity</label>
                <input
                  type="number"
                  value={room.capacity}
                  onChange={(e) => handleRoomTypeChange(index, 'capacity', parseInt(e.target.value))}
                  className="w-full px-3 py-1.5 border border-gray-300 text-sm"
                  min="1"
                />
              </div>
              <div>
                <label className="block text-xs font-medium text-gray-700 mb-1">Price</label>
                <input
                  type="number"
                  value={room.price}
                  onChange={(e) => handleRoomTypeChange(index, 'price', parseFloat(e.target.value))}
                  className="w-full px-3 py-1.5 border border-gray-300 text-sm"
                  min="0"
                  step="0.01"
                />
              </div>
              <div>
                <label className="block text-xs font-medium text-gray-700 mb-1">Quantity</label>
                <input
                  type="number"
                  value={room.quantity}
                  onChange={(e) => handleRoomTypeChange(index, 'quantity', parseInt(e.target.value))}
                  className="w-full px-3 py-1.5 border border-gray-300 text-sm"
                  min="0"
                />
              </div>
              <div className="md:col-span-2">
                <label className="block text-xs font-medium text-gray-700 mb-1">Description</label>
                <input
                  type="text"
                  value={room.description}
                  onChange={(e) => handleRoomTypeChange(index, 'description', e.target.value)}
                  className="w-full px-3 py-1.5 border border-gray-300 text-sm"
                  placeholder="Room description..."
                />
              </div>
            </div>
            {formData.roomTypes.length > 1 && (
              <button
                type="button"
                onClick={() => removeRoomType(index)}
                className="absolute top-2 right-2 text-red-500 hover:text-red-700"
              >
                <X size={16} />
              </button>
            )}
          </div>
        ))}
      </div>

      {/* Images */}
      <div className="border-b border-gray-200 pb-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Images</h3>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Thumbnail URL</label>
          <input
            type="text"
            name="thumbnail"
            value={formData.thumbnail}
            onChange={handleInputChange}
            className="w-full px-3 py-2 border border-gray-300 text-sm focus:ring-orange-500 focus:border-orange-500"
            placeholder="https://example.com/thumbnail.jpg"
          />
        </div>
        <div className="mt-3">
          <label className="block text-sm font-medium text-gray-700 mb-1">Gallery Images</label>
          <input
            type="file"
            multiple
            accept="image/*"
            onChange={handleImageChange}
            className="w-full px-3 py-2 border border-gray-300 text-sm"
          />
          {formData.images.length > 0 && (
            <div className="mt-2 flex flex-wrap gap-2">
              {formData.images.map((img, i) => (
                <span key={i} className="text-xs bg-gray-100 px-2 py-1">{img}</span>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Check-in/Check-out */}
      <div className="border-b border-gray-200 pb-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Check-in & Check-out</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Check-in Time</label>
            <input
              type="text"
              name="checkInTime"
              value={formData.checkInTime}
              onChange={handleInputChange}
              className="w-full px-3 py-2 border border-gray-300 text-sm focus:ring-orange-500 focus:border-orange-500"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Check-out Time</label>
            <input
              type="text"
              name="checkOutTime"
              value={formData.checkOutTime}
              onChange={handleInputChange}
              className="w-full px-3 py-2 border border-gray-300 text-sm focus:ring-orange-500 focus:border-orange-500"
            />
          </div>
        </div>
      </div>

      {/* Contact Information */}
      <div className="border-b border-gray-200 pb-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Contact Information</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Phone</label>
            <input
              type="text"
              name="phone"
              value={formData.contactInfo.phone}
              onChange={handleContactChange}
              className="w-full px-3 py-2 border border-gray-300 text-sm focus:ring-orange-500 focus:border-orange-500"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
            <input
              type="email"
              name="email"
              value={formData.contactInfo.email}
              onChange={handleContactChange}
              className="w-full px-3 py-2 border border-gray-300 text-sm focus:ring-orange-500 focus:border-orange-500"
            />
          </div>
          <div className="md:col-span-2">
            <label className="block text-sm font-medium text-gray-700 mb-1">Website</label>
            <input
              type="url"
              name="website"
              value={formData.contactInfo.website}
              onChange={handleContactChange}
              className="w-full px-3 py-2 border border-gray-300 text-sm focus:ring-orange-500 focus:border-orange-500"
              placeholder="https://example.com"
            />
          </div>
        </div>
      </div>

      {/* Submit */}
      <div className="flex justify-end gap-3 pt-4">
        <button
          type="button"
        //   onClick={onClose}
          className="px-4 py-2 border border-gray-300 text-gray-700 hover:bg-gray-50 transition-colors"
        >
          Cancel
        </button>
        <button
          type="submit"
          className="px-6 py-2 bg-orange-500 text-white hover:bg-orange-600 transition-colors"
        >
          Add Hotel
        </button>
      </div>
    </form>
  );
}

// City Form Component
function CityForm({
  formData,
  handleInputChange,
  handleSubmit,
  countries,
  statusOptions
}) {
  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">City Name *</label>
          <input
            type="text"
            name="cityName"
            value={formData.cityName}
            onChange={handleInputChange}
            required
            className="w-full px-3 py-2 border border-gray-300 text-sm focus:ring-orange-500 focus:border-orange-500"
          />
        </div>
        
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Country *</label>
          <select
            name="countryId"
            value={formData.countryId}
            onChange={handleInputChange}
            required
            className="w-full px-3 py-2 border border-gray-300 text-sm focus:ring-orange-500 focus:border-orange-500"
          >
            <option value="">Select Country</option>
            {countries.map(c => (
              <option key={c._id} value={c._id}>{c.name}</option>
            ))}
          </select>
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Status</label>
          <select
            name="cityStatus"
            value={formData.cityStatus}
            onChange={handleInputChange}
            className="w-full px-3 py-2 border border-gray-300 text-sm focus:ring-orange-500 focus:border-orange-500"
          >
            {statusOptions.filter(s => s !== 'Under Maintenance').map(s => (
              <option key={s} value={s}>{s}</option>
            ))}
          </select>
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Featured</label>
          <select
            name="cityIsFeatured"
            value={formData.cityIsFeatured}
            onChange={handleInputChange}
            className="w-full px-3 py-2 border border-gray-300 text-sm focus:ring-orange-500 focus:border-orange-500"
          >
            <option value={false}>No</option>
            <option value={true}>Yes</option>
          </select>
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Image URL</label>
          <input
            type="text"
            name="cityImage"
            value={formData.cityImage}
            onChange={handleInputChange}
            className="w-full px-3 py-2 border border-gray-300 text-sm focus:ring-orange-500 focus:border-orange-500"
            placeholder="https://example.com/city-image.jpg"
          />
        </div>
        <div className="md:col-span-2">
          <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
          <textarea
            name="cityDescription"
            value={formData.cityDescription}
            onChange={handleInputChange}
            rows="3"
            className="w-full px-3 py-2 border border-gray-300 text-sm focus:ring-orange-500 focus:border-orange-500"
            placeholder="Describe the city..."
          />
        </div>
      </div>

      <div className="flex justify-end gap-3 pt-4">
        <button
          type="button"
        //   onClick={onClose}
          className="px-4 py-2 border border-gray-300 text-gray-700 hover:bg-gray-50 transition-colors"
        >
          Cancel
        </button>
        <button
          type="submit"
          className="px-6 py-2 bg-orange-500 text-white hover:bg-orange-600 transition-colors"
        >
          Add City
        </button>
      </div>
    </form>
  );
}

// Edit Modal Component
function EditModal({
  item,
  type,
  onClose,
  onUpdate,
  countries,
  cities,
  amenitiesList,
  statusOptions
}) {
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState(item);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    if (name.includes('.')) {
      const [parent, child] = name.split('.');
      setFormData(prev => ({
        ...prev,
        [parent]: {
          ...prev[parent],
          [child]: value
        }
      }));
    } else {
      setFormData(prev => ({ ...prev, [name]: value }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const endpoint = type === 'hotel' ? '/accommodation/hotels' : '/accommodation/cities';
      const response = await axiosInstance.put(`${endpoint}/${item._id}`, formData);
      
      if (response.data.success) {
        toast.success(`${type} updated successfully!`);
        onUpdate();
        onClose();
      }
    } catch (error) {
      console.error(`Error updating ${type}:`, error);
      toast.error(`Failed to update ${type}`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4 overflow-y-auto">
      <div className="bg-white shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        <div className="sticky top-0 bg-white border-b border-gray-200 px-6 py-4 flex justify-between items-center">
          <h2 className="text-xl font-bold text-gray-800">
            Edit {type === 'hotel' ? 'Hotel' : 'City'}
          </h2>
          <button onClick={onClose} className="p-1 hover:bg-gray-100">
            <X size={20} />
          </button>
        </div>

        <div className="p-6">
          <form onSubmit={handleSubmit} className="space-y-4">
            {type === 'hotel' ? (
              <>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Hotel Name *</label>
                    <input
                      type="text"
                      name="name"
                      value={formData.name || ''}
                      onChange={handleInputChange}
                      required
                      className="w-full px-3 py-2 border border-gray-300 text-sm focus:ring-orange-500 focus:border-orange-500"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Status</label>
                    <select
                      name="status"
                      value={formData.status || 'Active'}
                      onChange={handleInputChange}
                      className="w-full px-3 py-2 border border-gray-300 text-sm focus:ring-orange-500 focus:border-orange-500"
                    >
                      {statusOptions.map(s => (
                        <option key={s} value={s}>{s}</option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Price Per Night</label>
                    <input
                      type="number"
                      name="pricePerNight"
                      value={formData.pricePerNight || 0}
                      onChange={handleInputChange}
                      min="0"
                      step="0.01"
                      className="w-full px-3 py-2 border border-gray-300 text-sm focus:ring-orange-500 focus:border-orange-500"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Featured</label>
                    <select
                      name="isFeatured"
                      value={formData.isFeatured || false}
                      onChange={handleInputChange}
                      className="w-full px-3 py-2 border border-gray-300 text-sm focus:ring-orange-500 focus:border-orange-500"
                    >
                      <option value="No">No</option>
                      <option value="Yes">Yes</option>
                    </select>
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
                  <textarea
                    name="description"
                    value={formData.description || ''}
                    onChange={handleInputChange}
                    rows="3"
                    className="w-full px-3 py-2 border border-gray-300 text-sm focus:ring-orange-500 focus:border-orange-500"
                  />
                </div>
              </>
            ) : (
              <>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">City Name *</label>
                    <input
                      type="text"
                      name="name"
                      value={formData.name || ''}
                      onChange={handleInputChange}
                      required
                      className="w-full px-3 py-2 border border-gray-300 text-sm focus:ring-orange-500 focus:border-orange-500"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Status</label>
                    <select
                      name="status"
                      value={formData.status || 'Active'}
                      onChange={handleInputChange}
                      className="w-full px-3 py-2 border border-gray-300 text-sm focus:ring-orange-500 focus:border-orange-500"
                    >
                      {statusOptions.filter(s => s !== 'Under Maintenance').map(s => (
                        <option key={s} value={s}>{s}</option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Featured</label>
                    <select
                      name="isFeatured"
                      value={formData.isFeatured || false}
                      onChange={handleInputChange}
                      className="w-full px-3 py-2 border border-gray-300 text-sm focus:ring-orange-500 focus:border-orange-500"
                    >
                      <option value="No">No</option>
                      <option value="Yes">Yes</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Image URL</label>
                    <input
                      type="text"
                      name="image"
                      value={formData.image || ''}
                      onChange={handleInputChange}
                      className="w-full px-3 py-2 border border-gray-300 text-sm focus:ring-orange-500 focus:border-orange-500"
                    />
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
                  <textarea
                    name="description"
                    value={formData.description || ''}
                    onChange={handleInputChange}
                    rows="3"
                    className="w-full px-3 py-2 border border-gray-300 text-sm focus:ring-orange-500 focus:border-orange-500"
                  />
                </div>
              </>
            )}

            <div className="flex justify-end gap-3 pt-4">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2 border border-gray-300 text-gray-700 hover:bg-gray-50 transition-colors"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={loading}
                className="px-6 py-2 bg-orange-500 text-white hover:bg-orange-600 transition-colors disabled:opacity-50"
              >
                {loading ? 'Updating...' : `Update ${type}`}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}