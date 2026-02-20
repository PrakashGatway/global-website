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








export default function Homepage({ homePage, destinationData, imageData , Faqres,videoRes }) {

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
          slides: { perView: 4, spacing: 24 },
        },
      },
    }, destination

  )



  const startYear = 2011; // 👈 apna starting year yaha daalo
const currentYear = new Date().getFullYear();
const experienceYears = currentYear - startYear;






console.log(videoRes)




  return (
    <main className="bg-[#fffaf7]">
      <section
        className="
    relative overflow-hidden
    bg-white
    bg-no-repeat bg-cover bg-bottom
    pt-12 lg:pt-16 
    
  "
        style={{
          backgroundImage: `url("/images/hero.jpg")`

        }}

      >
        <div>


        </div>
        {/* mobile overlay only */}
        <div className="absolute inset-0 bg-white/50 md:bg-transparent pointer-events-none" />

        <div className="relative z-10 max-w-7xl mx-auto px-4 pt-10 sm:px-6">
          {/* HERO GRID */}
          <div className="grid grid-cols-1 lg:grid-cols-2 items-center gap-8 lg:gap-2">

            {/* LEFT CONTENT */}
            <div className="text-justify lg:text-left">
              <h1 className="text-xl sm:text-4xl lg:text-5xl  leading-tight">
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
              </h1>

              <p className="mt-6 text-sm sm:text-base font-medium lg:text-lg text-primary max-w-2xl mx-auto lg:mx-0 lg:mb-20">
                {homePage?.hero?.subtitle ? (
                  <>
                    {homePage.hero.subtitle.split('||')[0]?.trim()}{" "}
                    <span className="font-semibold text-[#f46c44]">
                      {homePage.hero.subtitle.split('||')[1]?.trim()}
                    </span>
                  </>
                ) : null}
              </p>

              {/* CTA BUTTONS */}
              <div className="mt-8 flex flex-col sm:flex-row gap-4 justify-center lg:justify-start">
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

              </div>

              <AnimatePresence>
              {openForm && <MultiStepForm onClose={() => setOpenForm(false)} />}


              </AnimatePresence>


            </div>

            {/* RIGHT IMAGE */}
            <div className="flex justify-center lg:justify-end relative">
              
                 {homePage?.hero?.heroImage && (
                <Image
                  src={homePage.hero.heroImage.trim()}
                  width={450}
                  height={900}
                  alt="cap"
                  className="lg:w-[420px] w-[200px]"
                />
              )}

              <div className="absolute origin-center
 w-[500px] h-full -right-4 -top-23 animate-spin [animation-duration:60s] -z-10 hidden lg:block">
  <img
    src="/images/hero-bg-2.png"
    alt=""
    className="w-full h-full object-contain"
  />
</div>

          
             

            </div>
          </div>

         

        </div>
      </section>


      <section className="bg-[#f46c44] pb-20 relative overflow-hidden">

  <div className="max-w-7xl mx-auto px-6">

    {/* ================= HEADING ================= */}
    <div className=" mb-8 lg:mb-16">
     

      <h3 className="text-white text-xl lg:text-7xl  relative inline-block mt-4">
        <span className="">{homePage?.whyUs?.title.split("||")[0]}</span>
        <span className="font-bold">{homePage?.whyUs?.title.split("||")[1]}</span>

        {/* Yellow Brush Underline */}
        <span className="absolute left-0 -bottom-2 lg:-bottom-6 w-full h-[2px] lg:h-2 bg-yellow-400 rounded-full"></span>
      </h3>
    </div>

    {/* ================= CARDS ================= */}
    <div className=" space-y-4 lg:space-y-10">

      {/* TOP 3 CARDS */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 lg:gap-10">

        {/* ITEM 1 */}
        <div className="bg-white rounded-3xl px-4 py-6 lg:p-10 flex items-center gap-6">
          <NutOffIcon className=" w-12 h-8 lg:w-16 lg:h-16 text-[#6d1901]" />
          <div>
            <h4 className=" text-sm lg:text-2xl font-semibold text-black">
              {homePage?.whyUs?.items?.[0]?.title}
            </h4>
            <p className="text-[#1f3a5f] mt-2 text-sm lg:text-base">
              {homePage?.whyUs?.items?.[0]?.description}
            </p>
          </div>
        </div>

        {/* ITEM 2 */}
        <div className="bg-white rounded-3xl px-4 py-6 lg:p-10 flex items-center gap-6">
          <BadgeIcon className="w-12 h-8 lg:w-16 lg:h-16 text-[#6d1901]" />
          <div>
            <h4 className="text-sm lg:text-2xl font-semibold text-black">
              {homePage?.whyUs?.items?.[1]?.title}
            </h4>
            <p className="text-[#1f3a5f] mt-2 text-sm lg:text-base">
              {homePage?.whyUs?.items?.[1]?.description}
            </p>
          </div>
        </div>

        {/* ITEM 3 */}
        <div className="bg-white rounded-3xl px-4 py-6 lg:p-10 flex items-center gap-6">
          <TargetIcon className="w-12 h-8 lg:w-16 lg:h-16 text-[#6d1901]" />
          <div>
            <h4 className="text-sm lg:text-2xl font-semibold text-black">
              {homePage?.whyUs?.items?.[2]?.title}
            </h4>
            <p className="text-[#1f3a5f] mt-2 text-sm lg:text-base">
              {homePage?.whyUs?.items?.[2]?.description}
            </p>
          </div>
        </div>

      </div>

      {/* BOTTOM 2 CENTERED CARDS */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 lg:gap-10 md:w-2/3 mx-auto">

        {/* ITEM 4 */}
        <div className="bg-white rounded-3xl px-4 py-6 lg:p-10 flex items-center gap-6">
          <PanelsTopLeftIcon className="w-12 h-8 lg:w-16 lg:h-16 text-[#6d1901]" />
          <div>
            <h4 className="text-sm lg:text-2xl font-semibold text-black">
              {homePage?.whyUs?.items?.[3]?.title}
            </h4>
            <p className="text-[#1f3a5f] mt-2 text-sm lg:text-base">
              {homePage?.whyUs?.items?.[3]?.description}
            </p>
          </div>
        </div>

        {/* ITEM 5 (If exists) */}
        {homePage?.whyUs?.items?.[4] && (
          <div className="bg-white rounded-3xl px-4 py-6 lg:p-10 flex items-center gap-6">
            <PanelsTopLeftIcon className="w-12 h-8 lg:w-16 lg:h-16 text-[#6d1901]" />
            <div>
              <h4 className="text-sm lg:text-2xl font-semibold text-black">
                {homePage?.whyUs?.items?.[4]?.title}
              </h4>
              <p className="text-[#1f3a5f] mt-2 text-sm lg:text-base">
                {homePage?.whyUs?.items?.[4]?.description}
              </p>
            </div>
          </div>
        )}

      </div>

    </div>

  </div>

</section>

 


      <section
        className=" bg-[#f2eeed]
    relative overflow-hidden w-full
    py-12 sm:py-16 lg:py-18
  "
      >
        <div className="absolute -right-20 top-[0%] opacity-30 pointer-events-none hidden lg:block">
         
        </div>
        <div className="max-w-7xl mx-auto">
          <div className="w-full px-4 sm:px-6 lg:px-8 relative z-10">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 lg:gap-2 items-center w-full min-h-[500px]">

              {/* LEFT – IMAGE STACK */}
              <div className="relative w-full h-full min-h-[420px] sm:min-h-[500px] lg:min-h-[550px] flex justify-center lg:justify-start hidden lg:block">
               
               <img src="/images/trust-img.png" alt="" className="w-[450px] h-[540px]" />

                 {/* EXPERIENCE BADGE */}
                  <div
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
</div>
              </div>

              {/* RIGHT CONTENT */}
              <div className="text-center lg:text-left">
                <h2 className="text-lg sm:text-3xl lg:text-5xl font-bold leading-tight mb-3">
                  <span className="text-primary">
                    {homePage?.trustedPartners?.title?.split('||')[0]?.trim()}
                  </span>
                  <br />
                  <span className="text-primary">
                    {homePage?.trustedPartners?.title?.split('||')[1]?.trim()}
                  </span>
                </h2>

                <p className="text-sm font-medium sm:text-base text-gray-600 mb-6 leading-relaxed max-w-xl mx-auto lg:mx-0">
                  {homePage?.trustedPartners?.subtitle}
                </p>

                <AboutTabsSection tabs={homePage?.trustedPartners?.items || []} />

               
              </div>

            </div>
          </div>
        </div>
      </section>

       
     <VideoTestimonialsSlider
  title={homePage?.videoTestimonials?.title || "Video || Testimonials"}
  subtitle = {homePage?.videoTestimonials?.subtitle}
  items={videoRes}
  // Auto-play is enabled by default
/>

       
      <ImageTestimonial
      title={homePage?.imageTestimonials?.title}
        
        subtitle={homePage?.imageTestimonials?.subtitle}
        items={imageData}
      />
      <section className="py-18 overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 overflow-hidden">
          <div className=" mb-12 ">
            <h2 className=" text-xl lg:text-5xl  mb-2 ">
              <span  className="text-red-700" >
                {homePage?.topUniversities?.title?.split('||')[0]?.trim()}
              </span>{" "} <br />
              <span className="text-primary font-bold relative">
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
              <div
                key={item._id}
                className="keen-slider__slide "
              >
                {/* 👇 YOUR EXISTING UI (UNCHANGED) */}
                <Link href={`/universities/group/${item.slug}`}>
                  <div className="text-center group">
                    <div className="relative mx-auto w-full max-w-[280px] mb-6">
                      <img
                          src={item.cardImage || "https://images.unsplash.com/photo-1501594907352-04cda38ebc29?w=400&h=300&fit=crop"}
                          x="0"
                          y="0"
                          width="300"
                          height="200"
                          clipPath={`url(#tiltedClip-${item._id})`}
                          preserveAspectRatio="xMidYMid slice"
                        />
                    </div>

                    <h3 className=" text-xl font-bold text-primary mb-2">
                      {item.title}
                    </h3>

                    <p className="text-sm  text-primary">
                      {item.subTitle}
                    </p>
                  </div>
                </Link>

              </div>
            ))}
          </div>

        </div>
      </section>

      <UniversitySliderClient universities = {homePage.universities} />


    

      <FAQSection Faqres = {Faqres} />
    </main>
  )
}