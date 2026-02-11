"use client"

import Link from "next/link"
import { motion } from "framer-motion"
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








export default function Homepage({ homePage, Blogdata, destinationData, imageData , Faqres }) {

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




console.log(homePage?.blogs?.title)
console.log(homePage?.topUniversities?.title)





  return (
    <main className="bg-[#fffaf7]">
      <section
        className="
    relative overflow-hidden
    bg-white
    bg-no-repeat bg-cover bg-bottom
    py-12 sm:py-16 
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

              <p className="mt-6 text-sm sm:text-base font-medium lg:text-lg text-primary max-w-xl mx-auto lg:mx-0">
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
    text-white px-6 sm:px-8 py-2.5 sm:py-3 bg-orange-500 rounded-full shadow-[-4px_0px_4px_0px_rgba(0,0,0,0.55)]
    text-base font-semibold
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
    text-primary px-6 sm:px-8 py-2.5 sm:py-3 border-2 border-primary rounded-full 
    text-base font-semibold
    transition-all hover:bg-orange-500 hover:text-white hover:shadow-[-6px_6px_5px_0_rgba(0,0,0,0.60)]
    inline-flex items-center justify-center
  "

                  rel="noopener noreferrer"
                >
                  {homePage?.hero?.ctaText2 || "Check Your Eligibility"}
                </a>

              </div>

              {openForm && <MultiStepForm onClose={() => setOpenForm(false)} />}

            </div>

            {/* RIGHT IMAGE */}
            <div className="flex justify-center lg:justify-end">
              {homePage?.hero?.heroImage && (
                <Image
                  src={homePage.hero.heroImage.trim()}
                  width={1200}
                  height={800}
                  alt="cap"
                />
              )}

            </div>
          </div>

          {/* STATS SECTION */}
          <div className="pb-12 lg:pb-16 lg:pt-20">
  <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-4 gap-4 lg:gap-10">

    {(homePage?.stats?.stats || []).map((item: any, index: number) => (
      <div
        key={index}
        className="
          /* MOBILE CARD */
          flex flex-col items-center text-center
          bg-white p-4 rounded-2xl shadow-md

          /* DESKTOP RESET (UNCHANGED VIEW) */
          sm:bg-transparent sm:p-0 sm:rounded-none sm:shadow-none
          sm:flex-row sm:items-start sm:text-left
          gap-3 sm:gap-4
        "
      >
        {/* Icon */}
        <Image
          src={
            item.icon?.trim() ||
            'https://toppng.com/uploads/preview/graduation-cap-svg-icon-free-graduation-cap-icon-11553393846gq7rcr1qsx.png'
          }
          alt="Stat Icon"
          width={55}
          height={55}
          className="object-contain"
        />

        {/* Text */}
        <div>
          <div className="text-xl sm:text-4xl font-bold text-gray-800">
            {item.number}
          </div>
          <div className="text-sm sm:text-base text-gray-700 leading-snug">
            {item.title}
          </div>
        </div>
      </div>
    ))}

  </div>
</div>

        </div>
      </section>


      <section className="bg-[#f46c44] py-20 relative overflow-hidden">

  <div className="max-w-7xl mx-auto px-6">

    {/* ================= HEADING ================= */}
    <div className="mb-16">
     

      <h3 className="text-white text-5xl lg:text-7xl  relative inline-block mt-4">
        <span className="">{homePage?.whyUs?.title.split("||")[0]}</span>
        <span className="font-bold">{homePage?.whyUs?.title.split("||")[1]}</span>

        {/* Yellow Brush Underline */}
        <span className="absolute left-0 -bottom-6 w-full h-2 bg-yellow-400 rounded-full"></span>
      </h3>
    </div>

    {/* ================= CARDS ================= */}
    <div className="space-y-10">

      {/* TOP 3 CARDS */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-10">

        {/* ITEM 1 */}
        <div className="bg-[#e6e6e6] rounded-3xl p-10 flex items-center gap-6">
          <NutOffIcon className="w-16 h-16 text-[#6d1901]" />
          <div>
            <h4 className="text-2xl font-semibold text-black">
              {homePage?.whyUs?.items?.[0]?.title}
            </h4>
            <p className="text-[#1f3a5f] mt-2 text-base">
              {homePage?.whyUs?.items?.[0]?.description}
            </p>
          </div>
        </div>

        {/* ITEM 2 */}
        <div className="bg-[#e6e6e6] rounded-3xl p-10 flex items-center gap-6">
          <BadgeIcon className="w-16 h-16 text-[#6d1901]" />
          <div>
            <h4 className="text-2xl font-semibold text-black">
              {homePage?.whyUs?.items?.[1]?.title}
            </h4>
            <p className="text-[#1f3a5f] mt-2 text-base">
              {homePage?.whyUs?.items?.[1]?.description}
            </p>
          </div>
        </div>

        {/* ITEM 3 */}
        <div className="bg-[#e6e6e6] rounded-3xl p-10 flex items-center gap-6">
          <TargetIcon className="w-16 h-16 text-[#6d1901]" />
          <div>
            <h4 className="text-2xl font-semibold text-black">
              {homePage?.whyUs?.items?.[2]?.title}
            </h4>
            <p className="text-[#1f3a5f] mt-2 text-base">
              {homePage?.whyUs?.items?.[2]?.description}
            </p>
          </div>
        </div>

      </div>

      {/* BOTTOM 2 CENTERED CARDS */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-10 md:w-2/3 mx-auto">

        {/* ITEM 4 */}
        <div className="bg-[#e6e6e6] rounded-3xl p-10 flex items-center gap-6">
          <PanelsTopLeftIcon className="w-16 h-16 text-[#6d1901]" />
          <div>
            <h4 className="text-2xl font-semibold text-black">
              {homePage?.whyUs?.items?.[3]?.title}
            </h4>
            <p className="text-[#1f3a5f] mt-2 text-base">
              {homePage?.whyUs?.items?.[3]?.description}
            </p>
          </div>
        </div>

        {/* ITEM 5 (If exists) */}
        {homePage?.whyUs?.items?.[4] && (
          <div className="bg-[#e6e6e6] rounded-3xl p-10 flex items-center gap-6">
            <PanelsTopLeftIcon className="w-16 h-16 text-[#6d1901]" />
            <div>
              <h4 className="text-2xl font-semibold text-black">
                {homePage?.whyUs?.items?.[4]?.title}
              </h4>
              <p className="text-[#1f3a5f] mt-2 text-base">
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
          <div style={{
            transform: 'rotate(-120deg) scaleY(-1)',
            filter: 'brightness(0) saturate(100%) invert(60%) sepia(0%) saturate(0%) hue-rotate(0deg) brightness(95%) contrast(90%)',
            mixBlendMode: 'multiply'
          }}>
            <Image
              src="/images/g logo.png"
              alt="Decorative Arrow"
              width={600}
              height={40}
              className="w-64 h-66 lg:w-116 lg:h-116 object-contain"
            />
          </div>
        </div>
        <div className="max-w-7xl mx-auto">
          <div className="w-full px-4 sm:px-6 lg:px-8 relative z-10">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 lg:gap-2 items-center w-full min-h-[500px]">

              {/* LEFT – IMAGE STACK */}
              <div className="relative w-full h-full min-h-[420px] sm:min-h-[500px] lg:min-h-[550px] flex justify-center lg:justify-start">
                <div
                  className="relative hover:z-999"
                  style={{ perspective: "500px" }}
                >
                  <div
                    className="absolute
                top-0 left-0  
                w-[200px] h-[260px]
                sm:w-[280px] sm:h-[380px]
                lg:w-75 lg:h-95
                rounded-4xl overflow-hidden
                border-[2px] border-orange-500
                bg-white
                cursor-pointer
                transition-all duration-500 ease-out
                hover:scale-[1.01] hover:shadow-2xl
              "
                    style={{
                      transform: "rotateX(5deg) rotateZ(4deg) rotatey(7deg) skewX(4deg)",
                    }}
                  >
                    {homePage?.trustedPartners?.bgImage2 && (
                      <Image
                        src={homePage.trustedPartners.bgImage2.trim()}
                        alt="Immigration services"
                        width={600}
                        height={800}
                        className="w-full h-full object-cover scale-110"
                        style={{
                          transform:
                            "rotateY(-12deg) rotateX(5deg) rotateZ(-5deg) skewX(-5deg)",
                        }}
                      />
                    )}

                  </div>
                </div>

                {/* FRONT IMAGE */}
                <div
                  className="
              absolute bottom-0
              left-1/2 lg:left-30 hover:z-999
              -translate-x-1/2 lg:translate-x-0
            "
                  style={{ perspective: "500px" }}
                >
                  <div
                    className="
                w-[220px] h-[280px]
                sm:w-[300px] sm:h-[380px]
                lg:w-68 lg:h-95
                rounded-4xl overflow-hidden
                border-[2px] border-orange-500
                bg-white z-20
                cursor-pointer
                transition-all duration-500 ease-out
                hover:scale-[1.01] hover:shadow-2xl
              "
                    style={{
                      transform: "rotateY(-10deg) rotateX(5deg) rotateZ(-5deg) skewX(-5deg)",
                    }}
                  >
                    <img
                      src={homePage?.trustedPartners?.bgImage1?.trim()}
                      alt=""
                      className="w-full h-full object-cover scale-115"
                      style={{
                        transform: "rotateY(5deg) rotateX(15deg) rotateZ(8deg) skewX(8deg)",
                      }}
                    />
                  </div>

                  {/* EXPERIENCE BADGE */}
                  <div
                    className="
                absolute -left-8 sm:-left-12 bottom-30
                w-24 h-24 sm:w-28 sm:h-28 lg:w-28 lg:h-28
                rounded-full bg-white
                border-[3px] border-orange-600
                shadow-2xl z-40
                flex flex-col items-center justify-center
              "
                  >
                    <span className="text-3xl sm:text-4xl font-bold text-red-700">15</span>
                    <span className="text-[10px] sm:text-xs text-gray-500 text-center font-semibold leading-tight">
                      Years of<br />Experience
                    </span>
                  </div>
                </div>
              </div>

              {/* RIGHT CONTENT */}
              <div className="text-center lg:text-left">
                <h2 className="text-2xl sm:text-3xl lg:text-5xl font-bold leading-tight mb-3">
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
  items={imageData?.map((item: any) => ({
    title: item.title || "Trusted Success",
    text: item.description || homePage?.videoTestimonials?.subtitle || "",
    videoUrl: item.videoUrl || "",
  }))}
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
            <h2 className="text-5xl  mb-2 ">
              <span  className="text-red-700" >
                {homePage?.topUniversities?.title?.split('||')[0]?.trim()}
              </span>{" "} <br />
              <span className="text-primary font-bold relative">
                {homePage?.topUniversities?.title?.split('||')[1]?.trim()}
        <span className="absolute right-0 bottom-0  w-25 h-1 bg-red-700"></span>

                
              </span>


            </h2>
            <p className="text-gray-800 text-base font-medium max-w-3xl  leading-relaxed">
              {homePage?.topUniversities?.subtitle}
            </p>
          </div>

          <div
            ref={sliderRefD}
            className="keen-slider lg:grid lg:grid-cols-4 lg:gap-1 items-start"
          >
            {destinationData.map((item) => (
              <div
                key={item._id}
                className="keen-slider__slide "
              >
                {/* 👇 YOUR EXISTING UI (UNCHANGED) */}
                <Link href={`/destination/${item.slug}`}>
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

                    <h3 className="text-xl font-bold text-primary mb-2">
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


      <section className="
  py-12 sm:py-14 lg:py-6
  bg-gradient-to-b from-[#f3f3f3] to-white
  bg-[url('/bg-01.jpg')]
  bg-cover bg-center bg-no-repeat
  relative
">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-4">

          {/* Heading */}
          <div className=" mb-10  relative">
            <h2 className="text-2xl sm:text-3xl lg:text-5xl mb-5 font-bold">
              <span className="text-red-700">
                {homePage?.blogs?.title?.split('||')[0]}
              </span>{" "} <br />
              <span className="text-primary relative">
                {homePage?.blogs?.title?.split('||')[1]}
        <span className="absolute right-0 -bottom-1 w-25 h-1 bg-red-600"></span>

              </span>

            </h2>
            <p className="mt-2 text-sm sm:text-base text-gray-600 font-medium max-w-3xl ">
              {homePage?.blogs?.subtitle}
            </p>

          </div>

          {/* Grid */}
          <div ref={sliderRef} className="keen-slider">

            {Blogdata.map((post) => (
              <div key={post._id} className="keen-slider__slide px-5">
                <Link href={`/blog/${post.slug}`} >
                  <div
                    key={post._id}
                    className="
                  relative bg-white border border-[#FF6B35]
                  rounded-tl-[60px] sm:rounded-tl-[80px] lg:rounded-tl-[100px]
                  transition-all duration-300 hover:shadow-xl mt-10
                "
                  >
                    {/* ORANGE BACK SHAPE */}
                    <div
                      className="
                    absolute -top-2 -left-[6.5px]
                    w-28 h-28 sm:w-36 sm:h-36 lg:w-35 lg:h-35
                    rounded-tl-[60px] sm:rounded-tl-[80px] lg:rounded-[20px] lg:rounded-tl-[70px]
                    bg-[#FF6B35] -z-10
                  "
                    />

                    {/* IMAGE */}
                    <div
                      className="
                    relative overflow-hidden bg-gray-300
                    h-[200px] sm:h-[220px] lg:h-[220px]
                    rounded-tl-[60px] sm:rounded-tl-[80px] lg:rounded-tl-[65px]
                  "
                    >
                      <img
                        src={
                          post.coverImage ||
                          "https://www.shutterstock.com/image-photo/attractive-young-asian-female-college-600nw-2557619503.jpg"
                        }
                        alt={post.title}
                        className="w-full h-[220px] object-cover"
                        onError={(e) => {
                          e.currentTarget.src =
                            "https://www.shutterstock.com/image-photo/attractive-young-asian-female-college-600nw-2557619503.jpg"
                        }}
                      />

                      {/* OVERLAY */}
                      <div
                        className="
                      absolute inset-0 bg-black/50
                      flex flex-col items-center justify-center text-center px-4
                      rounded-tl-[60px] sm:rounded-tl-[80px] lg:rounded-tl-[65px]
                    "
                      >
                        <h3 className="text-white text-lg sm:text-xl lg:text-3xl font-semibold mb-2">
                          {post.title}
                        </h3>

                        <p className="text-white text-sm sm:text-base">
                          {post.category?.name}{" "}
                          {new Date(post.createdAt).toLocaleDateString("en-IN", {
                            day: "2-digit",
                            month: "short",
                            year: "numeric",
                          })}
                        </p>
                      </div>
                    </div>

                    {/* CONTENT */}
                    <div className="p-3 text-center">
                      <p className="text-gray-800 text-base font-medium mb-3 line-clamp-2">
                        {post.shortDescription}
                      </p>

                      <div

                        className="
    text-white px-6 lg:w-50 py-2 mx-auto
    bg-[#1f2937]
    rounded-tr-4xl
    shadow-[-4px_0px_4px_0px_rgba(0,0,0,0.55)]
    text-sm font-semibold
    hover:bg-[#FF6B35]
    hover:shadow-[-6px_6px_5px_0px_rgba(0,0,0,0.60)]
    flex items-center justify-center gap-2
    transition-all
  "
                      >
                        Read More »
                      </div>
                    </div>
                  </div>
                </Link>

              </div>
            )
            )}
          </div>


        </div>
      </section>

      <FAQSection Faqres = {Faqres} />
    </main>
  )
}