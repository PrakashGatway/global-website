"use client"

import Image from "next/image"
import { useEffect, useState, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Facebook, Instagram, Twitter, Youtube, Send, Linkedin, Phone } from "lucide-react";
import Link from "next/link";
import { useKeenSlider } from "keen-slider/react";
import axiosInstance from "@/app/axiosInstance";
import { useForm } from "react-hook-form";
import FAQSection from "../faqPage";
import EligibilitySection from "../Eligibility";
import { DynamicLucideIcon } from "../DynamicLucideIcon";
import VideoTestimonialsSlider from "../PageComponent/VideoTestimonial";
import StudentVisaStories from "../Studentvisa";
import ScholarshipList from "./Scholarship";

// --- Helper: Autoplay Plugin for Keen Slider ---
const autoplay = (slider) => {
  let timeout;
  let mouseOver = false;

  function clearNextTimeout() {
    clearTimeout(timeout);
  }

  function nextTimeout() {
    clearTimeout(timeout);
    if (mouseOver) return;
    timeout = setTimeout(() => {
      slider.next();
    }, 3000);
  }

  slider.on("created", () => {
    slider.container.addEventListener("mouseover", () => {
      mouseOver = true;
      clearNextTimeout();
    });
    slider.container.addEventListener("mouseout", () => {
      mouseOver = false;
      nextTimeout();
    });
    nextTimeout();
  });

  slider.on("dragStarted", clearNextTimeout);
  slider.on("animationEnded", nextTimeout);
  slider.on("updated", nextTimeout);
};

// ================= SECTION COMPONENTS =================

