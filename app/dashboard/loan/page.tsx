'use client';

import { useState } from 'react';
import { useForm, SubmitHandler } from 'react-hook-form';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronDown, MessageCircle } from 'lucide-react';

interface LoanFormData {
  // Student Information
  nationality: string;
  schoolName: string;
  firstName: string;
  email: string;
  phoneNumber: string;
  destinationCountry: string;
  programName: string;
  lastName: string;
  confirmEmail: string;
  whatsappNumber: string;
  
  // Contact Information
  phoneCode: string;
  countryOfResidence: string;
  provinceState: string;
  postalCode: string;
  expectedGraduationDate: string;
  city: string;
  address: string;
  fieldOfStudy: string;
  expectedArrivalDate: string;
  
  // Loan Information
  loanAmount: string;
  referenceName: string;
  loanCurrency: string;
  referenceContactNumber: string;
  referenceContactCode: string;
  referenceEmail: string;
  
  // Consent
  consent1: boolean;
  consent2: boolean;
  
  // Same as phone toggle
  sameAsPhone: boolean;
}

interface LoanFormProps {
  onSubmit?: (data: LoanFormData) => void;
}

export default function LoanApplicationForm({ onSubmit }: LoanFormProps) {
  const [activeSection, setActiveSection] = useState(1);
  
  const {
    register,
    handleSubmit,
    watch,
    setValue,
    formState: { errors, isSubmitting }
  } = useForm<LoanFormData>({
    defaultValues: {
      phoneCode: '+1',
      referenceContactCode: '+1',
      sameAsPhone: false,
      consent1: false,
      consent2: false,
    }
  });

  const sameAsPhone = watch('sameAsPhone');
  const phoneNumber = watch('phoneNumber');
  const phoneCode = watch('phoneCode');

  // Handle same as phone toggle
  if (sameAsPhone && phoneNumber) {
    setValue('whatsappNumber', phoneNumber);
    setValue('referenceContactCode', phoneCode);
  }

  const onSubmitHandler: SubmitHandler<LoanFormData> = (data) => {
    if (onSubmit) {
      onSubmit(data);
    }
    console.log('Form Data:', data);
    // Handle form submission here
  };

  // Animation variants
  const sectionVariants = {
    hidden: { opacity: 0, x: 20 },
    visible: { opacity: 1, x: 0 },
    exit: { opacity: 0, x: -20 }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-indigo-50/30 py-8 px-4 md:px-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <motion.div 
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-gradient-to-r from-indigo-600 to-purple-600 rounded-3xl px-8 py-6 mb-8 shadow-xl"
        >
          <h1 className="text-2xl md:text-3xl font-bold text-white">ooshas Student Loans:</h1>
          <h2 className="text-xl md:text-2xl font-semibold text-indigo-100 mt-1">Funding Your Journey to Success</h2>
          <p className="text-indigo-50 mt-2 text-sm md:text-base">Get the funds you need for the education you deserve! Invest in your future with our tailored study abroad loans.</p>
        </motion.div>

        <form onSubmit={handleSubmit(onSubmitHandler)} className="space-y-8">
          {/* Progress Indicator */}
          <div className="flex items-center gap-2 mb-6 max-w-3xl mx-auto">
            {[1, 2, 3].map((step) => (
              <motion.div
                key={step}
                initial={{ scaleX: 0 }}
                animate={{ scaleX: 1 }}
                className="flex-1"
              >
                <div className={`h-2 rounded-full transition-all duration-300 ${
                  step <= activeSection ? 'bg-indigo-600' : 'bg-gray-200'
                }`} />
              </motion.div>
            ))}
          </div>

          <AnimatePresence mode="wait">
            {/* Section 1: Student Information */}
            {activeSection === 1 && (
              <motion.div
                key="section1"
                variants={sectionVariants}
                initial="hidden"
                animate="visible"
                exit="exit"
                transition={{ duration: 0.3 }}
                className="bg-white rounded-3xl shadow-xl border border-slate-200 p-6 md:p-8"
              >
                <h3 className="text-xl font-semibold text-gray-800 border-b border-gray-200 pb-3 mb-6">Student Information</h3>
                
                <div className="grid md:grid-cols-2 gap-5">
                  {/* Nationality */}
                  <div className="space-y-1.5">
                    <label className="text-sm font-medium text-gray-700 flex items-center gap-1">
                      Nationality <span className="text-red-500">*</span>
                    </label>
                    <div className="relative">
                      <select
                        {...register('nationality', { required: 'Nationality is required' })}
                        className={`w-full appearance-none bg-gray-50 border rounded-xl px-4 py-3 pr-10 text-gray-700 focus:outline-none focus:ring-2 focus:ring-indigo-400 ${
                          errors.nationality ? 'border-red-500' : 'border-gray-200'
                        }`}
                      >
                        <option value="">Select</option>
                        <option value="US">United States</option>
                        <option value="CA">Canada</option>
                        <option value="IN">India</option>
                        <option value="UK">United Kingdom</option>
                        <option value="AU">Australia</option>
                      </select>
                      <ChevronDown className="absolute right-3 top-3.5 w-5 h-5 text-gray-400 pointer-events-none" />
                    </div>
                    {errors.nationality && (
                      <p className="text-red-500 text-xs mt-1">{errors.nationality.message}</p>
                    )}
                  </div>

                  {/* School Name */}
                  <div className="space-y-1.5">
                    <label className="text-sm font-medium text-gray-700 flex items-center gap-1">
                      School name <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      {...register('schoolName', { required: 'School name is required' })}
                      placeholder="Start typing to see the suggestions"
                      className={`w-full bg-gray-50 border rounded-xl px-4 py-3 text-gray-700 focus:outline-none focus:ring-2 focus:ring-indigo-400 ${
                        errors.schoolName ? 'border-red-500' : 'border-gray-200'
                      }`}
                    />
                    {errors.schoolName && (
                      <p className="text-red-500 text-xs mt-1">{errors.schoolName.message}</p>
                    )}
                  </div>

                  {/* First Name */}
                  <div className="space-y-1.5">
                    <label className="text-sm font-medium text-gray-700 flex items-center gap-1">
                      First name <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      {...register('firstName', { required: 'First name is required' })}
                      className={`w-full bg-gray-50 border rounded-xl px-4 py-3 text-gray-700 focus:outline-none focus:ring-2 focus:ring-indigo-400 ${
                        errors.firstName ? 'border-red-500' : 'border-gray-200'
                      }`}
                    />
                    {errors.firstName && (
                      <p className="text-red-500 text-xs mt-1">{errors.firstName.message}</p>
                    )}
                  </div>

                  {/* Email */}
                  <div className="space-y-1.5">
                    <label className="text-sm font-medium text-gray-700 flex items-center gap-1">
                      Email <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="email"
                      {...register('email', { 
                        required: 'Email is required',
                        pattern: {
                          value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                          message: 'Invalid email address'
                        }
                      })}
                      className={`w-full bg-gray-50 border rounded-xl px-4 py-3 text-gray-700 focus:outline-none focus:ring-2 focus:ring-indigo-400 ${
                        errors.email ? 'border-red-500' : 'border-gray-200'
                      }`}
                    />
                    {errors.email && (
                      <p className="text-red-500 text-xs mt-1">{errors.email.message}</p>
                    )}
                  </div>

                  {/* Phone Number */}
                  <div className="space-y-1.5">
                    <label className="text-sm font-medium text-gray-700 flex items-center gap-1">
                      Phone number <span className="text-red-500">*</span>
                    </label>
                    <div className="flex gap-2">
                      <select
                        {...register('phoneCode')}
                        className="w-24 bg-gray-50 border border-gray-200 rounded-xl px-3 py-3 text-gray-700 focus:outline-none focus:ring-2 focus:ring-indigo-400"
                      >
                        <option value="+1">+1</option>
                        <option value="+44">+44</option>
                        <option value="+91">+91</option>
                        <option value="+61">+61</option>
                      </select>
                      <input
                        type="tel"
                        {...register('phoneNumber', { required: 'Phone number is required' })}
                        className={`flex-1 bg-gray-50 border rounded-xl px-4 py-3 text-gray-700 focus:outline-none focus:ring-2 focus:ring-indigo-400 ${
                          errors.phoneNumber ? 'border-red-500' : 'border-gray-200'
                        }`}
                      />
                    </div>
                    {errors.phoneNumber && (
                      <p className="text-red-500 text-xs mt-1">{errors.phoneNumber.message}</p>
                    )}
                  </div>

                  {/* Destination Country */}
                  <div className="space-y-1.5">
                    <label className="text-sm font-medium text-gray-700 flex items-center gap-1">
                      Destination Country <span className="text-red-500">*</span>
                    </label>
                    <div className="relative">
                      <select
                        {...register('destinationCountry', { required: 'Destination country is required' })}
                        className={`w-full appearance-none bg-gray-50 border rounded-xl px-4 py-3 pr-10 text-gray-700 focus:outline-none focus:ring-2 focus:ring-indigo-400 ${
                          errors.destinationCountry ? 'border-red-500' : 'border-gray-200'
                        }`}
                      >
                        <option value="">Select</option>
                        <option value="CA">Canada</option>
                        <option value="US">USA</option>
                        <option value="UK">UK</option>
                        <option value="AU">Australia</option>
                      </select>
                      <ChevronDown className="absolute right-3 top-3.5 w-5 h-5 text-gray-400 pointer-events-none" />
                    </div>
                    {errors.destinationCountry && (
                      <p className="text-red-500 text-xs mt-1">{errors.destinationCountry.message}</p>
                    )}
                  </div>

                  {/* Program Name */}
                  <div className="space-y-1.5 md:col-span-2">
                    <label className="text-sm font-medium text-gray-700 flex items-center gap-1">
                      Program name <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      {...register('programName', { required: 'Program name is required' })}
                      placeholder="Start typing to see the suggestions"
                      className={`w-full bg-gray-50 border rounded-xl px-4 py-3 text-gray-700 focus:outline-none focus:ring-2 focus:ring-indigo-400 ${
                        errors.programName ? 'border-red-500' : 'border-gray-200'
                      }`}
                    />
                    <p className="text-xs text-gray-500 mt-1">Please type more so that we can provide suggestions</p>
                    {errors.programName && (
                      <p className="text-red-500 text-xs mt-1">{errors.programName.message}</p>
                    )}
                  </div>

                  {/* Last Name */}
                  <div className="space-y-1.5">
                    <label className="text-sm font-medium text-gray-700">Last name</label>
                    <input
                      type="text"
                      {...register('lastName')}
                      className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 text-gray-700 focus:outline-none focus:ring-2 focus:ring-indigo-400"
                    />
                  </div>

                  {/* Confirm Email */}
                  <div className="space-y-1.5">
                    <label className="text-sm font-medium text-gray-700 flex items-center gap-1">
                      Confirm Email <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="email"
                      {...register('confirmEmail', { 
                        required: 'Please confirm your email',
                        validate: (value, formValues) => 
                          value === formValues.email || 'Emails do not match'
                      })}
                      className={`w-full bg-gray-50 border rounded-xl px-4 py-3 text-gray-700 focus:outline-none focus:ring-2 focus:ring-indigo-400 ${
                        errors.confirmEmail ? 'border-red-500' : 'border-gray-200'
                      }`}
                    />
                    {errors.confirmEmail && (
                      <p className="text-red-500 text-xs mt-1">{errors.confirmEmail.message}</p>
                    )}
                  </div>

                  {/* WhatsApp Number */}
                  <div className="space-y-1.5">
                    <label className="text-sm font-medium text-gray-700 flex items-center gap-1">
                      WhatsApp number
                    </label>
                    <div className="flex gap-2">
                      <select
                        {...register('referenceContactCode')}
                        className="w-24 bg-gray-50 border border-gray-200 rounded-xl px-3 py-3 text-gray-700 focus:outline-none focus:ring-2 focus:ring-indigo-400"
                      >
                        <option value="+1">+1</option>
                        <option value="+44">+44</option>
                        <option value="+91">+91</option>
                      </select>
                      <input
                        type="tel"
                        {...register('whatsappNumber')}
                        className="flex-1 bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 text-gray-700 focus:outline-none focus:ring-2 focus:ring-indigo-400"
                      />
                    </div>
                  </div>
                </div>

                <div className="flex justify-end mt-8">
                  <button
                    type="button"
                    onClick={() => setActiveSection(2)}
                    className="px-8 py-3 bg-indigo-600 text-white font-semibold rounded-xl hover:bg-indigo-700 transition shadow-lg shadow-indigo-200"
                  >
                    Next: Contact Information
                  </button>
                </div>
              </motion.div>
            )}

            {/* Section 2: Contact & Additional Information */}
            {activeSection === 2 && (
              <motion.div
                key="section2"
                variants={sectionVariants}
                initial="hidden"
                animate="visible"
                exit="exit"
                transition={{ duration: 0.3 }}
                className="bg-white rounded-3xl shadow-xl border border-slate-200 p-6 md:p-8"
              >
                <h3 className="text-xl font-semibold text-gray-800 border-b border-gray-200 pb-3 mb-6">Contact Information</h3>
                
                <div className="grid md:grid-cols-2 gap-5">
                  {/* Country of Residence */}
                  <div className="space-y-1.5">
                    <label className="text-sm font-medium text-gray-700 flex items-center gap-1">
                      Country of Residence <span className="text-red-500">*</span>
                    </label>
                    <div className="relative">
                      <select
                        {...register('countryOfResidence', { required: 'Country of residence is required' })}
                        className={`w-full appearance-none bg-gray-50 border rounded-xl px-4 py-3 pr-10 text-gray-700 focus:outline-none focus:ring-2 focus:ring-indigo-400 ${
                          errors.countryOfResidence ? 'border-red-500' : 'border-gray-200'
                        }`}
                      >
                        <option value="">Select</option>
                        <option value="US">United States</option>
                        <option value="CA">Canada</option>
                        <option value="IN">India</option>
                      </select>
                      <ChevronDown className="absolute right-3 top-3.5 w-5 h-5 text-gray-400 pointer-events-none" />
                    </div>
                    {errors.countryOfResidence && (
                      <p className="text-red-500 text-xs mt-1">{errors.countryOfResidence.message}</p>
                    )}
                  </div>

                  {/* Province/State */}
                  <div className="space-y-1.5">
                    <label className="text-sm font-medium text-gray-700 flex items-center gap-1">
                      Province/State <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      {...register('provinceState', { required: 'Province/State is required' })}
                      className={`w-full bg-gray-50 border rounded-xl px-4 py-3 text-gray-700 focus:outline-none focus:ring-2 focus:ring-indigo-400 ${
                        errors.provinceState ? 'border-red-500' : 'border-gray-200'
                      }`}
                    />
                    {errors.provinceState && (
                      <p className="text-red-500 text-xs mt-1">{errors.provinceState.message}</p>
                    )}
                  </div>

                  {/* Postal Code */}
                  <div className="space-y-1.5">
                    <label className="text-sm font-medium text-gray-700 flex items-center gap-1">
                      Postal Code <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      {...register('postalCode', { required: 'Postal code is required' })}
                      className={`w-full bg-gray-50 border rounded-xl px-4 py-3 text-gray-700 focus:outline-none focus:ring-2 focus:ring-indigo-400 ${
                        errors.postalCode ? 'border-red-500' : 'border-gray-200'
                      }`}
                    />
                    {errors.postalCode && (
                      <p className="text-red-500 text-xs mt-1">{errors.postalCode.message}</p>
                    )}
                  </div>

                  {/* Expected Graduation Date */}
                  <div className="space-y-1.5">
                    <label className="text-sm font-medium text-gray-700 flex items-center gap-1">
                      Expected Graduation Date <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="date"
                      {...register('expectedGraduationDate', { required: 'Expected graduation date is required' })}
                      className={`w-full bg-gray-50 border rounded-xl px-4 py-3 text-gray-700 focus:outline-none focus:ring-2 focus:ring-indigo-400 ${
                        errors.expectedGraduationDate ? 'border-red-500' : 'border-gray-200'
                      }`}
                    />
                    {errors.expectedGraduationDate && (
                      <p className="text-red-500 text-xs mt-1">{errors.expectedGraduationDate.message}</p>
                    )}
                  </div>

                  {/* Same as Phone Number toggle */}
                  <div className="md:col-span-2 flex items-center gap-3 p-4 bg-gray-50 rounded-xl">
                    <input
                      type="checkbox"
                      id="sameAsPhone"
                      {...register('sameAsPhone')}
                      className="w-5 h-5 text-indigo-600 rounded focus:ring-indigo-500"
                    />
                    <label htmlFor="sameAsPhone" className="text-sm font-medium text-gray-700">
                      Same as Phone Number
                    </label>
                  </div>

                  {/* City */}
                  <div className="space-y-1.5">
                    <label className="text-sm font-medium text-gray-700 flex items-center gap-1">
                      City <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      {...register('city', { required: 'City is required' })}
                      className={`w-full bg-gray-50 border rounded-xl px-4 py-3 text-gray-700 focus:outline-none focus:ring-2 focus:ring-indigo-400 ${
                        errors.city ? 'border-red-500' : 'border-gray-200'
                      }`}
                    />
                    {errors.city && (
                      <p className="text-red-500 text-xs mt-1">{errors.city.message}</p>
                    )}
                  </div>

                  {/* Address */}
                  <div className="space-y-1.5">
                    <label className="text-sm font-medium text-gray-700 flex items-center gap-1">
                      Address <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      {...register('address', { required: 'Address is required' })}
                      className={`w-full bg-gray-50 border rounded-xl px-4 py-3 text-gray-700 focus:outline-none focus:ring-2 focus:ring-indigo-400 ${
                        errors.address ? 'border-red-500' : 'border-gray-200'
                      }`}
                    />
                    {errors.address && (
                      <p className="text-red-500 text-xs mt-1">{errors.address.message}</p>
                    )}
                  </div>

                  {/* Field of Study */}
                  <div className="space-y-1.5">
                    <label className="text-sm font-medium text-gray-700 flex items-center gap-1">
                      Field of study <span className="text-red-500">*</span>
                    </label>
                    <div className="relative">
                      <select
                        {...register('fieldOfStudy', { required: 'Field of study is required' })}
                        className={`w-full appearance-none bg-gray-50 border rounded-xl px-4 py-3 pr-10 text-gray-700 focus:outline-none focus:ring-2 focus:ring-indigo-400 ${
                          errors.fieldOfStudy ? 'border-red-500' : 'border-gray-200'
                        }`}
                      >
                        <option value="">Select</option>
                        <option value="engineering">Engineering</option>
                        <option value="business">Business</option>
                        <option value="medicine">Medicine</option>
                        <option value="arts">Arts</option>
                      </select>
                      <ChevronDown className="absolute right-3 top-3.5 w-5 h-5 text-gray-400 pointer-events-none" />
                    </div>
                    {errors.fieldOfStudy && (
                      <p className="text-red-500 text-xs mt-1">{errors.fieldOfStudy.message}</p>
                    )}
                  </div>

                  {/* Expected Arrival Date */}
                  <div className="space-y-1.5">
                    <label className="text-sm font-medium text-gray-700 flex items-center gap-1">
                      Expected Arrival Date <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="date"
                      {...register('expectedArrivalDate', { required: 'Expected arrival date is required' })}
                      className={`w-full bg-gray-50 border rounded-xl px-4 py-3 text-gray-700 focus:outline-none focus:ring-2 focus:ring-indigo-400 ${
                        errors.expectedArrivalDate ? 'border-red-500' : 'border-gray-200'
                      }`}
                    />
                    {errors.expectedArrivalDate && (
                      <p className="text-red-500 text-xs mt-1">{errors.expectedArrivalDate.message}</p>
                    )}
                  </div>
                </div>

                <div className="flex justify-between mt-8">
                  <button
                    type="button"
                    onClick={() => setActiveSection(1)}
                    className="px-6 py-3 bg-gray-100 text-gray-700 font-semibold rounded-xl hover:bg-gray-200 transition"
                  >
                    Previous
                  </button>
                  <button
                    type="button"
                    onClick={() => setActiveSection(3)}
                    className="px-8 py-3 bg-indigo-600 text-white font-semibold rounded-xl hover:bg-indigo-700 transition shadow-lg shadow-indigo-200"
                  >
                    Next: Loan Details
                  </button>
                </div>
              </motion.div>
            )}

            {/* Section 3: Loan Details & Consent */}
            {activeSection === 3 && (
              <motion.div
                key="section3"
                variants={sectionVariants}
                initial="hidden"
                animate="visible"
                exit="exit"
                transition={{ duration: 0.3 }}
                className="bg-white rounded-3xl shadow-xl border border-slate-200 p-6 md:p-8"
              >
                <h3 className="text-xl font-semibold text-gray-800 border-b border-gray-200 pb-3 mb-6">Loan Information</h3>
                
                <div className="grid md:grid-cols-2 gap-5">
                  {/* Loan Amount */}
                  <div className="space-y-1.5">
                    <label className="text-sm font-medium text-gray-700 flex items-center gap-1">
                      Loan Amount <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="number"
                      {...register('loanAmount', { required: 'Loan amount is required' })}
                      className={`w-full bg-gray-50 border rounded-xl px-4 py-3 text-gray-700 focus:outline-none focus:ring-2 focus:ring-indigo-400 ${
                        errors.loanAmount ? 'border-red-500' : 'border-gray-200'
                      }`}
                    />
                    {errors.loanAmount && (
                      <p className="text-red-500 text-xs mt-1">{errors.loanAmount.message}</p>
                    )}
                  </div>

                  {/* Loan Currency */}
                  <div className="space-y-1.5">
                    <label className="text-sm font-medium text-gray-700 flex items-center gap-1">
                      Loan Currency <span className="text-red-500">*</span>
                    </label>
                    <div className="relative">
                      <select
                        {...register('loanCurrency', { required: 'Loan currency is required' })}
                        className={`w-full appearance-none bg-gray-50 border rounded-xl px-4 py-3 pr-10 text-gray-700 focus:outline-none focus:ring-2 focus:ring-indigo-400 ${
                          errors.loanCurrency ? 'border-red-500' : 'border-gray-200'
                        }`}
                      >
                        <option value="">Select</option>
                        <option value="USD">USD ($)</option>
                        <option value="CAD">CAD ($)</option>
                        <option value="EUR">EUR (€)</option>
                        <option value="GBP">GBP (£)</option>
                      </select>
                      <ChevronDown className="absolute right-3 top-3.5 w-5 h-5 text-gray-400 pointer-events-none" />
                    </div>
                    {errors.loanCurrency && (
                      <p className="text-red-500 text-xs mt-1">{errors.loanCurrency.message}</p>
                    )}
                  </div>

                  {/* Reference Name */}
                  <div className="space-y-1.5">
                    <label className="text-sm font-medium text-gray-700 flex items-center gap-1">
                      Reference Name <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      {...register('referenceName', { required: 'Reference name is required' })}
                      className={`w-full bg-gray-50 border rounded-xl px-4 py-3 text-gray-700 focus:outline-none focus:ring-2 focus:ring-indigo-400 ${
                        errors.referenceName ? 'border-red-500' : 'border-gray-200'
                      }`}
                    />
                    {errors.referenceName && (
                      <p className="text-red-500 text-xs mt-1">{errors.referenceName.message}</p>
                    )}
                  </div>

                  {/* Reference Contact Number */}
                  <div className="space-y-1.5">
                    <label className="text-sm font-medium text-gray-700 flex items-center gap-1">
                      Reference Contact Number <span className="text-red-500">*</span>
                    </label>
                    <div className="flex gap-2">
                      <select
                        {...register('referenceContactCode')}
                        className="w-24 bg-gray-50 border border-gray-200 rounded-xl px-3 py-3 text-gray-700 focus:outline-none focus:ring-2 focus:ring-indigo-400"
                      >
                        <option value="+1">+1</option>
                        <option value="+44">+44</option>
                        <option value="+91">+91</option>
                      </select>
                      <input
                        type="tel"
                        {...register('referenceContactNumber', { required: 'Reference contact number is required' })}
                        className={`flex-1 bg-gray-50 border rounded-xl px-4 py-3 text-gray-700 focus:outline-none focus:ring-2 focus:ring-indigo-400 ${
                          errors.referenceContactNumber ? 'border-red-500' : 'border-gray-200'
                        }`}
                      />
                    </div>
                    {errors.referenceContactNumber && (
                      <p className="text-red-500 text-xs mt-1">{errors.referenceContactNumber.message}</p>
                    )}
                  </div>

                  {/* Reference Email */}
                  <div className="space-y-1.5 md:col-span-2">
                    <label className="text-sm font-medium text-gray-700 flex items-center gap-1">
                      Reference Email <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="email"
                      {...register('referenceEmail', { 
                        required: 'Reference email is required',
                        pattern: {
                          value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                          message: 'Invalid email address'
                        }
                      })}
                      className={`w-full bg-gray-50 border rounded-xl px-4 py-3 text-gray-700 focus:outline-none focus:ring-2 focus:ring-indigo-400 ${
                        errors.referenceEmail ? 'border-red-500' : 'border-gray-200'
                      }`}
                    />
                    {errors.referenceEmail && (
                      <p className="text-red-500 text-xs mt-1">{errors.referenceEmail.message}</p>
                    )}
                  </div>
                </div>

                {/* Agreement & Consent */}
                <div className="space-y-4 mt-8">
                  <h4 className="font-semibold text-gray-800">Agreement & Consent</h4>
                  
                  <label className="flex gap-3 cursor-pointer group">
                    <input
                      type="checkbox"
                      {...register('consent1', { required: 'You must agree to continue' })}
                      className="w-5 h-5 text-indigo-600 rounded mt-0.5 focus:ring-indigo-500"
                    />
                    <span className="text-sm text-gray-600 group-hover:text-gray-800 transition">
                      * Ooshas is committed to protecting and respecting your privacy. By submitting your information, you understand and agree that we will use your personal information to assist in providing you with a student loan. This includes sharing your information with financial institutions. Click here to learn more about your rights and ApplyBoard's privacy practices. I have reviewed and consented to the ApplyBoard Terms and Conditions, Privacy Policy, and the collection of my personal information
                    </span>
                  </label>
                  {errors.consent1 && (
                    <p className="text-red-500 text-xs mt-1">{errors.consent1.message}</p>
                  )}

                  <label className="flex gap-3 cursor-pointer group">
                    <input
                      type="checkbox"
                      {...register('consent2', { required: 'You must agree to the terms' })}
                      className="w-5 h-5 text-indigo-600 rounded mt-0.5 focus:ring-indigo-500"
                    />
                    <span className="text-sm text-gray-600 group-hover:text-gray-800 transition">
                      * By submitting the application you agree to our Terms and conditions
                    </span>
                  </label>
                  {errors.consent2 && (
                    <p className="text-red-500 text-xs mt-1">{errors.consent2.message}</p>
                  )}

                  <p className="text-sm text-gray-500 italic">Fields marked with * are mandatory</p>
                </div>

                <div className="flex justify-between mt-8">
                  <button
                    type="button"
                    onClick={() => setActiveSection(2)}
                    className="px-6 py-3 bg-gray-100 text-gray-700 font-semibold rounded-xl hover:bg-gray-200 transition"
                  >
                    Previous
                  </button>
                  <motion.button
                    type="submit"
                    disabled={isSubmitting}
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    className="px-8 py-3 bg-gradient-to-r from-indigo-600 to-purple-600 text-white font-semibold rounded-xl hover:from-indigo-700 hover:to-purple-700 transition shadow-lg shadow-indigo-200 flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {isSubmitting ? 'Submitting...' : 'Submit Loan Application'}
                    <span className="text-lg">→</span>
                  </motion.button>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </form>

        {/* Live Chat */}
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.8 }}
          className="fixed bottom-6 right-6"
        >
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="bg-indigo-600 text-white px-4 py-3 rounded-full shadow-lg flex items-center gap-2 hover:bg-indigo-700 transition"
          >
            <MessageCircle className="w-5 h-5" />
            <span>Live Chat</span>
          </motion.button>
        </motion.div>
      </div>
    </div>
  );
}