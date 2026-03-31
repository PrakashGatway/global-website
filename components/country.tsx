"use client"

import UniversityCard from '@/components/UniversityCard'
import { Facebook, Instagram, Linkedin, Mail, MapPin, Phone, PhoneIcon, Send, Twitter, User, Youtube } from 'lucide-react'
import Image from 'next/image'
import FAQSection from '@/components/faqPage'
import { DynamicLucideIcon } from '@/components/DynamicLucideIcon'
import ImageTestimonial from './ImageTestimonial'
import Balloon from './balloon'
import { useEffect, useState } from 'react'
import EligibilitySection from './Eligibility'
import ExpandableText from './Expandline'
import VideoTestimonialsSlider from './PageComponent/VideoTestimonial'
import StudentVisaStories from '@/components/Studentvisa'
import { useForm } from 'react-hook-form'
import axiosInstance from '@/app/axiosInstance'
import toast from 'react-hot-toast'
import { usePathname, useRouter } from 'next/navigation'


 


  
// Section Components
const HeroSection = ({ data,alldata }) => {
  if (data?.isHidden === "yes") return null
  return (
    <section className="block overflow-hidden">
      <div
        className="w-full min-h-[70vh] sm:h-[88vh] relative flex items-center justify-start"
        style={{
          backgroundImage: `url(${data?.heroImagee || "/images/country-bg.jpeg"})`,
          backgroundSize: "cover",
          backgroundPosition: "center",
        }}
      >
        <div className="z-10 w-full h-full flex flex-col justify-center">
          
            <div className="relative w-full px-6 sm:px-10 lg:px-10 py-10 ">
              <div className="absolute left-2 top-6 sm:left-6 sm:top-10 lg:-right-335 lg:-top-25 z-10">
                <Balloon Pageres={ alldata } />
              </div>
              <div className="bg-black/40 w-[48%] flex items-center py-4 rounded-2xl  ">
              <div className="max-w-xl lg:max-w-2xl lg:ml-6">
                <h1 className="text-2xl sm:text-4xl md:text-5xl lg:text-4xl font-bold text-white text-left mb-6">
                  {data?.title || "Study in Germany"}
                </h1>
                <p className="text-white text-sm sm:text-base mt-3 max-w-full "
                  dangerouslySetInnerHTML={{ __html: data?.subtitle || "" }}
                />
                <div className="flex flex-col sm:flex-row gap-4 mt-6">
                  <a href={data?.ctaLink1 || "/contact"}>
                    <button className="bg-yellow-400 hover:bg-[#f46c44] hover:text-white hover:scale-105 transition duration-300 rounded-full px-5 sm:px-6 md:px-4 py-3 md:py-4 flex items-center gap-3 font-bold text-gray-900 text-xs md:text-base lg:text-sm shadow-lg cursor-pointer">
                      <PhoneIcon size={20} />
                      <span>{data?.ctaText1 || "Talk to an Expert Counsellor for FREE"}</span>
                    </button>
                  </a>
                  <a href={data?.ctaLink2 || "/contact"}>
                    <button className="bg-[#f46c44] hover:bg-yellow-400 hover:text-black hover:scale-105 transition duration-300 rounded-full px-5 sm:px-6 md:px-8 py-3 md:py-4 flex items-center gap-3 font-bold text-white text-xs md:text-base lg:text-sm shadow-lg cursor-pointer">
                      <PhoneIcon size={20} />
                      <span>{data?.ctaText2 || "Talk to an Expert Counsellor for FREE"}</span>
                    </button>
                  </a>
                </div>
              </div>
              </div>
            </div>
        
        </div>
        <div className="hidden lg:block absolute bottom-0 right-0 w-[260px] sm:w-[420px] md:w-[600px] lg:w-[800px] z-10">
          <img src={data?.heroImage || "/images/country-hero.png"} className="w-full h-full object-contain" alt="" />
        </div>
      </div>
    </section>
  )
}

