"use client"
import React, { use, useCallback, useEffect, useState } from 'react'
import { useForm, FormProvider, useFormContext } from 'react-hook-form'
import { motion, AnimatePresence } from 'framer-motion'
import { ChevronRight, ChevronLeft, GraduationCap, Award, Globe, FileText, Briefcase, Languages, CheckCircle } from 'lucide-react'
import axiosInstance from '../axiosInstance'
import { ModernSelect } from '@/components/ui/select'



// Step 1: Field of Study
const Step1 = ({ register, watch }: any) => {
  const fields = [
    "Accounting & Commerce",
    "Banking, Finance & Insurance",
    "Computer Science & IT",
    "Engineering",
    "Medicine & Health",
    "Arts & Humanities",
    "Business & Management",
    "Law",
    "Science & Mathematics",
    "Other"
  ]

  return (
    <motion.div
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -20 }}
      className="space-y-6"
    >
      <div className="text-center mb-8">
        <h3 className="text-2xl font-bold text-gray-800">What field are you considering for your Master's degree?</h3>
        <p className="text-gray-500 mt-2">Select your preferred field of study</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
        {fields.map((field) => (
          <label
            key={field}
            className={`flex items-center p-4 border-2 rounded-xl cursor-pointer transition-all ${watch('fieldOfStudy') === field
              ? 'border-orange-500 bg-orange-50'
              : 'border-gray-200 hover:border-orange-300 hover:bg-orange-50/50'
              }`}
          >
            <input
              type="radio"
              value={field}
              {...register('fieldOfStudy', { required: true })}
              className="w-4 h-4 text-orange-500 focus:ring-orange-500"
            />
            <span className="ml-3 text-gray-700">{field}</span>
          </label>
        ))}
      </div>


    </motion.div>
  )
}

// Step 2: Country Selection
const Step2 = ({ register, watch }: any) => {
  const countries = [
    { name: "Canada", flag: "🇨🇦", code: "CA" },
    { name: "UAE", flag: "🇦🇪", code: "AE" },
    { name: "USA", flag: "🇺🇸", code: "US" },
    { name: "UK", flag: "🇬🇧", code: "GB" },
    { name: "Australia", flag: "🇦🇺", code: "AU" },
    { name: "Germany", flag: "🇩🇪", code: "DE" },
    { name: "New Zealand", flag: "🇳🇿", code: "NZ" },
    { name: "New Zealand", flag: "🇳🇿", code: "NZ" }
  ]

  const {setValue}= useFormContext()

  const [selectCountry, setselectCountry] = useState([])
  const [opencountry, setopencountry] = useState(false)

  

  const fetchCountries = useCallback(async () => {
    try {
      const response = await axiosInstance.get(
        "/countries?isFeatured=Yes&limit=300",
      );
      const data = response.data.data;
      let formatData = data.map((country) => ({
        label: country.name,
        value: country.code,
      }));
      setselectCountry(formatData);
    } catch (error) {
      console.error("Error fetching countries:", error);
    }
  });

  useEffect(() => {
    fetchCountries();
  }, []);

  return (
    <motion.div
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -20 }}
      className="space-y-6"
    >
      <div className="text-center mb-8">
        <h3 className="text-2xl font-bold text-gray-800">Which country are you considering for studying abroad?</h3>
        <p className="text-gray-500 mt-2">Select your preferred destination</p>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        {countries.map((country) => (
          <label
            key={country.code}
            className={`flex flex-col items-center p-4 border-2 rounded-xl cursor-pointer transition-all ${watch('country') === country.code
              ? 'border-orange-500 bg-orange-50'
              : 'border-gray-200 hover:border-orange-300 hover:bg-orange-50/50'
              }`}
          >
            <input
              type="radio"
              value={country.code}
              {...register('country', { required: true })}
              className="hidden"
            />
            <span className="text-gray-700 font-medium">{country.name}</span>
          </label>
        ))}
      </div>

      <button onClick={() => setopencountry(true)} className="text-orange-500 font-medium hover:underline block mx-auto">
        View All Countries →
      </button>
      {opencountry && <ModernSelect
        options={selectCountry}
        value={watch('country')}
        onChange={(value: string) => setValue('country', value)}
        placeholder="Select Country"
      />}
    </motion.div>
  )
}

