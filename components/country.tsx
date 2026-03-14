"use client"

import UniversityCard from '@/components/UniversityCard'
import { Divide, Facebook, Instagram, Linkedin, PhoneIcon, Send, Twitter, Youtube } from 'lucide-react'
import Image from 'next/image'

import FAQSection from '@/components/faqPage'
import { DynamicLucideIcon } from '@/components/DynamicLucideIcon'
import ImageTestimonial from './ImageTestimonial'
import Balloon from './balloon'
import { useState } from 'react'
import EligibilitySection from './Eligibility'

export default function CountryDetails({ Universityres, Faqres, pageData, imageData, videoRes }) {

  const [expanded, setExpanded] = useState(false);


  const [playingIndex, setPlayingIndex] = useState(null);

  const getYoutubeId = (url) => {
    const regExp = /v=([^&]+)/;
    const match = url.match(regExp);
    return match ? match[1] : "";
  };


  console.log(pageData)

  const services = [
    {
      title: "FREE Profile Evaluation",
      description: "Assess your eligibility for German universities",
      icon: "/icons/evaluation.svg"
    },
    {
      title: "Course & University Selection",
      description: "Find programs matching your goals and budget",
      icon: "/icons/university.svg"
    },
    {
      title: "Application Assistance",
      description: "Complete support for Uni-Assist and direct applications",
      icon: "/icons/application.svg"
    },
    {
      title: "SOP & LOR Preparation",
      description: "Expert editing and guidance for strong applications",
      icon: "/icons/document.svg"
    },
    {
      title: "Scholarship Guidance",
      description: "Identify and apply for DAAD and other scholarships",
      icon: "/icons/scholarship.svg"
    },
  ];


  // Split scholarships into left and right columns
  const scholarshipItems = pageData?.sections?.scholarships?.items || [];
  const midPoint = Math.ceil(scholarshipItems.length / 2);
  const leftScholarships = scholarshipItems.slice(0, midPoint).map(item => item.title) || [
    "British Chevening Scholarships for International Scholarships",
    "Erasmus Mundus Joint Masters Degree Scholarship",
    "Rhodes Scholarship",
    "Commonwealth Scholarship and Fellowship Plan",
  ];

  const rightScholarships = scholarshipItems.slice(midPoint).map(item => item.title) || [
    "A.S Hornby Educational Trust Scholarship",
    "Felix Scholarships",
    "Charles Wallace India Trust Scholarships (CWIT)",
    "Dr. Manmohan Singh Scholarships",
  ];






  const handleToggle = () => {


    setExpanded(!expanded);


  };




  return (
    <>
      <section>
        <div
          className="w-full min-h-[70vh] sm:h-[88vh] relative flex items-center justify-start"
          style={{
            backgroundImage: `url(${pageData?.sections?.hero?.heroImagee || "/images/country-bg.jpeg"})`,
            backgroundSize: "cover",
            backgroundPosition: "center",
          }}
        >
          {/* Content Wrapper */}
          <div className="z-10 w-full h-full flex flex-col justify-center">

            {/* Overlay */}
            <div className="bg-black/50 w-full flex items-center">

              <div className="relative w-full px-6 sm:px-10 lg:px-10 py-10">

                {/* Balloon */}
                <div
                  className="
            absolute
            left-2 top-6
            sm:left-6 sm:top-10
            lg:left-15 lg:-top-25
            z-10
          "
                >
                  <Balloon Pageres={pageData} />
                </div>

                {/* Text Content */}
                <div className="max-w-xl lg:max-w-2xl lg:ml-20">

                  {/* Heading */}
                  <h1
                    className="
              text-2xl sm:text-4xl md:text-5xl lg:text-4xl
              font-bold text-white
              text-left
              mb-6
            "
                  >
                    {pageData?.sections?.hero?.title || "Study in Germany"}
                  </h1>

                  {/* Subtitle */}
                  <p
                    className="text-white text-sm sm:text-base mt-3 max-w-full sm:max-w-[79%]"
                    dangerouslySetInnerHTML={{
                      __html: pageData?.sections?.hero?.subtitle || "",
                    }}
                  />

                  {/* Buttons */}
                  <div className="flex flex-col sm:flex-row gap-4 mt-6">

                    <a href={pageData?.sections?.hero?.ctaLink1 || "/contact"}>
                      <button
                        className="
                  bg-yellow-400 hover:bg-[#f46c44]
                  hover:text-white hover:scale-105
                  transition duration-300
                  rounded-full
                  px-5 sm:px-6 md:px-4
                  py-3 md:py-4
                  flex items-center gap-3
                  font-bold text-gray-900
                  text-xs md:text-base lg:text-sm
                  shadow-lg
                  cursor-pointer
                "
                      >
                        <PhoneIcon size={20} />
                        <span>
                          {pageData?.sections?.hero?.ctaText1 ||
                            "Talk to an Expert Counsellor for FREE"}
                        </span>
                      </button>
                    </a>

                    <a href={pageData?.sections?.hero?.ctaLink2 || "/contact"}>
                      <button
                        className="
                  bg-[#f46c44] hover:bg-yellow-400
                  hover:text-black hover:scale-105
                  transition duration-300
                  rounded-full
                  px-5 sm:px-6 md:px-8
                  py-3 md:py-4
                  flex items-center gap-3
                  font-bold text-white
                  text-xs md:text-base lg:text-sm
                  shadow-lg
                  cursor-pointer
                "
                      >
                        <PhoneIcon size={20} />
                        <span>
                          {pageData?.sections?.hero?.ctaText2 ||
                            "Talk to an Expert Counsellor for FREE"}
                        </span>
                      </button>
                    </a>

                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Right Image */}
          <div
            className="
      hidden lg:block
      absolute bottom-0 right-0
      w-[260px] sm:w-[420px] md:w-[600px]
      lg:w-[900px] z-10
      "
          >
            <img
              src={pageData?.sections?.hero?.heroImage || "/images/country-hero.png"}
              className="w-full h-full object-contain"
              alt=""
            />
          </div>
        </div>
      </section>

      {/* Form Section - RESPONSIVE */}
      <section className="px-4 sm:px-6 lg:pr-10 py-12 sm:py-16 lg:py-20 relative overflow-hidden">
        <div className="mx-auto grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12 items-center">

          {/* ================= LEFT FORM ================= */}
          <div className="bg-white border border-gray-300 p-6 sm:p-8 lg:px-4 shadow-sm rounded-lg">
            <h2 className="text-orange-500 text-base sm:text-2xl font-semibold mb-6 sm:mb-8 pl-6 sm:pl-8 lg:pl-12 tracking-wide">
              GET IN TOUCH
            </h2>

            <div className="space-y-6 pl-6 sm:pl-8 lg:pl-10">
              <input
                type="text"
                placeholder="Name"
                className="w-full border-b-2 border-gray-400 focus:outline-none focus:border-orange-500 pb-2 bg-transparent text-sm"
              />

              <input
                type="email"
                placeholder="Email"
                className="w-full border-b-2 border-gray-400 focus:outline-none focus:border-orange-500 pb-2 bg-transparent text-sm"
              />

              <input
                type="text"
                placeholder="Mobile"
                className="w-full border-b-2 border-gray-400 focus:outline-none focus:border-orange-500 pb-2 bg-transparent text-sm"
              />

              <select className="w-full border-b-2 border-gray-400 focus:outline-none focus:border-orange-500 pb-2 bg-transparent text-sm">
                <option>Nearest Center</option>
                <option>Delhi</option>
                <option>Mumbai</option>
                <option>Chandigarh</option>
              </select>

              <textarea
                placeholder="Queries"
                rows={3}
                className="w-full border-b-2 border-gray-400 focus:outline-none focus:border-orange-500 pb-2 bg-transparent resize-none text-sm"
              />

              <a className='' href={pageData?.sections?.formSection?.ctaLink1 || "/contact"}>
                <button className="bg-secondary hover:bg-[#6d1403] text-white px-6 sm:px-8 py-2.5 sm:py-3 rounded-full font-semibold transition mb-4 text-xs sm:text-base">
                  {"CONTACT US"}
                </button>
              </a>
              <div className='w-full border-b-2 border-gray-400'></div>
            </div>
          </div>

          {/* ================= RIGHT CONTENT ================= */}
          <div className="relative z-10">
            <h4 className="text-[#F46C44] text-2xl sm:text-3xl font-medium mb-2">
              {pageData?.sections?.formSection?.title?.split('||')[0]?.trim() || "Overview of"}
            </h4>

            <h2 className="text-[#123b73] text-lg sm:text-4xl lg:text-5xl font-bold mb-4 sm:mb-6 relative inline-block">
              {pageData?.sections?.formSection?.title?.split('||')[1]?.trim() || "Study in Germany"}
              <span className="absolute right-0 -bottom-2 w-12 sm:w-16 h-1 bg-[#F46C44]"></span>
            </h2>

            <p
              className="text-gray-700 leading-relaxed text-xs sm:text-lg mb-6"
              dangerouslySetInnerHTML={{
                __html: pageData?.sections?.formSection?.subtitle || "",
              }}
            />

            <a href={pageData?.sections?.formSection?.ctaLink1 || "/contact"}>
              <button className="bg-secondary hover:bg-[#6d1403] text-white px-5 sm:px-6 py-2.5 sm:py-3 rounded-full font-semibold transition text-xs sm:text-base">
                {pageData?.sections?.formSection?.ctaText1 || "Read More >>"}
              </button>
            </a>
          </div>
        </div>

        {/* ================= RIGHT SIDE TOWER IMAGE ================= */}
        <div className="hidden lg:block absolute right-10 -bottom-50 h-full w-[300px]">
          <Image
            src="/images/tower.png"
            alt="Germany Tower"
            fill
            className="object-contain object-right w-30 h-50"
          />
        </div>
      </section>

      {/* Why Choose Germany Section - RESPONSIVE */}
      <section className="w-full bg-[#ef6a42] py-12 sm:py-16 lg:py-20 px-4 sm:px-6">
        <div className="max-w-5xl mx-auto text-left">

          {/* Heading */}
          <h2 className="text-white text-lg sm:text-4xl md:text-5xl font-bold relative inline-block">
            <span>{pageData?.sections?.whyChooseUs?.title?.split("||")[0]}</span>
            <span>{pageData?.sections?.whyChooseUs?.title?.split("||")[1]}
              <span className="block w-12 sm:w-16 h-1 bg-yellow-400 absolute left-0 mt-2 sm:mt-3"></span>

            </span>

          </h2>

          {/* Paragraph */}
          <div className="mt-6 sm:mt-8">

            <p
              className={`text-white [&_*]:text-base leading-relaxed transition-all duration-300 ${expanded ? "" : "line-clamp-3"
                }`}
              dangerouslySetInnerHTML={{
                __html: pageData?.sections?.whyChooseUs?.subtitle ?? "",
              }}
            />

            <button
              type="button"
              onClick={handleToggle}
              className="text-yellow-300 mt-3 font-semibold"
            >
              {expanded ? "Read Less" : "Read More"}
            </button>

          </div>

          {/* Button */}
          <div className="mt-8 sm:mt-10 text-center">
            <a href={pageData?.sections?.whyChooseUs?.ctaLink1 || "/contact"}>
              <button className="bg-secondary hover:bg-[#5a1002] text-white px-6 sm:px-8 py-2.5 sm:py-3 rounded-full text-xs sm:text-lg font-semibold transition">
                {pageData?.sections?.whyChooseUs?.ctaText1 || "Read More >>"}
              </button>
            </a>
          </div>

        </div>
      </section>

      {/* Why Study Section - RESPONSIVE */}
      <section className="w-full py-12 sm:py-16 lg:py-20 px-4 sm:px-6 bg-white">
        <div className="max-w-7xl mx-auto">

          {/* Heading */}
          <div className="mb-6 sm:mb-8">
            <h2 className="text-lg sm:text-4xl md:text-5xl font-bold text-[#123b73] relative inline-block">
              <span>{pageData?.sections?.whyStudy?.title.split("||")[0]}</span>
              <span className='text-[#F46C44]'>{pageData?.sections?.whyStudy?.title.split("||")[1]}
                <span className="absolute left-0 -bottom-2 w-16 sm:w-20 h-1 bg-[#F46C44]"></span>

              </span>

            </h2>
          </div>

          <div>
            {/* ================= LEFT CONTENT ================= */}
            <div>
              <p className="text-[#123b73] text-xs sm:text-lg mb-8 sm:mb-10 leading-relaxed">
                {pageData?.sections?.whyStudy?.subTitle}
              </p>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 sm:gap-8">
                {(pageData?.sections?.whyStudy?.items || []).map((item, index) => (
                  <div key={index} className="flex items-start gap-3 sm:gap-4 bg-gray-200 p-4 rounded-xl">
                    <div className="text-[#8b1d04] flex-shrink-0">
                      <DynamicLucideIcon name={item.icon} size={28} className="sm:w-8 sm:h-8" />
                    </div>

                    <div>
                      <h4 className="text-base sm:text-xl font-semibold text-gray-900">
                        {item.title}
                      </h4>
                      <p className="text-[#123b73] text-xs sm:text-base">
                        <ul className="text-[#123b73] text-xs sm:text-base list-disc pl-5 space-y-1">
                          {item.description
                            .split("\n")
                            .filter((line) => line.trim() !== "")
                            .map((line, index) => (
                              <li key={index}>
                                {line.replace("•", "").trim()}
                              </li>
                            ))}
                        </ul>

                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

        </div>
      </section>


      <section className="w-full bg-white py-1 px-4">
        <div className="max-w-7xl mx-auto">

          {/* Heading */}
          <div className="text-left mb-12">
            <h2 className="text-xl lg:text-4xl font-semibold text-gray-900">
                            {pageData?.sections?.PopularCourses?.title}

            </h2>
            <p className="text-gray-500 mt-3 text-sm lg:text-base">
              {pageData?.sections?.PopularCourses?.subtitle}
            </p>
          </div>

          {/* Cards Grid */}
          <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3">

            {/* Card 1 */}
            {
             pageData?.sections?.PopularCourses?.coursesitem && pageData?.sections?.PopularCourses?.coursesitem?.map((item,i)=>(
                  <div className="bg-[#f6f7f9] rounded-[28px] border border-[#F46C44]  hover:shadow-md transition duration-300">

              {/* Image */}
              <div className="overflow-hidden w-full rounded-[28px]">
                <img
                  src={item?.image||"https://images.unsplash.com/photo-1516321318423-f06f85e504b3"}
                  alt="Data Science"
                  className="w-full h-[150px] lg:h-[210px] object-cover"
                />
              </div>

              <div className=' px-2 lg:px-4 py-3 lg:py-8'>
                {/* Title */}
                <h3 className=" text-base lg:text-[18px] font-semibold text-gray-800 ">
                 {item?.coursesname}
                </h3>

              </div>



            </div>

              ))
            }
          

          </div>
        </div>
      </section>


      {/* Life in Germany Section - RESPONSIVE */}
      <section className="w-full min-h-auto lg:min-h-screen px-4 sm:px-6 lg:px-30 bg-white lg:pt-20 lg:pb-62 relative py-12 lg:py-20">
        <div className='max-w-7xl mx-auto'>
          {/* Title Section */}
          <div className="mb-8 md:mb-12">
            <h1 className="text-lg sm:text-4xl md:text-5xl lg:text-6xl font-bold text-primary mb-4 relative">
              {pageData?.sections?.lifeIn?.title || "Life in Germany"}
              <span className="w-20 sm:w-25 h-1.5 absolute right-1/4 sm:left-0 -bottom-2 sm:-bottom-4 bg-[#F46C44] rounded-full"></span>
            </h1>
          </div>

          {/* Content Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-10">
            {/* Left Section - Benefits List */}
            <div className="flex flex-col gap-4 sm:gap-5 lg:gap-6">
              {(pageData?.sections?.lifeIn?.items || []).map((item, index) => (
                <div key={index} className="flex items-center gap-4 w-full lg:w-120 relative z-1">
                  {/* Left Border Accent - Hidden on mobile */}
                  <div className="hidden sm:block w-60 h-20 bg-secondary absolute -z-1 -top-2 -left-2"></div>

                  {/* Benefit Box */}
                  <div className="flex-1 bg-[#f46c44] hover:bg-orange-600 transition-colors rounded-tr-[30px] sm:rounded-tr-[50px] px-4 sm:px-6 py-3 sm:py-4 lg:py-5 text-white text-sm sm:text-base lg:w-40 ">
                    <h1 className='text-base sm:text-2xl lg:text-3xl font-semibold'>{item.title}</h1>
                    <p className='text-xs sm:text-sm text-white mt-1'>{item?.description}</p>
                  </div>
                </div>
              ))}
            </div>

            {/* Right Section - Images */}
            <div className="flex flex-col gap-4 relative lg:absolute lg:right-0 lg:top-50">
              {/* Yellow Accent Bar - Hidden on mobile */}
              <div className="hidden sm:block w-70 h-10 bg-yellow-400 absolute -top-5 right-20 -z-1"></div>

              {/* Top Image - Woman with Laptop */}
              <div className="relative w-full h-48 sm:h-56 lg:h-140 shadow-md z-1">
                <img
                  src={pageData?.sections?.lifeIn?.image || ""}
                  alt="Woman working on laptop"
                  className="w-full h-full object-cover rounded-lg "
                />
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Image - Munich Cityscape */}
        <img
          src={pageData?.sections?.lifeIn?.buttomImage || "/images/life-germany-img-1.png"}
          alt="Munich cityscape"
          className="w-full max-w-[400px] sm:max-w-[500px] lg:w-[700px] h-auto object-contain absolute left-1/2 -translate-x-1/2 lg:left-130 lg:translate-x-0 bottom-0 z-11 hidden lg:block"
        />
      </section>

      {/* Choosing University Section - RESPONSIVE */}
      <section className="relative w-full bg-[#ef6a42]  sm:py-12 lg:py-16">
        {/* Main Content */}
        <div className="grid grid-cols-1 lg:grid-cols-2 items-center">

          {/* ================= LEFT IMAGE ================= */}
          <div className="relative w-full h-[250px] sm:h-[350px] lg:h-[500px] lg:-left-50">
            <Image
              src={pageData?.sections?.choosingUs?.image || "/images/country-university-img.png"}
              alt="Germany University"
              fill
              className="object-contain "
              priority
            />
          </div>

          {/* ================= RIGHT CONTENT ================= */}
          <div className="px-6 sm:px-8 lg:px-4 py-8 lg:py-16 text-white">

            <h4 className="text-lg sm:text-3xl md:text-4xl lg:text-5xl font-light mb-2">
              {pageData?.sections?.choosingUs?.title?.split('||')[0]?.trim() || "Choosing the Right"}
            </h4>

            <h2 className="text-lg sm:text-4xl md:text-5xl lg:text-6xl font-bold relative inline-block mb-4 sm:mb-6">
              {pageData?.sections?.choosingUs?.title?.split('||')[1]?.trim() || "University in Germany"}
              <span className="absolute left-0 -bottom-2 w-16 sm:w-20 h-1 bg-yellow-400"></span>
            </h2>

            <p className="text-xs sm:text-lg md:text-xl leading-relaxed">
              {pageData?.sections?.choosingUs?.subtitle || "Germany offers exceptional educational opportunities, but choosing the right university requires more than just rankings."}
            </p>

          </div>

        </div>

        {/* ================= BOTTOM YELLOW ACCENT ================= */}
        <div className="hidden sm:block absolute bottom-8 left-20 w-74 h-6 bg-yellow-300"></div>
      </section>

      {/* University Card Section - RESPONSIVE */}
      <div className='w-full bg-[#ef6a42] px-4 sm:px-6 lg:px-8 pb-10 mx-auto'>
        <UniversityCard university={Universityres} />
      </div>

      <EligibilitySection pageData = {pageData} />






      {/* ================= TABLE/CONTENT SECTION - RESPONSIVE ================= */}
      <section className="w-full bg-white py-12 sm:py-16 lg:py-20 px-4 sm:px-6">
        <div className="max-w-7xl mx-auto">

          {/* Table Wrapper */}
          <div className="overflow-x-auto">
            {pageData?.sections?.contentSection?.items?.map((item, i) => (
              <div key={i} className="min-w-full mb-8 lg:mb-10">
                {/* Heading */}
                <div className="mb-6 sm:mb-8">
                  <h2 className="text-primary text-lg sm:text-3xl md:text-4xl font-bold">
                    <span className='text-[#F46C44] block'>{item.title.split("||")[0]}</span>
                    <div className='flex gap-2'>
                      <span className=' mt-1 sm:mt-2'>{item.title.split("||")[1]}</span>
                      <span className=' mt-1 sm:mt-2 border-b-4 border-[#F46C44] inline-block'>{item.title.split("||")[2]}</span>
                    </div>

                  </h2>
                </div>

                <div>
                  {/* ===== Responsive Table CSS ===== */}
                  <style>
                    {`
      /* Wrapper */
      .country-table {
        width: 100%;
        overflow-x: auto;
      }

      /* Target API table */
      .country-table * table {
        width: 100%;
        border-collapse: collapse;
      }

      /* ===== Desktop (default) ===== */
      .country-table * {
        font-size: 14px!important;
        line-height: 1.5;
        padding:0!important;
       
      }

      /* ===== Tablet ===== */
      @media (max-width: 1024px) {
        .country-table * table th,
        .country-table table td {
          font-size: 14px;
        }
      }

      /* ===== Mobile ===== */
      @media (max-width: 640px) {
        .country-table * table th,
        .country-table * table td {
          font-size: 12px !important;
          padding: 6px 8px;
        }

        /* keep columns readable */
        .country-table * table {
          min-width: 520px;
        }
      }
    `}
                  </style>

                  {/* ===== API HTML Render ===== */}
                  <div
                    className="max-w-none country-table overflow-x-auto"
                    dangerouslySetInnerHTML={{
                      __html: item.description,
                    }}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className='bg-white'>
        <div className="max-w-7xl mx-auto  py-10">

          {/* Heading */}
           <div className="mb-10 sm:mb-12 lg:mb-16">
            <h2 className="text-xl sm:text-2xl md:text-3xl lg:text-5xl mb-2">
              <span className="text-[#F46C44]">
                {pageData?.sections?.servicesection?.servicetitle?.split('||')[0]?.trim() || "Video"}
              </span>{" "} <br />
              <span className="text-primary font-bold relative inline-block">
                {pageData?.sections?.servicesection?.servicetitle?.split('||')[1]?.trim() || "Testimonials"}
                <span className="absolute right-0 bottom-0 w-20 sm:w-25 h-[2px] lg:h-1 bg-[#F46C44]"></span>
              </span>
            </h2>
          </div>

          {/* Services Grid */}
          <div className="grid md:grid-cols-2 gap-8">

            {pageData?.sections?.servicesection?.serviceitem && pageData?.sections?.servicesection?.serviceitem?.map((service, index) => (
              <div
                key={index}
                className="bg-gray-200 rounded-xl p-6 flex gap-4 hover:shadow-md transition"
              >

                {/* Icon */}
                <div className="w-10 h-10 flex items-center justify-center text-orange-500">
                  <img src={service?.icon} alt="" />
                </div>

                {/* Content */}
                <div>
                  <h3 className="font-semibold text-lg text-gray-900">
                    {service?.itemtitle}
                  </h3>

                  <p className="text-gray-600 text-sm mt-1">
                    {service?.itemsubtitle}
                  </p>
                </div>

              </div>
            ))}

          </div>

        </div>

      </section>




      {/* Scholarships Section - RESPONSIVE */}
      <section className="w-full bg-[#ef6a42] py-12 sm:py-16 lg:py-20 px-4 sm:px-6">
        <div className="max-w-6xl mx-auto text-white">

          {/* Heading */}
          <div className="mb-8 sm:mb-10">
            <p className="text-lg sm:text-4xl md:text-5xl font-light mb-2">
              {pageData?.sections?.scholarships?.title?.split('||')[0]?.trim() || "scholarships to"}
            </p>

            <h2 className="text-lg sm:text-4xl md:text-5xl lg:text-6xl font-bold relative inline-block">
              {pageData?.sections?.scholarships?.title?.split('||')[1]?.trim() || "Study in germany"}
              <span className="absolute right-0 -bottom-2 w-12 sm:w-16 h-1 bg-yellow-400"></span>
            </h2>

            {/* Description */}
            <p className="mt-4 sm:mt-6 max-w-3xl text-xs sm:text-lg leading-relaxed">
              {pageData?.sections?.scholarships?.subTitle || "Germany provides various scholarships for international students, including DAAD and university-funded options."}
            </p>
          </div>

          {/* Scholarship Lists */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-x-16 sm:gap-x-20 gap-y-4 sm:gap-y-6 mt-8 sm:mt-12">

            {/* LEFT COLUMN */}
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

            {/* RIGHT COLUMN */}
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
        </div>
      </section>

      {/* Image Testimonial - Keep as is */}
      <ImageTestimonial
        title={pageData?.imageTestimonials?.title}
        subtitle={pageData?.imageTestimonials?.subtitle}
        items={imageData}
      />

      {/* Video Testimonials - RESPONSIVE */}
      <section className="bg-white py-2 sm:py-5 lg:py-6 px-4 sm:px-8 lg:px-20">
        <div className="mx-auto">

          {/* ===== HEADING ===== */}
          <div className="mb-10 sm:mb-12 lg:mb-16">
            <h2 className="text-xl sm:text-2xl md:text-3xl lg:text-5xl mb-2">
              <span className="text-[#F46C44]">
                {pageData?.sections?.videoTestimonials?.title?.split('||')[0]?.trim() || "Video"}
              </span>{" "} <br />
              <span className="text-primary font-bold relative inline-block">
                {pageData?.sections?.videoTestimonials?.title?.split('||')[1]?.trim() || "Testimonials"}
                <span className="absolute right-0 bottom-0 w-20 sm:w-25 h-[2px] lg:h-1 bg-[#F46C44]"></span>
              </span>
            </h2>
          </div>

          {/* ===== CARDS ===== */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 sm:gap-10">
            {videoRes.data.map((item, index) => (
              <a
                key={index}
                href={item.videoUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="relative block"
              >
                {/* IMAGE */}
                <div className="overflow-hidden rounded-2xl sm:rounded-3xl">
                  <img
                    src={item.image}
                    alt={item.name}
                    className="w-full h-[400px] sm:h-[480px] lg:h-[520px] object-cover object-top rounded-2xl sm:rounded-3xl"
                  />
                  <div className="absolute inset-0 flex items-center justify-center">
                    <div className="bg-white/80 rounded-full p-4 text-xl">
                      ▶
                    </div>
                  </div>
                </div>

                {/* INFO CARD */}
                <div className="absolute left-1/2 -translate-x-1/2 bottom-0 w-[90%] sm:w-[85%] lg:w-full lg:left-[213.5px] lg:translate-x-[-50%] bg-white rounded-xl sm:rounded-2xl border border-gray-500 shadow-md px-3 sm:px-4 py-3 sm:py-5 text-left">

                  <h3 className="font-bold text-primary mb-1 sm:mb-2 text-sm sm:text-base">
                    {item.name}
                  </h3>

                  <p className="text-xs sm:text-sm text-gray-600 leading-relaxed">
                    "{item.message}"
                  </p>

                </div>
              </a>
            ))}
          </div>

        </div>
      </section>

      {/* CTA Section - RESPONSIVE */}
      <section className="relative bg-[#ee6a43] overflow-hidden py-12 sm:py-16 lg:py-20">

        {/* ===== MAIN CONTENT ===== */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-6 grid grid-cols-1 lg:grid-cols-2 items-center">

          {/* LEFT SIDE */}
          <div className="text-white relative z-10">

            {/* Graduation Cap - Hidden on mobile */}
            <img
              src="/images/country-cap.png"
              alt=""
              className="hidden sm:block w-20 sm:w-24 lg:w-28 mb-4 absolute -top-12 sm:-top-15 -left-10 sm:-left-13 z-1"
            />

            {/* HEADING */}
            <h2 className="text-lg sm:text-4xl md:text-5xl font-semibold leading-tight relative mb-4">
              {pageData?.sections?.cta?.title || "Start Your Global Education Journey"}

              <div className="w-40 sm:w-48 lg:w-56 h-2 bg-yellow-400 mt-2 rounded-full absolute right-1/4 sm:right-50"></div>
            </h2>

            {/* DESCRIPTION */}
            <p className="mt-4 sm:mt-6 text-xs sm:text-base lg:text-lg max-w-xl text-white/90">
              Explore top universities, expert guidance, and seamless
              admission support with Ooshas Global.
            </p>

            {/* BUTTON + SOCIAL */}
            <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4 sm:gap-6 mt-6 sm:mt-8">

              <a href="/contact">
                <button className="bg-[#7a1e0e] px-6 sm:px-8 py-2.5 sm:py-3 rounded-full font-medium shadow-md hover:scale-105 transition text-xs sm:text-base">
                  Contact US
                </button>
              </a>

              {/* SOCIAL ICONS */}
              <div className="flex gap-3 sm:gap-4 flex-wrap">
                <div className="w-9 h-9 sm:w-10 sm:h-10 bg-black/70 rounded-full flex items-center justify-center text-white">
                  <Facebook size={16} className="sm:w-5 sm:h-5" />
                </div>
                <div className="w-9 h-9 sm:w-10 sm:h-10 bg-black/70 rounded-full flex items-center justify-center text-white">
                  <Instagram size={16} className="sm:w-5 sm:h-5" />
                </div>
                <div className="w-9 h-9 sm:w-10 sm:h-10 bg-black/70 rounded-full flex items-center justify-center text-white">
                  <Twitter size={16} className="sm:w-5 sm:h-5" />
                </div>
                <div className="w-9 h-9 sm:w-10 sm:h-10 bg-black/70 rounded-full flex items-center justify-center text-white">
                  <Youtube size={16} className="sm:w-5 sm:h-5" />
                </div>
                <div className="w-9 h-9 sm:w-10 sm:h-10 bg-black/70 rounded-full flex items-center justify-center text-white">
                  <Send size={16} className="sm:w-5 sm:h-5" />
                </div>
                <div className="w-9 h-9 sm:w-10 sm:h-10 bg-black/70 rounded-full flex items-center justify-center text-white">
                  <Linkedin size={16} className="sm:w-5 sm:h-5" />
                </div>
              </div>
            </div>
          </div>

          {/* RIGHT GRAPHIC - Hidden on mobile */}
          <div className="hidden lg:block relative h-[380px]">

            {/* London Eye */}
            <img
              src="/images/circle stand.png"
              alt=""
              className="absolute right-45 -bottom-3 w-[90px]"
            />

            <img
              src="/images/circle.png"
              alt=""
              className='w-100 absolute right-[24.5px] -bottom-12 animate-spin [animation-duration:60s]'
            />

          </div>
        </div>

        {/* CITY SILHOUETTE - Smaller on mobile */}
        <img
          src="/images/country-building-img.png"
          alt=""
          className="absolute bottom-0 right-0 w-full sm:w-1/2 object-contain"
        />

        {/* YELLOW STRIP */}
        <div className="absolute bottom-0 left-0 w-full sm:w-1/2 h-2 sm:h-3 bg-yellow-400"></div>

      </section>

      <FAQSection Faqres={Faqres} />
    </>
  )
}