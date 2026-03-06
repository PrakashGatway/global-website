"use client"

import Link from "next/link"
import { AnimatePresence, motion } from "framer-motion"
import { ArrowRight, BadgeIcon, Globe, NutOffIcon, PanelsTopLeftIcon, TargetIcon, Users, VideoIcon, Zap } from "lucide-react"
import { Button } from "@/components/ui/button"
import Image from "next/image"
import UniversitySliderClient from "@/components/PageComponent/Unversity"
import AboutTabsSection from "@/components/PageComponent/TrustTabs"
import VideoTestimonialsSlider from "@/components/PageComponent/VideoTestimonial"
import ImageTestimonial from "@/components/ImageTestimonial"
import VideoInSvgShape from "@/components/PageComponent/VideoShape"

import { baseUrl, serverInstance } from "@/app/axiosInstance"
import Blogs from "./blog"
import BlogGrid from "./blogGrid"
import { useKeenSlider } from "keen-slider/react"
import MultiStepForm from "./PopupForm"
import { useState } from "react"
import FAQSection from "./faqPage"
import { useGlobal } from "@/src/statecontext"
import { usePathname } from "next/navigation"
import VideoSlider from "./homevideoslider"








export default function Homepage({ homePage, destinationData, imageData, Faqres, videoRes }) {

  const [openForm, setOpenForm] = useState(false);



 







  let destination = [
    (slider) => {
      let timeout
      let mouseOver = false

      function clearNextTimeout() {
        clearTimeout(timeout)
      }

      function nextTimeout() {
        clearTimeout(timeout)
        if (mouseOver) return
        timeout = setTimeout(() => {
          slider.next()
        }, 3000) // ⏱️ auto slide every 3s
      }

      slider.on("created", () => {
        slider.container.addEventListener("mouseover", () => {
          mouseOver = true
          clearNextTimeout()
        })
        slider.container.addEventListener("mouseout", () => {
          mouseOver = false
          nextTimeout()
        })
        nextTimeout()
      })

      slider.on("dragStarted", clearNextTimeout)
      slider.on("animationEnded", nextTimeout)
      slider.on("updated", nextTimeout)
    },
  ]


  const [sliderRef] = useKeenSlider(
    {
      loop: true,
      mode: "snap",
      slides: {
        perView: 1,
        spacing: 16,
      },
      breakpoints: {
        "(min-width: 640px)": {
          slides: { perView: 2, spacing: 20 },
        },
        "(min-width: 1024px)": {
          slides: { perView: 3.2, spacing: 24 },
        },
      },
    }, destination

  )
  const [sliderRefD] = useKeenSlider(
    {
      loop: true,
      mode: "snap",
      slides: {
        perView: 1,
        spacing: 16,
      },
      breakpoints: {
        "(min-width: 640px)": {
          slides: { perView: 2, spacing: 20 },
        },
        "(min-width: 1024px)": {
          slides: { perView: 3, spacing: 0 },
        },
      },
    }, destination

  )



  const startYear = 2011; // 👈 apna starting year yaha daalo
  const currentYear = new Date().getFullYear();
  const experienceYears = currentYear - startYear;






  console.log(videoRes)




  return (
    <main className="bg-white">
     <motion.section
  initial={{ opacity: 0 }}
  animate={{ opacity: 1 }}
  transition={{ duration: 0.6 }}
  className="
    relative overflow-hidden
    bg-white
    bg-no-repeat bg-cover bg-bottom
    pt-12 lg:pt-26 min-h-[90vh] 
  "
  style={{
    backgroundImage: `url("/images/hero.jpg")`
  }}
>
  <div></div>

  {/* mobile overlay only */}
  <div className="absolute inset-0 bg-white/50 md:bg-transparent pointer-events-none" />

  <div className="relative z-10 max-w-7xl mx-auto px-4  sm:px-6">
    <div className="grid grid-cols-1 lg:grid-cols-2 items-center gap-8 lg:gap-2">

      {/* LEFT CONTENT */}
      <motion.div
        initial={{ x: -60, opacity: 0 }}
        animate={{ x: 0, opacity: 1 }}
        transition={{ duration: 0.7, delay: 0.2 }}
        className="text-justify lg:text-left"
      >
        <motion.h1
          initial={{ y: 30, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.6, delay: 0.4 }}
          className="text-xl sm:text-4xl lg:text-4xl leading-tight"
        >
          {homePage?.hero?.title ? (
            <span className="block text-primary">
              {homePage.hero.title.split('||')[0]?.trim()}
              <br />
              <span className="relative inline-block mt-3 font-bold text-[#ea6c46]">
                {homePage.hero.title.split('||')[1]?.trim()}
                <span className="absolute left-0 -bottom-2 w-full h-[2px] bg-[#f46c44]">
                  <span className="absolute right-0 -top-[3px] w-2 h-2 rounded-full bg-[#f46c44]" />
                </span>
              </span>
            </span>
          ) : null}
        </motion.h1>

        <motion.p
          initial={{ y: 30, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.6, delay: 0.6 }}
          className="mt-6 text-sm sm:text-base font-medium lg:text-lg text-primary max-w-2xl mx-auto lg:mx-0 lg:mb-20"
        >
          {homePage?.hero?.subtitle ? (
            <>
              {homePage.hero.subtitle.split('||')[0]?.trim()}{" "}
              <span className="font-semibold text-[#f46c44]">
                {homePage.hero.subtitle.split('||')[1]?.trim()}
              </span>
            </>
          ) : null}
        </motion.p>

        {/* CTA BUTTONS */}
        <motion.div
          initial={{ y: 30, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.6, delay: 0.8 }}
          className="mt-8 flex flex-col sm:flex-row gap-4 justify-center lg:justify-start"
        >
          <a
            onClick={() => setOpenForm(true)}
            className="
              text-white px-6 sm:px-8 py-2.5 sm:py-3 bg-[#f46c44] rounded-full shadow-[-4px_0px_4px_0px_rgba(0,0,0,0.55)]
              text-sm lg:text-base font-semibold
              hover:bg-primary hover:shadow-[-6px_6px_5px_0_rgba(0,0,0,0.60)]
              flex items-center justify-center gap-2
              transition-all hover:opacity-90 cursor-pointer
            "
            rel="noopener noreferrer"
          >
            {homePage?.hero?.ctaText1 || "Get Free Counselling"}
          </a>

          <a
            href={homePage?.hero?.ctaLink2}
            className="
              text-primary px-6 sm:px-8 py-2.5 sm:py-3 border border-primary rounded-full 
              lg:text-base text-sm font-semibold
              transition-all hover:bg-[#f46c44] hover:border-none hover:text-white hover:shadow-[-6px_6px_5px_0_rgba(0,0,0,0.60)]
              inline-flex items-center justify-center
            "
            rel="noopener noreferrer"
          >
            {homePage?.hero?.ctaText2 || "Check Your Eligibility"}
          </a>
        </motion.div>
      </motion.div>

      {/* RIGHT IMAGE */}
     <motion.div
  initial={{ x: 60, opacity: 0 }}
  animate={{ x: 0, opacity: 1 }}
  transition={{ duration: 0.8, delay: 0.3 }}
  className="flex justify-center lg:justify-end"
>
  <div className="relative flex items-center justify-center">

    {/* Animated Circle */}
    <div className="absolute -right-[20px] top-51 -translate-y-1/2 z-10 animate-spin [animation-duration:60s] hidden lg:block">
  <img
    src="/images/hero-bg-2.png"
    alt="circle"
    className="w-[500px] max-w-none"
  />
</div>

    {/* Hero Image */}
    {homePage?.hero?.heroImage && (
      <motion.div
        initial={{ scale: 0.9 }}
        animate={{ scale: 1 }}
        transition={{ duration: 0.6, delay: 0.5 }}
        className="relative z-1 -left-18 -bottom-10"
      >
        <Image
          src={homePage.hero.heroImage.trim()}
          width={450}
          height={900}
          alt="cap"
          className="lg:w-[300px] w-[200px]"
        />
      </motion.div>
    )}

  </div>
</motion.div>

    </div>
  </div>
</motion.section>

         <section className="bg-white pt-10  overflow-hidden relative">
          <div className="absolute w-200 h-full left-0 z-1"><img src="/images/enquiry-bg.png" alt="" /></div>

      <div className="px-20 flex gap-22 py-10 justify-around items-center">

      
        <motion.div className="relative z-10 -bottom-21 ">
          <img src="/images/home-enquiry.png" alt="" className="w-145" />
        </motion.div>
        {/* RIGHT FORM */}

        <motion.div
  initial={{ opacity: 0, x: 60 }}
  whileInView={{ opacity: 1, x: 0 }}
  transition={{ duration: 0.6 }}
  viewport={{ once: true }}
  className="bg-white shadow-xl border border-gray-100 p-8 lg:p-10 rounded-2xl ml-20"
>
  <h2 className="text-3xl font-semibold mb-8 text-gray-900">
    Let <span className="text-[#00306A]">Our Team</span> Reach Out To You
  </h2>

  <form className="grid grid-cols-1 md:grid-cols-2 gap-5">

    {/* First Name */}
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      viewport={{ once: true }}
    >
      <label className="text-sm font-medium text-gray-600 mb-1 block">
        First Name
      </label>
      <input
        type="text"
        placeholder="Enter your first name"
        className="w-full border border-gray-300 rounded-lg px-4 py-2.5 text-sm bg-gray-50 focus:bg-white focus:outline-none focus:border-[#F46C44] focus:ring-2 focus:ring-[#F46C44]/20 transition-all"
      />
    </motion.div>

    {/* Last Name */}
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay: 0.05 }}
      viewport={{ once: true }}
    >
      <label className="text-sm font-medium text-gray-600 mb-1 block">
        Last Name
      </label>
      <input
        type="text"
        placeholder="Enter your last name"
        className="w-full border border-gray-300 rounded-lg px-4 py-2.5 text-sm bg-gray-50 focus:bg-white focus:outline-none focus:border-[#F46C44] focus:ring-2 focus:ring-[#F46C44]/20 transition-all"
      />
    </motion.div>

    {/* Email */}
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay: 0.1 }}
      viewport={{ once: true }}
    >
      <label className="text-sm font-medium text-gray-600 mb-1 block">
        Email ID
      </label>
      <input
        type="email"
        placeholder="example@email.com"
        className="w-full border border-gray-300 rounded-lg px-4 py-2.5 text-sm bg-gray-50 focus:bg-white focus:outline-none focus:border-[#F46C44] focus:ring-2 focus:ring-[#F46C44]/20 transition-all"
      />
    </motion.div>

    {/* Phone */}
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay: 0.15 }}
      viewport={{ once: true }}
    >
      <label className="text-sm font-medium text-gray-600 mb-1 block">
        Mobile Number
      </label>
      <input
        type="tel"
        placeholder="+91 9876543210"
        className="w-full border border-gray-300 rounded-lg px-4 py-2.5 text-sm bg-gray-50 focus:bg-white focus:outline-none focus:border-[#F46C44] focus:ring-2 focus:ring-[#F46C44]/20 transition-all"
      />
    </motion.div>

    {/* Destination */}
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay: 0.2 }}
      viewport={{ once: true }}
    >
      <label className="text-sm font-medium text-gray-600 mb-1 block">
        Preferred Destination
      </label>
      <select className="w-full border border-gray-300 rounded-lg px-4 py-2.5 text-sm bg-gray-50 focus:bg-white focus:outline-none focus:border-[#F46C44] focus:ring-2 focus:ring-[#F46C44]/20 transition-all">
        <option>Select Destination</option>
        <option>USA</option>
        <option>UK</option>
        <option>Canada</option>
      </select>
    </motion.div>

    {/* Course */}
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay: 0.25 }}
      viewport={{ once: true }}
    >
      <label className="text-sm font-medium text-gray-600 mb-1 block">
        Course
      </label>
      <input
        type="text"
        placeholder="e.g. MBA, Computer Science"
        className="w-full border border-gray-300 rounded-lg px-4 py-2.5 text-sm bg-gray-50 focus:bg-white focus:outline-none focus:border-[#F46C44] focus:ring-2 focus:ring-[#F46C44]/20 transition-all"
      />
    </motion.div>

    {/* Month */}
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay: 0.3 }}
      viewport={{ once: true }}
    >
      <label className="text-sm font-medium text-gray-600 mb-1 block">
        When do you plan to study
      </label>
      <select className="w-full border border-gray-300 rounded-lg px-4 py-2.5 text-sm bg-gray-50 focus:bg-white focus:outline-none focus:border-[#F46C44] focus:ring-2 focus:ring-[#F46C44]/20 transition-all">
        <option>Select Month</option>
        <option>January</option>
        <option>May</option>
        <option>September</option>
      </select>
    </motion.div>

    {/* Year */}
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay: 0.35 }}
      viewport={{ once: true }}
    >
      <label className="text-sm font-medium text-gray-600 mb-1 block">
        Your Preferred Year
      </label>
      <select className="w-full border border-gray-300 rounded-lg px-4 py-2.5 text-sm bg-gray-50 focus:bg-white focus:outline-none focus:border-[#F46C44] focus:ring-2 focus:ring-[#F46C44]/20 transition-all">
        <option>Select Year</option>
        <option>2025</option>
        <option>2026</option>
        <option>2027</option>
      </select>
    </motion.div>

    {/* Submit */}
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay: 0.4 }}
      viewport={{ once: true }}
      className="md:col-span-2 mt-4"
    >
      <button
        type="submit"
        className="w-full md:w-auto bg-[#F46C44] hover:bg-[#e65f38] text-white font-semibold px-10 py-3 rounded-lg transition duration-300 shadow-md hover:shadow-lg"
      >
        Submit
      </button>
    </motion.div>

  </form>
