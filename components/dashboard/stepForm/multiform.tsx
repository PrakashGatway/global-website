// app/page.tsx or pages/index.tsx
"use client";

import React, { useState } from "react";
import {
  CheckCircle,
  Circle,
  FileText,
  GraduationCap,
  Plane,
  MapPin,
  ClipboardList,
  MailQuestion,
  ChevronRight,
  ChevronLeft,
  User,
  BookOpen,
  Award,
  Globe,
  Calendar,
  Upload,
  Home,
  Sun,
  MessageCircle,
} from "lucide-react";
import { useRouter } from "next/navigation";

type Step = {
  id: number;
  name: string;
  description?: string;
  icon: React.ElementType;
};

export default function MultiStepForm() {
  const [currentStep, setCurrentStep] = useState(1);


  // Steps configuration
  const steps: Step[] = [
    {
      id : 1,
      name: "Complete Profile",
      description: "Complete your profile before starting your application.",
      icon: MapPin
      
    },
    {
      id: 2,
      name: "Find A Program",
      description: "Choose your program",
      icon: MapPin
    },
    {
      id: 3,
      name: "Finalize Application",
      description: "Education details",
      icon: FileText
    },
    {
      id: 4,
      name: "Review & Submit",
      description: "Check your info",
      icon: ClipboardList
    },
    {
      id: 5,
      name: "Get Results",
      description: "Track progress",
      icon: CheckCircle
    },
  ];

  const handleNext = () => {
    if (currentStep < steps.length) {
      setCurrentStep(currentStep + 1);
    }
  };

  const handlePrevious = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };

  const router = useRouter()





  // const isStepValid = () => {
  //   switch (currentStep) {
  //     case 1:
  //       return formData.fullName && formData.email && formData.country;
  //     case 2:
  //       return formData.preferredProgram && formData.preferredCountry && formData.startDate;
  //     case 3:
  //       return formData.highSchool && formData.graduationYear;
  //     case 4:
  //       return formData.passport && formData.transcripts;
  //     case 5:
  //       return formData.agreedToTerms;
  //     default:
  //       return true;
  //   }
  // };











  // Step 5: Get Results (Review & Confirmation)
  const renderStep5 = () => (
    <div className="space-y-6">
      <div className="bg-emerald-50 rounded-xl p-6 text-center">
        <CheckCircle className="w-16 h-16 text-emerald-600 mx-auto mb-4" />
        <h3 className="text-xl font-semibold text-gray-800 mb-2">Almost Done!</h3>
        <p className="text-gray-600">Review your information before submitting</p>
      </div>



      <div className="bg-gray-50 rounded-lg p-4 space-y-3">
        <h4 className="font-semibold text-gray-700">Program Details</h4>
        <div className="grid grid-cols-2 gap-2 text-sm">
          <span className="text-gray-600">Program:</span>
          <span className="font-medium">{formData.preferredProgram || "Not selected"}</span>
          <span className="text-gray-600">Country:</span>
          <span className="font-medium">{formData.preferredCountry || "Not selected"}</span>
        </div>
      </div>

      <div className="flex items-center gap-3 p-4">
        <input
          type="checkbox"
          name="agreedToTerms"
          checked={formData.agreedToTerms}
          onChange={(e) => setFormData(prev => ({ ...prev, agreedToTerms: e.target.checked }))}
          className="w-4 h-4 text-blue-600 rounded focus:ring-blue-500"
        />
        <label className="text-sm text-gray-700">
          I confirm that all information provided is accurate and complete
        </label>
      </div>
    </div>
  );

  const renderStep = () => {
    switch (currentStep) {
      case 1: return renderStep1();
      case 2: return renderStep2();
      case 3: return renderStep3();
      case 4: return renderStep4();
      case 5: return renderStep5();
      default: return null;
    }
  };

  return (
    <div className="min-h-screen bg-slate-50">
     

      {/* Main Content */}
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Progress Bar */}
        <div className="mb-8">
          <div className="flex justify-between mb-2">
            <span className="text-sm font-medium text-gray-700">My Progress</span>
            <span className="text-sm font-medium text-gray-700">Step {currentStep} of {steps.length}</span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-2.5">
            <div
              className="bg-blue-600 h-2.5 rounded-full transition-all duration-300"
              style={{ width: `${(currentStep / steps.length) * 100}%` }}
            ></div>
          </div>
        </div>

        {/* Vertical Timeline Steps */}
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8 mb-8 w-full">
          {/* Timeline Steps - Left Side */}
          <div className="lg:col-span-1">
            <div className="space-y-4">
              {steps.map((step, index) => (
                <div key={step.id} className="relative">
                  {/* Timeline Line */}
                  {index < steps.length - 1 && (
                    <div className="absolute left-6 top-12 w-0.5 h-12 bg-gray-300 -z-10"></div>
                  )}

                  {/* Step Block */}
                  <button
                    onClick={() => {
                      if (step.id === 1) {
                        router.push("/dashboard/settings"); // your profile route
                        return;
                      }

                      if (step.id <= currentStep) {
                        setCurrentStep(step.id);
                      }
                    }}
                  >
                    <div
                      className={`flex text-start gap-4 w-2xl   p-4  rounded-xl border-2 transition-all cursor-pointer ${currentStep === step.id
                          ? 'bg-blue-50 border-blue-500 shadow-lg'
                          : step.id < currentStep
                            ? 'bg-green-50 border-green-400 hover:border-green-500'
                            : 'bg-gray-50 border-gray-300 opacity-50 cursor-not-allowed'
                        }`}
                    >
                      {/* Numbered Circle */}
                      <div
                        className={`flex items-center justify-center w-12 h-12 rounded-full flex-shrink-0 font-bold text-lg ${currentStep === step.id
                            ? 'bg-blue-600 text-white'
                            : step.id < currentStep
                              ? 'bg-green-500 text-white'
                              : 'bg-gray-400 text-white'
                          }`}
                      >
                        {step.id < currentStep ? (
                          <CheckCircle className="w-6 h-6" />
                        ) : (
                          step.id
                        )}
                      </div>

                      {/* Step Info */}
                      <div className="flex-1 min-w-0">
                        <h3
                          className={`font-semibold transition-colors w-full whitespace-nowrap ${currentStep === step.id || step.id < currentStep
                              ? 'text-gray-900'
                              : 'text-gray-600'
                            }`}
                        >
                          {step.name}
                        </h3>
                        {step.description && (
                          <p className="text-xs text-gray-500 mt-1">{step.description}</p>
                        )}
                      </div>
                    </div>
                  </button>
                </div>
              ))}
            </div>
          </div>


        </div>

        {/* Need Help Section */}
        <div className="mt-6 bg-white rounded-xl p-4 shadow-sm border border-gray-100">
          <div className="flex items-center justify-between flex-wrap gap-4">
            <div className="flex items-center gap-3">
              <MessageCircle className="w-5 h-5 text-blue-600" />
              <span className="text-gray-700">Need Help Applying?</span>
              <span className="text-gray-500">Contact your advisor at</span>
              <a href="#" className="text-blue-600 font-medium hover:underline">ApplyBoard</a>
            </div>
            <button className="bg-blue-50 text-blue-700 px-4 py-2 rounded-lg hover:bg-blue-100 transition-colors flex items-center gap-2">
              Live Chat
              <MessageCircle className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Footer */}
        <div className="mt-8 text-center text-sm text-gray-500">
          <p>© 2026 ApplyBoard.com | 1st free trial: $4.00 - $12.00</p>
        </div>
      </div>
    </div>
  );
}