// Step 3: Percentage Input
const Step3 = ({ register, formState: { errors } }: any) => {
  return (
    <motion.div
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -20 }}
      className="space-y-6"
    >
      <div className="text-center mb-8">
        <h3 className="text-2xl font-bold text-gray-800">Enter your Bachelor's actual/expected percentage</h3>
        <p className="text-gray-500 mt-2">Your class Bachelor's percentage is required when applying to undergraduate programs.</p>
      </div>

      <div className="max-w-md mx-auto">
        <div className="relative">
          <input
            type="number"
            step="0.01"
            placeholder="Enter Percentage"
            {...register('percentage', {
              required: "Percentage is required",
              min: { value: 0, message: "Minimum 0%" },
              max: { value: 100, message: "Maximum 100%" }
            })}
            className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-orange-500 focus:outline-none transition-colors"
          />
          <span className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400">%</span>
        </div>
        {errors.percentage && (
          <p className="text-red-500 text-sm mt-2">{errors.percentage.message}</p>
        )}
      </div>
    </motion.div>
  )
}

// Step 4: English Proficiency Test
const Step4 = ({ register, watch, setValue }: any) => {
  const tests = ["IELTS", "TOEFL", "PTE", "DET", "None Taken"]
  const selectedTest = watch('englishTest')

  return (
    <motion.div
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -20 }}
      className="space-y-6"
    >
      <div className="text-center mb-8">
        <h3 className="text-2xl font-bold text-gray-800">Which English proficiency exam have you taken?</h3>
        <p className="text-gray-500 mt-2">Select the exam you've taken or plan to take</p>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-5 gap-3">
        {tests.map((test) => (
          <label
            key={test}
            className={`flex items-center justify-center p-3 border-2 rounded-xl cursor-pointer transition-all ${selectedTest === test
              ? 'border-orange-500 bg-orange-50'
              : 'border-gray-200 hover:border-orange-300'
              }`}
          >
            <input
              type="radio"
              value={test}
              {...register('englishTest', { required: true })}
              className="hidden"
            />
            <span className="text-gray-700 font-medium">{test}</span>
          </label>
        ))}
      </div>

      {selectedTest && selectedTest !== "None Taken" && (
        <div className="max-w-md mx-auto mt-6">
          <label className="block text-gray-700 font-medium mb-2">Score</label>
          <input
            type="text"
            placeholder="Enter your score (e.g., 7.5)"
            {...register('englishScore')}
            className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-orange-500 focus:outline-none transition-colors"
          />
        </div>
      )}
    </motion.div>
  )
}

// Step 5: Standardized Exam
const Step5 = ({ register, watch }: any) => {
  const exams = ["GRE", "GMAT", "None Taken"]
  const selectedExam = watch('standardExam')

  return (
    <motion.div
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -20 }}
      className="space-y-6"
    >
      <div className="text-center mb-8">
        <h3 className="text-2xl font-bold text-gray-800">Which Standardised exam have you taken?</h3>
        <p className="text-gray-500 mt-2">Select the exam you've taken for admissions</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-3 max-w-md mx-auto">
        {exams.map((exam) => (
          <label
            key={exam}
            className={`flex items-center justify-center p-3 border-2 rounded-xl cursor-pointer transition-all ${selectedExam === exam
              ? 'border-orange-500 bg-orange-50'
              : 'border-gray-200 hover:border-orange-300'
              }`}
          >
            <input
              type="radio"
              value={exam}
              {...register('standardExam', { required: true })}
              className="hidden"
            />
            <span className="text-gray-700 font-medium">{exam}</span>
          </label>
        ))}
      </div>

      {selectedExam && selectedExam !== "None Taken" && (
        <div className="max-w-md mx-auto mt-6">
          <label className="block text-gray-700 font-medium mb-2">Score</label>
          <input
            type="text"
            placeholder="Enter your score"
            {...register('examScore')}
            className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-orange-500 focus:outline-none transition-colors"
          />
        </div>
      )}
    </motion.div>
  )
}

