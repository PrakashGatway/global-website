"use client"

import UniversityCard from '@/components/UniversityCard'
import { ArrowRight, PhoneCall, PhoneIcon } from 'lucide-react'
import FAQSection from '@/components/faqPage'
import { DynamicLucideIcon } from '@/components/DynamicLucideIcon'
import ImageTestimonial from './ImageTestimonial'
import Balloon from './balloon'
import { useEffect, useState } from 'react'
import EligibilitySection from './Eligibility'
import ExpandableText from './Expandline'
import { useForm } from 'react-hook-form'
import axiosInstance from '@/app/axiosInstance'
import toast from 'react-hot-toast'
import { NewTag, Tag, Tagging } from './tag'
import { usePathname, useRouter } from 'next/navigation'
import Link from 'next/link'
import { useKeenSlider } from 'keen-slider/react'
import AuthorCard from './author/author'
import VisaDetails from './dashboard/VisaDetails/visaDetails'




// ─── Section Components ────────────────────────────────────────────────────────

const HeroSection = ({ data, alldata }) => {
  if (data?.isHidden === "yes") return null
  // //console.log('hero d',data)
  return (
    <section className="block overflow-hidden">
      <div
        className="w-full h-auto py-18  relative flex items-center justify-center"
        style={{
          backgroundImage: `url(${data?.heroImagee || "/images/country-bg.jpeg"})`,
          backgroundSize: "cover",
          backgroundPosition: "center",
        }}
      >
        {/* Overlay tint for readability on all screens */}
        <div className="absolute inset-0 bg-black/30 lg:bg-transparent z-0" />

        <div className="relative  z-10 w-full h-full flex flex-col justify-center  max-w-[1440px] ">
          <div className="w-full px-4 sm:px-8 lg:px-10 py-8 sm:py-10 ">

            {/* Balloon — positioned absolutely only on lg+ */}
            <div className="absolute right-2 top-4 sm:right-6 sm:top-8 lg:left-auto lg:right-auto lg:top-auto z-20"
              style={{
                "right": "2rem"
              }}
            >
              <Balloon Pageres={alldata} />
            </div>

            {/* Content card — full width on mobile, 60% on sm, 48% on lg */}
            <div className=" max-w-7xl  bg-black/50 w-full sm:w-4/5 md:w-3/5 lg:w-[48%] flex items-center
             py-5 px-4 sm:px-6  rounded-2xl">
              <div className="w-full">
                <Tag data={data?.tag}
                  css={"text-xl sm:text-3xl md:text-4xl lg:text-4xl font-bold text-white mb-4 leading-tight"}
                  text={data?.title} />
                {/* <h1 className="text-xl sm:text-3xl md:text-4xl lg:text-4xl font-bold text-white mb-4 leading-tight">
                  {data?.title || "Study in Germany"}
                </h1> */}
                <span
                  className="text-white text-sm sm:text-base leading-relaxed"
                  dangerouslySetInnerHTML={{ __html: data?.subtitle || "" }}
                />
                <div className="flex xs:flex-col flex-row flex-wrap gap-3 mt-5">
                  <a href={data?.ctaLink1 || "/contact"}>
                    <button className="bg-yellow-400 hover:bg-[#f46c44] hover:text-white hover:scale-105 transition duration-300 rounded-full px-5 py-3 flex items-center gap-2 font-bold text-gray-900 text-xs sm:text-sm shadow-lg cursor-pointer w-full xs:w-auto">
                      <PhoneIcon size={18} />
                      <span>{data?.ctaText1 || "Talk to an Expert Counsellor for FREE"}</span>
                    </button>
                  </a>
                  <a href={data?.ctaLink2 || "/contact"}>
                    <button className="bg-[#f46c44] hover:bg-yellow-400 hover:text-black hover:scale-105 transition duration-300 rounded-full px-5 py-3 flex items-center gap-2 font-bold text-white text-xs sm:text-sm shadow-lg cursor-pointer w-full xs:w-auto">
                      <PhoneIcon size={18} />
                      <span>{data?.ctaText2 || "Talk to an Expert Counsellor for FREE"}</span>
                    </button>
                  </a>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Hero character image — visible from md upward */}
        <div className="hidden md:block absolute bottom-0 right-0 w-[340px] lg:w-[600px] xl:w-[750px] z-10 pointer-events-none">
          <img
            src={data?.heroImage || "/images/country-hero.png"}
            className="w-full h-full object-contain"
            alt=""
          />
        </div>
      </div>
    </section>
  )
}


