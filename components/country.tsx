"use client"

import UniversityCard from '@/components/UniversityCard'
import { Facebook, Instagram, Linkedin, PhoneIcon, Send, Twitter, Youtube } from 'lucide-react'
import Image from 'next/image'
import FAQSection from '@/components/faqPage'
import { DynamicLucideIcon } from '@/components/DynamicLucideIcon'
import ImageTestimonial from './ImageTestimonial'
import Balloon from './balloon'
import { useState } from 'react'
import EligibilitySection from './Eligibility'
import ExpandableText from './Expandline'

// Section Components
const HeroSection = ({ data }) => {
  if (data?.isHidden === "yes") return null
  return (
    <section className="block">
      <div
        className="w-full min-h-[70vh] sm:h-[88vh] relative flex items-center justify-start"
        style={{
          backgroundImage: `url(${data?.heroImagee || "/images/country-bg.jpeg"})`,
          backgroundSize: "cover",
          backgroundPosition: "center",
        }}
      >
        <div className="z-10 w-full h-full flex flex-col justify-center">
          <div className="bg-black/50 w-full flex items-center">
            <div className="relative w-full px-6 sm:px-10 lg:px-10 py-10">
              <div className="absolute left-2 top-6 sm:left-6 sm:top-10 lg:left-15 lg:-top-25 z-10">
                <Balloon Pageres={{ sections: { hero: data } }} />
              </div>
              <div className="max-w-xl lg:max-w-2xl lg:ml-20">
                <h1 className="text-2xl sm:text-4xl md:text-5xl lg:text-4xl font-bold text-white text-left mb-6">
                  {data?.title || "Study in Germany"}
                </h1>
                <p className="text-white text-sm sm:text-base mt-3 max-w-full sm:max-w-[79%]"
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
        <div className="hidden lg:block absolute bottom-0 right-0 w-[260px] sm:w-[420px] md:w-[600px] lg:w-[900px] z-10">
          <img src={data?.heroImage || "/images/country-hero.png"} className="w-full h-full object-contain" alt="" />
        </div>
      </div>
    </section>
  )
}