const FormSection = ({ data }) => {
  if (data?.isHidden === "yes") return null
    const { register, handleSubmit, reset, watch, setValue, control, formState: { errors, isSubmitting } } = useForm()
  
    const navigate = useRouter()
  
    const onSubmit = async (data) => {
      try {
  
        const payload = {
          fullName: `${data.fullname}`,
          email: data.email,
          phone: data.phone,
          destination: data.country,
          subject: "Study Abroad Enquiry",
          type: "website-form",
          source: "website",
          city: data.city,
          description: `State: ${data.state}`
        };
  
        const res = await axiosInstance.post("/contactus", payload);
        toast.success("Form submitted successfully")
        navigate.push("/thank-you")
  
        reset();
  
  
      } catch (error) {
        toast.error("Submit Error:", error);
      }
    };
  return (
   <section className="px-4 sm:px-6 lg:pr-10 py-12 sm:py-16 lg:py-10 relative overflow-hidden">
  <div className="mx-auto grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12 items-center">

    {/* LEFT FORM */}
      <div className="bg-white border border-gray-300 p-4 sm:p-6 lg:px-4 shadow-sm rounded-lg">

      <h2 className="text-orange-500 text-sm sm:text-xl font-semibold mb-4 sm:mb-6 pl-2 sm:pl-4 lg:pl-6 tracking-wide">
        GET IN TOUCH
      </h2>

      {/* FORM START */}
      <form onSubmit={handleSubmit(onSubmit)}>
        <div className="space-y-4 pl-2 sm:pl-4 lg:pl-6">

          {/* Name */}
          <div>
            <label className="block text-xs sm:text-sm font-medium text-gray-700 mb-0.5">
              Full Name
            </label>
            <input
              type="text"
              {...register("fullname", { required: true })}
              className="w-full border-b-2 border-gray-400 focus:outline-none focus:border-orange-500 pb-1 bg-transparent text-xs sm:text-sm"
            />
          </div>

          {/* Email */}
          <div>
            <label className="block text-xs sm:text-sm font-medium text-gray-700 mb-0.5">
              Email ID
            </label>
            <input
              type="email"
              {...register("email", { required: true })}
              className="w-full border-b-2 border-gray-400 focus:outline-none focus:border-orange-500 pb-1 bg-transparent text-xs sm:text-sm"
            />
          </div>

          {/* Mobile */}
          <div>
            <label className="block text-xs sm:text-sm font-medium text-gray-700 mb-0.5">
              Mobile Number
            </label>
            <input
              type="text"
              maxLength={10}
              {...register("phone", {
                required: true,
                pattern: /^[0-9]{10}$/,
              })}
              className="w-full border-b-2 border-gray-400 focus:outline-none focus:border-orange-500 pb-1 bg-transparent text-xs sm:text-sm"
            />
          </div>

          {/* State */}
          <div>
            <label className="block text-xs sm:text-sm font-medium text-gray-700 mb-0.5">
              State
            </label>
            <input
              type="text"
              {...register("state")}
              className="w-full border-b-2 border-gray-400 focus:outline-none focus:border-orange-500 pb-1 bg-transparent text-xs sm:text-sm"
            />
          </div>

          {/* City */}
          <div>
            <label className="block text-xs sm:text-sm font-medium text-gray-700 mb-0.5">
              City
            </label>
            <input
              type="text"
              {...register("city")}
              className="w-full border-b-2 border-gray-400 focus:outline-none focus:border-orange-500 pb-1 bg-transparent text-xs sm:text-sm"
            />
          </div>

          {/* Country */}
          <div>
            <label className="block text-xs sm:text-sm font-medium text-gray-700 mb-0.5">
              Country
            </label>
            <select
              {...register("country")}
              className="w-full border-b-2 border-gray-400 focus:outline-none focus:border-orange-500 pb-1 bg-transparent text-xs sm:text-sm"
            >
              <option value="">Country to Study</option>
              <option value="usa">Study In USA</option>
              <option value="uk">Study In UK</option>
              <option value="france">Study In France</option>
              <option value="germany">Study In Germany</option>
              <option value="italy">Study In Italy</option>
              <option value="dubai">Study In Dubai</option>
            </select>
          </div>
        </div>

        {/* Button */}
        <div className="flex justify-center mt-5">
          <button
            type="submit"
            className="bg-secondary hover:bg-primary text-white px-5 sm:px-7 py-2 sm:py-2.5 rounded-full font-semibold transition text-xs sm:text-sm"
          >
            CONTACT US
          </button>
        </div>
      </form>
      {/* FORM END */}
    </div>

    {/* RIGHT CONTENT (UNCHANGED) */}
    <div className="relative z-10">
      <h4 className="text-[#F46C44] text-2xl sm:text-3xl font-medium mb-2">
        {data?.title?.split('||')[0]?.trim() || "Overview of"}
      </h4>

      <h2 className="text-[#123b73] text-lg sm:text-4xl lg:text-4xl font-bold mb-4 sm:mb-6 relative inline-block">
        {data?.title?.split('||')[1]?.trim() || "Study in Germany"}
        <span className="absolute right-0 -bottom-4 w-12 sm:w-16 h-1 bg-[#F46C44]"></span>
      </h2>

      <p
        className="text-gray-700 leading-relaxed text-xs sm:text-lg mb-6"
        dangerouslySetInnerHTML={{ __html: data?.subtitle || "" }}
      />

      <a href={data?.ctaLink1 || "/contact"}>
        <button className="bg-secondary hover:bg-primary text-white px-5 sm:px-6 py-2.5 sm:py-3 rounded-full font-semibold transition text-xs sm:text-base">
          {data?.ctaText1 || "Read More >>"}
        </button>
      </a>
    </div>

  </div>
</section>
  )
}