</motion.div>

        

      </div>
    </section>

   


      <motion.section
  initial={{ opacity: 0 }}
  whileInView={{ opacity: 1 }}
  transition={{ duration: 0.6 }}
  viewport={{ once: true }}
  className="bg-[#eaeaf2] py-10 relative overflow-hidden"
>
  <div className=" px-6">
      {/* ================= HEADING ================= */}
    <motion.div
      initial={{ y: 40, opacity: 0 }}
      whileInView={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.6 }}
      viewport={{ once: true }}
      className="mb-8 lg:mb-16 max-w-7xl mx-auto"
    >
      <h3 className="text-primary text-xl relative inline-block mt-4">
        <span className="font-light lg:text-4xl">
          {homePage?.whyUs?.title.split("||")[0]}
        </span>
        <br />
        <span className="font-bold lg:text-5xl">
          {homePage?.whyUs?.title.split("||")[1]}
        </span>

       
      </h3>
    </motion.div>

   

    {/* ================= CARDS ================= */}
    <div className="space-y-4 lg:space-y-10">

      {/* TOP 3 CARDS */}
      <div className="grid grid-cols-1 md:grid-cols-5 gap-4 lg:gap-1">

        {[0, 1, 2,3,4].map((index, i) => (
          <motion.div
            key={index}
            initial={{ y: 50, opacity: 0 }}
            whileInView={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.5, delay: i * 0.15 }}
            viewport={{ once: true }}
            className="bg-white rounded-3xl px-4 py-6 lg:py-4 lg:px-4 flex items-center gap-6 w-70"
          >
            {index === 0 && <NutOffIcon className="w-12 h-8 lg:w-12 lg:h-16 text-primary" />}
            {index === 1 && <BadgeIcon className="w-12 h-8 lg:w-12 lg:h-16 text-primary" />}
            {index === 2 && <TargetIcon className="w-12 h-8 lg:w-12 lg:h-16 text-primary" />}
            {index === 3 &&  <PanelsTopLeftIcon className="w-12 h-8 lg:w-12 lg:h-16 text-primary" />}
            {index === 4 && <PanelsTopLeftIcon className="w-12 h-8 lg:w-12 lg:h-16 text-primary" />}

            <div className="">
              <h4 className="text-sm lg:text-base font-semibold text-black">
                {homePage?.whyUs?.items?.[index]?.title}
              </h4>
              <p className="text-[#1f3a5f] mt-2 text-sm lg:text-sm">
                {homePage?.whyUs?.items?.[index]?.description}
              </p>
            </div>
          </motion.div>
        ))}

      </div>

   

    </div>
  </div>