// Step 6: Work Experience
const Step6 = ({ register, watch }: any) => {
  const experiences = ["0-1 yrs", "1-2 yrs", "2-3 yrs", "3-4 yrs", "4+ yrs"]

  return (
    <motion.div
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -20 }}
      className="space-y-6"
    >
      <div className="text-center mb-8">
        <h3 className="text-2xl font-bold text-gray-800">How many years of work experience do you have?</h3>
        <p className="text-gray-500 mt-2">Include full-time work experience after graduation</p>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-5 gap-3">
        {experiences.map((exp) => (
          <label
            key={exp}
            className={`flex items-center justify-center p-3 border-2 rounded-xl cursor-pointer transition-all ${watch('experience') === exp
              ? 'border-orange-500 bg-orange-50'
              : 'border-gray-200 hover:border-orange-300'
              }`}
          >
            <input
              type="radio"
              value={exp}
              {...register('experience', { required: true })}
              className="hidden"
            />
            <span className="text-gray-700 font-medium">{exp}</span>
          </label>
        ))}
      </div>
    </motion.div>
  )
}

// Step 7: Documents Ready
const Step7 = ({ register, watch }: any) => {
  const documents = [
    { id: "transcript", label: "Transcript / Degree", icon: FileText },
    { id: "sop", label: "SOP / LOR", icon: FileText },
    { id: "resume", label: "Resume", icon: Briefcase },
    { id: "passport", label: "Passport", icon: Globe }
  ]

  return (
    <motion.div
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -20 }}
      className="space-y-6"
    >
      <div className="text-center mb-8">
        <h3 className="text-2xl font-bold text-gray-800">Which of these documents do you have ready?</h3>
        <p className="text-gray-500 mt-2">Select all documents you currently have</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 max-w-2xl mx-auto">
        {documents.map((doc) => {
          const Icon = doc.icon
          const isChecked = watch(`documents.${doc.id}`)

          return (
            <label
              key={doc.id}
              className={`flex items-center justify-between p-4 border-2 rounded-xl cursor-pointer transition-all ${isChecked
                ? 'border-orange-500 bg-orange-50'
                : 'border-gray-200 hover:border-orange-300'
                }`}
            >
              <div className="flex items-center gap-3">
                <Icon className={`w-5 h-5 ${isChecked ? 'text-orange-500' : 'text-gray-400'}`} />
                <span className="text-gray-700">{doc.label}</span>
              </div>
              <div className="relative">
                <input
                  type="checkbox"
                  {...register(`documents.${doc.id}`)}
                  className="w-5 h-5 text-orange-500 focus:ring-orange-500 rounded"
                />
                {isChecked && (
                  <CheckCircle className="w-5 h-5 text-orange-500 absolute top-0 left-0" />
                )}
              </div>
            </label>
          )
        })}
      </div>
    </motion.div>
  )
}