const FormSection = ({ data }) => {
  if (data?.isHidden === "yes") return null
  return (
    <section className="px-4 sm:px-6 lg:pr-10 py-12 sm:py-16 lg:py-20 relative overflow-hidden">
      <div className="mx-auto grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12 items-center">
        <div className="bg-white border border-gray-300 p-6 sm:p-8 lg:px-4 shadow-sm rounded-lg">
          <h2 className="text-orange-500 text-base sm:text-2xl font-semibold mb-6 sm:mb-8 pl-6 sm:pl-8 lg:pl-12 tracking-wide">
            GET IN TOUCH
          </h2>
          <div className="space-y-6 pl-6 sm:pl-8 lg:pl-10">
            <input type="text" placeholder="Name" className="w-full border-b-2 border-gray-400 focus:outline-none focus:border-orange-500 pb-2 bg-transparent text-sm" />
            <input type="email" placeholder="Email" className="w-full border-b-2 border-gray-400 focus:outline-none focus:border-orange-500 pb-2 bg-transparent text-sm" />
            <input type="text" placeholder="Mobile" className="w-full border-b-2 border-gray-400 focus:outline-none focus:border-orange-500 pb-2 bg-transparent text-sm" />
            <select className="w-full border-b-2 border-gray-400 focus:outline-none focus:border-orange-500 pb-2 bg-transparent text-sm">
              <option>Nearest Center</option>
              <option>Delhi</option>
              <option>Mumbai</option>
              <option>Chandigarh</option>
            </select>
            <textarea placeholder="Queries" rows={3} className="w-full border-b-2 border-gray-400 focus:outline-none focus:border-orange-500 pb-2 bg-transparent resize-none text-sm" />
            <a href={data?.ctaLink1 || "/contact"}>
              <button className="bg-secondary hover:bg-[#6d1403] text-white px-6 sm:px-8 py-2.5 sm:py-3 rounded-full font-semibold transition mb-4 text-xs sm:text-base">
                CONTACT US
              </button>
            </a>
            <div className='w-full border-b-2 border-gray-400'></div>
          </div>
        </div>
        <div className="relative z-10">
          <h4 className="text-[#F46C44] text-2xl sm:text-3xl font-medium mb-2">
            {data?.title?.split('||')[0]?.trim() || "Overview of"}
          </h4>
          <h2 className="text-[#123b73] text-lg sm:text-4xl lg:text-5xl font-bold mb-4 sm:mb-6 relative inline-block">
            {data?.title?.split('||')[1]?.trim() || "Study in Germany"}
            <span className="absolute right-0 -bottom-4 w-12 sm:w-16 h-1 bg-[#F46C44]"></span>
          </h2>
          <p className="text-gray-700 leading-relaxed text-xs sm:text-lg mb-6"
            dangerouslySetInnerHTML={{ __html: data?.subtitle || "" }}
          />
          <a href={data?.ctaLink1 || "/contact"}>
            <button className="bg-secondary hover:bg-[#6d1403] text-white px-5 sm:px-6 py-2.5 sm:py-3 rounded-full font-semibold transition text-xs sm:text-base">
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
    <section className="w-full bg-[#ef6a42] py-12 sm:py-16 lg:py-20 px-4 sm:px-6">
      <div className="max-w-5xl mx-auto text-left">
        <h2 className="text-white text-lg sm:text-4xl md:text-5xl font-bold relative inline-block">
          <span>{data?.title?.split("||")[0]}</span>
          <span>{data?.title?.split("||")[1]}</span>
          <span className="block w-12 sm:w-16 h-1 bg-yellow-400 absolute left-0 mt-2 sm:mt-3"></span>
        </h2>
        <div className="mt-6 sm:mt-8">
          <ExpandableText htmlContent={data?.subtitle} />
        </div>
        <div className="mt-8 sm:mt-10 text-center">
          <a href={data?.ctaLink1 || "/contact"}>
            <button className="bg-secondary hover:bg-[#5a1002] text-white px-6 sm:px-8 py-2.5 sm:py-3 rounded-full text-xs sm:text-lg font-semibold transition">
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
          <h2 className="text-lg sm:text-4xl md:text-5xl font-bold text-[#123b73] relative inline-block">
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
    <section className="w-full bg-white py-1 px-4">
      <div className="max-w-7xl mx-auto">
        <div className="text-left mb-12">
          <h2 className="text-xl lg:text-4xl font-semibold text-gray-900">{data?.title}</h2>
          <p className="text-gray-500 mt-3 text-sm lg:text-base">{data?.subtitle}</p>
        </div>
        <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
          {(data?.coursesitem || []).map((item, i) => (
            <div key={i} className="bg-[#f6f7f9] rounded-[28px] overflow-hidden border border-[#F46C44] hover:shadow-md transition duration-300">
              <div className="overflow-hidden w-full rounded-[28px] relative">
                <img src={item?.image || "https://images.unsplash.com/photo-1516321318423-f06f85e504b3"} alt={item?.coursesname} className="w-full h-[150px] lg:h-[180px] object-cover" />
              </div>
              <div className='px-4 py-4 mb-2'>
                <h3 className="text-base lg:text-lg m-0 p-0 font-semibold text-gray-800">{item?.coursesname}</h3>
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
    <section className="w-full min-h-auto lg:min-h-screen px-4 sm:px-6 lg:px-30 bg-white lg:pt-20 lg:pb-62 relative py-12 lg:py-20">
      <div className='max-w-7xl mx-auto'>
        <div className="mb-8 md:mb-12">
          <h1 className="text-lg sm:text-4xl md:text-5xl lg:text-6xl font-bold text-primary mb-4 relative">
            {data?.title || "Life in Germany"}
            <span className="w-20 sm:w-25 h-1.5 absolute right-1/4 sm:left-0 -bottom-2 sm:-bottom-4 bg-[#F46C44] rounded-full"></span>
          </h1>
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-10">
          <div className="flex flex-col gap-4 sm:gap-5 lg:gap-6">
            {(data?.items || []).map((item, index) => (
              <div key={index} className="flex items-center gap-4 w-full lg:w-120 relative z-1">
                <div className="hidden sm:block w-60 h-20 bg-secondary absolute -z-1 -top-2 -left-2"></div>
                <div className="flex-1 bg-[#f46c44] hover:bg-orange-600 transition-colors rounded-tr-[30px] sm:rounded-tr-[50px] px-4 sm:px-6 py-3 sm:py-4 lg:py-5 text-white text-sm sm:text-base lg:w-40">
                  <h1 className='text-base sm:text-2xl lg:text-3xl font-semibold'>{item.title}</h1>
                  <p className='text-xs sm:text-sm text-white mt-1'>{item?.description}</p>
                </div>
              </div>
            ))}
          </div>
          <div className="flex flex-col gap-4 relative lg:absolute lg:right-0 lg:top-50">
            <div className="hidden sm:block w-70 h-10 bg-yellow-400 absolute -top-5 right-20 -z-1"></div>
            <div className="relative w-full h-48 sm:h-56 lg:h-140 shadow-md z-1">
              <img src={data?.image || ""} alt="Woman working on laptop" className="w-full h-full object-cover rounded-lg" />
            </div>
          </div>
        </div>
      </div>
      <img src={data?.buttomImage || "/images/life-germany-img-1.png"} alt="Munich cityscape" className="w-full max-w-[400px] sm:max-w-[500px] lg:w-[700px] h-auto object-contain absolute left-1/2 -translate-x-1/2 lg:left-130 lg:translate-x-0 bottom-0 z-11 hidden lg:block" />
    </section>
  )
}

const ChoosingUsSection = ({ data, Universityres }) => {
  if (data?.isHidden === "yes") return null
  return (
    <section className="relative w-full bg-[#ef6a42] sm:py-12 lg:py-16">
      <div className="mb-8 sm:mb-10 max-w-7xl mx-auto text-white">
        <p className="text-lg sm:text-4xl md:text-5xl font-light mb-2">
          {data?.title?.split('||')[0]?.trim() || "Choosing the Right"}
        </p>
        <h2 className="text-lg sm:text-4xl md:text-5xl lg:text-6xl font-bold relative inline-block">
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
    <section className="w-full bg-white py-12 sm:py-16 lg:py-20 px-4 sm:px-6">
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
  return (
    <section className="bg-white">
      <div className="max-w-7xl mx-auto px-3 sm:px-6 py-6 sm:py-10">
        <div className="mb-6 sm:mb-10 lg:mb-16 text-left lg:text-left">
          <h2 className="text-lg sm:text-2xl md:text-3xl lg:text-5xl leading-snug">
            <span className="text-[#F46C44] block">
              {data?.servicetitle?.split("||")[0]?.trim() || "Video"}
            </span>
            <span className="text-primary font-bold relative inline-block mt-1 sm:mt-2">
              {data?.servicetitle?.split("||")[1]?.trim() || "Testimonials"}
              <span className="absolute right-0 -bottom-1 sm:-bottom-2 w-12 sm:w-20 h-[2px] lg:h-1 bg-[#F46C44]"></span>
            </span>
          </h2>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6 lg:gap-8">
          {(data?.serviceitem || []).map((service, index) => (
            <div key={index} className="bg-gray-200 rounded-lg sm:rounded-xl p-3 sm:p-5 lg:p-6 flex items-start gap-3 sm:gap-4 hover:shadow-md transition">
              <div className="w-8 h-8 sm:w-10 sm:h-10 flex-shrink-0 flex items-center justify-center text-orange-500">
                <img src={service?.icon} alt="" className="w-full h-full object-contain" />
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
    <section className="w-full bg-[#ef6a42] py-12 sm:py-16 lg:py-20 px-4 sm:px-6">
      <div className="max-w-6xl mx-auto text-white">
        <div className="mb-8 sm:mb-10">
          <p className="text-lg sm:text-4xl md:text-5xl font-light mb-2">
            {data?.title?.split('||')[0]?.trim() || "scholarships to"}
          </p>
          <h2 className="text-lg sm:text-4xl md:text-5xl lg:text-6xl font-bold relative inline-block">
            {data?.title?.split('||')[1]?.trim() || "Study in germany"}
            <span className="absolute right-0 -bottom-4 w-12 sm:w-16 h-1 bg-yellow-400"></span>
          </h2>
          <p className="mt-4 sm:mt-6 max-w-3xl text-xs sm:text-lg leading-relaxed">
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
          <img src="/images/country-cap.png" alt="" className="hidden sm:block w-20 sm:w-24 lg:w-28 mb-4 absolute -top-12 sm:-top-15 -left-10 sm:-left-13 z-1" />
          <h2 className="text-lg sm:text-4xl md:text-5xl font-semibold leading-tight relative mb-4">
            {data?.title || "Start Your Global Education Journey"}
            <div className="w-40 sm:w-48 lg:w-56 h-2 bg-yellow-400 mt-2 rounded-full absolute right-1/4 sm:right-50"></div>
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
              <button className="bg-[#7a1e0e] px-6 sm:px-8 py-2.5 sm:py-3 rounded-full font-medium shadow-md hover:scale-105 transition text-xs sm:text-base">
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

  console.log(pageData)

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

  // Check if a section should be rendered
  const shouldRenderSection = (sectionName, sectionData) => {
    if (!sectionData) return false
    if (sectionName === 'videoTestimonials') {
      return videoRes?.data?.length > 0
    }
    if (sectionName === 'imageTestimonials') {
      return imageData?.length > 0
    }
    return true
  }

  return (
    <>
      {sortedSections.map(({ name, originalName, data, isDuplicate, order }) => {
        // Skip if section should not be rendered
        if (!shouldRenderSection(originalName, data)) return null

        // Get the component based on original name (not the duplicate name)
        let SectionComponent = sectionMapping[originalName]

        // If component not found for original name, try the exact name
        if (!SectionComponent) {
          SectionComponent = sectionMapping[name]
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

        if (originalName === 'videoTestimonials' || name === 'videoTestimonials') {
          return videoRes?.data?.length > 0 && (
            <section key={`${name}-${order}`} className="bg-white py-2 sm:py-5 lg:py-6 px-4 sm:px-8 lg:px-20">
              <div className="mx-auto">
                <div className="mb-10 sm:mb-12 lg:mb-16">
                  <h2 className="text-xl sm:text-2xl md:text-3xl lg:text-5xl mb-2">
                    <span className="text-[#F46C44]">
                      {data?.title?.split('||')[0]?.trim() || "Video"}
                    </span>{" "}
                    <br />
                    <span className="text-primary font-bold relative inline-block">
                      {data?.title?.split('||')[1]?.trim() || "Testimonials"}
                      <span className="absolute right-0 -bottom-2 w-20 sm:w-25 h-[2px] lg:h-1 bg-[#F46C44]"></span>
                    </span>
                  </h2>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 sm:gap-10">
                  {videoRes.data.map((item, index) => (
                    <a key={index} href={item.videoUrl} target="_blank" rel="noopener noreferrer" className="relative block">
                      <div className="overflow-hidden rounded-2xl sm:rounded-3xl">
                        <img src={item.image} alt={item.name} className="w-full h-[400px] sm:h-[480px] lg:h-[520px] object-cover object-top rounded-2xl sm:rounded-3xl" />
                        <div className="absolute inset-0 flex items-center justify-center">
                          <div className="bg-white/80 rounded-full p-4 text-xl">▶</div>
                        </div>
                      </div>
                      <div className="absolute left-1/2 -translate-x-1/2 bottom-0 w-[90%] sm:w-[85%] lg:w-full lg:left-[213.5px] lg:translate-x-[-50%] bg-white rounded-xl sm:rounded-2xl border border-gray-500 shadow-md px-3 sm:px-4 py-3 sm:py-5 text-left">
                        <h3 className="font-bold text-primary mb-1 sm:mb-2 text-sm sm:text-base">{item.name}</h3>
                        <p className="text-xs sm:text-sm text-gray-600 leading-relaxed">"{item.message}"</p>
                      </div>
                    </a>
                  ))}
                </div>
              </div>
            </section>
          )
        }

        if (originalName === 'imageTestimonials' || name === 'imageTestimonials') {
          return imageData?.length > 0 && (
            <ImageTestimonial
              key={`${name}-${order}`}
              title={data?.title}
              subtitle={data?.subtitle}
              items={imageData}
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