</motion.section>



<section className="w-full py-20 bg-white">
  <div className="max-w-7xl mx-auto px-6 grid lg:grid-cols-3 gap-10 items-start">

    {/* LEFT CONTENT */}
    <div className="space-y-6">
      <h2 className="text-4xl font-semibold text-gray-900 leading-snug">
        Your <span className="relative font-bold">
          Trusted Partner
          <span className="absolute left-0 -bottom-2 w-full h-[4px] bg-orange-500 rounded"></span>
        </span>
        <br />
        In Global Education
      </h2>

      <p className="text-gray-500 leading-relaxed">
        Edwise, study abroad consultants, have been the architects of dreams
        and shapers of destinies for aspiring students for over three decades.
      </p>

      <button className="border border-primary text-primary px-6 py-3 rounded-lg hover:bg-orange-500 hover:text-white transition">
        Free Expert Consultation
      </button>
    </div>

    {/* CARD 1 */}
    <div className="relative border border-blue-300 rounded-[28px] p-8 h-[300px] overflow-hidden">

      <h3 className="text-2xl font-semibold text-gray-900">
        34 Years of
        <br />
        Excellence
      </h3>

      <img
        src="https://www.clipartmax.com/png/full/326-3262862_talent-management-our-erm-relationship-manager-helps-employer-and-employee-relationship-clip.png"
        className="absolute bottom-0 right-0 w-[220px]"
      />

    </div>

    {/* CARD 2 */}
    <div className="relative border border-blue-300 rounded-[28px] p-8 h-[300px] overflow-hidden">

      <h3 className="text-2xl font-semibold text-gray-900">
        950+ Partner
        <br />
        Universities
      </h3>

      <img
        src="https://png.pngtree.com/png-clipart/20210905/original/pngtree-international-student-education-study-abroad-study-abroad-png-image_6697728.jpg"
        className="absolute top-14 left-6 inset-0 w-full h-full"
      />

    </div>

  </div>
