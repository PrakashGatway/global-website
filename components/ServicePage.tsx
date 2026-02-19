"use client"

import Image from "next/image"
import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Facebook, Instagram, Twitter, Youtube, Send, Linkedin } from "lucide-react";
import Link from "next/link";
import { useKeenSlider } from "keen-slider/react";
import axiosInstance from "@/app/axiosInstance";
import { get } from "http";
import { useForm } from "react-hook-form";
import FAQSection from "./faqPage";

export default function ServicePage({ serviceData, testimonialimg, galleryData, Faqres }) {
  const [step, setStep] = useState(1);
  const [direction, setDirection] = useState(1);


  const [activeTab, setActiveTab] = useState("counseling")
  const [galleryType, setgalleryType] = useState(galleryData)
  const [loading, setLoading] = useState(false);



  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { errors, isSubmitting },
    reset,
  } = useForm({
    defaultValues: {
      course: "",
      country: "",
      fullName: "",
      city: "",
      mobile: "",

    },
  });

  const course = watch("course");
  const country = watch("country");


  const onSubmit = async (data) => {
    try {
      await axiosInstance.post("/contactus", {
        fullName: data.fullName,

        country: data.country,
        city: data.city,
        description: "message from service page",
        extraDetails: {
          course: data.course,
        }
      });
      alert("Form submitted successfully ✅");
      reset();
      setStep(1);
    } catch (error) {
      alert("Failed to submit form ❌");
    }
  };




  const getGallery = async (type) => {
    try {
      setLoading(true)
      const res = await axiosInstance.get(`/galleries/public/list?type=${type}`)
      setgalleryType(res.data.data || []);
    }
    catch (e) {
      alert("failed to load gallery")
      setgalleryType([]);
    }
    finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    getGallery(activeTab);
  }, []);

  const handleTabClick = (tab) => {
    if (tab === activeTab) return;
    setActiveTab(tab);
    getGallery(tab);
  };



  const tabs = [
    { label: "Counseling", value: "counseling" },
    { label: "Test Prep", value: "classroom" },
    { label: "Success Stories", value: "success" },
    { label: "Events", value: "events" },
    { label: "Visa & Loan Assistance", value: "visa" },
    { label: "Our Centres", value: "centres" },
  ];



  const variants = {
    initial: (direction) => ({
      x: direction > 0 ? 80 : -80,
      opacity: 0,
    }),
    animate: {
      x: 0,
      opacity: 1,
      transition: {
        duration: 0.45,
        ease: "easeInOut",
      },
    },
    exit: (direction) => ({
      x: direction > 0 ? -80 : 80,
      opacity: 0,
      transition: {
        duration: 0.3,
      },
    }),
  };

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


  const [sliderRef] = useKeenSlider(
    {
      loop: true,
      slides: {
        perView: 2,
        spacing: 16, // Reduced spacing
      },
      breakpoints: {
        "(max-width: 1024px)": {
          slides: {
            perView: 1,
            spacing: 16,
          },
        },
        "(min-width: 1024px)": {
          slides: {
            perView: 2,
            spacing: 16,
          },
        },
      },
    },
    [autoplay]
  );

  const section = serviceData.sections;
  const hero = section.hero;
  const steps = section.stepsSessions;
  const content = section.content;
  const requestCallback = section.requestCallback;
  const images = section.images;
  const popularCourses = section.popularCourses;
  const studyDestinations = section.studeyDestinations;
  const stories = section.stories;
  const discountOffers = section.discountOffers;
  const exams = section.exams;


  const videoId = requestCallback.videoUrl.split("v=")[1]?.split("&")[0]
    || requestCallback.videoUrl.split("/").pop();

  const embedUrl = `https://www.youtube.com/embed/${videoId}?autoplay=1&mute=1&loop=1&playlist=${videoId}`;


  const examStyles = {
    IELTS: "bg-[#e21735]",
    PTE: "bg-[#1f6f94]",
    TOEFL: "bg-[#047d92]",
    DUOLINGO: "bg-[#56cb01]",
    GERMAN: "bg-[#56cb01]",
    FRENCH: "bg-[#56cb01]",
  };



  return (
    <>
      <section className="bg-[#fffaf6] py-12 md:py-20 overflow-hidden relative">
        {/* DECORATIVE ARROWS — DESKTOP ONLY */}
        <div className="absolute -left-30 top-50 -translate-y-1/2 pointer-events-none hidden lg:block lg:w-[250px] opacity-10">
          <div
            style={{
              transform: "rotate(-10deg)",
              filter: "brightness(10) saturate(100%) invert(60%) sepia(0%) saturate(0%) hue-rotate(0deg) brightness(95%) contrast(90%)",
              mixBlendMode: "multiply",
            }}
          >
            <Image
              src="/images/g logo.png"
              alt="Decorative Arrow"
              width={600}
              height={40}
              className="object-contain"
            />
          </div>
        </div>

        <div className="absolute -right-30 bottom-0 -translate-y-1/2 pointer-events-none hidden lg:block lg:w-[250px] opacity-10">
          <div
            style={{
              transform: "rotate(30deg)",
              filter: "brightness(10) saturate(100%) invert(60%) sepia(0%) saturate(0%) hue-rotate(0deg) brightness(95%) contrast(90%)",
              mixBlendMode: "multiply",
            }}
          >
            <Image
              src="/images/g logo.png"
              alt="Decorative Arrow"
              width={600}
              height={40}
              className="object-contain scale-x-[-1]"
            />
          </div>
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 grid grid-cols-1 lg:grid-cols-2 gap-10 lg:gap-12 items-center">
          {/* ================= LEFT CONTENT ================= */}
          <div className="text-center lg:text-left">
            <h1 className="text-2xl sm:text-3xl lg:text-5xl font-bold leading-tight">
              <span className="text-[#f26b3a]">{hero.title.split("||")[0]}</span>
              <span className="text-gray-800 block mt-1">{hero.title.split("||")[1]}</span>
            </h1>

            <p className="text-gray-500 mt-4 sm:mt-5 max-w-lg mx-auto lg:mx-0 text-sm sm:text-base">
              {hero.subtitle}
            </p>

            {/* FEATURES */}
            <div className="bg-white mt-6 sm:mt-8 rounded-tl-xl shadow-[-5px_1px_5px_rgba(0,0,0,0.25)] p-5 sm:p-6 space-y-3 sm:space-y-4 w-full sm:w-fit mx-auto lg:mx-0">
              <div className="flex items-center gap-3 text-gray-700 text-sm sm:text-base">
                <ul className="text-gray-600 text-lg space-y-3">
                  {hero.features
                    .split("\n")
                    .filter(Boolean)
                    .map((d, i) => (
                      <li key={i}>{d.trim()}</li>
                    ))}
                </ul>
              </div>
            </div>

            {/* BUTTON */}
            <Link href={hero.ctaLink1}>
              <button className="mt-6 cursor-pointer sm:mt-8 bg-[#f26b3a] hover:bg-[#e25c2c] transition text-white px-6 sm:px-8 py-3 sm:py-4 rounded-lg font-semibold flex items-center justify-center gap-2 mx-auto lg:mx-0">
                {hero.ctaText1}
                <span className="text-xl">›</span>
              </button>
            </Link>
          </div>

          {/* ================= RIGHT SIDE ================= */}
          <div className="relative  flex justify-center lg:justify-end mt-10 lg:0 lg:-top-20">
            {/* ORANGE CARD */}
            <div
              className="bg-[#f26b3a] hidden lg:block
  rounded-tr-[90px] overflow-hidden
  p-6 sm:p-10 lg:p-40 relative
  w-[450px] max-w-sm sm:max-w-lg lg:h-[430px]"
            >
              <Image
                src={hero.heroImage}
                alt="Study Abroad"
                fill
                className="object-cotain"
              />
            </div>


            {/* FLOATING FORM CARD */}
            <div className="mt-6 lg:absolute lg:-left-5 lg:top-5 bg-gradient-to-br from-[#3f3f3f] to-[#5b5b5b] text-white p-8 sm:p-6 sm:py-15 rounded-br-[50px] w-full max-w-xs lg:h-[350px] shadow-xl">
              <h4 className="font-semibold text-sm sm:text-lg lg:absolute lg:top-5">
                {hero.slideBar}
              </h4>

              <div className="space-y-3 mt-4 lg:mt-10">
                {hero.slideBarItems.map((item, i) => (
                  <Link key={i} href={item.route}>
                    <div className="bg-white text-[#f26b3a] px-4 py-1 rounded-md flex justify-between items-center cursor-pointer hover:scale-[1.02] transition text-sm sm:text-base my-2">
                      <span>{item.title}</span>
                      <span className="text-lg">›</span>
                    </div>
                  </Link>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* ================= BOTTOM TEXT ================= */}
        <div className="lg:text-center mt-16 lg:mt-20 lg:px-20 px-10">
          <h2 className="text-xl sm:text-2xl lg:text-4xl font-semibold leading-snug">
            <span className="text-[#f26b3a]">{content.title.split("||")[0]}</span>
            <span className="text-gray-700">{content.title.split("||")[1]}</span>
            <span className="text-[#f26b3a]">{content.title.split("||")[2]}</span>
          </h2>

          <p className="text-gray-500 mt-4 max-w-5xl mx-auto text-sm sm:text-base">
            {content.subTitle}
          </p>
        </div>
      </section>

      <section className="bg-[#fffaf6] mb-16 lg:mb-20  md:py-10 overflow-hidden relative">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 grid grid-cols-1 lg:grid-cols-2 gap-10 lg:gap-14 items-center">
          {/* ================= LEFT SIDE ================= */}
          <div className="text-center lg:text-left">
            <div className="lg:absolute lg:top-10 lg:left-40 lg:max-w-xl" >
              <h2 className="text-2xl sm:text-3xl lg:text-[33px] font-bold leading-tight">
                <span className="text-gray-500">{steps.title}</span>
                <br />
                <span className="text-gray-500">{steps.subtitle.split("\n")[0]}</span>{" "}
                <span className="text-[#f26b3a]">{steps.subtitle.split("\n")[1].trim()}</span>
              </h2>

              {/* CHECK LIST */}
              <ul className="mt-6 space-y-3 text-gray-600 text-base sm:text-lg max-w-md mx-auto lg:mx-0">
                {steps.features
                  .split(/\r?\n/) // handles \n and \r\n
                  .map(f => f.replace("✔", "").trim())
                  .filter(f => f.length > 0)
                  .map((feature, i) => (
                    <li key={i} className="flex gap-3 items-center">
                      <span className="text-[#4caf50] text-xl">✔</span>
                      {feature}
                    </li>
                  ))}
              </ul>
            </div>





            {/* IMAGE STACK */}
            <div className="relative hidden
      lg:block w-full max-w-[520px] h-[220px] sm:h-[260px] lg:h-[280px] mx-auto lg:mx-0 top-22">
              {/* BACK IMAGE */}
              <div className="relative w-full aspect-[3/2] overflow-hidden rounded-tr-[70px] left-0 lg:-left-60">
                <Image
                  src={steps.bgImage1}
                  alt="meeting"
                  fill
                  className="object-cover"
                />
              </div>

              {/* FRONT IMAGE */}
              <div className="hidden lg:block relative mt-[-80px] mx-auto w-[260px] h-[180px] sm:w-[300px] sm:h-[210px] lg:w-[300px] lg:h-[250px] lg:-top-50  overflow-hidden rounded-tr-[70px] rounded-bl-[70px] z-10 bg-white">
                <Image
                  src={steps.bgImage2}
                  alt="meeting"
                  fill
                  className="object-cover"
                />
              </div>
            </div>
          </div>

          {/* ================= RIGHT SIDE ================= */}
          <div className="grid sm:grid-cols-2 gap-6 relative ">
            {steps.leftItems.map((item, i) => (
              <div
                key={i}
                className="relative bg-white rounded-3xl p-6 sm:p-8 lg:p-9 flex items-center gap-5 sm:gap-6 shadow-[-8px_-8px_25px_rgba(0,0,0,0.12)] hover:scale-[1.02] transition overflow-hidden"
              >
                {/* STEP BADGE */}
                <span className="absolute top-0 left-0 bg-gray-600 text-white text-xs px-4 py-2 rounded-br-2xl rounded-tl-3xl">
                  Step {item.order}
                </span>

                {/* TEXT */}
                <div className="flex-1 pr-20 pt-2 sm:pr-24 lg:pr-28">
                  <h4 className="text-[#f26b3a] font-bold text-lg sm:text-xl leading-tight">
                    {item.title}
                  </h4>
                  <p className="text-gray-500 text-sm mt-1">
                    {item.subTitle}
                  </p>
                </div>

                {/* ICON IMAGE */}
                {item.icon && (
                  <div className="absolute -right-4 sm:-right-6 lg:-right-7 w-[110px] sm:w-[130px] lg:w-[140px] h-[120px] sm:h-[140px] lg:h-[150px]">
                    <Image
                      src={item.icon}
                      alt={item.title}
                      fill
                      className="object-contain"
                    />
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="bg-[#fffaf6] py-12 lg:py-16 overflow-hidden">
        <div className="relative mx-auto min-h-[380px] sm:min-h-[420px] lg:min-h-[460px] bg-[url('https://media.istockphoto.com/id/1094302626/photo/hand-raised-for-vote-and-asking-at-conference-seminar-meeting-room.jpg?s=612x612&w=0&k=20&c=r60nXw6xfHRoNPrTiyImBGsXNS5XjtoOQfKYPrIdKe8=')] bg-cover bg-right bg-no-repeat flex items-center px-4 sm:px-6">
          <div className="absolute inset-0 bg-gradient-to-r from-black/30 via-black/40 to-[#636363] z-0" />

          <div className="relative z-10 w-full flex justify-center lg:justify-end">
            <div className="p-[2px] bg-gradient-to-r from-white/100 via-white/20 to-white/100 w-full max-w-full sm:max-w-[600px] lg:max-w-[720px]">
              <div className="bg-[#f26b3a] p-6 sm:p-8 md:p-10 text-white">
                <AnimatePresence mode="wait" custom={direction}>
                  <motion.div
                    key={step}
                    custom={direction}
                    variants={variants}
                    initial="initial"
                    animate="animate"
                    exit="exit"
                  >
                    {step === 1 && (
                      <>
                        <h2 className="text-xl sm:text-2xl md:text-3xl font-semibold mb-6">
                          What Is Your Desired Academic Course?
                        </h2>

                        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4">
                          {["UG", "PG", "PHD", "MBBS"].map((item) => (
                            <button
                              key={item}
                              type="button"
                              onClick={() => setValue("course", item, { shouldValidate: true })}
                              className={`border border-white rounded-xl rounded-tl-[0px] py-3 sm:py-4 text-base sm:text-lg transition ${course === item
                                  ? "bg-white text-[#f26b3a]"
                                  : "bg-[#b04f32] text-white hover:bg-white hover:text-[#f26b3a]"
                                }`}
                            >
                              {item}
                            </button>
                          ))}
                        </div>

                        {errors.course && (
                          <p className="text-red-300 mt-2">Please select a course</p>
                        )}
                      </>
                    )}


                    {step === 2 && (
                      <>
                        <h2 className="text-xl sm:text-2xl md:text-3xl font-semibold mb-6">
                          Which country do you want to go to?
                        </h2>

                        <div className="grid grid-cols-2 gap-3 sm:gap-4">
                          {["UK", "USA", "Canada", "Australia"].map((item) => (
                            <button
                              key={item}
                              type="button"
                              onClick={() => setValue("country", item, { shouldValidate: true })}
                              className={`border border-white rounded-xl py-3 sm:py-4 transition ${country === item
                                  ? "bg-white text-[#f26b3a]"
                                  : "bg-[#b04f32] text-white hover:bg-white hover:text-[#f26b3a]"
                                }`}
                            >
                              {item}
                            </button>
                          ))}
                        </div>

                        {errors.country && (
                          <p className="text-red-300 mt-2">Please select a country</p>
                        )}
                      </>
                    )}


                    {step === 3 && (
                      <>
                        <h2 className="text-xl sm:text-2xl md:text-3xl font-semibold mb-6">
                          Basic Details
                        </h2>

                        <div className="space-y-4">
                          <input
                            placeholder="Full Name"
                            {...register("fullName", { required: "Name is required" })}
                            className="w-full px-4 py-3 bg-[#b04f32] rounded-lg text-white border border-white"
                          />
                          {errors.name && <p className="text-red-300">{errors.name.message}</p>}

                          <input
                            placeholder="City"
                            {...register("city", { required: "City is required" })}
                            className="w-full bg-[#b04f32] border border-white px-4 py-3 rounded-lg text-white"
                          />

                          <input
                            placeholder="Mobile"
                            {...register("mobile", {
                              required: "Mobile is required",
                              pattern: {
                                value: /^[0-9]{10}$/,
                                message: "Enter valid 10-digit mobile number",
                              },
                            })}
                            className="w-full bg-[#b04f32] border border-white px-4 py-3 rounded-lg text-white"
                          />
                          {errors.mobile && <p className="text-red-300">{errors.mobile.message}</p>}
                        </div>
                      </>
                    )}

                  </motion.div>
                </AnimatePresence>

                {/* ================= BUTTONS ================= */}
                <div className="flex justify-between mt-8 sm:mt-10">
                  {step > 1 && (
                    <button
                      onClick={() => {
                        setDirection(-1);
                        setStep(step - 1);
                      }}
                      className="bg-[#b5542e] px-5 sm:px-6 py-3 rounded-lg text-sm sm:text-base"
                    >
                      ← Back
                    </button>
                  )}

                  {step < 3 ? (
                    <button
                      onClick={() => {
                        setDirection(1);
                        setStep(step + 1);
                      }}
                      disabled={(step === 1 && !course) || (step === 2 && !country)}
                      className={`px-6 sm:px-8 py-3 rounded-lg font-semibold mx-auto transition ${(step === 1 && !course) || (step === 2 && !country)
                        ? "bg-[#b04f32] cursor-not-allowed"
                        : "bg-[#b04f32] text-white hover:bg-[#9a3f28]"
                        }`}
                    >
                      Save & Go Next →
                    </button>
                  ) : (
                    <button
                      onClick={handleSubmit(onSubmit)}
                      disabled={isSubmitting}
                      className="mt-6 px-6 py-3 bg-white text-[#f26b3a] rounded-xl"
                    >
                      {isSubmitting ? "Submitting..." : "Submit"}
                    </button>

                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="bg-[#fffaf6] py-16 lg:py-35 px-4 relative overflow-hidden">
        <div className="absolute -right-10 top-52 -translate-y-1/2 pointer-events-none hidden lg:block lg:w-[450px] opacity-10 z-1">
          <div style={{ transform: "rotate(-40deg)", filter: "brightness(20) saturate(100%) invert(60%) sepia(0%) saturate(0%) hue-rotate(0deg) brightness(100%) contrast(90%)", mixBlendMode: "multiply" }}>
            <Image src="/images/g logo.png" alt="Decorative Arrow" width={600} height={40} className="object-contain scale-x-[-1]" />
          </div>
        </div>

        <div className="max-w-7xl mx-auto relative">
          <div className="bg-[#f26b3a] rounded-bl-[120px] px-4 sm:px-6 lg:px-8 py-10 sm:py-12 lg:py-15 relative">
            <div className="absolute top-0 right-0 w-40 h-40 bg-white/10 rounded-full hidden sm:block" />
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12 items-center">
              <div className="relative overflow-hidden rounded-bl-[70px] left-0 top-0 lg:-top-30 lg:left-10">
                <iframe
                  className="w-full h-[220px] sm:h-[260px] md:h-[320px] lg:h-[430px] rounded-bl-[70px] object-cover"
                  src={embedUrl}
                  title="YouTube video"
                  frameBorder="0"
                  allow="autoplay; encrypted-media"
                  allowFullScreen
                />
              </div>
              <div className="text-white text-center lg:text-center">
                <h2 className="text-2xl sm:text-3xl lg:text-3xl font-bold leading-snug mb-3 lg:mb-4 ml-0 lg:ml-10">
                  {requestCallback.title}
                </h2>
                <p className="text-lg sm:text-xl lg:text-lg ml-0 lg:ml-5 text-white/90">
                  {requestCallback.subtitle}
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="bg-[#fffaf6] py-12 lg:py-20">
        <div className="mx-auto">
          <h2 className="text-center text-2xl sm:text-3xl md:text-4xl font-medium mb-8 lg:mb-10 px-4">
            <span className="text-gray-700">{images.title.split("||")[0]}</span>{" "}
            <span className="text-[#f26b3a]">{images.title.split("||")[1]}</span>
          </h2>
          <p className="text-center text-gray-500 mb-6 max-w-4xl mx-auto">{images.subTitle}</p>

          <div className="flex justify-center mt-8 py-10">
            <div className="flex items-center gap-1 rounded-full border border-orange-200 bg-white p-1">
              {tabs.map((tab) => {
                const isActive = activeTab === tab.value;


                return (
                  <button
                    key={tab.value}
                    onClick={() => handleTabClick(tab.value)}
                    className="relative px-5 py-2 text-sm font-medium rounded-full"
                  >
                    {/* SLIDING ACTIVE PILL */}
                    {isActive && (
                      <motion.span
                        layoutId="activeTabPill"
                        transition={{
                          type: "spring",
                          stiffness: 500,
                          damping: 35,
                        }}
                        className="absolute inset-0 rounded-full bg-orange-600"
                      />
                    )}

                    {/* LABEL */}
                    <span
                      className={`relative z-10 transition-colors ${isActive ? "text-white" : "text-orange-600"
                        }`}
                    >
                      {tab.label}
                    </span>
                  </button>
                )
              })}
            </div>
          </div>



          <AnimatePresence mode="wait">
            <motion.div
              key={activeTab} // 🔥 THIS IS THE MAGIC
              initial={{ x: 60, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              exit={{ x: -60, opacity: 0 }}
              transition={{ duration: 0.45, ease: "easeInOut" }}
              className="grid grid-cols-1 lg:grid-cols-2 gap-6 lg:gap-10 px-4 sm:px-8 lg:px-10 mx-auto max-w-7xl"
            >

              {loading ? (
                <p className="col-span-full text-center text-gray-500">
                  Loading images...
                </p>
              ) : Array.isArray(galleryType) && galleryType.length > 0 ? (
                <>
                  {/* LEFT: 2 SMALL IMAGES */}
                  <div className="grid grid-rows-2 gap-4">
                    {galleryType[1] && (
                      <div className="overflow-hidden rounded-bl-[60px]">
                        <img
                          src={galleryType[1].mediaUrl}
                          alt={galleryType[1].title}
                          loading="lazy"
                          className="w-full h-[180px] sm:h-[220px] lg:h-[240px] object-cover"
                        />
                      </div>
                    )}

                    {galleryType[2] && (
                      <div className="overflow-hidden rounded-tl-[60px]">
                        <img
                          src={galleryType[2].mediaUrl}
                          alt={galleryType[2].title}
                          className="w-full h-[180px] sm:h-[220px] lg:h-[240px] object-cover"
                        />
                      </div>
                    )}
                  </div>

                  {/* RIGHT: BIG IMAGE */}
                  {galleryType[0] && (
                    <div className="overflow-hidden rounded-br-[120px]">
                      <img
                        src={galleryType[0].mediaUrl}
                        alt={galleryType[0].title}
                        className="w-full h-[260px] sm:h-[360px] lg:h-[500px] object-cover"
                      />
                    </div>
                  )}
                </>
              ) : (
                <p className="col-span-full text-center text-gray-500">
                  No images found
                </p>
              )}
            </motion.div>
          </AnimatePresence>


        </div>
      </section>

      <section className="bg-[#fffaf6] py-20 px-4 relative overflow-hidden">
        <div className="absolute top-50 -left-15 w-[400px] h-[400px] -translate-y-1/2 z-10 pointer-events-none -rotate-150" style={{ transform: 'rotate(-70deg)', mixBlendMode: 'multiply' }}>
          <Image src="/images/g logo.png" alt="arrow" fill className="object-contain rotate-[-15deg] scale-x-[-1] opacity-10" />
        </div>
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-14">
            <h2 className="text-3xl md:text-4xl font-medium text-gray-700">
              <span className="text-gray-700">{popularCourses.title.split("||")[0]}</span>{" "}
              <span className="text-[#f26b3a]">{popularCourses.title.split("||")[1]}</span>
            </h2>
            <p className="mt-4 text-gray-500 max-w-2xl mx-auto">{popularCourses.subtitle}</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
            {["BBA", "MBA", "MCA"].map((course) => (
              <div key={course} className="relative">
                <div className="absolute -bottom-4 -left-[2px] w-[101%] h-60 bg-[#f26b3a] rounded-bl-[40px] rounded-br-[40px] z-0" />
                <div className="relative bg-white rounded-[40px] rounded-tr-[0px] border border-gray-400 p-6 z-10">
                  <div>
                    <div className="flex items-center gap-3 mb-4">
                      <img src="https://cdn-icons-png.flaticon.com/512/3135/3135679.png" alt="icon" className="w-7 h-7" />
                      <h3 className="text-3xl font-bold text-gray-500">{course}</h3>
                    </div>
                    <p className="text-gray-500 text-base font-bold mb-2">Countries: UK, USA, Australia +5 more</p>
                    <p className="text-gray-500 text-base font-bold mb-6">Universities: <span className="text-[#f26b3a] font-bold">1800+</span></p>
                    <div className="space-y-3">
                      <button className="w-full bg-gray-200 text-gray-600 py-2 rounded-lg">Check Eligibility</button>
                      <button className="w-full bg-[#fde6dc] text-gray-600 py-2 rounded-lg font-medium">Explore Course</button>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="bg-[#fffaf6] py-20 lg:py-10 overflow-hidden">
        <div className="text-center max-w-5xl mx-auto px-4">
          <h2 className="text-2xl sm:text-3xl md:text-4xl font-medium text-gray-700">
            <span className="text-gray-700">{studyDestinations.title.split("||")[0]}</span>{" "}
            <span className="text-[#f26b3a]">{studyDestinations.title.split("||")[1]}</span>
          </h2>
          <p className="text-gray-500 mt-4 text-sm md:text-base">{studyDestinations.subtitle}</p>
        </div>

        <div className="bg-[#f26b3a] mt-8 lg:mt-10">
          <div className="max-w-7xl mx-auto flex flex-wrap justify-center gap-4 lg:gap-8 text-white py-4 text-sm md:text-base px-4">
            {["Medical", "Engineering", "Business", "MBA", "Others"].map((tab) => (
              <button key={tab} className="hover:underline whitespace-nowrap">{tab}</button>
            ))}
          </div>
        </div>

        <div className="relative mx-auto mt-12 lg:mt-16 px-4 overflow-hidden">
          <div className="hidden lg:block absolute -right-20 top-52 -translate-y-1/2 pointer-events-none lg:w-[400px] opacity-10 z-111">
            <div style={{ transform: "rotate(30deg)", filter: "brightness(0) saturate(100%) invert(60%) sepia(0%) saturate(0%) hue-rotate(0deg) brightness(95%) contrast(90%)", mixBlendMode: "multiply" }}>
              <Image src="/images/g logo.png" alt="Decorative Arrow" width={600} height={40} className="object-contain scale-x-[-1]" />
            </div>
          </div>

          <div className="absolute left-0 top-0 w-full h-[280px] sm:h-[360px] md:h-[450px] bg-[#f2f2f2] rounded-tr-[120px] overflow-hidden z-0 lg:-left-31 lg:w-[55%] lg:h-[620px] lg:rounded-tr-[160px]">
            <img src="https://www.hdwallpapers.in/download/black_and_white_image_of_colosseum_piazza_del_colosseo_rome_italy_hd_travel-HD.jpg" alt="Italy" className="absolute inset-0 w-full h-full object-cover grayscale" />
            <div className="hidden lg:grid absolute top-8 right-40 grid-cols-2 gap-3 p-3">
              {[1, 2, 3, 4].map((i) => (
                <img key={i} src="https://www.shutterstock.com/shutterstock/photos/2098674772/display_1500/stock-vector-university-logo-college-school-logo-crests-and-emblems-2098674772.jpg" className="w-46 h-20 border border-gray-500" />
              ))}
            </div>
          </div>

          <div className="relative z-10 grid lg:grid-cols-2 gap-10 items-center">
            <div />
            <div className="relative mt-10 lg:top-40 lg:right-40 flex justify-center lg:block">
              <div className="bg-white rounded-tr-[70px] py-5 px-8 sm:px-16 lg:py-25 shadow-[-12px_-1px_10px_rgba(0,0,0,0.25)] relative max-w-lg">
                <div className="absolute -top-1 right-0 w-30 h-30 border-t-7 border-r-8 border-[#f26b3a] rounded-tr-[70px]" />
                <div className="flex items-center gap-3 justify-center lg:justify-start">
                  <img src="https://flagcdn.com/w40/it.png" alt="Italy" className="w-10 lg:w-15" />
                  <h3 className="text-4xl sm:text-5xl lg:text-[70px] font-semibold text-gray-700">ITALY</h3>
                </div>
                <p className="text-[#f26b3a] text-xl sm:text-2xl lg:text-3xl mt-2 font-medium text-center lg:text-left lg:ml-30 lg:w-140">100+ Universities</p>
                <button className="mt-6 lg:mt-0 w-10 h-10 rounded-full border border-gray-300 flex items-center justify-center lg:absolute lg:right-5 lg:bottom-5">↑</button>
              </div>
            </div>
          </div>

          <div className="text-center lg:mt-80">
            <p className="text-gray-500 text-base lg:text-lg mb-4">Check whether you are eligible for dream university</p>
            <button className="bg-[#f26b3a] text-white text-lg sm:text-xl lg:text-2xl px-10 sm:px-12 lg:px-15 py-4 lg:py-5 rounded-full">Check My Eligibility</button>
          </div>
        </div>
      </section>

      <section className="bg-[#fffaf6] py-12 lg:py-20 px-4 overflow-hidden relative">
        <div className="hidden lg:block absolute top-60 left-0 w-[400px] h-[400px] -translate-y-1/2 z-10 pointer-events-none -rotate-150" style={{ transform: "rotate(30deg)", filter: "brightness(0) saturate(100%) invert(60%) sepia(0%) saturate(0%) hue-rotate(0deg) brightness(95%) contrast(90%)", mixBlendMode: "multiply" }}>
          <Image src="/images/g logo.png" alt="arrow" fill className="object-contain rotate-[-15deg] scale-x-[-1] opacity-10" />
        </div>

        <div className="max-w-7xl mx-auto grid lg:grid-cols-2 gap-10 lg:gap-14 items-center">
          <div className="text-center lg:text-left">
            <h2 className="text-2xl sm:text-3xl md:text-4xl font-medium text-gray-700 leading-snug">
              {stories.title.split("||")[0]}
              <br />
              <span className="text-[#f26b3a] font-semibold">{stories.title.split("||")[1]}</span>
            </h2>
            <p className="text-gray-500 mt-4 max-w-xl mx-auto lg:mx-0">{stories.subtitle}</p>
            <ul className="mt-6 space-y-3 text-gray-600 max-w-xl mx-auto lg:mx-0">
              {stories.features.split(",").map((feature, i) => (
                <li key={i} className="flex items-start gap-3">

                  {feature.trim()}
                </li>
              ))}
            </ul>
            <button className="mt-8 px-8 py-3 border border-[#f26b3a] rounded-full text-[#f26b3a] font-medium hover:bg-[#f26b3a] hover:text-white transition">Start Your Journey →</button>
          </div>

          {/* SLIDER SECTION - UPDATED */}
          <div className="relative w-full py-4 ">
            <div
              ref={sliderRef}
              className="keen-slider"
            >
              {testimonialimg.map((item) => (
                <div
                  key={item._id}
                  className="keen-slider__slide py-3"
                >
                  <div className="bg-orange-500 inset-0 w-[150px] h-[30%] absolute -left-0  rounded-tl-[80px] top-1" />
                  <div className="relative w-full h-[440px] sm:h-[480px] rounded-tl-[80px]  overflow-hidden bg-[#8f8f8f] mx-2">

                    {/* Name with light black gradient background */}
                    <div className="absolute top-0 left-0 right-0 h-24 z-30 bg-gradient-to-b from-black/70 to-transparent rounded-tl-[80px]">
                      <p className="absolute top-14 left-0 w-full text-center text-white font-semibold text-lg z-30">
                        {item.name}
                      </p>
                    </div>

                    {/* Image */}
                    <img
                      src={item.image}
                      alt={item.name}
                      className="absolute left-1/2 -translate-x-1/2 h-full w-auto object-cover z-10 scale-[1.15] inset-0"
                    />

                    {/* Dark overlay for better text visibility */}
                    <div className="absolute inset-0 bg-gradient-to-t from-black/20 via-transparent to-transparent z-20" />

                    {/* Play button */}
                    <div className="absolute inset-0 flex items-center justify-center z-40">
                      <div className="bg-red-600 w-12 h-12 rounded-lg flex items-center justify-center shadow-lg">
                        <span className="text-white text-xl">▶</span>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      <section className="py-16 px-4 bg-[#fffaf6]">
        <div className="max-w-7xl mx-auto text-center">
          <h2 className="text-2xl md:text-4xl font-semibold text-gray-700">
            <span className="text-gray-700">{discountOffers.title.split("||")[0]}</span>{" "}
            <span className="text-orange-500">{discountOffers.title.split("||")[1]}</span>{" "}
            <span className="text-gray-700">{discountOffers.title.split("||")[2]}</span>
          </h2>
          <p className="mt-4 text-gray-500 max-w-3xl mx-auto text-sm md:text-base">{discountOffers.subtitle}</p>

          <div className="mt-12 grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="relative rounded-[28px] bg-gradient-to-r from-orange-400 to-orange-300 p-6 text-white overflow-hidden">
              <h3 className="text-lg font-semibold">Plan Your</h3>
              <h2 className="text-2xl font-bold text-yellow-300">Study Abroad Journey</h2>
              <p className="mt-2 text-sm">with <span className="font-semibold">US</span> & Get Flat</p>
              <div className="mt-4 bg-white text-red-500 inline-block px-4 py-2 rounded-lg font-bold text-xl">₹ 20,000</div>
              <p className="mt-2 font-semibold text-yellow-200">CASHBACK</p>
              <img src="/images/travel.png" alt="" className="absolute bottom-0 right-0 w-40" />
            </div>

            <div className="relative rounded-[28px] bg-gray-200 p-6 overflow-hidden">
              <span className="bg-red-600 text-white px-4 py-1 rounded-full text-sm font-semibold">Get FREE</span>
              <h2 className="mt-4 text-3xl font-bold text-red-600">IELTS <span className="text-black">CLASSES</span></h2>
              <p className="mt-2 text-sm text-gray-600 line-through">Starting From ₹18,000</p>
              <h1 className="text-5xl font-extrabold text-red-600 mt-2">₹ 0*</h1>
              <img src="https://png.pngtree.com/png-vector/20250305/ourmid/pngtree-a-happy-male-student-sporting-backpack-and-clutching-book-is-looking-png-image_15721728.png" alt="" className="absolute -right-14 bottom-0 w-50" />
              <p className="absolute bottom-2 left-0 w-full text-center text-[11px] text-gray-600">*Terms & Conditions Applied</p>
            </div>

            <div className="relative rounded-[28px] bg-gray-400 p-6 text-white overflow-hidden">
              <h2 className="text-3xl font-bold">Avail <span className="text-yellow-300">FREE*</span></h2>
              <p className="text-2xl font-semibold mt-2">FLIGHT <br /> Tickets!!</p>
              <img src="https://static.vecteezy.com/system/resources/thumbnails/022/180/863/small/air-plane-ticket-travel-kit-3d-illustration-png.png" alt="" className="absolute top-10 -right-10 w-52" />
              <img src="/images/books.png" alt="" className="absolute bottom-4 right-6 w-28" />
              <p className="absolute bottom-2 left-0 w-full text-center text-[11px] text-gray-200">*Terms & Condition Apply</p>
            </div>
          </div>
        </div>
      </section>

      <section className="bg-[#fffaf6] py-12 lg:py-20 relative overflow-hidden">
        <div className="absolute right-0 top-82 -translate-y-1/2 pointer-events-none hidden lg:block lg:w-[350px] opacity-10">
          <div style={{ transform: "rotate(-130deg)", mixBlendMode: "multiply" }}>
            <Image src="/images/g logo.png" alt="Decorative Arrow" width={600} height={40} className="object-contain" />
          </div>
        </div>

        <div className="mx-auto max-w-7xl px-4 lg:px-0">
          <div className="text-center mb-10 lg:mb-14">
            <h2 className="text-2xl md:text-4xl font-semibold text-gray-700">
              <span className="text-gray-700">{exams.title.split("to Enter")[0]}</span>{" "}
              <span className="text-orange-500">to Enter Your Dream Nation</span>
            </h2>
            <p className="mt-3 lg:mt-4 text-gray-500 text-sm md:text-lg">{exams.subtitle}</p>
          </div>

          <div>
            {exams.items
              .reduce((rows, item, index) => {
                if (index % 2 === 0) rows.push([]);
                rows[rows.length - 1].push(item);
                return rows;
              }, [])
              .map((row, rowIndex) => (
                <div
                  key={rowIndex}
                  className={`grid grid-cols-1 md:grid-cols-2 items-center gap-6 lg:gap-10 py-8 lg:py-10 ${rowIndex !== exams.items.length - 1 ? "border-b-2 border-gray-400" : ""
                    }`}
                >
                  {row.map((item, i) => {
                    const title = item.title.toUpperCase();
                    const bgColor = examStyles[title] || "bg-gray-500";

                    return (

                      <Link href={item.route} >
                        <div key={i} className="flex items-center gap-4 lg:gap-6">
                          {/* LEFT BOX */}
                          <div
                            className={`h-16 w-24 sm:h-18 sm:w-28 lg:h-20 lg:w-30 flex items-center justify-center pt-4 lg:pt-1 rounded-tr-4xl text-3xl lg:text-4xl text-white ${bgColor}`}
                          >
                            {item.image ? (
                              <img
                                src={item.image}
                                alt={item.title}
                                className="w-20 h-12 object-contain"
                              />
                            ) : (
                              title
                            )}
                          </div>

                          {/* TEXT */}

                          <div className="flex-block" >
                            <p className="text-lg lg:text-xl font-medium text-gray-700 ml-0 lg:ml-10">
                              {title}
                            </p>
                            <p className="pl-10 text-gray-500" >{item.subtitle}</p>

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

      <section className="py-10 bg-[#FF6B35] relative overflow-visible">
        <div className="absolute -left-40 top-62 -translate-y-1/2 opacity-30 pointer-events-none hidden lg:block lg:w-[500px]">
          <div style={{ transform: 'rotate(-20deg)', filter: 'brightness(10)', mixBlendMode: 'multiply' }}>
            <Image src="/images/g logo.png" alt="Decorative Arrow" width={600} height={40} className="mix-blend-multiply object-contain" />
          </div>
        </div>
        <div className="container mx-auto px-6">
          <div className="max-w-4xl mx-auto text-center">
            <h2 className="text-3xl lg:text-5xl font-bold text-white mb-4">Join Our Exclusive Study Abroad Network</h2>
            <p className="text-white text-lg mb-8 opacity-90">Get updates on what&apos;s happening around in the study abroad space, important notifications on events and journeys of other students</p>
            <div className="flex flex-col sm:flex-row gap-4 mb-8 justify-center">
              <input type="email" placeholder="Email" className="w-full sm:w-[500px] px-6 py-3 rounded-none outline-none text-gray-800 bg-white border border-gray-300" />
              <button className="bg-white text-[#FF6B35] w-full sm:w-[200px] px-6 py-3 rounded-none font-bold hover:bg-gray-100 transition-all whitespace-nowrap">I AM IN</button>
            </div>
            <div className="flex justify-center gap-4 mt-6">
              {[Facebook, Instagram, Twitter, Youtube, Send, Linkedin].map((Icon, i) => (
                <button key={i} className="w-14 h-14 rounded-full bg-gray-900 flex items-center justify-center text-white hover:bg-black transition-all cursor-pointer" aria-label={Icon.name}>
                  <Icon size={24} />
                </button>
              ))}
            </div>
          </div>
        </div>
      </section>

      <FAQSection Faqres={Faqres} />
    </>
  )
}