// Main Scholarship Predictor Component
const ScholarshipPredictor = () => {
  const [step, setStep] = useState(1)
  const methods = useForm({
    defaultValues: {
      fieldOfStudy: '',
      country: '',
      percentage: '',
      englishTest: '',
      englishScore: '',
      standardExam: '',
      examScore: '',
      experience: '',
      documents: {
        transcript: false,
        sop: false,
        resume: false,
        passport: false
      }
    }
  })

  const { handleSubmit, formState, watch, trigger } = methods
  const totalSteps = 7

  const nextStep = async () => {
    let fieldsToValidate = []

    switch (step) {
      case 1:
        fieldsToValidate = ['fieldOfStudy']
        break
      case 2:
        fieldsToValidate = ['country']
        break
      case 3:
        fieldsToValidate = ['percentage']
        break
      case 4:
        fieldsToValidate = ['englishTest']
        break
      case 5:
        fieldsToValidate = ['standardExam']
        break
      case 6:
        fieldsToValidate = ['experience']
        break
      case 7:
        fieldsToValidate = []
        break
    }

    const isValid = await trigger(fieldsToValidate as any)
    if (isValid && step < totalSteps) {
      setStep(step + 1)
      window.scrollTo({ top: 0, behavior: 'smooth' })
    }
  }

  const prevStep = () => {
    if (step > 1) {
      setStep(step - 1)
      window.scrollTo({ top: 0, behavior: 'smooth' })
    }
  }

  const onSubmit = (data: any) => {
    alert("Thank you! Your scholarship predictions will be sent to your email.")
    // Here you can send data to your API
  }

  const getStepIcon = () => {
    switch (step) {
      case 1: return <GraduationCap className="w-6 h-6" />
      case 2: return <Globe className="w-6 h-6" />
      case 3: return <Award className="w-6 h-6" />
      case 4: return <Languages className="w-6 h-6" />
      case 5: return <Award className="w-6 h-6" />
      case 6: return <Briefcase className="w-6 h-6" />
      case 7: return <FileText className="w-6 h-6" />
      default: return <GraduationCap className="w-6 h-6" />
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 to-white py-12 px-4">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="flex items-center justify-center gap-2 mb-4">
            <GraduationCap className="w-8 h-8 text-orange-500" />
            <h1 className="text-3xl font-bold text-gray-800">Scholarship Predictor</h1>
          </div>
          <p className="text-gray-600">Answer a few quick questions to find the scholarships that fits your profile!</p>
        </div>

        {/* Progress Bar */}
        <div className="mb-8">
          <div className="flex justify-between mb-2">
            <span className="text-sm text-gray-600">Question {step}/{totalSteps}</span>
            <span className="text-sm text-gray-600">{Math.round((step / totalSteps) * 100)}% Complete</span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-2">
            <div
              className="bg-orange-500 rounded-full h-2 transition-all duration-300"
              style={{ width: `${(step / totalSteps) * 100}%` }}
            />
          </div>
        </div>

        {/* Form Container */}
        <div className="bg-white rounded-2xl shadow-xl p-6 md:p-8">
          <FormProvider {...methods}>
            <form onSubmit={handleSubmit(onSubmit)}>
              <AnimatePresence mode="wait">
                <div key={step} className="min-h-[400px]">
                  {step === 1 && <Step1 register={methods.register} watch={watch} />}
                  {step === 2 && <Step2 register={methods.register} watch={watch} />}
                  {step === 3 && <Step3 register={methods.register} formState={formState} />}
                  {step === 4 && <Step4 register={methods.register} watch={watch} setValue={methods.setValue} />}
                  {step === 5 && <Step5 register={methods.register} watch={watch} />}
                  {step === 6 && <Step6 register={methods.register} watch={watch} />}
                  {step === 7 && <Step7 register={methods.register} watch={watch} />}
                </div>
              </AnimatePresence>

              {/* Navigation Buttons */}
              <div className="flex justify-between mt-8 pt-6 border-t">
                <button
                  type="button"
                  onClick={prevStep}
                  className={`flex items-center gap-2 px-6 py-3 rounded-xl font-medium transition-all ${step === 1
                    ? 'invisible'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                    }`}
                >
                  <ChevronLeft size={20} />
                  Previous
                </button>

                {step < totalSteps ? (
                  <button
                    type="button"
                    onClick={nextStep}
                    className="flex items-center gap-2 px-6 py-3 bg-orange-500 text-white rounded-xl font-medium hover:bg-orange-600 transition-all"
                  >
                    Continue
                    <ChevronRight size={20} />
                  </button>
                ) : (
                  <button
                    type="submit"
                    className="flex items-center gap-2 px-6 py-3 bg-green-500 text-white rounded-xl font-medium hover:bg-green-600 transition-all"
                  >
                    Submit
                    <CheckCircle size={20} />
                  </button>
                )}
              </div>
            </form>
          </FormProvider>
        </div>


      </div>
    </div>
  )
}

export default ScholarshipPredictor