</section>




      <motion.section
  initial={{ opacity: 0 }}
  whileInView={{ opacity: 1 }}
  transition={{ duration: 0.6 }}
  viewport={{ once: true }}
  className="bg-white relative overflow-hidden w-full py-12 sm:py-16 lg:py-18"
>
  <div className="absolute -right-20 top-[0%] opacity-30 pointer-events-none hidden lg:block"></div>

  <div className="max-w-7xl mx-auto">
    <div className="w-full px-4 sm:px-6 lg:px-8 relative z-10">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 lg:gap-2 items-center w-full min-h-[500px]">

        {/* LEFT – IMAGE STACK */}
        <motion.div
          initial={{ x: -80, opacity: 0 }}
          whileInView={{ x: 0, opacity: 1 }}
          transition={{ duration: 0.7 }}
          viewport={{ once: true }}
          className="relative w-full h-full min-h-[420px] sm:min-h-[500px] lg:min-h-[550px] flex justify-center lg:justify-start hidden lg:block"
        >
          <img
            src="/images/trust-img.png"
            alt=""
            className="w-[450px] h-[540px]"
          />

          {/* EXPERIENCE BADGE */}
          <motion.div
            initial={{ scale: 0.7, opacity: 0 }}
            whileInView={{ scale: 1, opacity: 1 }}
            transition={{ duration: 0.6, delay: 0.3 }}
            viewport={{ once: true }}
            className="
              absolute -left-8 sm:left-25 bottom-25
              w-24 h-24 sm:w-28 sm:h-28 lg:w-28 lg:h-28
              rounded-full bg-white
              border-[3px] border-orange-600
              shadow-2xl z-40
              flex flex-col items-center justify-center
            "
          >
            <span className="text-3xl sm:text-4xl font-bold text-red-700">
              {experienceYears}
            </span>

            <span className="text-[10px] sm:text-xs text-gray-500 text-center font-semibold leading-tight">
              Years of<br />Experience
            </span>
          </motion.div>
        </motion.div>

        {/* RIGHT CONTENT */}
        <motion.div
          initial={{ x: 80, opacity: 0 }}
          whileInView={{ x: 0, opacity: 1 }}
          transition={{ duration: 0.7 }}
          viewport={{ once: true }}
          className="text-center lg:text-left"
        >
          <motion.h2
            initial={{ y: 30, opacity: 0 }}
            whileInView={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            viewport={{ once: true }}
            className="text-lg sm:text-3xl lg:text-5xl font-bold leading-tight mb-3"
          >
            <span className="text-primary">
              {homePage?.trustedPartners?.title?.split('||')[0]?.trim()}
            </span>
            <br />
            <span className="text-primary">
              {homePage?.trustedPartners?.title?.split('||')[1]?.trim()}
            </span>
          </motion.h2>

          <motion.p
            initial={{ y: 30, opacity: 0 }}
            whileInView={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.6, delay: 0.4 }}
            viewport={{ once: true }}
            className="text-sm font-medium sm:text-base text-gray-600 mb-6 leading-relaxed max-w-xl mx-auto lg:mx-0"
          >
            {homePage?.trustedPartners?.subtitle}
          </motion.p>

          <motion.div
            initial={{ y: 30, opacity: 0 }}
            whileInView={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.6, delay: 0.6 }}
            viewport={{ once: true }}
          >
            <AboutTabsSection tabs={homePage?.trustedPartners?.items || []} />
          </motion.div>

        </motion.div>

      </div>
    </div>
  </div>