const FormSection = ({ data }) => {
  if (data?.isHidden === "yes") return null;

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm({
    mode: "onChange",          // ✅ validate on typing
    reValidateMode: "onChange"
  });

  const navigate = useRouter();

  const onSubmit = async (formData) => {
    try {
      const payload = {
        fullName: formData.fullname,
        email: formData.email,
        phone: formData.phone,
        destination: formData.country,
        subject: "Study Abroad Enquiry",
        type: "website-form",
        source: "website",
        city: formData.city,
        description: `State: ${formData.state}`,
      };

      await axiosInstance.post("/contactus", payload);
      toast.success("Form submitted successfully");
      navigate.push("/thank-you");
      reset();
    } catch (error) {
      toast.error("Submit Error");
    }
  };

  return (
    <section className="px-4 sm:px-6 lg:pr-10 py-10 sm:py-14 lg:py-10 relative overflow-hidden">
      <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12 items-center">

        {/* Form  */}
        <div className="bg-white border border-gray-300 p-5 sm:p-8 shadow-sm rounded-lg w-full">
          <h2 className="text-orange-500 text-sm sm:text-xl font-semibold mb-5 tracking-wide">
            GET IN TOUCH
          </h2>

          <form onSubmit={handleSubmit(onSubmit)}>
            <div className="space-y-4">
              <div>
                <label className="text-sm text-gray-700">Full Name</label>
                <input
                  {...register("fullname", { required: "Name is required" })}
                  className={`w-full border-b-2 pb-1 bg-transparent text-sm focus:outline-none 
                  ${errors.fullname ? "border-red-500" : "border-gray-400 focus:border-orange-500"}`}
                />
                {errors.fullname && (
                  <p className="text-red-500 text-xs">{errors.fullname.message}</p>
                )}
              </div>

              {/* Email */}
              <div>
                <label className="text-sm text-gray-700">Email ID</label>
                <input
                  type="email"
                  {...register("email", {
                    required: "Email is required",
                    pattern: {
                      value: /^[^\s@]+@[^\s@]+\.(com|in)$/i,
                      message: "Only .com and .in emails allowed",
                    },
                  })}
                  className={`w-full border-b-2 pb-1 bg-transparent text-sm focus:outline-none 
                  ${errors.email ? "border-red-500" : "border-gray-400 focus:border-orange-500"}`}
                />

                {/* show only format error while typing */}
                {errors.email && (
                  <p className="text-red-500 text-xs">{errors.email.message}</p>
                )}
              </div>

              {/* Phone */}
              <div>
                <label className="text-sm text-gray-700">Mobile Number</label>
                <input
                  maxLength={10}
                  {...register("phone", {
                    required: "Phone is required",
                    pattern: {
                      value: /^[0-9]{10}$/,
                      message: "Enter valid 10 digit number",
                    },
                  })}
                  className={`w-full border-b-2 pb-1 bg-transparent text-sm focus:outline-none 
                  ${errors.phone ? "border-red-500" : "border-gray-400 focus:border-orange-500"}`}
                />
                {errors.phone && (
                  <p className="text-red-500 text-xs">{errors.phone.message}</p>
                )}
              </div>

              {/* State */}
              <div>
                <label className="text-sm text-gray-700">State</label>
                <input
                  {...register("state")}
                  className="w-full border-b-2 border-gray-400 focus:outline-none focus:border-orange-500 pb-1"
                />
              </div>

              {/* City */}
              <div>
                <label className="text-sm text-gray-700">City</label>
                <input
                  {...register("city")}
                  className="w-full border-b-2 border-gray-400 focus:outline-none focus:border-orange-500 pb-1"
                />
              </div>

              {/* Country */}
              <div>
                <label className="text-sm text-gray-700">Country</label>
                <select
                  {...register("country")}
                  className="w-full border-b-2 border-gray-400 focus:outline-none focus:border-orange-500 pb-1"
                >
                  <option value="">Country to Study</option>
                  {["USA", "UK", "France", "Germany", "Italy", "Dubai", "New Zealand", "Australia"].map((c) => (
                    <option key={c} value={c.toLowerCase()}>
                      Study In {c}
                    </option>
                  ))}
                </select>
              </div>

            </div>

            <div className="flex justify-center mt-6">
              <button
                type="submit"
                disabled={isSubmitting}
                className="bg-secondary hover:bg-primary text-white px-6 py-2 rounded-full"
              >
                {isSubmitting ? "Submitting..." : "CONTACT US"}
              </button>
            </div>
          </form>
        </div>

        {/* Right Content */}
        <div className="relative z-10">
          <Tagging data={data?.tag} css="relative inline-block mb-4 sm:mb-6 block">
            <span className="text-[#F46C44] text-2xl sm:text-3xl block font-medium mr-2">
              {data?.title?.split('||')[0]?.trim() || ""}
            </span>
            <span className="text-[#123b73] text-lg sm:text-4xl lg:text-4xl font-bold">
              {data?.title?.split('||')[1]?.trim() || ""}
            </span>
            <span className="absolute right-0 -bottom-4 w-12 sm:w-16 h-1 bg-[#F46C44]"></span>
          </Tagging>

          {/* <h2 className="text-[#123b73] text-lg sm:text-4xl lg:text-4xl font-bold mb-4 sm:mb-6 relative inline-block">
        {data?.title?.split('||')[1]?.trim() || "Study in Germany"}
        <span className="absolute right-0 -bottom-4 w-12 sm:w-16 h-1 bg-[#F46C44]"></span>
      </h2> */}

          <span
            className="text-gray-700 leading-relaxed text-xs sm:text-lg mb-6"
            dangerouslySetInnerHTML={{ __html: data?.subtitle || "" }}
          />

          {/* <a href={data?.ctaLink1 || "/contact"}>
            <button className="bg-secondary hover:bg-primary text-white px-5 sm:px-6 py-2.5 sm:py-3 rounded-full font-semibold transition text-xs sm:text-base">
              {data?.ctaText1 || "Read More >>"}
            </button>
          </a> */}
        </div>

      </div>
    </section>
  );
};