const WhyChooseUsSection = ({ data }) => {
  if (data?.isHidden === "yes") return null
  return (
    <section className="w-full bg-[#ef6a42] py-10 px-4 sm:px-6">
      <div className="max-w-5xl mx-auto text-left">
        <h2 className="text-white text-lg sm:text-4xl md:text-4xl mb-2 font-bold relative inline-block">
          <span>{data?.title?.split("||")[0]}</span>
          <span>{data?.title?.split("||")[1]}</span>
          <span className="block w-12 sm:w-16 h-1 bg-yellow-400 absolute left-0 mt-2 sm:mt-3"></span>
        </h2>
        <div className="mt-6 sm:mt-8">
          <ExpandableText lines={5} htmlContent={data?.subtitle} />
        </div>
        <div className="mt-4 text-center">
          <a href={data?.ctaLink1 || "/contact"}>
            <button className="bg-secondary hover:bg-primary text-white px-6 sm:px-8 py-2.5 sm:py-3 rounded-full text-xs sm:text-lg font-semibold transition">
              {data?.ctaText1 || "Read More >>"}
            </button>
          </a>
        </div>
      </div>
    </section>
  )
}

const WhyStudySection = ({ data }) => {
  if (data?.isHidden === "yes") return null
  return (
    <section className="w-full py-12 sm:py-16 lg:py-20 px-4 sm:px-6 bg-white">
      <div className="max-w-7xl mx-auto">
        <div className="mb-6 sm:mb-8">
          <h2 className="text-lg sm:text-4xl md:text-4xl font-bold text-[#123b73] relative inline-block">
            <span>{data?.title?.split("||")[0]}</span>
            <span className='text-[#F46C44]'>{data?.title?.split("||")[1]}</span>
            <span className="absolute left-0 -bottom-4 w-16 sm:w-20 h-1 bg-[#F46C44]"></span>
          </h2>
        </div>
        <div>
          <p className="text-[#123b73] text-xs sm:text-lg mb-8 sm:mb-10 leading-relaxed">
            {data?.subTitle}
          </p>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 sm:gap-8">
            {(data?.items || []).map((item, index) => (
              <div key={index} className="flex items-start gap-3 sm:gap-4 bg-gray-200 p-4 rounded-xl">
                <div className="text-[#8b1d04] flex-shrink-0">
                  <DynamicLucideIcon name={item.icon} size={28} className="sm:w-8 sm:h-8" />
                </div>
                <div>
                  <h4 className="text-base sm:text-xl font-semibold text-gray-900">{item.title}</h4>
                  <ExpandableText
                    htmlContent={`
                      <ul class="list-disc pl-5 space-y-1 text-[#123b73] text-xs sm:text-base">
                        ${item.description
                        .split("\n")
                        .filter((line) => line.trim() !== "")
                        .map((line) => `<li>${line.replace("•", "").trim()}</li>`)
                        .join("")}
                      </ul>
                    `}
                    lines={4}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}

const PopularCoursesSection = ({ data }) => {
  if (data?.isHidden === "yes") return null
  return (
    <section className="w-full bg-white py-10 px-4">
      <div className="max-w-7xl mx-auto">
        <div className="text-left mb-12">
           <h2 className="text-lg sm:text-2xl md:text-3xl lg:text-4xl leading-snug">
            <span className="text-[#F46C44] block">
              {data?.title.split("||")[0]?.trim() || "Video"}

            </span>
            <span className="text-primary font-bold relative inline-block ">
              {data?.title.split("||")[1]?.trim() || "Testimonials"}
              <span className="absolute right-0 -bottom-1 sm:-bottom-2 w-12 sm:w-20 h-[2px] lg:h-1 bg-[#F46C44]"></span>
            </span>
          </h2>
       
          <p
  className="text-gray-500 mt-3 text-sm lg:text-base"
  dangerouslySetInnerHTML={{
    __html: data?.subtitle || ""
  }}
/>
        </div>
       <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
  {(data?.coursesitem || []).map((item, i) => (
    
    <div key={i} className=" bg-[#F46C44] rounded-[28px] hover:-translate-y-[8px] transition-all duration-300 pb-1 pl-[1.5px] pr-[0.5px] flex justify-center items-center h-full">
      
    
      {/* 🟡 Main Card */}
      <div className=" bg-[#f6f7f9] rounded-[28px] overflow-hidden transition duration-300 hover:shadow-md !mx-auto !w-full  flex flex-col h-full">
        
        {/* Image */}
        <div className="overflow-hidden w-full rounded-[28px] ">
          <img
            src={
              item?.image ||
              "https://images.unsplash.com/photo-1516321318423-f06f85e504b3"
            }
            alt={item?.coursesname}
            className="w-full h-[150px] lg:h-[180px] object-cover"
          />
        </div>

        {/* Content */}
        <div className="px-4 py-4 flex flex-col flex-grow">
          
          <h3 className="text-base lg:text-xl font-bold text-[#F46C44]">
            {item?.coursesname}
          </h3>
           <p className="text-base lg:text-base text-gray-800 mt-2 line-clamp-2">
            {item?.description || "No description available"}
          </p>

          {/* Button (push to bottom) */}
          <div className="mt-auto pt-0 flex justify-end">
            <button className="bg-[#F46C44] text-white text-base px-4 py-1 rounded-full flex items-center gap-2 hover:bg-primary transition">
              Explore →
            </button>
          </div>

        </div>
      </div>
    </div>
  ))}
</div>
      </div>
    </section>
  )
}

const LifeInSection = ({ data }) => {
  if (data?.isHidden === "yes") return null
  return (
    <section className="w-full h-full px-4 sm:px-6 lg:px-30 bg-white lg:pt-20 lg:pb-10 relative ">
  <div className="max-w-7xl mx-auto">

    {/* Heading */}
    <div className="mb-8 md:mb-12">
      <h1 className="text-lg sm:text-4xl md:text-3xl lg:text-4xl font-bold text-primary mb-4 relative">
        {data?.title || "Life in Germany"}
        <span className="w-20 sm:w-25 h-1.5 absolute right-1/4 sm:left-0 -bottom-2 sm:-bottom-4 bg-[#F46C44] rounded-full"></span>
      </h1>
    </div>

   {/* Content Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-10">
            {/* Left Section - Benefits List */}
            <div className="grid grid-cols-1 gap-4 sm:gap-5 lg:gap-6">
              {(data.items || []).map((item, index) => (
                <div key={index} className="flex items-center gap-4 w-full lg:w-120 relative z-1">
                  {/* Left Border Accent - Hidden on mobile */}
                  <div className="hidden sm:block w-60 h-20 bg-secondary absolute -z-1 -top-2 -left-2"></div>

                  {/* Benefit Box */}
                  <div className="flex-1 bg-[#f46c44] hover:bg-orange-600 transition-colors rounded-tr-[30px] sm:rounded-tr-[50px] px-4 sm:px-6 py-3 sm:py-4 lg:py-5 text-white text-sm sm:text-base lg:w-40 ">
                    <h1 className='text-base sm:text-2xl lg:text-xl font-semibold'>{item.title}</h1>
                    <p className='text-xs sm:text-sm text-white mt-1'>{item?.description}</p>
                  </div>
                </div>
              ))}
            </div>

            {/* Right Section - Images */}
            <div className="flex flex-col gap-4 relative ">
              {/* Yellow Accent Bar - Hidden on mobile */}
              <div className="hidden sm:block w-70 h-10 bg-yellow-400 absolute -top-5 right-20 -z-1"></div>

              {/* Top Image - Woman with Laptop */}
              <div className=" w-full h-48 sm:h-56 lg:h-140 shadow-md z-1">
                <img
                  src={data?.image || ""}
                  alt="Woman working on laptop"
                  className="w-full h-full object-cover rounded-lg "
                />
              </div>
            </div>
          </div>
            {/* Bottom Image - Munich Cityscape */}
        <img
          src={data?.buttomImage || "/images/life-germany-img-1.png"}
          alt="Munich cityscape"
          className="w-full max-w-[400px] sm:max-w-[500px] lg:w-[400px] h-auto object-contain absolute left-1/2 -translate-x-1/2 lg:left-130 lg:translate-x-0 bottom-0 z-11 hidden lg:block"
        />

  </div>
</section>
  )
}

const ChoosingUsSection = ({ data, Universityres }) => {
  if (data?.isHidden === "yes") return null
  return (
    <section className="relative w-full bg-[#ef6a42] py-5">
      <div className="mb-8 sm:mb-10 max-w-7xl mx-auto text-white">
        <p className="text-lg sm:text-4xl md:text-4xl font-light mb-2">
          {data?.title?.split('||')[0]?.trim() || "Choosing the Right"}
        </p>
        <h2 className="text-lg sm:text-4xl md:text-5xl lg:text-4xl font-bold relative inline-block">
          {data?.title?.split('||')[1]?.trim() || "University in Germany"}
          <span className="absolute right-0 -bottom-4 w-12 sm:w-16 h-1 bg-yellow-400"></span>
        </h2>
        <p className="mt-4 max-w-6xl text-xs sm:text-base leading-relaxed">
          {data?.subtitle || "Germany offers exceptional educational opportunities, but choosing the right university requires more than just rankings."}
        </p>
      </div>
      <UniversityCard university={Universityres} />
    </section>
  )
}

const EligibilityCriteriaSection = ({ data }) => {
  if (data?.isHidden === "yes") return null
  return <EligibilitySection pageData={{ sections: { eligibilityCriteria: data } }} />
}

const ContentSection = ({ data }) => {
  if (data?.isHidden === "yes") return null
  return (
    <section className="w-full bg-white py-5 px-4 sm:px-6">
      <div className="max-w-7xl mx-auto">
        <div className="">
          {(data?.items || []).map((item, i) => (
            <div key={i} className="min-w-full mb-8 lg:mb-10">
              <div className="mb-6 sm:mb-8">
                <h2 className="text-primary text-lg sm:text-3xl md:text-4xl font-bold">
                  <span className='text-[#F46C44] block'>{item.title?.split("||")[0]}</span>
                  <div className='flex gap-2'>
                    <span className='mt-1 sm:mt-2'>{item.title?.split("||")[1]}</span>
                    <span className='mt-1 sm:mt-2 border-b-4 border-[#F46C44] inline-block'>{item.title?.split("||")[2]}</span>
                  </div>
                </h2>
              </div>
              <div className="country-table" dangerouslySetInnerHTML={{ __html: item.description }} />
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

const ServiceSection = ({ data }) => {
  if (data?.isHidden === "yes") return null
  console.log(data?.serviceitem)
  return (
    <section className="bg-white">
      <div className="max-w-7xl mx-auto px-3 sm:px-6 py-5">
        <div className="mb-6 sm:mb-10 lg:mb-16 text-left lg:text-left">
          <h2 className="text-lg sm:text-2xl md:text-3xl lg:text-4xl leading-snug">
            <span className="text-[#F46C44] block">
              {data?.servicetitle?.split("||")[0]?.trim() || "Video"}
            </span>
            <span className="text-primary font-bold relative inline-block ">
              {data?.servicetitle?.split("||")[1]?.trim() || "Testimonials"}
              <span className="absolute right-0 -bottom-1 sm:-bottom-2 w-12 sm:w-20 h-[2px] lg:h-1 bg-[#F46C44]"></span>
            </span>
          </h2>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6 lg:gap-8">
          {(data?.serviceitem || []).map((service, index) => (
            <div key={index} className="bg-gray-200 rounded-lg sm:rounded-xl p-3 sm:p-5 lg:p-6 flex items-start gap-3 sm:gap-4 hover:shadow-md transition">
              <div className="w-8 h-8 sm:w-15 sm:h-22 flex-shrink-0 flex items-center justify-center text-orange-500">
                                  <DynamicLucideIcon name={`${service?.itemicon}`} size={66} className="sm:w-12 sm:h-12" />

              </div>
              <div className="flex-1">
                <h3 className="font-semibold text-sm sm:text-base lg:text-lg text-gray-900 leading-snug">
                  {service?.itemtitle}
                </h3>
                <p className="text-gray-600 text-xs sm:text-sm mt-1 leading-relaxed">
                  {service?.itemsubtitle}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

const ScholarshipsSection = ({ data, leftScholarships, rightScholarships }) => {
  if (data?.isHidden === "yes") return null
  return (
    <section className="w-full bg-[#ef6a42] py-12 sm:py-16 lg:py-10 px-4 sm:px-6">
      <div className="max-w-6xl mx-auto text-white">
        <div className="mb-8 sm:mb-10">
          <p className="text-lg sm:text-4xl md:text-4xl font-light mb-2">
            {data?.title?.split('||')[0]?.trim() || "scholarships to"}
          </p>
          <h2 className="text-lg sm:text-3xl md:text-3xl lg:text-4xl font-bold relative inline-block">
            {data?.title?.split('||')[1]?.trim() || "Study in germany"}
            <span className="absolute right-0 -bottom-4 w-12 sm:w-16 h-1 bg-yellow-400"></span>
          </h2>
          <p className="mt-4 sm:mt-6 w-full text-xs sm:text-lg leading-relaxed">
            {data?.subTitle || "Germany provides various scholarships for international students, including DAAD and university-funded options."}
          </p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-x-16 sm:gap-x-20 gap-y-4 sm:gap-y-6 mt-8 sm:mt-12">
          <div className="space-y-4 sm:space-y-6">
            {leftScholarships.map((item, i) => (
              <div key={i} className="flex items-center gap-3 sm:gap-4">
                <div className="bg-yellow-400 text-black rounded-full p-1.5 sm:p-2 flex-shrink-0">
                  <DynamicLucideIcon name="CircleDollarSign" size={16} className="sm:w-5 sm:h-5" />
                </div>
                <p className="border-b border-white pb-1 hover:opacity-80 cursor-pointer text-xs sm:text-base">
                  {item}
                </p>
              </div>
            ))}
          </div>
          <div className="space-y-4 sm:space-y-6">
            {rightScholarships.map((item, i) => (
              <div key={i} className="flex items-center gap-3 sm:gap-4">
                <div className="bg-yellow-400 text-black rounded-full p-1.5 sm:p-2 flex-shrink-0">
                  <DynamicLucideIcon name="CircleDollarSign" size={16} className="sm:w-5 sm:h-5" />
                </div>
                <p className="border-b border-white pb-1 hover:opacity-80 cursor-pointer text-xs sm:text-base">
                  {item}
                </p>
              </div>
            ))}
            
          </div>
         
        </div>
          <div className="flex flex-col sm:flex-row justify-center mt-4 ">
            <a href="/contact">
              <button className="bg-secondary hover:bg-primary px-6 sm:px-8 py-2.5 sm:py-3 rounded-full font-medium shadow-md hover:scale-105 transition text-xs sm:text-base">
                Contact US
              </button>
            </a>

          </div>
      </div>
    </section>
  )
}

const CTASection = ({ data }) => {
  if (data?.isHidden === "yes") return null
  return (
    <section className="relative bg-[#ee6a43] overflow-hidden py-12 sm:py-16 lg:py-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-6 grid grid-cols-1 lg:grid-cols-2 items-center">
        <div className="text-white relative z-10">
          <h2 className="text-lg sm:text-4xl md:text-4xl font-semibold leading-tight relative mb-4">
            {data?.title || "Start Your Global Education Journey"}
          </h2>
          <p
            className="mt-4 sm:mt-6 text-xs sm:text-base lg:text-lg max-w-xl text-white/90"
            dangerouslySetInnerHTML={{
              __html:
                data?.subtitle ||
                "Explore top universities, expert guidance, and seamless admission support with Ooshas Global.",
            }}
          ></p>
          <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4 sm:gap-6 mt-6 sm:mt-8">
            <a href="/contact">
              <button className="bg-secondary hover:bg-primary px-6 sm:px-8 py-2.5 sm:py-3 rounded-full font-medium shadow-md hover:scale-105 transition text-xs sm:text-base">
                Contact US
              </button>
            </a>

          </div>
        </div>
        <div className="hidden lg:block relative h-[380px]">
          <img src="/images/circle stand.png" alt="" className="absolute right-45 -bottom-3 w-[90px]" />
          <img src="/images/circle.png" alt="" className='w-100 absolute right-[24.5px] -bottom-12 animate-spin [animation-duration:60s]' />
        </div>
      </div>
      <img src="/images/country-building-img.png" alt="" className="absolute bottom-0 right-0 w-full sm:w-1/2 object-contain" />
      <div className="absolute bottom-0 left-0 w-full sm:w-1/2 h-2 sm:h-3 bg-yellow-400"></div>
    </section>
  )
}

// Main Component
export default function CountryDetails({ Universityres, Faqres, pageData, imageData, videoRes }) {
  const [expandedIndex, setExpandedIndex] = useState(null);

     const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    if (pathname.startsWith("/destination/")) {
      const slug = pathname.split("/destination/")[1];

      if (slug) {
        router.replace(`/${slug}`);
      }
    }
  }, [pathname, router]);


  // Define section mapping with their components
  const sectionMapping = {
    'hero': HeroSection,
    'formSection': FormSection,
    'whyChooseUs': WhyChooseUsSection,
    'whyStudy': WhyStudySection,
    'PopularCourses': PopularCoursesSection,
    'lifeIn': LifeInSection,
    'choosingUs': ChoosingUsSection,
    'eligibilityCriteria': EligibilityCriteriaSection,
    'contentSection': ContentSection,
    'servicesection': ServiceSection,
    'scholarships': ScholarshipsSection,
    'cta': CTASection,
    'videoTestimonials': 'VideoTestimonials',
    'imageTestimonials': 'ImageTestimonial'
  }

  // Get original section name from duplicate section name
  const getOriginalSectionName = (sectionName) => {
    // Remove copy suffix like _copy_1234567890
    if (sectionName.includes('_copy_')) {
      return sectionName.split('_copy_')[0]
    }
    return sectionName
  }

  // Get all sections from pageData and sort by order
  const getSortedSections = () => {
    if (!pageData?.sections) return []

    const sections = []
    Object.keys(pageData.sections).forEach(sectionName => {
      const sectionData = pageData.sections[sectionName]
      // Only include sections that have __order__ field
      if (sectionData.__order__ !== undefined) {
        // Get the original section name for mapping
        const originalName = getOriginalSectionName(sectionName)

        sections.push({
          name: sectionName,
          alldata: pageData,
          originalName: originalName,
          data: sectionData,
          order: sectionData.__order__,
          isDuplicate: sectionData.__isDuplicate__ || false
        })
      }
    })

    // Sort by order (0, 1, 2, 3...)
    return sections.sort((a, b) => a.order - b.order)
  }

  const sortedSections = getSortedSections()

  // Process scholarships data - use actual data from the section
  const scholarshipSection = pageData?.sections?.scholarships
  const scholarshipItems = scholarshipSection?.items || []
  const midPoint = Math.ceil(scholarshipItems.length / 2)
  const leftScholarships = scholarshipItems.slice(0, midPoint).map(item => item.title)
  const rightScholarships = scholarshipItems.slice(midPoint).map(item => item.title)

  // Separate imageData into two categories
  const visaStories = imageData?.filter((item) => 
    item.target === "visa" && item.status === 'Approved'
  ) || []

  console.log(visaStories)

  const regularImages = imageData?.filter(item => 
    item.target !== 'visa' && item.type === 'image'
  ) || []

  // Check if a section should be rendered
  const shouldRenderSection = (sectionName, sectionData) => {
    if (!sectionData) return false
    if (sectionName === 'videoTestimonials') {
      return videoRes?.data?.length > 0
    }
    if (sectionName === 'imageTestimonials') {
      return regularImages?.length > 0
    }
    if (sectionName === 'visaStories') {
      return visaStories?.length > 0
    }
    return true
  }

  
 

  return (
    <>
      {sortedSections.map(({ name, originalName, data, alldata, isDuplicate, order }) => {
        // Skip if section should not be rendered
        if (!shouldRenderSection(originalName, data)) return null

        // Get the component based on original name (not the duplicate name)
        let SectionComponent = sectionMapping[originalName]

        // If component not found for original name, try the exact name
        if (!SectionComponent) {
          SectionComponent = sectionMapping[name]
        }

        // Handle Hero section with alldata
        if (originalName === 'hero' || name === 'hero') {
          return SectionComponent && (
            <SectionComponent
              key={`${name}-${order}`}
              data={data}
              alldata={alldata}
            />
          )
        }

        // Handle special sections that use different props
        if (originalName === 'choosingUs' || name === 'choosingUs') {
          return SectionComponent && (
            <SectionComponent
              key={`${name}-${order}`}
              data={data}
              Universityres={Universityres}
            />
          )
        }

        if (originalName === 'scholarships' || name === 'scholarships') {
          return SectionComponent && (
            <SectionComponent
              key={`${name}-${order}`}
              data={data}
              leftScholarships={leftScholarships}
              rightScholarships={rightScholarships}
            />
          )
        }

        // Video Testimonials
        if (originalName === 'videoTestimonials' || name === 'videoTestimonials') {
          return (
            <VideoTestimonialsSlider
              key={`${name}-${order}`}
              items={videoRes?.data || []}
              title={data?.title}
              subtitle={data?.subtitle}
            />
          )
        }

        // Image Testimonials - Regular images (non-visa)
        if (originalName === 'imageTestimonials' || name === 'imageTestimonials') {
          return regularImages?.length > 0 && (
            <ImageTestimonial
              key={`${name}-${order}`}
              title={data?.title || "Our Student Success Stories"}
              subtitle={data?.subtitle || "Real experiences from our students"}
              items={regularImages}
            />
          )
        }

        // Visa Stories - Using StudentVisaStories component
        if (originalName === 'visastories' || name === 'visaStories') {
          return visaStories?.length > 0 && (
            <StudentVisaStories
              key={`${name}-${order}`}
              title={data?.title }
              subtitle={data?.subtitle}
              stories={visaStories}
              autoSlideInterval={5000}
            />
          )
        }

        // Render regular section with unique key using order
        return SectionComponent && (
          <SectionComponent
            key={`${name}-${order}`}
            data={data}
          />
        )
      })}

      {/* FAQ Section - Always at the end */}
      <FAQSection Faqres={Faqres} />
    </>
  )
}