</motion.section>




      <VideoTestimonialsSlider
        title={homePage?.videoTestimonials?.title || "Video || Testimonials"}
        subtitle={homePage?.videoTestimonials?.subtitle}
        items={videoRes}
      // Auto-play is enabled by default
      />


      <ImageTestimonial
        title={homePage?.imageTestimonials?.title}

        subtitle={homePage?.imageTestimonials?.subtitle}
        items={imageData}
      />
      <section className="lg:py-18 overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 overflow-hidden ">
          <div className=" mb-12 ">
            <h2 className=" text-xl   mb-2 ">
              <span className="text-red-700 lg:text-4xl font-light" >
                {homePage?.topUniversities?.title?.split('||')[0]?.trim()}
              </span>{" "} <br />
              <span className="text-primary font-bold relative lg:text-5xl" >
                {homePage?.topUniversities?.title?.split('||')[1]?.trim()}
                <span className="absolute right-0 bottom-0  w-25 h-[2px] lg:h-1 bg-red-700"></span>


              </span>


            </h2>
            <p className="text-gray-800 text-sm lg:text-base font-medium max-w-3xl  leading-relaxed">
              {homePage?.topUniversities?.subtitle}
            </p>
          </div>

          <div
  ref={sliderRefD}
  className="keen-slider items-start"
>
  {destinationData.map((item) => (
    <div key={item._id} className="keen-slider__slide p-4">

      <Link href={`/universities/group/${item.slug}`}>
        <div className="border border-gray-300 bg-white overflow-hidden hover:shadow-lg transition duration-300">

          {/* Image */}
          <img
            src={
              item.cardImage ||
              "https://images.unsplash.com/photo-1501594907352-04cda38ebc29?w=400&h=300&fit=crop"
            }
            className="w-full h-[160px] sm:h-[180px] md:h-[200px] object-cover"
          />

          {/* Content */}
          <div className="p-6 text-center">

            <h3 className="text-xl font-bold text-[#1c3f73] mb-2">
              {item.title}
            </h3>

            <p className="text-gray-500 text-sm">
              {item.subTitle}
            </p>

          </div>

        </div>
      </Link>

    </div>
  ))}
</div>

        </div>
      </section>

      <UniversitySliderClient universities={homePage.universities} />




      <FAQSection Faqres={Faqres} />
      <AnimatePresence>
                {openForm && <MultiStepForm onClose={() => setOpenForm(false)} />}


              </AnimatePresence>
    </main>

    
  )
}