const WhyChooseUsSection = ({ data }) => {
  if (data?.isHidden === "yes") return null
  return (
    <section className="w-full bg-[#ef6a42] py-10 px-4 sm:px-6">
      <div className="max-w-5xl mx-auto">
        <Tag data={data?.tag} css="text-white text-xl sm:text-3xl md:text-4xl font-bold relative inline-block" text={data?.title?.split("||")[0]} />
        <div className="">
          <ExpandableText lines={4} htmlContent={data?.subtitle} />
        </div>
        <div className=" text-center">
          <a href={data?.ctaLink1 || "/contact"}>
            <button className="bg-secondary hover:bg-primary text-white px-6 sm:px-8 py-2.5 sm:py-3 rounded-full text-xs sm:text-base font-semibold transition">
              {data?.ctaText1 || "Read More >>"}
            </button>
          </a>
        </div>
      </div>
    </section>
  )
}


export const WhyStudySection = ({ data }) => {
  if (data?.isHidden == "yes") return null
  return (
    <section className="w-full py-10 sm:py-14 lg:py-20 px-4 sm:px-6 bg-white">
      <div className="max-w-7xl mx-auto">
        <div className="mb-8 sm:mb-0">
          <Tagging data={data?.tag} css="relative inline-block mb-4 sm:mb-6 block">
            <span className="text-[#F46C44] text-2xl sm:text-3xl block font-medium mr-2">
              {data?.title?.split('||')[0]?.trim() || ""}
            </span>
            <span className="text-[#123b73] text-lg sm:text-4xl lg:text-4xl font-bold">
              {data?.title?.split('||')[1]?.trim() || ""}
            </span>
          </Tagging>
        </div>
        <div className="text-[#123b73] text-sm sm:text-base lg:text-lg mb-8 leading-relaxed" dangerouslySetInnerHTML={{
          __html: data?.subTitle
        }}
        />
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5 sm:gap-8">
          {(data?.items || []).map((item, index) => (
            <div key={index} className="flex items-start gap-3 sm:gap-4 bg-gray-200 p-4 rounded-xl">
              <div className="text-[#8b1d04] flex-shrink-0">
                <DynamicLucideIcon name={item.icon} size={28} className="sm:w-8 sm:h-8" />
              </div>
              <div>
                <span className='text-base sm:text-2xl lg:text-xl text-gray-900 font-semibold' dangerouslySetInnerHTML={{ __html: item?.title }} />
                <ExpandableText
                  htmlContent={`${item.description}`}
                  lines={4}
                />
              </div>
            </div>
          ))}
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
        <div className="text-left mb-10 sm:mb-12">

          {/* <h2 className="text-xl sm:text-2xl md:text-3xl lg:text-4xl leading-snug">
          <Tag data={data?.tag} text={data?.title.split("||")[0]?.trim() || "Popular"} css={"text-[#F46C44] block"}/>
          <Tag data={data?.tag} text={data?.title?.split("||")[1]?.trim() || "Courses"} css={"text-primary font-bold relative inline-block"}/>
          <span className="absolute right-0 -bottom-1 sm:-bottom-2 w-12 sm:w-20 h-[2px] lg:h-1 bg-[#F46C44]"></span>
        </h2> */}
          <Tagging data={data?.tag} css="relative inline-block mb-4 sm:mb-6 block">
            <span className="text-[#F46C44] text-2xl sm:text-3xl block font-medium mr-2">
              {data?.title?.split('||')[0]?.trim() || ""}
            </span>
            <span className="text-[#123b73] text-lg sm:text-4xl lg:text-4xl font-bold">
              {data?.title?.split('||')[1]?.trim() || ""}
            </span>
            <span className="absolute right-0 -bottom-4 w-12 sm:w-16 h-1 bg-[#F46C44]"></span>
          </Tagging>
          <span
            className="text-gray-500 mt-3 text-sm lg:text-base"
            dangerouslySetInnerHTML={{ __html: data?.subtitle || "" }}
          />
        </div>
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {(data?.coursesitem || []).map((item, i) => (
            // <div key={i} className="bg-[#F46C44] rounded-[28px] hover:-translate-y-2 transition-all duration-300 p-[2px]">
            //   <div className="bg-[#f6f7f9] rounded-[26px] overflow-hidden flex flex-col h-full">
            <div key={i} className=" bg-[#F46C44] rounded-[28px] hover:-translate-y-[8px] transition-all duration-300 pb-1 pl-[1.5px] pr-[0.5px] flex justify-center items-center h-full">


              {/* 🟡 Main Card */}
              <div className=" bg-[#f6f7f9] rounded-[28px] overflow-hidden transition duration-300 hover:shadow-md !mx-auto !w-full  flex flex-col h-full">

                <div className="overflow-hidden w-full rounded-t-[26px]">
                  <img
                    src={item?.image || "https://res.cloudinary.com/dhzire2mc/image/upload/v1775022574/cway-admin/njlye3egxsqkcf1q6k9i.jpg"}
                    alt={item?.coursesname}
                    className="w-full h-[150px] lg:h-[180px] object-cover"
                  />
                </div>
                <div className="px-4 py-4 flex flex-col flex-grow">
                  <div className="text-base lg:text-xl font-bold text-[#F46C44]" dangerouslySetInnerHTML={{ __html: item?.coursesname }} />
                  <div className="text-sm text-gray-800 mt-2 line-clamp-2" dangerouslySetInnerHTML={{ __html: item?.description || "" }} />
                  {/* <div className="mt-auto pt-3 flex justify-end">
                    <button className="bg-[#F46C44] text-white text-sm px-4 py-1.5 rounded-full flex items-center gap-2 hover:bg-primary transition">
                      Explore →
                    </button>
                  </div> */}
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
          <span className="text-lg sm:text-4xl md:text-3xl lg:text-4xl font-bold text-primary mb-1 relative">
            <Tagging data={data?.tag} css="relative inline-block mb-3 block">
              <span className="text-[#F46C44] text-2xl sm:text-3xl block font-medium mr-2">
                {data?.title?.split('||')[0]?.trim() || ""}
              </span>
              <span className="text-[#123b73] text-lg sm:text-4xl lg:text-4xl font-bold">
                {data?.title?.split('||')[1]?.trim() || ""}
              </span>
            </Tagging>
          </span>
          <div className="country-table text-[#707888] overflow-x-auto mt-1" dangerouslySetInnerHTML={{ __html: data.subTitle }} />
          {/* <div className="country-table overflow-x-auto mt-1" dangerouslySetInnerHTML={{ __html: data.servicesubtitle }} /> */}

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
                  <span className='text-base sm:text-2xl lg:text-xl font-semibold' dangerouslySetInnerHTML={{ __html: item?.title }} />
                  <span className='text-xs sm:text-sm text-white mt-1' dangerouslySetInnerHTML={{
                    __html: item?.description
                  }}></span>
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
                src={data?.image || "https://res.cloudinary.com/dhzire2mc/image/upload/v1775022574/cway-admin/njlye3egxsqkcf1q6k9i.jpg"}
                alt="Woman working on laptop"
                className="w-full h-full object-cover rounded-lg "
              />
            </div>
          </div>
        </div>
        {/* Bottom Image - Munich Cityscape */}
        {/* <img
          src={data?.buttomImage || "/images/life-germany-img-1.png"}
          alt="Munich cityscape"
          className="w-full max-w-[400px] sm:max-w-[500px] lg:w-[400px] h-auto object-contain absolute left-1/2 -translate-x-1/2 lg:left-130 lg:translate-x-0 bottom-0 z-11 hidden lg:block"
        /> */}

      </div>
    </section>
  )
}


const ChoosingUsSection = ({ data, Universityres }) => {
  if (data?.isHidden === "yes") return null
  return (
    <section className="relative w-full bg-[#ef6a42] py-8 sm:py-10 px-4 sm:px-6">
      <div className="mb-6 sm:mb-2 max-w-7xl mx-auto text-white">
        <Tagging
          data={data?.tag}
          css="text-lg sm:text-3xl md:text-4xl"
        >
          <span className="font-light" dangerouslySetInnerHTML={{
            __html: data?.title?.split("||")[0]?.trim() || "Choosing the Right"
          }}>

          </span>{" "}

          <span className="font-bold relative inline-block" dangerouslySetInnerHTML={{
            __html: data?.title?.split("||")[1]?.trim() || "University in Germany"
          }}>

          </span>


        </Tagging>
        <span className="mt-4 relative inline-block" dangerouslySetInnerHTML={{
          __html: data?.subtitle
        }}>

        </span>
      </div>
      <UniversityCard university={Universityres} />
    </section>
  )
}


export const EligibilityCriteriaSection = ({ data }) => {
  if (data?.isHidden === "yes") return null
  return <EligibilitySection pageData={{ sections: { eligibilityCriteria: data } }} />
}


export const ContentSection = ({ data }) => {
  if (data?.isHidden === "yes") return null
  return (
    <section className="w-full bg-white py-5 px-4 sm:px-6">
      <div className="max-w-7xl mx-auto">
        {(data?.items || []).map((item, i) => (
          <div key={i} className="mb-8 lg:mb-10">
            <div className="mb-5 sm:mb-2">
              <h2 className="text-primary text-xl sm:text-3xl md:text-4xl font-bold">
                <span className="text-[#F46C44] block" dangerouslySetInnerHTML={{
                  __html: item.title?.split("||")[0]
                }} />
                <div className="flex flex-wrap gap-2 mt-1">
                  <span dangerouslySetInnerHTML={{ __html: item.title?.split("||")[1] }} />
                </div>
              </h2>
            </div>
            <div className="country-table overflow-x-auto mt-4" dangerouslySetInnerHTML={{ __html: item.description }} />
          </div>
        ))}
      </div>
    </section>
  )
}


const ServiceSection = ({ data }) => {
  if (data?.isHidden === "yes") return null
  return (
    <section className="bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8 sm:py-12">
        <div className="mb-8 sm:mb-12">
          <Tagging data={data?.tag} css="relative inline-block mb-4 sm:mb-6 block">
            <span
              className="text-[#F46C44] text-2xl sm:text-3xl block font-medium mr-2"
              dangerouslySetInnerHTML={{
                __html: data?.servicetitle?.split("||")[0]?.trim() || "",
              }} /> {" "}
            <span className="text-[#123b73] text-lg sm:text-4xl lg:text-4xl font-bold" dangerouslySetInnerHTML={{
              __html: data?.servicetitle?.split('||')[1]?.trim() || ""
            }} />

            <span className="absolute right-0 -bottom-3 w-12 sm:w-16 h-1 bg-[#F46C44]"></span>
          </Tagging>
          <div className="country-table overflow-x-auto mt-1" dangerouslySetInnerHTML={{ __html: data.servicesubtitle }} />


        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6 lg:gap-8">
          {(data?.serviceitem || []).map((service, index) => (
            <div key={index} className="bg-gray-200 rounded-lg sm:rounded-xl p-4 sm:p-5 lg:p-6 flex items-start gap-3 sm:gap-4 hover:shadow-md transition">
              <div className="w-10 h-10 sm:w-14 sm:h-14 flex-shrink-0 flex items-center justify-center text-orange-500">
                <DynamicLucideIcon name={`${service?.itemicon}`} size={40} className="sm:w-10 sm:h-10" />
              </div>
              <div className="flex-1 min-w-0">
                <div className="font-semibold text-sm sm:text-base lg:text-lg text-gray-900 leading-snug" dangerouslySetInnerHTML={{
                  __html: service?.itemtitle
                }}>
                </div>
                {/* <div className="text-gray-600 text-xs sm:text-sm mt-1 leading-relaxed" dangerouslySetInnerHTML={{
                  __html: service?.itemsubtitle
                }} /> */}
                <div
                  className="list-disc pl-3 text-gray-600 text-xs sm:text-sm mt-1 leading-relaxed [&_ul]:list-disc [&_ul]:pl-4 [&_ul]:space-y-1"
                  dangerouslySetInnerHTML={{
                    __html: service?.itemsubtitle
                  }}
                />
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}


const ScholarshipsSection = ({ data, leftScholarships, rightScholarships }: any) => {
  if (data?.isHidden === "yes") return null
  const [openIndex, setOpenIndex] = useState(null);

  const toggleAccordion = (index) => {
    setOpenIndex(openIndex === index ? null : index);
  };
  return (
    <section className="w-full bg-[#ef6a42] py-10 sm:py-14 lg:py-10 px-4 sm:px-6">
      <div className="max-w-6xl mx-auto text-white">
        <div className="mb-6 sm:mb-10">
          <Tagging data={data?.tag} css="text-lg sm:text-3xl md:text-4xl font-light mb-2">
            <span className="text-lg sm:text-3xl md:text-4xl font-light mb-2 block" dangerouslySetInnerHTML={{
              __html: data?.title?.split('||')[0]?.trim() || ""
            }}>
            </span>
            <span className="text-xl sm:text-2xl md:text-3xl lg:text-4xl font-bold relative inline-block relative" dangerouslySetInnerHTML={{
              __html: data?.title?.split('||')[1]?.trim() || ""
            }}>
            </span>
          </Tagging>

          <span className="mt-4 sm:mt-6 text-xs sm:text-base lg:text-lg leading-relaxed" dangerouslySetInnerHTML={{
            __html: data?.subTitle || "Germany provides various scholarships for international students, including DAAD and university-funded options."
          }} />
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-8 sm:gap-x-16 gap-y-4 sm:gap-y-6 mt-6 sm:mt-10">
          {data.items?.map((item, i) => (
            <div key={i} className="space-y-3">

              {/* Scholarship Row */}
              <div className="flex items-center gap-3" onClick={() => toggleAccordion(i)}>
                <div className="bg-yellow-400 text-black rounded-full p-2 flex-shrink-0">
                  <DynamicLucideIcon
                    name={item.icon}
                    size={18}
                  />
                </div>

                <span
                  className="border-b border-white pb-1 text-sm sm:text-base flex-1 cursor-pointer"
                  dangerouslySetInnerHTML={{
                    __html: item.title,
                  }}
                />

                <button

                  className="text-white hover:scale-110 transition-all duration-300"
                >
                  <ArrowRight
                    className={`w-5 h-5 transition-transform duration-300 ${openIndex === i ? "rotate-90" : ""
                      }`}
                  />
                </button>
              </div>

              {/* Extra Details */}
              {item?.extraDetail && (
                <div
                  className={`overflow-hidden transition-all duration-500 ease-in-out ${openIndex === i
                    ? "max-h-[1000px] opacity-100 mt-3"
                    : "max-h-0 opacity-0"
                    }`}
                >
                  <div className="ml-12 bg-white/10 border border-white/20 rounded-lg p-2 backdrop-blur-sm">
                    <div
                      className="text-white text-sm leading-7 prose prose-invert max-w-none"
                      dangerouslySetInnerHTML={{
                        __html: item.extraDetail,
                      }}
                    />
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>

        <div className="flex justify-center mt-6 sm:mt-8">
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


export const CTASection = ({ data }) => {
  if (data?.isHidden === "yes") return null
  return (
    <section className="relative bg-[#ee6a43] overflow-hidden py-12 sm:py-16 lg:py-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 grid grid-cols-1 lg:grid-cols-2 items-center gap-8 lg:gap-0">

        {/* Text */}
        <div className="text-white relative z-10">
          <Tag data={data?.tag} text={data?.title || "Scholarships for International Students"} css={"text-xl sm:text-3xl md:text-4xl font-semibold leading-tight"} />

          <span
            className="mt-4 text-sm sm:text-base lg:text-lg max-w-xl text-white/90"
            dangerouslySetInnerHTML={{
              __html: data?.subtitle || "Explore top universities, expert guidance, and seamless admission support with Ooshas Global.",
            }}
          />
          <div className="mt-4">
            <a href="/contact">
              <button className="bg-secondary hover:bg-primary px-6 sm:px-8 py-2.5 sm:py-3 rounded-full font-medium shadow-md hover:scale-105 transition text-xs sm:text-base">
                Contact US
              </button>
            </a>
          </div>
        </div>

        {/* Decorative circle — only on lg */}
        <div className="hidden lg:flex relative h-[325px] items-center justify-center">
          <img
            src="/images/circle stand.png"
            alt=""
            className="absolute z-10 w-[90px] bottom-0"
            style={{ right: "calc(50% - 45px)" }}
          />
          <img
            src="/images/circle.png"
            alt=""
            className="w-80 xl:w-96 animate-spin [animation-duration:60s]"
          />
        </div>
      </div>

      <img
        src="/images/country-building-img.png"
        alt=""
        className="absolute bottom-0 right-0 w-2/3 sm:w-1/2 object-contain pointer-events-none"
      />
      <div className="absolute bottom-0 left-0 w-full sm:w-1/2 h-2 sm:h-3 bg-yellow-400" />
    </section>
  )
}

const SimilarDestination = ({ countryres, sliderRef }) =>
(


  <section className="py-12 max-w-7xl mx-auto">
    <div className="flex items-center gap-3 mb-6">
      <div className="w-1 h-8 bg-orange-500"></div>
      <h2 className="text-2xl font-bold text-gray-800">
        Related Destinations
      </h2>
    </div>

    <div ref={sliderRef} className="keen-slider">
      {countryres?.map((item) => (
        <div
          key={item._id}
          className="keen-slider__slide bg-white border border-gray-300"
        >
          <Link href={`/destination/${item.slug}`}>
            <div className="h-42 overflow-hidden border-b border-gray-300">
              <img
                src={item.country?.image || item.navbarImage}
                alt={item.country?.name}
                className="w-full h-full object-cover"
              />
            </div>

            <div className="p-5">
              <div className="flex items-center gap-2">
                <div className="w-8 h-[1px] bg-orange-500"></div>
                <span className="text-xs uppercase tracking-widest text-orange-600 font-semibold">
                  Destination
                </span>
              </div>

              <h3 className="text-xl font-bold text-gray-900 truncate my-4">
                {item?.title }
              </h3>


            </div>
          </Link>
        </div>
      ))}
    </div>
  </section>

)


// ─── Main Component ────────────────────────────────────────────────────────────

export default function CountryDetails({ Universityres, Faqres, pageData, imageData, videoRes, countryres }) {
  const router = useRouter()
  const pathname = usePathname()

  const animation = { duration: 40000, easing: (t) => t };

  const [sliderRef] = useKeenSlider({
    loop: true,
    renderMode: "performance",
    drag: true,
    slides: {
      perView: 4,
      spacing: 20,
    },
    breakpoints: {
      "(max-width: 1024px)": {
        slides: {
          perView: 2,
          spacing: 16,
        },
      },
      "(max-width: 640px)": {
        slides: {
          perView: 1,
          spacing: 12,
        },
      },
    },
    created(s) {
      s.moveToIdx(5, true, animation);
    },
    updated(s) {
      s.moveToIdx(s.track.details.abs + 5, true, animation);
    },
    animationEnded(s) {
      s.moveToIdx(s.track.details.abs + 5, true, animation);
    },
  });

  useEffect(() => {
    if (pathname.startsWith("/destination/")) {
      const slug = pathname.split("/destination/")[1]
      if (slug) router.replace(`/${slug}`)
    }
  }, [pathname, router])

  const sectionMapping = {
    hero: HeroSection,
    formSection: FormSection,
    whyChooseUs: WhyChooseUsSection,
    whyStudy: WhyStudySection,
    PopularCourses: PopularCoursesSection,
    lifeIn: LifeInSection,
    choosingUs: ChoosingUsSection,
    eligibilityCriteria: EligibilityCriteriaSection,
    contentSection: ContentSection,
    servicesection: ServiceSection,
    scholarships: ScholarshipsSection,
    cta: CTASection,
    similardestination: SimilarDestination,
    videoTestimonials: 'VideoTestimonials',
    imageTestimonials: 'ImageTestimonial',
  }


  const getOriginalSectionName = (name) =>
    name.includes('_copy_') ? name.split('_copy_')[0] : name

  const getSortedSections = () => {
    if (!pageData?.sections) return []
    return Object.keys(pageData.sections)
      .map((name) => {
        const data = pageData.sections[name]
        if (data.__order__ === undefined) return null
        return {
          name,
          alldata: pageData,
          originalName: getOriginalSectionName(name),
          data,
          order: data.__order__,
        }
      })
      .filter(Boolean)
      .sort((a, b) => a.order - b.order)
  }

  const sortedSections = getSortedSections()


  const scholarshipSection = pageData?.sections?.scholarships
  const scholarshipItems = scholarshipSection?.items || []
  const midPoint = Math.ceil(scholarshipItems.length / 2)
  const leftScholarships = scholarshipItems.slice(0, midPoint).map((i) => i.title)
  const rightScholarships = scholarshipItems.slice(midPoint).map((i) => i.title)

  const visaStories = imageData?.filter((i) => i.target === "visa" && i.status === 'Approved') || []
  const regularImages = imageData?.filter((i) => i.target !== 'visa' && i.type === 'image') || []

  const shouldRenderSection = (name, data) => {
    if (!data) return false
    // if (name === 'visaStories') //console.log("Visa Stories Count:", visaStories.length)
    if (name === 'videoTestimonials') return videoRes?.data?.length > 0
    if (name === 'imageTestimonials') return regularImages?.length > 0
    if (name === 'visaStories') return visaStories?.length > 0
    return true
  }

  return (
    <>
      {sortedSections.map(({ name, originalName, data, alldata, order }) => {
        if (!shouldRenderSection(originalName, data)) return null

        const SectionComponent = sectionMapping[originalName] || sectionMapping[name]

        if (originalName === 'hero' || name === 'hero') {
          return SectionComponent && (
            <SectionComponent key={`${name}-${order}`} data={data} alldata={alldata} />
          )
        }
        if (originalName === 'choosingUs' || name === 'choosingUs') {
          return SectionComponent && (
            <SectionComponent key={`${name}-${order}`} data={data} Universityres={Universityres} />
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
        // if (originalName === 'videoTestimonials' || name === 'videoTestimonials') {
        //   return (
        //     <VideoTestimonialsSlider
        //       key={`${name}-${order}`}
        //       items={videoRes?.data || []}
        //       title={data?.title}
        //       subtitle={data?.subtitle}
        //       tag={data?.tag}
        //     />
        //   )
        // }


        if (originalName === 'imageTestimonials' || name === 'imageTestimonials') {
          return null
          return regularImages?.length > 0 && (
            <ImageTestimonial
              key={`${name}-${order}`}
              title={data?.title || "Our Student Success Stories"}
              subtitle={data?.subtitle || "Real experiences from our students"}
              items={regularImages}
            />
          )
        }

        if (originalName === 'visastories' || name === 'visaStories') {
          return visaStories?.length > 0 && (
            <VisaDetails />
          )
        }



        return SectionComponent && (
          <SectionComponent key={`${name}-${order}`} data={data} />
        )
      })}

      <div className='max-w-7xl mx-auto pt-6'>
        <AuthorCard
          name="Sakshi Taneja"
          designation="Content Writer & International Education Specialist"
          image="/authors/sakshi.jpg"
          bio="Sakshi Taneja has over 7 years of experience helping students secure admissions to leading universities across the UK, Germany, Australia, Italy, Ireland, Canada, and other top study destinations. Her guidance covers university selection, scholarships, visa applications, and career planning."
        />
      </div>


      {countryres?.length > 0 && (
        <SimilarDestination countryres={countryres} sliderRef={sliderRef} />
      )}

      <FAQSection Faqres={Faqres} />
    </>
  )
}