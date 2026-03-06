'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronDown, X } from 'lucide-react';

interface EligibilityFormProps {
  title?: string;
  close: () => void;
  isOpen?: boolean;
}

export default function EligibilityForm({ 
  title = "Check Loan Eligibility", 
  close,
  isOpen = true 
}: EligibilityFormProps) {
  const [hasCosigner, setHasCosigner] = useState<string>('');
  const [isVisible, setIsVisible] = useState(isOpen);

  // Handle escape key press
  useEffect(() => {
    const handleEsc = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        close();
      }
    };
    
    if (isOpen) {
      document.addEventListener('keydown', handleEsc);
      // Prevent body scroll when popup is open
      document.body.style.overflow = 'hidden';
    }
    
    return () => {
      document.removeEventListener('keydown', handleEsc);
      document.body.style.overflow = 'unset';
    };
  }, [isOpen, close]);

  // Handle backdrop click
  const handleBackdropClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (e.target === e.currentTarget) {
      close();
    }
  };

  return (
    <AnimatePresence mode="wait">
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.2 }}
          className="fixed inset-0 bg-black/40 flex items-center justify-center z-50 p-4 backdrop-blur-sm"
          onClick={handleBackdropClick}
        >
          {/* Popup Container */}
          <motion.div
            initial={{ scale: 0.9, opacity: 0, y: 20 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            exit={{ scale: 0.9, opacity: 0, y: 20 }}
            transition={{ 
              type: "spring",
              duration: 0.3,
              bounce: 0.3
            }}
            className="bg-white rounded-3xl shadow-2xl border border-slate-200 overflow-hidden max-w-2xl w-full max-h-[90vh] overflow-y-auto"
          >
            {/* Header with gradient animation */}
            <motion.div 
              initial={{ y: -20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.1, duration: 0.3 }}
              className="bg-gradient-to-r from-emerald-600 to-teal-600 px-6 py-4 relative"
            >
              <h2 className="text-xl font-bold text-white pr-8">{title}</h2>
              
              {/* Close button with hover animation */}
              <motion.button
                onClick={close}
                className="absolute top-3 right-3 text-white/80 hover:text-white p-2 rounded-full hover:bg-white/10 transition-colors"
                whileHover={{ scale: 1.1, rotate: 90 }}
                whileTap={{ scale: 0.9 }}
                aria-label="Close"
              >
                <X className="w-5 h-5" />
              </motion.button>
            </motion.div>
            
            {/* Form Content */}
            <motion.div 
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.2, duration: 0.3 }}
              className="p-6 space-y-5"
            >
              {/* Financial Services Section */}
              <div className="space-y-4">
                <motion.h3 
                  initial={{ x: -10, opacity: 0 }}
                  animate={{ x: 0, opacity: 1 }}
                  transition={{ delay: 0.25 }}
                  className="text-lg font-semibold text-gray-800"
                >
                  Financial Services
                </motion.h3>
                
                {/* Nationality */}
                <motion.div 
                  initial={{ y: 10, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  transition={{ delay: 0.3 }}
                  className="space-y-1.5"
                >
                  <label className="text-sm font-medium text-gray-700 flex items-center gap-1">
                    Nationality <span className="text-red-500">*</span>
                  </label>
                  <div className="relative group">
                    <select className="w-full appearance-none bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 pr-10 text-gray-700 focus:outline-none focus:ring-2 focus:ring-emerald-400 focus:border-transparent transition-all duration-200 group-hover:border-emerald-300">
                      <option>Select</option>
                      <option>United States</option>
                      <option>Canada</option>
                      <option>India</option>
                      <option>United Kingdom</option>
                    </select>
                    <motion.div
                      animate={{ rotate: 0 }}
                      whileHover={{ scale: 1.1 }}
                      className="absolute right-3 top-3.5 pointer-events-none"
                    >
                      <ChevronDown className="w-5 h-5 text-gray-400" />
                    </motion.div>
                  </div>
                </motion.div>

                {/* Field of Study */}
                <motion.div 
                  initial={{ y: 10, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  transition={{ delay: 0.35 }}
                  className="space-y-1.5"
                >
                  <label className="text-sm font-medium text-gray-700">Field of Study</label>
                  <div className="relative group">
                    <select className="w-full appearance-none bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 pr-10 text-gray-700 focus:outline-none focus:ring-2 focus:ring-emerald-400 transition-all duration-200 group-hover:border-emerald-300">
                      <option>Select</option>
                      <option>Engineering</option>
                      <option>Business</option>
                      <option>Medicine</option>
                      <option>Arts</option>
                    </select>
                    <motion.div
                      animate={{ rotate: 0 }}
                      whileHover={{ scale: 1.1 }}
                      className="absolute right-3 top-3.5 pointer-events-none"
                    >
                      <ChevronDown className="w-5 h-5 text-gray-400" />
                    </motion.div>
                  </div>
                </motion.div>

                {/* Tuition Amount & Annual Income Row */}
                <div className="grid grid-cols-2 gap-4">
                  <motion.div 
                    initial={{ y: 10, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    transition={{ delay: 0.4 }}
                    className="space-y-1.5"
                  >
                    <label className="text-sm font-medium text-gray-700">Tuition Amount</label>
                    <div className="relative group">
                      <select className="w-full appearance-none bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 pr-10 text-gray-700 focus:outline-none focus:ring-2 focus:ring-emerald-400 transition-all duration-200 group-hover:border-emerald-300">
                        <option>Currency</option>
                        <option>USD ($)</option>
                        <option>EUR (€)</option>
                        <option>GBP (£)</option>
                      </select>
                      <ChevronDown className="absolute right-3 top-3.5 w-5 h-5 text-gray-400 pointer-events-none" />
                    </div>
                  </motion.div>

                  <motion.div 
                    initial={{ y: 10, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    transition={{ delay: 0.4 }}
                    className="space-y-1.5"
                  >
                    <label className="text-sm font-medium text-gray-700">Annual Income</label>
                    <div className="relative group">
                      <select className="w-full appearance-none bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 pr-10 text-gray-700 focus:outline-none focus:ring-2 focus:ring-emerald-400 transition-all duration-200 group-hover:border-emerald-300">
                        <option>Currency</option>
                        <option>USD ($)</option>
                        <option>EUR (€)</option>
                        <option>GBP (£)</option>
                      </select>
                      <ChevronDown className="absolute right-3 top-3.5 w-5 h-5 text-gray-400 pointer-events-none" />
                    </div>
                  </motion.div>
                </div>

                {/* Academic Tools Section */}
                <motion.h3 
                  initial={{ x: -10, opacity: 0 }}
                  animate={{ x: 0, opacity: 1 }}
                  transition={{ delay: 0.45 }}
                  className="text-lg font-semibold text-gray-800 pt-4"
                >
                  Academic Tools
                </motion.h3>

                {/* School Name */}
                <motion.div 
                  initial={{ y: 10, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  transition={{ delay: 0.5 }}
                  className="space-y-1.5"
                >
                  <label className="text-sm font-medium text-gray-700">School Name</label>
                  <div className="relative group">
                    <select className="w-full appearance-none bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 pr-10 text-gray-700 focus:outline-none focus:ring-2 focus:ring-emerald-400 transition-all duration-200 group-hover:border-emerald-300">
                      <option>Select</option>
                      <option>Harvard University</option>
                      <option>Stanford University</option>
                      <option>MIT</option>
                      <option>University of Toronto</option>
                    </select>
                    <ChevronDown className="absolute right-3 top-3.5 w-5 h-5 text-gray-400 pointer-events-none" />
                  </div>
                </motion.div>

                {/* Loan Amount */}
                <motion.div 
                  initial={{ y: 10, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  transition={{ delay: 0.55 }}
                  className="space-y-1.5"
                >
                  <label className="text-sm font-medium text-gray-700 flex items-center gap-1">
                    Loan Amount <span className="text-red-500">*</span>
                  </label>
                  <div className="relative group">
                    <select className="w-full appearance-none bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 pr-10 text-gray-700 focus:outline-none focus:ring-2 focus:ring-emerald-400 transition-all duration-200 group-hover:border-emerald-300">
                      <option>Currency</option>
                      <option>USD ($)</option>
                      <option>EUR (€)</option>
                      <option>GBP (£)</option>
                    </select>
                    <ChevronDown className="absolute right-3 top-3.5 w-5 h-5 text-gray-400 pointer-events-none" />
                  </div>
                </motion.div>

                {/* Employment Status */}
                <motion.div 
                  initial={{ y: 10, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  transition={{ delay: 0.6 }}
                  className="space-y-1.5"
                >
                  <label className="text-sm font-medium text-gray-700">Employment Status</label>
                  <div className="relative group">
                    <select className="w-full appearance-none bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 pr-10 text-gray-700 focus:outline-none focus:ring-2 focus:ring-emerald-400 transition-all duration-200 group-hover:border-emerald-300">
                      <option>Select</option>
                      <option>Employed Full-time</option>
                      <option>Employed Part-time</option>
                      <option>Self-employed</option>
                      <option>Unemployed</option>
                      <option>Student</option>
                    </select>
                    <ChevronDown className="absolute right-3 top-3.5 w-5 h-5 text-gray-400 pointer-events-none" />
                  </div>
                </motion.div>

                {/* Cosigner Radio */}
                <motion.div 
                  initial={{ y: 10, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  transition={{ delay: 0.65 }}
                  className="space-y-2 pt-2"
                >
                  <label className="text-sm font-medium text-gray-700">Do you have a cosigner?</label>
                  <div className="flex gap-6">
                    {['yes', 'no'].map((value) => (
                      <label key={value} className="flex items-center gap-2 cursor-pointer group">
                        <motion.div
                          whileHover={{ scale: 1.1 }}
                          whileTap={{ scale: 0.9 }}
                          className="relative"
                        >
                          <input
                            type="radio"
                            name="cosigner"
                            value={value}
                            checked={hasCosigner === value}
                            onChange={(e) => setHasCosigner(e.target.value)}
                            className="w-4 h-4 text-emerald-600 focus:ring-emerald-500"
                          />
                        </motion.div>
                        <span className="text-gray-700 capitalize group-hover:text-emerald-600 transition-colors">
                          {value}
                        </span>
                      </label>
                    ))}
                  </div>
                </motion.div>

                {/* Check Eligibility Button */}
                <motion.button 
                  initial={{ y: 10, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  transition={{ delay: 0.7 }}
                  whileHover={{ scale: 1.02, boxShadow: "0 20px 25px -5px rgb(16 185 129 / 0.3)" }}
                  whileTap={{ scale: 0.98 }}
                  className="w-full mt-6 bg-gradient-to-r from-emerald-600 to-teal-600 text-white font-semibold py-3.5 px-4 rounded-xl hover:from-emerald-700 hover:to-teal-700 transition-all shadow-lg shadow-emerald-200"
                >
                  Check Eligibility
                </motion.button>
              </div>
            </motion.div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}