const HeroSection = ({ data }) => {
  if (!data) return null;
  
  // Video Embed Logic if needed inside Hero or separate
  const videoId = data.videoUrl?.split("v=")[1]?.split("&")[0] || data.videoUrl?.split("/").pop();
  const embedUrl = videoId ? `https://www.youtube.com/embed/${videoId}?autoplay=1&mute=1&loop=1&playlist=${videoId}` : null;

  return (
    <section className="bg-[#fffaf6] py-12 md:py-20 overflow-hidden relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 grid grid-cols-1 lg:grid-cols-2 gap-10 lg:gap-12 items-center">
        {/* LEFT CONTENT */}
        <div className="text-center lg:text-left">
          <span className="text-xl sm:text-2xl lg:text-4xl font-semibold leading-snug block" dangerouslySetInnerHTML={{ __html: data.title }} />
          <span className="text-gray-500 mt-4 max-w-5xl mx-auto text-sm sm:text-base block" dangerouslySetInnerHTML={{ __html: data.subtitle }} />

          {/* FEATURES */}
          {data.features && (
            <div className="bg-white mt-6 sm:mt-8 rounded-tl-xl shadow-[-5px_1px_5px_rgba(0,0,0,0.25)] p-5 sm:p-6 space-y-3 sm:space-y-4 w-full sm:w-fit mx-auto lg:mx-0">
              <div className="flex items-center gap-3 text-gray-700 text-sm sm:text-base">
                <ul className="text-gray-600 text-sm lg:text-lg space-y-3">
                  {data.features.split("\n").filter(Boolean).map((d, i) => (
                    <li key={i}>{d.trim()}</li>
                  ))}
                </ul>
              </div>
            </div>
          )}

          {/* BUTTON */}
          {data.ctaText1 && (
            <Link href={data.ctaLink1 || '#'}>
              <button className="mt-6 cursor-pointer sm:mt-8 bg-[#f26b3a] hover:bg-[#e25c2c] transition text-white px-6 sm:px-8 py-3 sm:py-4 rounded-lg font-semibold flex items-center justify-center gap-2 mx-auto lg:mx-0 text-sm lg:text-base">
                {data.ctaText1}
                <span className="text-xl">›</span>
              </button>
            </Link>
          )}
        </div>

        {/* RIGHT SIDE */}
        <div className="relative flex justify-center lg:justify-end mt-10 lg:0 lg:-top-20">
          {data.heroImage && (
            <div className="bg-[#f26b3a] hidden lg:block rounded-tr-[90px] overflow-hidden p-6 sm:p-10 lg:p-40 relative w-[450px] max-w-sm sm:max-w-lg lg:h-[430px]">
              <Image loading="lazy" src={data.heroImage} alt="Hero" fill className="object-contain" />
            </div>
          )}

          {data.slideBarItems && (
            <div className="lg:mt-6 lg:absolute lg:-left-5 lg:top-5 bg-gradient-to-br from-[#3f3f3f] to-[#5b5b5b] text-white p-8 sm:p-6 sm:py-15 rounded-br-[50px] w-full max-w-xs lg:h-[350px] shadow-xl">
              <h4 className="font-semibold text-sm sm:text-lg lg:absolute lg:top-5">{data.slideBar}</h4>
              <div className="space-y-3 mt-4 lg:mt-10">
                {data.slideBarItems.map((item, i) => (
                  <Link key={i} href={item.route}>
                    <div className="bg-white text-[#f26b3a] px-4 py-1 rounded-md flex justify-between items-center cursor-pointer hover:scale-[1.02] transition text-sm sm:text-base my-2">
                      <span>{item.title}</span>
                      <span className="text-lg">›</span>
                    </div>
                  </Link>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </section>
  );
};

const ContentSection = ({ data }) => {
  if (!data) return null;
  return (
    <div className="lg:text-center text-left mt-16 lg:mt-10 lg:px-20 px-10">
      <span className="text-xl sm:text-2xl lg:text-4xl font-semibold leading-snug block" dangerouslySetInnerHTML={{ __html: data.title }} />
      <span className="text-gray-500 mt-4 max-w-5xl mx-auto text-sm sm:text-base block" dangerouslySetInnerHTML={{ __html: data.subTitle }} />
    </div>
  );
};

const StepsSection = ({ data }) => {
  if (!data) return null;
  return (
    <section className="bg-[#fffaf6] mb-16 lg:mb-20 md:py-10 overflow-hidden relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 grid grid-cols-1 lg:grid-cols-2 gap-10 lg:gap-14 items-center">
        <div className="text-left lg:text-left">
          <div className="lg:absolute lg:top-10 lg:left-40 lg:max-w-xl">
            <span className="text-xl sm:text-3xl lg:text-[33px] font-bold leading-tight block">
              <span className="text-gray-500" dangerouslySetInnerHTML={{ __html: data.title }}></span>
            </span>
            <span className="text-gray-500 block" dangerouslySetInnerHTML={{ __html: data.subtitle }}></span>

            {data.features && (
              <ul className="mt-6 space-y-3 text-gray-600 text-base sm:text-lg max-w-md mx-auto lg:mx-0">
                {data.features.split(/\r?\n/).map(f => f.replace("✔", "").trim()).filter(f => f.length > 0).map((feature, i) => (
                  <li key={i} className="flex gap-3 items-center">
                    <span className="text-[#4caf50] text-xl">✔</span>
                    {feature}
                  </li>
                ))}
              </ul>
            )}
          </div>

          {data.bgImage1 && (
            <div className="relative hidden lg:block w-full max-w-[520px] h-[220px] sm:h-[260px] lg:h-[280px] mx-auto lg:mx-0 top-22">
              <div className="relative w-full aspect-[3/2] overflow-hidden rounded-tr-[70px] left-0 lg:-left-60">
                <Image loading="lazy" src={data.bgImage1} alt="step bg 1" fill className="object-cover" />
              </div>
              {data.bgImage2 && (
                <div className="hidden lg:block relative mt-[-80px] mx-auto w-[260px] h-[180px] sm:w-[300px] sm:h-[210px] lg:w-[300px] lg:h-[250px] lg:-top-50 overflow-hidden rounded-tr-[70px] rounded-bl-[70px] z-10 bg-white">
                  <Image loading="lazy" src={data.bgImage2} alt="step bg 2" fill className="object-cover" />
                </div>
              )}
            </div>
          )}
        </div>

        <div className="grid sm:grid-cols-2 gap-6 relative">
          {data.leftItems?.map((item, i) => (
            <div key={i} className="relative bg-white rounded-3xl p-6 sm:p-8 lg:p-9 flex items-center gap-5 sm:gap-6 shadow-[-8px_-8px_25px_rgba(0,0,0,0.12)] hover:scale-[1.02] transition overflow-hidden">
              <span className="absolute top-0 left-0 bg-gray-600 text-white text-xs px-4 py-2 rounded-br-2xl rounded-tl-3xl">
                Step {item.order}
              </span>
              <div className="flex-1 pr-20 pt-4 lg:pt-2 sm:pr-24 lg:pr-28">
                <h4 className="text-[#f26b3a] font-bold text-base sm:text-xl leading-tight" dangerouslySetInnerHTML={{ __html: item.title }} />
                <p className="text-gray-500 text-xs lg:text-sm mt-1" dangerouslySetInnerHTML={{ __html: item.subTitle }} />
              </div>
              {item.icon && (
                <div className="absolute -right-4 sm:-right-6 lg:-right-7 w-[110px] sm:w-[130px] lg:w-[140px] h-[120px] sm:h-[140px] lg:h-[150px]">
                  <Image loading="lazy" src={item.icon} alt={item.title} fill className="object-contain" />
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

const RequestCallbackSection = ({ data }) => {
  if (!data) return null;
  
  // Form State Logic embedded here for simplicity, or extract if complex
  const [step, setStep] = useState(1);
  const [direction, setDirection] = useState(1);
  const { register, handleSubmit, setValue, watch, formState: { errors, isSubmitting }, reset } = useForm({
    defaultValues: { course: "", country: "", fullName: "", city: "", mobile: "" },
  });
  const course = watch("course");
  const country = watch("country");

  const onSubmit = async (formData) => {
    try {
      await axiosInstance.post("/contactus", {
        fullName: formData.fullName,
        country: formData.country,
        city: formData.city,
        description: "message from service page",
        extraDetails: { course: formData.course }
      });
      alert("Form submitted successfully ✅");
      reset();
      setStep(1);
    } catch (error) {
      alert("Failed to submit form ❌");
    }
  };

  const variants = {
    initial: (dir) => ({ x: dir > 0 ? 80 : -80, opacity: 0 }),
    animate: { x: 0, opacity: 1, transition: { duration: 0.45, ease: "easeInOut" } },
    exit: (dir) => ({ x: dir > 0 ? -80 : 80, opacity: 0, transition: { duration: 0.3 } }),
  };

  const videoId = data.videoUrl?.split("v=")[1]?.split("&")[0] || data.videoUrl?.split("/").pop();
  const embedUrl = videoId ? `https://www.youtube.com/embed/${videoId}?autoplay=1&mute=1&loop=1&playlist=${videoId}` : "";

  return (
    <section className="bg-[#fffaf6] lg:py-16 overflow-hidden">
      <div className="relative mx-auto min-h-[320px] sm:min-h-[420px] lg:min-h-[460px] bg-[url('https://media.istockphoto.com/id/1094302626/photo/hand-raised-for-vote-and-asking-at-conference-seminar-meeting-room.jpg?s=612x612&w=0&k=20&c=r60nXw6xfHRoNPrTiyImBGsXNS5XjtoOQfKYPrIdKe8=')] bg-cover bg-right bg-no-repeat flex items-center px-4 sm:px-6">
        <div className="absolute inset-0 bg-gradient-to-r from-black/30 via-black/40 to-[#636363] z-0" />
        <div className="relative z-10 w-full flex justify-center lg:justify-end">
          <div className="p-[2px] bg-gradient-to-r from-white via-white/20 to-white w-full max-w-full sm:max-w-[600px] lg:max-w-[720px]">
            <div className="bg-[#f26b3a] p-4 sm:p-6 md:p-10 text-white">
              <AnimatePresence mode="wait" custom={direction}>
                <motion.div key={step} custom={direction} variants={variants} initial="initial" animate="animate" exit="exit">
                  {step === 1 && (
                    <>
                      <h2 className="text-lg sm:text-xl md:text-3xl font-semibold mb-4 sm:mb-6">What Is Your Desired Academic Course?</h2>
                      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-2 sm:gap-4">
                        {["UG", "PG", "PHD", "MBBS"].map((item) => (
                          <button key={item} type="button" onClick={() => setValue("course", item, { shouldValidate: true })}
                            className={`w-full border border-white rounded-xl py-2 sm:py-4 text-sm sm:text-lg transition ${course === item ? "bg-white text-[#f26b3a]" : "bg-[#b04f32] hover:bg-white hover:text-[#f26b3a]"}`}>
                            {item}
                          </button>
                        ))}
                      </div>
                      {errors.course && <p className="text-red-300 text-sm mt-2">Please select a course</p>}
                    </>
                  )}
                  {step === 2 && (
                    <>
                      <h2 className="text-lg sm:text-xl md:text-3xl font-semibold mb-4 sm:mb-6">Which country do you want to go to?</h2>
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 sm:gap-4">
                        {["UK", "USA", "Canada", "Australia"].map((item) => (
                          <button key={item} type="button" onClick={() => setValue("country", item, { shouldValidate: true })}
                            className={`w-full border border-white rounded-xl py-2 sm:py-4 text-sm sm:text-base transition ${country === item ? "bg-white text-[#f26b3a]" : "bg-[#b04f32] hover:bg-white hover:text-[#f26b3a]"}`}>
                            {item}
                          </button>
                        ))}
                      </div>
                      {errors.country && <p className="text-red-300 text-sm mt-2">Please select a country</p>}
                    </>
                  )}
                  {step === 3 && (
                    <>
                      <h2 className="text-lg sm:text-xl md:text-3xl font-semibold mb-4 sm:mb-6">Basic Details</h2>
                      <div className="grid grid-cols-1 gap-3 sm:gap-4">
                        <input placeholder="Full Name" {...register("fullName", { required: "Name is required" })} className="w-full px-3 sm:px-4 py-2 sm:py-3 text-sm sm:text-base bg-[#b04f32] rounded-lg border border-white" />
                        {errors.fullName && <p className="text-red-300 text-sm">{errors.fullName.message}</p>}
                        <input placeholder="City" {...register("city", { required: "City is required" })} className="w-full px-3 sm:px-4 py-2 sm:py-3 text-sm sm:text-base bg-[#b04f32] rounded-lg border border-white" />
                        <input placeholder="Mobile" {...register("mobile", { required: "Mobile is required", pattern: { value: /^[0-9]{10}$/, message: "Enter valid 10-digit mobile number" } })} className="w-full px-3 sm:px-4 py-2 sm:py-3 text-sm sm:text-base bg-[#b04f32] rounded-lg border border-white" />
                        {errors.mobile && <p className="text-red-300 text-sm">{errors.mobile.message}</p>}
                      </div>
                    </>
                  )}
                </motion.div>
              </AnimatePresence>

              <div className="flex flex-col sm:flex-row justify-between items-center gap-3 mt-6 sm:mt-10">
                {step > 1 && (
                  <button onClick={() => { setDirection(-1); setStep(step - 1); }} className="w-full sm:w-auto bg-[#b5542e] px-4 sm:px-6 py-2 sm:py-3 rounded-lg text-sm">← Back</button>
                )}
                {step < 3 ? (
                  <button onClick={() => { setDirection(1); setStep(step + 1); }} disabled={(step === 1 && !course) || (step === 2 && !country)}
                    className={`w-full sm:w-auto px-5 sm:px-8 py-2 sm:py-3 rounded-lg text-sm sm:text-base font-semibold transition ${(step === 1 && !course) || (step === 2 && !country) ? "bg-[#b04f32] cursor-not-allowed" : "bg-[#b04f32] hover:bg-[#9a3f28]"}`}>
                    Save & Go Next →
                  </button>
                ) : (
                  <button onClick={handleSubmit(onSubmit)} disabled={isSubmitting} className="w-full sm:w-auto px-5 sm:px-6 py-2 sm:py-3 text-sm sm:text-base bg-white text-[#f26b3a] rounded-xl">
                    {isSubmitting ? "Submitting..." : "Submit"}
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
      
      {/* Video Part of Request Callback if exists */}
      {embedUrl && (
         <div className="max-w-7xl mx-auto relative mt-10 px-4">
            <div className="bg-[#f26b3a] rounded-bl-[80px] lg:rounded-bl-[120px] px-4 sm:px-6 lg:px-8 py-6 sm:py-10 lg:py-14 relative">
              <div className="absolute top-0 right-0 w-24 h-24 sm:w-40 sm:h-40 bg-white/10 rounded-full hidden sm:block" />
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 lg:gap-12 items-center">
                <div className="relative overflow-hidden rounded-bl-[40px] lg:rounded-bl-[70px] lg:-mt-20 lg:ml-10">
                  <iframe className="w-full h-[180px] sm:h-[240px] md:h-[300px] lg:h-[430px] rounded-bl-[40px] lg:rounded-bl-[70px] object-cover" src={embedUrl} title="YouTube video" frameBorder="0" allow="autoplay; encrypted-media" allowFullScreen />
                </div>
                <div className="text-white text-left lg:text-left">
                  <span className="text-lg sm:text-2xl lg:text-3xl font-bold leading-snug mb-2 sm:mb-3 lg:mb-4 lg:ml-10 block" dangerouslySetInnerHTML={{ __html: data.title }} />
                  <span className="text-sm sm:text-base lg:text-lg text-white/90 ml-2 lg:ml-5 block" dangerouslySetInnerHTML={{ __html: data.subtitle }} />
                </div>
              </div>
            </div>
         </div>
      )}
    </section>
  );
};

const ImagesGallerySection = ({ data, galleryType, activeTab, handleTabClick, loading }) => {
  if (!data) return null;
  
  const tabs = [
    { label: "Counseling", value: "counseling" },
    { label: "Test Prep", value: "classroom" },
    { label: "Success Stories", value: "success" },
    { label: "Events", value: "events" },
    { label: "Visa & Loan Assistance", value: "visa" },
    { label: "Our Centres", value: "centres" },
  ];

  return (
    <section className="bg-[#fffaf6] py-6 lg:py-20 px-3 sm:px-4">
      <div className="mx-auto">
        <span className="lg:text-center text-lg sm:text-2xl md:text-4xl font-medium mb-4 sm:mb-6 lg:mb-10 block">
          <span className="text-gray-700" dangerouslySetInnerHTML={{ __html: data.title }} />
        </span>
        <span className="lg:text-center text-xs sm:text-sm text-gray-500 mb-4 sm:mb-6 max-w-4xl lg:mx-auto px-1 block" dangerouslySetInnerHTML={{ __html: data.subTitle }} />

        <div className="flex justify-start sm:justify-center mt-4 sm:mt-8 py-3 sm:py-6 lg:py-10 px-1 sm:px-2">
          <div className="flex items-center gap-1 rounded-full border border-orange-200 bg-white p-1 max-w-full overflow-x-auto whitespace-nowrap scrollbar-hide scroll-smooth sm:flex-wrap sm:justify-center">
            {tabs.map((tab) => {
              const isActive = activeTab === tab.value;
              return (
                <button key={tab.value} onClick={() => handleTabClick(tab.value)} className="relative px-2 py-1.5 sm:px-4 lg:px-5 lg:py-2 text-[11px] sm:text-sm font-medium rounded-full whitespace-nowrap flex-shrink-0">
                  {isActive && <motion.span layoutId="activeTabPill" transition={{ type: "spring", stiffness: 500, damping: 35 }} className="absolute inset-0 rounded-full bg-orange-600" />}
                  <span className={`relative z-10 ${isActive ? "text-white" : "text-orange-600"}`}>{tab.label}</span>
                </button>
              );
            })}
          </div>
        </div>

        <AnimatePresence mode="wait">
          <motion.div key={activeTab} initial={{ x: 60, opacity: 0 }} animate={{ x: 0, opacity: 1 }} exit={{ x: -60, opacity: 0 }} transition={{ duration: 0.45, ease: "easeInOut" }} className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6 lg:gap-10 px-2 sm:px-6 lg:px-10 mx-auto max-w-7xl">
            {loading ? (
              <p className="col-span-full text-center text-gray-500 text-sm">Loading images...</p>
            ) : Array.isArray(galleryType) && galleryType.length > 0 ? (
              <>
                <div className="lg:grid lg:grid-rows-2 gap-3 sm:gap-4">
                  {galleryType[1] && (
                    <div className="overflow-hidden rounded-bl-[40px] lg:rounded-bl-[60px]">
                      <img src={galleryType[1].mediaUrl} alt={galleryType[1].title} loading="lazy" className="w-full h-[140px] sm:h-[200px] lg:h-[240px] object-cover" />
                    </div>
                  )}
                  {galleryType[2] && (
                    <div className="overflow-hidden rounded-tl-[40px] lg:rounded-tl-[60px]">
                      <img src={galleryType[2].mediaUrl} alt={galleryType[2].title} className="w-full h-[140px] sm:h-[200px] lg:h-[240px] object-cover" />
                    </div>
                  )}
                </div>
                {galleryType[0] && (
                  <div className="overflow-hidden rounded-br-[70px] lg:rounded-br-[120px]">
                    <img src={galleryType[0].mediaUrl} alt={galleryType[0].title} className="w-full h-[200px] sm:h-[300px] lg:h-[500px] object-cover" />
                  </div>
                )}
              </>
            ) : (
              <p className="col-span-full text-center text-gray-500 text-sm">No images found</p>
            )}
          </motion.div>
        </AnimatePresence>
      </div>
    </section>
  );
};

const PopularCoursesSection = ({ data }) => {
  if (!data) return null;
  return (
    <section className="bg-[#fffaf6] py-8 lg:py-20 px-3 sm:px-4 relative overflow-hidden">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-6 sm:mb-10 lg:mb-14">
          <div className="text-xl sm:text-2xl md:text-4xl font-medium text-gray-700">
            <span className="text-gray-700" dangerouslySetInnerHTML={{ __html: data.title }} />
          </div>
          <span className="mt-2 sm:mt-4 text-xs sm:text-sm md:text-base text-gray-500 max-w-2xl mx-auto px-1 block" dangerouslySetInnerHTML={{ __html: data.subtitle }} />
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-6 lg:gap-10">
          {["BBA", "MBA", "MCA"].map((course) => (
            <div key={course} className="relative">
              <div className="absolute -bottom-3 -left-[2px] w-[101%] h-40 sm:h-48 lg:h-60 bg-[#f26b3a] rounded-bl-[25px] sm:rounded-bl-[40px] rounded-br-[25px] sm:rounded-br-[40px] z-0" />
              <div className="relative bg-white rounded-[25px] sm:rounded-[40px] rounded-tr-[0px] border border-gray-400 p-4 sm:p-5 lg:p-6 z-10">
                <div>
                  <div className="flex items-center gap-2 sm:gap-3 mb-3 sm:mb-4">
                    <img src="https://cdn-icons-png.flaticon.com/512/3135/3135679.png" alt="icon" className="w-5 h-5 sm:w-6 sm:h-6 lg:w-7 lg:h-7" />
                    <h3 className="text-lg sm:text-2xl lg:text-3xl font-bold text-gray-500">{course}</h3>
                  </div>
                  <p className="text-gray-500 text-xs sm:text-sm lg:text-base font-bold mb-1 sm:mb-2">Countries: UK, USA, Australia +5 more</p>
                  <p className="text-gray-500 text-xs sm:text-sm lg:text-base font-bold mb-4 sm:mb-6">Universities: <span className="text-[#f26b3a] font-bold">1800+</span></p>
                  <div className="space-y-2 sm:space-y-3">
                    <button className="w-full bg-gray-200 text-gray-600 py-2 text-xs sm:text-sm rounded-lg">Check Eligibility</button>
                    <button className="w-full bg-[#fde6dc] text-gray-600 py-2 text-xs sm:text-sm rounded-lg font-medium">Explore Course</button>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

const ScholarshipOffersSection = ({ data, scholarships }) => {
  if (!data) return null;
  return (
    <section className="bg-white overflow-hidden">
      <div className="lg:w-7xl mx-auto py-10">
        <ScholarshipList 
          scholarships={scholarships} 
          title={data.title} 
          subtitle={data.subtitle} 
        />
      </div>
    </section>
  );
};

const EligibilitySectionWrapper = ({ data, pageData }) => {
   if (!data) return null;
   // Assuming EligibilitySection expects the whole pageData structure or specific props
   // Adjust based on your EligibilitySection prop requirements
   return <EligibilitySection pageData={{ sections: { eligibilityCriteria: data } }} tag={data?.tag} />;
};

const ServiceItemsSection = ({ data }) => {
  if (!data) return null;
  return (
    <section className="bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8 sm:py-12">
        <div className="mb-8 sm:mb-12">
          <div className="relative inline-block mb-4 sm:mb-6 block">
            <span className="text-[#F46C44] text-2xl sm:text-3xl block font-medium mr-2" dangerouslySetInnerHTML={{ __html: data?.servicetitle?.split("||")[0]?.trim() || "" }}></span>
            <span className="text-[#123b73] text-lg sm:text-4xl lg:text-4xl font-bold" dangerouslySetInnerHTML={{ __html: data?.servicetitle?.split('||')[1]?.trim() || "" }} />
            <span className="absolute right-0 -bottom-4 w-12 sm:w-16 h-1 bg-[#F46C44]"></span>
          </div>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6 lg:gap-8">
          {(data?.serviceitem || []).map((service, index) => (
            <div key={index} className="bg-gray-200 rounded-lg sm:rounded-xl py-4 px-4 flex items-start gap-3 sm:gap-4 transition">
              <div className="w-10 h-10 sm:w-14 sm:h-14 flex-shrink-0 flex items-center justify-center text-orange-500">
                <DynamicLucideIcon name={`${service?.itemicon}`} size={40} className="sm:w-10 sm:h-10" />
              </div>
              <div className="flex-1 min-w-0">
                <h3 className="font-semibold text-sm sm:text-base lg:text-lg text-gray-900 leading-snug" dangerouslySetInnerHTML={{ __html: service?.itemtitle }} />
                <p className="text-gray-600 text-xs sm:text-sm leading-relaxed" dangerouslySetInnerHTML={{ __html: service?.itemsubtitle }} />
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

const DiscountOffersSection = ({ data }) => {
  if (!data) return null;
  return (
    <section className="py-6 lg:py-16 px-3 sm:px-4 bg-[#fffaf6]">
      <div className="max-w-7xl mx-auto text-left lg:text-center">
        <span className="text-lg sm:text-2xl md:text-4xl font-semibold text-gray-700 block" dangerouslySetInnerHTML={{ __html: data.title }} />
        <span className="mt-2 sm:mt-4 text-xs sm:text-sm md:text-base text-gray-500 max-w-3xl mx-auto block" dangerouslySetInnerHTML={{ __html: data.subtitle }} />
        
        <div className="mt-6 sm:mt-10 lg:mt-12 grid grid-cols-1 md:grid-cols-3 gap-4 sm:gap-6 lg:gap-8">
          {/* Hardcoded cards as per original design, assuming data might drive titles if needed, but structure is static in original */}
          <div className="relative rounded-[20px] sm:rounded-[28px] bg-gradient-to-r from-orange-400 to-orange-300 p-4 sm:p-6 text-white overflow-hidden">
            <h3 className="text-sm sm:text-base font-semibold">Plan Your</h3>
            <h2 className="text-lg sm:text-xl md:text-2xl font-bold text-yellow-300">Study Abroad Journey</h2>
            <p className="mt-1 sm:mt-2 text-xs sm:text-sm">with <span className="font-semibold">US</span> & Get Flat</p>
            <div className="mt-3 sm:mt-4 bg-white text-red-500 inline-block px-3 sm:px-4 py-1.5 sm:py-2 rounded-lg font-bold text-base sm:text-xl">₹ 20,000</div>
            <p className="mt-1 sm:mt-2 font-semibold text-yellow-200 text-sm">CASHBACK</p>
            <img src="/images/travel.png" alt="" className="absolute bottom-0 right-0 w-24 sm:w-32 lg:w-40" />
          </div>
          <div className="relative rounded-[20px] sm:rounded-[28px] bg-gray-200 p-4 sm:p-6 overflow-hidden">
            <span className="bg-red-600 text-white px-3 sm:px-4 py-1 rounded-full text-xs sm:text-sm font-semibold">Get FREE</span>
            <h2 className="mt-3 sm:mt-4 text-xl sm:text-2xl md:text-3xl font-bold text-red-600">IELTS <span className="text-black">CLASSES</span></h2>
            <p className="mt-1 sm:mt-2 text-xs sm:text-sm text-gray-600 line-through">Starting From ₹18,000</p>
            <h1 className="text-3xl sm:text-4xl md:text-5xl font-extrabold text-red-600 mt-1 sm:mt-2">₹ 0*</h1>
            <img src="https://png.pngtree.com/png-vector/20250305/ourmid/pngtree-a-happy-male-student-sporting-backpack-and-clutching-book-is-looking-png-image_15721728.png" alt="" className="absolute right-0 sm:-right-10 lg:-right-14 bottom-0 w-28 sm:w-36 lg:w-50" />
            <p className="absolute bottom-1 sm:bottom-2 left-0 w-full text-center text-[10px] sm:text-[11px] text-gray-600 hidden lg:block">*Terms & Conditions Applied</p>
          </div>
          <div className="relative rounded-[20px] sm:rounded-[28px] bg-gray-400 p-4 sm:p-6 text-white overflow-hidden">
            <h2 className="text-xl sm:text-2xl md:text-3xl font-bold">Avail <span className="text-yellow-300">FREE*</span></h2>
            <p className="text-lg sm:text-xl md:text-2xl font-semibold mt-1 sm:mt-2">FLIGHT <br /> Tickets!!</p>
            <img src="https://static.vecteezy.com/system/resources/thumbnails/022/180/863/small/air-plane-ticket-travel-kit-3d-illustration-png.png" alt="" className="absolute top-6 sm:top-10 -right-0 sm:-right-10 w-32 sm:w-40 lg:w-52" />
            <img src="/images/books.png" alt="" className="absolute bottom-2 sm:bottom-4 right-4 sm:right-6 w-20 sm:w-24 lg:w-28" />
            <p className="absolute bottom-1 sm:bottom-2 left-0 w-full text-center text-[10px] sm:text-[11px] text-gray-200 hidden lg:block">*Terms & Condition Apply</p>
          </div>
        </div>
      </div>
    </section>
  );
};

const ExamsSection = ({ data }) => {
  if (!data) return null;
  const examStyles = {
    IELTS: "bg-[#e21735]", PTE: "bg-[#1f6f94]", TOEFL: "bg-[#047d92]", DUOLINGO: "bg-[#56cb01]", GERMAN: "bg-[#56cb01]", FRENCH: "bg-[#56cb01]",
  };

  return (
    <section className="bg-[#fffaf6] py-12 lg:py-20 relative overflow-hidden">
      <div className="mx-auto max-w-7xl px-4 lg:px-0">
        <div className="text-left lg:text-center mb-10 lg:mb-14">
          <span className="text-xl md:text-4xl font-semibold text-gray-700 block">
            <span className="text-gray-700" dangerouslySetInnerHTML={{ __html: data.title }} />
          </span>
          <span className="mt-3 lg:mt-4 text-gray-500 text-sm md:text-lg block" dangerouslySetInnerHTML={{ __html: data.subtitle }} />
        </div>
        <div>
          {data.items?.reduce((rows, item, index) => {
            if (index % 2 === 0) rows.push([]);
            rows[rows.length - 1].push(item);
            return rows;
          }, []).map((row, rowIndex) => (
            <div key={rowIndex} className={`grid grid-cols-1 md:grid-cols-2 items-center gap-6 lg:gap-10 py-8 lg:py-10 ${rowIndex !== data.items.length - 1 ? "border-b-2 border-gray-400" : ""}`}>
              {row.map((item, i) => {
                const title = item.title.toUpperCase();
                const bgColor = examStyles[title] || "bg-gray-500";
                return (
                  <Link href={item.route} key={i}>
                    <div className="flex items-center gap-4 lg:gap-6">
                      <div className={`h-16 w-24 sm:h-18 sm:w-28 lg:h-20 lg:w-30 flex items-center justify-center pt-4 lg:pt-1 rounded-tr-4xl text-sm lg:text-4xl text-white ${bgColor}`}>
                        {item.image ? <img src={item.image} alt={item.title} className="w-20 h-12 object-contain" /> : title}
                      </div>
                      <div className="flex-block">
                        <p className="text-base lg:text-xl font-medium text-gray-700 ml-0 lg:ml-10">{title}</p>
                        <p className="pl-10 text-gray-500">{item.subtitle}</p>
                      </div>
                    </div>
                  </Link>
                );
              })}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

const VideoTestimonialsWrapper = ({ data, videoRes }) => {
  if (!data) return null;
  return (
    null
    // <VideoTestimonialsSlider
    //   title={data?.title || "Video || Testimonials"}
    //   subtitle={data?.subtitle}
    //   items={videoRes}
    //   tag={data?.tag}
    // />
  );
};

const VisaStoriesWrapper = ({ data, testimonialimg }) => {
  if (!data) return null;
  const filtervisa = testimonialimg?.filter((item) => item.target === "visa") || [];
  console.log(data.title)
  return (
    <StudentVisaStories
      stories={filtervisa}
      title={data?.title}
      subtitle={data?.subtitle}
      tag={data?.tag}
    />
  );
};

const NewsletterSection = () => {
    return (
        <section className="py-6 sm:py-8 lg:py-10 bg-[#FF6B35] relative overflow-visible">
            <div className="container mx-auto px-3 sm:px-6">
                <div className="max-w-4xl mx-auto text-left lg:text-center">
                    <h2 className="text-lg sm:text-2xl lg:text-5xl font-bold text-white mb-2 sm:mb-4">Join Our Exclusive Study Abroad Network</h2>
                    <p className="text-white text-xs sm:text-sm lg:text-lg mb-4 sm:mb-6 lg:mb-8 opacity-90">Get updates on what's happening around in the study abroad space, important notifications on events and journeys of other students</p>
                    <div className="flex flex-col sm:flex-row gap-2 sm:gap-4 mb-6 sm:mb-8 justify-start lg:justify-center">
                        <input type="email" placeholder="Email" className="w-full sm:w-[500px] px-4 sm:px-6 py-2.5 sm:py-3 text-sm sm:text-base rounded-none outline-none text-gray-800 bg-white border border-gray-300" />
                        <button className="w-full sm:w-[200px] px-4 sm:px-6 py-2.5 sm:py-3 text-sm sm:text-base bg-white text-[#FF6B35] rounded-none font-bold hover:bg-gray-100 transition-all whitespace-nowrap">I AM IN</button>
                    </div>
                    <div className="flex justify-start lg:justify-center gap-2 sm:gap-4 mt-4 sm:mt-6">
                        {[Facebook, Instagram, Twitter, Youtube, Send, Linkedin].map((Icon, i) => (
                        <button key={i} className="w-10 h-10 sm:w-12 sm:h-12 lg:w-14 lg:h-14 rounded-full bg-gray-900 flex items-center justify-center text-white hover:bg-black transition-all cursor-pointer" aria-label={Icon.name}>
                            <Icon size={18} className="sm:hidden" />
                            <Icon size={20} className="hidden sm:block lg:hidden" />
                            <Icon size={24} className="hidden lg:block" />
                        </button>
                        ))}
                    </div>
                </div>
            </div>
        </section>
    )
}


// ================= MAIN COMPONENT =================

export default function ServicePage({ serviceData, testimonialimg, galleryData, Faqres, videoRes, scholarshipres }) {
  
  // Local State for Gallery Tabs
  const [activeTab, setActiveTab] = useState("counseling");
  const [galleryType, setgalleryType] = useState(galleryData);
  const [loading, setLoading] = useState(false);

  console.log(serviceData,"ServiceData")

  const getGallery = async (type) => {
    try {
      setLoading(true);
      const res = await axiosInstance.get(`/galleries/public/list?type=${type}`);
      setgalleryType(res.data.data || []);
    } catch (e) {
      setgalleryType([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    getGallery(activeTab);
  }, []);

  const handleTabClick = (tab) => {
    if (tab === activeTab) return;
    setActiveTab(tab);
    getGallery(tab);
  };

  // 1. Prepare Sections: Filter Hidden, Sort by Order
  const sortedSections = useMemo(() => {
    if (!serviceData?.sections) return [];
    
    return Object.values(serviceData.sections)
      .filter(section => section.isHidden !== 'yes') // Filter hidden
      .sort((a, b) => (a.__order__ || 0) - (b.__order__ || 0)); // Sort by order
  }, [serviceData]);

  // 2. Map Original Names to Components
  const sectionComponents = {
    hero: HeroSection,
    content: ContentSection,
    stepsSessions: StepsSection,
    requestCallback: RequestCallbackSection,
    images: (props) => <ImagesGallerySection {...props} galleryType={galleryType} activeTab={activeTab} handleTabClick={handleTabClick} loading={loading} />,
    popularCourses: PopularCoursesSection,
    eligibilityCriteria: EligibilitySectionWrapper,
    studeyDestinations: null, // Add if you have a component for this
    servicesection: ServiceItemsSection,
    stories: null, // Add if you have a component for this
    discountOffers: DiscountOffersSection,
    exams: ExamsSection,
    scholarshipOffers: ScholarshipOffersSection,
    videoTestimonials: VideoTestimonialsWrapper,
    imageTestimonials: null, // Add if you have a component for this
    visastories: VisaStoriesWrapper,
  };

  // 3. Render Loop
  return (
    <>
      {sortedSections.map((section) => {
        // Determine the component key based on original name (handles duplicates)
        const originalName = section.__originalName__;
        const Component = sectionComponents[originalName];

        if (!Component) return null;

        // Pass specific props based on section type
        if (originalName === 'scholarshipOffers') {
            return <Component key={section.__order__} data={section} scholarships={scholarshipres} />;
        }
        if (originalName === 'videoTestimonials') {
            return <Component key={section.__order__} data={section} videoRes={videoRes} />;
        }
        if (originalName === 'visastories') {
            return <Component key={section.__order__} data={section} testimonialimg={testimonialimg} />;
        }
        if (originalName === 'eligibilityCriteria') {
             return <Component key={section.__order__} data={section} pageData={serviceData} />;
        }

        // Default Render
        return <Component key={section.__order__} data={section} />;
      })}

      {/* Static Sections that might not be in CMS or are always at bottom */}
      <NewsletterSection />
      <FAQSection Faqres={Faqres} />
    </>
  );
}