// components/ApplyBoard360.tsx
'use client';

import React, { useState } from 'react';
import Image from 'next/image';
import {
  ChevronDown,
  Globe,
  BookOpen,
  CreditCard,
  Pass,
  Home,
  Gift,
  BarChart,
  MessageCircle,
  Info,
  ShoppingCart,
  Sparkles,
  
} from 'lucide-react';
import EligibilityForm from '@/components/dashboard/Eligibility-form';
import Link from 'next/link';

interface ServiceCard {
  name: string;
  price: string | null;
  icon: React.ReactNode;
  description?: string;
}

interface TestOption {
  id: string;
  name: string;
  description: string;
  icon: React.ReactNode;
  popular?: boolean;
}

const ApplyBoard360: React.FC = () => {
  const [selectedNationality, setSelectedNationality] = useState('Albania');
  const [selectedDestination, setSelectedDestination] = useState('');
  const [openEligi,setopenEligi] = useState(false)

  const nationalities = ['Albania', 'India', 'China', 'Brazil', 'Nigeria', 'Philippines', 'Vietnam'];
  const destinations = ['Canada', 'USA', 'UK', 'Australia', 'Ireland', 'New Zealand'];

  const services: ServiceCard[] = [
    { name: 'Tests', price: '$220.00 USD', icon: <BookOpen className="w-5 h-5" />, description: 'English proficiency & academic tests' },
    { name: 'Financial Services', price: '$200.00 USD', icon: <CreditCard className="w-5 h-5" />, description: 'GIC, student loans & transfers' },
    { name: 'Visa', price: null, icon: <Home className="w-5 h-5" />, description: 'Application guidance & documentation' },
    { name: 'Housing', price: null, icon: <Home className="w-5 h-5" />, description: 'Homestay, dorms & rentals' },
    { name: 'Arrival Kits', price: '$255.00 USD', icon: <Gift className="w-5 h-5" />, description: 'SIM card, pickup & essentials' },
    { name: 'Academic Tools', price: '$216.00 USD', icon: <BarChart className="w-5 h-5" />, description: 'CRM, analytics & support' },
  ];

  const testOptions: TestOption[] = [
    {
      id: 'pearson',
      name: 'Ooshas loan services',
      description: 'Dont let a lack of funds keep you from achieving your dreams. Jumpstart your journey with Ooshas Student Loans.',
      icon: (
        <div className="w-40 h-10 bg-blue-50 rounded-xl flex items-center justify-center text-blue-600 font-bold text-sm">
          Financial Service
        </div>
      ),
      popular: true
    },
    {
      id: 'toefl',
      name: 'ETS TOEFL®',
      description: 'Test of English as a Foreign Language (TOEFL) accepted by 11,000+ institutions globally.',
      icon: (
        <div className="w-10 h-10 bg-orange-50 rounded-xl flex items-center justify-center text-orange-600 font-bold text-sm">
          TOEFL
        </div>
      )
    },
    {
      id: 'duolingo',
      name: 'Duolingo English Test',
      description: 'Convenient, fast, and affordable English test trusted by 4,500+ institutions worldwide.',
      icon: (
        <div className="w-10 h-10 bg-green-50 rounded-xl flex items-center justify-center text-green-600 font-bold text-sm">
          DET
        </div>
      )
    }
  ];

  return (
    <div className="max-w-7xl mx-auto bg-white rounded-3xl shadow-2xl shadow-indigo-100/30 border border-slate-100 overflow-hidden">
      {/* Header with gradient */}
      <div className="bg-gradient-to-r from-indigo-600 to-purple-600 px-8 py-6">
        <div className="flex items-center gap-3">
          <Sparkles className="w-8 h-8 text-white/90" />
          <h1 className="text-2xl font-bold text-white tracking-tight">Ooshas Services</h1>
        </div>
        <p className="text-indigo-50 mt-1 text-sm font-medium">Explore our Value Added Solutions — click through each category for more details</p>
      </div>

      {/* Main content */}
      <div className="p-6 md:p-8">
        {/* Filters row */}
        <div className="flex flex-col sm:flex-row gap-4 mb-8">
          <div className="flex-1">
            <label className="block text-xs font-semibold text-slate-500 uppercase tracking-wider mb-1.5">
              <Globe className="w-3.5 h-3.5 inline mr-1" /> Nationality
            </label>
            <div className="relative">
              <select
                value={selectedNationality}
                onChange={(e) => setSelectedNationality(e.target.value)}
                className="w-full appearance-none bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 pr-10 text-slate-700 font-medium focus:outline-none focus:ring-2 focus:ring-indigo-400 focus:border-transparent transition"
              >
                {nationalities.map((n) => (
                  <option key={n} value={n}>{n}</option>
                ))}
              </select>
              <ChevronDown className="absolute right-3 top-3.5 w-5 h-5 text-slate-400 pointer-events-none" />
            </div>
          </div>

          <div className="flex-1">
            <label className="block text-xs font-semibold text-slate-500 uppercase tracking-wider mb-1.5">
              <Globe className="w-3.5 h-3.5 inline mr-1" /> Destination
            </label>
            <div className="relative">
              <select
                value={selectedDestination}
                onChange={(e) => setSelectedDestination(e.target.value)}
                className="w-full appearance-none bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 pr-10 text-slate-700 font-medium focus:outline-none focus:ring-2 focus:ring-indigo-400 focus:border-transparent transition"
              >
                <option value="">Select...</option>
                {destinations.map((d) => (
                  <option key={d} value={d}>{d}</option>
                ))}
              </select>
              <ChevronDown className="absolute right-3 top-3.5 w-5 h-5 text-slate-400 pointer-events-none" />
            </div>
          </div>
        </div>

        {/* Service cards grid - improved with prices and descriptions */}
        <div className="mb-10">
          <h2 className="text-sm font-semibold text-slate-400 uppercase tracking-wider mb-3">Included services & pricing</h2>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3">
            {services.map((service) => (
              <div
                key={service.name}
                className="group relative bg-white border border-slate-200 rounded-2xl p-4 hover:shadow-lg hover:border-indigo-200 transition-all cursor-pointer"
              >
                <div className="flex items-start justify-between mb-2">
                  <div className="p-2 bg-indigo-50 rounded-lg text-indigo-600 group-hover:bg-indigo-100 transition">
                    {service.icon}
                  </div>
                  {service.price ? (
                    <span className="text-xs font-bold text-indigo-600 bg-indigo-50 px-2 py-1 rounded-full">
                      {service.price}
                    </span>
                  ) : (
                    <span className="text-xs text-slate-400 bg-slate-100 px-2 py-1 rounded-full">
                      Contact
                    </span>
                  )}
                </div>
                <h3 className="font-semibold text-slate-800 text-sm mb-1">{service.name}</h3>
                <p className="text-xs text-slate-500 line-clamp-2">{service.description}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Test options - improved layout with cards */}
        <div className="mb-8">
          <h2 className="text-sm font-semibold text-slate-400 uppercase tracking-wider mb-4">Language tests</h2>
          <div className="grid md:grid-cols-3 gap-4">
            {testOptions.map((test) => (
              <div
                key={test.id}
                className="relative bg-slate-50/80 backdrop-blur-sm border border-slate-200 rounded-2xl p-5 hover:border-indigo-300 hover:shadow-md transition-all group"
              >
                {test.popular && (
                  <span className="absolute -top-2 -right-2 bg-indigo-600 text-white text-xs font-bold px-2.5 py-1 rounded-full shadow-lg">
                    Popular
                  </span>
                )}
                <div className="flex items-start gap-3 mb-3">
                  {test.icon}
                 
                </div>
                 <div>
                    <h3 className="font-bold text-slate-800">{test.name}</h3>
                  </div>
                <p className="text-sm text-slate-600 mb-4 leading-relaxed">{test.description}</p>
                 {/* Action bar with buttons & live chat */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-4 border-t border-slate-100">
          <div className="flex items-center gap-3">
            <button onClick={()=> setopenEligi(true) } className="px-6 py-2.5 bg-white border-2 border-indigo-600 text-indigo-700 font-semibold rounded-xl hover:bg-indigo-50 transition flex items-center gap-2 shadow-sm">
              <Info className="w-4 h-4" /> Request Info
            </button>
            <Link href='/dashboard/loan'>
            <button  className="px-6 py-2.5 bg-gradient-to-r from-indigo-600 to-indigo-700 text-white font-semibold rounded-xl hover:from-indigo-700 hover:to-indigo-800 transition flex items-center gap-2 shadow-md shadow-indigo-200">
              <ShoppingCart className="w-4 h-4" /> Buy now
            </button>
            </Link>
          </div>
          
         
        </div>
              </div>
            ))}
          </div>
        </div>

        {/* Action bar with buttons & live chat */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-4 border-t border-slate-100">
        
          
          {/* Live chat bubble - enhanced */}
          <div className="flex items-center gap-2 bg-slate-100 px-5 py-2.5 rounded-full hover:bg-slate-200 transition cursor-pointer group">
            <MessageCircle className="w-5 h-5 text-indigo-600 group-hover:scale-110 transition" />
            <span className="font-medium text-slate-700">Live Chat</span>
            <span className="w-2 h-2 bg-green-500 rounded-full animate-pulse ml-1"></span>
          </div>
        </div>

        {/* Footer micro-info */}
        <p className="text-xs text-slate-400 mt-4 flex items-center gap-1">
          <span className="inline-block w-1 h-1 bg-indigo-400 rounded-full"></span>
          All prices shown in USD. Additional institution fees may apply.
        </p>
      </div>
      {openEligi && <EligibilityForm close = {()=> setopenEligi(false)}/> }

    </div>
  );
};

export default ApplyBoard360;